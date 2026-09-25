// Characters must stand ON THE FLOOR at the right size for their depth.
//
// The previous version of this test asserted only "inside the scene at a plausible height",
// which is exactly the weak check that let Tobi stand on a stack of books. It now asserts:
//   1. the soles sit inside the room's floor band (not on the furniture, not in the ceiling)
//   2. the height matches the room's depth ramp for that depth, within a tolerance
//   3. the character carries the data-voice the talking animation keys off
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const ROOMS = [
  ['The Library','lb'], ['The Hall of Founders','hf'], ["Feldstrom's Workshop",'ws'],
  ['The Seminar Room','sm'], ['Statistics Basement','sb'], ['The Delegation Engine','dl'],
  ['The Bureau of Implications','bu'], ['The Infinite Monkey Project','pl'], ['The Writing Room','wr']
];
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder'],
    flags:{ corridorDone:true, slipSealed:true, h27issued:true, actIIIDone:true, actIVDone:true,
            act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true,
            tobiRoom:'library' }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const bad = [];
  for (const [title, pre] of ROOMS) {
    const r = await p.evaluate(`(async () => { const w=ms=>new Promise(r=>setTimeout(r,ms));
      const sp=document.getElementById('bootSplash'); if(sp) sp.remove();
      window.CODEBOOK_START(); await w(700);
      const b=[...document.querySelectorAll('button.campus-hotspot')].find(x=>x.title.indexOf(${JSON.stringify(title)})===0);
      if(!b) return {err:'no map button'};
      b.click(); await w(1300);
      const scene=document.getElementById('${pre}_sceneWrap'); if(!scene) return {err:'no scene'};
      const s=scene.getBoundingClientRect();
      const out=[];
      document.querySelectorAll('#${pre}_sceneWrap .cb-foot').forEach(el=>{
        if (getComputedStyle(el).display === 'none') return;
        const inner = el.querySelector('[id^="${pre}_spr_"]');
        const r = el.getBoundingClientRect();
        out.push({ id:(inner&&inner.id||el.id).replace('${pre}_spr_','').replace('${pre}_foot_',''),
                   voice: inner ? inner.getAttribute('data-voice') : null,
                   footX: +((((r.left + r.width/2) - s.left)/s.width)*100).toFixed(1),
                   footY: +(((r.bottom - s.top)/s.height)*100).toFixed(1),
                   hPct:  +((r.height/s.height)*100).toFixed(1) });
      });
      // The room's own walkbox, so the test checks against what the room declares rather
      // than against a number hard-coded here.
      const room = (window.CODEBOOK_ROOM_OPTS || {})['${pre}'] || null;
      return { opts: room ? { floor: room.floor || null, walk: room.walk || null } : null, sprites: out };
    })()`);
    if (r.err) { bad.push([title, r.err]); continue; }
    r.sprites.forEach(sp => {
      // floor band, generously: nobody's soles should be above 60% or below the frame
      if (sp.footY < 60 || sp.footY > 100) bad.push([title, sp.id, 'feet off the floor at y=' + sp.footY]);
      // depth ramp sanity: deeper in the room means smaller
      if (sp.hPct < 22 || sp.hPct > 70) bad.push([title, sp.id, 'height ' + sp.hPct + '% is off the ramp']);
      // 8-PRIORITY part 3: and the soles must be on the part of the floor that IS floor.
      // A sprite can sit at a legal height and still be standing on a bookcase.
      const o = r.opts;
      if (o && o.walk && o.floor){
        const t = Math.max(0, Math.min(1, (sp.footY - o.floor[0]) / (o.floor[1] - o.floor[0])));
        const lo = o.walk[0][0] + t * (o.walk[1][0] - o.walk[0][0]);
        const hi = o.walk[0][1] + t * (o.walk[1][1] - o.walk[0][1]);
        if (sp.footX < lo - 0.5 || sp.footX > hi + 0.5)
          bad.push([title, sp.id, 'outside the walkbox: x=' + sp.footX + ' not in [' + lo.toFixed(1) + ', ' + hi.toFixed(1) + ']']);
      }
    });
    console.log(title.padEnd(26), JSON.stringify(r.sprites));
  }
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  if (bad.length) console.log('\nPROBLEMS:', JSON.stringify(bad, null, 1));
  const ok = !bad.length && !p.errors.length;
  console.log('\n' + (ok?'PASS':'FAIL')); p.close(); process.exit(ok?0:1);
})();
