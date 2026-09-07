import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = 20;

  try {
    await connectDB();
    const filter = q ? { username: { $regex: q, $options: "i" } } : {};
    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("username displayName role liked playlists createdAt"),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        id: u._id.toString(),
        username: u.username,
        displayName: u.displayName,
        role: u.role,
        likedCount: u.liked?.length || 0,
        playlistsCount: u.playlists?.length || 0,
        createdAt: u.createdAt,
      })),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
