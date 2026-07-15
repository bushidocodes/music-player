import { Link, Outlet } from 'react-router-dom';

import type { Artist, Song, ToggleOne } from '../types';

interface ArtistProps {
  selectedArtist: Partial<Artist>;
  currentSong: Partial<Song>;
  isPlaying: boolean;
  toggleOne: ToggleOne;
}

export default function Artist(props: ArtistProps) {
  const artist = props.selectedArtist;
  const albums = artist.albums || [];
  const songs = artist.songs || [];

  return (
    <div>
      <h3>{artist.name}</h3>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link className="nav-link" to={`/artists/${artist.id}/albums`}>
            ALBUMS
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={`/artists/${artist.id}/songs`}>
            SONGS
          </Link>
        </li>
      </ul>
      <Outlet
        context={{
          albums,
          songs,
          currentSong: props.currentSong,
          isPlaying: props.isPlaying,
          toggleOne: props.toggleOne,
        }}
      />
    </div>
  );
}
