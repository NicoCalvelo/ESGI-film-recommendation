"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BookIcon, Clapperboard, MonitorPlay, Popcorn, Search, Sparkles, Users, X } from "lucide-react";
import { UserProvider, useUser } from "@/app/_contexts/UserContext";
import { User } from "@/app/_interfaces/user";
import { RecommendationItem } from "@/app/_services/RecommendationsService";
import { fetchRecommendations, compareUsers } from "@/app/_utils/recommendationsClient";
import HorizontalRow from "@/app/_components/HorizontalRow";
import RecommendationCard from "@/app/_components/RecommendationCard";

interface Results {
  movies: RecommendationItem[];
  series: RecommendationItem[];
  anime: RecommendationItem[];
  books: RecommendationItem[];
}

interface LoadingState {
  movies: boolean;
  series: boolean;
  anime: boolean;
  books: boolean;
}

const LOADING_ALL: LoadingState = { movies: true, series: true, anime: true, books: true };
const DONE_ALL: LoadingState = { movies: false, series: false, anime: false, books: false };
const EMPTY: Results = { movies: [], series: [], anime: [], books: [] };

interface CompatibilityResult {
  compatibility: {
    commonGenres: string[];
    commonActors: string[];
    commonDirectors: string[];
    compatibilityScore: number;
    description: string;
  };
  bridgeContent: RecommendationItem[] | string;
}

function hasEnoughPreferences(user: User): boolean {
  return (
    user.likes.genres.length > 0 ||
    user.likes.actors.length > 0 ||
    user.likes.directors.length > 0 ||
    user.likes.films.length > 0 ||
    user.likes.series.length > 0 ||
    user.likes.anime.length > 0 ||
    user.likes.books.length > 0
  );
}

