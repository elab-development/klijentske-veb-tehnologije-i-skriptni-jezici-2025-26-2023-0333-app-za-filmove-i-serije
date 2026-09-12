import type { MovieGenre, StoredMovie, UserMovieLibrary } from '../types/Movie';

export const MOVIE_LIBRARY_STORAGE_KEY = 'movies_user_movie_library_v1';
export const MOVIE_LIBRARY_UPDATED_EVENT = 'movies:library-updated';

export type MovieShelf = 'watched' | 'watchlist';
export type UserStorageId = number | string;

export interface MovieStorageInput {
  backdrop_path?: string | null;
  genre_ids?: number[];
  genres?: MovieGenre[];
  id: number;
  overview?: string;
  poster_path?: string | null;
  release_date?: string;
  title: string;
  vote_average?: number;
}

type MovieLibrariesByUser = Record<string, UserMovieLibrary>;

const createEmptyMovieLibrary = (): UserMovieLibrary => ({
  watched: [],
  watchlist: [],
});

const canUseLocalStorage = () => {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const getUserStorageKey = (userId: UserStorageId) => {
  const key = String(userId).trim();

  if (!key) {
    throw new Error('User id is required for movie library storage.');
  }

  return key;
};

const isStoredMovie = (value: unknown): value is StoredMovie =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as StoredMovie).id === 'number' &&
  typeof (value as StoredMovie).title === 'string';

const uniqueStoredMovies = (movies: StoredMovie[]) => {
  const seenMovieIds = new Set<number>();

  return movies.filter((movie) => {
    if (seenMovieIds.has(movie.id)) {
      return false;
    }

    seenMovieIds.add(movie.id);
    return true;
  });
};

const normalizeMovieShelf = (movies: unknown): StoredMovie[] => {
  if (!Array.isArray(movies)) {
    return [];
  }

  return uniqueStoredMovies(movies.filter(isStoredMovie));
};

const normalizeMovieLibrary = (
  library: Partial<UserMovieLibrary> | undefined,
): UserMovieLibrary => ({
  watched: normalizeMovieShelf(library?.watched),
  watchlist: normalizeMovieShelf(library?.watchlist),
});

const readAllMovieLibraries = (): MovieLibrariesByUser => {
  if (!canUseLocalStorage()) {
    return {};
  }

  const storedValue = window.localStorage.getItem(MOVIE_LIBRARY_STORAGE_KEY);

  if (!storedValue) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(storedValue) as MovieLibrariesByUser;

    if (!parsedValue || typeof parsedValue !== 'object') {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedValue).map(([userId, library]) => [
        userId,
        normalizeMovieLibrary(library),
      ]),
    );
  } catch {
    window.localStorage.removeItem(MOVIE_LIBRARY_STORAGE_KEY);
    return {};
  }
};

const writeAllMovieLibraries = (libraries: MovieLibrariesByUser) => {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(
    MOVIE_LIBRARY_STORAGE_KEY,
    JSON.stringify(libraries),
  );
};

const notifyMovieLibraryUpdated = (userId: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(MOVIE_LIBRARY_UPDATED_EVENT, {
      detail: {
        userId,
      },
    }),
  );
};

const getMovieGenreIds = (movie: MovieStorageInput) => {
  if (Array.isArray(movie.genre_ids)) {
    return movie.genre_ids;
  }

  if (Array.isArray(movie.genres)) {
    return movie.genres.map((genre) => genre.id);
  }

  return [];
};

export const toStoredMovie = (movie: MovieStorageInput): StoredMovie => {
  if (!Number.isFinite(movie.id)) {
    throw new Error('Movie must have a valid id before it can be saved.');
  }

  return {
    backdropPath: movie.backdrop_path ?? null,
    genreIds: getMovieGenreIds(movie),
    id: movie.id,
    overview: movie.overview ?? '',
    posterPath: movie.poster_path ?? null,
    releaseDate: movie.release_date ?? '',
    savedAt: new Date().toISOString(),
    title: movie.title,
    voteAverage: movie.vote_average ?? 0,
  };
};

