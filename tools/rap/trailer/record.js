// Record the Founders' Rap Battle from headless Chrome for the trailer.
//
//   node tools/rap/trailer/record.js <outdir> [secondsIntoProfG=24] [probe]
//
// Needs the dev server (python3 -m http.server 8934 in web/) and the test browser on :9333.
// Headless Chrome records no sound, so this records two things side by side:
//   frames/NNNNN.jpg + frames.json  -- the page's screencast, each frame with its timestamp
//   audio.json                      -- every audio element start/stop the game makes (file,
//                                      position in the file, volume, wall-clock time)
// tools/rap/trailer/mixdown.py rebuilds the soundtrack from audio.json on the same clock.
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require(path.join(__dirname, '../../test/node_modules/ws'));

const OUT = process.argv[2];
const PROFG_SECS = +(process.argv[3] || 24);
const PROBE = process.argv[4] === 'probe';
const W = 1920, H = 1080;

// For the recording only: the caption panel becomes a subtitle strip over the picture, so
// the scene fills the whole 16:9 frame (the crowd lives along its bottom edge).
const CSS = `
  body.cb-stage .game-frame > .panel{ position:absolute !important; left:7%; right:7%; bottom:3.5%; margin:0;
    background:rgba(8,5,14,.74) !important; border:0 !important; box-shadow:none !important; border-radius:8px;
    padding:14px 30px 16px !important; text-align:center; }
  body.cb-stage .game-frame > .panel .speaker{ color:#e0b458 !important; font-size:15px; letter-spacing:.3em; }
  body.cb-stage .game-frame > .panel .line{ color:#f6ecd6 !important; font-size:25px; line-height:1.38; }
  body.cb-stage .game-frame > .panel .choices, body.cb-stage .game-frame > .panel .choices-count{ display:none !important; }
`;
const HOOK = `(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const st = document.createElement('style'); st.textContent = ${JSON.stringify(CSS)}; document.head.appendChild(st);
    // subtitle size by length: a rapped line big, Tobi's long intros small
    setInterval(() => { const l = document.getElementById('hf_line'); if (!l) return;
      const n = l.textContent.length; l.style.fontSize = (n > 260 ? 17 : n > 140 ? 21 : 30) + 'px'; }, 50);
  });
  // blob URL -> blob size, so the mixdown can tell which bundle a blob was
  const blobs = window.__blobs = {};
  const mk = URL.createObjectURL.bind(URL);
  URL.createObjectURL = function(b){ const u = mk(b); try { blobs[u] = b.size; } catch(e){} return u; };
  const log = window.__audioLog = [];
  const now = () => performance.timeOrigin + performance.now();
  const seen = new WeakSet();
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function(){
    const el = this;
    if (!seen.has(el)){
      seen.add(el);
      el.addEventListener('playing', () => log.push({ ev:'start', t:now(), src:el.currentSrc || el.src, pos:el.currentTime, vol:el.volume, id:el.__id || (el.__id = Math.random().toString(36).slice(2)) }));
      const stop = () => log.push({ ev:'stop', t:now(), pos:el.currentTime, id:el.__id });
      el.addEventListener('pause', stop); el.addEventListener('ended', stop);
      el.addEventListener('volumechange', () => el.__id && log.push({ ev:'vol', t:now(), vol:el.volume, id:el.__id }));
    }
    return play.apply(this, arguments);
  };
})();`;

function get(p){ return new Promise((res, rej) => http.get({ host:'127.0.0.1', port:9333, path:p }, r => { let d=''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej)); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(path.join(OUT, 'frames'), { recursive:true });
  const t = (await get('/json/list')).find(x => x.type === 'page');
  const ws = new WebSocket(t.webSocketDebuggerUrl, { maxPayload: 512 * 1024 * 1024 });
  await new Promise(r => ws.on('open', r));
  let id = 0; const pending = new Map(); const frames = []; let recording = false; let n = 0;
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id:i, method, params })); });
  ws.on('message', m => {
    const msg = JSON.parse(m);
    if (msg.id && pending.has(msg.id)){ pending.get(msg.id)(msg); pending.delete(msg.id); return; }
    if (msg.method === 'Page.screencastFrame'){
      const { data, metadata, sessionId } = msg.params;
      send('Page.screencastFrameAck', { sessionId });
      if (!recording) return;
      const f = String(n++).padStart(5, '0') + '.jpg';
      fs.writeFileSync(path.join(OUT, 'frames', f), Buffer.from(data, 'base64'));
      frames.push({ f, t: metadata.timestamp * 1000 });
    }
  });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result && r.result.result && r.result.result.value; };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width:W, height:H, deviceScaleFactor:1, mobile:false });
  const hook = await send('Page.addScriptToEvaluateOnNewDocument', { source: HOOK });
  await send('Page.navigate', { url: 'http://localhost:8934/the-secret-of-the-codebook.html?play=rap' });
  for (let i = 0; i < 40 && !(await ev(`!![...document.querySelectorAll('button.choice')].find(b => /Start the rap/.test(b.textContent))`)); i++) await sleep(300);
  await sleep(1500);
  await send('Page.startScreencast', { format:'jpeg', quality:88, maxWidth:W, maxHeight:H, everyNthFrame:1 });
  await sleep(500);
  recording = true;
  await sleep(1500);                       // a moment of the Hall before the click
  await ev(`[...document.querySelectorAll('button.choice')].find(b => /Start the rap/.test(b.textContent)).click()`);
  if (PROBE){ await sleep(6000); }
  else {
    // the battle runs itself (each line waits for its audio); wait for Professor G's cutscene
    for (let i = 0; i < 600 && !(await ev(`!!document.getElementById('interlude')`)); i++) await sleep(500);
    await sleep(PROFG_SECS * 1000);
  }
  recording = false;
  await send('Page.stopScreencast');
  const audio = await ev(`JSON.stringify({ log: window.__audioLog, blobs: window.__blobs })`);
  fs.writeFileSync(path.join(OUT, 'frames.json'), JSON.stringify(frames));
  fs.writeFileSync(path.join(OUT, 'audio.json'), audio);
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: hook.result.identifier });
  await ev(`window.CODEBOOK_RAP_AUDIO && window.CODEBOOK_RAP_AUDIO.pause()`);
  const span = frames.length ? (frames[frames.length - 1].t - frames[0].t) / 1000 : 0;
  console.log(frames.length, 'frames over', span.toFixed(1), 's =', (frames.length / span).toFixed(1), 'fps;', JSON.parse(audio).log.length, 'audio events');
  process.exit(0);
})();
