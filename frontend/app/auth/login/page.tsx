"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "/";
      } else {
        setError(data.detail || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--palette-bg)" }}>
      <div style={{ width: "420px", padding: "48px", borderRadius: "24px", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", boxShadow: `0 4px 24px var(--palette-shadow-lg)` }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--palette-pink)", marginBottom: "8px" }}>🎨 Palette</h1>
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)" }}>Collect moments. Feel the music.</p>
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--palette-text)", fontFamily: "Georgia, serif", marginBottom: "24px" }}>Welcome back 🌸</h2>

        {error && (
          <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "12px", backgroundColor: "var(--palette-danger)", color: "var(--palette-danger-text)", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}
          >
            {loading ? "Logging in..." : "Login 🌸"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--palette-text-muted)", marginTop: "24px" }}>
          Don't have an account?{" "}
          <Link href="/auth/register" style={{ color: "var(--palette-pink)", fontWeight: "600" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}