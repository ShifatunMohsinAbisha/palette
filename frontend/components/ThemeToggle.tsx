"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid var(--palette-border)",
          backgroundColor: "var(--palette-surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ✨
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getIcon = () => {
    if (theme === "system") return "💻";
    if (resolvedTheme === "dark") return "🌙";
    return "☀️";
  };

  const getLabel = () => {
    if (theme === "system") return "System theme";
    if (theme === "dark") return "Dark mode";
    return "Light mode";
  };

  return (
    <button
      onClick={cycleTheme}
      aria-label={getLabel()}
      title={getLabel()}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        border: "1px solid var(--palette-border)",
        backgroundColor: "var(--palette-surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "16px",
        boxShadow: `0 2px 8px var(--palette-shadow)`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          transition: "transform 300ms ease",
        }}
      >
        {getIcon()}
      </span>
    </button>
  );
}
