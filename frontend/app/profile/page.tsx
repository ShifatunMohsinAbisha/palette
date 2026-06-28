"use client";

import Link from "next/link";

const userBoards = [
  { id: 1, title: "Cherry Blossom Afternoon", pins: 45, color: "#FFD9E8", emoji: "🌸" },
  { id: 2, title: "Midnight Study Vibes", pins: 32, color: "#EAD9FF", emoji: "🌙" },
  { id: 3, title: "Ocean Daydream", pins: 67, color: "#DDF4FF", emoji: "🌊" },
  { id: 4, title: "Golden Hour", pins: 89, color: "#FFF4C2", emoji: "☀️" },
];

export default function Profile() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFDF9", fontFamily: "system-ui, sans-serif" }}>

      <header style={{ backgroundColor: "rgba(255,253,249,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #FFD9E8", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#FFB7D5" }}>Palette</h1>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#FFB7D5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 24px 100px 24px" }}>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px", padding: "40px", borderRadius: "24px", backgroundColor: "white", border: "1px solid #FFD9E8" }}>
          <div style={{ width: "96px", height: "96px", borderRadius: "50%", backgroundColor: "#FFB7D5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", marginBottom: "16px" }}>
            🌸
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>Abisha</h2>
          <p style={{ fontSize: "14px", color: "#999", marginBottom: "16px" }}>@abisha</p>

          <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
            {[
              { label: "Boards", value: "4" },
              { label: "Followers", value: "1.2K" },
              { label: "Following", value: "348" },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: "700" }}>{stat.value}</p>
                <p style={{ fontSize: "12px", color: "#999" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          <Link href="/create" style={{ padding: "10px 24px", borderRadius: "999px", backgroundColor: "#FFD9E8", color: "#2E2E2E", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
            + Create Board
          </Link>
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>My Boards</h3>
        <div style={{ columns: "4", gap: "16px" }}>
          {userBoards.map((board) => (
            <div key={board.id} style={{ breakInside: "avoid", marginBottom: "16px", borderRadius: "16px", overflow: "hidden", backgroundColor: "white", border: "1px solid #FFD9E8", cursor: "pointer" }}>
              <div style={{ backgroundColor: board.color, height: "140px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                {board.emoji}
              </div>
              <div style={{ padding: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{board.title}</h3>
                <p style={{ fontSize: "12px", color: "#999" }}>{board.pins} pins</p>
              </div>
            </div>
          ))}
        </div>
      </main>

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