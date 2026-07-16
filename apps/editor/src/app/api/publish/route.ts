import { NextRequest, NextResponse } from "next/server";
import { getPendingChanges, publish } from "@/lib/git";
import { handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const changed = await getPendingChanges();
    return NextResponse.json({ changed });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message =
      typeof body.message === "string" && body.message.trim()
        ? body.message.trim().slice(0, 200)
        : `Update task data (${new Date().toISOString()})`;
    const result = await publish(message);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
