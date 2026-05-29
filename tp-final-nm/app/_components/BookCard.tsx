import Image from "next/image";
import Link from "next/link";
import { Book } from "../_interfaces/book";
import LikeDislikeBar from "./_client/LikeDislikeBar";
import { UserProvider } from "../_contexts/UserContext";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const coverImage = book.formats["image/jpeg"];
  const authorNames = book.authors.map((a) => a.name).join(", ") || "Auteur inconnu";

  return (
    <div className="relative group overflow-hidden flex flex-col w-52 flex-shrink-0 ">
      <Link
        href={`/details/book/${book.id}`}
        className="relative w-52  h-full bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-emerald-500/20 hover:border-emerald-500/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex-shrink-0 flex flex-col group"
      >
        {/* Book cover */}
        <div className="h-64 w-full relative overflow-hidden bg-emerald-950">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
              <span className="text-5xl">📖</span>
              <p className="text-emerald-300 text-xs text-center font-medium leading-tight">{book.title}</p>
            </div>
          )}
          {/* Spine effect */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-emerald-600 to-transparent opacity-60" />
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">{book.title}</h3>
          <p className="text-emerald-400 text-xs mb-2 line-clamp-1">{authorNames}</p>

          {/* Subjects */}
          {book.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {book.subjects.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="text-emerald-300 bg-emerald-900/50 text-xs px-1.5 py-0.5 rounded-full line-clamp-1 max-w-full"
                >
                  {s.length > 20 ? s.slice(0, 20) + "…" : s}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-2 border-t border-emerald-500/20 flex items-center gap-2 text-xs text-gray-500">
            <span>⬇ {book.download_count.toLocaleString()} téléchargements</span>
          </div>
        </div>
      </Link>
      <UserProvider>
        <LikeDislikeBar category="books" value={book.title} />
      </UserProvider>
    </div>
  );
}
