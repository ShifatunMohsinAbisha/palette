"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const boards = [
  { id: 1, title: "Cherry Blossom Afternoon", author: "Luna", likes: "2.3K", pins: 45, color: "#FFD9E8", emoji: "🌸" },
  { id: 2, title: "Midnight Study Vibes", author: "Aria", likes: "1.8K", pins: 32, color: "#EAD9FF", emoji: "🌙" },
  { id: 3, title: "Ocean Daydream", author: "Mira", likes: "3.1K", pins: 67, color: "#DDF4FF", emoji: "🌊" },
  { id: 4, title: "Golden Hour", author: "Sol", likes: "4.2K", pins: 89, color: "#FFF4C2", emoji: "☀️" },
  { id: 5, title: "Forest Whispers", author: "Fern", likes: "986", pins: 28, color: "#D9FBE5", emoji: "🌿" },
  { id: 6, title: "Neon Tokyo Nights", author: "Kei", likes: "5.7K", pins: 112, color: "#EAD9FF", emoji: "🏙️" },
  { id: 7, title: "Cottagecore Dreams", author: "Rose", likes: "2.9K", pins: 54, color: "#D9FBE5", emoji: "🌷" },
  { id: 8, title: "Rainy Day Jazz", author: "Blue", likes: "1.2K", pins: 19, color: "#DDF4FF", emoji: "🎵" },
];

const categories = ["✨ Trending", "📌 For You", "🎵 Music", "💖 Cute", "🌸 Aesthetic", "🌿 Nature", "📚 Study", "🎮 Gaming"];

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const [activeCategory, setActiveCategory] = useState("✨ Trending");
  const [liked, setLiked] = useState<number[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const toggleLike = (id: number) => {
    setLiked(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", color: "var(--palette-text)", fontFamily: "system-ui, sans-serif" }}>

      {/* Top Navigation */}
      <header style={{ backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--palette-border)", position: "sticky", top: 0, zIndex: 50, width: "100%" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--palette-pink)", whiteSpace: "nowrap" }}>🎨 Palette</h1>
          <input
            type="text"
            placeholder="🔍 Search boards, moods, music..."
            style={{ flex: 1, maxWidth: "500px", padding: "10px 20px", borderRadius: "999px", border: "none", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", fontSize: "14px", outline: "none" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <button style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>🔔</button>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--palette-pink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 24px 100px 24px" }}>

        {/* Greeting */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>{greeting}, Abisha 🌸</h2>
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", marginTop: "4px" }}>Discover boards that match your mood today</p>
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
                backgroundColor: activeCategory === cat ? "var(--palette-primary)" : "var(--palette-surface)",
                border: `1px solid ${activeCategory === cat ? "var(--palette-border-active)" : "var(--palette-border-subtle)"}`,
                color: activeCategory === cat ? "var(--palette-text)" : "var(--palette-text-secondary)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div style={{ columns: "4", gap: "16px" }}>
          {boards.map((board) => (
            <div
              key={board.id}
              style={{ breakInside: "avoid", marginBottom: "16px", borderRadius: "16px", overflow: "hidden", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", boxShadow: `0 2px 12px var(--palette-shadow)`, cursor: "pointer" }}
            >
              <div style={{ backgroundColor: board.color, height: `${140 + (board.id % 3) * 40}px`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                {board.emoji}
              </div>
              <div style={{ padding: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{board.title}</h3>
                <p style={{ fontSize: "12px", color: "var(--palette-text-muted)", marginBottom: "8px" }}>by {board.author} · {board.pins} pins</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "var(--palette-text-faint)" }}>♫ Snowfall</span>
                  <button onClick={() => toggleLike(board.id)} style={{ fontSize: "13px", background: "none", border: "none", cursor: "pointer", color: "var(--palette-text)" }}>
                    {liked.includes(board.id) ? "❤️" : "🤍"} {board.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
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