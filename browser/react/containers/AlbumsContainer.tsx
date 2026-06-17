import React from 'react';
import { useAppSelector } from '../hooks';
import Albums from '../components/Albums';

export default function AlbumsContainer() {
  const albums = useAppSelector(state => state.albums.list);
  return <Albums albums={albums} />;
}
