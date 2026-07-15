import Sidebar from '../components/Sidebar';
import { useAppSelector } from '../hooks';

export default function SidebarContainer() {
  const playlists = useAppSelector((state) => state.playlists.list);
  return <Sidebar playlists={playlists} />;
}
