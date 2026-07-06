"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";

interface BoardData {
  id: number;
  title: string;
  pins: number;
  color: string;
  emoji: string;
}

export default function Profile() {
  const [boards, setBoards] = useState<BoardData[]>([]);

  useEffect(() => {
    api.getBoards().then((data) => {
      const mapped = data.map((b: { id: number; title: string; cover_color: string; cover_emoji: string }) => ({
        id: b.id,
        title: b.title,
        pins: 0,
        color: b.cover_color,
        emoji: b.cover_emoji,
      }));
      setBoards(mapped);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", fontFamily: "system-ui, sans-serif" }}>

      <header style={{ backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--palette-border)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--palette-pink)" }}>Palette</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--palette-pink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 24px 100px 24px" }}>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px", padding: "40px", borderRadius: "24px", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)" }}>
          <div style={{ width: "96px", height: "96px", borderRadius: "50%", backgroundColor: "var(--palette-pink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", marginBottom: "16px" }}>
            🌸
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>Abisha</h2>
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", marginBottom: "16px" }}>@abisha</p>

          <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
            {[
              { label: "Boards", value: String(boards.length) },
              { label: "Followers", value: "1.2K" },
              { label: "Following", value: "348" },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: "700" }}>{stat.value}</p>
                <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          <Link href="/create" style={{ padding: "10px 24px", borderRadius: "999px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
            + Create Board
          </Link>
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>My Boards</h3>
        {boards.length === 0 && (
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", textAlign: "center", padding: "40px 0" }}>No boards yet. Create your first one! 🌸</p>
        )}
        <div style={{ columns: "4", gap: "16px" }}>
          {boards.map((board) => (
            <div key={board.id} style={{ breakInside: "avoid", marginBottom: "16px", borderRadius: "16px", overflow: "hidden", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", cursor: "pointer" }}>
              <div style={{ backgroundColor: board.color, height: "140px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                {board.emoji}
              </div>
              <div style={{ padding: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{board.title}</h3>
                <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>{board.pins} pins</p>
              </div>
            </div>
          ))}
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