// Tobi begs for the photograph -> you refuse three times -> only then can you give in ->
// the ONE post appears -> he will then get the scissors out of the Nurse.
//
// The contract that matters and is easy to lose: the give-in must NOT be offered on the
// first three asks, and he must NOT start appearing in every room once you have posed.
// He used to do both, which turned a joke about a man who is always around into a sprite
// that was always on screen.
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
    // showMap() rerolls which room he is in, so pin him AFTER the last map render and go
    // straight in. The previous version wrote tobiRoom into localStorage, which the next
    // saveGame() promptly overwrote from memory -- it only ever passed because posing used
    // to put him in every room, which masked the pin never taking.
    window.CODEBOOK_START(); await w(700);
    window.CODEBOOK_TOBI_PIN('surveylab');
    document.querySelector('button.campus-hotspot[title^="Survey Lab"]').click(); await w(1400);
    out.tobiReachable = !!document.querySelector('#sv_sceneWrap [data-id="tobi"]');
    const verb = v => [...document.querySelectorAll('#sv_verbGrid button')].find(b=>new RegExp(v,'i').test(b.textContent)).click();
    const ch = re => { const b=[...document.querySelectorAll('#sv_choices button')].find(x=>new RegExp(re,'i').test(x.textContent)); if(!b) throw new Error('no choice '+re); b.click(); };
    const opts = () => [...document.querySelectorAll('#sv_choices button')].map(b => b.textContent.trim());
    const giveInOffered = () => opts().some(o => /fine/i.test(o));
    out.gaveInEarly = false;
    for (let round = 0; round < 4; round++){
      verb('talk to'); document.querySelector('#sv_sceneWrap [data-id="tobi"]').click(); await w(450);
      // his opener is the only choice mentioning him; take whichever is his
      const opener = [...document.querySelectorAll('#sv_choices button')]
        .find(b => /window|want something|Go on then|this time/i.test(b.textContent));
      if (!opener) throw new Error('round ' + round + ': he never asks');
      opener.click(); await w(450);
      if (round < 3 && giveInOffered()) out.gaveInEarly = true;   // must not be possible yet
      if (round === 3){ out.giveInOnFourth = giveInOffered(); break; }
      const no = [...document.querySelectorAll('#sv_choices button')]
        .find(b => /^\u201cNo|Still no|not my problem/i.test(b.textContent.trim()));
      if (!no) throw new Error('round ' + round + ': no way to refuse');
      no.click(); await w(400);
    }
    ch('fine'); await w(700);
    out.flashed = !!document.querySelector('.cb-flash') || !!document.querySelector('.cb-post-wrap');
    await w(900);
    out.postShown = !!document.querySelector('.cb-post');
    out.caption = (document.querySelector('.cb-post .body')||{}).textContent ? document.querySelector('.cb-post .body').textContent.slice(0,60) : '';
    document.querySelector('.cb-post .dismiss').click(); await w(500);
    out.posed = !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.tobiPosed;
    // ...and he stays where he is rather than following you into every room.
    out.staysPut = !window.CODEBOOK_TOBI_HERE('ethics') && !window.CODEBOOK_TOBI_HERE('mensa')
                   && window.CODEBOOK_TOBI_HERE('surveylab');
    // now the scissors, without ever diagnosing the patient
    verb('pick up'); document.querySelector('#sv_sceneWrap [data-id="cabinet"]').click(); await w(700);
    const f = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    out.scissors = !!f.svScissorsOut; out.viaTobi = !!f.svViaTobi; out.diagnosed = !!f.svDiag1;
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.tobiReachable && !r.gaveInEarly && r.giveInOnFourth && r.staysPut
          && r.postShown && r.posed && r.scissors && r.viaTobi && !r.diagnosed && !p.errors.length;
  console.log(ok?'PASS':'FAIL'); p.close(); process.exit(ok?0:1);
})();
