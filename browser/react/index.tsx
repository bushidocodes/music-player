import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  HashRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { getAlbumById, receiveAlbums } from './action-creators/albums';
import { getArtistById, receiveArtists } from './action-creators/artists';
import {
  getPlaylistById,
  loadAllSongs,
  receivePlaylists,
} from './action-creators/playlists';
import Albums from './components/Albums';
import App from './components/App';
import Songs from './components/Songs';
import AlbumContainer from './containers/AlbumContainer';
import AlbumsContainer from './containers/AlbumsContainer';
import ArtistContainer from './containers/ArtistContainer';
import FilterableArtistsContainer from './containers/FilterableArtistsContainer';
import LyricsContainer from './containers/LyricsContainer';
import NewPlaylistContainer from './containers/NewPlaylistContainer';
import PlaylistContainer from './containers/PlaylistContainer';
import StationContainer from './containers/StationContainer';
import StationsContainer from './containers/StationsContainer';
import store from './store';
import type { Album, Artist, Playlist, Song, ToggleOne } from './types';
import { apiFetch } from './utils';

interface ArtistOutletContext {
  albums: Album[];
  songs: Song[];
  currentSong: Partial<Song>;
  isPlaying: boolean;
  toggleOne: ToggleOne;
}

function AppWrapper() {
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [albums, artists, playlists] = await Promise.all([
          apiFetch<Album[]>('/api/albums'),
          apiFetch<Artist[]>('/api/artists'),
          apiFetch<Playlist[]>('/api/playlists'),
        ]);
        store.dispatch(receiveAlbums(albums));
        store.dispatch(receiveArtists(artists));
        store.dispatch(receivePlaylists(playlists));
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
  useEffect(() => {
    store.dispatch(getAlbumById(albumId!));
  }, [albumId]);
  return <AlbumContainer />;
}

function ArtistRoute() {
  const { artistId } = useParams();
  useEffect(() => {
    store.dispatch(getArtistById(artistId!));
  }, [artistId]);
  return <ArtistContainer />;
}

function ArtistAlbums() {
  const { albums } = useOutletContext<ArtistOutletContext>();
  return <Albums albums={albums} />;
}

function ArtistSongs() {
  const { songs, currentSong, isPlaying, toggleOne } =
    useOutletContext<ArtistOutletContext>();
  return (
    <Songs
      songs={songs}
      currentSong={currentSong}
      isPlaying={isPlaying}
      toggleOne={toggleOne}
    />
  );
}

function StationsLayout() {
  useEffect(() => {
    store.dispatch(loadAllSongs());
  }, []);
  return <Outlet />;
}

function StationRoute() {
  const { genre } = useParams();
  return <StationContainer genre={genre!} />;
}

function PlaylistRoute() {
  const { playlistId } = useParams();
  useEffect(() => {
    store.dispatch(getPlaylistById(playlistId!));
  }, [playlistId]);
  return <PlaylistContainer />;
}

function NewPlaylistRoute() {
  const navigate = useNavigate();
  return <NewPlaylistContainer navigate={navigate} />;
}

createRoot(document.getElementById('app')!).render(
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
