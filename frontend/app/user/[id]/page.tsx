"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";

interface UserProfileData {
  id: number;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  board_count: number;
  is_following: boolean;
}

interface BoardData {
  id: number;
  title: string;
  cover_color: string;
  cover_emoji: string;
  pins_count?: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? Number(params.id) : null;

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (api.isLoggedIn()) {
      api.getProfile().then(p => setCurrentUserId(p.id)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      api.getUserProfile(userId),
      api.getPublicBoards(),
    ])
      .then(([userRes, publicBoards]) => {
        setProfile(userRes);
        const userBoards = publicBoards.filter((b: any) => b.owner_id === userId);
        setBoards(userBoards);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleToggleFollow = async () => {
    if (!userId || !profile) return;
    if (!api.isLoggedIn()) {
      router.push("/auth/login");
      return;
    }
    try {
      if (profile.is_following) {
        await api.unfollowUser(userId);
        setProfile(prev => prev ? {
          ...prev,
          is_following: false,
          followers_count: Math.max(0, prev.followers_count - 1),
        } : null);
      } else {
        await api.followUser(userId);
        setProfile(prev => prev ? {
          ...prev,
          is_following: true,
          followers_count: prev.followers_count + 1,
        } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const displayName = profile?.full_name || profile?.username || "User";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", fontFamily: "system-ui, sans-serif" }}>

      <header style={{ backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--palette-border)", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="responsive-header" style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", color: "var(--palette-text)", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--palette-pink)" }}>🎨 Palette</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="responsive-main" style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 16px" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--palette-text-muted)" }}>
            <p style={{ fontSize: "18px" }}>Loading profile...</p>
          </div>
        ) : error || !profile ? (
          <div style={{ textAlign: "center", padding: "80px 0", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", borderRadius: "24px" }}>
            <span style={{ fontSize: "48px" }}>🔍</span>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginTop: "16px" }}>User Not Found</h2>
            <p style={{ color: "var(--palette-text-muted)", marginTop: "8px", marginBottom: "24px" }}>This user profile does not exist.</p>
            <Link href="/" style={{ padding: "10px 24px", borderRadius: "999px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", textDecoration: "none", fontWeight: "600" }}>
              Go Back Home
            </Link>
          </div>
        ) : (
          <div>
            <div className="responsive-profile-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px", borderRadius: "24px", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", padding: "32px" }}>

              <div
                style={{
                  width: "96px", height: "96px", borderRadius: "50%",
                  backgroundColor: "var(--palette-pink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "40px", marginBottom: "16px",
                  overflow: "hidden",
                  border: "3px solid var(--palette-pink)",
                }}
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  "🌸"
                )}
              </div>

              <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>{displayName}</h2>
              <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", marginBottom: "8px" }}>@{profile.username}</p>

              {profile.bio && (
                <p style={{ fontSize: "13px", color: "var(--palette-text-secondary)", marginBottom: "16px", textAlign: "center", maxWidth: "400px" }}>
                  {profile.bio}
                </p>
              )}

              <div className="responsive-stats" style={{ display: "flex", gap: "24px", marginBottom: "20px" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "20px", fontWeight: "700" }}>{boards.length}</p>
                  <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>Boards</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "20px", fontWeight: "700" }}>{profile.followers_count}</p>
                  <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>Followers</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "20px", fontWeight: "700" }}>{profile.following_count}</p>
                  <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>Following</p>
                </div>
              </div>

              {currentUserId !== profile.id && (
                <button
                  onClick={handleToggleFollow}
                  style={{
                    padding: "10px 32px", borderRadius: "999px",
                    backgroundColor: profile.is_following ? "var(--palette-border)" : "var(--palette-pink)",
                    color: profile.is_following ? "var(--palette-text)" : "white",
                    fontSize: "14px", fontWeight: "600",
                    border: "none", cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {profile.is_following ? "Following ✓" : "+ Follow"}
                </button>
              )}
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Public Boards</h3>
            {boards.length === 0 ? (
              <p style={{ fontSize: "14px", color: "var(--palette-text-muted)", textAlign: "center", padding: "40px 0" }}>No public boards yet 🌸</p>
            ) : (
              <div className="responsive-grid">
                {boards.map((board) => (
                  <div key={board.id} style={{ breakInside: "avoid", marginBottom: "16px" }}>
                    <Link
                      href={`/boards/${board.id}`}
                      style={{ display: "block", textDecoration: "none", color: "inherit" }}
                    >
                      <div style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", cursor: "pointer" }}>
                        <div style={{ backgroundColor: board.cover_color, height: "140px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                          {board.cover_emoji}
                        </div>
                        <div style={{ padding: "12px" }}>
                          <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{board.title}</h3>
                          <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>{board.pins_count || 0} pins</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
