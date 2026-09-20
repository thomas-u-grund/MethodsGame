const { connect } = require('./cdp');
(async () => {
  const p = await connect('http://localhost:8934/the-secret-of-the-codebook.html?cb=' + Date.now());
  // plant an OLD save, reload, and see whether progress survived the renumbering
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder'], flags:{ corridorDone:true, surveyDone:true, ethicsDone:true,
    mensaDone:true, fieldworkDone:true, h27issued:true, actIIDone:true, act2IntroSeen:true }}))`);
  await p.send('Page.navigate', { url: 'http://localhost:8934/the-secret-of-the-codebook.html?cb=' + Date.now() });
  await new Promise(r => setTimeout(r, 4000));
  const r = await p.evaluate(`(() => { const f = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    return { actIIIDone: f.actIIIDone, act3IntroSeen: f.act3IntroSeen,
             oldGone: f.actIIDone === undefined && f.act2IntroSeen === undefined }; })()`);
  console.log(JSON.stringify(r), 'errors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.actIIIDone === true && r.act3IntroSeen === true && r.oldGone && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
