import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/lib/models/Settings";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });

  try {
    await connectDB();
    let settings = await Settings.findOne({ singleton: "main" });
    if (!settings) settings = await Settings.create({ singleton: "main" });
    return NextResponse.json({ success: true, settings });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });

  let body = {};
  try {
    body = await request.json();
  } catch (e) {}

  const allowed = [
    "siteName",
    "tagline",
    "registerEnabled",
    "maintenanceMode",
    "maintenanceMessage",
    "announcementEnabled",
    "announcementTitle",
    "announcementContent",
  ];
  const update = {};
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  try {
    await connectDB();
    const wasAnnouncementChanged = body.announcementTitle !== undefined || body.announcementContent !== undefined;
    if (wasAnnouncementChanged) {
      const current = await Settings.findOne({ singleton: "main" });
      update.announcementVersion = (current?.announcementVersion || 1) + 1;
    }
    update.updatedAt = new Date();

    const settings = await Settings.findOneAndUpdate({ singleton: "main" }, { $set: update }, { new: true, upsert: true });
    return NextResponse.json({ success: true, settings });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
