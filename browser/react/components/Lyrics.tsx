import React from 'react';

import type { ChangeEvent, FormEvent } from 'react';
import type { LyricsState } from '../types';

interface LyricsProps {
  lyrics: LyricsState;
  artistQuery: string;
  songQuery: string;
  handleSubmit: (e: FormEvent) => void;
  setArtist: (value: string) => void;
  setSong: (value: string) => void;
}

export default function Lyrics(props: LyricsProps) {

  const text = props.lyrics.text;
  const artistQuery = props.artistQuery;
  const songQuery = props.songQuery;
  const handleSubmit = props.handleSubmit;

  const artistChange = (e: ChangeEvent<HTMLInputElement>) => props.setArtist(e.target.value);
  const songChange = (e: ChangeEvent<HTMLInputElement>) => props.setSong(e.target.value);

  return (
    <div style={{marginTop: '20px'}}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 row">
          <div className="col-md-6 col-12">
            <label className="form-label">Artist</label>
            <input
              className="form-control"
              type="text"
              value={artistQuery}
              placeholder="Enter an artist name"
              onChange={artistChange}
            />
          </div>
          <div className="col-md-6 col-12">
            <label className="form-label">Song</label>
            <input
              className="form-control"
              type="text"
              value={songQuery}
              placeholder="Enter a song name"
              onChange={songChange}
            />
          </div>
        </div>
        <pre>{text || 'Search above!'}</pre>
        <button type="submit" className="btn btn-success">
          Search for Lyrics
        </button>
      </form>
    </div>
  );
}
