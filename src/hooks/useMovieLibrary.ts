import { useCallback, useEffect, useState } from 'react';

import type { UserMovieLibrary } from '../types/Movie';
import {
  addMovieToWatchlist,
  clearUserMovieLibrary,
  createEmptyMovieLibrary,
  getUserMovieLibrary,
  markMovieAsWatched,
  moveMovieToWatched,
  MOVIE_LIBRARY_STORAGE_KEY,
  MOVIE_LIBRARY_UPDATED_EVENT,
  removeMovieFromWatched,
  removeMovieFromWatchlist,
  toggleMovieInShelf,
  type MovieShelf,
  type MovieStorageInput,
  type UserStorageId,
} from '../storage/movieLibraryStorage';

interface UseMovieLibraryResult {
  addToWatchlist: (movie: MovieStorageInput) => UserMovieLibrary;
  clearLibrary: () => UserMovieLibrary;
  isInWatchlist: (movieId: number) => boolean;
  isWatched: (movieId: number) => boolean;
  library: UserMovieLibrary;
  markAsWatched: (movie: MovieStorageInput) => UserMovieLibrary;
  moveToWatched: (movie: MovieStorageInput) => UserMovieLibrary;
  refresh: () => void;
  removeFromWatched: (movieId: number) => UserMovieLibrary;
  removeFromWatchlist: (movieId: number) => UserMovieLibrary;
  toggleInShelf: (
    shelf: MovieShelf,
    movie: MovieStorageInput,
  ) => UserMovieLibrary;
}

const getLibraryForUser = (userId: UserStorageId | null | undefined) => {
  if (userId === null || userId === undefined) {
    return createEmptyMovieLibrary();
  }

  return getUserMovieLibrary(userId);
};

export const useMovieLibrary = (
  userId: UserStorageId | null | undefined,
): UseMovieLibraryResult => {
  const [, setLibraryVersion] = useState(0);
  const library = getLibraryForUser(userId);

  const refresh = useCallback(() => {
    setLibraryVersion((currentVersion) => currentVersion + 1);
  }, []);

  useEffect(() => {
    if (userId === null || userId === undefined || typeof window === 'undefined') {
      return;
    }

    const userKey = String(userId);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === MOVIE_LIBRARY_STORAGE_KEY) {
        refresh();
      }
    };

    const handleLibraryChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId?: string }>;

      if (customEvent.detail?.userId === userKey) {
        refresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(MOVIE_LIBRARY_UPDATED_EVENT, handleLibraryChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        MOVIE_LIBRARY_UPDATED_EVENT,
        handleLibraryChange,
      );
    };
  }, [refresh, userId]);

  const runForUser = useCallback(
    (updateLibrary: (currentUserId: UserStorageId) => UserMovieLibrary) => {
      if (userId === null || userId === undefined) {
        refresh();
        return createEmptyMovieLibrary();
      }

      const nextLibrary = updateLibrary(userId);
      refresh();
      return nextLibrary;
    },
    [refresh, userId],
  );

  const addToWatchlist = useCallback(
    (movie: MovieStorageInput) =>
      runForUser((currentUserId) => addMovieToWatchlist(currentUserId, movie)),
    [runForUser],
  );

  const removeFromWatchlist = useCallback(
    (movieId: number) =>
      runForUser((currentUserId) =>
        removeMovieFromWatchlist(currentUserId, movieId),
      ),
    [runForUser],
  );

  const markAsWatched = useCallback(
    (movie: MovieStorageInput) =>
      runForUser((currentUserId) => markMovieAsWatched(currentUserId, movie)),
    [runForUser],
  );

  const removeFromWatched = useCallback(
    (movieId: number) =>
      runForUser((currentUserId) =>
        removeMovieFromWatched(currentUserId, movieId),
      ),
    [runForUser],
  );

  const moveToWatched = useCallback(
    (movie: MovieStorageInput) =>
      runForUser((currentUserId) => moveMovieToWatched(currentUserId, movie)),
    [runForUser],
  );

  const toggleInShelf = useCallback(
    (shelf: MovieShelf, movie: MovieStorageInput) =>
      runForUser((currentUserId) =>
        toggleMovieInShelf(currentUserId, shelf, movie),
      ),
    [runForUser],
  );

  const clearLibrary = useCallback(
    () => runForUser((currentUserId) => clearUserMovieLibrary(currentUserId)),
    [runForUser],
  );

  const isInWatchlist = useCallback(
    (movieId: number) =>
      library.watchlist.some((movie) => movie.id === movieId),
    [library.watchlist],
  );

  const isWatched = useCallback(
    (movieId: number) => library.watched.some((movie) => movie.id === movieId),
    [library.watched],
  );

  return {
    addToWatchlist,
    clearLibrary,
    isInWatchlist,
    isWatched,
    library,
    markAsWatched,
    moveToWatched,
    refresh,
    removeFromWatched,
    removeFromWatchlist,
    toggleInShelf,
  };
};
