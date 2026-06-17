import React from 'react';
import { useAppSelector } from '../hooks';
import Sidebar from '../components/Sidebar';

export default function SidebarContainer() {
  const playlists = useAppSelector(state => state.playlists.list);
  return <Sidebar playlists={playlists} />;
}
