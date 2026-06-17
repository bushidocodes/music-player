import React from 'react';
import Songs from './Songs';
import AddSongContainer from '../containers/AddSongContainer';

import type { PlayerState, Playlist, ToggleOne } from '../types';

interface PlaylistProps extends PlayerState {
  selectedPlaylist: Partial<Playlist>;
  toggleOne: ToggleOne;
}

export default function Playlist(props: PlaylistProps) {

  const playlist = props.selectedPlaylist;

  return (
    <div>
      <h3>{ playlist.name }</h3>
      <Songs {...props} songs={playlist.songs}/>
      { playlist.songs && !playlist.songs.length && <small>No songs.</small> }
      <AddSongContainer />
      <hr />
    </div>
  );

}
