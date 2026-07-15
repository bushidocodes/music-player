import Stations from '../components/Stations';
import { useAppSelector } from '../hooks';
import { generateStationsFromSongs } from '../utils';

export default function StationsContainer() {
  const stations = useAppSelector((state) =>
    generateStationsFromSongs(state.songs)
  );
  return <Stations stations={stations} />;
}
