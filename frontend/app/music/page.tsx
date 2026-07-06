"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const initialPlaylists = [
  { id: 1, title: "Chemtrails Over the Country Club", artist: "Lana Del Rey", query: "Chemtrails Over the Country Club Lana Del Rey", mood: "Chill", color: "#DDF4FF", emoji: "🛩️", duration: "4:31", youtubeId: "gCw1f1GmPaU" },
  { id: 2, title: "Sweater Weather", artist: "The Neighbourhood", query: "Sweater Weather The Neighbourhood", mood: "Melancholy", color: "#EAD9FF", emoji: "🌙", duration: "4:00", youtubeId: "GCdwKhTtNNw" },
  { id: 3, title: "Perfect", artist: "Ed Sheeran", query: "Perfect Ed Sheeran", mood: "Happy", color: "#FFF4C2", emoji: "💑", duration: "4:23", youtubeId: "2Vv-BfVoq4g" },
  { id: 4, title: "Counting Stars", artist: "OneRepublic", query: "Counting Stars OneRepublic", mood: "Peaceful", color: "#FFD9E8", emoji: "⭐", duration: "4:17", youtubeId: "hT_nvWreIhg" },
  { id: 5, title: "Exile", artist: "Taylor Swift ft. Bon Iver", query: "Exile Taylor Swift", mood: "Calm", color: "#D9FBE5", emoji: "🌿", duration: "4:45", youtubeId: "osdoLjUNFnA" },
  { id: 6, title: "Blinding Lights", artist: "The Weeknd", query: "Blinding Lights The Weeknd", mood: "Energetic", color: "#EAD9FF", emoji: "💫", duration: "3:20", youtubeId: "4NRXx6U8ABQ" },
  { id: 7, title: "Shape of You", artist: "Ed Sheeran", query: "Shape of You Ed Sheeran", mood: "Happy", color: "#FFF4C2", emoji: "🏰", duration: "3:56", youtubeId: "JGwWNGJdvx8" },
  { id: 8, title: "Believer", artist: "Imagine Dragons", query: "Believer Imagine Dragons", mood: "Melancholy", color: "#EAD9FF", emoji: "🧣", duration: "3:24", youtubeId: "7wtfhZwyrcc" },
  { id: 9, title: "Dress", artist: "Taylor Swift", query: "Dress Taylor Swift reputation", mood: "Chill", color: "#DDF4FF", emoji: "👗", duration: "5:02", youtubeId: "w8kzHIl0xgw" },
  { id: 10, title: "Riptide", artist: "Vance Joy", query: "Riptide Vance Joy", mood: "Peaceful", color: "#D9FBE5", emoji: "🎻", duration: "3:24", youtubeId: "uTaL05_4a3o" },
  { id: 11, title: "Etota Valobashi", artist: "Recall", query: "Etota Bhalobashi Recall band", mood: "Melancholy", color: "#EAD9FF", emoji: "🎸", duration: "4:32", youtubeId: "o2kw4MaBVa4" },
  { id: 12, title: "Shoto Danar Projapoti", artist: "Arafat Mohsin", query: "Shoto Danar Projapoti Arafat Mohsin", mood: "Happy", color: "#FFF4C2", emoji: "🦋", duration: "3:53", youtubeId: "U32cZrtRJN4" },
  { id: 13, title: "Tumi", artist: "Level Five", query: "Tumi Level Five", mood: "Chill", color: "#DDF4FF", emoji: "🎤", duration: "4:05", youtubeId: "NQp3cbSkqbo" },
  { id: 14, title: "Gangnam Style", artist: "PSY", query: "Gangnam Style PSY", mood: "Energetic", color: "#EAD9FF", emoji: "😎", duration: "4:13", youtubeId: "9bZkp7q19f0" },
  { id: 15, title: "Stressed Out", artist: "Twenty One Pilots", query: "Stressed Out Twenty One Pilots", mood: "Energetic", color: "#FFD9E8", emoji: "💃", duration: "3:22", youtubeId: "pXRkWzztxqU" },
  { id: 16, title: "TiK ToK", artist: "Kesha", query: "TiK ToK Kesha", mood: "Energetic", color: "#FFF4C2", emoji: "⏰", duration: "3:35", youtubeId: "iP6XpLQM2Cs" },
  { id: 17, title: "Alien Superstar", artist: "Beyoncé", query: "Alien Superstar Beyonce", mood: "Energetic", color: "#EAD9FF", emoji: "🛸", duration: "4:35", youtubeId: "e_aT9pAGQo8" },
  { id: 18, title: "Love Again", artist: "Dua Lipa", query: "Love Again Dua Lipa", mood: "Happy", color: "#FFD9E8", emoji: "❤️", duration: "4:18", youtubeId: "BC19kwABFwc" },
  { id: 19, title: "Wake Me Up", artist: "Avicii", query: "Wake Me Up Avicii", mood: "Chill", color: "#DDF4FF", emoji: "🎞️", duration: "4:09", youtubeId: "IcrbM1l_BoI" }
];

