import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import NewPlaylist from '../components/NewPlaylist';
import { addNewPlaylist } from '../action-creators/playlists';

interface NewPlaylistContainerProps {
  navigate: NavigateFunction;
}

export default function NewPlaylistContainer({ navigate }: NewPlaylistContainerProps) {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [dirty, setDirty] = useState(false);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.target.value);
    setDirty(true);
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    dispatch(addNewPlaylist(inputValue, navigate));
    setInputValue('');
    setDirty(false);
  };

  let warning = '';
  if (!inputValue && dirty) warning = 'You must enter a name';
  else if (inputValue.length > 16) warning = 'Name must be less than 16 characters';

  return (
    <NewPlaylist
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      inputValue={inputValue}
      warning={warning}
    />
  );
}
