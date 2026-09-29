// Finished acts' rooms close (author, 2026-09-29): in Act IV only the Act IV rooms and the Office are
// on the map; in Act V only Act V's; the Office is always there.
process.env.CB_REAL_CLOSURE = '1';
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  const out = {};
  for (const [act, flags] of [['IV', { corridorDone:true, slipSealed:true, actIIIDone:true, act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true }],
                              ['V',  { corridorDone:true, slipSealed:true, actIIIDone:true, actIVDone:true, act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true }]]){
    await p.evaluate('localStorage.setItem("codebook_save_v1", ' + JSON.stringify(JSON.stringify({ inventory:['folder'], flags })) + ')');
    await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
    out[act] = JSON.parse(await p.evaluate(`(async()=>{ const sp=document.getElementById('bootSplash'); if(sp) sp.remove(); window.CODEBOOK_START(); await new Promise(r=>setTimeout(r,900));
      return JSON.stringify([...document.querySelectorAll('button.campus-hotspot')].map(b => b.title.split(' —')[0])); })()`));
  }
  const r = {
    ivHasOffice: out.IV.includes('The Seven-Second Office'),
    ivHasCasino: out.IV.includes('Statistics Basement'),
    ivNoMensa: !out.IV.includes('The Mensa'),
    ivNoLibrary: !out.IV.includes('The Library'),
    vHasPosters: out.V.includes('The Poster Session'),
    vNoBureau: !out.V.includes('The Bureau of Implications'),
    vHasOffice: out.V.includes('The Seven-Second Office')
  };
  console.log(JSON.stringify(r, null, 1), JSON.stringify(out), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = Object.values(r).every(v => v) && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
