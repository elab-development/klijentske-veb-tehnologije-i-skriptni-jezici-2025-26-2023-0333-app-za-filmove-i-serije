import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_TMDB_LANGUAGE, fetchMovieGenres } from '../api/tmdb';
import type { MovieGenre } from '../types/Movie';

interface UseMovieGenresResult {
  error: string | null;
  genres: MovieGenre[];
  isLoading: boolean;
  refresh: () => void;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unexpected movie genres error.';

export const useMovieGenres = (
  language = DEFAULT_TMDB_LANGUAGE,
): UseMovieGenresResult => {
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRequestVersion((currentVersion) => currentVersion + 1);
  }, []);

  useEffect(() => {
    let shouldUpdateState = true;

    queueMicrotask(() => {
      if (shouldUpdateState) {
        setIsLoading(true);
        setError(null);
      }
    });

    fetchMovieGenres(language)
      .then((movieGenres) => {
        if (shouldUpdateState) {
          setGenres(movieGenres);
        }
      })
      .catch((requestError: unknown) => {
        if (shouldUpdateState) {
          setError(getErrorMessage(requestError));
          setGenres([]);
        }
      })
      .finally(() => {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      });

    return () => {
      shouldUpdateState = false;
    };
  }, [language, requestVersion]);

  return {
    error,
    genres,
    isLoading,
    refresh,
  };
};
