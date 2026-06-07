import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Artist from '../components/Artist';
import { toggleSong } from '../action-creators/player';

export default function ArtistContainer() {
  const selectedArtist = useSelector(state => state.artists.selected);
  const player = useSelector(state => state.player);
  const dispatch = useDispatch();

  const toggleOne = (song, list) => dispatch(toggleSong(song, list));

  return (
    <Artist
      {...player}
      selectedArtist={selectedArtist}
      toggleOne={toggleOne}
    />
  );
}
