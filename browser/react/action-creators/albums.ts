import { RECEIVE_ALBUM, RECEIVE_ALBUMS } from '../constants';
import type { AppThunk } from '../store';
import type { Album, AppAction } from '../types';
import { apiFetch } from '../utils';

export const receiveAlbums = (albums: Album[]): AppAction => ({
  type: RECEIVE_ALBUMS,
  albums,
});

export const receiveAlbum = (album: Album): AppAction => ({
  type: RECEIVE_ALBUM,
  album,
});

export const getAlbumById =
  (albumId: string): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      const data = await apiFetch<Album>(`/api/albums/${albumId}`);
      dispatch(receiveAlbum(data));
    } catch (err) {
      console.error('Failed to load album:', err);
    }
  };
