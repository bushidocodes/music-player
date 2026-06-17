import {
  RECEIVE_ALBUMS,
  RECEIVE_ALBUM
} from '../constants';

import { convertAlbum, convertAlbums } from '../utils';
import type { AlbumsState, AppAction } from '../types';

const initialAlbumsState: AlbumsState = {
  selected: {},
  list: []
};

export default function albumsReducer(
  state: AlbumsState = initialAlbumsState,
  action: AppAction
): AlbumsState {

  switch (action.type) {

    case RECEIVE_ALBUMS:
      return { ...state, list: convertAlbums(action.albums) };

    case RECEIVE_ALBUM:
      return { ...state, selected: convertAlbum(action.album) };

    default:
      return state;

  }

}
