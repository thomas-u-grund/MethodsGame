// Each act plays its own interlude exactly once, on the first map after the act opens.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
async function run(flags, expect) {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({inventory:['folder'], flags: ${JSON.stringify(flags)} }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await new Promise(r=>setTimeout(r,4000));
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await wait(1400);
    const txt = document.body.textContent;
    const seen = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    return { showing: /${expect}/i.test(txt),
             flags: ['act2IntroSeen','act4IntroSeen','act5IntroSeen'].filter(f => seen[f]) };
  })()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const e = p.errors.slice(); p.close(); return { ...r, errors: e };
}
(async () => {
  const a2 = await run({ corridorDone:true }, 'other ideas');
  const a4 = await run({ corridorDone:true, act2IntroSeen:true, act3IntroSeen:true, slipSealed:true,
                          h27issued:true, actIIIDone:true }, 'nobody is standing in your way');
  const a5 = await run({ corridorDone:true, act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true,
                          slipSealed:true, h27issued:true, actIIIDone:true, actIVDone:true }, 'somebody has to write it');
  console.log('act II:', JSON.stringify(a2));
  console.log('act IV:', JSON.stringify(a4));
  console.log('act V :', JSON.stringify(a5));
  const ok = a2.showing && a4.showing && a5.showing && ![a2,a4,a5].some(x=>x.errors.length);
  console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok ? 0 : 1);
})();
