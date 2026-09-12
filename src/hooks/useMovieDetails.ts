import { useCallback, useEffect, useState } from 'react';

import { fetchMovieDetails } from '../api/tmdb';
import type { FetchMovieDetailsOptions, MovieDetails } from '../types/Movie';

interface UseMovieDetailsResult {
  error: string | null;
  isLoading: boolean;
  movie: MovieDetails | null;
  refresh: () => void;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unexpected movie details error.';

export const useMovieDetails = (
  movieId: number | null | undefined,
  options: FetchMovieDetailsOptions = {},
): UseMovieDetailsResult => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const appendToResponseKey = options.appendToResponse?.join(',');
  const language = options.language;

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRequestVersion((currentVersion) => currentVersion + 1);
  }, []);

  useEffect(() => {
    let shouldUpdateState = true;

    if (!movieId) {
      queueMicrotask(() => {
        if (shouldUpdateState) {
          setMovie(null);
          setError(null);
          setIsLoading(false);
        }
      });

      return () => {
        shouldUpdateState = false;
      };
    }

    queueMicrotask(() => {
      if (shouldUpdateState) {
        setIsLoading(true);
        setError(null);
      }
    });

    fetchMovieDetails(movieId, {
      appendToResponse: appendToResponseKey
        ? appendToResponseKey.split(',')
        : undefined,
      language,
    })
      .then((movieDetails) => {
        if (shouldUpdateState) {
          setMovie(movieDetails);
        }
      })
      .catch((requestError: unknown) => {
        if (shouldUpdateState) {
          setError(getErrorMessage(requestError));
          setMovie(null);
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
  }, [appendToResponseKey, language, movieId, requestVersion]);

  return {
    error,
    isLoading,
    movie,
    refresh,
  };
};
