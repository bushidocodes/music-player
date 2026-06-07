import React from 'react';
import { useSelector } from 'react-redux';
import Stations from '../components/Stations';
import { generateStationsFromSongs } from '../utils';

export default function StationsContainer() {
  const stations = useSelector(state => generateStationsFromSongs(state.songs));
  return <Stations stations={stations} />;
}
