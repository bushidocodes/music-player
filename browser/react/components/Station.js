import React from 'react';
import Songs from './Songs';

export default function (props) {

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