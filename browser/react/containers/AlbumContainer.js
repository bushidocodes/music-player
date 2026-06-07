import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Album from '../components/Album';
import { toggleSong } from '../action-creators/player';

export default function AlbumContainer() {
  const selectedAlbum = useSelector(state => state.albums.selected);
  const currentSong = useSelector(state => state.player.currentSong);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const dispatch = useDispatch();

  const toggleOne = (song, list) => dispatch(toggleSong(song, list));

  return (
    <Album
      selectedAlbum={selectedAlbum}
      currentSong={currentSong}
      isPlaying={isPlaying}
      toggleOne={toggleOne}
    />
  );
}
