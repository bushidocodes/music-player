import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import NewPlaylist from '../components/NewPlaylist';
import { addNewPlaylist } from '../action-creators/playlists';

export default function NewPlaylistContainer({ navigate }) {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [dirty, setDirty] = useState(false);

  const handleChange = (evt) => {
    setInputValue(evt.target.value);
    setDirty(true);
  };

  const handleSubmit = (evt) => {
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
