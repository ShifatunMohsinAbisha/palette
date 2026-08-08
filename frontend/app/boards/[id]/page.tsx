"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";

interface Pin {
  id: number;
  title: string | null;
  image_url: string;
  note: string | null;
  position: number;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  artwork_url: string | null;
  youtube_id: string;
  preview_url: string | null;
  duration: string | null;
  mood: string | null;
  color: string | null;
  emoji: string | null;
  position: number;
}

interface BoardData {
  id: number;
  title: string;
  description: string | null;
  cover_color: string;
  cover_emoji: string;
  is_private: boolean;
  owner_id: number | null;
  created_at: string;
  owner?: {
    username: string;
    full_name: string | null;
  };
  pins: Pin[];
  songs: Song[];
}

const initialPlaylists = [
  { id: 1, title: "Chemtrails Over the Country Club", artist: "Lana Del Rey", query: "Chemtrails Over the Country Club Lana Del Rey", mood: "Chill", color: "#DDF4FF", emoji: "🛩️", duration: "4:31", youtubeId: "gCw1f1GmPaU" },
  { id: 2, title: "Sweater Weather", artist: "The Neighbourhood", query: "Sweater Weather The Neighbourhood", mood: "Melancholy", color: "#EAD9FF", emoji: "🌙", duration: "4:00", youtubeId: "GCdwKhTtNNw" },
  { id: 3, title: "Love", artist: "Lana Del Rey", query: "Love Lana Del Rey", mood: "Chill", color: "#FFD9E8", emoji: "💖", duration: "4:32", youtubeId: "3-NTv0CdFCk" },
  { id: 4, title: "Anti-Hero", artist: "Taylor Swift", query: "Anti-Hero Taylor Swift", mood: "Happy", color: "#FFF4C2", emoji: "🐈", duration: "3:20", youtubeId: "b1kbLwvqugk" },
  { id: 5, title: "Cruel Summer", artist: "Taylor Swift", query: "Cruel Summer Taylor Swift", mood: "Energetic", color: "#FFD9E8", emoji: "☀️", duration: "2:58", youtubeId: "ic8j13gFLm8" },
  { id: 6, title: "All Too Well (Ten Minute Version)", artist: "Taylor Swift", query: "All Too Well Ten Minute Version Taylor Swift", mood: "Melancholy", color: "#EAD9FF", emoji: "🧣", duration: "10:13", youtubeId: "tollGa3S0o8" },
  { id: 7, title: "Dress", artist: "Taylor Swift", query: "Dress Taylor Swift reputation", mood: "Chill", color: "#DDF4FF", emoji: "👗", duration: "5:02", youtubeId: "w8kzHIl0xgw" },
  { id: 8, title: "Wildest Dreams", artist: "Taylor Swift", query: "Wildest Dreams Taylor Swift", mood: "Peaceful", color: "#D9FBE5", emoji: "💭", duration: "3:40", youtubeId: "IdneKLhsWOQ" },
  { id: 9, title: "Etota Valobashi", artist: "Recall", query: "Etota Bhalobashi Recall band", mood: "Melancholy", color: "#EAD9FF", emoji: "🎸", duration: "4:32", youtubeId: "o2kw4MaBVa4" },
  { id: 10, title: "Shoto Danar Projapoti", artist: "Arafat Mohsin", query: "Shoto Danar Projapoti Arafat Mohsin", mood: "Happy", color: "#FFF4C2", emoji: "🦋", duration: "3:53", youtubeId: "U32cZrtRJN4" },
  { id: 11, title: "Tumi", artist: "Level Five", query: "Tumi Level Five", mood: "Chill", color: "#DDF4FF", emoji: "🎤", duration: "4:05", youtubeId: "NQp3cbSkqbo" },
  { id: 12, title: "Gangnam Style", artist: "PSY", query: "Gangnam Style PSY", mood: "Energetic", color: "#EAD9FF", emoji: "😎", duration: "4:13", youtubeId: "9bZkp7q19f0" },
  { id: 13, title: "Bilionera", artist: "Otilia", query: "Bilionera Otilia", mood: "Energetic", color: "#FFD9E8", emoji: "💃", duration: "3:05", youtubeId: "j6fKk5nK_eY" },
  { id: 14, title: "TiK ToK", artist: "Kesha", query: "TiK ToK Kesha", mood: "Energetic", color: "#FFF4C2", emoji: "⏰", duration: "3:35", youtubeId: "iP6XpLQM2Cs" },
  { id: 15, title: "Alien Superstar", artist: "Beyoncé", query: "Alien Superstar Beyonce", mood: "Energetic", color: "#EAD9FF", emoji: "🛸", duration: "4:35", youtubeId: "e_aT9pAGQo8" },
  { id: 16, title: "Love Again", artist: "Dua Lipa", query: "Love Again Dua Lipa", mood: "Happy", color: "#FFD9E8", emoji: "❤️", duration: "4:18", youtubeId: "BC19kwABFwc" },
  { id: 17, title: "Love Story", artist: "Taylor Swift", query: "Love Story Taylor Swift", mood: "Happy", color: "#FFF4C2", emoji: "🏰", duration: "3:55", youtubeId: "8xg3vE8Ie_E" },
  { id: 18, title: "Blinding Lights", artist: "The Weeknd", query: "Blinding Lights The Weeknd", mood: "Energetic", color: "#EAD9FF", emoji: "💫", duration: "3:20", youtubeId: "4NRXx6U8ABQ" },
  { id: 19, title: "Young and Beautiful", artist: "Lana Del Rey", query: "Young and Beautiful Lana Del Rey", mood: "Chill", color: "#DDF4FF", emoji: "🌹", duration: "3:56", youtubeId: "o_1aF54DO60" },
  { id: 20, title: "Exile", artist: "Taylor Swift ft. Bon Iver", query: "Exile Taylor Swift", mood: "Calm", color: "#D9FBE5", emoji: "🌿", duration: "4:45", youtubeId: "osdoLjUNFnA" }
];

