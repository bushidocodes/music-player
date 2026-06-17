interface LogFn {
  (pieces: TemplateStringsArray, ...cooked: unknown[]): void;
}

interface Log extends LogFn {
  hush: () => void;
  debug: LogFn;
  error: LogFn;
}

const log = ((pieces: TemplateStringsArray, ...cooked: unknown[]): void => {
  console.log(interp(pieces, cooked));
}) as Log;

log.hush = () => void 0;

log.debug = log.hush;
log.error = function (pieces: TemplateStringsArray, ...cooked: unknown[]): void {
  console.error(interp(pieces, cooked));
};

function interp(pieces: TemplateStringsArray, cooked: unknown[]): string {
  return pieces.map((p, i) => `${p}${i < cooked.length ? cooked[i] : ''}`).join('');
}

export default log;
