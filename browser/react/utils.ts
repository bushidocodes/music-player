import type { Song, Album, Stations } from './types';

interface ApiFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export async function apiFetch<T = unknown>(url: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const res = await fetch(url, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<T>;
}

export const convertSong = (song: Song): Song => {
  return { ...song, audioUrl: `/api/songs/${song.id}/audio` };
};

export const convertAlbum = (album: Album): Album => ({
  ...album,
  imageUrl: `/api/albums/${album.id}/image`,
  songs: album.songs.map(convertSong),
});

export const convertAlbums = (albums: Album[]): Album[] =>
  albums.map(album => convertAlbum(album));

const mod = (num: number, m: number): number => ((num % m) + m) % m;

export const skip = (
  interval: number,
  { currentSongList, currentSong }: { currentSongList: Song[]; currentSong: Partial<Song> }
): [Song, Song[]] => {
  let idx = currentSongList.map(song => song.id).indexOf(currentSong.id ?? -1);
  idx = mod(idx + interval, currentSongList.length);
  const next = currentSongList[idx];
  return [next, currentSongList];
};

export const generateStationsFromSongs = (songs: Song[]): Stations => {
  const resultObj: Stations = {};
  songs.forEach((song) => {
    const genre = String(song.genre);
    resultObj[genre] = resultObj[genre] || [];
    resultObj[genre].push(song);
  });
  return resultObj;
};
