import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
} from '../constants';

import { convertSong } from '../utils';
import type { PlaylistsState, AppAction } from '../types';

const initialPlaylistsState: PlaylistsState = {
  selected: {},
  list: []
};

export default function playlistsReducer(
  state: PlaylistsState = initialPlaylistsState,
  action: AppAction
): PlaylistsState {

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
