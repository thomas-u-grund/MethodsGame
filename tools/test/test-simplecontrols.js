// Simple controls (ROADMAP 8zx): one click takes a takeable thing, a selected item is used
// on whatever is clicked, and a thing with several verbs shows icons over itself.
process.env.CB_SIMPLE = '1';
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('cb_controls','simple'); localStorage.setItem('codebook_save_v1', JSON.stringify({inventory:['question','folder'], flags:{ corridorDone:true, act2IntroSeen:true, whirlpoolDone:true, profAtOffice:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const bs = document.getElementById('bootSplash'); if (bs) bs.remove();
    window.CODEBOOK_START(); await w(700);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => b.title.indexOf('The Library') === 0).click(); await w(1600);
    const out = { simple: document.body.classList.contains('cb-simple'), verbRowHidden: getComputedStyle(document.querySelector('.verb-grid')).display === 'none',
                  toggle: (document.getElementById('ctrlToggle') || {}).textContent };
    const click = el => { const r = el.getBoundingClientRect(); el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, clientX:r.left + r.width/2, clientY:r.top + r.height/2 })); };
    // one action (KIRA: Talk) is done by one click; two actions (the trolley: Look, Use) show icons
    click(document.querySelector('#lb_sceneWrap .hotspot[data-id="kira"]')); await w(400);
    out.talked = /Certainly/.test(document.getElementById('lb_line').textContent) && !document.querySelector('.cb-icons');
    click(document.querySelector('#lb_sceneWrap .hotspot[data-id="trolley"]')); await w(250);
    out.icons = [...document.querySelectorAll('.cb-icons button')].map(b => b.dataset.v).join(',');
    out.noUseWithEmptyHand = !/usewith/.test(out.icons);
    document.body.click(); await w(100);
    // the register is takeable: one click takes it
    const reg = document.querySelector('#lb_sceneWrap .hotspot[data-verbs~="pickup"]');
    out.takeable = reg ? reg.dataset.id : null;
    if (reg){ click(reg); await w(900); }
    out.inv = JSON.parse(localStorage.getItem('codebook_save_v1')).inventory.join(',');
    // a selected inventory item is used on the next thing clicked
    const slot = document.querySelector('#lb_sideInv .side-inv-slot[data-item="question"]'); slot.click(); await w(150);
    out.useArmed = document.querySelector('#lb_verbGrid [data-verb="use"]').classList.contains('active');
    click(document.querySelector('#lb_sceneWrap .hotspot[data-id="kira"]')); await w(300);
    out.onlyUseWith = [...document.querySelectorAll('.cb-icons button')].map(b => b.dataset.v).join(',') === 'usewith';
    document.querySelector('.cb-icons button[data-v="usewith"]').click(); await w(400);
    out.usedOnKira = !document.querySelector('#lb_sideInv .side-inv-slot.selected');
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1'); localStorage.setItem('cb_controls','classic')`);
  const ok = r.simple && r.verbRowHidden && /Simple/.test(r.toggle) && r.icons === 'lookat,use' && r.talked && r.takeable && r.useArmed && r.onlyUseWith && r.usedOnKira && r.noUseWithEmptyHand && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
