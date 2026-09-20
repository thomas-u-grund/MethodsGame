const { connect } = require('./cdp');
(async () => {
  const p = await connect('http://localhost:8934/the-secret-of-the-codebook.html?cb=' + Date.now());
  const r = await p.evaluate(`(async () => {
    const out = {};
    const t0 = performance.now();
    await new Promise(res => window.CODEBOOK_PRELOAD(['voices-act3.mp3'], null, res));
    out.preloadMs = Math.round(performance.now() - t0);
    const t1 = performance.now();
    const snd = window.CODEBOOK_VOICE('vo-director-0b041277.mp3');
    const done = new Promise(res => snd.addEventListener('ended', () => res(Math.round(performance.now()-t1))));
    await snd.play();
    out.firstLineMs = await Promise.race([done, new Promise(r2 => setTimeout(() => r2(null), 12000))]);
    return out;
  })()`);
  console.log(JSON.stringify(r), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = r.firstLineMs !== null && r.firstLineMs < 6000 && !p.errors.length;
  console.log(ok ? 'PASS — first line after preload is prompt' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
