import { RECEIVE_ALBUM, RECEIVE_ALBUMS } from '../constants';
import type { AlbumsState, AppAction } from '../types';
import { convertAlbum, convertAlbums } from '../utils';

const initialAlbumsState: AlbumsState = {
  selected: {},
  list: [],
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
