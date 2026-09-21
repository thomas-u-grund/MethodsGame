// ROADMAP 8k. The Accelerator zooms in and becomes a mini-game whose whole point is that
// two needles move in opposite directions: the grander the claim, the lower THINGS THIS
// FORBIDS and the more delighted Feldstrom is. This asserts that inversion holds, because
// if the gauge ever rose with the claim the room would be teaching the opposite lesson.
//
// It also guards the thing the mini-game must NOT break: while Feldstrom is in the room the
// sound setting cannot be lodged, so the real scoping still has to happen later in an empty
// workshop via the enrolment register.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder','enrolreg'],
    flags:{ corridorDone:true, act2IntroSeen:true, act3IntroSeen:true, actRenumberMigrated:true,
            wsExtension:true,
            predictionSlip:{ junk:0, mechanism:'Students encounter worked examples.', mechanismSound:true } }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await sleep(4300);

  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const out = {};
    window.CODEBOOK_START(); await w(1400);
    const il = document.getElementById('interlude'); if (il) il.remove();
    [...document.querySelectorAll('button.campus-hotspot')].find(x => x.title.indexOf("Feldstrom's Workshop") === 0).click();
    await w(1900);
    [...document.querySelectorAll('#ws_verbGrid button')].find(b => /^use$/i.test(b.textContent.trim())).click();
    document.querySelector('#ws_sceneWrap [data-id="machine"]').click();
    await w(900);

    out.opened = !!document.getElementById('ws_acc');
    const n = () => Number(document.getElementById('ws_accN').textContent);
    const feld = () => document.getElementById('ws_accFeld').textContent;
    const strip = () => document.getElementById('ws_accStrip').textContent;
    const rights = [...document.querySelectorAll('.acc-crank')].filter(b => b.dataset.dir === '1');
    const lefts  = [...document.querySelectorAll('.acc-crank')].filter(b => b.dataset.dir === '-1');

    // Climb the population drum one notch at a time and record the gauge each time.
    out.curve = [n()];
    out.feldStart = feld();
    for (let i = 0; i < 5; i++){ rights[0].click(); await w(160); out.curve.push(n()); }

    // Everything to maximum: the biggest claim the machine can make forbids nothing.
    for (const b of rights) for (let i = 0; i < 6; i++){ b.click(); await w(70); }
    await w(400);
    out.maxForbids = n();
    out.maxStrip = strip();
    out.maxFeld = feld();

    // Wind it all the way back down while he is standing here: he turns it back up.
    for (const b of lefts) for (let i = 0; i < 6; i++){ b.click(); await w(70); }
    await w(1600);
    out.afterPushBack = { forbids: n(), said: feld() };

    // The register is still refused while he is in the room.
    document.getElementById('ws_accReg').click(); await w(400);
    out.registerRefused = /CONTEXT|INCONVENIENT/i.test(strip() + feld());

    // Lodging goes in as the junk scope, exactly as the old menu did.
    document.getElementById('ws_accLodge').click(); await w(900);
    const f = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    out.closed = !document.getElementById('ws_acc');
    out.inflated = !!f.wsInflated;
    out.scopeUnsound = !!(f.predictionSlip && f.predictionSlip.scope && f.predictionSlip.scopeSound === false);
    out.notScoped = !f.wsScoped;
    return out;
  })()`);

  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);

  // The gauge must never rise as the claim grows, must start high and end at nothing.
  const monotonic = r && r.curve.every((v, i, a) => i === 0 || v <= a[i-1]);
  const ok = r && r.opened && monotonic && r.curve[0] === 47 && r.maxForbids === 0 &&
             /CIVILISATION IS TRAFFIC/.test(r.maxStrip) && /glasses/i.test(r.maxFeld) &&
             r.afterPushBack.forbids > 0 && /does not help/i.test(r.afterPushBack.said) &&
             r.registerRefused && r.closed && r.inflated && r.scopeUnsound && r.notScoped &&
             !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
