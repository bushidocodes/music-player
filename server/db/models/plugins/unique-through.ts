import { DataTypes } from 'sequelize';

interface ThroughDefinition {
  type: typeof DataTypes.VIRTUAL;
  get(this: any): unknown[];
}

export default function unique(deepColumn: string) {
  return {
    through(nearColumn: string): ThroughDefinition {
      return {
        type: DataTypes.VIRTUAL,
        get(this: any): unknown[] {
          const key = `._unique_${deepColumn}_through_${nearColumn}_`;
          if (this[key]) return this[key] as unknown[];
          const seen = new Set<number>();
          // The through association may not be eager-loaded (e.g. a plain
          // findAll), leaving this[nearColumn] undefined; treat it as empty.
          const collection = ((this[nearColumn] as Record<string, unknown>[]) || [])
            .flatMap(obj => obj[deepColumn] as Record<string, unknown>)
            .filter(item => item !== null && typeof item === 'object')
            .filter((model: any) => !seen.has(model.id) && seen.add(model.id));
          if (!collection.length) return (this[key] = []);
          return (this[key] = collection);
        }
      };
    }
  };
}
