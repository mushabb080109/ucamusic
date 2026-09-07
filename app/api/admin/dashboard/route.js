import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Settings from "@/lib/models/Settings";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });

  try {
    await connectDB();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalUsers, newUsersToday, totalAdmins, agg, settings, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ role: "admin" }),
      User.aggregate([
        { $project: { likedCount: { $size: { $ifNull: ["$liked", []] } }, playlistsCount: { $size: { $ifNull: ["$playlists", []] } } } },
        { $group: { _id: null, totalLiked: { $sum: "$likedCount" }, totalPlaylists: { $sum: "$playlistsCount" } } },
      ]),
      Settings.findOne({ singleton: "main" }).select("maintenanceMode registerEnabled announcementEnabled"),
      User.find().sort({ createdAt: -1 }).limit(5).select("username displayName role createdAt"),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        newUsersToday,
        totalAdmins,
        totalLiked: agg[0]?.totalLiked || 0,
        totalPlaylists: agg[0]?.totalPlaylists || 0,
        maintenanceMode: settings?.maintenanceMode || false,
        registerEnabled: settings?.registerEnabled !== false,
        announcementEnabled: settings?.announcementEnabled || false,
      },
      recentUsers: recentUsers.map((u) => ({
        id: u._id.toString(),
        username: u.username,
        displayName: u.displayName,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
