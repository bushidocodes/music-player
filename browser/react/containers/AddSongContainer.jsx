import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddSong from '../components/AddSong';
import { loadAllSongs, addSongToPlaylist } from '../action-creators/playlists';

export default function AddSongContainer(props) {
  const songs = useSelector(state => state.songs);
  const playlistId = useSelector(state => state.playlists.selected.id);
  const dispatch = useDispatch();
  const [songId, setSongId] = useState(1);
  const [error, setError] = useState(false);

  useEffect(() => {
    dispatch(loadAllSongs());
  }, []);

  const handleChange = (evt) => {
    setSongId(evt.target.value);
    setError(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch(addSongToPlaylist(playlistId, songId))
      .catch(() => setError(true));
  };

  return (
    <AddSong
      {...props}
      songs={songs}
      error={error}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}
