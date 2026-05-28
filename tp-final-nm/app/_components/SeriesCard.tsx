import Image from "next/image";
import { Series } from "../_interfaces/series";

interface SeriesCardProps {
  series: Series;
}

export default function SeriesCard({ series }: SeriesCardProps) {
  const { show } = series;

  const statusColor = show.status === "Running" ? "text-green-400" : "text-gray-400";

  return (
    <div className="flex w-80 bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-indigo-500/20 hover:border-indigo-500/60 transition-all duration-300 cursor-pointer group flex-shrink-0">
      {/* Poster */}
      <div className="w-28 h-full min-h-[160px] flex-shrink-0 overflow-hidden relative">
        {show.image ? (
          <Image
            src={show.image.medium}
            alt={show.name}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
          />
        ) : (
          <div className="w-full h-full bg-indigo-900/50 flex items-center justify-center">
            <span className="text-indigo-400 text-3xl">📺</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col p-3 flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-1 mb-1">
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">{show.name}</h3>
          {show.rating.average && (
            <span className="flex-shrink-0 bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {show.rating.average}
            </span>
          )}
        </div>

        {/* Status */}
        <span className={`text-xs font-medium ${statusColor} mb-1`}>● {show.status}</span>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-2">
          {show.genres.slice(0, 3).map((genre) => (
            <span key={genre} className="text-indigo-300 bg-indigo-900/60 text-xs px-1.5 py-0.5 rounded-full">
              {genre}
            </span>
          ))}
        </div>

        {/* Summary */}
        <p
          className="text-gray-400 text-xs line-clamp-3 leading-relaxed flex-1"
          dangerouslySetInnerHTML={{
            __html: show.summary?.replace(/<[^>]*>/g, "") ?? "Pas de synopsis.",
          }}
        />

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-indigo-500/20 flex items-center gap-3 text-xs text-gray-500">
          {show.premiered && <span>📅 {show.premiered.slice(0, 4)}</span>}
          {show.runtime && <span>⏱ {show.runtime} min</span>}
          {show.language && <span>🌐 {show.language}</span>}
        </div>
      </div>
    </div>
  );
}
