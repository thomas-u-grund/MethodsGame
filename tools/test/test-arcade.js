// PAC-SOC (author, 2026-09-29): the arcade cabinet in the Significance Casino opens a full-screen
// Pac-Man whose ghosts are the founders; it plays, scores, clears a level, and Esc closes it.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder'], flags:{ corridorDone:true, h27issued:true, slipSealed:true, act3IntroSeen:true,
    surveyDone:true, ethicsDone:true, mensaDone:true, fieldworkDone:true, actIIIDone:true, act4IntroSeen:true } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const out = {};
    window.CODEBOOK_START(); await w(700);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /Statistics/.test(b.title)).click(); await w(2000);
    out.cabinet = !!document.getElementById('sb_spr_arcade');
    [...document.querySelectorAll('#sb_verbGrid button')].find(b => /^use/i.test(b.textContent)).click();
    document.querySelector('#sb_sceneWrap [data-id="arcade"]').click(); await w(2200);
    out.opens = !!document.getElementById('cbArcade');
    const key = k => document.dispatchEvent(new KeyboardEvent('keydown', { key:k, bubbles:true }));
    key('ArrowRight'); await w(1500);
    out.scores = window.CODEBOOK_ARCADE_TEST.state().score > 0;
    window.CODEBOOK_ARCADE_TEST.eatAll();
    for (const k of ['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','ArrowRight','ArrowLeft']){ key(k); await w(500); if (window.CODEBOOK_ARCADE_TEST.state().level > 1) break; }
    out.levelUp = window.CODEBOOK_ARCADE_TEST.state().level > 1;
    key('Escape'); await w(300);
    out.closes = !document.getElementById('cbArcade');
    out.noPuzzleFlag = !JSON.parse(localStorage.getItem('codebook_save_v1')).flags.statsDone;
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && Object.values(r).every(v => v === true) && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
