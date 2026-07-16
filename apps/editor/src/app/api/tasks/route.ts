import { NextRequest, NextResponse } from "next/server";
import { createTask, listTasks } from "@/lib/data-store";
import { handleApiError } from "@/lib/api-response";

export async function GET() {
  return NextResponse.json(listTasks());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = createTask(body);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
