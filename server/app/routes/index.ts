import express from 'express';
import { Album, Artist, Playlist, Song } from '../../db/models/index.js';
import type {
  AlbumRepository,
  ArtistRepository,
  PlaylistRepository,
  SongRepository,
} from '../../db/models/types.js';
import createAlbumsRouter from './albums.js';
import createArtistsRouter from './artists.js';
import createLyricsRouter from './lyrics.js';
import createPlaylistsRouter from './playlists.js';
import createSongsRouter from './songs.js';

const router = express.Router();
export default router;

// The models are built dynamically via db.define; cast them to the structural
// repository types the route factories expect.
router.use(
  '/artists',
  createArtistsRouter(Artist as unknown as ArtistRepository)
);
router.use('/albums', createAlbumsRouter(Album as unknown as AlbumRepository));
router.use(
  '/playlists',
  createPlaylistsRouter(Playlist as unknown as PlaylistRepository)
);
router.use('/songs', createSongsRouter(Song as unknown as SongRepository));
router.use('/lyrics', createLyricsRouter(fetch));

router.use((req, res) => res.status(404).end());
