// Pose for Tobi -> the post appears -> he will then get the scissors out of the Nurse.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder'],
    flags:{ corridorDone:true, slipSealed:true, h27issued:true,
            act2IntroSeen:true, act3IntroSeen:true, tobiRoom:'surveylab' }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp=document.getElementById('bootSplash'); if(sp) sp.remove();
    const out = {};
    window.CODEBOOK_START(); await w(700);
    // pin him after the reroll
    const save=JSON.parse(localStorage.getItem('codebook_save_v1')); save.flags.tobiRoom='surveylab';
    localStorage.setItem('codebook_save_v1', JSON.stringify(save));
    window.CODEBOOK_START(); await w(600);
    document.querySelector('button.campus-hotspot[title^="Survey Lab"]').click(); await w(1400);
    out.tobiReachable = !!document.querySelector('#sv_sceneWrap [data-id="tobi"]');
    const verb = v => [...document.querySelectorAll('#sv_verbGrid button')].find(b=>new RegExp(v,'i').test(b.textContent)).click();
    const ch = re => { const b=[...document.querySelectorAll('#sv_choices button')].find(x=>new RegExp(re,'i').test(x.textContent)); if(!b) throw new Error('no choice '+re); b.click(); };
    verb('talk to'); document.querySelector('#sv_sceneWrap [data-id="tobi"]').click(); await w(500);
    ch('ask someone something'); await w(400);
    ch('having an idea'); await w(700);
    out.flashed = !!document.querySelector('.cb-flash') || !!document.querySelector('.cb-post-wrap');
    await w(900);
    out.postShown = !!document.querySelector('.cb-post');
    out.caption = (document.querySelector('.cb-post .body')||{}).textContent ? document.querySelector('.cb-post .body').textContent.slice(0,60) : '';
    document.querySelector('.cb-post .dismiss').click(); await w(500);
    out.posed = !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.tobiPosed;
    out.followsAfterPose = window.CODEBOOK_TOBI_HERE('ethics') && window.CODEBOOK_TOBI_HERE('mensa');
    // now the scissors, without ever diagnosing the patient
    verb('pick up'); document.querySelector('#sv_sceneWrap [data-id="cabinet"]').click(); await w(700);
    const f = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    out.scissors = !!f.svScissorsOut; out.viaTobi = !!f.svViaTobi; out.diagnosed = !!f.svDiag1;
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.tobiReachable && r.followsAfterPose && r.postShown && r.posed && r.scissors && r.viaTobi && !r.diagnosed && !p.errors.length;
  console.log(ok?'PASS':'FAIL'); p.close(); process.exit(ok?0:1);
})();
