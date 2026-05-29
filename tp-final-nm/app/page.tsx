"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "./_components/_client/SearchBar";
import HorizontalRow from "./_components/HorizontalRow";
import MovieCard from "./_components/MovieCard";
import SeriesCard from "./_components/SeriesCard";
import AnimeCard from "./_components/AnimeCard";
import BookCard from "./_components/BookCard";
import { Movie } from "./_interfaces/movie";
import { Series } from "./_interfaces/series";
import { Anime } from "./_interfaces/anime";
import { Book } from "./_interfaces/book";
import { BookIcon, Clapperboard, MonitorPlay, Popcorn } from "lucide-react";

interface Results {
  movies: Movie[];
  series: Series[];
  anime: Anime[];
  books: Book[];
}

interface Loading {
  movies: boolean;
  series: boolean;
  anime: boolean;
  books: boolean;
}

const LOADING_ALL: Loading = { movies: true, series: true, anime: true, books: true };
const DONE_ALL: Loading = { movies: false, series: false, anime: false, books: false };
const EMPTY: Results = { movies: [], series: [], anime: [], books: [] };

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Results>(EMPTY);
  const [loading, setLoading] = useState<Loading>(DONE_ALL);
  const [lastQuery, setLastQuery] = useState("");

  const runSearch = useCallback(async (query: string) => {
    if (!query) return;

    setHasSearched(true);
    setLastQuery(query);
    setLoading(LOADING_ALL);
    setResults(EMPTY);

    const q = query.toLowerCase();

    const fetchMovies = fetch(`/api/studioghibli/getList`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Movie[]) => {
        const movies = data.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.director.toLowerCase().includes(q),
        );
        setResults((prev) => ({ ...prev, movies }));
        setLoading((prev) => ({ ...prev, movies: false }));
      })
      .catch(() => setLoading((prev) => ({ ...prev, movies: false })));

    const fetchSeries = fetch(`/api/tvmaze/getList?search=${encodeURIComponent(query)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Series[]) => {
        setResults((prev) => ({ ...prev, series: data }));
        setLoading((prev) => ({ ...prev, series: false }));
      })
      .catch(() => setLoading((prev) => ({ ...prev, series: false })));

    const fetchAnime = fetch(`/api/jikan/getList?search=${encodeURIComponent(query)}&page=1`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((data: { data: Anime[] }) => {
        setResults((prev) => ({ ...prev, anime: data.data ?? [] }));
        setLoading((prev) => ({ ...prev, anime: false }));
      })
      .catch(() => setLoading((prev) => ({ ...prev, anime: false })));

    const fetchBooks = fetch(`/api/gutendex/getList?search=${encodeURIComponent(query)}`)
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data: { results: Book[] }) => {
        setResults((prev) => ({ ...prev, books: data.results ?? [] }));
        setLoading((prev) => ({ ...prev, books: false }));
      })
      .catch(() => setLoading((prev) => ({ ...prev, books: false })));

    await Promise.allSettled([fetchMovies, fetchSeries, fetchAnime, fetchBooks]);
  }, []);

  // Sync with URL param on mount and on back/forward navigation
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    if (q) {
      runSearch(q);
    }
  }, [searchParams, runSearch]);

  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <main className="min-h-screen">
      {/* ── Search hero / header ── */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          hasSearched
            ? "px-6 pt-8 pb-6 border-b border-gray-800"
            : "flex flex-col items-center justify-center min-h-screen px-6"
        }`}
      >
        {!hasSearched && (
          <div className="text-center mb-10 animate-fade-in">
            <p className="text-indigo-400 text-xl">Films · Séries · Animés · Livres</p>
            <p className="text-gray-500 text-sm mt-2">Tapez pour lancer la recherche sur toutes les sources</p>
          </div>
        )}

        <div className={hasSearched ? "max-w-2xl w-full" : "w-full flex justify-center"}>
          {hasSearched && (
            <p className="text-gray-500 text-xs mb-2">
              Résultats pour <span className="text-indigo-300 font-medium">«{lastQuery}»</span>
            </p>
          )}
          <SearchBar onSearch={handleSearch} collapsed={hasSearched} initialValue={searchParams.get("q") ?? ""} />
        </div>
      </div>

      {/* ── Results ── */}
      {hasSearched && (
        <div className="px-6 py-10">
          <HorizontalRow
            title="Films Studio Ghibli"
            icon={<Clapperboard />}
            accentClass="text-amber-400"
            count={results.movies.length}
            loading={loading.movies}
            empty={!loading.movies && results.movies.length === 0}
            emptyMessage="Aucun film Ghibli ne correspond à cette recherche."
          >
            {results.movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </HorizontalRow>

          <HorizontalRow
            title="Séries TV"
            icon={<MonitorPlay />}
            accentClass="text-indigo-400"
            count={results.series.length}
            loading={loading.series}
            empty={!loading.series && results.series.length === 0}
            emptyMessage="Aucune série trouvée."
          >
            {results.series.map((s) => (
              <SeriesCard key={s.show.id} series={s} />
            ))}
          </HorizontalRow>

          <HorizontalRow
            title="Anime"
            icon={<Popcorn />}
            accentClass="text-fuchsia-400"
            count={results.anime.length}
            loading={loading.anime}
            empty={!loading.anime && results.anime.length === 0}
            emptyMessage="Aucun anime trouvé."
          >
            {results.anime.map((a) => (
              <AnimeCard key={a.mal_id} anime={a} />
            ))}
          </HorizontalRow>

          <HorizontalRow
            title="Livres"
            icon={<BookIcon />}
            accentClass="text-emerald-400"
            count={results.books.length}
            loading={loading.books}
            empty={!loading.books && results.books.length === 0}
            emptyMessage="Aucun livre trouvé."
          >
            {results.books.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </HorizontalRow>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
