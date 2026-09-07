import { getTranscribe } from "./transcribe";
import { translateLines } from "./translate";

export async function getLyrics2(videoId) {
  let lyricsData = { type: "none", lines: [] };
  let title = "", artist = "";

  try {
    const transcribed = await getTranscribe(videoId);
    if (transcribed) {
      title = transcribed.title || "";
      if (transcribed.synced && transcribed.synced.length > 0) {
        lyricsData = {
          type: "synced",
          lines: transcribed.synced.map((s) => ({
            time: typeof s.time === "number" ? s.time : parseFloat(String(s.start).replace("s", "")) || 0,
            text: s.text || "• • •",
          })),
        };
      } else if (transcribed.text) {
        lyricsData = { type: "plain", lines: transcribed.text.split(". ").map((t) => ({ time: -1, text: t.trim() })).filter((t) => t.text) };
      }
    }
  } catch (err) {
    console.error("[LYRICS2] Transcribe error:", err.message);
  }

  if (lyricsData.lines && lyricsData.lines.length > 0) {
    lyricsData.lines = await translateLines(lyricsData.lines);
  }

  return { videoId, title, artist, lyrics: lyricsData };
}
