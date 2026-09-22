// The MECHANISM box is written behind the Max Weber portrait, and without it the
// Prediction Slip cannot be sealed and Act III never opens. So every reasonable way of
// approaching the portrait has to work, and exactly one thing should be refused.
//
// This shipped broken. The guard read:
//     if (item !== 'pen' && !(verb === 'use' && !item)) refuse
// which lets Talk To into the branch and then bounces it -- with nothing armed,
// `item !== 'pen'` is true and the verb is not 'use'. Talking to a portrait is the first
// thing anyone tries on a portrait, and it was the one approach that could not work.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

// mode -> [should it open the two-sentence choice?]
const MODES = { talkto: true, use: true, usepen: true, usewrong: false, nopen: false };

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:1000, deviceScaleFactor:1, mobile:false });
  const out = {};
  for (const mode of Object.keys(MODES)) {
    const inv = mode === 'nopen' ? ['folder','blankcard'] : ['folder','pen','blankcard','hourglass'];
    await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
      inventory:${JSON.stringify(inv)}, flags:{ corridorDone:true, act2IntroSeen:true }}))`);
    await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
    out[mode] = await p.evaluate(`(async () => {
      const w = ms => new Promise(r => setTimeout(r, ms));
      const s = document.getElementById('bootSplash'); if (s) s.remove();
      window.CODEBOOK_START(); await w(900);
      [...document.querySelectorAll('button.campus-hotspot')]
        .find(b => b.title.indexOf('The Hall of Founders') === 0).click();
      await w(1600);
      const mode = ${JSON.stringify(mode)};
      const vb = re => [...document.querySelectorAll('#hf_verbGrid button')].find(b => re.test(b.textContent));
      if (mode === 'talkto') vb(/talk to/i).click();
      else {
        vb(/^use$/i).click();
        if (mode === 'usepen')   document.querySelector('#hf_sideInv .side-inv-slot[data-item="pen"]').click();
        if (mode === 'usewrong') document.querySelector('#hf_sideInv .side-inv-slot[data-item="hourglass"]').click();
      }
      document.querySelector('#hf_sceneWrap button.hotspot[data-id="weber"]').click();
      await w(700);
      return { line: (document.getElementById('hf_line') || {}).textContent.slice(0, 70),
               choices: [...document.querySelectorAll('#hf_choices button')].length };
    })()`);
  }

  // ...and the sound sentence really does fill the box. Fresh run: the loop above ends in
  // the no-pen state, which by design offers nothing to click.
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder','pen','blankcard'], flags:{ corridorDone:true, act2IntroSeen:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const filled = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    window.CODEBOOK_START(); await w(900);
    [...document.querySelectorAll('button.campus-hotspot')]
      .find(b => b.title.indexOf('The Hall of Founders') === 0).click();
    await w(1600);
    [...document.querySelectorAll('#hf_verbGrid button')].find(b => /talk to/i.test(b.textContent)).click();
    document.querySelector('#hf_sceneWrap button.hotspot[data-id="weber"]').click();
    await w(700);
    const sound = [...document.querySelectorAll('#hf_choices button')]
      .find(b => /worked examples/i.test(b.textContent));
    if (!sound) return { err: 'no sound sentence offered' };
    sound.click(); await w(600);
    const slip = JSON.parse(localStorage.getItem('codebook_save_v1')).flags.predictionSlip || {};
    return { mechanism: !!slip.mechanism, sound: slip.mechanismSound === true };
  })()`);

  console.log(JSON.stringify({ ...out, filled }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = Object.keys(MODES).every(m => (out[m].choices === 2) === MODES[m])
          && /declines to engage/.test(out.usewrong.line)
          && /something to write with/i.test(out.nopen.line)
          && filled.mechanism && filled.sound
          && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
