// The Founders' Rap Battle (STORY.md, the Hall of Founders).
//
//   1. before: Tobi is in the Hall hosting, Professor G is standing there, the DJ table says
//      there is no beat, and Talk To Tobi is about the show.
//   2. Use the USB stick on the DJ table: Tobi's lines play, then each founder's verse, and
//      while a verse plays THAT founder's portrait is .talking (mouth moves) and nobody
//      else's is. Space skips each step, which is how this test gets through it quickly.
//   3. Professor G's verse opens the timed cutscene with lyrics; Esc skips it.
//      No mouth moves during a verse's instrumental intro (it used to, for the whole file).
//      The battle runs in stage mode: body.cb-stage hides the verbs, inventory and map.
//   4. after: rapDone is set, the meter and portraits say so, and writing the mechanism no
//      longer means crouching behind Weber.
//   5. Talk To Tobi then offers an encore, which starts the battle (and its crowd) again.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(null);
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:1000, deviceScaleFactor:1, mobile:false });
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['usb','pen','blankcard'],
    flags:{ corridorDone:true, act2IntroSeen:true, actRenumberMigrated:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();

  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_START(); await w(700);
    const played = [];
    const PA = window.CODEBOOK_PLAY_LINE_AUDIO, PQ = window.CODEBOOK_PLAY_LINE_QUEUE;
    window.CODEBOOK_PLAY_LINE_AUDIO = function(s){ if (s) played.push(s); return PA.apply(this, arguments); };
    window.CODEBOOK_PLAY_LINE_QUEUE = function(l){ (l || []).forEach(c => played.push(c)); return PQ.apply(this, arguments); };
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /Hall of Founders/.test(b.title)).click();
    await w(1500);
    const out = {};
    const hot = id => document.querySelector('#hf_sceneWrap .hotspot[data-id="' + id + '"]');
    const verb = re => [...document.querySelectorAll('#hf_verbGrid button, .verb-grid button')].find(b => re.test(b.textContent));
    const line = () => (document.getElementById('hf_line') || {}).textContent || '';
    const space = () => document.body.dispatchEvent(new KeyboardEvent('keydown', { code:'Space', key:' ', bubbles:true }));
    const tobiFoot = document.getElementById('hf_foot_tobi');
    out.tobiHere = !!tobiFoot && getComputedStyle(tobiFoot).display !== 'none';
    out.profgHere = !!document.getElementById('hf_spr_profg');
    out.mouths = ['marx','durkheim','weber'].every(n => document.getElementById('hf_mouth_' + n));
    verb(/look/i).click(); hot('djtable').click(); await w(200);
    out.noBeat = /Nothing is plugged/.test(line());
    out.djHere = !!document.getElementById('hf_dj');
    verb(/look/i).click(); hot('dj').click(); await w(200);
    out.djLook = /p &lt; \.05|p < \.05/.test(line()) || /p < \.05/.test(document.getElementById('hf_line').textContent);
    verb(/talk/i).click(); hot('tobi').click(); await w(200);
    out.tobiHosts = /closing act/.test(line());
    space();

    // USB on the DJ table
    // The save lists the stick first, and slots follow inventory order.
    const inv = document.querySelector('#hf_sideInv .side-inv-slot.filled');
    if (!inv) return Object.assign(out, { err:'no usb slot' });
    inv.click(); hot('djtable').click(); await w(400);
    out.usbLine = /Iconic/.test(line());
    out.stageOn = document.body.classList.contains('cb-stage')
               && getComputedStyle(document.querySelector('#hf_verbGrid').closest('.side-panel')).display === 'none';
    const introMouths = [];
    const talkingDuring = {};
    for (let step = 0; step < 24; step++){
      await w(700);
      ['marx','durkheim','weber'].forEach(n => {
        const el = document.getElementById('hf_mouth_' + n);
        if (el && el.classList.contains('talking')) talkingDuring[n] = (talkingDuring[n] || 0) + 1;
      });
      if (document.getElementById('interlude')) break;
      if (/beat drops/.test(line()))
        introMouths.push(['marx','durkheim','weber'].some(n => document.getElementById('hf_mouth_' + n).classList.contains('talking')));
      // let one verse run into its first line so the talking check has something to see
      await w(/beat drops/.test(line()) && !talkingDuring.marx ? 5600 : 0);
      ['marx','durkheim','weber'].forEach(n => {
        const el = document.getElementById('hf_mouth_' + n);
        if (el && el.classList.contains('talking')) talkingDuring[n] = (talkingDuring[n] || 0) + 1;
      });
      if (document.getElementById('interlude')) break;   // never skip Professor G by accident
      space();
    }
    out.talkingDuring = talkingDuring;
    out.introMouthsStill = introMouths.length > 0 && introMouths.every(x => !x);
    out.versesPlayed = ['marx','durkheim','weber'].every(n => played.includes('rap-' + n + '.mp3'));
    out.tobiVoiced = played.some(c => /^vo-tobi-/.test(c));
    const il = document.getElementById('interlude');
    out.cutscene = !!il;
    await w(6000);     // the first stanza comes in at 5.1 s, after the intro bars
    out.lyrics = il ? (il.querySelector('.rap-lyrics') || {}).textContent : '';
    window.dispatchEvent(new KeyboardEvent('keydown', { code:'Escape', key:'Escape', bubbles:true }));
    await w(1200);
    out.cutsceneGone = !document.getElementById('interlude');
    out.stageOff = !document.body.classList.contains('cb-stage');
    out.rapDone = !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.rapDone;
    out.after = /stopped nodding/.test(line());
    space();
    verb(/look/i).click(); hot('meter').click(); await w(200);
    out.meterBroken = /bent/.test(line());
    verb(/use/i).click(); hot('weber').click(); await w(200);
    out.writeOpenly = /plain view/.test(line());
    // the encore: Talk To Tobi offers the whole battle again
    verb(/talk/i).click(); hot('tobi').click(); await w(300);
    const again = [...document.querySelectorAll('button.choice')].find(b => /again/i.test(b.textContent));
    out.encoreOffered = !!again;
    if (again){ again.click(); await w(500); }
    out.encoreStarts = document.body.classList.contains('cb-stage') && /Iconic/.test(line());
    out.crowd = !!document.querySelector('#hf_sceneWrap .cb-crowd');
    return out;
  })()`);

  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const t = r.talkingDuring || {};
  const ok = r && t.marx && r.introMouthsStill && r.stageOn && r.stageOff && r.tobiHere && r.profgHere && r.djHere && r.djLook && r.mouths && r.noBeat && r.tobiHosts && r.usbLine
          && r.versesPlayed && r.tobiVoiced && r.cutscene && /real social scientist/i.test(r.lyrics || '')
          && r.cutsceneGone && r.rapDone && r.after && r.meterBroken && r.writeOpenly && r.encoreOffered && r.encoreStarts && r.crowd && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  process.exit(ok ? 0 : 1);
})();
