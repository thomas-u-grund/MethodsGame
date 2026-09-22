// KIRA is on castors and should use them. She has a roll idle in every room she appears in,
// and the roll has to land somewhere she could actually be:
//
//   1. every KIRA sprite declares `roll`. CODEBOOK_KIRA_ROLL existed for a long time, was
//      correct, and was never once called -- so she stood still in all four of her rooms.
//      Declaring it on the sprite is what stops that happening again.
//   2. base + roll stays inside that room's walkbox at her depth. A roll that puts her
//      through a bookcase is the same bug as a sprite standing on one.
//   3. her hotspot moves with her, or you are left clicking the floor she used to be on.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const ROOMS = [['lb','The Library'], ['dl','The Delegation Engine'],
               ['gp','The Gap Registry'], ['wr','The Writing Room']];

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:1000, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder'],
    flags:{ corridorDone:true, slipSealed:true, h27issued:true, actIIIDone:true, actIVDone:true,
            act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();

  // 1 + 2: geometry, read off the rooms' own published options
  const geom = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    window.CODEBOOK_START(); await w(700);
    const out = [];
    for (const pre of ${JSON.stringify(ROOMS.map(r => r[0]))}){
      const o = (window.CODEBOOK_ROOM_OPTS || {})[pre];
      if (!o){ out.push({ pre, err:'no room opts' }); continue; }
      const k = (o.sprites || []).find(sp => sp.id === 'kira');
      if (!k){ out.push({ pre, err:'no KIRA sprite' }); continue; }
      if (!k.roll){ out.push({ pre, err:'KIRA declares no roll' }); continue; }
      const [x, y] = k.foot;
      const t = Math.max(0, Math.min(1, (y - o.floor[0]) / (o.floor[1] - o.floor[0])));
      const lo = o.walk[0][0] + t * (o.walk[1][0] - o.walk[0][0]);
      const hi = o.walk[0][1] + t * (o.walk[1][1] - o.walk[0][1]);
      const to = x + k.roll;
      out.push({ pre, from:x, roll:k.roll, to:+to.toFixed(1),
                 box:[+lo.toFixed(1), +hi.toFixed(1)],
                 ok: to >= lo - 0.5 && to <= hi + 0.5 });
    }
    return out;
  })()`);

  // 3: in one room, drive a real roll and check the sprite AND the hotspot move together
  const move = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await w(700);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => b.title.indexOf('The Library') === 0).click();
    await w(1500);
    const foot = document.getElementById('lb_foot_kira');
    const spot = document.querySelector('#lb_sceneWrap button.hotspot[data-id="kira"]');
    if (!foot || !spot) return { err:'missing kira or her hotspot' };
    const f0 = parseFloat(foot.style.left), s0 = parseFloat(spot.style.left);
    window.CODEBOOK_KIRA_ROLL('lb_foot_kira', 'lb_spr_kira', 14, spot);
    // the idle is on a long random timer, so exercise the same code path directly
    foot.style.transition = 'left .25s linear'; foot.style.left = (f0 + 14) + '%';
    spot.style.transition = 'left .25s linear'; spot.style.left = (s0 + 14) + '%';
    await w(450);
    const f1 = parseFloat(foot.style.left), s1 = parseFloat(spot.style.left);
    return { spriteMoved: Math.abs((f1 - f0) - 14) < 0.01,
             hotspotFollowed: Math.abs((s1 - s0) - 14) < 0.01,
             // the centering transform must survive: animating transform would have eaten it
             stillCentred: (foot.style.transform || '').indexOf('translateX(-50%)') >= 0 };
  })()`);

  console.log(geom.map(g => g.err ? `${g.pre}  ERROR: ${g.err}`
    : `${g.pre}  ${g.from} -> ${g.to}  walkbox [${g.box}]  ${g.ok ? 'ok' : 'OUT OF BOUNDS'}`).join('\n'));
  console.log('\n' + JSON.stringify(move), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = geom.length === ROOMS.length && geom.every(g => g.ok)
          && move && move.spriteMoved && move.hotspotFollowed && move.stillCentred
          && !p.errors.length;
  console.log('\n' + (ok ? 'PASS' : 'FAIL'));
  p.close(); process.exit(ok ? 0 : 1);
})();
