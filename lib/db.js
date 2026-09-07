import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global._ucamusicMongoose;
if (!cached) cached = global._ucamusicMongoose = { conn: null, promise: null };

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI belum diatur. Tambahkan environment variable MONGODB_URI di Vercel.");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
