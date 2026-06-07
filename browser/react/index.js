import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  HashRouter, Routes, Route, Navigate,
  Outlet, useParams, useNavigate, useOutletContext,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import AlbumsContainer from './containers/AlbumsContainer';
import AlbumContainer from './containers/AlbumContainer';
import ArtistContainer from './containers/ArtistContainer';
import FilterableArtistsContainer from './containers/FilterableArtistsContainer';
import NewPlaylistContainer from './containers/NewPlaylistContainer';
import PlaylistContainer from './containers/PlaylistContainer';
import LyricsContainer from './containers/LyricsContainer';
import StationsContainer from './containers/StationsContainer';
import StationContainer from './containers/StationContainer';

import App from './components/App';
import Albums from './components/Albums';
import Songs from './components/Songs';

import axios from 'axios';
import store from './store';
import { receiveAlbums, getAlbumById } from './action-creators/albums';
import { receiveArtists, getArtistById } from './action-creators/artists';
import { receivePlaylists, getPlaylistById, loadAllSongs } from './action-creators/playlists';

function AppWrapper() {
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [albumsRes, artistsRes, playlistsRes] = await Promise.all([
          axios.get('/api/albums'),
          axios.get('/api/artists'),
          axios.get('/api/playlists'),
        ]);
        store.dispatch(receiveAlbums(albumsRes.data));
        store.dispatch(receiveArtists(artistsRes.data));
        store.dispatch(receivePlaylists(playlistsRes.data));
      } catch (err) {
        console.error('Failed to load app data:', err);
      }
    }
    loadInitialData();
  }, []);
  return <App />;
}

function AlbumRoute() {
  const { albumId } = useParams();
  useEffect(() => { store.dispatch(getAlbumById(albumId)); }, [albumId]);
  return <AlbumContainer />;
}

function ArtistRoute() {
  const { artistId } = useParams();
  useEffect(() => { store.dispatch(getArtistById(artistId)); }, [artistId]);
  return <ArtistContainer />;
}

function ArtistAlbums() {
  const { albums } = useOutletContext();
  return <Albums albums={albums} />;
}

function ArtistSongs() {
  const { songs, currentSong, isPlaying, toggleOne } = useOutletContext();
  return <Songs songs={songs} currentSong={currentSong} isPlaying={isPlaying} toggleOne={toggleOne} />;
}

function StationsLayout() {
  useEffect(() => { store.dispatch(loadAllSongs()); }, []);
  return <Outlet />;
}

function StationRoute() {
  const { genre } = useParams();
  return <StationContainer genre={genre} />;
}

function PlaylistRoute() {
  const { playlistId } = useParams();
  useEffect(() => { store.dispatch(getPlaylistById(playlistId)); }, [playlistId]);
  return <PlaylistContainer />;
}

function NewPlaylistRoute() {
  const navigate = useNavigate();
  return <NewPlaylistContainer navigate={navigate} />;
}

createRoot(document.getElementById('app')).render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppWrapper />}>
          <Route index element={<Navigate to="/albums" replace />} />
          <Route path="albums" element={<AlbumsContainer />} />
          <Route path="albums/:albumId" element={<AlbumRoute />} />
          <Route path="artists" element={<FilterableArtistsContainer />} />
          <Route path="artists/:artistId" element={<ArtistRoute />}>
            <Route path="albums" element={<ArtistAlbums />} />
            <Route path="songs" element={<ArtistSongs />} />
          </Route>
          <Route path="stations" element={<StationsLayout />}>
            <Route index element={<StationsContainer />} />
            <Route path=":genre" element={<StationRoute />} />
          </Route>
          <Route path="new-playlist" element={<NewPlaylistRoute />} />
          <Route path="playlists/:playlistId" element={<PlaylistRoute />} />
          <Route path="lyrics" element={<LyricsContainer />} />
        </Route>
      </Routes>
    </HashRouter>
  </Provider>
);
