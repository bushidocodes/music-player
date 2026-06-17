import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import * as env from '../../env/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootPath = path.join(__dirname, '../../../');
const indexPath = path.join(rootPath, './public/index.html');
const faviconPath = path.join(rootPath, './browser/favicon.ico');

export default function (app) {
  app.setValue('env', env);
  app.setValue('projectRoot', rootPath);
  app.setValue('indexHTMLPath', indexPath);
  app.setValue('faviconPath', faviconPath);
  app.setValue('log', morgan('dev'));
}
