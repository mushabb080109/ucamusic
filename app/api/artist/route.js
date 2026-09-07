import https from "https";
import { NextResponse } from "next/server";
import { getRunsText, transformThumbs } from "@/lib/format";

const API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";

function makeRequest(o, p) {
  return new Promise((resolve, reject) => {
    const r = https.request(o, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(d));
        } catch (e) {
          resolve(d);
        }
      });
    });
    r.on("error", reject);
    r.on("timeout", () => {
      r.destroy();
      reject(new Error("Timeout"));
    });
    if (p) r.write(JSON.stringify(p));
    r.end();
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artistId = (searchParams.get("id") || "").trim();
  if (!artistId) return NextResponse.json({ status: false, message: "Parameter id wajib diisi" }, { status: 400 });

  try {
    const data = await makeRequest(
      {
        hostname: "music.youtube.com",
        path: "/youtubei/v1/browse?key=" + API_KEY,
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0", Origin: "https://music.youtube.com" },
        timeout: 15000,
      },
      { context: { client: { clientName: "WEB_REMIX", clientVersion: "1.20240101.00.00", hl: "en", gl: "ID" } }, browseId: artistId }
    );

    let name = "", thumbnails = [];
    const topSongs = [], topAlbums = [], topSingles = [], topVideos = [], featuredOn = [], playlists = [], similarArtists = [];

    try {
      const h = data?.header?.musicImmersiveHeaderRenderer || data?.header?.musicVisualHeaderRenderer || {};
      name = getRunsText(h.title?.runs || []);
      thumbnails = transformThumbs(h.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || []);
      const tabs = data?.contents?.singleColumnBrowseResultsRenderer?.tabs || [];
      for (const tab of tabs) {
        const contents = tab?.tabRenderer?.content?.sectionListRenderer?.contents || [];
        for (const sec of contents) {
          if (sec.musicShelfRenderer) {
            for (const item of sec.musicShelfRenderer.contents || []) {
              if (item.musicResponsiveListItemRenderer) {
                const i = item.musicResponsiveListItemRenderer;
                const videoId = i.playlistItemData?.videoId || "";
                const rawThumbs = i.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
                const thumbs = transformThumbs(rawThumbs, videoId);
                topSongs.push({
                  videoId,
                  title: getRunsText(i.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || []),
                  artist: getRunsText(i.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || []),
                  thumbnails: thumbs,
                });
              }
            }
          }
          if (sec.musicCarouselShelfRenderer) {
            const car = sec.musicCarouselShelfRenderer;
            const ht = getRunsText(car.header?.musicCarouselShelfBasicHeaderRenderer?.title?.runs || []);
            for (const item of car.contents || []) {
              if (item.musicTwoRowItemRenderer) {
                const it = item.musicTwoRowItemRenderer;
                const rawItemThumbs = it.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
                const vId = it.navigationEndpoint?.watchEndpoint?.videoId || "";
                const parsed = {
                  name: getRunsText(it.title?.runs || []),
                  artist: getRunsText(it.subtitle?.runs || []),
                  browseId: it.navigationEndpoint?.browseEndpoint?.browseId || it.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId || "",
                  thumbnails: transformThumbs(rawItemThumbs, vId),
                };
                if (/album/i.test(ht)) topAlbums.push(parsed);
                else if (/singles|ep/i.test(ht)) topSingles.push(parsed);
                else if (/video/i.test(ht)) {
                  parsed.videoId = it.navigationEndpoint?.watchEndpoint?.videoId || "";
                  topVideos.push(parsed);
                } else if (/playlist/i.test(ht)) playlists.push(parsed);
                else if (/featured/i.test(ht)) featuredOn.push(parsed);
                else if (/similar|fans/i.test(ht)) similarArtists.push(parsed);
              }
            }
          }
        }
      }
    } catch (e) {}

    return NextResponse.json({
      status: true,
      input: { id: artistId },
      result: { artistId, name, thumbnails, topSongs, topAlbums, topSingles, topVideos, playlists, featuredOn, similarArtists },
    });
  } catch (e) {
    return NextResponse.json({ status: false, message: "Gagal: " + e.message }, { status: 500 });
  }
}
