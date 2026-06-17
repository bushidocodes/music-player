import express from 'express';
import axios from 'axios';
import { Song, Album, Artist, Playlist } from '../../db/models/index.js';
import createArtistsRouter from './artists.js';
import createAlbumsRouter from './albums.js';
import createPlaylistsRouter from './playlists.js';
import createSongsRouter from './songs.js';
import createLyricsRouter from './lyrics.js';

const router = express.Router();
export default router;

router.use('/artists', createArtistsRouter(Artist));
router.use('/albums', createAlbumsRouter(Album));
router.use('/playlists', createPlaylistsRouter(Playlist));
router.use('/songs', createSongsRouter(Song));
router.use('/lyrics', createLyricsRouter(axios));

router.use((req, res) => res.status(404).end());
