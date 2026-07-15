type PlistValue =
  | string
  | number
  | boolean
  | null
  | PlistValue[]
  | { [k: string]: PlistValue };

type Token = { type: 'tag'; raw: string } | { type: 'text'; value: string };

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
      String.fromCodePoint(parseInt(h, 16))
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, '&'); // decode last so we don't double-decode escaped entities
}

// classify(rawTag) -> { kind: 'open'|'close'|'selfclose', name: String }
function classify(raw: string): {
  kind: 'open' | 'close' | 'selfclose';
  name: string;
} {
  const t = raw.trim();
  if (t.startsWith('/')) return { kind: 'close', name: t.slice(1).trim() };
  const selfClose = t.endsWith('/');
  const body = selfClose ? t.slice(0, -1).trim() : t;
  return { kind: selfClose ? 'selfclose' : 'open', name: body.split(/\s+/)[0] };
}

export function parsePlist(xml: string): PlistValue {
  let body = xml.replace(/<\?xml[^>]*\?>/g, '').replace(/<!DOCTYPE[^>]*>/g, '');

  // Loop until stable: a single lazy pass can leave `<!--` behind when
  // comments are adjacent (e.g. `<!--a--><!--b` strips the first but not the
  // second opener). Repeating until idempotent closes that gap.
  let prev: string;
  do {
    prev = body;
    body = body.replace(/<!--[\s\S]*?-->/g, '');
  } while (body !== prev);

  const tokens: Token[] = [];
  const re = /<([^>]+)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    if (m[1] !== undefined) tokens.push({ type: 'tag', raw: m[1] });
    else if (m[2].trim() !== '')
      tokens.push({ type: 'text', value: decodeEntities(m[2]) });
  }

  let pos = 0;

  function readText(): string {
    let text = '';
    const cur = tokens[pos];
    if (cur && cur.type === 'text')
      text = (tokens[pos++] as { type: 'text'; value: string }).value;
    const next = tokens[pos];
    if (next && next.type === 'tag' && classify(next.raw).kind === 'close')
      pos++;
    return text;
  }

  function skipTo(name: string): void {
    let depth = 1;
    while (pos < tokens.length && depth > 0) {
      const tok = tokens[pos++];
      if (tok.type !== 'tag') continue;
      const c = classify(tok.raw);
      if (c.kind === 'open' && c.name === name) depth++;
      else if (c.kind === 'close' && c.name === name) depth--;
    }
  }

  function parseValue(): PlistValue {
    const tok = tokens[pos++] as { type: 'tag'; raw: string };
    const c = classify(tok.raw);

    switch (c.name) {
      case 'plist': {
        const value = parseValue();
        const next = tokens[pos];
        if (next && next.type === 'tag' && classify(next.raw).kind === 'close')
          pos++;
        return value;
      }
      case 'true':
        return true;
      case 'false':
        return false;
      case 'dict': {
        const obj: { [k: string]: PlistValue } = {};
        if (c.kind === 'selfclose') return obj;
        while (pos < tokens.length) {
          const next = classify(
            (tokens[pos] as { type: 'tag'; raw: string }).raw
          );
          if (next.kind === 'close' && next.name === 'dict') {
            pos++;
            break;
          }
          pos++; // consume <key>
          const key = readText();
          obj[key] = parseValue();
        }
        return obj;
      }
      case 'array': {
        const arr: PlistValue[] = [];
        if (c.kind === 'selfclose') return arr;
        while (pos < tokens.length) {
          const next = classify(
            (tokens[pos] as { type: 'tag'; raw: string }).raw
          );
          if (next.kind === 'close' && next.name === 'array') {
            pos++;
            break;
          }
          arr.push(parseValue());
        }
        return arr;
      }
      case 'integer':
      case 'real':
        return c.kind === 'selfclose' ? 0 : Number(readText());
      case 'string':
      case 'date':
      case 'data':
        return c.kind === 'selfclose' ? '' : readText();
      default:
        if (c.kind === 'open') skipTo(c.name);
        return null;
    }
  }

  return tokens.length ? parseValue() : null;
}
