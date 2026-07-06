"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const initialPlaylists = [
  { id: 1, title: "Snowfall", artist: "Øneheart & reidenshi", query: "Snowfall Øneheart", mood: "Chill", color: "#DDF4FF", emoji: "❄️", duration: "2:04" },
  { id: 2, title: "Sweater Weather", artist: "The Neighbourhood", query: "Sweater Weather The Neighbourhood", mood: "Melancholy", color: "#EAD9FF", emoji: "🌙", duration: "4:00" },
  { id: 3, title: "golden hour", artist: "JVKE", query: "golden hour JVKE", mood: "Happy", color: "#FFF4C2", emoji: "☀️", duration: "3:29" },
  { id: 4, title: "Glimpse of Us", artist: "Joji", query: "Glimpse of Us Joji", mood: "Peaceful", color: "#FFD9E8", emoji: "🌸", duration: "3:57" },
  { id: 5, title: "Exile", artist: "Taylor Swift ft. Bon Iver", query: "Exile Taylor Swift", mood: "Calm", color: "#D9FBE5", emoji: "🌿", duration: "4:45" },
  { id: 6, title: "Blinding Lights", artist: "The Weeknd", query: "Blinding Lights The Weeknd", mood: "Energetic", color: "#EAD9FF", emoji: "💫", duration: "3:20" },
];

const moods = ["All", "Chill", "Peaceful", "Happy", "Calm", "Energetic", "Melancholy"];

export default function Music() {
  const [tracks, setTracks] = useState(initialPlaylists.map(t => ({ ...t, url: "" })));
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [activeMood, setActiveMood] = useState("All");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch iTunes preview URLs on page load via local api proxy to prevent CORS errors
  useEffect(() => {
    const fetchPreviews = async () => {
      const updated = await Promise.all(
        initialPlaylists.map(async (track) => {
          try {
            const res = await fetch(`/api/itunes?term=${encodeURIComponent(track.query)}`);
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              return {
                ...track,
                url: data.results[0].previewUrl,
                duration: "0:30"
              };
            }
          } catch (e) {
            console.error("iTunes fetch failed for: " + track.title, e);
          }
          return { ...track, url: "" };
        })
      );
      setTracks(updated);
    };
    fetchPreviews();
  }, []);

  // Handle src updates and playback when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    const trackUrl = tracks[currentTrack]?.url;
    if (trackUrl) {
      audio.src = trackUrl;
      audio.load();
      if (isPlaying) {
        audio.play().catch((err) => {
          console.warn("Playback interrupted or blocked by browser autocomplete/interact rules:", err);
          setIsPlaying(false);
        });
      }
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentTrack, tracks]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src === window.location.href) {
        // Guard: preview URL not loaded yet
        return;
      }
      audio.play().catch((err) => {
        console.warn("Playback blocked by browser policy:", err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
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
    setCurrentTrack(prev => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
    setCurrentTime(audio.currentTime);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    nextTrack();
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const nowPlaying = tracks[currentTrack];
  const filtered = activeMood === "All" ? tracks : tracks.filter(s => s.mood === activeMood);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", fontFamily: "system-ui, sans-serif" }}>
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        preload="metadata"
      />

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
              <p style={{ fontSize: "14px", color: "var(--palette-text-secondary)" }}>{nowPlaying?.artist || "Please wait"} · {nowPlaying?.duration || "0:30"}</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button onClick={prevTrack} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>⏮️</button>
              <button onClick={togglePlay} style={{ fontSize: "32px", background: "none", border: "none", cursor: "pointer" }}>{isPlaying ? "⏸️" : "▶️"}</button>
              <button onClick={nextTrack} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>⏭️</button>
            </div>
          </div>
          {/* Progress Bar */}
          <div onClick={seekTo} style={{ marginTop: "16px", height: "4px", borderRadius: "999px", backgroundColor: "var(--palette-progress-track)", cursor: "pointer", position: "relative" }}>
            <div style={{ width: `${progress}%`, height: "100%", borderRadius: "999px", backgroundColor: "var(--palette-progress-fill)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--palette-text-secondary)", marginTop: "6px" }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
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
            const songIndex = tracks.findIndex(p => p.id === song.id);
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