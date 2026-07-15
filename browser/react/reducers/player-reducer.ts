import {
  SET_CURRENT_SONG,
  SET_LIST,
  SET_PROGRESS,
  START_PLAYING,
  STOP_PLAYING,
} from '../constants';
import type { AppAction, PlayerState } from '../types';

export const initialPlayerState: PlayerState = {
  currentSong: {},
  currentSongList: [],
  isPlaying: false,
  progress: 0,
};

export default function playerReducer(
  state: PlayerState = initialPlayerState,
  action: AppAction
): PlayerState {
  switch (action.type) {
    case SET_CURRENT_SONG:
      return { ...state, currentSong: action.song };

    case SET_LIST:
      return { ...state, currentSongList: action.songList };

    case START_PLAYING:
      return { ...state, isPlaying: true };

    case STOP_PLAYING:
      return { ...state, isPlaying: false };

    case SET_PROGRESS:
      return { ...state, progress: action.progress };

    default:
      return state;
  }
}
