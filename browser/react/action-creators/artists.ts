import { RECEIVE_ARTIST, RECEIVE_ARTISTS } from '../constants';
import type { AppThunk } from '../store';
import type { Album, AppAction, Artist, Song } from '../types';
import { apiFetch } from '../utils';

export const receiveArtists = (artists: Artist[]): AppAction => ({
  type: RECEIVE_ARTISTS,
  artists,
});

export const receiveArtist = (
  artist: Artist,
  albums: Album[],
  songs: Song[]
): AppAction => ({
  type: RECEIVE_ARTIST,
  artist,
  songs,
  albums,
});

export const getArtistById =
  (artistId: string): AppThunk<Promise<void>> =>
  async (dispatch) => {
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
