import {RECEIVE_ARTISTS, RECEIVE_ARTIST} from '../constants';
import { apiFetch } from '../utils';

export const receiveArtists = artists => ({
  type: RECEIVE_ARTISTS,
  artists
});

export const receiveArtist = (artist, albums, songs) => ({
  type: RECEIVE_ARTIST,
  artist,
  songs,
  albums
});

export const getArtistById = artistId => async dispatch => {
  try {
    const [artist, albums, songs] = await Promise.all([
      apiFetch(`/api/artists/${artistId}`),
      apiFetch(`/api/artists/${artistId}/albums`),
      apiFetch(`/api/artists/${artistId}/songs`),
    ]);
    dispatch(receiveArtist(artist, albums, songs));
  } catch (err) {
    console.error('Failed to load artist:', err);
  }
};