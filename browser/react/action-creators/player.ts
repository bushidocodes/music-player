import AUDIO from '../audio';

import {
  START_PLAYING,
  STOP_PLAYING,
  SET_CURRENT_SONG,
  SET_LIST,
  SET_PROGRESS,
} from '../constants';

import { skip } from '../utils';
import type { Song, AppAction } from '../types';
import type { AppThunk } from '../store';

export const play = (): AppAction => {
  AUDIO.play().catch(err => {
    if (err.name !== 'AbortError') {
      console.error('Playback failed:', err);
    }
  });
  return {
    type: START_PLAYING
  };
};

export const pause = (): AppAction => {
  AUDIO.pause();
  return {
    type: STOP_PLAYING
  };
};

export const next = (): AppThunk => {
  return (dispatch, getState) => {
    const currentState = getState().player;
    const songToPlay = skip(1, currentState)[0];
    dispatch(startSong(songToPlay, currentState.currentSongList));
  };
};

export const previous = (): AppThunk => {
  return (dispatch, getState) => {
    const currentState = getState().player;
    const songToPlay = skip(-1, currentState)[0];
    dispatch(startSong(songToPlay, currentState.currentSongList));
  };
};

export const setCurrentSong = (song: Song): AppAction => ({
  type: SET_CURRENT_SONG,
  song
});

export const setCurrentList = (songList: Song[]): AppAction => ({
  type: SET_LIST,
  songList
});

export const setProgress = (progress: number): AppAction => ({
    type: SET_PROGRESS,
    progress
});

export const load = (song: Song, list: Song[]): AppThunk => {
  return dispatch => {
    AUDIO.src = song.audioUrl!;
    AUDIO.load();
    dispatch(setCurrentList(list));
    dispatch(setCurrentSong(song));
  };
};

export const startSong = (song: Song, list: Song[]): AppThunk => {
  return dispatch => {
    dispatch(pause());
    dispatch(load(song, list));
    dispatch(play());
  };
};

export const toggleSong = (song: Song, list: Song[]): AppThunk => {
  return (dispatch, getState) => {
    const currentState = getState().player;
    if (currentState.currentSong.id === song.id) {
      dispatch(currentState.isPlaying ? pause() : play());
    } else {
      dispatch(startSong(song, list));
    }
  };
};
