import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { addSongToPlaylist, loadAllSongs } from '../action-creators/playlists';
import AddSong from '../components/AddSong';
import { useAppDispatch, useAppSelector } from '../hooks';

export default function AddSongContainer(props: Record<string, never>) {
  const songs = useAppSelector((state) => state.songs);
  const playlistId = useAppSelector((state) => state.playlists.selected.id);
  const dispatch = useAppDispatch();
  const [songId, setSongId] = useState<number | string>(1);
  const [error, setError] = useState(false);

  useEffect(() => {
    dispatch(loadAllSongs());
  }, []);

  const handleChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    setSongId(evt.target.value);
    setError(false);
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    dispatch(addSongToPlaylist(playlistId, songId)).catch(() => setError(true));
  };

  return (
    <AddSong
      {...props}
      songs={songs}
      error={error}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}
