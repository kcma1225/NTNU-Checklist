import "server-only";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
// Deep import: touches node:fs, see the note in packages/shared/src/index.ts.
import { resolveDataDir } from "@ntnu-guide/shared/src/lib/data-paths";

const execFileAsync = promisify(execFile);

// data/ always lives directly under the repo root, one level above whatever
// resolveDataDir() resolved (apps/<name>/../../data).
const repoRoot = path.resolve(resolveDataDir(), "..");

export class GitError extends Error {}

async function git(args: string[]): Promise<string> {
  if (!existsSync(path.join(repoRoot, ".git"))) {
    throw new GitError(`${repoRoot} is not a git repository — did you run \`git init\`?`);
  }
  try {
    const { stdout } = await execFileAsync("git", args, {
      cwd: repoRoot,
      timeout: 30_000,
      // Without a tty, `git push` can otherwise hang forever waiting for an SSH host-key
      // confirmation or an HTTPS credential prompt no one can answer. Forcing both off
      // makes those cases fail immediately with a real error instead of hanging.
      env: {
        ...process.env,
        GIT_TERMINAL_PROMPT: "0",
        GIT_SSH_COMMAND: `${process.env.GIT_SSH_COMMAND ?? "ssh"} -o BatchMode=yes`,
      },
    });
    return stdout;
  } catch (error) {
    const stderr = error instanceof Error && "stderr" in error ? String((error as { stderr: unknown }).stderr) : "";
    const timedOut = error instanceof Error && "killed" in error && (error as { killed?: boolean }).killed;
    throw new GitError(
      stderr.trim() ||
        (timedOut ? "git command timed out after 30s — likely stuck on an auth/host-key prompt" : undefined) ||
        (error instanceof Error ? error.message : "git command failed"),
    );
  }
}

/** Files under data/ with uncommitted changes, e.g. [" M data/tasks.json"]. */
export async function getPendingChanges(): Promise<string[]> {
  const stdout = await git(["status", "--porcelain", "--", "data"]);
  return stdout.split("\n").map((line) => line.trim()).filter(Boolean);
}

/**
 * Stages, commits, and pushes ONLY data/ — never `-A` or `-a` — so nothing else that
 * might be sitting uncommitted in the repo on the VM gets swept in. Does not attempt to
 * auto-resolve a failed push (e.g. non-fast-forward): it surfaces the real git error and
 * stops, since silently pulling/rebasing/merging from a web button risks the kind of data
 * loss this whole tool exists to avoid.
 */
export async function publish(message: string): Promise<{ commit: string }> {
  const pending = await getPendingChanges();
  if (pending.length === 0) {
    throw new GitError("沒有待發布的變更");
  }
  await git(["add", "--", "data"]);
  await git(["commit", "-m", message]);
  await git(["push"]);
  const commit = await git(["rev-parse", "--short", "HEAD"]);
  return { commit: commit.trim() };
}
