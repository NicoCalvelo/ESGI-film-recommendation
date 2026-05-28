import Image from "next/image";
import { Movie } from "../_interfaces/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="relative w-64 h-96 rounded-xl overflow-hidden shadow-2xl group cursor-pointer flex-shrink-0">
      {/* Background image */}
      <Image
        src={movie.image}
        alt={movie.title}
        className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-110"
        fill
      />

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* RT Score badge */}
      <div className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
        ★ {movie.rt_score}%
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
          Studio Ghibli · {movie.release_date}
        </span>
        <h3 className="text-white font-bold text-lg leading-tight mt-1 mb-1">
          {movie.title}
        </h3>
        <p className="text-gray-300 text-xs mb-2">
          Réalisé par <span className="text-amber-400">{movie.director}</span>
        </p>
        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
          {movie.description}
        </p>
        <div className="mt-3 border-t border-amber-500/30 pt-2 flex items-center gap-2">
          <span className="text-amber-500 text-xs">⏱ {movie.running_time} min</span>
        </div>
      </div>
    </div>
  );
}
