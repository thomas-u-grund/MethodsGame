// Minimal CDP driver: connect to headless Chrome, eval expressions in the page.
const http = require('http');
const WebSocket = require('ws');

function get(path) {
  return new Promise((res, rej) => {
    http.get({ host: '127.0.0.1', port: 9333, path }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

async function connect(url) {
  const targets = await get('/json/list');
  let t = targets.find(x => x.type === 'page');
  const ws = new WebSocket(t.webSocketDebuggerUrl, { maxPayload: 256 * 1024 * 1024 });
  await new Promise(r => ws.on('open', r));
  let id = 0; const pending = new Map(); const logs = []; const errors = [];
  ws.on('message', m => {
    const msg = JSON.parse(m);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    if (msg.method === 'Runtime.consoleAPICalled')
      logs.push(msg.params.args.map(a => a.value !== undefined ? a.value : a.description).join(' '));
    if (msg.method === 'Runtime.exceptionThrown')
      errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  // Never let a test validate a cached asset. The page itself is loaded with a cache
  // buster, but sub-resources are not -- so a rebuilt voices-*.mp3 was still being
  // measured from the previous version, and test-audio reported an overrun that had
  // already been fixed on disk.
  await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
  // Wait for the game to be usable rather than for a fixed number of seconds. Every test
  // used to sleep 4-4.5s after each navigation "to be safe", which across 28 tests was
  // most of the suite's runtime; the page is normally ready in well under a second.
  const ready = async (timeoutMs = 9000) => {
    const t0 = Date.now();
    for (;;) {
      const ok = await evaluateRaw(`!!(window.CODEBOOK_START && window.CODEBOOK_VOICE_SPRITE && document.readyState === 'complete')`);
      if (ok) {
        // the tests drive the classic verb buttons; simple controls (8zx) are tested on their own
        if (!process.env.CB_SIMPLE) await evaluateRaw(`(function(){ try { localStorage.setItem('cb_controls','classic'); } catch(e){} if (window.CODEBOOK_SIMPLE_CONTROLS) window.CODEBOOK_SIMPLE_CONTROLS(); })()`);
        await new Promise(r => setTimeout(r, 120)); return true;
      }
      if (Date.now() - t0 > timeoutMs) return false;
      await new Promise(r => setTimeout(r, 60));
    }
  };
  const evaluateRaw = async expr => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    return r.result?.result?.value;
  };
  const goto = async u => { await send('Page.navigate', { url: u }); return ready(); };
  if (url) { await send('Page.navigate', { url }); await ready(); }
  const evaluate = async expr => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
    return r.result?.result?.value;
  };
  return { send, evaluate, ready, goto, logs, errors, close: () => ws.close() };
}

module.exports = { connect };
