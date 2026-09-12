"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { proxyImage } from "@/lib/format";

export function AlbumCard({ album }) {
  return (
    <motion.div whileTap={{ scale: 0.96 }} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} className="flex-none w-[168px] sm:w-[190px]">
      <Link href={`/album/${album.id}`} className="group block">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-base-card border border-white/5 shadow-lg shadow-black/20 group-hover:shadow-[0_18px_36px_-14px_rgba(0,0,0,0.6)] transition-shadow duration-300">
          {album.cover ? (
            <Image src={proxyImage(album.cover)} alt={album.title} fill sizes="220px" className="object-cover img-zoom" unoptimized />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/0" />
          )}
        </div>
        <div className="mt-2.5">
          <p className="text-[13.5px] font-semibold text-white truncate">{album.title}</p>
          <p className="text-[12px] text-white/45 truncate mt-0.5">{album.albumType || "Album"} · {album.artist}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export function ArtistCard({ artist }) {
  return (
    <motion.div whileTap={{ scale: 0.96 }} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} className="flex-none w-[140px] text-center">
      <Link href={`/artist/${artist.id}`} className="group block">
        <div className="relative w-full aspect-square rounded-full overflow-hidden bg-base-card border border-white/5 shadow-lg shadow-black/20 ring-0 group-hover:ring-2 group-hover:ring-accent-soft/40 transition-all duration-300">
          {artist.cover ? (
            <Image src={proxyImage(artist.cover)} alt={artist.title} fill sizes="150px" className="object-cover img-zoom" unoptimized />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/0" />
          )}
        </div>
        <p className="mt-2.5 text-[13.5px] font-semibold text-white truncate">{artist.title}</p>
        <p className="text-[11.5px] text-white/40 truncate">Artis</p>
      </Link>
    </motion.div>
  );
}

export function PlaylistCard({ playlist }) {
  return (
    <motion.div whileTap={{ scale: 0.96 }} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} className="flex-none w-[168px] sm:w-[190px]">
      <Link href={`/album/${playlist.id}`} className="group block">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-base-card border border-white/5 shadow-lg shadow-black/20 group-hover:shadow-[0_18px_36px_-14px_rgba(0,0,0,0.6)] transition-shadow duration-300">
          {playlist.cover ? (
            <Image src={proxyImage(playlist.cover)} alt={playlist.title} fill sizes="220px" className="object-cover img-zoom" unoptimized />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-transparent" />
          )}
        </div>
        <div className="mt-2.5">
          <p className="text-[13.5px] font-semibold text-white truncate">{playlist.title}</p>
          <p className="text-[12px] text-white/45 truncate mt-0.5">Playlist</p>
        </div>
      </Link>
    </motion.div>
  );
}
