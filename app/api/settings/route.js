import { NextResponse } from "next/server";

// ucamusic tidak lagi menggunakan akun/database — pengaturan bersifat statis.
const SETTINGS = {
  siteName: "ucamusic",
  tagline: "Stream music, beautifully.",
  announcementEnabled: false,
  announcementTitle: "",
  announcementContent: "",
  announcementVersion: 1,
};

export async function GET() {
  return NextResponse.json({ success: true, settings: SETTINGS });
}
