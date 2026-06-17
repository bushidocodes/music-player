import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
} from '../constants';

import {convertSong} from '../utils';

const initialPlaylistsState = {
  selected: {},
  list: []
};

export default function (state = initialPlaylistsState, action) {

  switch (action.type) {

    case RECEIVE_PLAYLISTS:
      return { ...state, list: action.playlists };

    case RECEIVE_PLAYLIST:
      return {
        ...state,
        selected: {
          ...action.playlist,
          songs: action.playlist.songs.map(convertSong),
        },
      };

    default:
      return state;

  }

}
