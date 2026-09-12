import { BookmarkCheck, BookmarkPlus, CheckCircle2, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getTmdbImageUrl } from '../../api/tmdb';
import type { TmdbMovie } from '../../types/Movie';

interface MovieCardProps {
  genresById: Record<number, string>;
  isInWatchlist: boolean;
  isWatched: boolean;
  movie: TmdbMovie;
  onAddToWatchlist: (movie: TmdbMovie) => void;
  onMarkAsWatched: (movie: TmdbMovie) => void;
}

const getReleaseYear = (releaseDate: string) => {
  if (!releaseDate) {
    return 'TBA';
  }

  return releaseDate.slice(0, 4);
};

const getMovieGenres = (
  genreIds: number[],
  genresById: Record<number, string>,
) => {
  return genreIds
    .map((genreId) => genresById[genreId])
    .filter(Boolean)
    .slice(0, 2);
};

const getVoteLabel = (voteAverage: number) => {
  if (!voteAverage) {
    return 'New';
  }

  return voteAverage.toFixed(1);
};

const MovieCard = ({
  genresById,
  isInWatchlist,
  isWatched,
  movie,
  onAddToWatchlist,
  onMarkAsWatched,
}: MovieCardProps) => {
  const posterUrl = getTmdbImageUrl(movie.poster_path, 'w342');
  const movieGenres = getMovieGenres(movie.genre_ids, genresById);

  return (
    <article className='group relative overflow-hidden rounded-[1.75rem] border border-[#1f3e89]/10 bg-white shadow-xl shadow-[#081023]/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#081023]/10'>
      <Link
        aria-label={movie.title}
        className='block h-full text-[#081023]'
        to={`/movies/${movie.id}`}
      >
        <div className='relative aspect-2/3 overflow-hidden bg-[#081023]'>
          {posterUrl ? (
            <img
              alt={movie.title}
              className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
              loading='lazy'
              src={posterUrl}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-[#081023] text-white'>
              <Film aria-hidden='true' className='h-12 w-12 opacity-70' />
            </div>
          )}

          <div className='absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#1f3e89] shadow-lg shadow-[#081023]/15'>
            {getVoteLabel(movie.vote_average)}
          </div>
        </div>

        <div className='flex min-h-40 flex-col gap-3 p-4'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.12em] text-[#7b8599]'>
              {getReleaseYear(movie.release_date)}
            </p>
            <h2 className='mt-1 line-clamp-2 text-lg font-extrabold leading-snug text-[#081023]'>
              {movie.title}
            </h2>
          </div>

          <div className='mt-auto flex flex-wrap gap-2'>
            {movieGenres.length > 0 ? (
              movieGenres.map((genre) => (
                <span
                  className='rounded-full bg-[#e8edf7] px-3 py-1 text-xs font-bold text-[#1f3e89]'
                  key={genre}
                >
                  {genre}
                </span>
              ))
            ) : (
              <span className='rounded-full bg-[#e8edf7] px-3 py-1 text-xs font-bold text-[#7b8599]'>
                Movie
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className='absolute right-3 top-3 z-10 flex translate-y-1 gap-2 opacity-100 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:opacity-0'>
        <button
          aria-label={
            isInWatchlist ? 'Already in watchlist' : 'Add to watchlist'
          }
          aria-pressed={isInWatchlist}
          className={[
            'flex h-10 w-10 items-center justify-center rounded-full border shadow-lg shadow-[#081023]/15 transition',
            isInWatchlist
              ? 'border-[#1f3e89] bg-[#1f3e89] text-white'
              : 'border-white/70 bg-white text-[#081023] hover:border-[#1f3e89] hover:text-[#1f3e89]',
          ].join(' ')}
          onClick={() => onAddToWatchlist(movie)}
          title={isInWatchlist ? 'Already in watchlist' : 'Add to watchlist'}
          type='button'
        >
          {isInWatchlist ? (
            <BookmarkCheck aria-hidden='true' className='h-5 w-5' />
          ) : (
            <BookmarkPlus aria-hidden='true' className='h-5 w-5' />
          )}
        </button>

        <button
          aria-label={isWatched ? 'Already watched' : 'Mark as watched'}
          aria-pressed={isWatched}
          className={[
            'flex h-10 w-10 items-center justify-center rounded-full border shadow-lg shadow-[#081023]/15 transition',
            isWatched
              ? 'border-[#0f766e] bg-[#0f766e] text-white'
              : 'border-white/70 bg-white text-[#081023] hover:border-[#0f766e] hover:text-[#0f766e]',
          ].join(' ')}
          onClick={() => onMarkAsWatched(movie)}
          title={isWatched ? 'Already watched' : 'Mark as watched'}
          type='button'
        >
          <CheckCircle2 aria-hidden='true' className='h-5 w-5' />
        </button>
      </div>
    </article>
  );
};

export default MovieCard;
