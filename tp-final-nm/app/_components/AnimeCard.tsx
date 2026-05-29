import Image from "next/image";
import Link from "next/link";
import { Anime } from "../_interfaces/anime";
import LikeDislikeBar from "./_client/LikeDislikeBar";
import { UserProvider } from "../_contexts/UserContext";

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const image = anime.images.webp?.large_image_url ?? anime.images.jpg?.large_image_url ?? null;

  return (
    <div className="relative group overflow-hidden flex flex-col w-56 flex-shrink-0">
      <Link
        href={`/details/anime/${anime.mal_id}`}
        className="relative w-56 h-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-fuchsia-500/20 hover:border-fuchsia-500/70 hover:shadow-fuchsia-500/20 hover:shadow-xl transition-all duration-300 cursor-pointer group flex-shrink-0 flex flex-col"
      >
        <div className="h-72 w-full relative overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={anime.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-fuchsia-950 flex items-center justify-center">
              <span className="text-5xl">🎌</span>
            </div>
          )}

          {/* Top gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

          {/* Score badge */}
          {anime.score && (
            <div className="absolute top-2 left-2 bg-fuchsia-600 text-white text-sm font-extrabold px-2.5 py-1 rounded-lg shadow-lg">
              ★ {anime.score}
            </div>
          )}

          {/* Type badge */}
          {anime.type && (
            <div className="absolute top-2 right-2 bg-black/70 text-fuchsia-300 text-xs font-bold px-2 py-1 rounded-md border border-fuchsia-500/40">
              {anime.type}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
            {anime.title_english ?? anime.title}
          </h3>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-2">
            {anime.genres.slice(0, 3).map((g) => (
              <span key={g.mal_id} className="text-fuchsia-300 bg-fuchsia-900/50 text-xs px-1.5 py-0.5 rounded-full">
                {g.name}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed flex-1">
            {anime.synopsis ?? "Pas de synopsis."}
          </p>

          {/* Footer */}
          <div className="mt-2 pt-2 border-t border-fuchsia-500/20 flex items-center gap-3 text-xs text-gray-500">
            {anime.episodes && <span>📺 {anime.episodes} ép.</span>}
            <span className={anime.status === "Currently Airing" ? "text-green-400" : "text-gray-500"}>
              ● {anime.status}
            </span>
          </div>
        </div>
      </Link>
      <UserProvider>
        <LikeDislikeBar category="anime" value={anime.title} associatedGenres={anime.genres.map((g) => g.name)} />
      </UserProvider>
    </div>
  );
}
