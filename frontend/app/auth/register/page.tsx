"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/auth/login";
      } else {
        setError(data.detail || "Registration failed");
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

        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#2E2E2E", fontFamily: "Georgia, serif", marginBottom: "24px" }}>Create account 🌸</h2>

        {error && (
          <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "12px", backgroundColor: "#FFE4E4", color: "#FF6B6B", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #FFD9E8", backgroundColor: "#FFFDF9", color: "#2E2E2E", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #FFD9E8", backgroundColor: "#FFFDF9", color: "#2E2E2E", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #FFD9E8", backgroundColor: "#FFFDF9", color: "#2E2E2E", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #FFD9E8", backgroundColor: "#FFFDF9", color: "#2E2E2E", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", backgroundColor: "#FFD9E8", color: "#2E2E2E", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}
          >
            {loading ? "Creating account..." : "Create Account 🌸"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#999", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#FFB7D5", fontWeight: "600" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}