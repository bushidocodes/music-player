import React from 'react';
import Songs from './Songs';

import type { Song, ToggleOne } from '../types';

interface StationProps {
  genre: string;
  songs?: Song[];
  currentSong: Partial<Song>;
  isPlaying: boolean;
  toggleOne: ToggleOne;
}

export default function Station(props: StationProps) {

  const songs = props.songs;

  return (
    <div>
      <h3>{ props.genre}</h3>
      <Songs {...props} songs={songs}/>
      { songs && !songs.length && <small>No songs.</small> }
      <hr />
    </div>
  );

}
