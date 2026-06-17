import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import Playlist from '../components/Playlist';
import { toggleSong } from '../action-creators/player';
import type { Song } from '../types';

export default function PlaylistContainer() {
  const selectedPlaylist = useAppSelector(state => state.playlists.selected);
  const player = useAppSelector(state => state.player);
  const dispatch = useAppDispatch();

  const toggleOne = (song: Song, list: Song[]) => dispatch(toggleSong(song, list));

  return (
    <Playlist
      {...player}
      selectedPlaylist={selectedPlaylist}
      toggleOne={toggleOne}
    />
  );
}
