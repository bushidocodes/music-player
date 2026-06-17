import React from 'react';

import type { Song } from '../types';

interface PlayerProps {
  currentSong: Partial<Song>;
  isPlaying: boolean;
  progress: number;
  prev: () => void;
  toggle: () => void;
  next: () => void;
}

export default function Player(props: PlayerProps) {

  const currentSong = props.currentSong;
  const isPlaying = props.isPlaying;
  const progress = props.progress;
  const prev = props.prev;
  const toggle = props.toggle;
  const next = props.next;

  return (
    <footer>
      <div style={!currentSong.id ? {display: 'none'} : undefined}>
        <div className="float-start">
          <button className="btn btn-secondary" onClick={prev}>
            <span className="bi bi-skip-backward-fill"></span>
          </button>
          <button className="btn btn-secondary" onClick={toggle}>
            <span className={isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'}></span>
          </button>
          <button className="btn btn-secondary" onClick={next}>
            <span className="bi bi-skip-forward-fill"></span>
          </button>
        </div>
        <div className="bar">
          <div className="progress">
            <div className="progress-bar" style={{width: `${progress * 100}%`}}></div>
          </div>
        </div>
      </div>
    </footer>
  );
};
