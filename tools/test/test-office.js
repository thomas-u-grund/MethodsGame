// The Seven-Second Office. The Professor is a woman, she is a SPRITE rather than painted
// into the background, and running her patience out makes HER leave rather than ejecting
// you -- which is also what opens the desk up for looting.
//
//   1. one background, plus a sprite that carries data-voice so it breathes and leans.
//      She used to be painted into office-bg.webp, with office-bg-empty.webp as the other
//      half of a pair that could drift apart and in which she could not move at all.
//   2. spend all five bubbles on wrong answers and she goes: the sprite is hidden, the
//      room says so, and there is a way out of the room that survives pressing "Wait".
//   3. with her gone, the desk is unguarded -- "not with her sitting right there" lifts.
//   4. come back and she is at her desk again with a full five bubbles. Nothing about the
//      walk-out is saved; that is the point of "next time she is there again".
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

const enterOffice = `
  const w = ms => new Promise(r => setTimeout(r, ms));
  const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
  window.CODEBOOK_START(); await w(700);
  [...document.querySelectorAll('button.campus-hotspot')]
    .find(x => x.title.indexOf('The Seven-Second Office') === 0).click();
  await w(1400);`;

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:1000, deviceScaleFactor:1, mobile:false });
  // Post-bingo: the lecture is over, so she is back at her desk.
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:[],
    flags:{ lectureDone:true, lecturerGone:true, profAtOffice:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();

  const r = await p.evaluate(`(async () => {${enterOffice}
    const out = {};
    const prof = document.getElementById('wp_prof');
    const bg   = document.getElementById('wp_bg');
    out.oneBackground = bg.getAttribute('src') === 'office-bg-empty.webp';
    out.isSprite      = !!prof && prof.getAttribute('src') === 'prof-office.webp';
    out.animates      = !!prof && prof.getAttribute('data-voice') === 'prof'
                        && getComputedStyle(prof).animationName !== 'none';
    const mouth = document.getElementById('wp_profMouth');
    out.hasMouth      = !!mouth && mouth.getAttribute('data-voice') === 'prof'
                        && mouth.classList.contains('cb-mouth-solo') && mouth.naturalWidth > 0;
    // The mouth layer covers her whole sprite box, so it must be transparent everywhere but
    // the mouth: an opaque file flashed a black rectangle over her every time she spoke.
    if (mouth){
      const c = document.createElement('canvas'); c.width = mouth.naturalWidth; c.height = mouth.naturalHeight;
      const g = c.getContext('2d'); g.drawImage(mouth, 0, 0);
      const a = (x, y) => g.getImageData(x, y, 1, 1).data[3];
      out.mouthTransparent = a(2, 2) === 0 && a(c.width - 3, c.height - 3) === 0 && a(c.width >> 1, 5) === 0;
    }
    out.visible       = !!prof && getComputedStyle(prof).display !== 'none';
    out.bubblesAtStart = document.querySelectorAll('#wp_drops .full').length;

    // Burn her patience. The first choice on offer is the continue, then the wrong answer
    // each round, so four clicks reaches W-LOSE. Then wait out the beat before she goes.
    for (let i = 0; i < 12; i++){
      const btns = [...document.querySelectorAll('#wp_choices button')];
      if (!btns.length) break;
      btns[0].click();
      await w(280);
    }
    await w(5800);   // she leaves when her line ends (AFTER_LINE, 4.5 s cap) + 650 ms fade
    out.sheLeft      = getComputedStyle(prof).display === 'none';
    out.roomSaysSo   = /empty/i.test(document.getElementById('wp_line').textContent);
    const wayOut = () => [...document.querySelectorAll('#wp_choices button')]
      .some(b => /come back when she has cooled off/i.test(b.textContent));
    out.wayOut = wayOut();
    // ...and pressing "Wait" re-renders the choices without eating the way out
    const wait = [...document.querySelectorAll('#wp_choices button')].find(b => /^Wait/.test(b.textContent));
    if (wait){ wait.click(); await w(250); }
    out.wayOutSurvivesWait = wayOut();

    // 3. the desk is unguarded now
    const deskItem = document.querySelector('[data-id="bingocard"]');
    if (deskItem){
      [...document.querySelectorAll('#wp_verbGrid button')].find(b => /pick up/i.test(b.textContent)).click();
      deskItem.click(); await w(400);
      out.deskUnguarded = !/sitting right there/i.test(document.getElementById('wp_line').textContent);
    }
    return out;
  })()`);

  // 4. leave and come back: she is there again, with all five bubbles
  const back = await p.evaluate(`(async () => {${enterOffice}
    const prof = document.getElementById('wp_prof');
    return { sheIsBack: !!prof && getComputedStyle(prof).display !== 'none',
             bubbles: document.querySelectorAll('#wp_drops .full').length,
             notSaved: JSON.parse(localStorage.getItem('codebook_save_v1')).flags.profAtOffice === true };
  })()`);

  console.log(JSON.stringify({ ...r, ...back }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && r.oneBackground && r.isSprite && r.animates && r.hasMouth && r.mouthTransparent && r.visible
          && r.bubblesAtStart === 5 && r.sheLeft && r.roomSaysSo && r.wayOut && r.wayOutSurvivesWait
          && r.deskUnguarded
          && back.sheIsBack && back.bubbles === 5 && back.notSaved
          && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
