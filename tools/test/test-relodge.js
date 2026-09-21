// Lodging all six references costs you the needle, not the game.
//
// `readinglist` is handed out on the good branch of the Library trolley and nowhere else,
// and the Gap Registry cannot be completed without it -- so a junk WHAT IS KNOWN box that
// could not be redone would make Act V unreachable. The trolley therefore locks on a SOUND
// list only. This test walks the bad branch and then repairs it.
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
      if (!b) throw new Error('no choice ' + re); b.click(); };
    const choices = () => [...document.querySelectorAll('#lb_choices button')].map(b => b.textContent);
    const inv = () => JSON.parse(localStorage.getItem('codebook_save_v1')).inventory;
    const flags = () => JSON.parse(localStorage.getItem('codebook_save_v1')).flags;

    window.CODEBOOK_START(); await w(700);
    document.querySelector('button.campus-hotspot[title^="The Library"]').click(); await w(1500);

    // --- the bad branch: lodge all six without checking anything
    verb('pick up'); spot('trolley'); await w(500);
    ch('Lodge all six'); await w(600);
    out.junkFilled = !!S.data().known && S.data().knownSound === false;
    out.needleMoved = S.coherence() !== 'EXEMPLARY';
    out.noList = inv().indexOf('readinglist') === -1;
    out.roomNotDone = !flags().libraryDone;

    // --- the trolley is still open, and it says so
    verb('pick up'); spot('trolley'); await w(500);
    out.reopens = choices().length > 0;
    out.noSecondJunkOption = !choices().some(c => /Lodge all six/i.test(c));
    out.line = document.getElementById('lb_line').textContent;

    // --- repair it: find the three problems, then lodge the survivors
    item('magnifyingglass'); spot('trolley'); await w(500);
    verb('use'); spot('framed'); await w(500);
    verb('use'); spot('catalogue'); await w(500);
    out.caught3 = ['libCatchJournal','libCatchOpposite','libCatchCausal'].every(f => flags()[f]);

    verb('pick up'); spot('trolley'); await w(500);
    ch('survive checking'); await w(800);
    out.repaired = !!S.data().knownSound;
    out.needleBack = S.coherence();
    out.gotList = inv().indexOf('readinglist') !== -1;
    out.roomDone = !!flags().libraryDone;

    // ...and now it is properly locked
    verb('pick up'); spot('trolley'); await w(500);
    out.lockedNow = /already lodged/i.test(document.getElementById('lb_line').textContent);
    return out;
  })()`);

  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && r.junkFilled && r.needleMoved && r.noList && r.roomNotDone &&
             r.reopens && r.noSecondJunkOption && r.caught3 && r.repaired &&
             r.needleBack === 'EXEMPLARY' && r.gotList && r.roomDone && r.lockedNow &&
             !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
