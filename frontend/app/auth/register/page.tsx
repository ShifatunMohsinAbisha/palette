"use client";

import { useState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

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
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!/\d/.test(formData.password)) {
      setError("Password must contain at least one number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://palette-production-93ce.up.railway.app";
      const res = await fetch(`${baseUrl}/auth/register`, {
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--palette-bg)" }}>
      <div className="responsive-auth-card" style={{ borderRadius: "24px", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", boxShadow: `0 4px 24px var(--palette-shadow-lg)` }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--palette-pink)", marginBottom: "8px" }}>🎨 Palette</h1>
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)" }}>Collect moments. Feel the music.</p>
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--palette-text)", fontFamily: "Georgia, serif", marginBottom: "24px" }}>Create account 🌸</h2>

        {error && (
          <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "12px", backgroundColor: "var(--palette-danger)", color: "var(--palette-danger-text)", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
          <PasswordInput
            placeholder="Password (min 8 chars, 1 number)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}
          >
            {loading ? "Creating account..." : "Create Account 🌸"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--palette-text-muted)", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--palette-pink)", fontWeight: "600" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}