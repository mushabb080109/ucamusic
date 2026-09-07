import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  singleton: { type: String, default: "main", unique: true },
  siteName: { type: String, default: "ucamusic" },
  tagline: { type: String, default: "Stream music, beautifully." },
  registerEnabled: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: "ucamusic sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi." },
  announcementEnabled: { type: Boolean, default: false },
  announcementTitle: { type: String, default: "" },
  announcementContent: { type: String, default: "" },
  announcementVersion: { type: Number, default: 1 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