const demoBoards = [
  { id: -1, title: "Cherry Blossom Afternoon", author: "Luna", likes: "2.3K", pins: 45, color: "#FFD9E8", emoji: "🌸" },
  { id: -2, title: "Midnight Study Vibes", author: "Aria", likes: "1.8K", pins: 32, color: "#EAD9FF", emoji: "🌙" },
  { id: -3, title: "Ocean Daydream", author: "Mira", likes: "3.1K", pins: 67, color: "#DDF4FF", emoji: "🌊" },
  { id: -4, title: "Golden Hour", author: "Sol", likes: "4.2K", pins: 89, color: "#FFF4C2", emoji: "☀️" },
  { id: -5, title: "Forest Whispers", author: "Fern", likes: "986", pins: 28, color: "#D9FBE5", emoji: "🌿" },
  { id: -6, title: "Neon Tokyo Nights", author: "Kei", likes: "5.7K", pins: 112, color: "#EAD9FF", emoji: "🏙️" },
  { id: -7, title: "Cottagecore Dreams", author: "Rose", likes: "2.9K", pins: 54, color: "#D9FBE5", emoji: "🌷" },
  { id: -8, title: "Rainy Day Jazz", author: "Blue", likes: "1.2K", pins: 19, color: "#DDF4FF", emoji: "🎵" },
];

