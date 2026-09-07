import { NextResponse } from "next/server";
import { translateText, translateLines } from "@/lib/yt/translate";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetLang = searchParams.get("tl") || "id";
  const text = searchParams.get("text") || searchParams.get("q");
  if (!text) return NextResponse.json({ status: false, message: "Parameter text/q wajib diisi" }, { status: 400 });

  try {
    const translated = await translateText(text, targetLang);
    return NextResponse.json({ status: true, result: { original: text, translated, targetLang } });
  } catch (e) {
    return NextResponse.json({ status: false, message: "Gagal menerjemahkan: " + e.message }, { status: 500 });
  }
}

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {}

  const targetLang = body.targetLang || "id";
  const lines = body.lines;
  const text = body.text;

  if (!text && !lines) return NextResponse.json({ status: false, message: "Parameter text atau lines wajib diisi" }, { status: 400 });

  try {
    if (lines && Array.isArray(lines)) {
      const translatedLines = await translateLines(lines, targetLang);
      return NextResponse.json({ status: true, result: { lines: translatedLines } });
    }
    const translated = await translateText(text, targetLang);
    return NextResponse.json({ status: true, result: { original: text, translated, targetLang } });
  } catch (e) {
    return NextResponse.json({ status: false, message: "Gagal menerjemahkan: " + e.message }, { status: 500 });
  }
}
