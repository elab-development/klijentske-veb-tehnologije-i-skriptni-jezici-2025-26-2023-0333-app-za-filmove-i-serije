export interface MovieGenre {
  id: number;
  name: string;
}

export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type MovieListResponse = TmdbPaginatedResponse<TmdbMovie>;

export interface MovieCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface MovieProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface MovieProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface MovieSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface MovieCastMember {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

export interface MovieCrewMember {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: number | null;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

export interface MovieCredits {
  cast: MovieCastMember[];
  crew: MovieCrewMember[];
}

export interface MovieDetails extends Omit<TmdbMovie, 'genre_ids'> {
  belongs_to_collection: MovieCollection | null;
  budget: number;
  genres: MovieGenre[];
  homepage: string | null;
  imdb_id: string | null;
  origin_country: string[];
  production_companies: MovieProductionCompany[];
  production_countries: MovieProductionCountry[];
  revenue: number;
  runtime: number | null;
  spoken_languages: MovieSpokenLanguage[];
  status: string;
  tagline: string | null;
  videos?: {
    results: MovieVideo[];
  };
  credits?: MovieCredits;
}

export interface FetchMoviesParams {
  genreId?: number | null;
  includeAdult?: boolean;
  language?: string;
  page?: number;
  sortBy?: string;
}

export interface FetchMovieDetailsOptions {
  appendToResponse?: string[];
  language?: string;
}

export interface StoredMovie {
  backdropPath: string | null;
  genreIds: number[];
  id: number;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  savedAt: string;
  title: string;
  voteAverage: number;
}

export interface UserMovieLibrary {
  watched: StoredMovie[];
  watchlist: StoredMovie[];
}
