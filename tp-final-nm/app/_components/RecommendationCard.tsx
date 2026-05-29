import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import { RecommendationItem } from "@/app/_services/RecommendationsService";

interface RecommendationCardProps {
  item: RecommendationItem;
  accentClass: string;
  bgClass: string;
  borderClass: string;
}

const SOURCE_SLUG: Record<RecommendationItem["source"], string> = {
  studioghibli: "movie",
  tvmaze: "series",
  jikan: "anime",
  gutendex: "book",
};

export default function RecommendationCard({ item, accentClass, bgClass, borderClass }: RecommendationCardProps) {
  const slug = SOURCE_SLUG[item.source];
  const href = `/details/${slug}/${item.id}`;

  return (
    <div className={`group relative flex flex-col w-52 flex-shrink-0 rounded-xl overflow-hidden border ${borderClass} ${bgClass} shadow-lg hover:-translate-y-1 transition-all duration-300`}>
      <Link href={href} className="block">
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-800">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {slug === "movie" ? "🎬" : slug === "series" ? "📺" : slug === "anime" ? "🎌" : "📖"}
            </div>
          )}

          {/* Score badge */}
          <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-lg bg-black/70 ${accentClass}`}>
            +{item.score}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-2">{item.title}</h3>

          {/* Genres */}
          {item.genres && item.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {item.genres.slice(0, 2).map((g) => (
                <span key={g} className={`text-xs px-1.5 py-0.5 rounded-full border ${bgClass} ${accentClass} ${borderClass} opacity-90`}>
                  {g.length > 14 ? g.slice(0, 14) + "…" : g}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Match reasons tooltip */}
      {item.matchReasons.length > 0 && (
        <div className="px-3 pb-3">
          <details className="group/details">
            <summary className={`flex items-center gap-1 text-xs cursor-pointer ${accentClass} opacity-70 hover:opacity-100 list-none`}>
              <Info size={11} />
              Pourquoi ce choix ?
            </summary>
            <ul className="mt-1.5 flex flex-col gap-1">
              {item.matchReasons.map((reason, i) => (
                <li key={i} className="text-gray-400 text-xs leading-snug">
                  · {reason}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
