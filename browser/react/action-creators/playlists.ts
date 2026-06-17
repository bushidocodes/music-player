import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  RECEIVE_SONGS
} from '../constants';

import { convertSong, apiFetch } from '../utils';
import type { NavigateFunction } from 'react-router-dom';
import type { Playlist, Song, AppAction } from '../types';
import type { AppThunk } from '../store';

export const receivePlaylists = (playlists: Playlist[]): AppAction => ({
  type: RECEIVE_PLAYLISTS,
  playlists
});

export const receivePlaylist = (playlist: Playlist): AppAction => ({
  type: RECEIVE_PLAYLIST,
  playlist
});

export const receiveAllSongs = (songs: Song[]): AppAction => ({
  type: RECEIVE_SONGS,
  songs
});

export const getPlaylistById = (playlistId: string): AppThunk<Promise<void>> => async dispatch => {
  try {
    const data = await apiFetch<Playlist>(`/api/playlists/${playlistId}`);
    dispatch(receivePlaylist(data));
  } catch (err) {
    console.error('Failed to load playlist:', err);
  }
};

export const addNewPlaylist = (playlistName: string, navigate: NavigateFunction): AppThunk<Promise<void>> => async (dispatch, getState) => {
  try {
    const playlist = await apiFetch<Playlist>('/api/playlists', { method: 'POST', body: { name: playlistName } });
    const newListOfPlaylists = [...getState().playlists.list, playlist];
    dispatch(receivePlaylists(newListOfPlaylists));
    navigate(`/playlists/${playlist.id}`);
  } catch (err) {
    console.error('Failed to create playlist:', err);
  }
};

export const loadAllSongs = (): AppThunk<Promise<void>> => async dispatch => {
  try {
    const data = await apiFetch<Song[]>('/api/songs');
    dispatch(receiveAllSongs(data));
  } catch (err) {
    console.error('Failed to load songs:', err);
  }
};

export const addSongToPlaylist = (playlistId: number | undefined, songId: number | string): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const song = await apiFetch<Song>(`/api/playlists/${playlistId}/songs`, { method: 'POST', body: { id: songId } });
  const selectedPlaylist = getState().playlists.selected;
  dispatch(receivePlaylist({
    ...selectedPlaylist,
    songs: [...(selectedPlaylist.songs ?? []), convertSong(song)],
  } as Playlist));
};
