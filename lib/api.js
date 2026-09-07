async function j(res) {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const b = await res.json();
      msg = b.message || b.error || msg;
    } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  search: (query, type = "all") => fetch(`/api/search?query=${encodeURIComponent(query)}&type=${type}`).then(j),
  suggest: (q) => fetch(`/api/suggest?q=${encodeURIComponent(q)}`).then(j),
  artist: (id) => fetch(`/api/artist?id=${encodeURIComponent(id)}`).then(j),
  album: (id) => fetch(`/api/album?id=${encodeURIComponent(id)}`).then(j),
  lyrics: (id, title = "", artist = "") =>
    fetch(`/api/lyrics?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`).then(j),
  resolveStream: (videoId) =>
    fetch(`/api/ytplay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: videoId }),
    }).then(j),
};
