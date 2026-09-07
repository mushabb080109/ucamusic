import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Settings from "@/lib/models/Settings";
import { signToken, AUTH_COOKIE } from "@/lib/auth";

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {}

  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");
  const displayName = String(body.displayName || username).trim();

  if (!/^[a-z0-9_.]{3,20}$/.test(username)) {
    return NextResponse.json({ success: false, message: "Username 3-20 karakter: huruf kecil, angka, underscore, titik." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ success: false, message: "Password minimal 6 karakter." }, { status: 400 });
  }

  try {
    await connectDB();

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      const settings = await Settings.findOne({ singleton: "main" });
      if (settings && settings.registerEnabled === false) {
        return NextResponse.json({ success: false, message: "Pendaftaran akun baru sedang ditutup." }, { status: 403 });
      }
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return NextResponse.json({ success: false, message: "Username sudah dipakai." }, { status: 409 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";
    const user = await User.create({ username, passwordHash, displayName, role });

    const token = signToken({ uid: user._id.toString() });
    const res = NextResponse.json({
      success: true,
      user: { id: user._id.toString(), username: user.username, displayName: user.displayName, role: user.role },
    });
    res.cookies.set(AUTH_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
    return res;
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message || "Gagal membuat akun." }, { status: 500 });
  }
}
