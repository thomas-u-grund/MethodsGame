// Probe lip-sync and blinks in one room (scratch, not in the suite): CDP_PORT=9334 node probe-face.js ROOM VOICE OUT.png
const { connect } = require('./cdp');
const fs = require('fs');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const [room, voice, out] = process.argv.slice(2);
(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:['folder'],
    flags:{ corridorDone:true, slipSealed:true, h27issued:true, actIIIDone:true, actIVDone:true,
            act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true, tobiRoom:'library' }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  await p.send('Input.dispatchMouseEvent', { type:'mousePressed', x:5, y:5, button:'left', clickCount:1 });
  await p.send('Input.dispatchMouseEvent', { type:'mouseReleased', x:5, y:5, button:'left', clickCount:1 });
  const r = await p.evaluate(`(async () => { const w=ms=>new Promise(r=>setTimeout(r,ms));
    const sp=document.getElementById('bootSplash'); if(sp) sp.remove();
    window.CODEBOOK_START(); await w(700); window.CODEBOOK_ENTER_ROOM(${JSON.stringify(room)}); await w(2500);
    const blinks=[...document.querySelectorAll('img.cb-blink')].map(b=>b.dataset.for);
    const mouths=[...document.querySelectorAll('img.cb-mouth-free')].map(b=>b.dataset.for);
    let shut=0; for (let i=0;i<60;i++){ if (document.querySelector('img.cb-blink.shut')) shut++; await w(100); }
    const clip=Object.keys(window.CODEBOOK_VOICE_SPRITE).find(k=>k.indexOf('vo-${voice}-')===0);
    window.CODEBOOK_PLAY_LINE_AUDIO(clip); const ms=[], cls=[];
    for (let i=0;i<40;i++){ await w(50); ms.push(getComputedStyle(document.documentElement).getPropertyValue('--cb-m').trim());
      cls.push(document.documentElement.classList.contains('cb-lipsync')?1:0); }
    const m=document.querySelector('[data-voice].talking .cb-mouth-free');
    return {blinks, mouths, shutFrames:shut, clip, ms:ms.join(' '), lipsync:cls.join(''), mouthOpacity: m && getComputedStyle(m).opacity};
  })()`);
  console.log(JSON.stringify(r, null, 1));
  const s = await p.send('Page.captureScreenshot', { format:'png' });
  fs.writeFileSync(out, Buffer.from(s.result.data, 'base64'));
  console.log('errors', JSON.stringify(p.errors || []));
  process.exit(0);
})();
