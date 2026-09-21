// The Stockholm call has three requirements, not two: the procedure, the hourglass and the
// accent. The third one is only obtainable from Tobi, and only after the phone has told you
// the delivery is what is wrong -- so this walks the whole cross-room chain.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  // Everything the call needs except the accent, and Tobi pinned to the Workshop so the
  // reroll cannot decide this test's outcome.
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder','hourglass','nobelproc'],
    flags:{ corridorDone:true, act2IntroSeen:true, libraryDone:true, hallDone:true,
            wsExtension:true, tobiRoom:'library' }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await new Promise(r=>setTimeout(r,4500));

  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const out = {};
    const flags = () => JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    const inv = () => JSON.parse(localStorage.getItem('codebook_save_v1')).inventory;
    const go = async (title) => { window.CODEBOOK_START(); await w(700);
      const b = [...document.querySelectorAll('button.campus-hotspot')].find(x => x.title.indexOf(title) === 0);
      if (!b) throw new Error('no room ' + title);
      b.click(); await w(1400); };
    const verb = (pre, v) => [...document.querySelectorAll('#'+pre+'_verbGrid button')].find(b => new RegExp(v,'i').test(b.textContent)).click();
    const hot = (pre, id) => document.querySelector('#'+pre+'_sceneWrap [data-id="'+id+'"]').click();
    const ch = (pre, re) => { const b = [...document.querySelectorAll('#'+pre+'_choices button')].find(x => new RegExp(re,'i').test(x.textContent));
      if (!b) throw new Error('no choice ' + re + ' -- had: ' + [...document.querySelectorAll('#'+pre+'_choices button')].map(x=>x.textContent).join(' | ')); b.click(); };
    const line = pre => document.getElementById(pre+'_line').textContent;

    await go('The Library');

    // 1. The call is refused for the delivery, and says so in its own words.
    verb('lb','use'); hot('lb','desk'); await w(500);
    ch('lb','Extension 4173'); await w(600);
    out.rejected = /Dortmund/i.test(line('lb'));
    out.notTheDelayLine = !/not calling internationally/i.test(line('lb'));
    out.needFlag = !!flags().wsAccentNeeded;
    out.noCardYet = inv().indexOf('accentcard') === -1;

    // 2. Tobi is the only source, and the option exists only now the flag is set.
    verb('lb','talk to'); hot('lb','tobi'); await w(500);
    out.tobiOffers = [...document.querySelectorAll('#lb_choices button')].some(b => /Swedish/i.test(b.textContent));
    ch('lb','Swedish'); await w(700);
    out.gotCard = inv().indexOf('accentcard') !== -1;
    out.cardIsWrong = /World Cultures Conference/i.test(line('lb')) && /no use|any use/i.test(line('lb'));

    // 3. With the card the call opens, and the garnish never fails.
    verb('lb','use'); hot('lb','desk'); await w(500);
    ch('lb','Extension 4173'); await w(600);
    out.callOpens = /Feldstrom/.test(line('lb'));
    ch('lb','Hej'); await w(600);
    ch('lb','remains under discussion'); await w(600);
    const garnish = [...document.querySelectorAll('#lb_choices button')].map(b => b.textContent);
    out.garnishCount = garnish.length;
    out.garnishWords = garnish.join(' ');
    ch('lb','fika'); await w(600);
    out.fikaStage = /fika stage/i.test(line('lb'));
    // ...and the Committee lines are still reachable after it
    ch('lb','confidential consultation'); await w(700);
    out.feldstromOut = !!flags().wsFeldstromOut;
    return out;
  })()`);

  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && r.rejected && r.notTheDelayLine && r.needFlag && r.noCardYet && r.tobiOffers &&
             r.gotCard && r.cardIsWrong && r.callOpens && r.garnishCount === 3 &&
             /IKEA/.test(r.garnishWords) && /lagom/i.test(r.garnishWords) &&
             r.fikaStage && r.feldstromOut && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
