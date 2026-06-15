import React from 'react';
import { useSelector } from 'react-redux';
import Albums from '../components/Albums';

export default function AlbumsContainer() {
  const albums = useSelector(state => state.albums.list);
  return <Albums albums={albums} />;
}
