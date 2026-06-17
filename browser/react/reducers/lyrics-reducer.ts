import {
  SET_LYRICS
} from '../constants';
import type { LyricsState, AppAction } from '../types';

const initialLyricsState: LyricsState = {
  text: null
};

export default function lyricsReducer(
  state: LyricsState = initialLyricsState,
  action: AppAction
): LyricsState {

  switch (action.type) {

    case SET_LYRICS:
      return { ...state, text: action.text };

    default:
      return state;

  }

}
