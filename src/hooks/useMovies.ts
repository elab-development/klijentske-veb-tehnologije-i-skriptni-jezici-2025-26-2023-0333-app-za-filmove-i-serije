import { useCallback, useEffect, useState } from 'react';

import { fetchMovies } from '../api/tmdb';
import type {
  FetchMoviesParams,
  MovieListResponse,
  TmdbMovie,
} from '../types/Movie';

interface MoviesPagination {
  page: number;
  totalPages: number;
  totalResults: number;
}

interface UseMoviesResult {
  error: string | null;
  isLoading: boolean;
  movies: TmdbMovie[];
  pagination: MoviesPagination;
  params: FetchMoviesParams;
  refresh: () => void;
  setGenreId: (genreId: number | null) => void;
  setPage: (page: number) => void;
  setParams: (params: Partial<FetchMoviesParams>) => void;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unexpected movie request error.';

export const useMovies = (
  initialParams: FetchMoviesParams = {},
): UseMoviesResult => {
  const [params, setParamsState] = useState<FetchMoviesParams>(() => ({
    page: 1,
    ...initialParams,
  }));
  const [data, setData] = useState<MovieListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const setParams = useCallback((nextParams: Partial<FetchMoviesParams>) => {
    setIsLoading(true);
    setError(null);
    setParamsState((currentParams) => ({
      ...currentParams,
      ...nextParams,
    }));
  }, []);

  const setPage = useCallback(
    (page: number) => {
      setParams({
        page,
      });
    },
    [setParams],
  );

  const setGenreId = useCallback(
    (genreId: number | null) => {
      setParams({
        genreId,
        page: 1,
      });
    },
    [setParams],
  );

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

    fetchMovies(params)
      .then((moviesResponse) => {
        if (shouldUpdateState) {
          setData(moviesResponse);
        }
      })
      .catch((requestError: unknown) => {
        if (shouldUpdateState) {
          setError(getErrorMessage(requestError));
          setData(null);
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
  }, [params, requestVersion]);

  return {
    error,
    isLoading,
    movies: data?.results ?? [],
    pagination: {
      page: data?.page ?? params.page ?? 1,
      totalPages: data?.total_pages ?? 0,
      totalResults: data?.total_results ?? 0,
    },
    params,
    refresh,
    setGenreId,
    setPage,
    setParams,
  };
};
