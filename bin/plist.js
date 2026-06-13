'use strict'

// A minimal parser for the subset of Apple's plist XML format used by the
// bundled `music.xml` iTunes library export. It replaces the unmaintained
// `itunes-library-stream` package (pinned forever at 0.0.0). The bundled file
// is small, so we parse it in one pass rather than streaming.
//
// Supported value types: dict, array, string, integer, real, true, false,
// date, data. dict -> plain object, array -> array, everything else -> a
// JS primitive/string.

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, '&') // decode last so we don't double-decode escaped entities
}

// classify(rawTag) -> { kind: 'open'|'close'|'selfclose', name: String }
function classify(raw) {
  const t = raw.trim()
  if (t.startsWith('/')) return { kind: 'close', name: t.slice(1).trim() }
  const selfClose = t.endsWith('/')
  const body = selfClose ? t.slice(0, -1).trim() : t
  return { kind: selfClose ? 'selfclose' : 'open', name: body.split(/\s+/)[0] }
}

function parsePlist(xml) {
  const body = xml
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!DOCTYPE[^>]*>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  // Tokenize into tags (`<...>`) and non-empty text runs.
  const tokens = []
  const re = /<([^>]+)>|([^<]+)/g
  let m
  while ((m = re.exec(body)) !== null) {
    if (m[1] !== undefined) tokens.push({ type: 'tag', raw: m[1] })
    else if (m[2].trim() !== '') tokens.push({ type: 'text', value: decodeEntities(m[2]) })
  }

  let pos = 0

  // readText: pos sits just after an opening tag. Read the optional text node
  // and consume the matching close tag.
  function readText() {
    let text = ''
    if (tokens[pos] && tokens[pos].type === 'text') text = tokens[pos++].value
    if (tokens[pos] && tokens[pos].type === 'tag' && classify(tokens[pos].raw).kind === 'close') pos++
    return text
  }

  function skipTo(name) {
    let depth = 1
    while (pos < tokens.length && depth > 0) {
      const tok = tokens[pos++]
      if (tok.type !== 'tag') continue
      const c = classify(tok.raw)
      if (c.kind === 'open' && c.name === name) depth++
      else if (c.kind === 'close' && c.name === name) depth--
    }
  }

  function parseValue() {
    const tok = tokens[pos++]
    const c = classify(tok.raw)

    switch (c.name) {
      case 'plist': {
        const value = parseValue()
        if (tokens[pos] && tokens[pos].type === 'tag' && classify(tokens[pos].raw).kind === 'close') pos++
        return value
      }
      case 'true':
        return true
      case 'false':
        return false
      case 'dict': {
        const obj = {}
        if (c.kind === 'selfclose') return obj
        while (pos < tokens.length) {
          const next = classify(tokens[pos].raw)
          if (next.kind === 'close' && next.name === 'dict') { pos++; break }
          pos++ // consume <key>
          const key = readText()
          obj[key] = parseValue()
        }
        return obj
      }
      case 'array': {
        const arr = []
        if (c.kind === 'selfclose') return arr
        while (pos < tokens.length) {
          const next = classify(tokens[pos].raw)
          if (next.kind === 'close' && next.name === 'array') { pos++; break }
          arr.push(parseValue())
        }
        return arr
      }
      case 'integer':
      case 'real':
        return c.kind === 'selfclose' ? 0 : Number(readText())
      case 'string':
      case 'date':
      case 'data':
        return c.kind === 'selfclose' ? '' : readText()
      default:
        if (c.kind === 'open') skipTo(c.name)
        return null
    }
  }

  return tokens.length ? parseValue() : null
}

module.exports = { parsePlist }
