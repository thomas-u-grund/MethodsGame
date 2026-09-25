// Getting the Professor out of her office on purpose (ROADMAP 8zg). Losing the interview is
// the only other way, and it stops being possible once she has given you the question -- so
// a player who still needed the USB stick or the pen off her desk was stuck.
//   1. After the question: Talk To her offers the Vossberg/projector line; she leaves.
//   2. With her gone, the desk items can be taken.
//   3. Coming back later, she is at her desk again (nothing is saved).
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['question'], flags:{ profAtOffice:true, lecturerGone:true, whirlpoolDone:true, actRenumberMigrated:true, tobiRoom:'' } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const enter = `(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove(); window.CODEBOOK_START(); await w(900);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /Office/.test(b.title)).click(); await w(2500); })()`;
  await p.evaluate(enter);
  const r = await p.evaluate(`(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
    const verb = re => [...document.querySelectorAll('button')].find(b => re.test(b.textContent.trim()) && b.offsetParent);
    const out = {};
    const prof = document.getElementById('wp_prof') || document.querySelector('[data-voice="prof"]');
    out.hereBefore = !!prof && getComputedStyle(prof).display !== 'none';
    verb(/^talk to$/i).click(); document.querySelector('[data-id="prof"]').click(); await w(1500);
    const send = [...document.querySelectorAll('button.choice')].find(b => /projector/i.test(b.textContent));
    out.offered = !!send;
    if (send){ send.click(); }
    for (let i = 0; i < 30; i++){ await w(500); if (/office is empty/i.test((document.getElementById('wp_line') || {}).textContent || '')) break; }
    out.line = ((document.getElementById('wp_line') || {}).textContent || '').slice(0, 60);
    out.goneAfter = !!prof && getComputedStyle(prof).display === 'none';
    verb(/^pick up$/i).click(); document.querySelector('[data-id="usb"]').click(); await w(2500);
    verb(/^pick up$/i).click(); document.querySelector('[data-id="penjar"]').click(); await w(2500);
    const inv = JSON.parse(localStorage.getItem('codebook_save_v1')).inventory;
    out.gotUsb = inv.indexOf('usb') !== -1; out.gotPen = inv.indexOf('pen') !== -1;
    return out; })()`);
  // come back: she is at her desk again
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  await p.evaluate(enter);
  r.backAgain = await p.evaluate(`(() => { const prof = document.getElementById('wp_prof') || document.querySelector('[data-voice="prof"]'); return !!prof && getComputedStyle(prof).display !== 'none'; })()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = r.hereBefore && r.offered && r.goneAfter && r.gotUsb && r.gotPen && r.backAgain && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
