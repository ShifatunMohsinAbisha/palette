"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const playlists = [
  { id: 1, title: "Snowfall", artist: "Øneheart & reidenshi", mood: "Chill", color: "#DDF4FF", emoji: "❄️", duration: "2:04", youtubeId: "soRjcajliHE" },
  { id: 2, title: "Sweater Weather", artist: "The Neighbourhood", mood: "Melancholy", color: "#EAD9FF", emoji: "🌙", duration: "4:00", youtubeId: "GCdwKhTtNNw" },
  { id: 3, title: "golden hour", artist: "JVKE", mood: "Happy", color: "#FFF4C2", emoji: "☀️", duration: "3:29", youtubeId: "N_YSGP2GkAI" },
  { id: 4, title: "Glimpse of Us", artist: "Joji", mood: "Peaceful", color: "#FFD9E8", emoji: "🌸", duration: "3:57", youtubeId: "FvOpPnKeSSQ" },
  { id: 5, title: "Exile", artist: "Taylor Swift ft. Bon Iver", mood: "Calm", color: "#D9FBE5", emoji: "🌿", duration: "4:45", youtubeId: "osdoLjUNFnA" },
  { id: 6, title: "Blinding Lights", artist: "The Weeknd", mood: "Energetic", color: "#EAD9FF", emoji: "💫", duration: "3:20", youtubeId: "fHI8X4OXluQ" },
  { id: 7, title: "Can't Help Falling in Love", artist: "Elvis Presley", mood: "Calm", color: "#FFD9E8", emoji: "💖", duration: "3:00", youtubeId: "v2H4l9tLxfc" },
  { id: 8, title: "Love Story", artist: "Taylor Swift", mood: "Happy", color: "#FFF4C2", emoji: "🏰", duration: "3:56", youtubeId: "8xg3vE8Ie_E" },
  { id: 9, title: "All Too Well (10 Minute Version)", artist: "Taylor Swift", mood: "Melancholy", color: "#EAD9FF", emoji: "🧣", duration: "10:13", youtubeId: "s2MkiGSp3OA" },
  { id: 10, title: "Dress", artist: "Taylor Swift", mood: "Chill", color: "#DDF4FF", emoji: "👗", duration: "5:02", youtubeId: "j2n5mRe0s54" },
  { id: 11, title: "Chiro Adhora", artist: "Miftah Zaman", mood: "Peaceful", color: "#D9FBE5", emoji: "✨", duration: "4:12", youtubeId: "W55T-09uGZ8" },
  { id: 12, title: "Etota Valobashi", artist: "Recall", mood: "Melancholy", color: "#EAD9FF", emoji: "🎸", duration: "4:32", youtubeId: "glN2q3AxCos" },
  { id: 13, title: "Shoto Danar Projapoti", artist: "Arafat Mohsin", mood: "Happy", color: "#FFF4C2", emoji: "🦋", duration: "3:53", youtubeId: "U32cZrtRJN4" },
  { id: 14, title: "Tumi", artist: "Level Five", mood: "Chill", color: "#DDF4FF", emoji: "🎤", duration: "4:05", youtubeId: "NQp3cbSkqbo" },
  { id: 15, title: "Gangnam Style", artist: "PSY", mood: "Energetic", color: "#EAD9FF", emoji: "😎", duration: "4:13", youtubeId: "9bZkp7q19f0" },
  { id: 16, title: "Bilionera", artist: "Otilia", mood: "Energetic", color: "#FFD9E8", emoji: "💃", duration: "3:05", youtubeId: "QH2-TGUlwu4" },
  { id: 17, title: "TiK ToK", artist: "Kesha", mood: "Energetic", color: "#FFF4C2", emoji: "⏰", duration: "3:35", youtubeId: "iP6XpLQM2Cs" },
  { id: 18, title: "Alien Superstar", artist: "Beyoncé", mood: "Energetic", color: "#EAD9FF", emoji: "🛸", duration: "4:35", youtubeId: "e_aT9pAGQo8" },
  { id: 19, title: "Love Again", artist: "Dua Lipa", mood: "Happy", color: "#FFD9E8", emoji: "❤️", duration: "4:18", youtubeId: "BC19n8TZV5k" },
  { id: 20, title: "Supercut", artist: "Lorde", mood: "Chill", color: "#DDF4FF", emoji: "🎞️", duration: "4:37", youtubeId: "p1Zt474s6m8" }
];

