import { AlertCircle, Film, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

import MovieCard from '../components/movies/MovieCard';
import MovieGenreFilter from '../components/movies/MovieGenreFilter';
import MoviesPagination from '../components/movies/MoviesPagination';
import { useAuth } from '../contexts/useAuth';
import { useMovieGenres } from '../hooks/useMovieGenres';
import { useMovieLibrary } from '../hooks/useMovieLibrary';
import { useMovies } from '../hooks/useMovies';
import type { TmdbMovie } from '../types/Movie';

const Movies = () => {
  const { currentUser } = useAuth();
  const {
    error: genresError,
    genres,
    isLoading: areGenresLoading,
  } = useMovieGenres();
  const { error, isLoading, movies, pagination, params, setGenreId, setPage } =
    useMovies();
  const { addToWatchlist, isInWatchlist, isWatched, moveToWatched } =
    useMovieLibrary(currentUser?.id);

  const genresById = useMemo(
    () =>
      Object.fromEntries(
        genres.map((genre) => [genre.id, genre.name]),
      ) as Record<number, string>,
    [genres],
  );

  const selectedGenreId = params.genreId ?? null;

  const handleAddToWatchlist = (movie: TmdbMovie) => {
    addToWatchlist(movie);
    toast.success(`${movie.title} je dodat u watchlist.`);
  };

  const handleMarkAsWatched = (movie: TmdbMovie) => {
    moveToWatched(movie);
    toast.success(`${movie.title} je označen kao watched.`);
  };

  return (
    <main className='mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-5 py-8 sm:px-8 sm:py-10'>
      <section className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
        <div>
          <p className='text-sm font-bold uppercase tracking-[0.18em] text-[#1f3e89]'>
            Browse
          </p>
          <h1 className='mt-2 text-4xl font-extrabold leading-tight text-[#081023] sm:text-5xl'>
            Movies
          </h1>
          <p className='mt-3 max-w-2xl text-base font-medium leading-7 text-[#7b8599]'>
            {pagination.totalResults > 0
              ? `${pagination.totalResults.toLocaleString()} titles available`
              : 'Popular titles from TMDb'}
          </p>
        </div>

        <MovieGenreFilter
          disabled={areGenresLoading || Boolean(genresError)}
          genres={genres}
          onChange={setGenreId}
          selectedGenreId={selectedGenreId}
        />
      </section>

      {genresError && (
        <div className='mt-5 flex items-center gap-3 rounded-[1.25rem] border border-[#b91c1c]/20 bg-white px-4 py-3 text-sm font-semibold text-[#b91c1c] shadow-lg shadow-[#081023]/5'>
          <AlertCircle aria-hidden='true' className='h-5 w-5 shrink-0' />
          <span>{genresError}</span>
        </div>
      )}

      {isLoading && movies.length === 0 ? (
        <div className='mt-16 flex flex-col items-center justify-center gap-4 text-center text-[#7b8599]'>
          <Loader2 aria-hidden='true' className='h-10 w-10 animate-spin' />
          <p className='text-sm font-bold uppercase tracking-[0.14em]'>
            Loading movies
          </p>
        </div>
      ) : null}

      {error && (
        <div className='mt-8 rounded-3xl border border-[#b91c1c]/20 bg-white p-6 shadow-xl shadow-[#081023]/5'>
          <div className='flex items-start gap-3 text-[#b91c1c]'>
            <AlertCircle aria-hidden='true' className='mt-1 h-5 w-5 shrink-0' />
            <div>
              <h2 className='text-lg font-extrabold'>Movies unavailable</h2>
              <p className='mt-2 text-sm font-semibold leading-6 text-[#7b8599]'>
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && movies.length === 0 && (
        <div className='mt-16 flex flex-col items-center justify-center gap-4 text-center text-[#7b8599]'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#1f3e89] shadow-xl shadow-[#081023]/5'>
            <Film aria-hidden='true' className='h-8 w-8' />
          </div>
          <div>
            <h2 className='text-xl font-extrabold text-[#081023]'>
              No movies found
            </h2>
            <p className='mt-2 text-sm font-semibold'>
              Try another genre filter.
            </p>
          </div>
        </div>
      )}

      {movies.length > 0 && (
        <>
          <section className='mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {movies.map((movie) => (
              <MovieCard
                genresById={genresById}
                isInWatchlist={isInWatchlist(movie.id)}
                isWatched={isWatched(movie.id)}
                key={movie.id}
                movie={movie}
                onAddToWatchlist={handleAddToWatchlist}
                onMarkAsWatched={handleMarkAsWatched}
              />
            ))}
          </section>

          <MoviesPagination
            disabled={isLoading}
            onPageChange={setPage}
            page={pagination.page}
            totalPages={pagination.totalPages}
          />
        </>
      )}
    </main>
  );
};

export default Movies;
