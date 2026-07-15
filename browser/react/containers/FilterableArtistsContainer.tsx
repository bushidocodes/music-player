import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Artists from '../components/Artists';
import FilterInput from '../components/FilterInput';
import { useAppSelector } from '../hooks';

export default function FilterableArtistsContainer() {
  const artists = useAppSelector((state) => state.artists.list);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) =>
    setInputValue(evt.target.value);
  const filteredArtists = artists.filter((artist) =>
    artist.name.match(inputValue)
  );

  return (
    <div>
      <FilterInput handleChange={handleChange} inputValue={inputValue} />
      <Artists artists={filteredArtists} />
    </div>
  );
}
