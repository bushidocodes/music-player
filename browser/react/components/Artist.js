import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function (props) {

  const artist = props.selectedArtist;
  const albums = artist.albums || [];
  const songs = artist.songs || [];

  return (
    <div>
      <h3>{ artist.name }</h3>
      <ul className="nav nav-tabs">
        <li><Link to={`/artists/${artist.id}/albums`}>ALBUMS</Link></li>
        <li><Link to={`/artists/${artist.id}/songs`}>SONGS</Link></li>
      </ul>
      <Outlet context={{ albums, songs, currentSong: props.currentSong, isPlaying: props.isPlaying, toggleOne: props.toggleOne }} />
    </div>
  );

};