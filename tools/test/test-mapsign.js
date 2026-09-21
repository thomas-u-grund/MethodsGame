// The pond sign and swan must update the moment the swan is painted, not an act later.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
async function run(flags) {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({inventory:[], flags:${JSON.stringify(flags)}}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await new Promise(r=>setTimeout(r,4500));
  const r = await p.evaluate(`(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));
    window.CODEBOOK_START(); await w(1800);
    const signs=[...document.querySelectorAll('.map-sign')].filter(e=>/Probability Pond/.test(e.textContent)); const sign=signs[signs.length-1];
    const imgs=[...document.querySelectorAll('.map-wrap img')]; const bg=imgs[imgs.length-1];
    return {sign: sign?sign.textContent:'none', map: bg?bg.getAttribute('src'):'none'};})()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const e=p.errors.slice(); p.close(); return {...r, errors:e};
}
(async()=>{
  const before = await run({});
  const after  = await run({ pondDone:true });
  console.log('before painting:', JSON.stringify(before));
  console.log('after painting: ', JSON.stringify(after));
  const ok = /Still 50\/50/.test(before.sign) && /act1/.test(before.map)
    && /literally 50\/50/.test(after.sign) && /FALSIFIED/.test(after.sign) && /act3/.test(after.map)
    && !before.errors.length && !after.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok?0:1);
})();