export const storedMovieToStorageInput = (
  movie: StoredMovie,
): MovieStorageInput => ({
  backdrop_path: movie.backdropPath,
  genre_ids: movie.genreIds,
  id: movie.id,
  overview: movie.overview,
  poster_path: movie.posterPath,
  release_date: movie.releaseDate,
  title: movie.title,
  vote_average: movie.voteAverage,
});

export const getUserMovieLibrary = (
  userId: UserStorageId,
): UserMovieLibrary => {
  const userKey = getUserStorageKey(userId);
  const libraries = readAllMovieLibraries();

  return normalizeMovieLibrary(libraries[userKey]);
};

export const saveUserMovieLibrary = (
  userId: UserStorageId,
  library: UserMovieLibrary,
) => {
  const userKey = getUserStorageKey(userId);
  const libraries = readAllMovieLibraries();
  const nextLibrary = normalizeMovieLibrary(library);

  libraries[userKey] = nextLibrary;
  writeAllMovieLibraries(libraries);
  notifyMovieLibraryUpdated(userKey);

  return nextLibrary;
};

export const clearUserMovieLibrary = (userId: UserStorageId) => {
  const userKey = getUserStorageKey(userId);
  const libraries = readAllMovieLibraries();

  delete libraries[userKey];
  writeAllMovieLibraries(libraries);
  notifyMovieLibraryUpdated(userKey);

  return createEmptyMovieLibrary();
};

export const addMovieToShelf = (
  userId: UserStorageId,
  shelf: MovieShelf,
  movie: MovieStorageInput,
) => {
  const library = getUserMovieLibrary(userId);
  const storedMovie = toStoredMovie(movie);
  const nextLibrary = {
    ...library,
    [shelf]: [
      storedMovie,
      ...library[shelf].filter((item) => item.id !== storedMovie.id),
    ],
  };

  return saveUserMovieLibrary(userId, nextLibrary);
};

export const removeMovieFromShelf = (
  userId: UserStorageId,
  shelf: MovieShelf,
  movieId: number,
) => {
  const library = getUserMovieLibrary(userId);
  const nextLibrary = {
    ...library,
    [shelf]: library[shelf].filter((movie) => movie.id !== movieId),
  };

  return saveUserMovieLibrary(userId, nextLibrary);
};

export const isMovieInShelf = (
  userId: UserStorageId,
  shelf: MovieShelf,
  movieId: number,
) => getUserMovieLibrary(userId)[shelf].some((movie) => movie.id === movieId);

export const toggleMovieInShelf = (
  userId: UserStorageId,
  shelf: MovieShelf,
  movie: MovieStorageInput,
) => {
  if (isMovieInShelf(userId, shelf, movie.id)) {
    return removeMovieFromShelf(userId, shelf, movie.id);
  }

  return addMovieToShelf(userId, shelf, movie);
};

export const addMovieToWatchlist = (
  userId: UserStorageId,
  movie: MovieStorageInput,
) => addMovieToShelf(userId, 'watchlist', movie);

export const removeMovieFromWatchlist = (
  userId: UserStorageId,
  movieId: number,
) => removeMovieFromShelf(userId, 'watchlist', movieId);

export const markMovieAsWatched = (
  userId: UserStorageId,
  movie: MovieStorageInput,
) => addMovieToShelf(userId, 'watched', movie);

export const removeMovieFromWatched = (
  userId: UserStorageId,
  movieId: number,
) => removeMovieFromShelf(userId, 'watched', movieId);

export const moveMovieToWatched = (
  userId: UserStorageId,
  movie: MovieStorageInput,
) => {
  const library = getUserMovieLibrary(userId);
  const storedMovie = toStoredMovie(movie);
  const nextLibrary = {
    watched: [
      storedMovie,
      ...library.watched.filter((item) => item.id !== storedMovie.id),
    ],
    watchlist: library.watchlist.filter((item) => item.id !== storedMovie.id),
  };

  return saveUserMovieLibrary(userId, nextLibrary);
};

export { createEmptyMovieLibrary };
