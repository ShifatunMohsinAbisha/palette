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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFFDF9" }}>
      <div className="w-full max-w-md p-8 rounded-3xl" style={{ backgroundColor: "white", border: "1px solid #FFD9E8", boxShadow: "0 4px 24px rgba(255,182,193,0.15)" }}>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#FFB7D5" }}>🎨 Palette</h1>
          <p className="text-sm" style={{ color: "#999" }}>Collect moments. Feel the music.</p>
        </div>

        <h2 className="text-xl font-semibold mb-6" style={{ color: "#2E2E2E" }}>Create account 🌸</h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ backgroundColor: "#FFE4E4", color: "#FF6B6B" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{ backgroundColor: "#FFFDF9", border: "1px solid #FFD9E8", color: "#2E2E2E" }}
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{ backgroundColor: "#FFFDF9", border: "1px solid #FFD9E8", color: "#2E2E2E" }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{ backgroundColor: "#FFFDF9", border: "1px solid #FFD9E8", color: "#2E2E2E" }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{ backgroundColor: "#FFFDF9", border: "1px solid #FFD9E8", color: "#2E2E2E" }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ backgroundColor: "#FFD9E8", color: "#2E2E2E" }}
          >
            {loading ? "Creating account..." : "Create Account 🌸"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#999" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#FFB7D5", fontWeight: "600" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}