"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const deleteBoard = async (boardId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this board?");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://palette-production-93ce.up.railway.app";
      const res = await fetch(`${baseUrl}/boards/${boardId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setBoards(prev => prev.filter(b => b.id !== boardId));
    } catch {
      alert("Failed to delete board. Please try again.");
    }
  };

  const handleLogout = () => {
    api.removeToken();
    localStorage.removeItem("palette_profile");
    router.push("/auth/login");
  };

  // Load profile from API — redirect if not logged in
  useEffect(() => {
    if (!api.isLoggedIn()) {
      router.push("/auth/login");
      return;
    }

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

    // Fetch real profile from API
    api.getProfile().then((data) => {
      setProfile(data);
      try {
        localStorage.setItem("palette_profile", JSON.stringify(data));
      } catch { /* ignore storage error */ }
    }).catch(() => {
      // Token might be expired — redirect to login
      api.removeToken();
      router.push("/auth/login");
    });
  }, [router]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 100;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(objectUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.5));
      };
      img.onerror = () => {
        resolve(objectUrl);
      };
      img.src = objectUrl;
    });
  };

  const handleAvatarUpload = async (file: File) => {
    const dataUrl = await compressImage(file);
    if (profile) {
      const updated = { ...profile, avatar_url: dataUrl };
      setProfile(updated);
      try {
        localStorage.setItem("palette_profile", JSON.stringify(updated));
      } catch {
        /* ignore storage error */
      }
      // Try to save to API too
      api.updateProfile({ avatar_url: dataUrl }).catch(() => {});
    }
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

  const handleModalAvatarUpload = async (file: File) => {
    const dataUrl = await compressImage(file);
    setEditAvatar(dataUrl);
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
      try {
        localStorage.setItem("palette_profile", JSON.stringify(updated));
      } catch {
        /* ignore storage error */
      }
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
      try {
        localStorage.setItem("palette_profile", JSON.stringify(updated));
      } catch {
        /* ignore storage error */
      }
      setShowEditModal(false);
    }
    setSaving(false);
  };

  const displayName = profile?.full_name || profile?.username || "Abisha";
  const displayUsername = profile?.username || "abisha";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", fontFamily: "system-ui, sans-serif" }}>

      <header style={{ backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--palette-border)", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="responsive-header" style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--palette-pink)" }}>Palette</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--palette-pink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
          </div>
        </div>
      </header>

      <main className="responsive-main" style={{ maxWidth: "1400px", margin: "0 auto" }}>

        <div className="responsive-profile-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px", borderRadius: "24px", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)" }}>

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
          <div className="responsive-stats" style={{ display: "flex", marginBottom: "20px" }}>
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
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
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
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 24px", borderRadius: "999px",
                backgroundColor: "var(--palette-danger)", color: "var(--palette-danger-text)",
                fontSize: "14px", fontWeight: "600",
                border: "none", cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>My Boards</h3>
        {boards.length === 0 && (
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", textAlign: "center", padding: "40px 0" }}>No boards yet. Create your first one! 🌸</p>
        )}
        <div className="responsive-grid">
          {boards.map((board) => (
            <div key={board.id} style={{ breakInside: "avoid", marginBottom: "16px", position: "relative" }}>
              <Link
                href={`/boards/${board.id}`}
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteBoard(board.id);
                }}
                style={{
                  position: "absolute", top: "8px", right: "8px",
                  width: "32px", height: "32px", borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", color: "white",
                  transition: "background-color 0.2s",
                  zIndex: 2,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")}
                title="Delete board"
              >
                🗑️
              </button>
            </div>
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