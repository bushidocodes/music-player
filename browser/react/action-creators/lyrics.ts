import { SET_LYRICS } from '../constants';
import { apiFetch } from '../utils';
import type { AppAction } from '../types';
import type { AppThunk } from '../store';

export const setLyrics = (text: string | null): AppAction => ({
  type: SET_LYRICS,
  text
});

export const searchLyrics = (artist: string, song: string): AppThunk<Promise<void>> => async dispatch => {
  try {
    const data = await apiFetch<{ lyric: string | null }>(`/api/lyrics/${artist}/${song}`);
    dispatch(setLyrics(data.lyric));
  } catch (err) {
    console.error('Failed to load lyrics:', err);
  }
};
