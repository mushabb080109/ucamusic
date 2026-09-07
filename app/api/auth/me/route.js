import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request) {
  const uid = getUserIdFromRequest(request);
  if (!uid) return NextResponse.json({ success: true, user: null });

  try {
    await connectDB();
    const user = await User.findById(uid).select("username displayName role");
    if (!user) return NextResponse.json({ success: true, user: null });
    return NextResponse.json({ success: true, user: { id: user._id.toString(), username: user.username, displayName: user.displayName, role: user.role } });
  } catch (e) {
    return NextResponse.json({ success: true, user: null });
  }
}
