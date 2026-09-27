// The Library (author, 2026-09-27): KIRA writes the literature review, and the monkey eats it.
//
//   1. KIRA prints a review of six references on request: it goes into your hand.
//   2. Walking out with it is stopped: the monkey eats it (a cutscene), and you stay in the room.
//   3. The three checks work on her copy: the glass on KIRA, the catalogue drawer, and the
//      whole paper -- which she only offers once you have looked at the framed abstract.
//   4. With all three caught she prints a clean copy: the reading list, a SOUND "what is
//      known", the room done. There is no way to lodge the six any more.
//   5. Walking out with the clean list plays the monkey's shrug once, then the map.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['question','folder','pen','magnifyingglass','stepladder'],
    flags:{ corridorDone:true, act2IntroSeen:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();

  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const S = window.CODEBOOK_SLIP, out = {};
    const verb = v => [...document.querySelectorAll('#lb_verbGrid button')].find(b => new RegExp(v,'i').test(b.textContent)).click();
    const item = id => { verb('use'); document.querySelector('#lb_sideInv .side-inv-slot[data-item="'+id+'"]').click(); };
    const spot = id => document.querySelector('#lb_sceneWrap [data-id="'+id+'"]').click();
    const ch = re => { const b = [...document.querySelectorAll('#lb_choices button')].find(x => new RegExp(re,'i').test(x.textContent));
      if (!b) throw new Error('no choice ' + re + ': ' + choices().join(' | ')); b.click(); };
    const choices = () => [...document.querySelectorAll('#lb_choices button')].map(b => b.textContent);
    const inv = () => { const g = JSON.parse(localStorage.getItem('codebook_save_v1')); return g.inventory.concat(g.filed || []); };
    const flags = () => JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    const il = () => !!document.getElementById('interlude');
    const skipIL = () => document.dispatchEvent(new KeyboardEvent('keydown', { code:'Escape', key:'Escape', bubbles:true }));
    const onMap = () => !document.getElementById('lb_sceneWrap');

    window.CODEBOOK_START(); await w(500);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /^The Library/.test(b.title)).click(); await w(1300);
    out.noTrolley = !document.querySelector('#lb_sceneWrap .hotspot[data-id="trolley"]');

    // 1. the review
    verb('talk to'); spot('kira'); await w(400);
    out.noWholeYet = !choices().some(c => /whole/i.test(c));
    ch('literature review'); await w(900);
    out.printCut = il(); skipIL(); await w(600);
    out.hasReview = inv().includes('litreview');

    // 2. the monkey
    document.getElementById('backToMap').click(); await w(900);
    out.monkeyCut = il() && /lib-cut-monkey/.test(document.getElementById('interlude').innerHTML);
    skipIL(); await w(700);
    out.stayed = !onMap();
    out.eaten = !inv().includes('litreview') && !!flags().libMonkeyAte;
    document.getElementById('backToMap').click(); await w(900);     // nothing in hand now: you may go
    out.freeToLeave = onMap();
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /^The Library/.test(b.title)).click(); await w(1300);

    // 3. the checks
    item('magnifyingglass'); spot('kira'); await w(400);
    verb('use'); spot('catalogue'); await w(400);
    verb('look at'); spot('framed'); await w(400);
    verb('talk to'); spot('kira'); await w(400);
    out.noCleanYet = !choices().some(c => /Print the list again/i.test(c));
    ch('whole'); await w(500);
    out.caught3 = ['libCatchJournal','libCatchOpposite','libCatchCausal'].every(f => flags()[f]);

    // 4. the clean copy
    verb('talk to'); spot('kira'); await w(400);
    out.noJunkOption = !choices().some(c => /Lodge all six|literature review/i.test(c));
    ch('Print the list again'); await w(500);
    out.sound = !!(S.data().known && S.data().knownSound);
    out.readinglist = inv().includes('readinglist');
    out.done = !!flags().libraryDone;

    // 5. the shrug, once, then the map
    document.getElementById('backToMap').click(); await w(900);
    out.shrugCut = il() && /lib-cut-shrug/.test(document.getElementById('interlude').innerHTML);
    skipIL(); await w(900);
    out.mapAfterShrug = onMap();
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && Object.values(r).every(v => v === true) && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
