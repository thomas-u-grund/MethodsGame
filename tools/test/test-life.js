// ROADMAP 8p: character movement must not read as machinery.
//
// The old system was a single two-keyframe `alternate` loop per sprite, which gave four
// failures at once. This test asserts that none of them can come back:
//
//   1. no lockstep       -- every sprite has its own phase and its own tempo
//   2. no metronome      -- the talk curve swings BOTH ways within one cycle, which a
//                           two-keyframe alternate loop cannot do
//   3. no snap           -- a character settles back to neutral after its clip ends
//   4. pivots at the top -- talking rotates about the shoulders, not the soles
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder'],
    flags:{ corridorDone:true, slipSealed:true, h27issued:true, actIIIDone:true, actIVDone:true,
            act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();

  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_START(); await w(600);
    // The Ethics Tribunal has the biggest cast in one shot, which is where lockstep showed.
    const b = [...document.querySelectorAll('button.campus-hotspot')].find(x => x.title.indexOf('The Ethics Tribunal') === 0);
    if (!b) return { err:'no tribunal on the map' };
    b.click(); await w(1500);
    const els = [...document.querySelectorAll('#et_sceneWrap [data-voice], #eth_sceneWrap [data-voice]')]
      .filter(e => getComputedStyle(e).display !== 'none');
    if (els.length < 2) return { err:'expected a crowd, found ' + els.length };

    const out = { n: els.length };
    out.unstamped = els.filter(e => !e.dataset.cbLife).length;
    // 1. distinct phases and distinct tempos. KIRA has no idle animation at all, so only
    //    compare the sprites that actually breathe.
    const living = els.filter(e => getComputedStyle(e).animationDuration !== '0s');
    out.living = living.length;
    out.phases = new Set(living.map(e => getComputedStyle(e).animationDelay)).size;
    out.tempos = new Set(living.map(e => getComputedStyle(e).animationDuration)).size;

    // 2. the talk curve reverses direction inside one cycle
    const t = els[0];
    out.idleRotate = getComputedStyle(t).rotate;
    out.idleOrigin = getComputedStyle(t).transformOrigin;
    t.classList.add('talking');
    await w(30);
    out.talkOrigin = getComputedStyle(t).transformOrigin;
    const deg = [];
    for (let i = 0; i < 14; i++) { await w(60); deg.push(parseFloat(getComputedStyle(t).rotate) || 0); }
    out.maxDeg = Math.max(...deg.map(Math.abs));
    out.wentPositive = deg.some(d => d > 0.02);
    out.wentNegative = deg.some(d => d < -0.02);
    // direction reversals: a sine from a 2-keyframe alternate loop gives few, an uneven
    // multi-beat curve gives several
    let flips = 0;
    for (let i = 2; i < deg.length; i++) {
      const a = deg[i-1] - deg[i-2], c = deg[i] - deg[i-1];
      if (a * c < 0 && Math.abs(a) > 0.01 && Math.abs(c) > 0.01) flips++;
    }
    out.flips = flips;

    // 3. it settles rather than freezing (this is what setTalking() does on clip end)
    t.classList.remove('talking'); t.classList.add('talk-out');
    await w(400);
    out.settled = Math.abs(parseFloat(getComputedStyle(t).rotate) || 0) < 0.02;
    t.classList.remove('talk-out');
    return out;
  })()`);

  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && !r.err
    && r.unstamped === 0
    && r.living >= 2 && r.phases === r.living && r.tempos === r.living
    && r.idleOrigin !== r.talkOrigin           // talking pivots higher up than standing
    && r.wentPositive && r.wentNegative        // both directions inside one cycle
    && r.flips >= 2                            // and more than a sine's worth of turns
    && r.maxDeg > 0.05 && r.maxDeg < 3         // moving, but still nowhere near hectic
    && r.settled
    && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
