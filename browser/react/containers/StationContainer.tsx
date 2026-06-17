import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import Station from '../components/Station';
import { generateStationsFromSongs, convertSong } from '../utils';
import { toggleSong } from '../action-creators/player';
import type { Song } from '../types';

interface StationContainerProps {
  genre: string;
}

export default function StationContainer({ genre }: StationContainerProps) {
  const songs = useAppSelector(state =>
    (generateStationsFromSongs(state.songs)[genre] || []).map(convertSong)
  );
  const currentSong = useAppSelector(state => state.player.currentSong);
  const isPlaying = useAppSelector(state => state.player.isPlaying);
  const dispatch = useAppDispatch();

  const toggleOne = (song: Song, list: Song[]) => dispatch(toggleSong(song, list));

  return (
    <Station
      genre={genre}
      songs={songs}
      currentSong={currentSong}
      isPlaying={isPlaying}
      toggleOne={toggleOne}
    />
  );
}
