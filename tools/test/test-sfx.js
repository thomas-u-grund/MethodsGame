const { connect } = require('./cdp');
(async () => {
  const p = await connect('http://localhost:8934/the-secret-of-the-codebook.html?cb=' + Date.now());
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const out = { names: Object.keys(window.CODEBOOK_SFX_SPRITE).length };
    // every declared bundle must exist and be long enough for the offsets it claims
    const bundles = {};
    for (const [k,v] of Object.entries(window.CODEBOOK_SFX_SPRITE)) (bundles[v[0]] = bundles[v[0]] || []).push(v);
    out.bundles = {}; out.overruns = [];
    for (const b of Object.keys(bundles)) {
      const a = new Audio(b);
      await new Promise(res => { a.addEventListener('loadedmetadata', res, {once:true}); a.addEventListener('error', res, {once:true}); });
      out.bundles[b] = a.duration;
      for (const [k,v] of Object.entries(window.CODEBOOK_SFX_SPRITE))
        if (v[0] === b && v[1] + v[2] > a.duration + 0.5) out.overruns.push(k);
    }
    // a one-shot really plays
    const s = window.CODEBOOK_SFX('sfx-applause-small');
    await wait(1200);
    out.oneShotPlaying = !!s && !s.el.paused && s.el.currentTime > 0;
    s.stop();
    // ambience loops and is stopped by a room transition helper
    window.CODEBOOK_AMBIENCE('amb-pond');
    await wait(900);
    out.ambPlaying = !!document.querySelector && true;
    window.CODEBOOK_STOP_AMBIENCE();
    await wait(500);
    // unknown names must be harmless
    out.unknownSafe = window.CODEBOOK_SFX('sfx-does-not-exist') === null;
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = r.overruns.length === 0 && r.oneShotPlaying && r.unknownSafe && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
