import { NextRequest, NextResponse } from "next/server";
import { createLink, listLinks } from "@/lib/data-store";
import { handleApiError } from "@/lib/api-response";

export async function GET() {
  return NextResponse.json(listLinks());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const link = createLink(body);
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
