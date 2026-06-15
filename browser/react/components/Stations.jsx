import React from 'react';
import { Link } from 'react-router-dom';

export default function Stations(props) {
  return (
    <div>
      <h3>Stations</h3>
      <div className="list-group">
        {Object.keys(props.stations).map(genre => (
          <div className="list-group-item" key={genre}>
            <Link to={`/stations/${genre}`}>{genre}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
