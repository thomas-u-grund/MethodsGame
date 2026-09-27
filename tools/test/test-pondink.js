// The bingo gates the ink and the ink gates the real swan (author, 2026-09-26: "make the bingo
// relevant for the puzzle; make the ink the gate for the real swan; remove looking at the lake").
//   1. while Dr. Vossberg is at the lectern the ink cannot be taken
//   2. there is no open-water hotspot at the pond any more
//   3. inking a swan is rejected, and the fuss brings the real black swan: the pond is done
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:900, deviceScaleFactor:1, mobile:false });
  const run = async (save, body) => {
    await p.evaluate(`localStorage.setItem('cb_controls','classic'); localStorage.setItem('codebook_save_v1', ${JSON.stringify(JSON.stringify(save))})`);
    await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
    return p.evaluate(`(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
      const s = document.getElementById('bootSplash'); if (s) s.remove(); window.CODEBOOK_START(); await w(900); ${body} })()`);
  };
  const out = {};
  out.inkRefused = await run({ inventory:[], flags:{ actRenumberMigrated:true } }, `
    CODEBOOK_ENTER_ROOM('lecture'); await w(1500);
    [...document.querySelectorAll('.verb-grid button')].find(b => /pick up/i.test(b.textContent)).click();
    const z = document.querySelector('#lt_sceneWrap .door-zone[data-zone="ink"]'); z.click(); await w(300);
    return !JSON.parse(localStorage.getItem('codebook_save_v1')).inventory.includes('blackink') && /Not while he is standing next to it/.test(document.getElementById('lt_line').textContent);`);
  const pond = await run({ inventory:['blackink'], flags:{ actRenumberMigrated:true, whirlpoolDone:true, lecturerGone:true, lectureInkTaken:true } }, `
    CODEBOOK_ENTER_ROOM('pond'); await w(1500);
    const noWater = !document.querySelector('#pd_sceneWrap [data-id="water"]');
    [...document.querySelectorAll('.verb-grid button')].find(b => /^use$/i.test(b.textContent.trim())).click();
    document.querySelector('.side-inv-slot[data-item="blackink"]').click();
    document.querySelector('#pd_sceneWrap .hotspot[data-id="swanright"]').click(); await w(500);
    const rejected = /craft project/.test(document.getElementById('pd_line').textContent);
    await w(15500);
    return { noWater, rejected, done: !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.pondDone,
             found: /Nobody put it there/.test(document.getElementById('pd_line').textContent) };`);
  Object.assign(out, pond);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1'); localStorage.setItem('cb_controls','classic')`);
  console.log(JSON.stringify(out, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = out.inkRefused && out.noWater && out.rejected && out.done && out.found && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
