import { toggleSong } from '../action-creators/player';
import Album from '../components/Album';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { Song } from '../types';

export default function AlbumContainer() {
  const selectedAlbum = useAppSelector((state) => state.albums.selected);
  const currentSong = useAppSelector((state) => state.player.currentSong);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const dispatch = useAppDispatch();

  const toggleOne = (song: Song, list: Song[]) =>
    dispatch(toggleSong(song, list));

  return (
    <Album
      selectedAlbum={selectedAlbum}
      currentSong={currentSong}
      isPlaying={isPlaying}
      toggleOne={toggleOne}
    />
  );
}
