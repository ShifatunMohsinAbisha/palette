"use client";

import { useState } from "react";
import Link from "next/link";

const exploreBoards = [
  { id: 1, title: "Cherry Blossom Afternoon", author: "Luna", likes: "2.3K", pins: 45, color: "#FFD9E8", emoji: "🌸", category: "Aesthetic" },
  { id: 2, title: "Midnight Study Vibes", author: "Aria", likes: "1.8K", pins: 32, color: "#EAD9FF", emoji: "🌙", category: "Study" },
  { id: 3, title: "Ocean Daydream", author: "Mira", likes: "3.1K", pins: 67, color: "#DDF4FF", emoji: "🌊", category: "Nature" },
  { id: 4, title: "Golden Hour", author: "Sol", likes: "4.2K", pins: 89, color: "#FFF4C2", emoji: "☀️", category: "Aesthetic" },
  { id: 5, title: "Forest Whispers", author: "Fern", likes: "986", pins: 28, color: "#D9FBE5", emoji: "🌿", category: "Nature" },
  { id: 6, title: "Neon Tokyo Nights", author: "Kei", likes: "5.7K", pins: 112, color: "#EAD9FF", emoji: "🏙️", category: "Gaming" },
  { id: 7, title: "Cottagecore Dreams", author: "Rose", likes: "2.9K", pins: 54, color: "#D9FBE5", emoji: "🌷", category: "Cute" },
  { id: 8, title: "Rainy Day Jazz", author: "Blue", likes: "1.2K", pins: 19, color: "#DDF4FF", emoji: "🎵", category: "Music" },
  { id: 9, title: "Anime Wonderland", author: "Yuki", likes: "8.1K", pins: 134, color: "#FFD9E8", emoji: "🌺", category: "Anime" },
  { id: 10, title: "Dark Academia", author: "Sage", likes: "6.3K", pins: 98, color: "#EAD9FF", emoji: "📚", category: "Study" },
  { id: 11, title: "Pastel Dreams", author: "Lily", likes: "3.7K", pins: 76, color: "#FFF4C2", emoji: "🎀", category: "Cute" },
  { id: 12, title: "Lo-fi Beats", author: "Coda", likes: "4.9K", pins: 61, color: "#D9FBE5", emoji: "🎧", category: "Music" },
];

const categories = ["All", "Aesthetic", "Study", "Nature", "Music", "Cute", "Gaming", "Anime"];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [liked, setLiked] = useState<number[]>([]);

  const filtered = activeCategory === "All" ? exploreBoards : exploreBoards.filter(b => b.category === activeCategory);

  const toggleLike = (id: number) => {
    setLiked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFDF9", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ backgroundColor: "rgba(255,253,249,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #FFD9E8", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#FFB7D5" }}>🎨 Palette</h1>
          <input
            type="text"
            placeholder="🔍 Search boards, moods, music..."
            style={{ flex: 1, maxWidth: "500px", padding: "10px 20px", borderRadius: "999px", border: "none", backgroundColor: "#FFD9E8", color: "#2E2E2E", fontSize: "14px", outline: "none" }}
          />
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#FFB7D5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 24px 100px 24px" }}>

        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Explore 🔍</h2>
          <p style={{ fontSize: "14px", color: "#999", marginTop: "4px" }}>Discover beautiful boards from creators around the world</p>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                cursor: "pointer",
                backgroundColor: activeCategory === cat ? "#FFD9E8" : "white",
                border: `1px solid ${activeCategory === cat ? "#FFB7D5" : "#eee"}`,
                color: activeCategory === cat ? "#2E2E2E" : "#888",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ columns: "4", gap: "16px" }}>
          {filtered.map((board) => (
            <div
              key={board.id}
              style={{ breakInside: "avoid", marginBottom: "16px", borderRadius: "16px", overflow: "hidden", backgroundColor: "white", border: "1px solid #FFD9E8", boxShadow: "0 2px 12px rgba(255,182,193,0.1)", cursor: "pointer" }}
            >
              <div style={{ backgroundColor: board.color, height: `${140 + (board.id % 3) * 40}px`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                {board.emoji}
              </div>
              <div style={{ padding: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{board.title}</h3>
                <p style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>by {board.author} · {board.pins} pins</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#ccc" }}>♫ Snowfall</span>
                  <button onClick={() => toggleLike(board.id)} style={{ fontSize: "13px", background: "none", border: "none", cursor: "pointer" }}>
                    {liked.includes(board.id) ? "❤️" : "🤍"} {board.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
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