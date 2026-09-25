// The Stockholm call has ONE requirement since ROADMAP 8zl (W1): the seven-second hourglass.
// The Nobel procedure and Tobi's phrasebook, which used to be two more failed calls, are gone.
//   1. Without the hourglass he hangs up ("You are not calling internationally").
//   2. With it -- and nothing else -- the call gets him out of the workshop.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

async function call(p, inventory){
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:${JSON.stringify(inventory)},
    flags:{ corridorDone:true, act2IntroSeen:true, wsExtension:true, tobiRoom:'' }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  return p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_START(); await w(900);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /Library/.test(b.title)).click(); await w(1600);
    const ch = re => { const b = [...document.querySelectorAll('#lb_choices button')].find(x => re.test(x.textContent)); if (b) b.click(); return !!b; };
    [...document.querySelectorAll('#lb_verbGrid button')].find(b => /talk to/i.test(b.textContent)).click();
    document.querySelector('[data-id="kira"]').click(); await w(400);
    ch(/place a call/); await w(300); ch(/4173/); await w(500);
    const first = document.getElementById('lb_line').textContent;
    ch(/This is Stockholm/); await w(400); ch(/remains under discussion/); await w(400); ch(/fika/); await w(400); ch(/confidential consultation/); await w(500);
    return { first: first.slice(0, 300), out: !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.wsFeldstromOut };
  })()`);
}

(async () => {
  const p = await connect(U + Date.now());
  const without = await call(p, ['folder']);
  const withGlass = await call(p, ['folder', 'hourglass']);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  console.log(JSON.stringify({ without, withGlass }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = !without.out && /not calling internationally/i.test(without.first) && withGlass.out && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
