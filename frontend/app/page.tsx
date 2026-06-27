"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
    <div className="min-h-screen" style={{ backgroundColor: "#FFFDF9", color: "#2E2E2E", fontFamily: "system-ui, sans-serif", maxWidth: "1280px", margin: "0 auto" }}>

      {/* Top Navigation */}
      <header style={{ backgroundColor: "rgba(255,253,249,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid #FFD9E8", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold" style={{ color: "#FFB7D5" }}>🎨 Palette</h1>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="🔍 Search boards, moods, music..."
              className="w-full px-4 py-2 rounded-full text-sm outline-none"
              style={{ backgroundColor: "#FFD9E8", border: "none", color: "#2E2E2E" }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xl">🔔</button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "#FFB7D5" }}>A</div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-6">

        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{greeting}, Abisha 🌸</h2>
          <p className="text-sm mt-1" style={{ color: "#999" }}>Discover boards that match your mood today</p>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeCategory === cat ? "#FFD9E8" : "white",
                border: `1px solid ${activeCategory === cat ? "#FFB7D5" : "#eee"}`,
                color: activeCategory === cat ? "#2E2E2E" : "#888",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3 px-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group mb-4"
              style={{ border: "1px solid #FFD9E8", backgroundColor: "white", boxShadow: "0 2px 12px rgba(255,182,193,0.1)" }}
            >
              <div
                className="w-full flex items-center justify-center text-5xl"
                style={{ backgroundColor: board.color, height: `${140 + (board.id % 3) * 40}px` }}
              >
                {board.emoji}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm leading-tight mb-1">{board.title}</h3>
                <p className="text-xs mb-2" style={{ color: "#999" }}>by {board.author} · {board.pins} pins</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#ccc" }}>♫ Snowfall</span>
                  <button
                    onClick={() => toggleLike(board.id)}
                    className="text-sm"
                  >
                    {liked.includes(board.id) ? "❤️" : "🤍"} {board.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0" style={{ backgroundColor: "rgba(255,253,249,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid #FFD9E8" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-around items-center">
          {[
            { icon: "🏠", label: "Home", href: "/" },
            { icon: "🔍", label: "Explore", href: "/explore" },
            { icon: "➕", label: "Create", href: "/create" },
            { icon: "🎵", label: "Music", href: "/music" },
            { icon: "👤", label: "Profile", href: "/profile" },
          ].map(item => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs" style={{ color: "#ccc" }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="h-20" />
    </div>
  );
}