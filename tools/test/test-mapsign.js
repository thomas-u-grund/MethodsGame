// The pond sign and swan must update the moment the swan is painted, not an act later.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
async function run(flags) {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({inventory:[], flags:${JSON.stringify(flags)}}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));
    window.CODEBOOK_START();
    let sign=null, bg=null;
    for (let i=0;i<40;i++){                       // the boot overlay can sit on top for a while
      await w(250);
      const ss=[...document.querySelectorAll('.map-sign')].filter(e=>/Probability Pond/.test(e.textContent));
      const ii=[...document.querySelectorAll('.map-wrap img')];
      if (ss.length && ii.length){ sign=ss[ss.length-1]; bg=ii[ii.length-1]; break; }
      window.CODEBOOK_START();
    }
    const swan = [...document.querySelectorAll('.map-wrap img')].some(i => /black-swan/.test(i.getAttribute('src')||''));
    return {sign: sign?sign.textContent:'none', map: bg?bg.getAttribute('src'):'none', blackSwan: swan};})()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const e=p.errors.slice(); p.close(); return {...r, errors:e};
}
(async()=>{
  const before = await run({});
  const after  = await run({ pondDone:true });
  console.log('before painting:', JSON.stringify(before));
  console.log('after painting: ', JSON.stringify(after));
  // There is one campus painting now, not one per act -- keeping three consistent maps
  // meant keeping thirty-four coordinates valid against each. What must still change is
  // the picture agreeing with the sign: the sign claims the pond is literally 50/50, so a
  // black swan overlay has to appear on the map at the same moment.
  const ok = /Still 50\/50/.test(before.sign) && !before.blackSwan
    && /literally 50\/50/.test(after.sign) && /FALSIFIED/.test(after.sign) && after.blackSwan
    && !before.errors.length && !after.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok?0:1);
})();
