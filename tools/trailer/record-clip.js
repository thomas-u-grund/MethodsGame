// Record one scene of real gameplay for the trailer (author, 2026-10-01: "some actual in-game footage").
//
//   node tools/trailer/record-clip.js <scene> [seconds]      -> build/teaser/clips/<scene>.mp4
//
// Each scene in SCENES seeds a save, opens a room and plays the game to its moment, while the page's
// screencast is written as frames; ffmpeg turns them into a 30 fps clip on their own timestamps.
// Silent on purpose: the trailer's sound is mixed by teaser.py. Needs the dev server on :8934 and the
// test browser on :9333 (like the tests).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const WebSocket = require(path.join(__dirname, '../test/node_modules/ws'));

const ROOT = path.join(__dirname, '../..');
const OUT = path.join(ROOT, 'build/teaser/clips');
const W = 1920, H = 1080;
const U = 'http://localhost:8934/the-secret-of-the-codebook.html';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// save seeds and the moves that reach each moment; `go` runs in the page after the room is open
const ACT5 = { inventory:['folder','laserpointer','poster','contribution','readinglist','slip'], flags:{ corridorDone:true, slipSealed:true, h27issued:true,
  actIIIDone:true, actIVDone:true, resultHolds:true, act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true,
  labDone:true, writingDone:true, wrPosterGiven:true, cookNumber:true } };
const SCENES = {
  // the sampling ceremony: the drum turns, twelve balls drop
  sampling: { save:{ inventory:['question','folder'], flags:{ corridorDone:true, h27issued:true, ethicsDone:true, slipSealed:true, act2IntroSeen:true, act3IntroSeen:true, mnListIn:true, mnListChecked:true } },
    room:'The Mensa', go:`verb('Talk'); spot('herald');`, secs:9 },
  // the poster session: four people gather at board 312
  poster: { save:Object.assign({}, ACT5, { flags:Object.assign({}, ACT5.flags, { psPosterHung:true, psFeldGone:true }) }), room:'The Poster Session',
    go:`(async () => { for (let i = 0; i < 4; i++){ for (let t = 0; t < 200 && !window.CODEBOOK_PS_ANSWER_RIGHT(); t++) await w(100); await w(300); } })();`, secs:26 },
  // the keynote: lights down, Feldstrom walks on, his slides
  keynote: { save:Object.assign({}, ACT5, { flags:Object.assign({}, ACT5.flags, { psPosterHung:true, psFeldGone:true, postersDone:true }) }), room:'The Keynote', go:``, secs:62 },
  // the Significance Casino: three pulls, the third pays out DISCOVERY!
  casino: { save:{ inventory:['folder','slip','cleandata'], flags:{ corridorDone:true, slipSealed:true, h27issued:true, actIIIDone:true, act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, statsKeyUsed:true } },
    room:'Statistics Basement', go:`(async () => { for (let i = 0; i < 3; i++){ verb('Use'); spot('switches'); await w(2600); } })();`, secs:10 },
  // Reviewer 2: the battle, answered well
  reviewer2: { save:{ inventory:['folder'], flags:{ corridorDone:true, slipSealed:true, actIIIDone:true, actIVDone:true, act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true } },
    room:null, go:`(async () => { window.CODEBOOK_R2_BATTLE({}, function(){}); await w(2500);
      for (let i = 0; i < 4; i++){ window.CODEBOOK_R2_ANSWER_RIGHT(); await w(2600); } })();`, secs:14 },
};

