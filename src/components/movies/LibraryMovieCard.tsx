import { CheckCircle2, Film, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getTmdbImageUrl } from '../../api/tmdb';
import type { StoredMovie } from '../../types/Movie';

interface LibraryMovieCardProps {
  genresById: Record<number, string>;
  movie: StoredMovie;
  onMarkAsWatched?: (movie: StoredMovie) => void;
  onRemove: (movie: StoredMovie) => void;
  showWatchedAction?: boolean;
}

const getReleaseYear = (releaseDate: string) => {
  if (!releaseDate) {
    return 'TBA';
  }

  return releaseDate.slice(0, 4);
};

const getVoteLabel = (voteAverage: number) => {
  if (!voteAverage) {
    return 'New';
  }

  return voteAverage.toFixed(1);
};

const getSavedDate = (savedAt: string) => {
  const date = new Date(savedAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
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

const LibraryMovieCard = ({
  genresById,
  movie,
  onMarkAsWatched,
  onRemove,
  showWatchedAction = false,
}: LibraryMovieCardProps) => {
  const posterUrl = getTmdbImageUrl(movie.posterPath, 'w342');
  const movieGenres = getMovieGenres(movie.genreIds, genresById);
  const savedDate = getSavedDate(movie.savedAt);

  return (
    <article className='group grid overflow-hidden rounded-[1.75rem] border border-[#1f3e89]/10 bg-white shadow-xl shadow-[#081023]/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#081023]/10 sm:grid-cols-[148px_minmax(0,1fr)]'>
      <Link
        aria-label={movie.title}
        className='relative block aspect-2/3 bg-[#081023] sm:aspect-auto sm:min-h-56'
        to={`/movies/${movie.id}`}
      >
        {posterUrl ? (
          <img
            alt={movie.title}
            className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
            loading='lazy'
            src={posterUrl}
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-[#081023] text-white'>
            <Film aria-hidden='true' className='h-10 w-10 opacity-70' />
          </div>
        )}

        <div className='absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#1f3e89] shadow-lg shadow-[#081023]/15'>
          {getVoteLabel(movie.voteAverage)}
        </div>
      </Link>

      <div className='flex min-w-0 flex-col gap-4 p-4 sm:p-5'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.12em] text-[#7b8599]'>
            {getReleaseYear(movie.releaseDate)}
            {savedDate ? ` · Saved ${savedDate}` : ''}
          </p>
          <Link className='group/title' to={`/movies/${movie.id}`}>
            <h2 className='mt-1 line-clamp-2 text-xl font-extrabold leading-snug text-[#081023] transition group-hover/title:text-[#1f3e89]'>
              {movie.title}
            </h2>
          </Link>
          <p className='mt-3 line-clamp-3 text-sm font-medium leading-6 text-[#7b8599]'>
            {movie.overview || 'Overview is not available.'}
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
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

        <div className='mt-auto flex flex-wrap gap-2'>
          {showWatchedAction && onMarkAsWatched && (
            <button
              className='inline-flex items-center gap-2 rounded-full bg-[#0f766e] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#115e59]'
              onClick={() => onMarkAsWatched(movie)}
              type='button'
            >
              <CheckCircle2 aria-hidden='true' className='h-4 w-4' />
              Watched
            </button>
          )}

          <button
            className='inline-flex items-center gap-2 rounded-full border border-[#b91c1c]/20 bg-white px-4 py-2.5 text-sm font-extrabold text-[#b91c1c] transition hover:border-[#b91c1c] hover:bg-[#b91c1c] hover:text-white'
            onClick={() => onRemove(movie)}
            type='button'
          >
            <Trash2 aria-hidden='true' className='h-4 w-4' />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export default LibraryMovieCard;
