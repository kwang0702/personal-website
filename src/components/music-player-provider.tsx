"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Album } from "@/data/albums";

type MusicPlayerCtx = {
  current: Album | null;
  isMinimized: boolean;
  isModalOpen: boolean;
  play: (album: Album) => void;
  minimize: () => void;
  expand: () => void;
  stop: () => void;
  openModal: (album: Album) => void;
  closeModal: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerCtx>({
  current: null,
  isMinimized: false,
  isModalOpen: false,
  play: () => {},
  minimize: () => {},
  expand: () => {},
  stop: () => {},
  openModal: () => {},
  closeModal: () => {},
});

export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<Album | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const play = useCallback((album: Album) => {
    setCurrent(album);
    setIsMinimized(false);
    setIsModalOpen(true);
  }, []);

  const openModal = useCallback((album: Album) => {
    // If same album is playing minimized, just expand
    if (current?.spotifyId === album.spotifyId && isMinimized) {
      setIsMinimized(false);
      setIsModalOpen(true);
      return;
    }
    // Otherwise open modal for this album (new or same)
    setCurrent(album);
    setIsMinimized(false);
    setIsModalOpen(true);
  }, [current, isMinimized]);

  const minimize = useCallback(() => {
    setIsModalOpen(false);
    setIsMinimized(true);
  }, []);

  const expand = useCallback(() => {
    setIsMinimized(false);
    setIsModalOpen(true);
  }, []);

  const stop = useCallback(() => {
    setCurrent(null);
    setIsMinimized(false);
    setIsModalOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    // If music is playing, minimize instead of stopping
    setIsModalOpen(false);
    // Don't set minimized here — only minimize button does that
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{ current, isMinimized, isModalOpen, play, minimize, expand, stop, openModal, closeModal }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}
