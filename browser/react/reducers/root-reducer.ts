import { combineReducers } from '@reduxjs/toolkit';
import type { Reducer } from '@reduxjs/toolkit';
import lyricsReducer from './lyrics-reducer';
import playerReducer from './player-reducer';
import artistsReducer from './artists-reducer';
import albumsReducer from './albums-reducer';
import playlistsReducer from './playlists-reducer';
import songsReducer from './songs-reducer';
import type {
  LyricsState,
  PlayerState,
  ArtistsState,
  AlbumsState,
  PlaylistsState,
  SongsState,
} from '../types';

// The reducers narrow on the AppAction union; cast them to the store-level
// Reducer (whose action type is UnknownAction) so combineReducers still infers
// each slice's state for RootState.
export default combineReducers({
  lyrics: lyricsReducer as Reducer<LyricsState>,
  player: playerReducer as Reducer<PlayerState>,
  artists: artistsReducer as Reducer<ArtistsState>,
  albums: albumsReducer as Reducer<AlbumsState>,
  playlists: playlistsReducer as Reducer<PlaylistsState>,
  songs: songsReducer as Reducer<SongsState>,
});
