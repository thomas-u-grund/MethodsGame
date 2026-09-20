// WP-2.4: the Office hand-off out of the data act.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder'], flags:{ corridorDone:true, whirlpoolDone:true, profAtOffice:true,
      actIIIDone:true, h27issued:true, surveyDone:true, ethicsDone:true, mensaDone:true, fieldworkDone:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await new Promise(r => setTimeout(r, 4000));
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const out = {};
    window.CODEBOOK_START(); await wait(500);
    document.querySelector('button.campus-hotspot[title^="The Seven-Second Office"]').click(); await wait(800);
    const line = () => document.getElementById('wp_line').textContent;
    const btns = () => [...document.querySelectorAll('#wp_choices button')];
    out.asks = /where exactly did those numbers come from/i.test(line());
    out.options = btns().length;
    btns()[0].click(); await wait(400);                       // "it's a big dataset"
    out.rejectedSize = /not big/i.test(line());
    btns().find(b=>/Try again/.test(b.textContent)).click(); await wait(400);
    btns()[1].click(); await wait(400);                       // "the system exported them"
    out.rejectedSystem = /Systems do not choose/i.test(line());
    btns().find(b=>/Try again/.test(b.textContent)).click(); await wait(400);
    btns()[2].click(); await wait(600);                       // frame, draw, response rate
    out.stamped = /QUESTION HAS DATA/.test(line());
    out.flag = !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.provenanceGiven;
    btns()[0].click(); await wait(400);
    out.pointsAtActIV = /basement/i.test(line());
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.asks && r.options === 3 && r.rejectedSize && r.rejectedSystem && r.stamped
          && r.flag && r.pointsAtActIV && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
