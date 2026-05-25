export const convertSong = (song) => {
  return { ...song, audioUrl: `/api/songs/${song.id}/audio` };
};

export const convertAlbum = (album) => {
  album.imageUrl = `/api/albums/${album.id}/image`;
  album.songs = album.songs.map(convertSong);
  return album;
};

export const convertAlbums = (albums) =>
  albums.map(album => convertAlbum(album));

const mod = (num, m) => ((num % m) + m) % m;

export const skip = (interval, {currentSongList, currentSong}) => {
  let idx = currentSongList.map(song => song.id).indexOf(currentSong.id);
  idx = mod(idx + interval, currentSongList.length);
  const next = currentSongList[idx];
  return [next, currentSongList];
};

export const generateStationsFromSongs = (songs) => {
  let resultObj = {};
  songs.forEach((song) => {
    resultObj[song.genre] = resultObj[song.genre] || [];
    resultObj[song.genre].push(song);
  })
  return resultObj;
}
