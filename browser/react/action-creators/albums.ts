import { RECEIVE_ALBUMS, RECEIVE_ALBUM } from '../constants';
import { apiFetch } from '../utils';

export const receiveAlbums = albums => ({
    type: RECEIVE_ALBUMS,
    albums
});

export const receiveAlbum = album => ({
    type: RECEIVE_ALBUM,
    album
});

export const getAlbumById = albumId => async dispatch => {
  try {
    const data = await apiFetch(`/api/albums/${albumId}`);
    dispatch(receiveAlbum(data));
  } catch (err) {
    console.error('Failed to load album:', err);
  }
};