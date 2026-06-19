import React, { useState } from 'react';

// components
import ResultCard from './ResultCard';

export default function Add() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const queryChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);

    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=3074f033e90bc44a3114efd490c76859&language=en-US&page=1&include_adult=false&query=${e.target.value}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      });
  };

  return (
    <div className='add-page'>
      <div className='container'>
        <div className='add-content'>
          <div className='input-wrapper'>
            <input
              type='text'
              placeholder='Search for a movie'
              value={query}
              onChange={queryChange}
            />
          </div>

          {results.length > 0 && (
            <ul className='results'>
              {results.map((movie) => {
                return (
                  <li key={movie.id}>
                    <ResultCard movie={movie} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
