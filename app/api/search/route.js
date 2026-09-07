import axios from "axios";
import { NextResponse } from "next/server";
import { findAllKeys, toHDThumbnail } from "@/lib/format";

async function fetchYoutube(query, type) {
  const payload = {
    context: {
      client: { clientName: "WEB_REMIX", clientVersion: "1.20240101.00.00", hl: "id", gl: "ID" },
    },
    query,
  };
  if (type === "songs") payload.params = "EgWKAQIIAWoSEAQQAxAFEAkQChAVEBAQERAO";
  else if (type === "artists") payload.params = "EgWKAQIgAWoKEAoQCRADEAA=";

  const { data } = await axios.post(
    "https://music.youtube.com/youtubei/v1/search?prettyPrint=false",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Origin: "https://music.youtube.com",
      },
      timeout: 15000,
    }
  );
  return data;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get("query") || "").trim();
  const type = String(searchParams.get("type") || "all").trim();

  if (!query) {
    return NextResponse.json({ status: false, creator: "ucamusic", message: "Parameter query diperlukan" }, { status: 400 });
  }

  let urlVid = "";
  if (query.includes("youtube.com/") || query.includes("youtu.be/")) {
    urlVid = query.match(/[?&]v=([^&]+)/)?.[1] || query.match(/youtu\.be\/([^?]+)/)?.[1] || "";
  }

  if (urlVid && (type === "all" || type === "songs")) {
    try {
      const p = {
        context: { client: { clientName: "WEB_REMIX", clientVersion: "1.20240101.00.00", hl: "id", gl: "ID" } },
        videoId: urlVid,
      };
      const r = await axios.post("https://music.youtube.com/youtubei/v1/next?prettyPrint=false", p, { timeout: 15000 });
      const item =
        r.data?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer?.watchNextTabbedResultsRenderer
          ?.tabs?.[0]?.tabRenderer?.content?.musicQueueRenderer?.content?.playlistPanelRenderer?.contents?.[0]
          ?.playlistPanelVideoRenderer;

      if (item && item.videoId === urlVid) {
        const title = (item.title?.runs || []).map((r) => r.text).join("");
        const artist = (item.longBylineText?.runs || []).map((r) => r.text).join("");
        const durationText = (item.lengthText?.runs || []).map((r) => r.text).join("");
        const thumbs = item.thumbnail?.thumbnails || [];
        const rawThumb = thumbs.length ? thumbs[thumbs.length - 1].url : "";
        const thumbnail = toHDThumbnail(rawThumb, urlVid);

        let duration = "";
        const durMatch = durationText.match(/(\d+):(\d+)/);
        if (durMatch) duration = durMatch[1] + "." + durMatch[2];
        else if (durationText) duration = durationText;

        return NextResponse.json({
          status: true,
          creator: "ucamusic",
          result: {
            query,
            totalSongs: 1,
            songs: [
              {
                title,
                videoId: urlVid,
                thumbnail,
                url: `https://music.youtube.com/watch?v=${urlVid}`,
                artist,
                artistId: "",
                album: "",
                albumId: "",
                duration,
              },
            ],
            albums: [],
            playlists: [],
            artists: [],
          },
        });
      }
    } catch (e) {
      console.error("Error fetching single url:", e.message);
    }
  }

  try {
    let songs = [];
    let albums = [];
    let playlists = [];
    let artists = [];

    const tasks = [];
    if (type === "all" || type === "songs") tasks.push(fetchYoutube(query, "songs").then((data) => ({ type: "songs", data })));
    if (type === "all" || type === "playlists") tasks.push(fetchYoutube(query, "playlists").then((data) => ({ type: "playlists", data })));
    if (type === "all" || type === "artists") tasks.push(fetchYoutube(query, "artists").then((data) => ({ type: "artists", data })));

    const results = await Promise.all(tasks);

    for (const resObj of results) {
      const data = resObj.data;

      if (resObj.type === "playlists") {
        const items = [];
        findAllKeys(data, "musicResponsiveListItemRenderer", items);
        findAllKeys(data, "musicTwoRowItemRenderer", items);
        findAllKeys(data, "musicCardShelfRenderer", items);

        const seen = {};
        for (const item of items) {
          const browseId =
            item?.navigationEndpoint?.browseEndpoint?.browseId ||
            item?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId ||
            item?.title?.runs?.[0]?.navigationEndpoint?.watchEndpoint?.videoId ||
            "";
          if (!browseId || seen[browseId]) continue;
          seen[browseId] = true;

          let title = "", subtitle = "", thumbs = [];
          if (item.flexColumns) {
            title = (item.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || []).map((r) => r.text).join("");
            subtitle = (item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || []).map((r) => r.text).join("");
            thumbs = item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
          } else if (item.title?.runs) {
            title = item.title.runs.map((r) => r.text).join("");
            subtitle = (item.subtitle?.runs || []).map((r) => r.text).join("");
            thumbs =
              item.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
              item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
              [];
          } else continue;

          const rawThumb = thumbs.length ? thumbs[thumbs.length - 1].url : "";
          const thumb = toHDThumbnail(rawThumb);

          const m = subtitle.match(/^(Album|Single|EP)\s*[•]\s*(.+?)\s*[•]\s*(\d{4})/i);
          if (m) {
            albums.push({ id: browseId, title, artist: m[2].trim(), albumType: m[1], year: m[3], cover: thumb });
          } else if (subtitle.toLowerCase().includes("playlist")) {
            playlists.push({ id: browseId, title, artist: subtitle, cover: thumb });
          }
        }
      } else if (resObj.type === "artists") {
        const items = [];
        findAllKeys(data, "musicResponsiveListItemRenderer", items);
        findAllKeys(data, "musicTwoRowItemRenderer", items);
        findAllKeys(data, "musicCardShelfRenderer", items);
        const seen = {};
        for (const item of items) {
          const browseId =
            item?.navigationEndpoint?.browseEndpoint?.browseId ||
            item?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId ||
            item?.title?.runs?.[0]?.navigationEndpoint?.watchEndpoint?.videoId ||
            "";
          if (!browseId || seen[browseId]) continue;
          seen[browseId] = true;
          let title = "", subtitle = "", thumbs = [];
          if (item.flexColumns) {
            title = (item.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || []).map((r) => r.text).join("");
            subtitle = (item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || []).map((r) => r.text).join("");
            thumbs = item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
          } else if (item.title?.runs) {
            title = item.title.runs.map((r) => r.text).join("");
            subtitle = (item.subtitle?.runs || []).map((r) => r.text).join("");
            thumbs =
              item.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
              item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
              [];
          } else continue;
          const rawArtistThumb = thumbs.length ? thumbs[thumbs.length - 1].url : "";
          const thumb = toHDThumbnail(rawArtistThumb);
          if (
            subtitle.toLowerCase().includes("artist") ||
            subtitle.toLowerCase().includes("monthly audience") ||
            subtitle.toLowerCase().includes("pendengar") ||
            subtitle.toLowerCase().includes("audiens") ||
            subtitle.toLowerCase().includes("subscriber")
          ) {
            artists.push({ id: browseId, title, artist: subtitle, cover: thumb });
          }
        }
        artists.sort((a, b) => {
          const qLower = query.toLowerCase().trim();
          const aIsMain = a.title.toLowerCase().trim() === qLower;
          const bIsMain = b.title.toLowerCase().trim() === qLower;
          const aAud = a.artist.includes("audiens") || a.artist.includes("jt");
          const bAud = b.artist.includes("audiens") || b.artist.includes("jt");
          if (aIsMain && aAud && (!bIsMain || !bAud)) return -1;
          if (bIsMain && bAud && (!aIsMain || !aAud)) return 1;
          if (aIsMain && !bIsMain) return -1;
          if (bIsMain && !aIsMain) return 1;
          if (aAud && !bAud) return -1;
          if (bAud && !aAud) return 1;
          return 0;
        });
      } else if (resObj.type === "songs") {
        const tabs = data?.contents?.tabbedSearchResultsRenderer?.tabs || [];
        for (const tab of tabs) {
          const sections = tab?.tabRenderer?.content?.sectionListRenderer?.contents || [];
          for (const section of sections) {
            const shelf = section?.musicShelfRenderer;
            const items = shelf?.contents || section?.itemSectionRenderer?.contents || [];
            for (const item of items) {
              const r = item?.musicResponsiveListItemRenderer;
              if (!r) continue;
              const cols = r.flexColumns || [];
              const titleRuns = cols[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
              const title = titleRuns.map((x) => x.text).join("");

              const subRuns = cols[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
              let artist = "", artistId = "", album = "", albumId = "", duration = "";
              for (const run of subRuns) {
                const text = run.text || "";
                const browseId = run?.navigationEndpoint?.browseEndpoint?.browseId || "";
                if (browseId.startsWith("UC")) { artist = text; artistId = browseId; }
                else if (browseId.startsWith("MPRE")) { album = text; albumId = browseId; }
              }

              const accLabel = cols[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.accessibility?.accessibilityData?.label || "";
              const durMatch = accLabel.match(/(\d+)\s*(?:menit|min)\s*(?:(\d+)\s*(?:detik|det))?/);
              if (durMatch) duration = durMatch[1] + "." + (durMatch[2] || "00").padStart(2, "0");
              if (!duration) {
                const allText = subRuns.map((x) => x.text).join(" ");
                const m = allText.match(/(\d+)\s*(?:menit|min)/);
                if (m) duration = m[1] + ".00";
              }

              const t = subRuns[0]?.text || "";
              if (t === "Video") continue;

              const videoId = r?.playlistItemData?.videoId || "";
              const thumbs = r?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
              const rawSongThumb = thumbs.length ? thumbs[thumbs.length - 1].url : "";
              const thumbnail = toHDThumbnail(rawSongThumb, videoId);
              if (!videoId) continue;

              songs.push({
                title,
                videoId,
                thumbnail,
                url: `https://music.youtube.com/watch?v=${videoId}`,
                artist: artist || subRuns[1]?.text || "",
                artistId,
                album: album || "",
                albumId,
                duration,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({
      status: true,
      creator: "ucamusic",
      result: { query, totalSongs: songs.length, songs, albums, playlists, artists },
    });
  } catch (err) {
    return NextResponse.json({ status: false, creator: "ucamusic", message: err.message }, { status: 500 });
  }
}
