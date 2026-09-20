// WP-2.3: the Act II enrolment register is the correct sampling frame.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
async function run(inv) {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory: ${JSON.stringify(inv)}, flags:{ corridorDone:true, h27issued:true, ethicsDone:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await new Promise(r => setTimeout(r, 2500));
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await wait(500);
    document.querySelector('button.campus-hotspot[title^="The Mensa"]').click(); await wait(800);
    const use = id => { document.querySelector('#mn_sideInv .side-inv-slot[data-item="'+id+'"]').click();
                        document.querySelector('[data-id="frame"]').click(); };
    const line = () => document.getElementById('mn_line').textContent;
    const out = {};
    if (${JSON.stringify(inv)}.includes('enrolreg')) { use('enrolreg'); await wait(700); out.direct = line().slice(0,200); }
    else {
      use('pseudolist'); await wait(600);
      out.installed = /A POPULATION/.test(line());
      use('magnifyingglass'); await wait(700);
      out.reveal = line().slice(-190);
    }
    out.flags = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    return out;
  })()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const errs = p.errors.slice(); p.close(); return { ...r, errors: errs };
}
(async () => {
  const a = await run(['enrolreg','magnifyingglass']);
  const b = await run(['pseudolist','magnifyingglass']);
  console.log('register straight in:\n ', a.direct, '\n  checked=', a.flags.mnListChecked);
  console.log('\nofficial list then magnifier:\n ', b.reveal, '\n  checked=', b.flags.mnListChecked);
  const ok = /right.{0,3} hundred and forty/.test(a.direct) && a.flags.mnListChecked
          && b.installed && b.flags.mnListChecked && /right people/.test(b.reveal)
          && !a.errors.length && !b.errors.length;
  console.log('\n' + (ok ? 'PASS' : 'FAIL')); process.exit(ok ? 0 : 1);
})();
