import express from 'express';
import axios from 'axios';
import { Song, Album, Artist, Playlist } from '../../db/models/index.js';
import createArtistsRouter from './artists.js';
import createAlbumsRouter from './albums.js';
import createPlaylistsRouter from './playlists.js';
import createSongsRouter from './songs.js';
import createLyricsRouter from './lyrics.js';
import type {
  SongRepository,
  AlbumRepository,
  ArtistRepository,
  PlaylistRepository,
} from '../../db/models/types.js';

const router = express.Router();
export default router;

// The models are built dynamically via db.define; cast them to the structural
// repository types the route factories expect.
router.use('/artists', createArtistsRouter(Artist as unknown as ArtistRepository));
router.use('/albums', createAlbumsRouter(Album as unknown as AlbumRepository));
router.use('/playlists', createPlaylistsRouter(Playlist as unknown as PlaylistRepository));
router.use('/songs', createSongsRouter(Song as unknown as SongRepository));
router.use('/lyrics', createLyricsRouter(axios));

router.use((req, res) => res.status(404).end());
