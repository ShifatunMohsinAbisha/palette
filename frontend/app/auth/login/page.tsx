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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFDF9" }}>
      <div style={{ width: "420px", padding: "48px", borderRadius: "24px", backgroundColor: "white", border: "1px solid #FFD9E8", boxShadow: "0 4px 24px rgba(255,182,193,0.15)" }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#FFB7D5", marginBottom: "8px" }}>🎨 Palette</h1>
          <p style={{ fontSize: "14px", color: "#999" }}>Collect moments. Feel the music.</p>
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#2E2E2E", fontFamily: "Georgia, serif", marginBottom: "24px" }}>Welcome back 🌸</h2>

        {error && (
          <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "12px", backgroundColor: "#FFE4E4", color: "#FF6B6B", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #FFD9E8", backgroundColor: "#FFFDF9", color: "#2E2E2E", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #FFD9E8", backgroundColor: "#FFFDF9", color: "#2E2E2E", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", backgroundColor: "#FFD9E8", color: "#2E2E2E", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}
          >
            {loading ? "Logging in..." : "Login 🌸"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#999", marginTop: "24px" }}>
          Don't have an account?{" "}
          <Link href="/auth/register" style={{ color: "#FFB7D5", fontWeight: "600" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}