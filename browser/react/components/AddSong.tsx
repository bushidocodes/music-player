import React from 'react';

import type { ChangeEvent, FormEvent } from 'react';
import type { Song } from '../types';

interface AddSongProps {
  songs?: Song[];
  error: boolean;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent) => void;
}

export default function AddSong(props: AddSongProps) {

  const songs = props.songs;
  const error = props.error;
  const handleChange = props.handleChange;
  const handleSubmit = props.handleSubmit;

  return (
    <div className="p-3 border rounded">
      <form noValidate name="songSelect" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Add to Playlist</legend>
          { error && <div className="alert alert-danger">Song is a duplicate</div> }
          <div className="mb-3 row">
            <label htmlFor="song" className="col-2 col-form-label">Song</label>
            <div className="col-10">
              <select
                className="form-control"
                name="song"
                required
                onChange={handleChange}>
                {
                  songs && songs.map(song => (
                    <option key={song.id} value={song.id}>{song.name}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col-10 offset-2">
              <button type="submit" className="btn btn-success">Add Song</button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
