// Each act plays its own interlude exactly once, on the first map after THAT act opens.
//
// The regression this guards: the Act III interlude used to be triggered by its own block
// keyed to `corridorDone` -- the flag that ends Act I -- so finishing Act I played Act II's
// interlude and then Act III's straight over the top of it, and the player was told they
// needed data before they had been asked for a theory. Checking the rendered text alone did
// not catch that (the second interlude simply replaced the first), so this asserts on WHICH
// intro flags get set, which is the thing that actually went wrong.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const ALL = ['act2IntroSeen','act3IntroSeen','act4IntroSeen','act5IntroSeen'];

async function run(flags, expect) {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({inventory:['folder'], flags: ${JSON.stringify(flags)} }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await wait(1400);
    const txt = document.body.textContent;
    const seen = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    return { showing: /${expect}/i.test(txt),
             flags: ${JSON.stringify(ALL)}.filter(f => seen[f]) };
  })()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const e = p.errors.slice(); p.close(); return { ...r, errors: e };
}

// What each act's save looks like at the moment that act opens.
const AFTER_I   = { corridorDone:true };
const AFTER_II  = { corridorDone:true, act2IntroSeen:true, slipSealed:true, h27issued:true };
const AFTER_III = { ...AFTER_II, act3IntroSeen:true, actIIIDone:true };
const AFTER_IV  = { ...AFTER_III, act4IntroSeen:true, actIVDone:true };

(async () => {
  const a2 = await run(AFTER_I,   'Most people never get one');
  const a3 = await run(AFTER_II,  'permission');
  const a4 = await run(AFTER_III, 'Two emails arrive');
  const a5 = await run(AFTER_IV,  'Infinite Monkey Project');

  const rows = [['II', a2, ['act2IntroSeen']],
                ['III', a3, ['act2IntroSeen','act3IntroSeen']],
                ['IV', a4, ['act2IntroSeen','act3IntroSeen','act4IntroSeen']],
                ['V',  a5, ALL]];
  let ok = true;
  for (const [name, r, want] of rows){
    const got = r.flags.slice().sort().join(',');
    const exp = want.slice().sort().join(',');
    const good = r.showing && got === exp && !r.errors.length;
    if (!good) ok = false;
    console.log(`act ${name.padEnd(3)} showing=${r.showing} flags=[${got}] expected=[${exp}]` +
                (r.errors.length ? ' ERRORS: ' + r.errors.join(' | ') : ''));
  }
  console.log(ok ? 'PASS' : 'FAIL');
  process.exit(ok ? 0 : 1);
})();
