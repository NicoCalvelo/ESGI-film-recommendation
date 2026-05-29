"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookIcon, Clapperboard, Heart, HeartCrack, MonitorPlay, Popcorn } from "lucide-react";
import { UserProvider, useUser } from "@/app/_contexts/UserContext";
import { User } from "@/app/_interfaces/user";
import { getUserPreferences } from "@/app/_services/UserPreferencesService";

type LikeCategory = keyof User["likes"];

interface CategoryConfig {
  key: LikeCategory;
  label: string;
  icon: React.ReactNode;
  accentClass: string;
  bgClass: string;
  borderClass: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: "films",
    label: "Films",
    icon: <Clapperboard size={18} />,
    accentClass: "text-amber-400",
    bgClass: "bg-amber-900/30",
    borderClass: "border-amber-500/30",
  },
  {
    key: "series",
    label: "Séries",
    icon: <MonitorPlay size={18} />,
    accentClass: "text-indigo-400",
    bgClass: "bg-indigo-900/30",
    borderClass: "border-indigo-500/30",
  },
  {
    key: "anime",
    label: "Anime",
    icon: <Popcorn size={18} />,
    accentClass: "text-fuchsia-400",
    bgClass: "bg-fuchsia-900/30",
    borderClass: "border-fuchsia-500/30",
  },
  {
    key: "books",
    label: "Livres",
    icon: <BookIcon size={18} />,
    accentClass: "text-emerald-400",
    bgClass: "bg-emerald-900/30",
    borderClass: "border-emerald-500/30",
  },
];

function FavoritesContent() {
  const { user } = useUser();
  const [preferences, setPreferences] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"likes" | "dislikes">("likes");

  useEffect(() => {
    // Refresh preferences whenever user changes
    setPreferences(getUserPreferences());
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <Heart size={48} className="text-gray-600" />
        <h1 className="text-2xl font-bold text-white">Mes favoris</h1>
        <p className="text-gray-400 text-center max-w-sm">
          Connectez-vous pour voir vos films, séries, animes et livres favoris.
        </p>
        <Link
          href="/"
          className="mt-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
    );
  }

  const totalLikes = CATEGORIES.reduce((sum, cat) => sum + (preferences?.likes[cat.key].length ?? 0), 0);
  const totalDislikes = CATEGORIES.reduce((sum, cat) => sum + (preferences?.dislikes[cat.key].length ?? 0), 0);
  const activeData = activeTab === "likes" ? preferences?.likes : preferences?.dislikes;
  const activeTotal = activeTab === "likes" ? totalLikes : totalDislikes;

  return (
    <main className="min-h-screen px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Heart size={28} className="text-rose-400" fill="currentColor" />
          <h1 className="text-3xl font-bold text-white">Mes favoris</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("likes")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === "likes"
              ? "bg-gray-800 text-rose-400 border border-b-gray-800 border-gray-700 -mb-px"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Heart size={14} fill={activeTab === "likes" ? "currentColor" : "none"} />
          Aimés
          <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">{totalLikes}</span>
        </button>
        <button
          onClick={() => setActiveTab("dislikes")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === "dislikes"
              ? "bg-gray-800 text-gray-400 border border-b-gray-800 border-gray-700 -mb-px"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <HeartCrack size={14} />
          Non aimés
          <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">{totalDislikes}</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-10">
        {CATEGORIES.map((cat) => {
          const items = activeData?.[cat.key] ?? [];
          const isLikesTab = activeTab === "likes";
          return (
            <section key={cat.key}>
              <div className="flex items-center gap-2 mb-4">
                <span className={cat.accentClass}>{cat.icon}</span>
                <h2 className={`text-xl font-semibold ${cat.accentClass}`}>{cat.label}</h2>
                <span className="text-gray-500 text-sm">({items.length})</span>
              </div>

              {items.length === 0 ? (
                <p className="text-gray-600 text-sm italic">Aucun élément dans cette catégorie.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {items.map((title) => (
                    <div
                      key={title}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${cat.bgClass} ${cat.borderClass}`}
                    >
                      {isLikesTab ? (
                        <Heart size={12} className="text-rose-400" fill="currentColor" />
                      ) : (
                        <HeartCrack size={12} className="text-gray-400" />
                      )}
                      <span className="text-white text-sm font-medium">{title}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {activeTotal === 0 && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-gray-500 text-sm max-w-sm">
            {activeTab === "likes"
              ? "Explorez des films, séries, animes et livres puis cliquez sur ❤️ pour les ajouter ici."
              : "Les contenus que vous n'aimez pas apparaîtront ici."}
          </p>
          <Link
            href="/"
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
          >
            Découvrir du contenu
          </Link>
        </div>
      )}
    </main>
  );
}

export default function FavoritesPage() {
  return (
    <UserProvider>
      <FavoritesContent />
    </UserProvider>
  );
}
