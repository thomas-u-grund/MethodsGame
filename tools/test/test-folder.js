// The folder holds the paperwork (ROADMAP 8zf). Research documents are filed into the folder
// instead of taking an inventory slot each; rooms still find them through hasItem().
//   1. An old save with documents loose in the inventory is migrated on load: documents move
//      into the folder, tools stay in the inventory.
//   2. A document handed over once the player has the folder is filed, and gets no slot.
//   3. Before the folder exists (Act I) nothing is filed -- the question is carried in hand.
//   4. removeItem() takes a filed document out too.
//   5. Look At on the folder lists what is filed, by divider.
//   6. When an act ends, the objects nothing later asks for leave the inventory.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(U + Date.now());
  const save = o => p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify(${JSON.stringify(o)}))`);
  const load = () => p.evaluate(`JSON.parse(localStorage.getItem('codebook_save_v1'))`);

  // 1 + 2 + 4 + 5
  await save({ inventory:['folder','pen','readinglist','slip','resultprint','usb'], flags:{ corridorDone:true, act2IntroSeen:true, slipSealed:true, act3IntroSeen:true } });
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    const g = () => JSON.parse(localStorage.getItem('codebook_save_v1'));
    const out = {};
    // the migration happens in memory at load and is written on the next save
    window.CODEBOOK_START(); await w(900);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /Library/.test(b.title)).click(); await w(1600);
    out.inv = g().inventory; out.filed = g().filed;
    out.slots = [...document.querySelectorAll('#lb_sideInv .side-inv-slot[data-item]')].map(e => e.dataset.item);
    // Look At on the folder
    [...document.querySelectorAll('#lb_verbGrid button')].find(b => /look at/i.test(b.textContent)).click();
    document.querySelector('#lb_sideInv .side-inv-slot[data-item="folder"]').click(); await w(300);
    out.look = document.getElementById('lb_line').textContent;
    return out;
  })()`);

  // 3: no folder yet -- a document goes in the hand
  await save({ inventory:['pen'], flags:{} });
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const noFolder = await p.evaluate(`(async () => {
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    return window.CODEBOOK_IS_FILED('slip') === false;
  })()`);

  // 6: an ended act leaves its spent objects behind; tools needed later stay
  await save({ inventory:['folder','pen','chalk','blackink','stamp','worksheets','ticket'], flags:{ corridorDone:true, act2IntroSeen:true, slipSealed:true, act3IntroSeen:true, actIIIDone:true } });
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const tidy = await p.evaluate(`(async () => {
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    window.CODEBOOK_START(); await new Promise(r => setTimeout(r, 800));
    return JSON.parse(localStorage.getItem('codebook_save_v1')).inventory; })()`);

  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  console.log(JSON.stringify({ ...r, noFolder, tidy }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const has = (a, x) => (a || []).indexOf(x) !== -1;
  const ok = has(r.inv, 'pen') && has(r.inv, 'usb') && has(r.inv, 'folder')
          && !has(r.inv, 'readinglist') && !has(r.inv, 'slip') && !has(r.inv, 'resultprint')
          && has(r.filed, 'readinglist') && has(r.filed, 'slip') && has(r.filed, 'resultprint')
          && !has(r.slots, 'readinglist') && has(r.slots, 'folder')
          && /Filed behind the dividers/.test(r.look) && /Reading List/.test(r.look) && /RESULT:/.test(r.look)
          && noFolder
          && !has(tidy, 'chalk') && !has(tidy, 'blackink') && !has(tidy, 'stamp')      // Acts II and III are over
          && has(tidy, 'pen') && has(tidy, 'worksheets') && has(tidy, 'ticket')         // Act V / Act IV still need these
          && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
