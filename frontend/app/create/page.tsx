"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";

const emojis = ["🌸", "🌙", "🌊", "☀️", "🌿", "🏙️", "🌷", "🎵", "🎨", "🌺", "📚", "🎀", "🎧", "🌈", "🦋"];
const colors = ["#FFD9E8", "#EAD9FF", "#DDF4FF", "#FFF4C2", "#D9FBE5", "#FFB7D5", "#CDB8FF", "#8DD7FF"];

export default function CreateBoard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#FFD9E8");
  const [selectedEmoji, setSelectedEmoji] = useState("🌸");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreateBoard = async () => {
    if (!title.trim()) {
      setError("Please enter a board name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.createBoard({
        title: title.trim(),
        description: description.trim() || undefined,
        cover_color: selectedColor,
        cover_emoji: selectedEmoji,
        is_private: isPrivate,
      });
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

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

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 24px 100px 24px" }}>

        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Create Board 🌸</h2>
        <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", marginBottom: "32px" }}>Make something beautiful</p>

        {/* Preview */}
        <div style={{ borderRadius: "20px", overflow: "hidden", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", marginBottom: "32px", boxShadow: `0 2px 12px var(--palette-shadow)` }}>
          <div style={{ backgroundColor: selectedColor, height: "180px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px" }}>
            {selectedEmoji}
          </div>
          <div style={{ padding: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{title || "Board Title"}</h3>
            <p style={{ fontSize: "13px", color: "var(--palette-text-muted)", marginTop: "4px" }}>{description || "Board description..."}</p>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          <div>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Board Name</label>
            <input
              type="text"
              placeholder="e.g. Cherry Blossom Afternoon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Description</label>
            <textarea
              placeholder="What is this board about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", resize: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", display: "block" }}>Pick an Emoji</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  style={{ fontSize: "24px", padding: "8px", borderRadius: "12px", border: `2px solid ${selectedEmoji === emoji ? "var(--palette-border-active)" : "transparent"}`, backgroundColor: selectedEmoji === emoji ? "var(--palette-primary)" : "var(--palette-surface)", cursor: "pointer" }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", display: "block" }}>Pick a Color</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: color, border: `3px solid ${selectedColor === color ? "var(--palette-text)" : "transparent"}`, cursor: "pointer" }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "12px", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600" }}>Private Board</p>
              <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>Only you can see this board</p>
            </div>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              style={{ width: "48px", height: "26px", borderRadius: "999px", backgroundColor: isPrivate ? "var(--palette-pink)" : "var(--palette-toggle-bg)", border: "none", cursor: "pointer", position: "relative" }}
            >
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "white", position: "absolute", top: "3px", left: isPrivate ? "25px" : "3px", transition: "left 0.2s" }} />
            </button>
          </div>

          {error && (
            <p style={{ fontSize: "14px", color: "var(--palette-danger-text)", marginBottom: "8px" }}>{error}</p>
          )}

          <button
            onClick={handleCreateBoard}
            disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", fontSize: "15px", fontWeight: "600", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating..." : "Create Board 🌸"}
          </button>
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