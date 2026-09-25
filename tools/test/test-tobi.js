// Tobi roams, turns up in rooms, and talks. (The Gap Registry errand left with the room, 8zv.)
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder','resultprint','readinglist','interpretation','drawerlabel'],
    flags:{ corridorDone:true, slipSealed:true, h27issued:true, actIIIDone:true, actIVDone:true,
            act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true,
            tobiRoom:'library' }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp=document.getElementById('bootSplash'); if(sp) sp.remove();
    const out = {};
    const go = async (title) => { window.CODEBOOK_START(); await w(700);
      const b=[...document.querySelectorAll('button.campus-hotspot')].find(x=>x.title.indexOf(title)===0);
      b.click(); await w(1400); };
    const verb = (pre,v) => [...document.querySelectorAll('#'+pre+'_verbGrid button')].find(b=>new RegExp(v,'i').test(b.textContent)).click();
    const ch = (pre,re) => { const b=[...document.querySelectorAll('#'+pre+'_choices button')].find(x=>new RegExp(re,'i').test(x.textContent)); if(!b) throw new Error('no choice '+re); b.click(); };

    // he is in the Library this run (the reroll happens on map open, so pin it back)
    await go('The Library');
    window.CODEBOOK_SET_FLAG && null;
    out.spriteInLibrary = !!document.getElementById('lb_spr_tobi');
    verb('lb','talk to'); document.querySelector('#lb_sceneWrap [data-id="tobi"]').click(); await w(500);
    out.spoke = /brand|carousel|gaps/i.test(document.getElementById('lb_line').textContent);
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.spriteInLibrary && r.spoke && !p.errors.length;
  console.log(ok?'PASS':'FAIL'); p.close(); process.exit(ok?0:1);
})();
