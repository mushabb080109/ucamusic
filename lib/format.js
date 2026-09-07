export function toHDThumbnail(url, videoId) {
  if (!url && videoId) return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  if (!url) return "";
  let hd = String(url);
  if (hd.includes("googleusercontent.com") || hd.includes("ggpht.com") || hd.includes("ytimg.com")) {
    if (/=w\d+-h\d+/i.test(hd)) {
      hd = hd.replace(/=w\d+-h\d+[^?#]*/i, "=w800-h800-l90-rj");
    } else if (/=s\d+/i.test(hd)) {
      hd = hd.replace(/=s\d+[^?#]*/i, "=s800-c-k-c0x00ffffff-no-rj");
    } else if (/=w\d+/i.test(hd)) {
      hd = hd.replace(/=w\d+[^?#]*/i, "=w800-h800-l90-rj");
    }
  }
  if (hd.includes("i.ytimg.com/vi/") || hd.includes("img.youtube.com/vi/")) {
    hd = hd.split("?")[0];
    hd = hd.replace(/(hqdefault|mqdefault|sddefault|default)\.jpg/i, "hqdefault.jpg");
  }
  return hd;
}

export function transformThumbs(thumbs, videoId) {
  if (!Array.isArray(thumbs) || thumbs.length === 0) {
    return videoId ? [{ url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }] : [];
  }
  return thumbs.map((t) => ({ ...t, url: toHDThumbnail(t.url, videoId) }));
}

export function findAllKeys(arr, key, results) {
  if (arr === null || typeof arr !== "object") return;
  if (arr[key] !== undefined) results.push(arr[key]);
  Object.values(arr).forEach((v) => findAllKeys(v, key, results));
}

export function getRunsText(runs) {
  return Array.isArray(runs) ? runs.map((r) => r.text || "").join("") : "";
}

// duration like "3.45" (minutes.seconds as produced by the original scraper) -> "3:45"
export function formatDuration(d) {
  if (!d) return "";
  const str = String(d);
  if (str.includes(":")) return str;
  if (str.includes(".")) {
    const [m, s] = str.split(".");
    return `${m}:${s.padStart(2, "0")}`;
  }
  return str;
}

export function proxyImage(url) {
  if (!url) return "";
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

export function proxyAudio(url) {
  if (!url) return "";
  return `/api/proxy-audio?url=${encodeURIComponent(url)}`;
}

export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
