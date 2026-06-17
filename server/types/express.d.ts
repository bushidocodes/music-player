import type {
  SongInstance,
  AlbumInstance,
  ArtistInstance,
  PlaylistInstance,
} from '../db/models/types.js';

// The route param handlers attach the looked-up row to req; declare those
// properties so the downstream handlers can read them.
declare global {
  namespace Express {
    interface Request {
      song: SongInstance;
      album: AlbumInstance;
      artist: ArtistInstance;
      playlist: PlaylistInstance;
    }
  }
}

export {};
