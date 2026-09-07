import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema(
  {
    videoId: String,
    title: String,
    artist: String,
    artistId: String,
    thumbnail: String,
    duration: String,
  },
  { _id: false }
);

const PlaylistSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    cover: String,
    tracks: [TrackSchema],
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  liked: { type: [TrackSchema], default: [] },
  playlists: { type: [PlaylistSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
