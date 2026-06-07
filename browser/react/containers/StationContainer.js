import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Station from '../components/Station';
import { generateStationsFromSongs, convertSong } from '../utils';
import { toggleSong } from '../action-creators/player';

export default function StationContainer({ genre }) {
  const songs = useSelector(state =>
    (generateStationsFromSongs(state.songs)[genre] || []).map(convertSong)
  );
  const currentSong = useSelector(state => state.player.currentSong);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const dispatch = useDispatch();

  const toggleOne = (song, list) => dispatch(toggleSong(song, list));

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
