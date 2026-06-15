import Sequelize from 'sequelize';

export default function unique(deepColumn) {
  return {
    through(nearColumn) {
      return {
        type: Sequelize.VIRTUAL,
        get() {
          const key = `._unique_${deepColumn}_through_${nearColumn}_`;
          if (this[key]) return this[key];
          const seen = new Set();
          const collection = this[nearColumn]
            .flatMap(obj => obj[deepColumn])
            .filter(item => item !== null && typeof item === 'object')
            .filter(model => !seen.has(model.id) && seen.add(model.id));
          if (!collection.length) return this[key] = [];
          return this[key] = collection;
        }
      };
    }
  };
}
