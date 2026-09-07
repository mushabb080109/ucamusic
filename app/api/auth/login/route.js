import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { signToken, AUTH_COOKIE } from "@/lib/auth";

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {}

  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!username || !password) {
    return NextResponse.json({ success: false, message: "Username & password wajib diisi." }, { status: 400 });
  }

  try {
    await connectDB();
    const user = await User.findOne({ username });
    const ok = user && bcrypt.compareSync(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ success: false, message: "Username atau password salah." }, { status: 401 });
    }

    const token = signToken({ uid: user._id.toString() });
    const res = NextResponse.json({
      success: true,
      user: { id: user._id.toString(), username: user.username, displayName: user.displayName, role: user.role },
    });
    res.cookies.set(AUTH_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
    return res;
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message || "Gagal login." }, { status: 500 });
  }
}
