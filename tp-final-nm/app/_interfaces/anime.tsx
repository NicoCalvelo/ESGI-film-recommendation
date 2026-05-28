export interface AnimeImage {
  image_url: string | null;
  small_image_url: string | null;
  large_image_url: string | null;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp: AnimeImage;
}

export interface AnimeTrailerImages {
  image_url: string | null;
  small_image_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  maximum_image_url: string | null;
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: AnimeTrailerImages;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface AiredPropDate {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface AiredProp {
  from: AiredPropDate;
  to: AiredPropDate;
}

export interface AnimeAired {
  from: string | null;
  to: string | null;
  prop: AiredProp;
  string: string;
}

export interface AnimeBroadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export interface AnimeEntity {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: AnimeImages;
  trailer: AnimeTrailer;
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  source: string | null;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: AnimeAired;
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: AnimeBroadcast;
  producers: AnimeEntity[];
  licensors: AnimeEntity[];
  studios: AnimeEntity[];
  genres: AnimeEntity[];
  explicit_genres: AnimeEntity[];
  themes: AnimeEntity[];
  demographics: AnimeEntity[];
}
