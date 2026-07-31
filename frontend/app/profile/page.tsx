"use client";

import { useState, useEffect, useRef } from "react";
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

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
}

export default function Profile() {
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Load profile from API or localStorage fallback
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

    // Try fetching from API first
    api.getProfile().then((data) => {
      setProfile(data);
      // Sync to localStorage
      localStorage.setItem("palette_profile", JSON.stringify(data));
    }).catch(() => {
      // Fallback to localStorage profile
      const saved = localStorage.getItem("palette_profile");
      if (saved) {
        try { setProfile(JSON.parse(saved)); } catch { /* ignore */ }
      } else {
        // Default profile for non-authenticated users
        setProfile({
          id: 0,
          username: "abisha",
          email: "abisha@palette.app",
          full_name: "Abisha",
          avatar_url: null,
          bio: null,
          followers_count: 0,
          following_count: 0,
        });
      }
    });
  }, []);

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (profile) {
        const updated = { ...profile, avatar_url: dataUrl };
        setProfile(updated);
        localStorage.setItem("palette_profile", JSON.stringify(updated));
        // Try to save to API too
        api.updateProfile({ avatar_url: dataUrl }).catch(() => {});
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const openEditModal = () => {
    if (profile) {
      setEditName(profile.full_name || profile.username);
      setEditBio(profile.bio || "");
      setEditAvatar(profile.avatar_url);
      setError("");
    }
    setShowEditModal(true);
  };

  const handleModalAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditAvatar(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setError("");

    const updates: { full_name?: string; bio?: string; avatar_url?: string } = {};
    if (editName !== (profile.full_name || profile.username)) updates.full_name = editName;
    if (editBio !== (profile.bio || "")) updates.bio = editBio;
    if (editAvatar !== profile.avatar_url) updates.avatar_url = editAvatar || "";

    try {
      const updated = await api.updateProfile(updates);
      setProfile(updated);
      localStorage.setItem("palette_profile", JSON.stringify(updated));
      setShowEditModal(false);
    } catch {
      // Fallback: save locally even if API fails
      const updated = {
        ...profile,
        full_name: editName,
        bio: editBio,
        avatar_url: editAvatar,
      };
      setProfile(updated);
      localStorage.setItem("palette_profile", JSON.stringify(updated));
      setShowEditModal(false);
    }
    setSaving(false);
  };

  const displayName = profile?.full_name || profile?.username || "Abisha";
  const displayUsername = profile?.username || "abisha";

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

          {/* Avatar with upload */}
          <div
            onClick={handleAvatarClick}
            style={{
              width: "96px", height: "96px", borderRadius: "50%",
              backgroundColor: "var(--palette-pink)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "40px", marginBottom: "16px", cursor: "pointer",
              overflow: "hidden", position: "relative",
              border: "3px solid var(--palette-pink)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              "🌸"
            )}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              backgroundColor: "rgba(0,0,0,0.5)", color: "white",
              fontSize: "10px", textAlign: "center", padding: "2px 0",
            }}>
              📷
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
            }}
          />

          {/* Name & Username */}
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>{displayName}</h2>
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", marginBottom: "4px" }}>@{displayUsername}</p>

          {/* Bio */}
          {profile?.bio && (
            <p style={{ fontSize: "13px", color: "var(--palette-text-secondary)", marginBottom: "16px", textAlign: "center", maxWidth: "400px" }}>
              {profile.bio}
            </p>
          )}
          {!profile?.bio && (
            <p
              onClick={openEditModal}
              style={{ fontSize: "13px", color: "var(--palette-text-faint)", marginBottom: "16px", cursor: "pointer", fontStyle: "italic" }}
            >
              + Add a bio
            </p>
          )}

          {/* Stats */}
          <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
            {[
              { label: "Boards", value: String(boards.length) },
              { label: "Followers", value: String(profile?.followers_count ?? 0) },
              { label: "Following", value: String(profile?.following_count ?? 0) },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: "700" }}>{stat.value}</p>
                <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={openEditModal}
              style={{
                padding: "10px 24px", borderRadius: "999px",
                backgroundColor: "var(--palette-pink)", color: "white",
                fontSize: "14px", fontWeight: "600",
                border: "none", cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              ✏️ Edit Profile
            </button>
            <Link href="/create" style={{ padding: "10px 24px", borderRadius: "999px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
              + Create Board
            </Link>
          </div>
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>My Boards</h3>
        {boards.length === 0 && (
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", textAlign: "center", padding: "40px 0" }}>No boards yet. Create your first one! 🌸</p>
        )}
        <div style={{ columns: "4", gap: "16px" }}>
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              style={{ display: "block", textDecoration: "none", color: "inherit", breakInside: "avoid", marginBottom: "16px" }}
            >
              <div style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", cursor: "pointer" }}>
                <div style={{ backgroundColor: board.color, height: "140px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                  {board.emoji}
                </div>
                <div style={{ padding: "12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{board.title}</h3>
                  <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>{board.pins} pins</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--palette-surface)",
              borderRadius: "24px", padding: "32px",
              width: "100%", maxWidth: "440px",
              border: "1px solid var(--palette-border)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", textAlign: "center" }}>Edit Profile</h2>

            {/* Modal Avatar */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <div
                onClick={() => modalFileInputRef.current?.click()}
                style={{
                  width: "80px", height: "80px", borderRadius: "50%",
                  backgroundColor: "var(--palette-pink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "32px", cursor: "pointer", overflow: "hidden",
                  border: "3px solid var(--palette-pink)",
                  position: "relative",
                }}
              >
                {editAvatar ? (
                  <img src={editAvatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  "🌸"
                )}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  backgroundColor: "rgba(0,0,0,0.5)", color: "white",
                  fontSize: "9px", textAlign: "center", padding: "2px 0",
                }}>
                  Change
                </div>
              </div>
              <input
                ref={modalFileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleModalAvatarUpload(file);
                }}
              />
            </div>

            {/* Name Field */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-muted)", display: "block", marginBottom: "6px" }}>Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "12px",
                  border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-bg)",
                  color: "var(--palette-text)", fontSize: "14px", outline: "none",
                  boxSizing: "border-box",
                }}
                placeholder="Your name"
              />
            </div>

            {/* Bio Field */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-muted)", display: "block", marginBottom: "6px" }}>Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "12px",
                  border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-bg)",
                  color: "var(--palette-text)", fontSize: "14px", outline: "none",
                  resize: "vertical", fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Error */}
            {error && (
              <p style={{ fontSize: "13px", color: "#ef4444", marginBottom: "12px", textAlign: "center" }}>{error}</p>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: "12px",
                  border: "1px solid var(--palette-border)", backgroundColor: "transparent",
                  color: "var(--palette-text)", fontSize: "14px", fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  flex: 1, padding: "10px", borderRadius: "12px",
                  border: "none", backgroundColor: "var(--palette-pink)",
                  color: "white", fontSize: "14px", fontWeight: "600",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

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