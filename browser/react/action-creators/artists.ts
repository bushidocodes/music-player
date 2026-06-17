import { RECEIVE_ARTISTS, RECEIVE_ARTIST } from '../constants';
import { apiFetch } from '../utils';
import type { Album, Artist, Song, AppAction } from '../types';
import type { AppThunk } from '../store';

export const receiveArtists = (artists: Artist[]): AppAction => ({
  type: RECEIVE_ARTISTS,
  artists
});

export const receiveArtist = (artist: Artist, albums: Album[], songs: Song[]): AppAction => ({
  type: RECEIVE_ARTIST,
  artist,
  songs,
  albums
});

export const getArtistById = (artistId: string): AppThunk<Promise<void>> => async dispatch => {
  try {
    const [artist, albums, songs] = await Promise.all([
      apiFetch<Artist>(`/api/artists/${artistId}`),
      apiFetch<Album[]>(`/api/artists/${artistId}/albums`),
      apiFetch<Song[]>(`/api/artists/${artistId}/songs`),
    ]);
    dispatch(receiveArtist(artist, albums, songs));
  } catch (err) {
    console.error('Failed to load artist:', err);
  }
};
