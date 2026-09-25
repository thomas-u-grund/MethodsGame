// The folder leads the inventory, and hovering it opens a panel of its five dividers
// over the scene, with the current act's boxes (ROADMAP 8zl).
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['pen','question','folder','h27form'], filed:['slip','readinglist'],
    flags:{ corridorDone:true, whirlpoolDone:true, profAtOffice:true, slipSealed:true, h27issued:true,
      surveyDone:true, act2IntroSeen:true, act3IntroSeen:true } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await wait(700);
    document.querySelector('button.campus-hotspot[title^="The Ethics"]').click(); await wait(1400);
    const slots = [...document.querySelectorAll('#et_sideInv .side-inv-slot')].map(s => s.dataset.item);
    const f = document.querySelector('#et_sideInv .side-inv-slot[data-item="folder"]');
    f.dispatchEvent(new MouseEvent('mouseenter')); await wait(300);
    const panel = document.getElementById('folderPanel');
    const out = { slots, open: !!panel && panel.classList.contains('open'),
      inScene: !!panel && panel.parentNode.id === 'et_sceneWrap',
      cur: panel && panel.querySelector('.fp-div.cur .fp-tab').textContent,
      theory: panel && panel.textContent.includes('Prediction'),
      boxes: panel && panel.querySelectorAll('.fp-boxes .on').length,
      nameplate: document.getElementById('et_h27').textContent };
    f.dispatchEvent(new MouseEvent('mouseleave')); await wait(250);
    out.closed = !panel.classList.contains('open');
    out.h27gone = !JSON.parse(localStorage.getItem('codebook_save_v1')).inventory.includes('h27form');
    return out;
  })()`);
  console.log(JSON.stringify(r), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.slots[0] === 'folder' && r.open && r.inScene && r.cur.startsWith('DATA') && r.boxes === 1
    && /^DATA/.test(r.nameplate) && r.closed && r.h27gone && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
