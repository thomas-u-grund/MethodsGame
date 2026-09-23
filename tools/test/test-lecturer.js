// ROADMAP 8o: the lecturer and the Professor are two different people.
//
// They used to be one sprite on one flag, which is why the man who refuses vague questions
// in his office was also the man delivering the unfalsifiable fog the bingo card mocks.
// The split has three parts and each of them can regress quietly:
//
//   1. the Lecture Theatre is DR. VOSSBERG's room -- his sprites, his voice tag and his
//      name on the caption, and no `prof-*` art anywhere in it, because the Professor is
//      a woman in a different building now.
//   2. winning bingo sends the lecturer away AND brings the Professor back, via two
//      separate flags, because summoning the lecturer back must not empty the Office again
//   2b. but bingo is no longer the ONLY way she comes back -- ASKING him where she is does
//      it too, and that is the intended route. Act I must not be gated on a minigame.
//   3. a save made before the split still works: `profAtOffice` alone has to imply that
//      the lecturer has already gone, or a derailed lecture starts over
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:1000, deviceScaleFactor:1, mobile:false });

  // ---- 1 + 2: play the lecture from the beginning and derail it
  // The bingo card is picked up in the Office and USED on the lecturer; seed it so this
  // test is about the lecturer and not about Act I's inventory chain.
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({inventory:['bingocard'],flags:{}}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const a = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    window.CODEBOOK_START(); await w(800);
    [...document.querySelectorAll('button.campus-hotspot')]
      .find(b => b.title.indexOf('Introduction to Systems Theory') === 0).click();
    await w(1600);
    const out = {};
    out.speaker  = document.getElementById('lt_speaker').textContent.trim();
    out.poses    = ['Lecturing','Walking','Pointing'].every(k => {
      const el = document.getElementById('lt_lect' + k);
      return el && /^vossberg-/.test(el.getAttribute('src')) && el.getAttribute('data-voice') === 'lecturer';
    });
    out.mouths   = ['L','P'].every(k => {
      const img = document.querySelector('#lt_mouthWrap' + k + ' img');
      return img && /^mouth-vossberg-/.test(img.getAttribute('src'));
    });
    out.noProfSprite = !document.querySelector('#lt_sceneWrap [src^="prof-"]');

    // Use the card on him to start the game.
    [...document.querySelectorAll('#lt_verbGrid button')].find(b => /^use$/i.test(b.textContent.trim())).click();
    document.querySelector('#lt_sideInv .side-inv-slot[data-item="bingocard"]').click();
    // the room's hotspots are bare .door-zone divs; his is the one at left:46%
    [...document.querySelectorAll('#lt_sceneWrap .door-zone')]
      .find(e => e.style.left.indexOf('46') === 0).click();
    await w(1400);
    out.started = document.getElementById('lt_bingoPanel').style.display !== 'none';

    // Click through the lecture until BINGO is offered, then take it.
    let shouted = false;
    for (let i = 0; i < 60 && !shouted; i++){
      const btns = [...document.querySelectorAll('#lt_choices button')];
      if (!btns.length) { await w(300); continue; }
      const bingo = btns.find(b => /BINGO/i.test(b.textContent));
      if (bingo){ bingo.click(); shouted = true; break; }
      const keep = btns.find(b => /Keep listening/i.test(b.textContent)) || btns[0];
      keep.click(); await w(150);
    }
    out.shouted = shouted;
    await w(11000);                              // the losing-the-thread beat, then the walk out
    const f = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    out.lectureDone   = !!f.lectureDone;
    out.lecturerGone  = !!f.lecturerGone;        // he has left this room
    out.profAtOffice  = !!f.profAtOffice;        // and the Professor has come back to his
    return out;
  })()`);

  // ---- the Office is occupied now, and the theatre is empty
  const b = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await w(700);
    [...document.querySelectorAll('button.campus-hotspot')]
      .find(x => x.title.indexOf('The Seven-Second Office') === 0).click();
    await w(1400);
    const line = document.getElementById('wp_line');
    return { officeOccupied: !!line && !/The office is empty/.test(line.textContent) };
  })()`);

  // ---- 4: ASKING him is the intended way to get her back, and it needs nothing.
  // Act I used to be gated on winning the bingo minigame: that was the only event that
  // could put the Professor at her own desk. Now the first thing anyone tries -- talk to
  // the man covering her class -- works, with an empty inventory, on the way in.
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({inventory:[],flags:{}}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const e = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    window.CODEBOOK_START(); await w(800);
    [...document.querySelectorAll('button.campus-hotspot')]
      .find(b => /Introduction to Systems Theory|Lecture/i.test(b.title)).click();
    await w(1600);
    const vb = [...document.querySelectorAll('#lt_verbGrid button')].find(b => /talk to/i.test(b.textContent));
    if (!vb) return { err: 'no talk-to verb' };
    vb.click();
    // his zone is the bare .door-zone div at left:46% -- same selector the bingo run uses
    const hot = [...document.querySelectorAll('#lt_sceneWrap .door-zone')]
      .find(el => el.style.left.indexOf('46') === 0);
    if (!hot) return { err: 'no lecturer hotspot' };
    hot.click(); await w(600);
    const ask = [...document.querySelectorAll('#lt_choices button')]
      .find(b => /Stellmacher/i.test(b.textContent));
    const out = { offered: !!ask, before: !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.profAtOffice };
    if (!ask) return out;
    ask.click(); await w(600);
    out.after = !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.profAtOffice;
    out.lecturerStillHere = !JSON.parse(localStorage.getItem('codebook_save_v1')).flags.lecturerGone;
    // ...and asking twice does not re-offer it
    hot.click(); await w(400);
    out.notReoffered = ![...document.querySelectorAll('#lt_choices button')]
      .some(b => /Stellmacher/i.test(b.textContent));
    return out;
  })()`);

  // ---- 3: a pre-split save
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:[], flags:{ lectureDone:true, profAtOffice:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const c = await p.evaluate(`JSON.parse(localStorage.getItem('codebook_save_v1')).flags.lecturerGone === true`);

  // ...and a save that never got that far is left alone
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:[], flags:{} }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const d = await p.evaluate(`JSON.parse(localStorage.getItem('codebook_save_v1')).flags.lecturerGone === undefined`);

  console.log(JSON.stringify({ ...a, ...b, ask: e, migratedOldSave: c, leavesNewSaveAlone: d }, null, 1),
              '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = a && a.speaker === 'Dr. Vossberg' && a.poses && a.mouths && a.noProfSprite
          && a.started && a.shouted && a.lectureDone && a.lecturerGone && a.profAtOffice
          && b.officeOccupied && c && d
          && e && !e.err && e.offered && !e.before && e.after   // asking alone brings her back
          && e.lecturerStillHere                                // without derailing anything
          && e.notReoffered
          && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
