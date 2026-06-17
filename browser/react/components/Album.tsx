import React from 'react';
import Songs from '../components/Songs';

import type { Album, Song, ToggleOne } from '../types';

interface AlbumProps {
  selectedAlbum: Partial<Album>;
  currentSong: Partial<Song>;
  isPlaying: boolean;
  toggleOne: ToggleOne;
}

export default function Album(props: AlbumProps) {

  const album = props.selectedAlbum;
  const currentSong = props.currentSong;
  const isPlaying = props.isPlaying;
  const toggleOne = props.toggleOne;

  return (
    <div className="album">
      <div>
        <h3>{ album.name }</h3>
        <img src={ album.imageUrl } alt={ album.name } className="img-thumbnail"/>
      </div>
      <Songs
        songs={album.songs}
        currentSong={currentSong}
        isPlaying={isPlaying}
        toggleOne={toggleOne}/>
    </div>
  );

}
