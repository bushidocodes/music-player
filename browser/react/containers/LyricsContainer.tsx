import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import Lyrics from '../components/Lyrics';
import { searchLyrics } from '../action-creators/lyrics';

export default function LyricsContainer() {
  const lyrics = useAppSelector(state => state.lyrics);
  const dispatch = useAppDispatch();
  const [artistQuery, setArtistQuery] = useState('');
  const [songQuery, setSongQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (artistQuery && songQuery) {
      dispatch(searchLyrics(artistQuery, songQuery));
    }
  };

  return (
    <Lyrics
      lyrics={lyrics}
      artistQuery={artistQuery}
      songQuery={songQuery}
      setArtist={setArtistQuery}
      setSong={setSongQuery}
      handleSubmit={handleSubmit}
    />
  );
}
