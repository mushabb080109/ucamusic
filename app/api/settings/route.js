import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/lib/models/Settings";

const DEFAULTS = {
  siteName: "ucamusic",
  tagline: "Stream music, beautifully.",
  registerEnabled: true,
  maintenanceMode: false,
  maintenanceMessage: "ucamusic sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.",
  announcementEnabled: false,
  announcementTitle: "",
  announcementContent: "",
  announcementVersion: 1,
};

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ success: true, settings: DEFAULTS });
  }
  try {
    await connectDB();
    let settings = await Settings.findOne({ singleton: "main" });
    if (!settings) settings = await Settings.create({ singleton: "main" });
    return NextResponse.json({
      success: true,
      settings: {
        siteName: settings.siteName,
        tagline: settings.tagline,
        registerEnabled: settings.registerEnabled,
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
        announcementEnabled: settings.announcementEnabled,
        announcementTitle: settings.announcementTitle,
        announcementContent: settings.announcementContent,
        announcementVersion: settings.announcementVersion,
      },
    });
  } catch (e) {
    return NextResponse.json({ success: true, settings: DEFAULTS });
  }
}
