"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLibraryStore } from "@/store/useLibraryStore";

export default function AuthSyncProvider() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const status = useAuthStore((s) => s.status);
  const hydrateFromServer = useLibraryStore((s) => s.hydrateFromServer);
  const hydratedRef = useRef(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // pull server library once when session becomes authed
  useEffect(() => {
    if (status !== "authed" || hydratedRef.current) return;
    hydratedRef.current = true;
    fetch("/api/library")
      .then((r) => r.json())
      .then((res) => {
        if (res?.success) hydrateFromServer(res.liked || [], res.playlists || []);
      })
      .catch(() => {});
  }, [status, hydrateFromServer]);

  // push local changes to server (debounced) whenever authed
  useEffect(() => {
    if (status !== "authed") return;
    const unsub = useLibraryStore.subscribe((state, prevState) => {
      if (state.liked === prevState.liked && state.playlists === prevState.playlists) return;
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetch("/api/library", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ liked: state.liked, playlists: state.playlists }),
        }).catch(() => {});
      }, 900);
    });
    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, [status]);

  return null;
}