const moods = ["All", "Chill", "Peaceful", "Happy", "Calm", "Energetic", "Melancholy"];

export default function Music() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [activeMood, setActiveMood] = useState("All");
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index: number) => {
    if (currentTrack === index) {
      togglePlay();
    } else {
      setCurrentTrack(index);
      setIsPlaying(true);
    }
  };

  const prevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + playlists.length) % playlists.length);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % playlists.length);
    setIsPlaying(true);
  };

  const nowPlaying = playlists[currentTrack];
  const filtered = activeMood === "All" ? playlists : playlists.filter(s => s.mood === activeMood);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", fontFamily: "system-ui, sans-serif" }}>

      <header style={{ backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--palette-border)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--palette-pink)" }}>🎨 Palette</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--palette-pink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 24px 100px 24px" }}>

        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Music 🎵</h2>
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", marginTop: "4px" }}>Music that matches your mood</p>
        </div>

        {/* Now Playing */}
        <div style={{ padding: "24px", borderRadius: "20px", background: "var(--palette-gradient-music)", marginBottom: "32px", boxShadow: `0 4px 20px var(--palette-shadow-xl)` }}>
          <p style={{ fontSize: "12px", color: "var(--palette-text-secondary)", marginBottom: "8px" }}>NOW PLAYING</p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "12px", backgroundColor: "var(--palette-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>{nowPlaying?.emoji || "🎵"}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>{nowPlaying?.title || "Loading..."}</h3>
              <p style={{ fontSize: "14px", color: "var(--palette-text-secondary)" }}>{nowPlaying?.artist || "Please wait"} · {nowPlaying?.duration || "0:00"}</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button onClick={prevTrack} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>⏮️</button>
              <button onClick={togglePlay} style={{ fontSize: "32px", background: "none", border: "none", cursor: "pointer" }}>{isPlaying ? "⏸️" : "▶️"}</button>
              <button onClick={nextTrack} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>⏭️</button>
            </div>
          </div>
          {/* YouTube Embed */}
          <div style={{ marginTop: "16px", borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9", width: "100%" }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${nowPlaying?.youtubeId || ""}?autoplay=${isPlaying ? "1" : "0"}`}
              title={nowPlaying?.title || "YouTube video player"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Mood Filter */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px" }}>
          {moods.map(mood => (
            <button
              key={mood}
              onClick={() => setActiveMood(mood)}
              style={{ padding: "8px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: "500", whiteSpace: "nowrap", cursor: "pointer", backgroundColor: activeMood === mood ? "var(--palette-primary)" : "var(--palette-surface)", border: `1px solid ${activeMood === mood ? "var(--palette-border-active)" : "var(--palette-border-subtle)"}`, color: activeMood === mood ? "var(--palette-text)" : "var(--palette-text-secondary)" }}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Song List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((song) => {
            const songIndex = playlists.findIndex(p => p.id === song.id);
            const isActive = songIndex === currentTrack;
            return (
              <div
                key={song.id}
                onClick={() => playTrack(songIndex)}
                style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", backgroundColor: isActive ? "var(--palette-primary)" : "var(--palette-surface)", border: `1px solid ${isActive ? "var(--palette-border-active)" : "var(--palette-border)"}`, cursor: "pointer" }}
              >
                <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: song.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                  {song.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600" }}>{song.title}</h3>
                  <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>{song.artist}</p>
                </div>
                <span style={{ fontSize: "12px", color: "var(--palette-text-faint)", marginRight: "8px" }}>{song.mood}</span>
                <span style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>{song.duration}</span>
                <button onClick={(e) => { e.stopPropagation(); playTrack(songIndex); }} style={{ fontSize: "18px", background: "none", border: "none", cursor: "pointer" }}>
                  {isActive && isPlaying ? "⏸️" : "▶️"}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "var(--palette-nav-bottom-bg)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--palette-border)", zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {[
            { icon: "🏠", label: "Home", href: "/" },
            { icon: "🔍", label: "Explore", href: "/explore" },
            { icon: "➕", label: "Create", href: "/create" },
            { icon: "🎵", label: "Music", href: "/music" },
            { icon: "👤", label: "Profile", href: "/profile" },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none" }}>
              <span style={{ fontSize: "22px" }}>{item.icon}</span>
              <span style={{ fontSize: "11px", color: "var(--palette-text-faint)" }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}