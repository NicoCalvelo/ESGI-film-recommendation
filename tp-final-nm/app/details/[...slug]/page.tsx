import { notFound } from "next/navigation";
import Image from "next/image";
import BackButton from "../../_components/_client/BackButton";
import { Movie } from "../../_interfaces/movie";
import { Anime } from "../../_interfaces/anime";
import { Book } from "../../_interfaces/book";
import { Show } from "../../_interfaces/series";
import { ContentAccent, ContentType, NormalizedContent } from "../../_interfaces/normalizedContent";

const VALID_TYPES = ["movie", "anime", "book", "series"] as const;

interface Props {
  params: Promise<{ slug: string[] }>;
}

// ─── Palettes ──────────────────────────────────────────────────────────

const ACCENTS: Record<ContentType, ContentAccent> = {
  movie: {
    ratingBg: "bg-amber-500",
    ratingText: "text-black",
    genreBg: "bg-amber-900/50",
    genreText: "text-amber-300",
    genreBorder: "border-amber-500/20",
    headingText: "text-amber-300",
    posterBorder: "border-amber-500/30",
    subtitleText: "text-amber-400",
    linkBg: "bg-amber-600 hover:bg-amber-500",
  },
  anime: {
    ratingBg: "bg-fuchsia-600",
    ratingText: "text-white",
    genreBg: "bg-fuchsia-900/50",
    genreText: "text-fuchsia-300",
    genreBorder: "border-fuchsia-500/20",
    headingText: "text-fuchsia-300",
    posterBorder: "border-fuchsia-500/30",
    subtitleText: "text-fuchsia-400",
    linkBg: "bg-fuchsia-600 hover:bg-fuchsia-500",
  },
  book: {
    ratingBg: "bg-emerald-600",
    ratingText: "text-white",
    genreBg: "bg-emerald-900/40",
    genreText: "text-emerald-300",
    genreBorder: "border-emerald-500/20",
    headingText: "text-emerald-300",
    posterBorder: "border-emerald-500/30",
    subtitleText: "text-emerald-400",
    linkBg: "bg-emerald-600 hover:bg-emerald-500",
  },
  series: {
    ratingBg: "bg-indigo-600",
    ratingText: "text-white",
    genreBg: "bg-indigo-900/60",
    genreText: "text-indigo-300",
    genreBorder: "border-indigo-500/20",
    headingText: "text-indigo-300",
    posterBorder: "border-indigo-500/30",
    subtitleText: "text-indigo-400",
    linkBg: "bg-indigo-600 hover:bg-indigo-500",
  },
};

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function fetchMovie(id: string): Promise<Movie | null> {
  const res = await fetch(`https://ghibliapi.dev/films/${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchAnime(id: string): Promise<Anime | null> {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

async function fetchBook(id: string): Promise<Book | null> {
  const res = await fetch(`https://gutendex.com/books/${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchSeries(id: string): Promise<Show | null> {
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeMovie(movie: Movie): NormalizedContent {
  return {
    id: movie.id,
    type: "movie",
    title: movie.title,
    subtitle: movie.original_title || undefined,
    typeLabel: `Studio Ghibli · ${movie.release_date}`,
    coverImage: movie.image,
    bannerImage: movie.movie_banner || undefined,
    synopsis: movie.description,
    rating: `★ ${movie.rt_score}%`,
    genres: [],
    badges: [{ text: `⏱ ${movie.running_time} min` }],
    meta: [
      { icon: "🎬", label: "Réalisé par", value: movie.director },
      ...(movie.producer ? [{ icon: "🎥", label: "Produit par", value: movie.producer }] : []),
    ],
    tags: [],
    summaries: [],
    links: [],
    accent: ACCENTS.movie,
  };
}

function normalizeAnime(anime: Anime): NormalizedContent {
  const scheduleStr = (() => {
    if (!anime.aired.string) return undefined;
    return anime.aired.string;
  })();

  return {
    id: String(anime.mal_id),
    type: "anime",
    title: anime.title_english ?? anime.title,
    subtitle: anime.title_japanese || undefined,
    typeLabel: anime.type || undefined,
    coverImage: anime.images.webp?.large_image_url ?? anime.images.jpg?.large_image_url ?? undefined,
    synopsis: anime.synopsis || undefined,
    rating: anime.score ? `★ ${anime.score}` : undefined,
    genres: anime.genres.map((g) => g.name),
    badges: [
      ...(anime.episodes ? [{ text: `📺 ${anime.episodes} épisodes` }] : []),
      ...(anime.duration ? [{ text: `⏱ ${anime.duration}` }] : []),
      {
        text: anime.status,
        variant: anime.status === "Currently Airing" ? ("success" as const) : ("default" as const),
      },
    ],
    meta: [
      ...(anime.studios.length > 0
        ? [
            {
              icon: "🏠",
              label: "Studio",
              value: anime.studios.map((s) => s.name).join(", "),
            },
          ]
        : []),
      ...(scheduleStr ? [{ icon: "📅", label: "Diffusé", value: scheduleStr }] : []),
    ],
    tags: anime.themes.map((t) => t.name),
    summaries: [],
    links: [],
    trailerYoutubeId: anime.trailer?.youtube_id || undefined,
    accent: ACCENTS.anime,
  };
}

function normalizeBook(book: Book): NormalizedContent {
  const readUrl =
    book.formats["text/html"] ??
    book.formats["application/epub+zip"] ??
    book.formats["text/plain; charset=utf-8"] ??
    null;

  const authorLine = book.authors
    .map((a) => {
      let name = a.name;
      if (a.birth_year) {
        name += ` (${a.birth_year}${a.death_year ? `–${a.death_year}` : ""})`;
      }
      return name;
    })
    .join(", ");

  return {
    id: String(book.id),
    type: "book",
    title: book.title,
    subtitle: book.authors.map((a) => a.name).join(", ") || undefined,
    typeLabel: `Gutenberg · #${book.id}`,
    coverImage: book.formats["image/jpeg"] || undefined,
    synopsis: undefined,
    rating: undefined,
    genres: [],
    badges: [...(book.languages.length > 0 ? [{ text: `🌐 ${book.languages.join(", ").toUpperCase()}` }] : [])],
    meta: [
      { icon: "✍️", label: "Auteur(s)", value: authorLine },
      {
        icon: "⬇",
        label: "Téléchargements",
        value: book.download_count.toLocaleString(),
      },
    ],
    tags: book.subjects,
    summaries: book.summaries,
    links: readUrl ? [{ label: "Lire en ligne →", url: readUrl }] : [],
    accent: ACCENTS.book,
  };
}

function normalizeSeries(show: Show): NormalizedContent {
  const summary = show.summary?.replace(/<[^>]*>/g, "") ?? undefined;

  const scheduleStr = (() => {
    if (show.schedule.days.length === 0) return undefined;
    let s = show.schedule.days.join(", ");
    if (show.schedule.time) s += ` à ${show.schedule.time}`;
    return s;
  })();

  return {
    id: String(show.id),
    type: "series",
    title: show.name,
    typeLabel: show.type || undefined,
    coverImage: show.image?.original ?? show.image?.medium ?? undefined,
    synopsis: summary,
    rating: show.rating.average ? `★ ${show.rating.average}` : undefined,
    genres: show.genres,
    badges: [
      {
        text: `● ${show.status}`,
        variant: show.status === "Running" ? ("success" as const) : ("default" as const),
      },
      ...(show.runtime ? [{ text: `⏱ ${show.runtime} min` }] : []),
      ...(show.language ? [{ text: `🌐 ${show.language}` }] : []),
    ],
    meta: [
      ...(show.network
        ? [
            {
              icon: "📡",
              label: "Chaîne",
              value: show.network.name + (show.network.country ? ` · ${show.network.country}` : ""),
            },
          ]
        : []),
      ...(show.premiered ? [{ icon: "📅", label: "Début", value: show.premiered }] : []),
      ...(show.ended ? [{ icon: "🏁", label: "Fin", value: show.ended }] : []),
      ...(scheduleStr ? [{ icon: "🗓", label: "Diffusion", value: scheduleStr }] : []),
    ],
    tags: [],
    summaries: [],
    links: show.officialSite ? [{ label: "Site officiel →", url: show.officialSite }] : [],
    accent: ACCENTS.series,
  };
}

export default async function DetailsPage({ params }: Props) {
  const { slug } = await params;
  const [type, id] = slug ?? [];

  if (!type || !id || !VALID_TYPES.includes(type as ContentType)) {
    notFound();
  }

  let content: NormalizedContent;

  switch (type as ContentType) {
    case "movie": {
      const movie = await fetchMovie(id);
      if (!movie) notFound();
      content = normalizeMovie(movie);
      break;
    }
    case "anime": {
      const anime = await fetchAnime(id);
      if (!anime) notFound();
      content = normalizeAnime(anime);
      break;
    }
    case "book": {
      const book = await fetchBook(id);
      if (!book) notFound();
      content = normalizeBook(book);
      break;
    }
    case "series": {
      const show = await fetchSeries(id);
      if (!show) notFound();
      content = normalizeSeries(show);
      break;
    }
  }

  const { accent } = content;

  const tagsLabel = content.type === "book" ? "Sujets" : "Thèmes";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <BackButton />

      {/* Full-width banner (movie only) */}
      {content.bannerImage && (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <Image src={content.bannerImage} alt={content.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/30 to-transparent" />
        </div>
      )}

      {/* Poster + info */}
      <div className="flex gap-8 flex-wrap">
        {/* Cover / Poster */}
        {content.coverImage && (
          <div
            className={`relative w-44 h-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border ${accent.posterBorder} bg-gray-900`}
          >
            <Image src={content.coverImage} alt={content.title} fill className="object-cover" />
            {/* Book spine decoration */}
            {content.type === "book" && (
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-emerald-600 to-transparent opacity-60" />
            )}
          </div>
        )}

        {/* Info panel */}
        <div className="flex-1 min-w-0">
          {content.typeLabel && (
            <span className={`${accent.subtitleText} text-xs font-semibold uppercase tracking-widest`}>
              {content.typeLabel}
            </span>
          )}

          <h1 className="text-white text-4xl font-bold mt-2 mb-1">{content.title}</h1>

          {content.subtitle && <p className="text-gray-500 text-sm mb-4">{content.subtitle}</p>}

          {/* Rating + badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            {content.rating && (
              <span className={`${accent.ratingBg} ${accent.ratingText} text-sm font-bold px-3 py-1 rounded-full`}>
                {content.rating}
              </span>
            )}
            {content.badges.map((badge, i) => (
              <span
                key={i}
                className={`text-sm px-3 py-1 rounded-full ${
                  badge.variant === "success" ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-300"
                }`}
              >
                {badge.text}
              </span>
            ))}
          </div>

          {/* Genres */}
          {content.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {content.genres.map((g) => (
                <span
                  key={g}
                  className={`${accent.genreText} ${accent.genreBg} text-xs px-2 py-1 rounded-full border ${accent.genreBorder}`}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Meta rows */}
          {content.meta.map((m, i) => (
            <p key={i} className="text-gray-400 text-sm mb-2">
              {m.icon} {m.label} : <span className={`${accent.subtitleText} font-medium`}>{m.value}</span>
            </p>
          ))}

          {/* Link buttons */}
          {content.links.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-5">
              {content.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${accent.linkBg} text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Synopsis / description */}
      {content.synopsis && (
        <div className="mt-10">
          <h2 className={`${accent.headingText} text-xl font-semibold mb-3`}>Synopsis</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{content.synopsis}</p>
        </div>
      )}

      {/* Trailer (anime) */}
      {content.trailerYoutubeId && (
        <div className="mt-10">
          <h2 className={`${accent.headingText} text-xl font-semibold mb-4`}>Trailer</h2>
          <div
            className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border ${accent.genreBorder}`}
          >
            <iframe
              src={`https://www.youtube.com/embed/${content.trailerYoutubeId}`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Tags: subjects (books) / themes (anime) */}
      {content.tags.length > 0 && (
        <div className="mt-10">
          <h2 className={`${accent.headingText} text-xl font-semibold mb-3`}>{tagsLabel}</h2>
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag) => (
              <span
                key={tag}
                className={`${accent.genreText} ${accent.genreBg} text-xs px-2.5 py-1 rounded-full border ${accent.genreBorder}`}
              >
                {tag.length > 40 ? tag.slice(0, 40) + "…" : tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Extra text blocks (book summaries) */}
      {content.summaries.length > 0 && (
        <div className="mt-8">
          <h2 className={`${accent.headingText} text-xl font-semibold mb-3`}>Résumé</h2>
          {content.summaries.map((s, i) => (
            <p key={i} className="text-gray-300 text-sm leading-relaxed mb-3">
              {s}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
