// Act II: the honest route through all four rooms, ending in a sealed slip and H-27.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['question','folder','pen','magnifyingglass','hourglass','chalk','mug','stamp','likertdie','usb','blackink'],
    flags:{ corridorDone:true, pondDone:true, whirlpoolDone:true, lectureDone:true,
            philosopherConvinced:true, profAtOffice:true, act2IntroSeen:true, rapDone:true,
            tobiRoom:'library' }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();

  const r = await p.evaluate(`(async () => { try {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const out = { steps: [] };
    const S = window.CODEBOOK_SLIP;
    const go  = t => { window.CODEBOOK_START(); return wait(420).then(() => {
      const b = document.querySelector('button.campus-hotspot[title^="' + t + '"]');
      if (!b) throw new Error('no map button: ' + t); b.click(); return wait(1200); }); };
    const verb = (p, v) => [...document.querySelectorAll('#'+p+'_verbGrid button')].find(b => new RegExp(v,'i').test(b.textContent)).click();
    // "Look at" on an inventory item now describes it, so arm the USE verb first.
    const item = (p, id) => { [...document.querySelectorAll('#'+p+'_verbGrid button')].find(b => /^use$/i.test(b.textContent.trim())).click();
      document.querySelector('#'+p+'_sideInv .side-inv-slot[data-item="'+id+'"]').click(); };
    const spot = id => document.querySelector('[data-id="'+id+'"]').click();
    const choice = (p, re) => { const b = [...document.querySelectorAll('#'+p+'_choices button')].find(x => new RegExp(re,'i').test(x.textContent));
                                if (!b) throw new Error('no choice /'+re+'/ in '+p+': ' + [...document.querySelectorAll('#'+p+'_choices button')].map(x=>x.textContent.slice(0,30)).join(' | ')); b.click(); };

    // ---- HALL: take the stepladder (the battle is seeded as done, so Professor G will talk)
    await go('The Hall of Founders');
    verb('hf','pick up'); spot('ladder'); await wait(400);
    out.steps.push(['ladder', document.querySelector('#hf_sideInv .side-inv-slot[data-item="stepladder"]') ? 'ok' : 'MISSING']);

    // ---- LIBRARY: blank card, register, catch all three, lodge the good list
    await go('The Library');
    verb('lb','pick up'); spot('desk'); await wait(350);
    verb('lb','pick up'); spot('register'); await wait(350);
    item('lb','magnifyingglass'); spot('trolley'); await wait(400);
    verb('lb','use'); spot('catalogue'); await wait(400);
    verb('lb','use'); spot('conveyor'); await wait(400);          // the full paper, off the belt (8zy)
    out.steps.push(['caught3', ['libCatchJournal','libCatchOpposite','libCatchCausal'].every(f => JSON.parse(localStorage.getItem('codebook_save_v1')).flags[f]) ? 'ok' : 'NO']);
    verb('lb','pick up'); spot('trolley'); await wait(400);
    choice('lb','survive checking'); await wait(500);
    out.steps.push(['known', S.data().knownSound ? 'sound' : 'junk']);

    // ---- HALL again: the mechanism
    await go('The Hall of Founders');
    verb('hf','talk to'); spot('profg'); await wait(500);
    choice('hf','worked examples'); await wait(500);
    out.steps.push(['mechanism', S.data().mechanismSound ? 'sound' : 'junk']);

    // ---- WORKSHOP: he refuses, so learn the extension
    await go("Feldstrom's Workshop");
    verb('ws','look at'); spot('desk'); await wait(350);
    out.steps.push(['ext4173', JSON.parse(localStorage.getItem('codebook_save_v1')).flags.wsExtension ? 'ok' : 'NO']);

    // ---- LIBRARY: the Stockholm call (8zy): the phrasebook from the stacks, then KIRA's phone.
    await go('The Library');
    verb('lb','pick up'); spot('stacks'); await wait(400);
    out.steps.push(['phrasebook', JSON.parse(localStorage.getItem('codebook_save_v1')).inventory.includes('swedebook') ? 'ok' : 'NO']);
    verb('lb','talk to'); spot('kira'); await wait(400);
    choice('lb','place a call'); await wait(400);
    choice('lb','Feldstrom, please'); await wait(600);
    out.steps.push(['splitScreen', document.querySelector('.lb-call') ? 'ok' : 'NO']);
    choice('lb','This is Stockholm'); await wait(600);
    choice('lb','lagom'); await wait(600);
    choice('lb','remains under discussion'); await wait(600);
    choice('lb','confidential consultation'); await wait(600);
    out.steps.push(['feldstromOut', JSON.parse(localStorage.getItem('codebook_save_v1')).flags.wsFeldstromOut ? 'ok' : 'NO']);

    // ---- WORKSHOP: one Use opens the zoom; wind the drums left, feed in the register
    await go("Feldstrom's Workshop");
    verb('ws','use'); spot('machine'); await wait(900);
    out.steps.push(['zoomOpen', document.getElementById('ws_acc') ? 'ok' : 'NO']);
    document.getElementById('ws_accReg').click(); await wait(400);          // refused: drums still point right
    out.steps.push(['refusedRight', !S.data().scope ? 'ok' : 'NO']);
    const lefts = [...document.querySelectorAll('.acc-crank')].filter(b => b.dataset.dir === '-1');
    for (const b of lefts) for (let i = 0; i < 12; i++){ b.click(); await wait(30); }
    await wait(300);
    document.getElementById('ws_accReg').click(); await wait(2000);
    out.steps.push(['scope', S.data().scopeSound ? 'sound' : 'junk']);
    out.steps.push(['workshopDone', JSON.parse(localStorage.getItem('codebook_save_v1')).flags.workshopDone ? 'ok' : 'NO']);
    out.steps.push(['noHypothesisYet', !S.data().hypothesis ? 'ok' : 'NO']);   // only the Seminar writes it
    await wait(2800);

    // ---- SEMINAR: two lines; a wrong card names its rival
    await go('The Seminar Room');
    verb('sm','use'); spot('board'); await wait(500);
    choice('sm','LARGER on all exam'); await wait(200);
    choice('sm','SMALLER for students already practising'); await wait(200);
    choice('sm','Write it on the board'); await wait(500);
    out.steps.push(['rivalNamed', /SELECTION/.test(document.getElementById('sm_line').textContent) ? 'ok' : 'NO']);
    await wait(2800);
    choice('sm','LARGER on worked-example'); await wait(200);
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
  } catch(e){ return { ERROR: String(e && e.message || e), steps: (typeof out!=='undefined'? out.steps : null) }; } })()`);

  console.log(JSON.stringify(r, null, 1));
  console.log('errors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && r.filled === 4 && r.coherence === 'EXEMPLARY' && r.sealed && r.h27
          && !r.theoryEmpty && r.sealPrompt && !p.errors.length
          && (r.steps || []).every(st => st[1] !== 'NO' && st[1] !== 'MISSING');
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
