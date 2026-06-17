import {
  RECEIVE_ARTISTS,
  RECEIVE_ARTIST
} from '../constants';

import { convertAlbums, convertSong } from '../utils';
import type { ArtistsState, AppAction } from '../types';

const initialArtistState: ArtistsState = {
  selected: {},
  list: []
};

export default function artistsReducer(
  state: ArtistsState = initialArtistState,
  action: AppAction
): ArtistsState {

  switch (action.type) {

    case RECEIVE_ARTISTS:
      return { ...state, list: action.artists };

    case RECEIVE_ARTIST:
      return {
        ...state,
        selected: {
          ...action.artist,
          albums: convertAlbums(action.albums),
          songs: action.songs.map(convertSong),
        },
      };

    default:
      return state;

  }

}
