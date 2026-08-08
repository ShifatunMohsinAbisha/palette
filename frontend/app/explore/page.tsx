"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";

const categories = ["All", "Aesthetic", "Study", "Nature", "Music", "Cute", "Gaming", "Anime"];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [liked, setLiked] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [boards, setBoards] = useState<Array<{ id: number; title: string; author: string; author_username: string; owner_id?: number; likes_count: number; is_liked: boolean; pins: number; color: string; emoji: string; category: string }>>([]);

  useEffect(() => {
    api.getPublicBoards(searchQuery).then((data) => {
      const mapped = data.map((b: { id: number; title: string; cover_color: string; cover_emoji: string; author?: string; author_username?: string; owner_id?: number; pins_count?: number; likes_count?: number; is_liked?: boolean }) => ({
        id: b.id,
        title: b.title,
        author: b.author || "Anonymous",
        author_username: b.author_username || "",
        owner_id: b.owner_id,
        likes_count: b.likes_count || 0,
        is_liked: b.is_liked || false,
        pins: b.pins_count || 0,
        color: b.cover_color,
        emoji: b.cover_emoji,
        category: "Aesthetic",
      }));
      setBoards(mapped);
    }).catch(() => {});
  }, [searchQuery]);

  const filtered = boards.filter(b => {
    const matchesCategory = activeCategory === "All" || b.category === activeCategory;
    return matchesCategory;
  });

  const toggleLike = async (id: number, currentlyLiked: boolean) => {
    if (!api.isLoggedIn()) {
      window.location.href = "/auth/login";
      return;
    }
    try {
      if (currentlyLiked) {
        await api.unlikeBoard(id);
      } else {
        await api.likeBoard(id);
      }
      setBoards(prev => prev.map(b => {
        if (b.id === id) {
          const newLikes = currentlyLiked ? Math.max(0, b.likes_count - 1) : b.likes_count + 1;
          return { ...b, likes_count: newLikes, is_liked: !currentlyLiked };
        }
        return b;
      }));
    } catch { /* ignore */ }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--palette-border)", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="responsive-header" style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--palette-pink)" }}>🎨 Palette</h1>
          <input
            type="text"
            placeholder="🔍 Search boards, moods, music..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="responsive-search"
            style={{ flex: 1, maxWidth: "500px", padding: "10px 20px", borderRadius: "999px", border: "none", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", fontSize: "14px", outline: "none" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--palette-pink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
          </div>
        </div>
      </header>

      <main className="responsive-main" style={{ maxWidth: "1400px", margin: "0 auto" }}>

        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Explore 🔍</h2>
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", marginTop: "4px" }}>Discover beautiful boards from creators around the world</p>
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

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</p>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--palette-text)" }}>No boards found</p>
            <p style={{ fontSize: "13px", color: "var(--palette-text-muted)", marginTop: "4px" }}>Try a different search or category</p>
          </div>
        ) : (
          <div className="responsive-grid">
            {filtered.map((board) => (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                style={{ display: "block", textDecoration: "none", color: "inherit", breakInside: "avoid", marginBottom: "16px" }}
              >
                <div
                  style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", boxShadow: `0 2px 12px var(--palette-shadow)`, cursor: "pointer" }}
                >
                  <div style={{ backgroundColor: board.color, height: `${140 + (board.id % 3) * 40}px`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                    {board.emoji}
                  </div>
                  <div style={{ padding: "12px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{board.title}</h3>
                    <p style={{ fontSize: "12px", color: "var(--palette-text-muted)", marginBottom: "8px" }}>
                      by{" "}
                      {board.owner_id ? (
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/user/${board.owner_id}`;
                          }}
                          style={{ color: "var(--palette-pink)", fontWeight: "600", textDecoration: "underline" }}
                        >
                          {board.author}
                        </span>
                      ) : (
                        board.author
                      )}{" "}
                      · {board.pins} pins
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "var(--palette-text-faint)" }}>♫ Vibes</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(board.id, board.is_liked);
                        }}
                        style={{ fontSize: "13px", background: "none", border: "none", cursor: "pointer", color: "var(--palette-text)" }}
                      >
                        {board.is_liked ? "❤️" : "🤍"} {board.likes_count}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
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