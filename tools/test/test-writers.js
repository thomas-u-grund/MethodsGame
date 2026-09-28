// The Writing Room as a writing hall (author, 2026-09-28): students, an assistant professor, the cook
// and Howard Becker are each clickable, and every look and line is voiced.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder','pen','interpretation','readinglist'], flags:{ corridorDone:true, slipSealed:true,
    actIIIDone:true, actIVDone:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const out = { missing:[] };
    window.CODEBOOK_START(); await w(700);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /^The Writing Room/.test(b.title)).click(); await w(2000);
    const il = document.getElementById('interlude'); if (il) il.remove();
    const verb = v => [...document.querySelectorAll('#wr_verbGrid button')].find(b => new RegExp(v,'i').test(b.textContent)).click();
    const line = () => document.getElementById('wr_line').innerHTML;
    for (const id of ['stCurly','stHead','stAsleep','asst','cook','becker']){
      for (const v of ['look at','talk to','talk to']){
        verb(v); document.querySelector('#wr_sceneWrap [data-id="' + id + '"]').click(); await w(150);
        if (!window.CODEBOOK_VO_CLIPS(line()).length) out.missing.push(id + ' ' + v);
      }
    }
    out.cookBook = /SCHNITZEL/.test(document.querySelector('#wr_sceneWrap [data-id="cook"]').dataset.label + ' ' + (verb('look at'), document.querySelector('#wr_sceneWrap [data-id="cook"]').click(), line()));
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && !r.missing.length && r.cookBook && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
