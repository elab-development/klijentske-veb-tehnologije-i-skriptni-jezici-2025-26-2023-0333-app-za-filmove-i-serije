import {
  AlertCircle,
  ArrowLeft,
  BookmarkCheck,
  BookmarkPlus,
  CheckCircle2,
  Film,
  Loader2,
  Star,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getTmdbImageUrl } from '../api/tmdb';
import { useAuth } from '../contexts/useAuth';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useMovieLibrary } from '../hooks/useMovieLibrary';

const getMovieYear = (releaseDate: string) => {
  if (!releaseDate) {
    return 'TBA';
  }

  return releaseDate.slice(0, 4);
};

const getRuntime = (runtime: number | null) => {
  if (!runtime) {
    return null;
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

const Movie = () => {
  const { id } = useParams();
  const movieId = id ? Number(id) : null;
  const { currentUser } = useAuth();
  const { error, isLoading, movie } = useMovieDetails(movieId);
  const { addToWatchlist, isInWatchlist, isWatched, moveToWatched } =
    useMovieLibrary(currentUser?.id);

  const backdropUrl = getTmdbImageUrl(movie?.backdrop_path, 'w1280');
  const posterUrl = getTmdbImageUrl(movie?.poster_path, 'w500');
  const runtime = movie ? getRuntime(movie.runtime) : null;

  const handleAddToWatchlist = () => {
    if (!movie) {
      return;
    }

    addToWatchlist(movie);
    toast.success(`${movie.title} je dodat u watchlist.`);
  };

  const handleMarkAsWatched = () => {
    if (!movie) {
      return;
    }

    moveToWatched(movie);
    toast.success(`${movie.title} je označen kao watched.`);
  };

  if (!movieId || Number.isNaN(movieId)) {
    return (
      <main className='mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-5 py-10 sm:px-8'>
        <Link
          className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1f3e89] shadow-lg shadow-[#081023]/5 transition hover:text-[#081023]'
          to='/'
        >
          <ArrowLeft aria-hidden='true' className='h-4 w-4' />
          Movies
        </Link>

        <div className='mt-8 rounded-3xl border border-[#b91c1c]/20 bg-white p-6 text-[#b91c1c] shadow-xl shadow-[#081023]/5'>
          <div className='flex items-start gap-3'>
            <AlertCircle aria-hidden='true' className='mt-1 h-5 w-5' />
            <div>
              <h1 className='text-lg font-extrabold'>Invalid movie</h1>
              <p className='mt-2 text-sm font-semibold text-[#7b8599]'>
                The selected movie id is not valid.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading && !movie) {
    return (
      <main className='flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-10 text-[#7b8599]'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <Loader2 aria-hidden='true' className='h-10 w-10 animate-spin' />
          <p className='text-sm font-bold uppercase tracking-[0.14em]'>
            Loading movie
          </p>
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className='mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-5 py-10 sm:px-8'>
        <Link
          className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1f3e89] shadow-lg shadow-[#081023]/5 transition hover:text-[#081023]'
          to='/'
        >
          <ArrowLeft aria-hidden='true' className='h-4 w-4' />
          Movies
        </Link>

        <div className='mt-8 rounded-3xl border border-[#b91c1c]/20 bg-white p-6 text-[#b91c1c] shadow-xl shadow-[#081023]/5'>
          <div className='flex items-start gap-3'>
            <AlertCircle aria-hidden='true' className='mt-1 h-5 w-5' />
            <div>
              <h1 className='text-lg font-extrabold'>Movie unavailable</h1>
              <p className='mt-2 text-sm font-semibold text-[#7b8599]'>
                {error ?? 'Movie details could not be loaded.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const movieInWatchlist = isInWatchlist(movie.id);
  const movieIsWatched = isWatched(movie.id);

  return (
    <main className='min-h-[calc(100vh-72px)]'>
      <section className='relative overflow-hidden bg-[#081023] text-white'>
        {backdropUrl ? (
          <img
            alt=''
            aria-hidden='true'
            className='absolute inset-0 h-full w-full object-cover opacity-35'
            src={backdropUrl}
          />
        ) : null}
        <div className='absolute inset-0 bg-[#081023]/70' />

        <div className='relative mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[260px_minmax(0,1fr)] md:py-14'>
          <div className='w-full max-w-64 justify-self-center md:justify-self-start'>
            <div className='aspect-2/3 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 shadow-2xl shadow-black/30'>
              {posterUrl ? (
                <img
                  alt={movie.title}
                  className='h-full w-full object-cover'
                  src={posterUrl}
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center'>
                  <Film aria-hidden='true' className='h-14 w-14 opacity-70' />
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col justify-center'>
            <Link
              className='mb-7 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-[#081023]'
              to='/'
            >
              <ArrowLeft aria-hidden='true' className='h-4 w-4' />
              Movies
            </Link>

            <div className='flex flex-wrap gap-2'>
              <span className='rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#1f3e89]'>
                {getMovieYear(movie.release_date)}
              </span>
              {runtime && (
                <span className='rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold text-white'>
                  {runtime}
                </span>
              )}
              <span className='inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold text-white'>
                <Star aria-hidden='true' className='h-3.5 w-3.5 fill-current' />
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'New'}
              </span>
            </div>

            <h1 className='mt-4 text-4xl font-extrabold leading-tight sm:text-5xl'>
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className='mt-3 text-lg font-bold text-white/75'>
                {movie.tagline}
              </p>
            )}
            <p className='mt-5 max-w-3xl text-base font-medium leading-8 text-white/80'>
              {movie.overview || 'Overview is not available.'}
            </p>

            <div className='mt-6 flex flex-wrap gap-2'>
              {movie.genres.map((genre) => (
                <span
                  className='rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white'
                  key={genre.id}
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className='mt-8 flex flex-wrap gap-3'>
              <button
                aria-pressed={movieInWatchlist}
                className={[
                  'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition',
                  movieInWatchlist
                    ? 'bg-white text-[#1f3e89]'
                    : 'bg-white/10 text-white hover:bg-white hover:text-[#081023]',
                ].join(' ')}
                onClick={handleAddToWatchlist}
                type='button'
              >
                {movieInWatchlist ? (
                  <BookmarkCheck aria-hidden='true' className='h-5 w-5' />
                ) : (
                  <BookmarkPlus aria-hidden='true' className='h-5 w-5' />
                )}
                Watchlist
              </button>

              <button
                aria-pressed={movieIsWatched}
                className={[
                  'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition',
                  movieIsWatched
                    ? 'bg-[#0f766e] text-white'
                    : 'bg-white/10 text-white hover:bg-[#0f766e]',
                ].join(' ')}
                onClick={handleMarkAsWatched}
                type='button'
              >
                <CheckCircle2 aria-hidden='true' className='h-5 w-5' />
                Watched
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Movie;
