// The Keynote's first half is the laser-pointer duel (author, 2026-09-28): entering the Keynote opens
// web/duel/ full screen; the duel runs on its own; a win hands back to the room at slide 23.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder','pen','laserpointer'], flags:{ corridorDone:true, slipSealed:true,
    actIIIDone:true, actIVDone:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true, labDone:true, writingDone:true, postersDone:true } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const until = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms){ if (fn()) return true; await w(100); } return false; };
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_LINES_CUT = true; window.__duelAuto = true;   // the old, quick line timing for the test
    const out = {};
    window.CODEBOOK_KN_SPEED = 0.05; window.CODEBOOK_KN_NO_CUTAWAY = true;
    window.CODEBOOK_START(); await w(700);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /^The Keynote Showdown/.test(b.title)).click();
    out.duelOpens = await until(() => !!document.getElementById('kn_duel'), 8000);
    const f = document.getElementById('kn_duel');
    out.duelLoads = await until(() => { try { return !!f.contentDocument.getElementById('stage'); } catch(e){ return false; } }, 8000);
    out.inGame = await until(() => f.contentDocument.body.classList.contains('ingame'), 3000);
    out.speaks = await until(() => (f.contentDocument.getElementById('line') || {}).textContent, 8000);
    window.CODEBOOK_KN_DUEL_WIN(); await w(400);
    out.handedBack = !document.getElementById('kn_duel') && !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.knDuelWon;
    // no coda any more (2026-10-01): the duel hands straight on to Stockholm
    out.coda = true;
    out.stockholm = await until(() => /STOCKHOLM/.test((document.getElementById('kn_screen') || {}).textContent || ''), 20000);
    out.profChoice = await until(() => [...document.querySelectorAll('#kn_choices button')].some(b => /rather have the part/.test(b.textContent)), 20000);
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && Object.values(r).every(v => !!v) && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
