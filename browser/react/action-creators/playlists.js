import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  RECEIVE_SONGS
} from '../constants';

import axios from 'axios';

import {convertSong} from '../utils';

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

export const getPlaylistById = playlistId => {

  return dispatch => {
    return axios.get(`/api/playlists/${playlistId}`)
      .then(response => {
        dispatch(receivePlaylist(response.data));
      })
      .catch(err => console.error('Failed to load playlist:', err));
  };

};

export const addNewPlaylist = (playlistName, navigate) => {

  return (dispatch, getState) => {

    return axios.post('/api/playlists', {name: playlistName})
      .then(res => res.data)
      .then(playlist => {
        const newListOfPlaylists = getState().playlists.list.concat([playlist]);
        dispatch(receivePlaylists(newListOfPlaylists));
        navigate(`/playlists/${playlist.id}`);
      });

  };

};

export const loadAllSongs = () => {
  return dispatch => {
    axios.get('/api/songs')
      .then(response => {
        dispatch(receiveAllSongs(response.data));
      })
      .catch(err => console.error('Failed to load songs:', err));
  };
};

export const addSongToPlaylist = (playlistId, songId) => {

  return (dispatch, getState) => {

    return axios.post(`/api/playlists/${playlistId}/songs`, {
      id: songId
    })
      .then(res => res.data)
      .then(song => {

        const selectedPlaylist = getState().playlists.selected;
        const songs = selectedPlaylist.songs;
        const newSongs = songs.concat([convertSong(song)]);
        const newSelectedPlaylist = Object.assign({}, selectedPlaylist, {
          songs: newSongs
        });

        dispatch(receivePlaylist(newSelectedPlaylist));

      });

  };

};
