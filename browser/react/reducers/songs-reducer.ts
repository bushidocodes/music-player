import { RECEIVE_SONGS } from '../constants';
import type { SongsState, AppAction } from '../types';

const initialSongsState: SongsState = [];

export default function songsReducer(
  state: SongsState = initialSongsState,
  action: AppAction
): SongsState {
  switch (action.type) {
    case RECEIVE_SONGS:
      return action.songs;
    default:
      return state;
  }
}
