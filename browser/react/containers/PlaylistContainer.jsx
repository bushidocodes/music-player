import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Playlist from '../components/Playlist';
import { toggleSong } from '../action-creators/player';

export default function PlaylistContainer() {
  const selectedPlaylist = useSelector(state => state.playlists.selected);
  const player = useSelector(state => state.player);
  const dispatch = useDispatch();

  const toggleOne = (song, list) => dispatch(toggleSong(song, list));

  return (
    <Playlist
      {...player}
      selectedPlaylist={selectedPlaylist}
      toggleOne={toggleOne}
    />
  );
}
