import { RECEIVE_PLAYLIST, RECEIVE_PLAYLISTS } from '../constants';
import type { AppAction, PlaylistsState } from '../types';
import { convertSong } from '../utils';

const initialPlaylistsState: PlaylistsState = {
  selected: {},
  list: [],
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
