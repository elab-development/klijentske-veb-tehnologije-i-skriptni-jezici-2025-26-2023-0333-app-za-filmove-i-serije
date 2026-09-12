import React, { useContext } from 'react';

// context
import { GlobalContext } from '../context/GlobalState';

export default function ResultCard({ movie }) {
  const { addMovieToWatchList, watchlist } = useContext(GlobalContext);

  let storedMovie = watchlist.find((o) => o.id === movie.id);

  const watchListDisabled = storedMovie ? true : false;

  return (
    <div className='result-card'>
      <div className='poster-wrapper'>
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt='movie-poster'
          />
        ) : (
          <div className='filler-poster'></div>
        )}
      </div>

      <div className='info'>
        <div className='header'>
          <h3 className='title'>{movie.title}</h3>
          <h4 className='release-date'>
            {movie.release_date ? movie.release_date.substring(0, 4) : 'unknwn'}
          </h4>
        </div>
        <div className='controls'>
          <button
            disabled={watchListDisabled}
            className='btn'
            onClick={() => addMovieToWatchList(movie)}
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
