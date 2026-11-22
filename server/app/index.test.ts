import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import db from '../db/db.js';
import app from './index.js';

let server: Server;
let baseUrl: string;
let tmpDir: string;

beforeAll(async () => {
  tmpDir = await mkdtemp(path.join(os.tmpdir(), 'juke-spa-'));
  const indexPath = path.join(tmpDir, 'index.html');
  await writeFile(
    indexPath,
    '<!doctype html><title>Juke</title><div id="app">spa</div>\n'
  );
  app.set('indexHTMLPath', indexPath);

  server = createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('failed to bind test server');
  }
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  await db.close();
  await rm(tmpDir, { recursive: true, force: true });
});

describe('SPA fallback', () => {
  it('serves index.html for a deep client route', async () => {
    const res = await fetch(`${baseUrl}/albums/42`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/html/);
    expect(await res.text()).toContain('<div id="app">spa</div>');
  });
});