const getInitialMockData = (boardId: number) => {
  const defaultPins = [
    { id: -101, title: "Aesthetic Room", image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600", note: "Perfect study setup", position: 0 },
    { id: -102, title: "Calm Beach", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", note: "Sandy shores", position: 1 },
  ];
  const defaultSongs = [
    { id: -201, title: "Sweater Weather", artist: "The Neighbourhood", artwork_url: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/bf/f4/ac/bff4ac8c-7f55-14f7-e7dc-673f8b05615c/886443831885.jpg/100x100bb.jpg", youtube_id: "GCdwKhTtNNw", duration: "4:00", mood: "Melancholy", color: "#EAD9FF", emoji: "🌙", position: 0 },
    { id: -202, title: "Counting Stars", artist: "OneRepublic", artwork_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b9/e3/37/b9e33719-7561-12fb-e575-b6d8c0b24050/13UMGIM16401.rgb.jpg/100x100bb.jpg", youtube_id: "hT_nvWreIhg", duration: "4:17", mood: "Peaceful", color: "#FFD9E8", emoji: "⭐", position: 1 }
  ];

  if (boardId === -1) {
    return {
      pins: [
        { id: -101, title: "Cherry Blossom Afternoon", image_url: "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=600", note: "Beautiful soft pink blossoms", position: 0 },
        { id: -102, title: "Spring Tea Session", image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600", note: "Pink cups and spring mood", position: 1 },
        { id: -103, title: "Cozy Garden Corner", image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600", note: "Relaxing afternoon tea aesthetic", position: 2 }
      ],
      songs: [
        { id: -201, title: "Chemtrails Over the Country Club", artist: "Lana Del Rey", artwork_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4b/32/bf/4b32bf9c-b171-ec5a-a37a-e4be32a4e21a/21UMGIM02797.rgb.jpg/100x100bb.jpg", youtube_id: "gCw1f1GmPaU", duration: "4:31", mood: "Chill", color: "#DDF4FF", emoji: "🛩️", position: 0 }
      ]
    };
  }
  if (boardId === -2) {
    return {
      pins: [
        { id: -101, title: "Midnight Study Setup", image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600", note: "Focusing on books under cozy lamps", position: 0 },
        { id: -102, title: "Late Night Coffee", image_url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600", note: "Espresso keeping me awake", position: 1 }
      ],
      songs: [
        { id: -201, title: "Sweater Weather", artist: "The Neighbourhood", artwork_url: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/bf/f4/ac/bff4ac8c-7f55-14f7-e7dc-673f8b05615c/886443831885.jpg/100x100bb.jpg", youtube_id: "GCdwKhTtNNw", duration: "4:00", mood: "Melancholy", color: "#EAD9FF", emoji: "🌙", position: 0 }
      ]
    };
  }
  if (boardId === -3) {
    return {
      pins: [
        { id: -101, title: "Ocean Daydream", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", note: "Sailing away to paradise", position: 0 },
        { id: -102, title: "Deep Blue Horizon", image_url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600", note: "Soft waves on sandy shore", position: 1 }
      ],
      songs: [
        { id: -201, title: "Riptide", artist: "Vance Joy", artwork_url: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/ff/e1/9b/ffe19b16-56ff-6f41-073a-4efb60be7802/mzi.nksvpxbe.jpg/100x100bb.jpg", youtube_id: "uTaL05_4a3o", duration: "3:24", mood: "Peaceful", color: "#D9FBE5", emoji: "🎻", position: 0 }
      ]
    };
  }
  return { pins: defaultPins, songs: defaultSongs };
};



export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://palette-production-93ce.up.railway.app";

  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pins" | "songs">("all");

  // Client-side modification states
  const [pins, setPins] = useState<Pin[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  // Modals / Panels toggles
  const [showAddPin, setShowAddPin] = useState(false);
  const [pinUrl, setPinUrl] = useState("");
  const [pinTitle, setPinTitle] = useState("");
  const [pinNote, setPinNote] = useState("");

  const [showAddSong, setShowAddSong] = useState(false);
  const [songSearchQuery, setSongSearchQuery] = useState("");
  const [songSearchResults, setSongSearchResults] = useState<any[]>([]);
  const [searchingSongs, setSearchingSongs] = useState(false);

  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Audio Playback states
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(30);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pinFileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [editBoardTitle, setEditBoardTitle] = useState("");
  const [editBoardDesc, setEditBoardDesc] = useState("");
  const [editBoardColor, setEditBoardColor] = useState("#FFD9E8");
  const [editBoardEmoji, setEditBoardEmoji] = useState("🌸");
  const [editBoardIsPrivate, setEditBoardIsPrivate] = useState(false);
  const [savingBoard, setSavingBoard] = useState(false);

  useEffect(() => {
    if (api.isLoggedIn()) {
      api.getProfile().then(p => setCurrentUserId(p.id)).catch(() => {});
    }
  }, []);

  const handleTogglePrivacy = async () => {
    if (!board || !id) return;
    const boardId = Array.isArray(id) ? id[0] : id;
    try {
      const updated = await api.updateBoard(boardId, { is_private: !board.is_private });
      setBoard(prev => prev ? { ...prev, is_private: updated.is_private } : null);
    } catch {
      alert("Failed to update privacy");
    }
  };

  const openEditBoardModal = () => {
    if (!board) return;
    setEditBoardTitle(board.title);
    setEditBoardDesc(board.description || "");
    setEditBoardColor(board.cover_color);
    setEditBoardEmoji(board.cover_emoji);
    setEditBoardIsPrivate(board.is_private);
    setShowEditBoardModal(true);
  };

  const handleSaveBoard = async () => {
    if (!id || !editBoardTitle.trim()) return;
    const boardId = Array.isArray(id) ? id[0] : id;
    setSavingBoard(true);
    try {
      const updated = await api.updateBoard(boardId, {
        title: editBoardTitle.trim(),
        description: editBoardDesc.trim(),
        cover_color: editBoardColor,
        cover_emoji: editBoardEmoji,
        is_private: editBoardIsPrivate,
      });
      setBoard(prev => prev ? {
        ...prev,
        title: updated.title,
        description: updated.description,
        cover_color: updated.cover_color,
        cover_emoji: updated.cover_emoji,
        is_private: updated.is_private,
      } : null);
      setShowEditBoardModal(false);
    } catch {
      alert("Failed to update board");
    } finally {
      setSavingBoard(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!id) return;
    const boardId = Array.isArray(id) ? id[0] : id;
    const confirmed = window.confirm("Are you sure you want to delete this board? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await api.deleteBoard(boardId);
      router.push("/profile");
    } catch {
      alert("Failed to delete board");
    }
  };

  useEffect(() => {
    if (board?.owner_id) {
      api.getUserProfile(board.owner_id).then(user => {
        setIsFollowing(user.is_following);
      }).catch(() => {});
    }
  }, [board?.owner_id]);

  const handleToggleFollow = async () => {
    if (!board?.owner_id) return;
    if (!api.isLoggedIn()) {
      router.push("/auth/login");
      return;
    }
    try {
      if (isFollowing) {
        await api.unfollowUser(board.owner_id);
        setIsFollowing(false);
      } else {
        await api.followUser(board.owner_id);
        setIsFollowing(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPinUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Fetch Board Details (or mock data)
  useEffect(() => {
    if (!id) return;
    const boardId = Number(id);

    if (!isNaN(boardId) && boardId < 0) {
      // Load mock boards
      const demo = demoBoards.find(b => b.id === boardId);
      if (demo) {
        const mockItems = getInitialMockData(boardId);
        const mappedData: BoardData = {
          id: demo.id,
          title: demo.title,
          description: `A beautiful mood board curated by ${demo.author}. Includes Pinterest moments and Spotify vibes mixed together.`,
          cover_color: demo.color,
          cover_emoji: demo.emoji,
          is_private: false,
          owner_id: null,
          created_at: new Date().toISOString(),
          owner: {
            username: demo.author.toLowerCase(),
            full_name: demo.author,
          },
          pins: mockItems.pins,
          songs: mockItems.songs.map(s => ({ ...s, preview_url: null })),
        };
        setBoard(mappedData);
        setPins(mockItems.pins);
        setSongs(mockItems.songs.map(s => ({ ...s, preview_url: null })));
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/boards/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Board not found");
        return res.json();
      })
      .then((data: BoardData) => {
        setBoard(data);
        setPins(data.pins || []);
        setSongs((data.songs || []).map((s: Song) => ({ ...s, preview_url: s.preview_url || null })));
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Audio playback: play/pause/load when currentSongIndex or isPlaying changes
  useEffect(() => {
    if (currentSongIndex === null || songs.length === 0) return;
    const activeSong = songs[currentSongIndex];
    if (!activeSong) return;

    let isCancelled = false;

    const playActiveTrack = async () => {
      let audioSrc = activeSong.preview_url;

      if (!audioSrc) {
        try {
          const query = `${activeSong.title} ${activeSong.artist}`;
          const res = await fetch(`/api/itunes?term=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (!isCancelled && data.results && data.results.length > 0) {
            audioSrc = data.results[0].previewUrl || null;
            activeSong.preview_url = audioSrc;
            if (!activeSong.artwork_url) {
              activeSong.artwork_url = data.results[0].artworkUrl100?.replace("100x100", "300x300") || null;
            }
          }
        } catch (e) {
          console.error("Audio preview fetch error:", e);
        }
      }

      if (isCancelled || !audioSrc) return;

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.addEventListener("ended", () => {
          setCurrentSongIndex(prev => {
            if (prev === null) return null;
            return (prev + 1) % songs.length;
          });
        });
        audioRef.current.addEventListener("timeupdate", () => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        });
        audioRef.current.addEventListener("loadedmetadata", () => {
          if (audioRef.current) {
            setSongDuration(audioRef.current.duration || 30);
          }
        });
      }

      if (audioRef.current.src !== audioSrc) {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
      }

      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    };

    playActiveTrack();

    return () => {
      isCancelled = true;
    };
  }, [currentSongIndex, isPlaying, songs]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playSong = (index: number) => {
    if (currentSongIndex === index) {
      togglePlay();
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex(prev => (prev === null ? 0 : (prev - 1 + songs.length) % songs.length));
    setIsPlaying(true);
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex(prev => (prev === null ? 0 : (prev + 1) % songs.length));
    setIsPlaying(true);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !songDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const seconds = pct * songDuration;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Add Pin Function
  const handleAddPin = async () => {
    if (!pinUrl.trim()) return;
    const boardId = Number(id);

    const newPinBody = {
      title: pinTitle.trim() || null,
      image_url: pinUrl.trim(),
      note: pinNote.trim() || null,
    };

    if (boardId < 0) {
      // Mock client side save
      const newPin: Pin = {
        id: -Date.now(),
        title: newPinBody.title,
        image_url: newPinBody.image_url,
        note: newPinBody.note,
        position: pins.length,
      };
      setPins([...pins, newPin]);
      setPinUrl("");
      setPinTitle("");
      setPinNote("");
      setShowAddPin(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/boards/${id}/pins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPinBody),
      });
      if (!res.ok) throw new Error("Failed to add pin");
      const addedPin: Pin = await res.json();
      setPins([...pins, addedPin]);
      setPinUrl("");
      setPinTitle("");
      setPinNote("");
      setShowAddPin(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Pin Function
  const handleDeletePin = async (pinId: number) => {
    const boardId = Number(id);
    if (boardId < 0) {
      setPins(pins.filter(p => p.id !== pinId));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/boards/${id}/pins/${pinId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete pin");
      setPins(pins.filter(p => p.id !== pinId));
    } catch (e) {
      console.error(e);
    }
  };

  // Move Pin (Rearrange)
  const handleMovePin = async (index: number, direction: "prev" | "next") => {
    const nextIndex = direction === "prev" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= pins.length) return;

    const updated = [...pins];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;

    // Recalculate positions
    const reordered = updated.map((p, idx) => ({ ...p, position: idx }));
    setPins(reordered);

    const boardId = Number(id);
    if (boardId < 0) return;

    try {
      await fetch(`${API_BASE_URL}/boards/${id}/pins/rearrange`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map(p => p.id) }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Add Song Function from Preset Music List
  const handleAddSong = async (presetTrack: typeof initialPlaylists[0]) => {
    const boardId = Number(id);
    let artworkUrl: string | null = null;
    let previewUrl: string | null = null;

    try {
      const res = await fetch(`/api/itunes?term=${encodeURIComponent(presetTrack.query)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        artworkUrl = data.results[0].artworkUrl100?.replace("100x100", "300x300") || null;
        previewUrl = data.results[0].previewUrl || null;
      }
    } catch (e) {
      console.error(e);
    }

    const newSongBody = {
      title: presetTrack.title,
      artist: presetTrack.artist,
      artwork_url: artworkUrl,
      youtube_id: presetTrack.youtubeId,
      duration: presetTrack.duration,
      mood: presetTrack.mood,
      color: presetTrack.color,
      emoji: presetTrack.emoji,
    };

    if (boardId < 0) {
      const newSong: Song = {
        id: -Date.now(),
        ...newSongBody,
        preview_url: previewUrl,
        position: songs.length,
      };
      setSongs([...songs, newSong]);
      setShowAddSong(false);
      setSongSearchQuery("");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/boards/${id}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSongBody),
      });
      if (!res.ok) throw new Error("Failed to add song");
      const addedSong: Song = await res.json();
      setSongs([...songs, { ...addedSong, preview_url: previewUrl }]);
      setShowAddSong(false);
      setSongSearchQuery("");
    } catch (e) {
      console.error(e);
    }
  };

  // Remove Song Function
  const handleRemoveSong = async (songId: number) => {
    const boardId = Number(id);

    // Stop playback if we delete the currently playing song
    const deletedIndex = songs.findIndex(s => s.id === songId);
    if (deletedIndex === currentSongIndex) {
      setIsPlaying(false);
      setCurrentSongIndex(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    } else if (currentSongIndex !== null && deletedIndex < currentSongIndex) {
      setCurrentSongIndex(currentSongIndex - 1);
    }

    if (boardId < 0) {
      setSongs(songs.filter(s => s.id !== songId));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/boards/${id}/songs/${songId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove song");
      setSongs(songs.filter(s => s.id !== songId));
    } catch (e) {
      console.error(e);
    }
  };

  // Move Song (Rearrange)
  const handleMoveSong = async (index: number, direction: "prev" | "next") => {
    const nextIndex = direction === "prev" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= songs.length) return;

    const updated = [...songs];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;

    const reordered = updated.map((s, idx) => ({ ...s, position: idx }));
    setSongs(reordered);

    // Adjust playback index if necessary
    if (currentSongIndex === index) {
      setCurrentSongIndex(nextIndex);
    } else if (currentSongIndex === nextIndex) {
      setCurrentSongIndex(index);
    }

    const boardId = Number(id);
    if (boardId < 0) return;

    try {
      await fetch(`${API_BASE_URL}/boards/${id}/songs/rearrange`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map(s => s.id) }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Unified items list mapping (mixing pins & songs together)
  const mixedItems = [
    ...pins.map(p => ({ ...p, itemType: "pin" as const })),
    ...songs.map(s => ({ ...s, itemType: "song" as const })),
  ].sort((a, b) => a.position - b.position);

  const activePlayingSong = currentSongIndex !== null ? songs[currentSongIndex] : null;
  const progressPercent = songDuration > 0 ? (currentTime / songDuration) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--palette-bg)", color: "var(--palette-text)", fontFamily: "system-ui, sans-serif", paddingBottom: activePlayingSong ? "160px" : "100px" }}>
      
      {/* Top Header */}
      <header style={{ backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--palette-border)", position: "sticky", top: 0, zIndex: 50, width: "100%" }}>
        <div className="responsive-header" style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button 
            onClick={() => router.back()} 
            style={{ background: "none", border: "none", color: "var(--palette-text)", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--palette-pink)" }}>🎨 Board</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--palette-pink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>A</div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="responsive-main" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--palette-text-muted)" }}>
            <p style={{ fontSize: "18px" }}>Loading board details...</p>
          </div>
        ) : error || !board ? (
          <div style={{ textAlign: "center", padding: "80px 0", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", borderRadius: "24px" }}>
            <span style={{ fontSize: "48px" }}>🔍</span>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginTop: "16px" }}>Board Not Found</h2>
            <p style={{ color: "var(--palette-text-muted)", marginTop: "8px", marginBottom: "24px" }}>This board might have been deleted or does not exist.</p>
            <Link href="/" style={{ padding: "10px 24px", borderRadius: "999px", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", textDecoration: "none", fontWeight: "600" }}>
              Go Back Home
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* Board Banner */}
            <div className="responsive-banner" style={{ backgroundColor: board.cover_color, borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px var(--palette-shadow)", position: "relative" }}>
              <div style={{ position: "absolute", bottom: "-28px", backgroundColor: "var(--palette-surface)", padding: "8px 20px", borderRadius: "999px", border: "1px solid var(--palette-border)", boxShadow: "0 2px 10px var(--palette-shadow)", fontSize: "13px", fontWeight: "600", color: "var(--palette-text-secondary)", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span>by @{board.owner?.username || "anonymous"}</span>
                
                {/* Privacy Badge / Toggle */}
                {board.owner_id && currentUserId === board.owner_id ? (
                  <button
                    onClick={handleTogglePrivacy}
                    title="Click to toggle privacy"
                    style={{
                      padding: "3px 10px", borderRadius: "999px", border: "1px solid var(--palette-border)",
                      backgroundColor: board.is_private ? "var(--palette-toggle-bg)" : "var(--palette-primary)",
                      color: "var(--palette-text)", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                    }}
                  >
                    {board.is_private ? "🔒 Private" : "🌐 Public"} 🔄
                  </button>
                ) : (
                  <span>· {board.is_private ? "🔒 Private" : "🌐 Public"}</span>
                )}

                {/* Follow Button for Other Users */}
                {board.owner_id && currentUserId !== board.owner_id && (
                  <button
                    onClick={handleToggleFollow}
                    style={{
                      padding: "4px 12px", borderRadius: "999px", border: "none",
                      backgroundColor: isFollowing ? "var(--palette-border)" : "var(--palette-pink)",
                      color: isFollowing ? "var(--palette-text)" : "white",
                      fontSize: "12px", fontWeight: "600", cursor: "pointer",
                    }}
                  >
                    {isFollowing ? "Following ✓" : "+ Follow"}
                  </button>
                )}

                {/* Owner Actions: Edit & Delete */}
                {board.owner_id && currentUserId === board.owner_id && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={openEditBoardModal}
                      style={{ padding: "4px 10px", borderRadius: "999px", border: "none", backgroundColor: "var(--palette-pink)", color: "white", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={handleDeleteBoard}
                      style={{ padding: "4px 10px", borderRadius: "999px", border: "none", backgroundColor: "#ff4d4d", color: "white", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
              {board.cover_emoji}
            </div>

            {/* Board Info */}
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <h2 style={{ fontSize: "32px", fontWeight: "800" }}>{board.title}</h2>
              <p style={{ fontSize: "15px", color: "var(--palette-text-secondary)", marginTop: "8px", maxWidth: "600px", margin: "8px auto 0 auto", lineHeight: "1.6" }}>
                {board.description || "Collect moments. Feel the music."}
              </p>
            </div>

            {/* Grid Tabs & Controller Panel */}
            <div className="responsive-tabs" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--palette-border)", paddingBottom: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { id: "all", label: "✨ All Items" },
                  { id: "pins", label: "🖼️ Pins" },
                  { id: "songs", label: "🎵 Music" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: activeTab === tab.id ? "var(--palette-primary)" : "transparent",
                      color: activeTab === tab.id ? "var(--palette-text)" : "var(--palette-text-muted)",
                      transition: "background-color 0.2s"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Creator Controls */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setShowAddPin(true)}
                  style={{ padding: "8px 16px", borderRadius: "999px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-surface)", color: "var(--palette-text)", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  🖼️ Add Pin
                </button>
                <button
                  onClick={() => setShowAddSong(true)}
                  style={{ padding: "8px 16px", borderRadius: "999px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-surface)", color: "var(--palette-text)", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  🎵 Add Song
                </button>
              </div>
            </div>

            {/* Board Contents Grid */}
            <div>
              {/* Tab 1: All Items (Mixed Grid) */}
              {activeTab === "all" && (
                mixedItems.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "var(--palette-text-muted)" }}>
                    <p style={{ fontSize: "15px" }}>This board is empty. Add some pins or songs! 🌸</p>
                  </div>
                ) : (
                  <div className="responsive-board-grid">
                    {mixedItems.map((item, index) => {
                      if (item.itemType === "pin") {
                        // Render Image Pin Card
                        const pinIndex = pins.findIndex(p => p.id === item.id);
                        return (
                          <div 
                            key={`pin-${item.id}`} 
                            style={{ 
                              breakInside: "avoid", 
                              marginBottom: "20px", 
                              borderRadius: "16px", 
                              overflow: "hidden", 
                              backgroundColor: "var(--palette-surface)", 
                              border: "1px solid var(--palette-border)", 
                              boxShadow: "0 2px 8px var(--palette-shadow)", 
                              position: "relative"
                            }}
                          >
                            <img 
                              src={(item as Pin).image_url} 
                              alt={(item as Pin).title || "Pin Image"} 
                              onClick={() => setZoomImage((item as Pin).image_url)}
                              style={{ width: "100%", display: "block", cursor: "zoom-in", transition: "transform 0.2s" }} 
                            />
                            {((item as Pin).title || (item as Pin).note) && (
                              <div style={{ padding: "12px", borderTop: "1px solid var(--palette-border)" }}>
                                {(item as Pin).title && <h4 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "4px" }}>{(item as Pin).title}</h4>}
                                {(item as Pin).note && <p style={{ fontSize: "11px", color: "var(--palette-text-secondary)" }}>{(item as Pin).note}</p>}
                              </div>
                            )}
                            
                            {/* Card Hover Overlay Controls */}
                            <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "6px" }}>
                              {pinIndex > 0 && (
                                <button 
                                  onClick={() => handleMovePin(pinIndex, "prev")}
                                  style={{ padding: "4px 8px", borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.6)", color: "white", cursor: "pointer", fontSize: "11px" }}
                                  title="Move Up"
                                >
                                  ◀
                                </button>
                              )}
                              {pinIndex < pins.length - 1 && (
                                <button 
                                  onClick={() => handleMovePin(pinIndex, "next")}
                                  style={{ padding: "4px 8px", borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.6)", color: "white", cursor: "pointer", fontSize: "11px" }}
                                  title="Move Down"
                                >
                                  ▶
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeletePin(item.id)}
                                style={{ padding: "4px 8px", borderRadius: "8px", border: "none", backgroundColor: "#ff4d4d", color: "white", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}
                                title="Delete Pin"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        );
                      } else {
                        // Render Song Card
                        const songIndex = songs.findIndex(s => s.id === item.id);
                        const isSongPlaying = currentSongIndex === songIndex && isPlaying;
                        return (
                          <div 
                            key={`song-${item.id}`} 
                            style={{ 
                              breakInside: "avoid", 
                              marginBottom: "20px", 
                              borderRadius: "16px", 
                              padding: "16px", 
                              backgroundColor: "var(--palette-surface)", 
                              border: "1px solid var(--palette-border)", 
                              boxShadow: "0 2px 8px var(--palette-shadow)", 
                              position: "relative",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ width: "48px", height: "48px", borderRadius: "10px", backgroundColor: "#EAD9FF", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {(item as Song).artwork_url ? (
                                  <img src={(item as Song).artwork_url || ""} alt={(item as Song).title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                  <span style={{ fontSize: "20px" }}>🎵</span>
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{(item as Song).title}</h4>
                                <p style={{ fontSize: "11px", color: "var(--palette-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{(item as Song).artist}</p>
                              </div>
                              <button 
                                onClick={() => playSong(songIndex)}
                                style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                              >
                                {isSongPlaying ? "⏸️" : "▶️"}
                              </button>
                            </div>

                            {/* Card Sorting / Removing Action Row */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--palette-border)", paddingTop: "8px" }}>
                              <span style={{ fontSize: "10px", color: "var(--palette-text-faint)" }}>{(item as Song).duration || "3:00"}</span>
                              <div style={{ display: "flex", gap: "6px" }}>
                                {songIndex > 0 && (
                                  <button 
                                    onClick={() => handleMoveSong(songIndex, "prev")}
                                    style={{ padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-bg)", color: "var(--palette-text)", cursor: "pointer", fontSize: "10px" }}
                                    title="Move Up"
                                  >
                                    ▲
                                  </button>
                                )}
                                {songIndex < songs.length - 1 && (
                                  <button 
                                    onClick={() => handleMoveSong(songIndex, "next")}
                                    style={{ padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-bg)", color: "var(--palette-text)", cursor: "pointer", fontSize: "10px" }}
                                    title="Move Down"
                                  >
                                    ▼
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleRemoveSong(item.id)}
                                  style={{ padding: "2px 6px", borderRadius: "4px", border: "none", backgroundColor: "#ff4d4d", color: "white", cursor: "pointer", fontSize: "10px", fontWeight: "600" }}
                                  title="Remove Track"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                )
              )}

              {/* Tab 2: Image Pins Only */}
              {activeTab === "pins" && (
                pins.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "var(--palette-text-muted)" }}>
                    <p style={{ fontSize: "15px" }}>No images pinned to this board yet. 🖼️</p>
                  </div>
                ) : (
                  <div className="responsive-board-grid">
                    {pins.map((pin, index) => (
                      <div 
                        key={pin.id} 
                        style={{ breakInside: "avoid", marginBottom: "20px", borderRadius: "16px", overflow: "hidden", backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", boxShadow: "0 2px 8px var(--palette-shadow)", position: "relative" }}
                      >
                        <img 
                          src={pin.image_url} 
                          alt={pin.title || "Pin Image"} 
                          onClick={() => setZoomImage(pin.image_url)}
                          style={{ width: "100%", display: "block", cursor: "zoom-in" }} 
                        />
                        <div style={{ padding: "12px", borderTop: "1px solid var(--palette-border)" }}>
                          <h4 style={{ fontSize: "13px", fontWeight: "700" }}>{pin.title || "Aesthetic Moment"}</h4>
                          {pin.note && <p style={{ fontSize: "11px", color: "var(--palette-text-secondary)", marginTop: "4px" }}>{pin.note}</p>}
                        </div>
                        <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "6px" }}>
                          {index > 0 && (
                            <button onClick={() => handleMovePin(index, "prev")} style={{ padding: "4px 8px", borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.6)", color: "white", cursor: "pointer", fontSize: "11px" }}>◀</button>
                          )}
                          {index < pins.length - 1 && (
                            <button onClick={() => handleMovePin(index, "next")} style={{ padding: "4px 8px", borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.6)", color: "white", cursor: "pointer", fontSize: "11px" }}>▶</button>
                          )}
                          <button onClick={() => handleDeletePin(pin.id)} style={{ padding: "4px 8px", borderRadius: "8px", border: "none", backgroundColor: "#ff4d4d", color: "white", cursor: "pointer", fontSize: "11px" }}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Tab 3: Songs Only */}
              {activeTab === "songs" && (
                songs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "var(--palette-text-muted)" }}>
                    <p style={{ fontSize: "15px" }}>No music added to this board yet. 🎵</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {songs.map((song, index) => {
                      const isActive = currentSongIndex === index;
                      const isSongPlaying = isActive && isPlaying;
                      return (
                        <div
                          key={song.id}
                          style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", backgroundColor: isActive ? "var(--palette-primary)" : "var(--palette-surface)", border: `1px solid ${isActive ? "var(--palette-border-active)" : "var(--palette-border)"}`, cursor: "pointer" }}
                          onClick={() => playSong(index)}
                        >
                          <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: "#EAD9FF", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                            {song.artwork_url ? (
                              <img src={song.artwork_url} alt={song.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <span style={{ fontSize: "24px" }}>🎵</span>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</h3>
                            <p style={{ fontSize: "12px", color: "var(--palette-text-muted)" }}>{song.artist}</p>
                          </div>
                          
                          {/* Sorting Actions */}
                          <div style={{ display: "flex", gap: "6px", marginRight: "16px" }} onClick={e => e.stopPropagation()}>
                            {index > 0 && (
                              <button onClick={() => handleMoveSong(index, "prev")} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-bg)", color: "var(--palette-text)", cursor: "pointer", fontSize: "11px" }}>▲</button>
                            )}
                            {index < songs.length - 1 && (
                              <button onClick={() => handleMoveSong(index, "next")} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-bg)", color: "var(--palette-text)", cursor: "pointer", fontSize: "11px" }}>▼</button>
                            )}
                          </div>

                          <span style={{ fontSize: "12px", color: "var(--palette-text-muted)", marginRight: "12px" }}>{song.duration || "3:00"}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleRemoveSong(song.id); }} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", backgroundColor: "#ff4d4d", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "8px" }}>Remove</button>
                          <button style={{ fontSize: "18px", background: "none", border: "none", cursor: "pointer" }}>
                            {isSongPlaying ? "⏸️" : "▶️"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>

          </div>
        )}
      </main>

      {/* Floating Spotify-style Audio Player */}
      {activePlayingSong && (
        <div style={{ position: "fixed", bottom: "72px", left: 0, right: 0, backgroundColor: "var(--palette-nav-bg)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--palette-border)", padding: "12px 12px", zIndex: 100, display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 -4px 20px rgba(0,0,0,0.15)" }}>
          <div className="responsive-player" style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between" }}>
            
            {/* Song Info */}
            <div className="responsive-player-section" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "#EAD9FF", overflow: "hidden", flexShrink: 0 }}>
                {activePlayingSong.artwork_url ? (
                  <img src={activePlayingSong.artwork_url} alt={activePlayingSong.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎵</div>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activePlayingSong.title}</h4>
                <p style={{ fontSize: "12px", color: "var(--palette-text-secondary)", margin: "2px 0 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activePlayingSong.artist}</p>
              </div>
            </div>

            {/* Play Controls */}
            <div className="responsive-controls" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button onClick={prevSong} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer", color: "var(--palette-text)" }}>⏮️</button>
              <button onClick={togglePlay} style={{ fontSize: "32px", background: "none", border: "none", cursor: "pointer", color: "var(--palette-text)" }}>{isPlaying ? "⏸️" : "▶️"}</button>
              <button onClick={nextSong} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer", color: "var(--palette-text)" }}>⏭️</button>
            </div>

            {/* Empty space for flex alignment */}
            <div className="responsive-player-section" style={{ textAlign: "right", fontSize: "12px", color: "var(--palette-text-muted)" }}>
              Playing from {board?.title}
            </div>

          </div>

          {/* Progress Bar & Timers */}
          <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <div onClick={seekTo} style={{ height: "4px", borderRadius: "999px", backgroundColor: "var(--palette-progress-track)", cursor: "pointer", position: "relative" }}>
              <div style={{ width: `${progressPercent}%`, height: "100%", borderRadius: "999px", backgroundColor: "var(--palette-progress-fill)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--palette-text-secondary)", marginTop: "4px" }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(songDuration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "var(--palette-nav-bottom-bg)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--palette-border)", zIndex: 90 }}>
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
              <span style={{ fontSize: "11px", color: "var(--palette-text-faint)" }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Zoom Image Overlay Modal */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, cursor: "zoom-out" }}
        >
          <img src={zoomImage} alt="Zoomed View" style={{ maxHeight: "85vh", maxWidth: "90vw", borderRadius: "12px", boxShadow: "0 4px 30px rgba(0,0,0,0.5)" }} />
        </div>
      )}

      {/* Edit Board Modal */}
      {showEditBoardModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150 }} onClick={() => setShowEditBoardModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", borderRadius: "24px", padding: "32px", width: "90%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>Edit Board ✏️</h3>

            {/* Preview */}
            <div style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: editBoardColor, height: "100px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
              {editBoardEmoji}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-secondary)" }}>Board Name</label>
              <input
                type="text"
                value={editBoardTitle}
                onChange={e => setEditBoardTitle(e.target.value)}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-secondary)" }}>Description</label>
              <textarea
                value={editBoardDesc}
                onChange={e => setEditBoardDesc(e.target.value)}
                rows={2}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", resize: "none" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-secondary)", display: "block", marginBottom: "8px" }}>Emoji</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["🌸", "🌙", "🌊", "☀️", "🌿", "🏙️", "🌷", "🎵", "🎨", "🌺", "📚", "🎀", "🎧", "🌈", "🦋"].map(e => (
                  <button key={e} onClick={() => setEditBoardEmoji(e)} style={{ fontSize: "20px", padding: "6px", borderRadius: "8px", border: `2px solid ${editBoardEmoji === e ? "var(--palette-border-active)" : "transparent"}`, backgroundColor: editBoardEmoji === e ? "var(--palette-primary)" : "var(--palette-bg)", cursor: "pointer" }}>{e}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-secondary)", display: "block", marginBottom: "8px" }}>Cover Color</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["#FFD9E8", "#EAD9FF", "#DDF4FF", "#FFF4C2", "#D9FBE5", "#FFB7D5", "#CDB8FF", "#8DD7FF"].map(c => (
                  <button key={c} onClick={() => setEditBoardColor(c)} style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: c, border: `3px solid ${editBoardColor === c ? "var(--palette-text)" : "transparent"}`, cursor: "pointer" }} />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "12px", backgroundColor: "var(--palette-bg)", border: "1px solid var(--palette-border)" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "600" }}>Private Board</p>
                <p style={{ fontSize: "11px", color: "var(--palette-text-muted)" }}>Only you can view this board</p>
              </div>
              <button onClick={() => setEditBoardIsPrivate(!editBoardIsPrivate)} style={{ width: "44px", height: "24px", borderRadius: "999px", backgroundColor: editBoardIsPrivate ? "var(--palette-pink)" : "var(--palette-toggle-bg)", border: "none", cursor: "pointer", position: "relative" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "white", position: "absolute", top: "3px", left: editBoardIsPrivate ? "23px" : "3px", transition: "left 0.2s" }} />
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowEditBoardModal(false)} style={{ padding: "10px 18px", borderRadius: "999px", border: "1px solid var(--palette-border)", backgroundColor: "transparent", color: "var(--palette-text-secondary)", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                Cancel
              </button>
              <button onClick={handleSaveBoard} disabled={savingBoard} style={{ padding: "10px 22px", borderRadius: "999px", border: "none", backgroundColor: "var(--palette-pink)", color: "white", cursor: savingBoard ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "600" }}>
                {savingBoard ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Pin Modal */}
      {showAddPin && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150 }}>
          <div style={{ backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", borderRadius: "24px", padding: "32px", width: "90%", maxWidth: "450px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>Pin a Moment 🖼️</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-secondary)" }}>Image URL or Upload</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/... or upload" 
                  value={pinUrl.startsWith("data:") ? "Image file selected 📷" : pinUrl} 
                  onChange={e => setPinUrl(e.target.value)}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none" }}
                />
                <button
                  type="button"
                  onClick={() => pinFileInputRef.current?.click()}
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--palette-pink)", backgroundColor: "var(--palette-pink)", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  📁 Browse
                </button>
              </div>
              <input
                ref={pinFileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-secondary)" }}>Title (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Afternoon Coffee" 
                value={pinTitle} 
                onChange={e => setPinTitle(e.target.value)}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--palette-text-secondary)" }}>Note (Optional)</label>
              <textarea 
                placeholder="Write a description for this pin..." 
                value={pinNote} 
                onChange={e => setPinNote(e.target.value)}
                rows={2}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none", resize: "none" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
              <button 
                onClick={() => { setShowAddPin(false); setPinUrl(""); setPinTitle(""); setPinNote(""); }}
                style={{ padding: "10px 18px", borderRadius: "999px", border: "1px solid var(--palette-border)", backgroundColor: "transparent", color: "var(--palette-text-secondary)", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddPin}
                style={{ padding: "10px 18px", borderRadius: "999px", border: "none", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
              >
                Pin It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Song Modal */}
      {showAddSong && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150 }}>
          <div style={{ backgroundColor: "var(--palette-surface)", border: "1px solid var(--palette-border)", borderRadius: "24px", padding: "32px", width: "90%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "18px", maxHeight: "80vh", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>Select & Add Track 🎵</h3>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <input 
                type="text" 
                placeholder="Search song title or artist..." 
                value={songSearchQuery} 
                onChange={e => setSongSearchQuery(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-input-bg)", color: "var(--palette-text)", fontSize: "14px", outline: "none" }}
              />
            </div>

            {/* Results Box */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px", paddingRight: "4px" }}>
              {initialPlaylists.filter(s =>
                s.title.toLowerCase().includes(songSearchQuery.toLowerCase()) ||
                s.artist.toLowerCase().includes(songSearchQuery.toLowerCase())
              ).length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "13px", color: "var(--palette-text-faint)", margin: "40px 0" }}>
                  No songs found
                </p>
              ) : (
                initialPlaylists.filter(s =>
                  s.title.toLowerCase().includes(songSearchQuery.toLowerCase()) ||
                  s.artist.toLowerCase().includes(songSearchQuery.toLowerCase())
                ).map((track) => (
                  <div 
                    key={track.id} 
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "12px", border: "1px solid var(--palette-border)", backgroundColor: "var(--palette-bg)" }}
                  >
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: track.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                      {track.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: "13px", fontWeight: "700", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.title}</h4>
                      <p style={{ fontSize: "11px", color: "var(--palette-text-secondary)", margin: "2px 0 0 0" }}>{track.artist} · {track.duration}</p>
                    </div>
                    <button 
                      onClick={() => handleAddSong(track)}
                      style={{ padding: "6px 14px", borderRadius: "999px", border: "none", backgroundColor: "var(--palette-primary)", color: "var(--palette-text)", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                    >
                      + Add
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--palette-border)", paddingTop: "12px" }}>
              <button 
                onClick={() => { setShowAddSong(false); setSongSearchQuery(""); }}
                style={{ padding: "8px 16px", borderRadius: "999px", border: "1px solid var(--palette-border)", backgroundColor: "transparent", color: "var(--palette-text-secondary)", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
