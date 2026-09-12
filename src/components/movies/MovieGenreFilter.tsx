import type { MovieGenre } from '../../types/Movie';

interface MovieGenreFilterProps {
  disabled?: boolean;
  genres: MovieGenre[];
  onChange: (genreId: number | null) => void;
  selectedGenreId: number | null;
}

const MovieGenreFilter = ({
  disabled = false,
  genres,
  onChange,
  selectedGenreId,
}: MovieGenreFilterProps) => {
  return (
    <label className='flex w-full flex-col gap-2 sm:max-w-xs'>
      <span className='text-xs font-bold uppercase tracking-[0.14em] text-[#7b8599]'>
        Genre
      </span>
      <select
        className='h-12 rounded-2xl border border-[#1f3e89]/15 bg-white px-4 text-sm font-bold text-[#081023] outline-none transition focus:border-[#1f3e89] focus:ring-4 focus:ring-[#1f3e89]/10 disabled:cursor-not-allowed disabled:opacity-60'
        disabled={disabled}
        onChange={(event) => {
          const value = event.target.value;
          onChange(value ? Number(value) : null);
        }}
        value={selectedGenreId ?? ''}
      >
        <option value=''>All genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default MovieGenreFilter;
