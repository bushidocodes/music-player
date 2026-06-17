import {
  RECEIVE_ALBUMS,
  RECEIVE_ALBUM
} from '../constants';

import {convertAlbum, convertAlbums} from '../utils';

const initialAlbumsState = {
  selected: {},
  list: []
};

export default function (state = initialAlbumsState, action) {

  switch (action.type) {

    case RECEIVE_ALBUMS:
      return { ...state, list: convertAlbums(action.albums) };

    case RECEIVE_ALBUM:
      return { ...state, selected: convertAlbum(action.album) };

    default:
      return state;

  }

}
