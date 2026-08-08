"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";


const categories = ["📌 For You", "🎵 Music", "💖 Cute", "🌸 Aesthetic", "🌿 Nature", "📚 Study", "🎮 Gaming"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("📌 For You");
  const [liked, setLiked] = useState<number[]>([]);
  const [apiBoards, setApiBoards] = useState<Array<{ id: number; title: string; author: string; likes: string; pins: number; color: string; emoji: string; category: string }>>([]);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real boards from API
    api.getBoards().then((data) => {
      const mapped = data.map((b: { id: number; title: string; cover_color: string; cover_emoji: string; description?: string }) => ({
        id: b.id,
        title: b.title,
        author: "You",
        likes: "0",
        pins: 0,
        color: b.cover_color,
        emoji: b.cover_emoji,
        category: "",
      }));
      setApiBoards(mapped);
    }).catch(() => {});

    // Fetch logged-in user name
    if (api.isLoggedIn()) {
      api.getProfile().then((data) => {
        setUserName(data.full_name || data.username || null);
      }).catch(() => {
        setUserName(null);
      });
    }
  }, []);

  const toggleLike = (id: number) => {
    setLiked(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Derive the category label (strip emoji prefix) from the active pill
  const activeCategoryLabel = activeCategory.replace(/^[^\s]+\s/, "");

  // Filter and sort boards based on active category
  const filteredBoards = (() => {
    if (activeCategoryLabel === "For You") return apiBoards;
    return apiBoards.filter(
      (board) => board.category.toLowerCase() === activeCategoryLabel.toLowerCase()
    );
  })();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", color: "var(--palette-text)", fontFamily: "system-ui, sans-serif" }}>

      {/* Top Navigation */}
      <header style={{ backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--palette-border)", position: "sticky", top: 0, zIndex: 50, width: "100%" }}>
        <div className="responsive-header" style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--palette-pink)", whiteSpace: "nowrap" }}>🎨 Palette</h1>
          <input
            type="text"
            placeholder="🔍 Search boards, moods, music..."
            className="responsive-search"
            style={{ flex: 1, maxWidth: "500px", padding: "10px 20px", borderRadius: "999px", border: "none", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", fontSize: "14px", outline: "none" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <button style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>🔔</button>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--palette-pink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>{userName ? userName.charAt(0).toUpperCase() : "?"}</div>
          </div>
        </div>
      </header>

      <main className="responsive-main" style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Greeting */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>{userName ? `Welcome, ${userName} 🌸` : "Welcome to Palette 🌸"}</h2>
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
                backgroundColor: activeCategory === cat ? "var(--palette-pink)" : "var(--palette-surface)",
                border: `1px solid ${activeCategory === cat ? "var(--palette-pink)" : "var(--palette-border-subtle)"}`,
                color: activeCategory === cat ? "#fff" : "var(--palette-text-secondary)",
                transition: "all 0.2s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="responsive-grid">
          {filteredBoards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              style={{ display: "block", textDecoration: "none", color: "inherit", breakInside: "avoid", marginBottom: "16px" }}
            >
              <div
                style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", boxShadow: `0 2px 12px var(--palette-shadow)`, cursor: "pointer" }}
              >
                <div style={{ backgroundColor: board.color, height: `${140 + (Math.abs(board.id) % 3) * 40}px`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                  {board.emoji}
                </div>
                <div style={{ padding: "12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{board.title}</h3>
                  <p style={{ fontSize: "12px", color: "var(--palette-text-muted)", marginBottom: "8px" }}>by {board.author} · {board.pins} pins</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "var(--palette-text-faint)" }}>♫ Snowfall</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleLike(board.id);
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--palette-text)", fontSize: "13px" }}
                    >
                      {liked.includes(board.id) ? "❤️" : "🤍"} {board.likes}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
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