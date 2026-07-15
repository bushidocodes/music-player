import type { Model } from 'sequelize';

// Serialize a model that has a `songs` association without leaking each song's
// `url` (its source file path / stream location). Sequelize's default toJSON
// plains nested songs straight from their dataValues, which bypasses
// Song#toJSON — so run the loaded Song instances back through their own toJSON,
// which strips `url`. See server/db/models/song.ts.
export function toJSONWithoutSongUrls(
  instance: Model
): Record<string, unknown> {
  const plain = instance.get({ plain: true }) as Record<string, unknown>;
  const songs = instance.get('songs') as Model[] | undefined;
  if (songs) {
    plain.songs = songs.map((song) => song.toJSON());
  }
  return plain;
}
