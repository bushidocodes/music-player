import React from 'react';
import { Link } from 'react-router-dom';

export default function (props) {

  const albums = props.albums;

  return (
    <div>
      <h3>Albums</h3>
      <div className="row">
        {
          albums && albums.map(album => (
            <div className="col-4 mb-4" key={ album.id }>
              <Link className="card text-decoration-none" to={`/albums/${album.id}`}>
                <img src={ album.imageUrl } alt={ album.name } className="card-img-top"/>
                <div className="card-body">
                  <h5 className="card-title">
                    <span>{ album.name }</span>
                  </h5>
                  <small>{ album.songs.length } songs</small>
                </div>
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  );
};
