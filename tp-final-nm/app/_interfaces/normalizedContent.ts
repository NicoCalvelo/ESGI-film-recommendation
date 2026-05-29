export type ContentType = "movie" | "anime" | "book" | "series";

/** A pill badge shown next to the rating (status, duration, episodes, language…) */
export interface ContentBadge {
  text: string;
  variant?: "default" | "success";
}

/** A key-value metadata row (director, studio, network, dates…) */
export interface ContentMeta {
  icon: string;
  label: string;
  value: string;
}

/** An external link button (official site, read online…) */
export interface ContentLink {
  label: string;
  url: string;
}

/** Tailwind class tokens for the per-type color theme */
export interface ContentAccent {
  ratingBg: string;
  ratingText: string;
  genreBg: string;
  genreText: string;
  genreBorder: string;
  headingText: string;
  posterBorder: string;
  subtitleText: string;
  linkBg: string;
}

/**
 * Normalized shape shared by all four content types.
 * Produced by the type-specific normalizer functions in the detail page.
 */
export interface NormalizedContent {
  id: string;
  type: ContentType;
  /** Primary display title */
  title: string;
  /** Secondary line: original title / author names / etc. */
  subtitle?: string;
  /** Small label above the title: "Studio Ghibli · 1997", "TV", "Gutenberg · #84" */
  typeLabel?: string;
  coverImage?: string;
  /** Full-width banner (movie only) */
  bannerImage?: string;
  synopsis?: string;
  /** Display-ready rating string, e.g. "★ 8.5" or "★ 95%" */
  rating?: string;
  genres: string[];
  badges: ContentBadge[];
  meta: ContentMeta[];
  /** Subject tags (books) or themes (anime) */
  tags: string[];
  /** Additional text blocks, e.g. book summaries */
  summaries: string[];
  links: ContentLink[];
  /** YouTube video ID for the trailer iframe (anime only) */
  trailerYoutubeId?: string;
  accent: ContentAccent;
}
