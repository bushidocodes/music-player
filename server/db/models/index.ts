import Album from './album.js';
import Artist from './artist.js';
import Playlist from './playlist.js';
import Song from './song.js';

Song.belongsTo(Album);
Album.hasMany(Song);
Album.belongsTo(Artist);

Artist.belongsToMany(Song, { through: 'artistSong' });
Song.belongsToMany(Artist, { through: 'artistSong' });

Song.belongsToMany(Playlist, { through: 'playlistSong' });
Playlist.belongsToMany(Song, { through: 'playlistSong' });

export { Album, Artist, Playlist, Song };
