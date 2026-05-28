export interface SeriesSchedule {
  time: string;
  days: string[];
}

export interface SeriesRating {
  average: number | null;
}

export interface SeriesNetwork {
  id: number;
  name: string;
  country: string | null;
  officialSite: string | null;
}

export interface SeriesExternals {
  tvrage: number | null;
  thetvdb: number | null;
  imdb: string | null;
}

export interface SeriesImage {
  medium: string;
  original: string;
}

export interface SeriesLink {
  href: string;
  name?: string;
}

export interface SeriesLinks {
  self: SeriesLink;
  previousepisode?: SeriesLink;
  nextepisode?: SeriesLink;
}

export interface Show {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string | null;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: SeriesSchedule;
  rating: SeriesRating;
  weight: number;
  network: SeriesNetwork | null;
  webChannel: SeriesNetwork | null;
  dvdCountry: string | null;
  externals: SeriesExternals;
  image: SeriesImage | null;
  summary: string | null;
  updated: number;
  _links: SeriesLinks;
}

export interface Series {
  score: number;
  show: Show;
}
