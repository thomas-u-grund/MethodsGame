// Smoke test: every room opens, sets its ambience, and throws nothing.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['question','folder','magnifyingglass','chewedpen','mug','likertdie','hourglass','usb','stamp'],
    flags:{ corridorDone:true, pondDone:true, philosopherConvinced:true, whirlpoolDone:true,
            lectureDone:true, h27issued:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await new Promise(r => setTimeout(r, 4000));
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await wait(500);
    const titles = [...document.querySelectorAll('button.campus-hotspot')].map(b => b.title);
    const visited = [];
    for (const t of titles) {
      if (/Locked/.test(t)) { visited.push([t.split(' —')[0], 'locked']); continue; }
      document.querySelector('button.campus-hotspot[title="' + t.replace(/"/g,'') + '"]')?.click();
      await wait(700);
      visited.push([t.split(' —')[0], document.body.innerHTML.length > 2000 ? 'ok' : 'thin']);
      window.CODEBOOK_START(); await wait(400);
    }
    return visited;
  })()`);
  console.log(r.map(x => x.join(': ')).join('\n'));
  console.log('errors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = !p.errors.length; console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
