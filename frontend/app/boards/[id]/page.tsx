"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface BoardData {
  id: number;
  title: string;
  description: string | null;
  cover_color: string;
  cover_emoji: string;
  is_private: boolean;
  owner_id: number | null;
  created_at: string;
}

const demoBoards = [
  { id: -1, title: "Cherry Blossom Afternoon", author: "Luna", likes: "2.3K", pins: 45, color: "#FFD9E8", emoji: "🌸" },
  { id: -2, title: "Midnight Study Vibes", author: "Aria", likes: "1.8K", pins: 32, color: "#EAD9FF", emoji: "🌙" },
  { id: -3, title: "Ocean Daydream", author: "Mira", likes: "3.1K", pins: 67, color: "#DDF4FF", emoji: "🌊" },
  { id: -4, title: "Golden Hour", author: "Sol", likes: "4.2K", pins: 89, color: "#FFF4C2", emoji: "☀️" },
  { id: -5, title: "Forest Whispers", author: "Fern", likes: "986", pins: 28, color: "#D9FBE5", emoji: "🌿" },
  { id: -6, title: "Neon Tokyo Nights", author: "Kei", likes: "5.7K", pins: 112, color: "#EAD9FF", emoji: "🏙️" },
  { id: -7, title: "Cottagecore Dreams", author: "Rose", likes: "2.9K", pins: 54, color: "#D9FBE5", emoji: "🌷" },
  { id: -8, title: "Rainy Day Jazz", author: "Blue", likes: "1.2K", pins: 19, color: "#DDF4FF", emoji: "🎵" },
];

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const numericId = Number(id);
    if (!isNaN(numericId) && numericId < 0) {
      const demo = demoBoards.find(b => b.id === numericId);
      if (demo) {
        setBoard({
          id: demo.id,
          title: demo.title,
          description: `A beautiful mood board by ${demo.author} with ${demo.pins} pins and ${demo.likes} likes.`,
          cover_color: demo.color,
          cover_emoji: demo.emoji,
          is_private: false,
          owner_id: null,
          created_at: new Date().toISOString(),
        });
        setError(false);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    fetch(`http://127.0.0.1:8000/boards/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Board not found");
        return res.json();
      })
      .then((data) => {
        setBoard(data);
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", color: "var(--palette-text)", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Top Header */}
      <header style={{ backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--palette-border)", position: "sticky", top: 0, zIndex: 50, width: "100%" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button 
            onClick={() => router.back()} 
            style={{ background: "none", border: "none", color: "var(--palette-text)", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--palette-pink)" }}>🎨 Board Details</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--palette-pink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px 100px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--palette-text-muted)" }}>
            <p style={{ fontSize: "18px" }}>Loading board details...</p>
          </div>
        ) : error || !board ? (
          <div style={{ textAlign: "center", padding: "80px 0", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", borderRadius: "24px" }}>
            <span style={{ fontSize: "48px" }}>🔍</span>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginTop: "16px" }}>Board Not Found</h2>
            <p style={{ color: "var(--palette-text-muted)", marginTop: "8px", marginBottom: "24px" }}>This board might have been deleted or does not exist.</p>
            <Link href="/" style={{ padding: "10px 24px", borderRadius: "999px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", textDecoration: "none", fontWeight: "600" }}>
              Go Back Home
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Banner Cover */}
            <div style={{ backgroundColor: board.cover_color, height: "240px", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "72px", boxShadow: "0 4px 20px var(--palette-shadow)" }}>
              {board.cover_emoji}
            </div>

            {/* Info Box */}
            <div style={{ padding: "32px", borderRadius: "24px", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", boxShadow: "0 2px 12px var(--palette-shadow)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "999px", backgroundColor: board.is_private ? "var(--palette-border)" : "var(--palette-primary)", color: "var(--palette-text)", fontWeight: "600" }}>
                  {board.is_private ? "🔒 Private" : "🌐 Public"}
                </span>
                <span style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>
                  Created on {new Date(board.created_at).toLocaleDateString()}
                </span>
              </div>

              <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px" }}>{board.title}</h2>
              
              <p style={{ fontSize: "16px", color: "var(--palette-text-secondary)", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                {board.description || "No description provided for this board."}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Footer */}
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
