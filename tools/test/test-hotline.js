// The Schnitzel Hotline (author, 2026-09-28): the cook's number on the first talk at his counter;
// from then on the phone can call him wherever he is not; an order, and a voicebox every third call.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder','pen','profcard','mobile'], flags:{ corridorDone:true, h27issued:true, slipSealed:true, act3IntroSeen:true } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const out = {}, flags = () => JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    const go = async t => { document.getElementById('backToMap') && document.getElementById('backToMap').click(); await w(800);
      [...document.querySelectorAll('button.campus-hotspot')].find(b => new RegExp(t).test(b.title)).click(); await w(1800); };
    window.CODEBOOK_START(); await w(700);
    await go('^The Mensa');
    [...document.querySelectorAll('#mn_verbGrid button')].find(b => /talk/i.test(b.textContent)).click();
    document.querySelector('#mn_sceneWrap [data-id="counters"]').click(); await w(400);
    out.gotNumber = !!flags().cookNumber && /Schnitzel hotline/i.test(document.getElementById('mn_line').textContent);
    // in the Mensa he is right there
    document.querySelector('.side-inv-slot[data-item="mobile"]').click(); await w(300);
    [...document.querySelectorAll('.cb-contacts .row')].find(r => /Schnitzel/.test(r.textContent)).click(); await w(2400);
    out.hereJoke = /can see you/.test(document.querySelector('.cb-call .ln').innerHTML);
    [...document.querySelectorAll('.cb-call .btns button')].find(b => /Hang up/.test(b.textContent)).click(); await w(500);
    await go('^The Ethics Tribunal');
    document.querySelector('.side-inv-slot[data-item="mobile"]').click(); await w(300);
    out.listed = [...document.querySelectorAll('.cb-contacts .row')].map(r => r.textContent).some(t => /Schnitzel Hotline/.test(t));
    [...document.querySelectorAll('.cb-contacts .row')].find(r => /Schnitzel/.test(r.textContent)).click(); await w(2700);
    [...document.querySelectorAll('.cb-call .btns button')].find(b => /One schnitzel/.test(b.textContent)).click(); await w(300);
    out.ordered = flags().schnitzelOrders === 1 && /Where to/.test(document.querySelector('.cb-call .ln').innerHTML);
    out.waiting = !!flags().schnitzelWaiting && /at the counter/.test(document.querySelector('.cb-call .ln').innerHTML);
    [...document.querySelectorAll('.cb-call .btns button')].find(b => /hang up/i.test(b.textContent)).click(); await w(500);
    // pick it up at the Mensa counter (2026-09-29)
    [...document.querySelectorAll('.cb-call .btns button')].forEach(b => { if (/hang up/i.test(b.textContent)) b.click(); }); await w(400);
    await go('^The Mensa');
    [...document.querySelectorAll('#mn_verbGrid button')].find(b => /talk/i.test(b.textContent)).click();
    document.querySelector('#mn_sceneWrap [data-id="counters"]').click(); await w(2200);
    out.pickedUp = JSON.parse(localStorage.getItem('codebook_save_v1')).inventory.includes('schnitzel') && !flags().schnitzelWaiting;
    await go('^The Ethics Tribunal');
    for (const k of [1, 2]){ document.querySelector('.side-inv-slot[data-item="mobile"]').click(); await w(300);
      [...document.querySelectorAll('.cb-contacts .row')].find(r => /Schnitzel/.test(r.textContent)).click(); await w(3700);
      if (k === 2) out.voicebox = /press one/.test(document.querySelector('.cb-call .ln').innerHTML);
      [...document.querySelectorAll('.cb-call .btns button')].find(b => /Hang up/.test(b.textContent)).click(); await w(500); }
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && Object.values(r).every(v => v === true) && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
