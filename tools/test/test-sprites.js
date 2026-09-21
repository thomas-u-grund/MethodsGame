// Sprites must be inside their scene, roughly where the painting leaves room, and must
// carry a data-voice so the talking animation applies.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const ROOMS = [['The Library','lb',['kira']], ["Feldstrom's Workshop",'ws',['feldstrom']],
               ['The Delegation Engine','dl',['kira']], ['The Gap Registry','gp',['kira']],
               ['The Writing Room','wr',['feldstrom','kira']]];
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder'],
    flags:{ corridorDone:true, slipSealed:true, h27issued:true, actIIIDone:true, actIVDone:true,
            act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await new Promise(r=>setTimeout(r,4500));
  const out = [];
  for (const [title, pre, ids] of ROOMS) {
    const r = await p.evaluate(`(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
      const sp=document.getElementById('bootSplash'); if (sp) sp.remove();
      window.CODEBOOK_START(); await w(700);
      const b=[...document.querySelectorAll('button.campus-hotspot')].find(x=>x.title.indexOf(${JSON.stringify(title)})===0);
      if(!b) return {err:'no map button'};
      b.click(); await w(1400);
      const scene=document.getElementById('${pre}_sceneWrap'); if(!scene) return {err:'no scene'};
      const s=scene.getBoundingClientRect();
      return ${JSON.stringify(ids)}.map(id=>{
        const e=document.getElementById('${pre}_spr_'+id);
        if(!e) return {id, err:'missing'};
        const r=e.getBoundingClientRect();
        return {id, voice:e.getAttribute('data-voice'),
                insideX: r.left>=s.left-1 && r.right<=s.right+1,
                insideY: r.top>=s.top-1 && r.bottom<=s.bottom+1,
                hPct: Math.round(r.height/s.height*100)};
      });})()`);
    out.push([title, r]);
  }
  out.forEach(([t,r]) => console.log(t.padEnd(24), JSON.stringify(r)));
  const flat = out.flatMap(([,r]) => Array.isArray(r) ? r : [r]);
  const ok = flat.length === 6 && flat.every(x => x.voice && x.insideX && x.insideY && x.hPct > 25 && x.hPct < 60);
  console.log('\n' + (ok ? 'PASS' : 'FAIL')); await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  p.close(); process.exit(ok?0:1);
})();
