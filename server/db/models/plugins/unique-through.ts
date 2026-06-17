import { DataTypes } from 'sequelize';

interface Identified {
  id: number;
}

interface ThroughDefinition {
  type: typeof DataTypes.VIRTUAL;
  // `this` is the Sequelize instance; its association columns are read by name
  // at runtime, so it stays `any` to remain assignable to Sequelize's attribute
  // getter — but the values derived from it are typed.
  get(this: any): Identified[];
}

export default function unique(deepColumn: string) {
  return {
    through(nearColumn: string): ThroughDefinition {
      const cacheKey = `._unique_${deepColumn}_through_${nearColumn}_`;
      return {
        type: DataTypes.VIRTUAL,
        get(this: any): Identified[] {
          if (this[cacheKey]) return this[cacheKey];
          const seen = new Set<number>();
          // The through association may not be eager-loaded (e.g. a plain
          // findAll), leaving this[nearColumn] undefined; treat it as empty.
          const nearModels = (this[nearColumn] ?? []) as Array<Record<string, unknown>>;
          const collection = nearModels
            .flatMap(near => (near[deepColumn] as unknown[]) ?? [])
            .filter((model): model is Identified => model !== null && typeof model === 'object')
            .filter(model => !seen.has(model.id) && seen.add(model.id));
          return (this[cacheKey] = collection.length ? collection : []);
        }
      };
    }
  };
}
