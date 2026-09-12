import type {
  FetchMovieDetailsOptions,
  FetchMoviesParams,
  MovieDetails,
  MovieGenre,
  MovieListResponse,
} from '../types/Movie';

export const DEFAULT_TMDB_LANGUAGE = 'en-US';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

type QueryParamValue = boolean | number | string | null | undefined;

type QueryParams = Record<string, QueryParamValue>;

interface TmdbCredentials {
  accessToken?: string;
  apiKey?: string;
}

interface TmdbErrorResponse {
  status_code?: number;
  status_message?: string;
  success?: boolean;
}

export class TmdbApiError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'TmdbApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

const getTmdbCredentials = (): TmdbCredentials => {
  const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim();

  if (!accessToken && !apiKey) {
    throw new Error(
      'TMDb credentials are missing. Add VITE_TMDB_API_KEY or VITE_TMDB_ACCESS_TOKEN to your .env.local file.',
    );
  }

  return {
    accessToken,
    apiKey,
  };
};

const normalizeEndpoint = (endpoint: string) =>
  endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

const appendQueryParams = (url: URL, params: QueryParams) => {
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return;
    }

    url.searchParams.set(key, String(value));
  });
};

const buildTmdbUrl = (endpoint: string, params: QueryParams = {}) => {
  const credentials = getTmdbCredentials();
  const url = new URL(`${TMDB_API_BASE_URL}${normalizeEndpoint(endpoint)}`);

  appendQueryParams(url, params);

  if (!credentials.accessToken && credentials.apiKey) {
    url.searchParams.set('api_key', credentials.apiKey);
  }

  return {
    credentials,
    url,
  };
};

const parseJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const isTmdbErrorResponse = (data: unknown): data is TmdbErrorResponse =>
  typeof data === 'object' &&
  data !== null &&
  ('status_message' in data || 'status_code' in data);

const getTmdbErrorMessage = (data: unknown, response: Response) => {
  if (
    isTmdbErrorResponse(data) &&
    typeof data.status_message === 'string' &&
    data.status_message.trim()
  ) {
    return data.status_message;
  }

  return `TMDb request failed (${response.status} ${response.statusText})`;
};

const tmdbRequest = async <T>(
  endpoint: string,
  params: QueryParams = {},
): Promise<T> => {
  const { credentials, url } = buildTmdbUrl(endpoint, params);
  const headers: HeadersInit = {
    accept: 'application/json',
  };

  if (credentials.accessToken) {
    headers.Authorization = `Bearer ${credentials.accessToken}`;
  }

  const response = await fetch(url, {
    headers,
  });
  const data = await parseJson(response);

  if (!response.ok) {
    throw new TmdbApiError(
      getTmdbErrorMessage(data, response),
      response.status,
      response.statusText,
    );
  }

  return data as T;
};

const normalizePage = (page?: number) => {
  if (!page || page < 1) {
    return 1;
  }

  return Math.floor(page);
};

export const getTmdbImageUrl = (
  path: string | null | undefined,
  size = 'w500',
) => {
  if (!path) {
    return null;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchMovieGenres = async (
  language = DEFAULT_TMDB_LANGUAGE,
): Promise<MovieGenre[]> => {
  const response = await tmdbRequest<{ genres: MovieGenre[] }>(
    '/genre/movie/list',
    {
      language,
    },
  );

  return response.genres;
};

export const fetchMovies = async ({
  genreId,
  includeAdult = false,
  language = DEFAULT_TMDB_LANGUAGE,
  page = 1,
  sortBy = 'popularity.desc',
}: FetchMoviesParams = {}): Promise<MovieListResponse> => {
  return tmdbRequest<MovieListResponse>('/discover/movie', {
    include_adult: includeAdult,
    include_video: false,
    language,
    page: normalizePage(page),
    sort_by: sortBy,
    with_genres: genreId,
  });
};

export const fetchMoviesByGenre = async (
  genreId: number,
  params: Omit<FetchMoviesParams, 'genreId'> = {},
) => {
  return fetchMovies({
    ...params,
    genreId,
  });
};

export const fetchMovieDetails = async (
  movieId: number,
  {
    appendToResponse,
    language = DEFAULT_TMDB_LANGUAGE,
  }: FetchMovieDetailsOptions = {},
): Promise<MovieDetails> => {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    throw new Error('Movie id must be a positive number.');
  }

  return tmdbRequest<MovieDetails>(`/movie/${Math.floor(movieId)}`, {
    append_to_response: appendToResponse?.join(','),
    language,
  });
};
