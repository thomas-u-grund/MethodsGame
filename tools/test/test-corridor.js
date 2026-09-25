// The Causality Corridor (ROADMAP 8zl, C1).
//   1. The case text is on screen when a case opens -- no magnifying glass in the inventory.
//   2. A wrong door keeps its explanation on screen and brings you back to the SAME case
//      (it used to throw you out to the map, to redo the gate, the speech and every case).
//   3. Trying doors case by case gets you through all four and out with the folder.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['question'],
    flags:{ actRenumberMigrated:true, whirlpoolDone:true, profAtOffice:true, lecturerGone:true, pondDone:true, philosopherConvinced:true, tobiRoom:'' } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove(); window.CODEBOOK_START(); await w(900);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /Corridor/.test(b.title)).click(); await w(1500);
    const line = () => document.getElementById('cc_line').textContent;
    const tag = () => document.getElementById('cc_caseTag').textContent;
    const skip = () => document.body.dispatchEvent(new KeyboardEvent('keydown', { code:'Space', key:' ', bubbles:true }));
    [...document.querySelectorAll('#cc_verbGrid button, .verb-grid button')].find(b => /^use$/i.test(b.textContent.trim())).click();
    document.querySelector('[data-id="bell"], .door-zone, [data-extra="bell"]');
    const bell = [...document.querySelectorAll('#cc_sceneWrap *')].find(e => e.dataset && (e.dataset.id === 'bell' || e.dataset.extra === 'bell'));
    bell.click(); await w(1500); skip(); await w(2500);
    const out = { caseShown: /You read the note on the wall aloud/.test(line()), firstTag: tag(), wrongKept: null, sameCase: null, cases: 0 };
    for (let c = 0; c < 4; c++){
      const doors = [...document.querySelectorAll('.door-zone')].map(d => d.dataset.door);
      for (const d of doors){
        const before = tag();
        const z = document.querySelector('.door-zone[data-door="' + d + '"]'); if (!z) continue;
        z.click(); await w(1300);
        const fb = line();
        await w(2900);
        if (tag() === before && document.querySelector('.door-zone')){
          if (out.wrongKept === null){ out.wrongKept = fb.length > 60 && /Wrong door/.test(fb); out.sameCase = true; }
          continue;                                      // wrong: back in the same case, try the next door
        }
        out.cases++; break;                              // right: next case
      }
    }
    await w(1500);
    const arch = [...document.querySelectorAll('#cc_choices button')].find(b => /Step through/.test(b.textContent));
    if (arch) arch.click();
    await w(15500);
    const g = JSON.parse(localStorage.getItem('codebook_save_v1'));
    out.done = !!g.flags.corridorDone; out.folder = g.inventory.indexOf('folder') !== -1;
    return out;
  })()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = r.caseShown && r.wrongKept && r.sameCase && r.cases === 4 && r.done && r.folder && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
