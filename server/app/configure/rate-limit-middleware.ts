import { rateLimit } from 'express-rate-limit';
import type { ConfiguredApp } from '../types.js';

export default function (app: ConfiguredApp) {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 500,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    }),
  );
}