const moods = ["All", "Chill", "Peaceful", "Happy", "Calm", "Energetic", "Melancholy"];

interface Track {
  id: number;
  title: string;
  artist: string;
  query: string;
  mood: string;
  color: string;
  emoji: string;
  duration: string;
  youtubeId: string;
  artwork?: string;
}

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>(
    initialPlaylists.map(t => ({
      ...t,
      artwork: undefined
    }))
  );
  const [currentTrack, setCurrentTrack] = useState(0);
  const [activeMood, setActiveMood] = useState("All");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  // Load YouTube script on mount and fetch iTunes artwork
  useEffect(() => {
    // 1. Load YouTube script
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // 2. Initialize YT.Player when ready
    const initPlayer = () => {
      const YT = (window as any).YT;
      if (YT && YT.Player && !playerRef.current && containerRef.current) {
        containerRef.current.innerHTML = "";
        const playerDiv = document.createElement("div");
        playerDiv.id = "yt-player";
        containerRef.current.appendChild(playerDiv);

        playerRef.current = new YT.Player("yt-player", {
          height: "1",
          width: "1",
          videoId: initialPlaylists[currentTrack].youtubeId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0
          },
          events: {
            onReady: (event: any) => {
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              if (event.data === 0) {
                nextTrack();
              }
            }
          }
        });
      }
    };

    const checkYT = () => {
      const YT = (window as any).YT;
      if (YT && YT.Player) {
        initPlayer();
      } else {
        setTimeout(checkYT, 100);
      }
    };
    checkYT();

    // 3. Fetch iTunes Artwork
    const fetchArtworks = async () => {
      const updated = await Promise.all(
        initialPlaylists.map(async (track) => {
          try {
            const res = await fetch(`/api/itunes?term=${encodeURIComponent(track.query)}`);
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              return {
                ...track,
                artwork: data.results[0].artworkUrl100
              };
            }
          } catch (e) {
            console.error("iTunes artwork fetch failed for: " + track.title, e);
          }
          return {
            ...track,
            artwork: undefined
          };
        })
      );
      setTracks(updated);
    };
    fetchArtworks();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  // Update song source when track changes
  useEffect(() => {
    const player = playerRef.current;
    if (player && typeof player.loadVideoById === "function") {
      const activeTrack = tracks[currentTrack];
      if (activeTrack) {
        player.loadVideoById({
          videoId: activeTrack.youtubeId,
          startSeconds: 0
        });
        setCurrentTime(0);
        if (isPlaying) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      }
    }
  }, [currentTrack, tracks]);

  // Handle play/pause toggles
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      if (isPlaying) {
        if (typeof player.playVideo === "function") {
          player.playVideo();
        }
      } else {
        if (typeof player.pauseVideo === "function") {
          player.pauseVideo();
        }
      }
    }
  }, [isPlaying]);

  // Keep progress bar and timers updated at all times
  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === "function" && typeof player.getDuration === "function") {
        const time = player.getCurrentTime() || 0;
        const dur = player.getDuration() || 0;
        setCurrentTime(time);
        if (dur) setDuration(dur);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

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
    setCurrentTrack(prev => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const player = playerRef.current;
    if (!player || typeof player.seekTo !== "function" || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const seconds = pct * duration;
    player.seekTo(seconds, true);
    setCurrentTime(seconds);
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
            <div style={{ width: "60px", height: "60px", borderRadius: "12px", backgroundColor: "var(--palette-surface)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {nowPlaying?.artwork ? (
                <img src={nowPlaying.artwork} alt={nowPlaying.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "28px" }}>{nowPlaying?.emoji || "🎵"}</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>{nowPlaying?.title || "Loading..."}</h3>
              <p style={{ fontSize: "14px", color: "var(--palette-text-secondary)" }}>{nowPlaying?.artist || "Please wait"} · {formatTime(duration)}</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button onClick={prevTrack} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>⏮️</button>
              <button onClick={togglePlay} style={{ fontSize: "32px", background: "none", border: "none", cursor: "pointer" }}>{isPlaying ? "⏸️" : "▶️"}</button>
              <button onClick={nextTrack} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>⏭️</button>
            </div>
          </div>

          {/* Hidden YouTube Iframe Player container */}
          <div 
            ref={containerRef}
            style={{ position: "fixed", top: "-9999px", width: "1px", height: "1px", overflow: "hidden", pointerEvents: "none" }} 
          />

          {/* Audio progress bar & time */}
          <div style={{ marginTop: "16px" }}>
            <div onClick={seekTo} style={{ height: "4px", borderRadius: "999px", backgroundColor: "var(--palette-progress-track)", cursor: "pointer", position: "relative" }}>
              <div style={{ width: `${progress}%`, height: "100%", borderRadius: "999px", backgroundColor: "var(--palette-progress-fill)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--palette-text-secondary)", marginTop: "6px" }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
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
                <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: song.color, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {song.artwork ? (
                    <img src={song.artwork} alt={song.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "24px" }}>{song.emoji}</span>
                  )}
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