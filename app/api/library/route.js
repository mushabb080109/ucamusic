import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request) {
  const uid = getUserIdFromRequest(request);
  if (!uid) return NextResponse.json({ success: false, message: "Belum login." }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(uid).select("liked playlists");
    if (!user) return NextResponse.json({ success: false, message: "Akun tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ success: true, liked: user.liked || [], playlists: user.playlists || [] });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const uid = getUserIdFromRequest(request);
  if (!uid) return NextResponse.json({ success: false, message: "Belum login." }, { status: 401 });

  let body = {};
  try {
    body = await request.json();
  } catch (e) {}

  try {
    await connectDB();
    const update = {};
    if (Array.isArray(body.liked)) update.liked = body.liked;
    if (Array.isArray(body.playlists)) update.playlists = body.playlists;

    await User.findByIdAndUpdate(uid, { $set: update });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