function get(p){ return new Promise((res, rej) => http.get({ host:'127.0.0.1', port:9333, path:p }, r => { let d=''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej)); }

(async () => {
  const name = process.argv[2], sc = SCENES[name];
  if (!sc){ console.log('scenes:', Object.keys(SCENES).join(' ')); process.exit(1); }
  const secs = +(process.argv[3] || sc.secs);
  const dir = path.join(OUT, name); fs.rmSync(dir, { recursive:true, force:true }); fs.mkdirSync(dir, { recursive:true });
  const t = (await get('/json/list')).find(x => x.type === 'page');
  const ws = new WebSocket(t.webSocketDebuggerUrl, { maxPayload: 512 * 1024 * 1024 });
  await new Promise(r => ws.on('open', r));
  let id = 0; const pending = new Map(); const frames = []; let rec = false, n = 0;
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id:i, method, params })); });
  ws.on('message', m => {
    const msg = JSON.parse(m);
    if (msg.id && pending.has(msg.id)){ pending.get(msg.id)(msg); pending.delete(msg.id); return; }
    if (msg.method === 'Page.screencastFrame'){
      const { data, metadata, sessionId } = msg.params; send('Page.screencastFrameAck', { sessionId });
      if (!rec) return;
      const f = String(n++).padStart(5, '0') + '.jpg'; fs.writeFileSync(path.join(dir, f), Buffer.from(data, 'base64'));
      frames.push({ f, t: metadata.timestamp });
    }
  });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result && r.result.result && r.result.result.value; };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width:W, height:H, deviceScaleFactor:1, mobile:false });
  await send('Page.navigate', { url: U + '?cb=' + Date.now() }); await sleep(2500);
  await ev(`localStorage.setItem('codebook_save_v1', ${JSON.stringify(JSON.stringify(sc.save))}); localStorage.removeItem('cb_voiceonly');`);
  await send('Page.navigate', { url: U + '?cb=' + Date.now() }); await sleep(3000);
  await ev(`(async () => { const w = ms => new Promise(r => setTimeout(r, ms)); const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_START(); await w(700);
    for (let i = 0; i < 15 && document.getElementById('interlude'); i++){ document.dispatchEvent(new KeyboardEvent('keydown', { code:'Escape', key:'Escape', bubbles:true })); await w(400); }
    ${sc.room ? `[...document.querySelectorAll('button.campus-hotspot')].find(b => b.title.indexOf(${JSON.stringify(sc.room)}) === 0).click();` : ''} })()`);
  // just the painting and the action: no verbs, inventory, labels or dialogue strip
  await ev(`(() => { const st = document.createElement('style'); st.textContent = '.hud,.nameplate,.side-panel,.room-bar,.game-frame > .panel,.cb-toast,.cb-hint{display:none !important}'; document.head.appendChild(st); })()`);
  await sleep(1200);
  await send('Page.startScreencast', { format:'jpeg', quality:88, maxWidth:W, maxHeight:H, everyNthFrame:1 });
  rec = true;
  await ev(`(() => { window.w = ms => new Promise(r => setTimeout(r, ms));
    const p = ((document.querySelector('[id$="_sceneWrap"]') || {}).id || '').replace('_sceneWrap', '');
    window.verb = v => [...document.querySelectorAll('#' + p + '_verbGrid button')].find(b => new RegExp(v, 'i').test(b.textContent)).click();
    window.spot = id => document.querySelector('#' + p + '_sceneWrap [data-id="' + id + '"]').click(); ${sc.go} })()`);
  await sleep(secs * 1000);
  rec = false; await send('Page.stopScreencast');
  // frames on their own clock -> a 30 fps clip
  const list = frames.map((fr, i) => 'file ' + fr.f + '\nduration ' + Math.max(0.001, ((frames[i + 1] || { t: fr.t + 1 / 30 }).t - fr.t)).toFixed(4)).join('\n');
  fs.writeFileSync(path.join(dir, 'list.txt'), 'ffconcat version 1.0\n' + list + '\n');
  const out = path.join(OUT, name + '.mp4');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-vf', 'fps=30,scale=' + W + ':' + H + ':force_original_aspect_ratio=decrease,pad=' + W + ':' + H + ':(ow-iw)/2:(oh-ih)/2', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', out]);
  console.log(out, frames.length, 'frames');
  process.exit(0);
})();
