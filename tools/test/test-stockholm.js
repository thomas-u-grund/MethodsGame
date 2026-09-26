// The Stockholm call (ROADMAP 8zy): the whole puzzle is in the Library. KIRA puts you
// through; what makes you Stockholm is the phrasebook in the stacks.
//   1. Without the book he asks for some Swedish, and "Abba" gets you hung up on.
//   2. With it, the book's phrase gets him out of the workshop. The call is a split screen.
//   3. Picking the book off the stacks gives it to you.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

async function call(p, inventory, takeBook){
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:${JSON.stringify(inventory)},
    flags:{ corridorDone:true, act2IntroSeen:true, actRenumberMigrated:true, tobiRoom:'' }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  return p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_START(); await w(900);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => /Library/.test(b.title)).click(); await w(1600);
    const ch = re => { const b = [...document.querySelectorAll('#lb_choices button')].find(x => re.test(x.textContent)); if (b) b.click(); return !!b; };
    const verb = v => [...document.querySelectorAll('#lb_verbGrid button')].find(b => new RegExp(v, 'i').test(b.textContent)).click();
    let gotBook = null;
    if (${takeBook ? 'true' : 'false'}){
      const spine = !!document.getElementById('lb_book');
      verb('pick up'); document.querySelector('[data-id="stacks"]').click(); await w(500);
      gotBook = spine && !document.getElementById('lb_book') && JSON.parse(localStorage.getItem('codebook_save_v1')).inventory.includes('swedebook');
    }
    verb('talk to'); document.querySelector('[data-id="kira"]').click(); await w(400);
    ch(/place a call/); await w(300); ch(/Feldstrom, please/); await w(3200);
    const split = !!document.querySelector('.lb-call #lb_callFeld');
    ch(/This is Stockholm/); await w(400);
    const asks = /Say something in Swedish/.test(document.getElementById('lb_line').textContent);
    let hungUp = false;
    if (ch(/Abba/)){ await w(400); hungUp = /Anybody can say Abba/.test(document.getElementById('lb_line').textContent); }
    else { ch(/lagom/); await w(400); ch(/remains under discussion/); await w(400); ch(/confidential consultation/); await w(500); }
    return { split, asks, hungUp, gotBook, out: !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.wsFeldstromOut };
  })()`);
}

(async () => {
  const p = await connect(U + Date.now());
  const without = await call(p, ['folder'], false);
  const withBook = await call(p, ['folder'], true);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  console.log(JSON.stringify({ without, withBook }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = without.split && without.asks && without.hungUp && !without.out
    && withBook.gotBook && withBook.asks && withBook.out && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
