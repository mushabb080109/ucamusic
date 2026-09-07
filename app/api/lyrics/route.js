import { NextResponse } from "next/server";
import { getLyrics1 } from "@/lib/yt/lyrics1";
import { getLyrics2 } from "@/lib/yt/lyrics2";

export const maxDuration = 60;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoId = (searchParams.get("id") || "").trim();
  const title = (searchParams.get("title") || "").trim();
  const artist = (searchParams.get("artist") || "").trim();

  if (!videoId) return NextResponse.json({ status: false, message: "Parameter id wajib diisi" }, { status: 400 });

  try {
    const data1 = await getLyrics1(videoId, title, artist).catch(() => null);
    if (data1 && data1.lyrics && data1.lyrics.lines && data1.lyrics.lines.length > 0) {
      return NextResponse.json({
        status: true,
        input: { id: videoId },
        result: { videoId, title: data1.title || "", artist: data1.artist || "", album: data1.album || "", source: "lyrics1", lyrics: data1.lyrics },
      });
    }

    const data2 = await getLyrics2(videoId).catch(() => null);
    if (data2 && data2.lyrics && data2.lyrics.lines && data2.lyrics.lines.length > 0) {
      return NextResponse.json({
        status: true,
        input: { id: videoId },
        result: {
          videoId,
          title: data2.title || data1?.title || "",
          artist: data2.artist || data1?.artist || "",
          album: data1?.album || "",
          source: "lyrics2",
          lyrics: data2.lyrics,
        },
      });
    }

    return NextResponse.json({
      status: true,
      input: { id: videoId },
      result: { videoId, title: data1?.title || "", artist: data1?.artist || "", album: data1?.album || "", source: "none", lyrics: { type: "none", lines: [] } },
    });
  } catch (e) {
    return NextResponse.json({ status: false, message: "Gagal: " + e.message }, { status: 500 });
  }
}
