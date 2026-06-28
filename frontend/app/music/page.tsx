"use client";

import Link from "next/link";

const playlists = [
  { id: 1, title: "Snowfall", artist: "Øneheart & reidenshi", mood: "Chill", color: "#DDF4FF", emoji: "❄️", duration: "3:24" },
  { id: 2, title: "Sweater Weather", artist: "The Neighbourhood", mood: "Melancholy", color: "#EAD9FF", emoji: "🌙", duration: "4:00" },
  { id: 3, title: "golden hour", artist: "JVKE", mood: "Happy", color: "#FFF4C2", emoji: "☀️", duration: "3:29" },
  { id: 4, title: "Glimpse of Us", artist: "Joji", mood: "Peaceful", color: "#FFD9E8", emoji: "🌸", duration: "3:57" },
  { id: 5, title: "Heather", artist: "Conan Gray", mood: "Calm", color: "#D9FBE5", emoji: "🌿", duration: "3:31" },
  { id: 6, title: "Exile", artist: "Taylor Swift ft. Bon Iver", mood: "Calm", color: "#D9FBE5", emoji: "🌿", duration: "4:45" },
];

const moods = ["All", "Chill", "Peaceful", "Happy", "Calm", "Energetic", "Melancholy"];

export default function Music() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFDF9", fontFamily: "system-ui, sans-serif" }}>

      <header style={{ backgroundColor: "rgba(255,253,249,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #FFD9E8", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#FFB7D5" }}>🎨 Palette</h1>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#FFB7D5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 24px 100px 24px" }}>

        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Music 🎵</h2>
          <p style={{ fontSize: "14px", color: "#999", marginTop: "4px" }}>Music that matches your mood</p>
        </div>

        {/* Now Playing */}
        <div style={{ padding: "24px", borderRadius: "20px", background: "linear-gradient(135deg, #FFD9E8, #EAD9FF)", marginBottom: "32px", boxShadow: "0 4px 20px rgba(255,182,193,0.2)" }}>
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>NOW PLAYING</p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "12px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>❄️</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Snowfall</h3>
              <p style={{ fontSize: "14px", color: "#666" }}>Øneheart · 3:24</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>⏮️</button>
              <button style={{ fontSize: "32px", background: "none", border: "none", cursor: "pointer" }}>▶️</button>
              <button style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>⏭️</button>
            </div>
          </div>
          {/* Progress Bar */}
          <div style={{ marginTop: "16px", height: "4px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.5)" }}>
            <div style={{ width: "35%", height: "100%", borderRadius: "999px", backgroundColor: "white" }} />
          </div>
        </div>

        {/* Mood Filter */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px" }}>
          {moods.map(mood => (
            <button
              key={mood}
              style={{ padding: "8px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: "500", whiteSpace: "nowrap", cursor: "pointer", backgroundColor: mood === "All" ? "#FFD9E8" : "white", border: `1px solid ${mood === "All" ? "#FFB7D5" : "#eee"}`, color: mood === "All" ? "#2E2E2E" : "#888" }}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Song List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {playlists.map((song) => (
            <div
              key={song.id}
              style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", backgroundColor: "white", border: "1px solid #FFD9E8", cursor: "pointer" }}
            >
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: song.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                {song.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600" }}>{song.title}</h3>
                <p style={{ fontSize: "12px", color: "#999" }}>{song.artist}</p>
              </div>
              <span style={{ fontSize: "12px", color: "#ccc", marginRight: "8px" }}>{song.mood}</span>
              <span style={{ fontSize: "12px", color: "#999" }}>{song.duration}</span>
              <button style={{ fontSize: "18px", background: "none", border: "none", cursor: "pointer" }}>▶️</button>
            </div>
          ))}
        </div>
      </main>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(255,253,249,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid #FFD9E8", zIndex: 50 }}>
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
              <span style={{ fontSize: "11px", color: "#ccc" }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}