"use client";

import { useState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!/\d/.test(newPassword)) {
      setError("Password must contain at least one number");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.resetPassword(email, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--palette-bg)" }}>
      <div className="responsive-auth-card" style={{ borderRadius: "24px", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", boxShadow: `0 4px 24px var(--palette-shadow-lg)` }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--palette-pink)", marginBottom: "8px" }}>🎨 Palette</h1>
          <p style={{ fontSize: "14px", color: "var(--palette-text-muted)" }}>Reset your password to regain access</p>
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--palette-text)", fontFamily: "Georgia, serif", marginBottom: "24px" }}>Forgot Password? 🔑</h2>

        {error && (
          <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "12px", backgroundColor: "var(--palette-danger)", color: "var(--palette-danger-text)", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "16px", padding: "14px", borderRadius: "12px", backgroundColor: "rgba(76, 175, 80, 0.15)", color: "#2e7d32", fontSize: "14px", fontWeight: "600" }}>
              ✅ Password reset successfully! You can now log in with your new password.
            </div>
            <Link
              href="/auth/login"
              style={{ display: "inline-block", padding: "12px 24px", borderRadius: "999px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", textDecoration: "none", fontWeight: "600", marginTop: "12px" }}
            >
              Go to Login 🌸
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-secondary)", display: "block", marginBottom: "6px" }}>Your Account Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-secondary)", display: "block", marginBottom: "6px" }}>New Password</label>
              <PasswordInput
                placeholder="New Password (min 8 chars, 1 number)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer", marginTop: "8px" }}
            >
              {loading ? "Resetting Password..." : "Reset Password 🌸"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--palette-text-muted)", marginTop: "24px" }}>
          Remembered your password?{" "}
          <Link href="/auth/login" style={{ color: "var(--palette-pink)", fontWeight: "600" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
