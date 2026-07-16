import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ConflictError, NotFoundError } from "@/lib/data-store";
import { GitError } from "@/lib/git";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof ConflictError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "驗證失敗", issues: error.issues }, { status: 400 });
  }
  if (error instanceof GitError) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }
  console.error(error);
  return NextResponse.json({ error: "Internal error" }, { status: 500 });
}
