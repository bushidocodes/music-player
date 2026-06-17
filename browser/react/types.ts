import type {
  SET_LYRICS,
  RECEIVE_ALBUMS,
  RECEIVE_ALBUM,
  RECEIVE_ARTISTS,
  RECEIVE_ARTIST,
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  RECEIVE_SONGS,
  START_PLAYING,
  STOP_PLAYING,
  SET_CURRENT_SONG,
  SET_LIST,
  SET_PROGRESS,
} from './constants';

// ---------------------------------------------------------------------------
// Domain entities (the shapes returned by the API and held in the store).
// `url` is never exposed by the API (Song#toJSON strips it); the client adds
// `audioUrl`/`imageUrl` via the converters in utils.ts.
// ---------------------------------------------------------------------------

export interface Song {
  id: number;
  name: string;
  genre: string | null;
  albumId: number | null;
  artists?: Artist[];
  audioUrl?: string;
}

export interface Album {
  id: number;
  name: string;
  songs: Song[];
  artists?: Artist[];
  imageUrl?: string;
}

export interface Artist {
  id: number;
  name: string;
  albums?: Album[];
  songs?: Song[];
}

export interface Playlist {
  id: number;
  name: string;
  songs: Song[];
  artists?: Artist[];
}

/** A genre name mapped to the songs in that station. */
export type Stations = Record<string, Song[]>;

/** Toggles playback of a song within the context of a given list. */
export type ToggleOne = (song: Song, list: Song[]) => void;

// ---------------------------------------------------------------------------
// Redux state slices. `selected`/`currentSong` start out as `{}`, so the
// populated entity is modelled as Partial until data arrives.
// ---------------------------------------------------------------------------

export interface LyricsState {
  text: string | null;
}

export interface PlayerState {
  currentSong: Partial<Song>;
  currentSongList: Song[];
  isPlaying: boolean;
  progress: number;
}

export interface ArtistsState {
  selected: Partial<Artist>;
  list: Artist[];
}

export interface AlbumsState {
  selected: Partial<Album>;
  list: Album[];
}

export interface PlaylistsState {
  selected: Partial<Playlist>;
  list: Playlist[];
}

export type SongsState = Song[];

// ---------------------------------------------------------------------------
// Action union (one member per constant) for the hand-rolled reducers.
// ---------------------------------------------------------------------------

export type AppAction =
  | { type: typeof SET_LYRICS; text: string | null }
  | { type: typeof RECEIVE_ALBUMS; albums: Album[] }
  | { type: typeof RECEIVE_ALBUM; album: Album }
  | { type: typeof RECEIVE_ARTISTS; artists: Artist[] }
  | { type: typeof RECEIVE_ARTIST; artist: Artist; albums: Album[]; songs: Song[] }
  | { type: typeof RECEIVE_PLAYLISTS; playlists: Playlist[] }
  | { type: typeof RECEIVE_PLAYLIST; playlist: Playlist }
  | { type: typeof RECEIVE_SONGS; songs: Song[] }
  | { type: typeof START_PLAYING }
  | { type: typeof STOP_PLAYING }
  | { type: typeof SET_CURRENT_SONG; song: Song }
  | { type: typeof SET_LIST; songList: Song[] }
  | { type: typeof SET_PROGRESS; progress: number };
