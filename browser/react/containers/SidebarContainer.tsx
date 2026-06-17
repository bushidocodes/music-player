import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';

export default function SidebarContainer() {
  const playlists = useSelector(state => state.playlists.list);
  return <Sidebar playlists={playlists} />;
}
