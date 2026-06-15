import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  RECEIVE_SONGS
} from '../constants';

import {convertSong, apiFetch} from '../utils';

export const receivePlaylists = playlists => ({
  type: RECEIVE_PLAYLISTS,
  playlists
});

export const receivePlaylist = playlist => ({
  type: RECEIVE_PLAYLIST,
  playlist
});

export const receiveAllSongs = songs => ({
  type: RECEIVE_SONGS,
  songs
});

export const getPlaylistById = playlistId => async dispatch => {
  try {
    const data = await apiFetch(`/api/playlists/${playlistId}`);
    dispatch(receivePlaylist(data));
  } catch (err) {
    console.error('Failed to load playlist:', err);
  }
};

export const addNewPlaylist = (playlistName, navigate) => async (dispatch, getState) => {
  try {
    const playlist = await apiFetch('/api/playlists', { method: 'POST', body: { name: playlistName } });
    const newListOfPlaylists = [...getState().playlists.list, playlist];
    dispatch(receivePlaylists(newListOfPlaylists));
    navigate(`/playlists/${playlist.id}`);
  } catch (err) {
    console.error('Failed to create playlist:', err);
  }
};

export const loadAllSongs = () => async dispatch => {
  try {
    const data = await apiFetch('/api/songs');
    dispatch(receiveAllSongs(data));
  } catch (err) {
    console.error('Failed to load songs:', err);
  }
};

export const addSongToPlaylist = (playlistId, songId) => async (dispatch, getState) => {
  const song = await apiFetch(`/api/playlists/${playlistId}/songs`, { method: 'POST', body: { id: songId } });
  const selectedPlaylist = getState().playlists.selected;
  dispatch(receivePlaylist({
    ...selectedPlaylist,
    songs: [...selectedPlaylist.songs, convertSong(song)],
  }));
};
