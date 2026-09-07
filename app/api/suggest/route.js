import https from "https";
import { NextResponse } from "next/server";

function fetchRaw(query) {
  return new Promise((resolve, reject) => {
    https
      .get(
        {
          hostname: "suggestqueries.google.com",
          path: "/complete/search?client=youtube&ds=yt&q=" + encodeURIComponent(query),
          headers: { "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0" },
          timeout: 15000,
        },
        (res) => {
          let d = "";
          res.on("data", (c) => (d += c));
          res.on("end", () => resolve(d));
        }
      )
      .on("error", reject);
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || searchParams.get("query") || "").trim();
  if (!query) return NextResponse.json({ status: false, message: "Parameter q wajib diisi" }, { status: 400 });

  try {
    const raw = await fetchRaw(query);
    const json = JSON.parse(raw.replace(/^window\.google\.ac\.h\(/, "").replace(/\)$/, ""));
    const suggestions =
      Array.isArray(json) && Array.isArray(json[1]) ? json[1].filter((i) => Array.isArray(i) && i[0]).map((i) => i[0]) : [];
    return NextResponse.json(suggestions);
  } catch (e) {
    return NextResponse.json({ status: false, message: "Gagal: " + e.message }, { status: 500 });
  }
}
