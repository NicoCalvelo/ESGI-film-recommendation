"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toggleLike, toggleDislike, isLiked, isDisliked, addLike } from "@/app/_services/UserPreferencesService";
import { User } from "@/app/_interfaces/user";
import { useUser } from "@/app/_contexts/UserContext";
import LoginModal from "./_modals/LoginModal";
import SignUpModal from "./_modals/SignUpModal";

type PreferenceCategory = keyof User["likes"];
type Modal = "login" | "signup" | null;

interface LikeDislikeBarProps {
  category: PreferenceCategory;
  value: string;
  associatedGenres?: string[];
  associatedActors?: string[];
  associatedDirectors?: string[];
}

export default function LikeDislikeBar({
  category,
  value,
  associatedGenres,
  associatedActors,
  associatedDirectors,
}: LikeDislikeBarProps) {
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [openModal, setOpenModal] = useState<Modal>(null);

  useEffect(() => {
    setLiked(isLiked(category, value));
    setDisliked(isDisliked(category, value));
  }, [category, value]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setOpenModal("login");
      return;
    }
    const wasLiked = liked;
    toggleLike(category, value);
    if (!wasLiked) {
      if (associatedGenres) {
        associatedGenres.forEach((g) => addLike("genres", g));
      }
      if (associatedActors) {
        associatedActors.forEach((a) => addLike("actors", a));
      }
      if (associatedDirectors) {
        associatedDirectors.forEach((d) => addLike("directors", d));
      }
    }
    setLiked(isLiked(category, value));
    setDisliked(isDisliked(category, value));
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setOpenModal("login");
      return;
    }
    toggleDislike(category, value);
    setLiked(isLiked(category, value));
    setDisliked(isDisliked(category, value));
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-black/75 rounded backdrop-blur-sm flex items-center justify-around translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20">
        <button
          onClick={handleLike}
          aria-label="Like"
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            liked ? "bg-green-500 text-white scale-105" : "bg-white/10 text-white hover:bg-green-500/60"
          }`}
        >
          <span className="text-base">👍</span>
          {liked && <span className="text-xs">J&apos;aime</span>}
        </button>

        <div className="w-px h-6 bg-white/20" />

        <button
          onClick={handleDislike}
          aria-label="Dislike"
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            disliked ? "bg-red-500 text-white scale-105" : "bg-white/10 text-white hover:bg-red-500/60"
          }`}
        >
          <span className="text-base">👎</span>
          {disliked && <span className="text-xs">Je n&apos;aime pas</span>}
        </button>
      </div>

      {openModal === "login" && (
        <LoginModal onClose={() => setOpenModal(null)} onSwitchToSignUp={() => setOpenModal("signup")} />
      )}
      {openModal === "signup" && (
        <SignUpModal onClose={() => setOpenModal(null)} onSwitchToLogin={() => setOpenModal("login")} />
      )}
    </>
  );
}
