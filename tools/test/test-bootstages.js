// Staged boot loading. On a slow line, "Click to begin" must not wait for the whole act:
//
//   1. with the network throttled, #bootBegin appears once the trailer's own assets are in,
//      while voices-act1.mp3 (the biggest Act I file) is still not downloaded;
//   2. the trailer plays, and Escape (ending it before the act is in) does NOT start the
//      game: the splash stays, showing a "Loading Act I" bar;
//   3. once the network is back, the act finishes and the game starts on its own.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(null);
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:1000, deviceScaleFactor:1, mobile:false });
  // ~1.5 MB/s: the trailer (~3 MB) in a couple of seconds, Act I (~30 MB) in far longer.
  await p.send('Network.emulateNetworkConditions', { offline:false, latency:20,
    downloadThroughput: 1.5 * 1024 * 1024, uploadThroughput: 1024 * 1024 });
  await p.send('Page.navigate', { url: U + Date.now() });

  const w = ms => new Promise(r => setTimeout(r, ms));
  const ev = async e => (await p.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
  await ev(`localStorage.removeItem('codebook_save_v1'), 0`);

  const out = {};
  const t0 = Date.now();
  let begin = false;
  for (let i = 0; i < 200 && !begin; i++){
    await w(150);
    begin = await ev(`!!document.querySelector('#bootBegin.show')`);
  }
  out.beginAfterMs = Date.now() - t0;
  out.beginShown = begin;
  out.act1VoicesPendingAtBegin = await ev(`!performance.getEntriesByType('resource').some(e => /voices-act1\\.mp3/.test(e.name) && e.responseEnd > 0)`);

  // Start the trailer, then end it early.
  await ev(`document.getElementById('bootSplash').click(), 0`);
  await w(1500);
  await ev(`window.dispatchEvent(new KeyboardEvent('keydown', { code:'Escape', key:'Escape', bubbles:true })), document.dispatchEvent(new KeyboardEvent('keydown', { code:'Escape', key:'Escape', bubbles:true })), 0`);
  await w(800);
  out.splashHeld = await ev(`!!document.getElementById('bootSplash')`);
  out.barLabel = await ev(`(document.querySelector('#bootSplash .cb-load:not(.hide) .lbl') || {}).textContent || ''`);

  // Network back: the act lands and the game starts by itself.
  await p.send('Network.emulateNetworkConditions', { offline:false, latency:0, downloadThroughput:-1, uploadThroughput:-1 });
  let started = false;
  for (let i = 0; i < 200 && !started; i++){ await w(200); started = await ev(`!document.getElementById('bootSplash')`); }
  out.startedAfterLoad = started;

  await ev(`localStorage.removeItem('codebook_save_v1'), 0`);
  console.log(JSON.stringify(out, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = out.beginShown && out.act1VoicesPendingAtBegin && out.splashHeld && /Loading Act I/.test(out.barLabel)
          && out.startedAfterLoad && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  process.exit(ok ? 0 : 1);
})();
