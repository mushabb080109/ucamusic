import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ucamusic-dev-secret-change-me";
export const AUTH_COOKIE = "uca_session";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function getUserIdFromRequest(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded?.uid || null;
}

export async function requireAdmin(request) {
  const uid = getUserIdFromRequest(request);
  if (!uid) return null;
  const { connectDB } = await import("./db");
  const User = (await import("./models/User")).default;
  await connectDB();
  const user = await User.findById(uid).select("role username displayName");
  if (!user || user.role !== "admin") return null;
  return user;
}
