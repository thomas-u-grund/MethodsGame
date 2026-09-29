// Course bonus points (ROADMAP 8-BONUS), the game's side: opened through a course link, a finished act
// with an open deadline shows a claim button on the map; a claimed or expired act does not; without a
// course link nothing shows. The service itself is not reached (a dead URL: the cached course is used).
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html';
(async () => {
  const p = await connect(U + '?cb=' + Date.now());
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source:
    `Object.defineProperty(window, 'CB_BONUS', { value: { url:'http://127.0.0.1:9', anonKey:'test', game:'${U}' }, writable:false });` });
  const COURSE = { code:'TESTAB12', course_name:'Methods I', university:'RWTH', mode:'acts',
    deadlines:{ '1':'2099-01-01', '2':'2099-01-01', '3':'2000-01-01', '4':'2099-01-01' } };
  const run = async (query, extra) => {
    await p.evaluate(`localStorage.clear();
      localStorage.setItem('cb_course_info', ${JSON.stringify(JSON.stringify(COURSE))});
      ${extra || ''}
      localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder'], flags:{ corridorDone:true, whirlpoolDone:true,
        slipSealed:true, actIIIDone:true, act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true } }))`);
    await p.send('Page.navigate', { url: U + query }); await p.ready();
    return p.evaluate(`(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
      const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
      window.CODEBOOK_START(); await w(900);
      const il = document.getElementById('interlude'); if (il) il.remove();
      return [...document.querySelectorAll('.cb-bonus a')].map(a => a.textContent.trim() + ' | ' + a.getAttribute('href')); })()`);
  };
  const withLink = await run('?course=testab12');
  const claimedOne = await run('?course=TESTAB12', `localStorage.setItem('cb_claimed_TESTAB12_1', '1');`);
  const noLink = await run('?cb=' + Date.now(), `localStorage.removeItem('cb_course');`);
  console.log({ withLink, claimedOne, noLink }, '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.clear()`);
  // acts 1 and 2 are done and open; act 3 is done but expired; act 4 is not done yet
  const ok = withLink.length === 2 && /Act I \|/.test(withLink[0]) && /Act II \|/.test(withLink[1])
    && withLink.every(s => /bonus\/claim\.html\?course=TESTAB12&act=\d&key=[0-9a-f]{32}$/.test(s))
    && claimedOne.length === 1 && /Act II/.test(claimedOne[0]) && noLink.length === 0;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
