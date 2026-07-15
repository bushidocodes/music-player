import Albums from '../components/Albums';
import { useAppSelector } from '../hooks';

export default function AlbumsContainer() {
  const albums = useAppSelector((state) => state.albums.list);
  return <Albums albums={albums} />;
}
