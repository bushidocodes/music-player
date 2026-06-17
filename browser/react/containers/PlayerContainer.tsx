import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AUDIO from '../audio';
import { previous, next, setProgress, toggleSong } from '../action-creators/player';
import Player from '../components/Player';

export default function PlayerContainer() {
  const player = useSelector(state => state.player);
  const dispatch = useDispatch();

  // Stable callbacks — dispatch is always the same reference
  const handleNext = useCallback(() => dispatch(next()), [dispatch]);
  const handlePrev = useCallback(() => dispatch(previous()), [dispatch]);
  const handleToggle = useCallback(
    () => dispatch(toggleSong(player.currentSong, player.currentSongList)),
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
