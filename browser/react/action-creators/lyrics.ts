import {SET_LYRICS} from '../constants';
import { apiFetch } from '../utils';

export const setLyrics = text => ({
  type: SET_LYRICS,
  text
});

export const searchLyrics = (artist, song) => async dispatch => {
  try {
    const data = await apiFetch(`/api/lyrics/${artist}/${song}`);
    dispatch(setLyrics(data.lyric));
  } catch (err) {
    console.error('Failed to load lyrics:', err);
  }
};
