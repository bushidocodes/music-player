// Structural types describing only the surface of the Sequelize models that the
// route handlers actually use. The concrete models (dynamically built with
// db.define) are cast to the *Repository types in routes/index.ts; the
// *Instance types describe the rows attached to req in the param handlers
// (see server/types/express.d.ts).

export interface SongInstance {
  id: number;
  name: string;
  genre: string | null;
  albumId: number | null;
  url: string;
  artists?: ArtistInstance[];
}

export interface AlbumInstance {
  id: number;
  name: string;
  songs: SongInstance[];
  artists?: ArtistInstance[];
}

export interface ArtistInstance {
  id: number;
  name: string;
  getAlbums(): Promise<AlbumInstance[]>;
  getSongs(options?: unknown): Promise<SongInstance[]>;
}

export interface PlaylistInstance {
  id: number;
  name: string;
  songs: SongInstance[];
  update(values: { name: string }): Promise<PlaylistInstance>;
  destroy(): Promise<void>;
  addSong(songId: number | string): Promise<unknown>;
  removeSong(songId: number | string): Promise<unknown>;
  addAndReturnSong(songId: number | string): Promise<SongInstance>;
}

interface Scoped<T> {
  findAll(): Promise<T[]>;
  findByPk(id: number | string): Promise<T | null>;
}

export interface SongRepository {
  scope(...scopes: string[]): Scoped<SongInstance>;
}

export interface AlbumRepository {
  scope(...scopes: string[]): Scoped<AlbumInstance>;
}

export interface ArtistRepository {
  findAll(): Promise<ArtistInstance[]>;
  findByPk(id: number | string): Promise<ArtistInstance | null>;
}

export interface PlaylistRepository {
  findAll(): Promise<PlaylistInstance[]>;
  create(values: { name: string }): Promise<PlaylistInstance>;
  scope(...scopes: string[]): Pick<Scoped<PlaylistInstance>, 'findByPk'>;
}
