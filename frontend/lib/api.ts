const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://palette-production-93ce.up.railway.app";

export const api = {
  // Auth
  register: async (data: { username: string; email: string; password: string; full_name?: string }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Token
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  removeToken: () => {
    localStorage.removeItem("token");
  },

  isLoggedIn: () => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  },

  // Boards
  createBoard: async (data: { title: string; description?: string; cover_color?: string; cover_emoji?: string; is_private?: boolean }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API_URL}/boards/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to create board");
    }
    return res.json();
  },

  getBoards: async () => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/boards/`, { headers });
    if (!res.ok) throw new Error("Failed to fetch boards");
    return res.json();
  },

  getPublicBoards: async (q?: string) => {
    const url = new URL(`${API_URL}/boards/public`);
    if (q) url.searchParams.append("q", q);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch public boards");
    return res.json();
  },

  getBoard: async (id: number | string) => {
    const res = await fetch(`${API_URL}/boards/${id}`);
    if (!res.ok) throw new Error("Failed to fetch board");
    return res.json();
  },

  // Profile
  getProfile: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },

  updateProfile: async (data: { username?: string; full_name?: string; bio?: string; avatar_url?: string }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to update profile");
    }
    return res.json();
  },

  // Users & Follows
  getUserProfile: async (userId: number) => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/users/${userId}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch user profile");
    return res.json();
  },

  followUser: async (userId: number) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API_URL}/users/${userId}/follow`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to follow user");
    return res.json();
  },

  unfollowUser: async (userId: number) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API_URL}/users/${userId}/follow`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to unfollow user");
    return res.json();
  },
};