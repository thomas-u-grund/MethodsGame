// WP-0.5: the Doorman's gate must open when his line ENDS or is SKIPPED, never on a fixed timer.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

async function run(skip) {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
     inventory:['question'], flags:{ philosopherConvinced:true, pondDone:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() });
  await new Promise(r => setTimeout(r, 4000));
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await wait(500);
    document.querySelector('button.campus-hotspot[title^="Causality Corridor"]').click();
    await wait(900);
    [...document.querySelectorAll('#cc_verbGrid button, #cc_verbGrid .verb')]
      .find(b => /use/i.test(b.textContent)).click();
    document.querySelector('[data-extra="bell"]').click();
    await wait(1600);                                   // he is mid-line
    const speaking = /Question/.test(document.getElementById('cc_line').textContent);
    const t0 = performance.now();
    if (${skip}) window.CODEBOOK_STOP_LINE_AUDIO();     // exactly what Space does
    for (let i = 0; i < 200; i++) {
      await wait(100);
      if (/Case \\d+ of/.test(document.getElementById('cc_caseTag').textContent)) break;
    }
    return { speaking, ms: Math.round(performance.now() - t0),
             tag: document.getElementById('cc_caseTag').textContent };
  })()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const errs = p.errors.slice(); p.close();
  return { ...r, errors: errs };
}

(async () => {
  const s = await run(true), n = await run(false);
  console.log('skipped: ', JSON.stringify(s));
  console.log('unskipped:', JSON.stringify(n));
  const ok = s.speaking && /Case/.test(s.tag) && s.ms < 3000 && !s.errors.length
          && n.speaking && /Case/.test(n.tag) && n.ms > 6000 && !n.errors.length;
  console.log(ok ? 'PASS — gate opens on skip (fast) and on line end (in its own time)' : 'FAIL');
  process.exit(ok ? 0 : 1);
})();
