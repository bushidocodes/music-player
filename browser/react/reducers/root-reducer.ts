import { combineReducers } from '@reduxjs/toolkit';
import albumsReducer from './albums-reducer';
import artistsReducer from './artists-reducer';
import lyricsReducer from './lyrics-reducer';
import playerReducer from './player-reducer';
import playlistsReducer from './playlists-reducer';
import songsReducer from './songs-reducer';

export default combineReducers({
  lyrics: lyricsReducer,
  player: playerReducer,
  artists: artistsReducer,
  albums: albumsReducer,
  playlists: playlistsReducer,
  songs: songsReducer,
});
