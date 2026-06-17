import {
  START_PLAYING,
  STOP_PLAYING,
  SET_CURRENT_SONG,
  SET_LIST,
  SET_PROGRESS
} from '../constants';

export const initialPlayerState = {
  currentSong: {},
  currentSongList: [],
  isPlaying: false,
  progress: 0
};

export default function (state = initialPlayerState, action) {

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
