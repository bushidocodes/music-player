import { toggleSong } from '../action-creators/player';
import Artist from '../components/Artist';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { Song } from '../types';

export default function ArtistContainer() {
  const selectedArtist = useAppSelector((state) => state.artists.selected);
  const player = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  const toggleOne = (song: Song, list: Song[]) =>
    dispatch(toggleSong(song, list));

  return (
    <Artist {...player} selectedArtist={selectedArtist} toggleOne={toggleOne} />
  );
}
