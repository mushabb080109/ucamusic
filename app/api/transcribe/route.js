import { NextResponse } from "next/server";
import { getTranscribe } from "@/lib/yt/transcribe";

export const maxDuration = 60;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = String(searchParams.get("url") || searchParams.get("id") || "").trim();
  if (!url) return NextResponse.json({ status: false, message: "Parameter url atau id diperlukan" }, { status: 400 });

  try {
    const result = await getTranscribe(url);
    return NextResponse.json({ status: true, result });
  } catch (err) {
    return NextResponse.json({ status: false, message: err.message }, { status: 500 });
  }
}
