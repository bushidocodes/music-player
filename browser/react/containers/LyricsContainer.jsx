import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Lyrics from '../components/Lyrics';
import { searchLyrics } from '../action-creators/lyrics';

export default function LyricsContainer() {
  const lyrics = useSelector(state => state.lyrics);
  const dispatch = useDispatch();
  const [artistQuery, setArtistQuery] = useState('');
  const [songQuery, setSongQuery] = useState('');

  const handleSubmit = (e) => {
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
