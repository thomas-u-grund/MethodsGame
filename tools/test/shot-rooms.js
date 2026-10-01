// Screenshot rooms for a visual check (not part of the suite): CDP_PORT=9334 node shot-rooms.js OUTDIR [room ...]
const { connect } = require('./cdp');
const fs = require('fs');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const OUT = process.argv[2];
const ROOMS = process.argv.slice(3).length ? process.argv.slice(3) :
  'lecture corridor pond library hall workshop seminar statsbasement delegation bureau psychlab postersession keynote writingroom surveylab ethics mensa fieldwork'.split(' ');
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder'],
    flags:{ corridorDone:true, slipSealed:true, h27issued:true, actIIIDone:true, actIVDone:true,
            act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true, tobiRoom:'library' }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  for (const id of ROOMS) {
    await p.evaluate(`(async () => { const w=ms=>new Promise(r=>setTimeout(r,ms));
      const sp=document.getElementById('bootSplash'); if(sp) sp.remove();
      if (!window._started){ window.CODEBOOK_START(); window._started=1; await w(700); }
      window.CODEBOOK_ENTER_ROOM(${JSON.stringify(id)}); await w(2500); })()`);
    const s = await p.send('Page.captureScreenshot', { format:'jpeg', quality:80 });
    fs.writeFileSync(`${OUT}/${id}.jpg`, Buffer.from(s.result.data, 'base64')); console.log(id);
  }
  console.log('errors', JSON.stringify(p.errors || []));
  process.exit(0);
})();
