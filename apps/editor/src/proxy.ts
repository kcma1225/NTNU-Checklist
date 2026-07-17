import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// Next's Proxy convention (formerly "middleware") always runs on the Node.js runtime, so
// node:crypto's timingSafeEqual is available here — a real constant-time comparison for
// the password check, rather than a hand-rolled approximation.
function safeEqual(a: string, b: string): boolean {
  const aBytes = Buffer.from(a);
  const bBytes = Buffer.from(b);
  if (aBytes.length !== bBytes.length) return false;
  return timingSafeEqual(aBytes, bBytes);
}

function unauthorized(message: string, status = 401): NextResponse {
  return new NextResponse(message, {
    status,
    headers: status === 401 ? { "WWW-Authenticate": 'Basic realm="NTNU Guide Editor"' } : {},
  });
}

export function proxy(req: NextRequest): NextResponse {
  const expectedUser = process.env.EDITOR_USERNAME;
  const expectedPass = process.env.EDITOR_PASSWORD;

  // Fail closed: if credentials aren't configured, refuse everything rather than silently
  // serving the editor with no auth at all.
  if (!expectedUser || !expectedPass) {
    return unauthorized(
      "EDITOR_USERNAME and EDITOR_PASSWORD must both be set before this app can run.",
      500,
    );
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice("Basic ".length));
      const sep = decoded.indexOf(":");
      if (sep !== -1) {
        const suppliedUser = decoded.slice(0, sep);
        const suppliedPass = decoded.slice(sep + 1);
        if (safeEqual(suppliedUser, expectedUser) && safeEqual(suppliedPass, expectedPass)) {
          return NextResponse.next();
        }
      }
    } catch {
      // Malformed base64 — fall through to 401 below.
    }
  }

  return unauthorized("Authentication required.");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)"],
};
