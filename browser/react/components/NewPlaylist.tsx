import React from 'react';

import type { ChangeEvent, FormEvent } from 'react';

interface NewPlaylistProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  warning: string;
  inputValue: string;
}

export default function NewPlaylist(props: NewPlaylistProps) {

  const handleChange = props.handleChange;
  const handleSubmit = props.handleSubmit;
  const warning = props.warning;
  const inputValue = props.inputValue;

  return (
    <div className="p-3 border rounded" style={{marginTop: '20px'}}>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>New Playlist</legend>
          { warning && <div className="alert alert-warning">{warning}</div> }
          <div className="mb-3 row">
            <label className="col-2 col-form-label">Name</label>
            <div className="col-10">
              <input
                className="form-control"
                type="text"
                onChange={handleChange}
                value={inputValue}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col-10 offset-2">
              <button
                type="submit"
                className="btn btn-success"
                disabled={!!warning || !inputValue}>
                Create Playlist
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
