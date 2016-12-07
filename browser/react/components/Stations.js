import React from 'react';
import { Link } from 'react-router';

//props.stations.[genre] =[]

export default function (props) {
  console.log("props is ", props);

  // const DUMMY_STATIONS_DATA = [
  //   { name: '90s Hip Hop' },
  //   { name: 'Death Metal' },
  //   { name: 'Classical' }
  // ];

  return (
    <div>
      <h3>Stations</h3>
      <div className="list-group">
        {
          Object.keys(props.stations).map(station => {
            return (
              <div className="list-group-item" key={station}>
                <Link to={'fill/me/in/later'}>{station}</Link>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}