function RecommendationsContent() {
  const { user } = useUser();
  const [results, setResults] = useState<Results>(EMPTY);
  const [loading, setLoading] = useState<LoadingState>(DONE_ALL);

  // Comparison section
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const loadRecommendations = useCallback((u: User) => {
    setLoading(LOADING_ALL);
    setResults(EMPTY);

    const fetch$ = <K extends keyof Results>(
      key: K,
      source: Parameters<typeof fetchRecommendations>[0],
      type: Parameters<typeof fetchRecommendations>[3]
    ) =>
      fetchRecommendations(source, u, 10, type)
        .then((data) => setResults((prev) => ({ ...prev, [key]: data })))
        .catch(() => {})
        .finally(() =>
          setLoading((prev) => ({ ...prev, [key]: false }))
        );

    fetch$("movies", "studioghibli", "films");
    fetch$("series", "tvmaze", "series");
    fetch$("anime", "jikan", "anime");
    fetch$("books", "gutendex", "books");
  }, []);

  useEffect(() => {
    if (user && hasEnoughPreferences(user)) {
      loadRecommendations(user);
    }
  }, [user, loadRecommendations]);

  // Search users with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const params = new URLSearchParams({ query: searchQuery });
        if (user?.id) params.set("excludeId", user.id);
        const res = await fetch(`/api/users/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.users ?? []);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectUser = useCallback(
    async (other: User) => {
      if (!user) return;
      setSelectedUser(other);
      setSearchQuery("");
      setSearchResults([]);
      setCompareLoading(true);
      try {
        const result = await compareUsers(user, other, "jikan");
        setCompatibility(result);
      } finally {
        setCompareLoading(false);
      }
    },
    [user],
  );

  // — Not logged in —
  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <Sparkles size={48} className="text-gray-600" />
        <h1 className="text-2xl font-bold text-white">Recommandations</h1>
        <p className="text-gray-400 text-center max-w-sm">
          Connectez-vous pour obtenir des recommandations personnalisées.
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

  // — Not enough preferences —
  if (!hasEnoughPreferences(user)) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Sparkles size={48} className="text-indigo-400" />
        <h1 className="text-2xl font-bold text-white">Recommandations</h1>
        <p className="text-gray-400 max-w-sm">
          Likez des films, séries, animes ou livres depuis la page de recherche pour obtenir des recommandations
          personnalisées.
        </p>
        <Link
          href="/"
          className="mt-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
        >
          Explorer du contenu
        </Link>
      </main>
    );
  }

  const scoreColor =
    compatibility && compatibility.compatibility.compatibilityScore >= 60
      ? "text-green-400"
      : compatibility && compatibility.compatibility.compatibilityScore >= 30
        ? "text-amber-400"
        : "text-rose-400";

  return (
    <main className="min-h-screen px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex items-center gap-3">
        <Sparkles size={28} className="text-indigo-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Recommandations</h1>
          <p className="text-gray-400 text-sm">Basées sur vos goûts</p>
        </div>
      </div>

      {/* ── Compare section ── */}
      <section className="mb-16 border-b border-gray-700 py-5">
        <div className="flex items-center gap-3 mb-6">
          <Users size={24} className="text-violet-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Comparer avec un ami</h2>
            <p className="text-gray-400 text-sm">Découvrez votre compatibilité et du contenu à regarder ensemble.</p>
          </div>
        </div>

        {/* Search */}
        {!selectedUser && (
          <div className="relative max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un utilisateur par nom…"
                className="w-full bg-gray-800 border border-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            {searchLoading && <p className="text-gray-500 text-xs mt-2 ml-1">Recherche…</p>}

            {searchResults.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                {searchResults.map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => handleSelectUser(u)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{u.name}</p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Selected user + results */}
        {selectedUser && (
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6 bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-violet-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{selectedUser.name}</p>
                <p className="text-gray-400 text-xs">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setCompatibility(null);
                }}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {compareLoading && <p className="text-gray-400 text-sm animate-pulse">Calcul de la compatibilité…</p>}

            {compatibility && !compareLoading && (
              <div className="flex flex-col gap-6">
                {/* Score */}
                <div className="flex items-center gap-4">
                  <div className={`text-5xl font-black ${scoreColor}`}>
                    {compatibility.compatibility.compatibilityScore}%
                  </div>
                  <div>
                    <p className="text-white font-semibold">Score de compatibilité</p>
                    <p className="text-gray-400 text-sm">{compatibility.compatibility.description}</p>
                  </div>
                </div>

                {/* Common elements */}
                <div className="flex flex-wrap gap-4">
                  {compatibility.compatibility.commonGenres.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Genres en commun</p>
                      <div className="flex flex-wrap gap-1.5">
                        {compatibility.compatibility.commonGenres.map((g) => (
                          <span
                            key={g}
                            className="text-xs px-2 py-1 rounded-full bg-violet-900/50 text-violet-300 border border-violet-500/30"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {compatibility.compatibility.commonActors.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Acteurs en commun</p>
                      <div className="flex flex-wrap gap-1.5">
                        {compatibility.compatibility.commonActors.map((a) => (
                          <span
                            key={a}
                            className="text-xs px-2 py-1 rounded-full bg-violet-900/50 text-violet-300 border border-violet-500/30"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {compatibility.compatibility.commonDirectors.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Réalisateurs en commun</p>
                      <div className="flex flex-wrap gap-1.5">
                        {compatibility.compatibility.commonDirectors.map((d) => (
                          <span
                            key={d}
                            className="text-xs px-2 py-1 rounded-full bg-violet-900/50 text-violet-300 border border-violet-500/30"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bridge content */}
                {Array.isArray(compatibility.bridgeContent) && compatibility.bridgeContent.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Anime à regarder ensemble</p>
                    <div className="flex flex-wrap gap-2">
                      {(compatibility.bridgeContent as RecommendationItem[]).map((item) => (
                        <Link
                          key={item.id}
                          href={`/details/anime/${item.id}`}
                          className="text-sm px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-600 text-white hover:border-violet-500/60 transition"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setCompatibility(null);
                  }}
                  className="self-start text-sm text-gray-500 hover:text-gray-300 transition underline"
                >
                  Comparer avec quelqu&apos;un d&apos;autre
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Recommendation rows */}
      <div className="flex flex-col gap-2">
        <HorizontalRow
          title="Films Studio Ghibli"
          icon={<Clapperboard />}
          accentClass="text-amber-400"
          count={results.movies.length}
          loading={loading.movies}
          empty={!loading.movies && results.movies.length === 0}
          emptyMessage="Aucun film Ghibli ne correspond à vos goûts."
        >
          {results.movies.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              accentClass="text-amber-400"
              bgClass="bg-amber-900/20"
              borderClass="border-amber-500/30"
            />
          ))}
        </HorizontalRow>

        <HorizontalRow
          title="Séries TV"
          icon={<MonitorPlay />}
          accentClass="text-indigo-400"
          count={results.series.length}
          loading={loading.series}
          empty={!loading.series && results.series.length === 0}
          emptyMessage="Aucune série ne correspond à vos goûts."
        >
          {results.series.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              accentClass="text-indigo-400"
              bgClass="bg-indigo-900/20"
              borderClass="border-indigo-500/30"
            />
          ))}
        </HorizontalRow>

        <HorizontalRow
          title="Anime"
          icon={<Popcorn />}
          accentClass="text-fuchsia-400"
          count={results.anime.length}
          loading={loading.anime}
          empty={!loading.anime && results.anime.length === 0}
          emptyMessage="Aucun anime ne correspond à vos goûts."
        >
          {results.anime.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              accentClass="text-fuchsia-400"
              bgClass="bg-fuchsia-900/20"
              borderClass="border-fuchsia-500/30"
            />
          ))}
        </HorizontalRow>

        <HorizontalRow
          title="Livres"
          icon={<BookIcon />}
          accentClass="text-emerald-400"
          count={results.books.length}
          loading={loading.books}
          empty={!loading.books && results.books.length === 0}
          emptyMessage="Aucun livre ne correspond à vos goûts."
        >
          {results.books.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              accentClass="text-emerald-400"
              bgClass="bg-emerald-900/20"
              borderClass="border-emerald-500/30"
            />
          ))}
        </HorizontalRow>
      </div>
    </main>
  );
}

export default function RecommendationsPage() {
  return (
    <UserProvider>
      <RecommendationsContent />
    </UserProvider>
  );
}
