import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FilterInput from '../components/FilterInput';
import Artists from '../components/Artists';

export default function FilterableArtistsContainer() {
  const artists = useSelector(state => state.artists.list);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (evt) => setInputValue(evt.target.value);
  const filteredArtists = artists.filter(artist => artist.name.match(inputValue));

  return (
    <div>
      <FilterInput handleChange={handleChange} inputValue={inputValue} />
      <Artists artists={filteredArtists} />
    </div>
  );
}
