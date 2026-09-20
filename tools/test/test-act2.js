// Act II: the honest route through all four rooms, ending in a sealed slip and H-27.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['question','folder','pen','magnifyingglass','hourglass','chalk','mug','stamp','likertdie','usb','blackink'],
    flags:{ corridorDone:true, pondDone:true, whirlpoolDone:true, lectureDone:true,
            philosopherConvinced:true, profAtOffice:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await sleep(2500);

  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const out = { steps: [] };
    const S = window.CODEBOOK_SLIP;
    const go  = t => { window.CODEBOOK_START(); return wait(420).then(() => {
      const b = document.querySelector('button.campus-hotspot[title^="' + t + '"]');
      if (!b) throw new Error('no map button: ' + t); b.click(); return wait(750); }); };
    const verb = (p, v) => [...document.querySelectorAll('#'+p+'_verbGrid button')].find(b => new RegExp(v,'i').test(b.textContent)).click();
    const item = (p, id) => document.querySelector('#'+p+'_sideInv .side-inv-slot[data-item="'+id+'"]').click();
    const spot = id => document.querySelector('[data-id="'+id+'"]').click();
    const choice = (p, re) => { const b = [...document.querySelectorAll('#'+p+'_choices button')].find(x => new RegExp(re,'i').test(x.textContent));
                                if (!b) throw new Error('no choice /'+re+'/ in '+p+': ' + [...document.querySelectorAll('#'+p+'_choices button')].map(x=>x.textContent.slice(0,30)).join(' | ')); b.click(); };

    // ---- HALL: take the stepladder, write the mechanism behind Weber
    await go('The Hall of Founders');
    verb('hf','pick up'); spot('ladder'); await wait(400);
    out.steps.push(['ladder', document.querySelector('#hf_sideInv .side-inv-slot[data-item="stepladder"]') ? 'ok' : 'MISSING']);

    // ---- LIBRARY: blank card, register, catch all three, lodge the good list
    await go('The Library');
    verb('lb','pick up'); spot('desk'); await wait(350);
    verb('lb','pick up'); spot('register'); await wait(350);
    item('lb','magnifyingglass'); spot('trolley'); await wait(400);
    verb('lb','use'); spot('catalogue'); await wait(400);
    verb('lb','use'); spot('framed'); await wait(400);
    out.steps.push(['caught3', ['libCatchJournal','libCatchOpposite','libCatchCausal'].every(f => JSON.parse(localStorage.getItem('codebook_save_v1')).flags[f]) ? 'ok' : 'NO']);
    verb('lb','pick up'); spot('trolley'); await wait(400);
    choice('lb','survive checking'); await wait(500);
    out.steps.push(['known', S.data().knownSound ? 'sound' : 'junk']);

    // ---- HALL again: the mechanism
    await go('The Hall of Founders');
    item('hf','pen'); spot('weber'); await wait(400);
    choice('hf','worked examples'); await wait(500);
    out.steps.push(['mechanism', S.data().mechanismSound ? 'sound' : 'junk']);

    // ---- WORKSHOP: he refuses, so learn the extension
    await go("Feldstrom's Workshop");
    verb('ws','look at'); spot('desk'); await wait(350);
    out.steps.push(['ext4173', JSON.parse(localStorage.getItem('codebook_save_v1')).flags.wsExtension ? 'ok' : 'NO']);

    // ---- LIBRARY: Nobel protocol, then the Stockholm call
    await go('The Library');
    verb('lb','talk to'); spot('kira'); await wait(400);
    choice('lb','Nobel'); await wait(600);
    verb('lb','talk to'); spot('kira'); await wait(400);
    choice('lb','place a call'); await wait(400);
    choice('lb','4173'); await wait(600);
    choice('lb','This is Stockholm'); await wait(600);
    choice('lb','remains under discussion'); await wait(600);
    choice('lb','confidential consultation'); await wait(600);
    out.steps.push(['feldstromOut', JSON.parse(localStorage.getItem('codebook_save_v1')).flags.wsFeldstromOut ? 'ok' : 'NO']);

    // ---- WORKSHOP: tape, register, derive
    await go("Feldstrom's Workshop");
    verb('ws','use'); spot('machine'); await wait(500);
    out.steps.push(['tapeOff', JSON.parse(localStorage.getItem('codebook_save_v1')).flags.wsTapeOff ? 'ok' : 'NO']);
    verb('ws','use'); spot('machine'); await wait(600);
    out.steps.push(['scope', S.data().scopeSound ? 'sound' : 'junk']);
    await wait(2800);
    verb('ws','use'); spot('machine'); await wait(500);
    choice('ws','SPECIFY'); await wait(600);
    out.steps.push(['candidate', S.data().hypothesis ? 'ok' : 'NO']);

    // ---- SEMINAR: make it diagnostic
    await go('The Seminar Room');
    item('sm','chalk'); spot('board'); await wait(500);
    choice('sm','WHERE: worked-example'); await wait(300);
    choice('sm','WHOM: students already practising'); await wait(300);
    choice('sm','DIR: larger'); await wait(300);
    choice('sm','Write it on the board'); await wait(700);
    out.steps.push(['hypothesis', S.data().hypothesisSound ? 'sound' : 'junk']);
    out.coherence = S.coherence();
    out.filled = S.filled();

    // ---- OFFICE: seal it
    await go('The Seven-Second Office');
    out.sealPrompt = /PREREGISTRATION-ADJACENT/.test(document.getElementById('wp_line').textContent);
    choice('wp','^YES'); await wait(700);
    const f = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    out.sealed = !!f.slipSealed; out.h27 = !!f.h27issued; out.theoryEmpty = !!f.theory_empty;
    out.endLine = document.getElementById('wp_line').textContent.slice(0, 90);
    return out;
  })()`);

  console.log(JSON.stringify(r, null, 1));
  console.log('errors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && r.filled === 4 && r.coherence === 'EXEMPLARY' && r.sealed && r.h27
          && !r.theoryEmpty && r.sealPrompt && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
