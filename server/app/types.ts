import type { Application } from 'express';

// configure/index.ts attaches setValue/getValue helpers onto the Express app
// (thin wrappers over app.set/app.get). Model the augmented app explicitly.
export interface ConfiguredApp extends Application {
  setValue(key: string, value: unknown): void;
  getValue(key: string): any;
}
