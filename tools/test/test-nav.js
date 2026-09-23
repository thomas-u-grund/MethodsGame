// ROADMAP 8t: click-to-walk with real pathfinding, proved in the Library.
//
// The room's walkbox used to be a trapezoid, because a character who never moves only has
// to be clamped, not routed. Once he walks, the furniture has to exist. This asserts the
// three things that separate a pathfinder from a straight line:
//
//   1. it goes AROUND      -- a goal behind the card catalogue costs more than the direct
//                             line, and the walk never passes through the cabinet
//   2. it goes STRAIGHT    -- open floor is still one leg, not a scenic tour
//   3. nothing is stranded -- every standable point on the floor routes both ways
//
// 3 is the one that caught the real bugs. The first build returned null for every route
// needing a detour: waypoints were raw furniture corners, which sit exactly ON a boundary
// where an inside/outside test is a coin-flip, and half of them lay off the floor entirely
// because furniture is painted past the frame.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?room=library&cb=';

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:1000, deviceScaleFactor:1, mobile:false });
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();

  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    window.CODEBOOK_START(); await w(1800);
    const wrap = document.getElementById('lb_sceneWrap');
    if (!wrap) return { err: 'the Library did not open' };
    const pc = wrap.querySelector('.pc-avatar');
    if (!pc) return { err: 'no player avatar' };
    const nav = window.CODEBOOK_LIB_NAV;
    if (!nav) return { err: 'the room published no navigation mesh' };

    const out = {};
    const D = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const foot = () => { const pr = wrap.getBoundingClientRect(), ar = pc.getBoundingClientRect();
      return { x: (ar.left + ar.width/2 - pr.left) / pr.width * 100,
               y: (ar.bottom - pr.top) / pr.height * 100 }; };
    const clickAt = (xp, yp) => { const r = wrap.getBoundingClientRect();
      wrap.dispatchEvent(new MouseEvent('click', { bubbles: true,
        clientX: r.left + r.width * xp/100, clientY: r.top + r.height * yp/100 })); };
    const len = legs => { let L = 0, c = foot(); legs.forEach(q => { L += D(c, q); c = q; }); return L; };

    // 1. around the card catalogue, and never through it
    const start = foot();
    const legs = window.CODEBOOK_NAV_PATH(nav, start, { x: 17, y: 72 });
    out.detourLegs = legs ? legs.length : 0;
    out.detour = legs ? +len(legs).toFixed(1) : null;
    out.direct = +D(start, { x: 17, y: 72 }).toFixed(1);
    clickAt(17, 72);
    const trail = [];
    for (let i = 0; i < 26; i++) { await w(160); trail.push(foot()); }
    out.arrived = { x: +trail[trail.length-1].x.toFixed(1), y: +trail[trail.length-1].y.toFixed(1) };
    // the raw (ungrown) card catalogue -- he must never be standing inside it
    out.throughFurniture = trail.some(q => q.x > 21 && q.x < 43.8 && q.y > 60 && q.y < 87.5);

    // 2. open floor stays a straight line
    const a = { x: 30, y: 92 }, b = { x: 66, y: 92 };
    const open = window.CODEBOOK_NAV_PATH(nav, a, b);
    out.openLegs = open ? open.length : 0;

    // 3. nothing on the floor is stranded, in either direction
    const cells = [];
    for (let x = 5; x <= 95; x += 1) for (let y = 64; y <= 98; y += 1)
      if (window.CODEBOOK_NAV_OK(nav, x, y)) cells.push({ x: x, y: y });
    out.standable = cells.length;
    const hub = { x: 68, y: 92 };
    out.stranded = cells.filter(c => !window.CODEBOOK_NAV_PATH(nav, hub, c)).length;
    out.strandedBack = cells.filter(c => !window.CODEBOOK_NAV_PATH(nav, c, hub)).length;

    // 4. clicking a cabinet walks to the floor in front of it, not into it
    const snap = window.CODEBOOK_NAV_SNAP(nav, 32, 75);
    out.snappedOffFurniture = !!snap && window.CODEBOOK_NAV_OK(nav, snap.x, snap.y);
    return out;
  })()`);

  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = r && !r.err
    && r.detourLegs >= 2                        // it took a corner
    && r.detour > r.direct * 1.1                // and paid for it
    && !r.throughFurniture                      // without walking through the cabinet
    && Math.abs(r.arrived.x - 17) < 2 && Math.abs(r.arrived.y - 72) < 2
    && r.openLegs === 1                         // open floor is still one straight leg
    && r.standable > 500 && r.stranded === 0 && r.strandedBack === 0
    && r.snappedOffFurniture
    && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
