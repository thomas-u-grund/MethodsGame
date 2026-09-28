// Durkheim in the Ethics Tribunal (author, 2026-09-28): he can be talked to, in the voice of
// his rap-battle verse, about the rap battle and the ecological fallacy -- every line voiced.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['pen','folder','lunchbag'], flags:{ corridorDone:true, h27issued:true, slipSealed:true, act3IntroSeen:true } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const out = {}, heard = [];
    const q = window.CODEBOOK_PLAY_LINE_QUEUE;
    window.CODEBOOK_PLAY_LINE_QUEUE = function(c){ heard.push.apply(heard, c || []); return q.apply(this, arguments); };
    window.CODEBOOK_START(); await w(600);
    document.querySelector('button.campus-hotspot[title^="The Ethics Tribunal"]').click(); await w(900);
    const hs = document.querySelector('#et_sceneWrap .hotspot[data-id="cameo"]');
    out.talkPrimary = hs.dataset.primary === 'talkto';
    const line = () => document.getElementById('et_line').textContent;
    const ch = re => [...document.querySelectorAll('#et_choices button')].find(b => new RegExp(re,'i').test(b.textContent)).click();
    hs.click(); await w(300);
    out.greets = /where numbers come from/.test(line());
    ch('rap battle'); await w(200); out.rap = /Rates, not people/.test(line());
    ch('Protestants'); await w(200); out.fallacy = /ecological fallacy/.test(line());
    ch('attendance'); await w(200); out.both = /runs both ways/.test(line());
    ch('Goodbye'); await w(200); out.bye = /social facts/.test(line());
    out.voiced = heard.filter(c => /vo-durkheim/.test(c)).length === 5;
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r && Object.values(r).every(v => v === true) && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
