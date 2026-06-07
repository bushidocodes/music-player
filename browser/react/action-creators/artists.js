import {RECEIVE_ARTISTS, RECEIVE_ARTIST} from '../constants';
import axios from 'axios';

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
    const [artistRes, albumsRes, songsRes] = await Promise.all([
      axios.get(`/api/artists/${artistId}`),
      axios.get(`/api/artists/${artistId}/albums`),
      axios.get(`/api/artists/${artistId}/songs`),
    ]);
    dispatch(receiveArtist(artistRes.data, albumsRes.data, songsRes.data));
  } catch (err) {
    console.error('Failed to load artist:', err);
  }
};