// Granovetter at the Poster Session (author, 2026-09-28): he holds real neckties, talks (no Look At),
// and gives you a weak tie -- a gimmick item. Every line voiced.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder','pen'], flags:{ corridorDone:true, slipSealed:true,
    actIIIDone:true, actIVDone:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true, writingDone:true } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const out = {}, heard = [];
    const q = window.CODEBOOK_PLAY_LINE_QUEUE;
    window.CODEBOOK_PLAY_LINE_QUEUE = function(c){ heard.push.apply(heard, c || []); return q.apply(this, arguments); };
    window.CODEBOOK_START(); await w(700);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /^The Poster Session/.test(b.title)).click(); await w(2000);
    const il = document.getElementById('interlude'); if (il) il.remove();
    out.sprite = !!document.getElementById('ps_spr_granovetter');
    const hs = document.querySelector('#ps_sceneWrap .hotspot[data-id="cameo"]');
    out.talkOnly = hs.dataset.verbs === 'talkto';
    const line = () => document.getElementById('ps_line').textContent;
    const ch = re => [...document.querySelectorAll('#ps_choices button')].find(b => new RegExp(re,'i').test(b.textContent)).click();
    hs.click(); await w(300);
    out.greets = /Weak ones only/.test(line());
    ch('neckties'); await w(200); out.why = /strength of weak ties/.test(line());
    ch('have one'); await w(300); out.gave = JSON.parse(localStorage.getItem('codebook_save_v1')).inventory.includes('weaktie');
    out.noSecond = ![...document.querySelectorAll('#ps_choices button')].some(b => /have one/i.test(b.textContent));
    ch('Goodbye'); await w(200); out.bye = /Network responsibly/.test(line());
    out.voiced = heard.filter(c => /vo-granovetter/.test(c)).length === 4;
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && Object.values(r).every(v => v === true) && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
