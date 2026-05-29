"use client";

import { JSX, useRef } from "react";

interface HorizontalRowProps {
  title: string;
  icon: JSX.Element;
  accentClass: string;
  count: number;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

export default function HorizontalRow({
  title,
  icon,
  accentClass,
  count,
  loading = false,
  empty = false,
  emptyMessage = "Aucun résultat.",
  children,
}: HorizontalRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 480 : -480, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      {/* Row header */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="flex gap-2 items-center text-gray-400">
          {icon}
          <h2 className={`text-xl font-semibold ${accentClass} flex items-center gap-2`}>{title}</h2>
        </div>
        {loading ? (
          <span className="text-gray-500 text-sm animate-pulse">Chargement…</span>
        ) : (
          <span className="text-gray-500 text-sm font-normal">({count})</span>
        )}
      </div>

      {/* Scroll container */}
      {loading ? (
        <div className="flex gap-4 overflow-x-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-52 h-72 bg-gray-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : empty ? (
        <p className="text-gray-500 italic text-sm pl-1">{emptyMessage}</p>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Défiler à gauche"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 text-white text-2xl rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl"
          >
            ‹
          </button>

          {/* Cards track */}
          <div
            ref={scrollRef}
            className="flex gap-4 pb-3 max-w-[1050px] mx-auto overflow-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {children}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Défiler à droite"
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 text-white text-2xl rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
