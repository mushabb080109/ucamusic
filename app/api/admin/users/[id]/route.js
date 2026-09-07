import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });

  let body = {};
  try {
    body = await request.json();
  } catch (e) {}

  if (!["user", "admin"].includes(body.role)) {
    return NextResponse.json({ success: false, message: "Role tidak valid." }, { status: 400 });
  }

  try {
    await connectDB();
    if (params.id === admin._id.toString() && body.role === "user") {
      return NextResponse.json({ success: false, message: "Tidak bisa menurunkan role akunmu sendiri." }, { status: 400 });
    }
    const user = await User.findByIdAndUpdate(params.id, { $set: { role: body.role } }, { new: true }).select("username role");
    if (!user) return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ success: true, user: { id: user._id.toString(), username: user.username, role: user.role } });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });

  try {
    await connectDB();
    if (params.id === admin._id.toString()) {
      return NextResponse.json({ success: false, message: "Tidak bisa menghapus akunmu sendiri." }, { status: 400 });
    }
    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
