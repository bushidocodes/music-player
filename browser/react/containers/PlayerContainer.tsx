import { useCallback, useEffect } from 'react';
import {
  next,
  previous,
  setProgress,
  toggleSong,
} from '../action-creators/player';
import AUDIO from '../audio';
import Player from '../components/Player';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { Song } from '../types';

export default function PlayerContainer() {
  const player = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  // Stable callbacks — dispatch is always the same reference
  const handleNext = useCallback(() => dispatch(next()), [dispatch]);
  const handlePrev = useCallback(() => dispatch(previous()), [dispatch]);
  const handleToggle = useCallback(
    () =>
      dispatch(toggleSong(player.currentSong as Song, player.currentSongList)),
    [dispatch, player.currentSong, player.currentSongList]
  );

  useEffect(() => {
    const onEnded = () => dispatch(next());
    const onTimeUpdate = () => {
      const duration = AUDIO.duration;
      if (duration && isFinite(duration)) {
        dispatch(setProgress(AUDIO.currentTime / duration));
      }
    };

    AUDIO.addEventListener('ended', onEnded);
    AUDIO.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      AUDIO.removeEventListener('ended', onEnded);
      AUDIO.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [dispatch]);

  return (
    <Player
      {...player}
      next={handleNext}
      prev={handlePrev}
      toggle={handleToggle}
    />
  );
}
