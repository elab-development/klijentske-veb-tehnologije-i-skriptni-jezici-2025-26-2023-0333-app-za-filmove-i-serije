import { Bookmark, CheckCircle2, Film, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import LibraryMovieCard from '../components/movies/LibraryMovieCard';
import { useAuth } from '../contexts/useAuth';
import { useMovieGenres } from '../hooks/useMovieGenres';
import { useMovieLibrary } from '../hooks/useMovieLibrary';
import { storedMovieToStorageInput } from '../storage/movieLibraryStorage';
import type { StoredMovie } from '../types/Movie';

type LibraryTab = 'watched' | 'watchlist';

const tabs: Array<{
  icon: typeof Bookmark;
  label: string;
  value: LibraryTab;
}> = [
  {
    icon: Bookmark,
    label: 'Watchlist',
    value: 'watchlist',
  },
  {
    icon: CheckCircle2,
    label: 'Watched',
    value: 'watched',
  },
];

const Watchlist = () => {
  const [activeTab, setActiveTab] = useState<LibraryTab>('watchlist');
  const { currentUser } = useAuth();
  const { genres } = useMovieGenres();
  const { library, moveToWatched, removeFromWatched, removeFromWatchlist } =
    useMovieLibrary(currentUser?.id);

  const genresById = useMemo(
    () =>
      Object.fromEntries(
        genres.map((genre) => [genre.id, genre.name]),
      ) as Record<number, string>,
    [genres],
  );

  const activeMovies = library[activeTab];
  const totalSavedMovies = library.watchlist.length + library.watched.length;

  const handleMoveToWatched = (movie: StoredMovie) => {
    moveToWatched(storedMovieToStorageInput(movie));
    toast.success(`${movie.title} je prebačen u watched.`);
  };

  const handleRemove = (movie: StoredMovie) => {
    if (activeTab === 'watchlist') {
      removeFromWatchlist(movie.id);
      toast.success(`${movie.title} je uklonjen iz watchlist.`);
      return;
    }

    removeFromWatched(movie.id);
    toast.success(`${movie.title} je uklonjen iz watched.`);
  };

  return (
    <main className='mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-5 py-8 sm:px-8 sm:py-10'>
      <section className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
        <div>
          <p className='text-sm font-bold uppercase tracking-[0.18em] text-[#1f3e89]'>
            Library
          </p>
          <h1 className='mt-2 text-4xl font-extrabold leading-tight text-[#081023] sm:text-5xl'>
            Watchlist
          </h1>
          <p className='mt-3 max-w-2xl text-base font-medium leading-7 text-[#7b8599]'>
            {totalSavedMovies > 0
              ? `${totalSavedMovies} saved ${totalSavedMovies === 1 ? 'movie' : 'movies'}`
              : 'Movies you save will stay tied to your profile.'}
          </p>
        </div>

        <Link
          className='inline-flex w-fit items-center gap-2 rounded-full bg-[#1f3e89] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#1f3e89]/20 transition hover:bg-[#081023]'
          to='/'
        >
          <Search aria-hidden='true' className='h-4 w-4' />
          Browse movies
        </Link>
      </section>

      <section className='mt-7 grid gap-4 sm:grid-cols-2'>
        <button
          className={[
            'flex items-center justify-between rounded-3xl border p-5 text-left transition',
            activeTab === 'watchlist'
              ? 'border-[#1f3e89] bg-white shadow-xl shadow-[#081023]/5'
              : 'border-[#1f3e89]/10 bg-white/55 hover:bg-white',
          ].join(' ')}
          onClick={() => setActiveTab('watchlist')}
          type='button'
        >
          <span>
            <span className='flex h-11 w-11 items-center justify-center rounded-full bg-[#1f3e89] text-white'>
              <Bookmark aria-hidden='true' className='h-5 w-5' />
            </span>
            <span className='mt-4 block text-lg font-extrabold text-[#081023]'>
              Watchlist
            </span>
            <span className='mt-1 block text-sm font-semibold text-[#7b8599]'>
              Movies to watch later
            </span>
          </span>
          <span className='text-3xl font-extrabold text-[#1f3e89]'>
            {library.watchlist.length}
          </span>
        </button>

        <button
          className={[
            'flex items-center justify-between rounded-3xl border p-5 text-left transition',
            activeTab === 'watched'
              ? 'border-[#0f766e] bg-white shadow-xl shadow-[#081023]/5'
              : 'border-[#1f3e89]/10 bg-white/55 hover:bg-white',
          ].join(' ')}
          onClick={() => setActiveTab('watched')}
          type='button'
        >
          <span>
            <span className='flex h-11 w-11 items-center justify-center rounded-full bg-[#0f766e] text-white'>
              <CheckCircle2 aria-hidden='true' className='h-5 w-5' />
            </span>
            <span className='mt-4 block text-lg font-extrabold text-[#081023]'>
              Watched
            </span>
            <span className='mt-1 block text-sm font-semibold text-[#7b8599]'>
              Movies already finished
            </span>
          </span>
          <span className='text-3xl font-extrabold text-[#0f766e]'>
            {library.watched.length}
          </span>
        </button>
      </section>

      <div className='mt-8 flex flex-wrap gap-2'>
        {tabs.map(({ icon: Icon, label, value }) => (
          <button
            className={[
              'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition',
              activeTab === value
                ? 'bg-[#081023] text-white'
                : 'bg-white text-[#7b8599] hover:text-[#1f3e89]',
            ].join(' ')}
            key={value}
            onClick={() => setActiveTab(value)}
            type='button'
          >
            <Icon aria-hidden='true' className='h-4 w-4' />
            {label}
          </button>
        ))}
      </div>

      {activeMovies.length > 0 ? (
        <section className='mt-6 grid gap-5 lg:grid-cols-2'>
          {activeMovies.map((movie) => (
            <LibraryMovieCard
              genresById={genresById}
              key={movie.id}
              movie={movie}
              onMarkAsWatched={handleMoveToWatched}
              onRemove={handleRemove}
              showWatchedAction={activeTab === 'watchlist'}
            />
          ))}
        </section>
      ) : (
        <section className='mt-10 flex min-h-80 flex-col items-center justify-center rounded-[1.75rem] border border-[#1f3e89]/10 bg-white px-5 py-12 text-center shadow-xl shadow-[#081023]/5'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#e8edf7] text-[#1f3e89]'>
            <Film aria-hidden='true' className='h-8 w-8' />
          </div>
          <h2 className='mt-5 text-2xl font-extrabold text-[#081023]'>
            {activeTab === 'watchlist'
              ? 'Your watchlist is empty'
              : 'No watched movies yet'}
          </h2>
          <p className='mt-3 max-w-md text-sm font-semibold leading-6 text-[#7b8599]'>
            {activeTab === 'watchlist'
              ? 'Add movies from the browse page and they will appear here.'
              : 'Mark a movie as watched to keep track of what you have finished.'}
          </p>
          <Link
            className='mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f3e89] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#1f3e89]/20 transition hover:bg-[#081023]'
            to='/'
          >
            <Search aria-hidden='true' className='h-4 w-4' />
            Browse movies
          </Link>
        </section>
      )}
    </main>
  );
};

export default Watchlist;
