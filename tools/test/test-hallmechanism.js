// The MECHANISM box: without it the Prediction Slip cannot be sealed and Act III never
// opens. Since the rap battle rework (ROADMAP 8zc) it comes from Professor G, who is too
// nervous to talk before his set and dictates it afterwards -- if you have a card and a pen.
// The founders talk (Weber on his own hotspot, Marx and Durkheim via the portraits) but
// never give you one.
//
// History worth keeping: this used to be written behind the Weber portrait, and once shipped
// with Talk To bounced by a guard that only let Use through. Talking is the first thing
// anyone tries on a character, so every case below starts from Talk To.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

// name -> [inventory, extra flags, what to do]
const CASES = {
  weber:      [['folder','pen','blankcard'], {}, 'talk:weber'],
  marx:       [['folder','pen','blankcard'], {}, 'talk:portraits:Marx'],
  gBefore:    [['folder','pen','blankcard','usb'], {}, 'talk:profg'],
  gNoUsb:     [['folder','pen','blankcard'], {}, 'talk:profg'],
  gNoCard:    [['folder','pen'], { rapDone:true }, 'talk:profg'],
  gNoPen:     [['folder','blankcard'], { rapDone:true }, 'talk:profg'],
  gGives:     [['folder','pen','blankcard'], { rapDone:true }, 'talk:profg'],
  gCardOnHim: [['folder','pen','blankcard'], { rapDone:true }, 'use:blankcard:profg'],
  weberPen:   [['folder','pen','blankcard'], { rapDone:true }, 'use:pen:weber'],
};

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:1000, deviceScaleFactor:1, mobile:false });
  const out = {};
  for (const [name, [inv, flags, action]] of Object.entries(CASES)) {
    await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
      inventory:${JSON.stringify(inv)}, flags:${JSON.stringify(Object.assign({ corridorDone:true, act2IntroSeen:true }, flags))}}))`);
    await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
    out[name] = await p.evaluate(`(async () => {
      const w = ms => new Promise(r => setTimeout(r, ms));
      const s = document.getElementById('bootSplash'); if (s) s.remove();
      window.CODEBOOK_START(); await w(900);
      [...document.querySelectorAll('button.campus-hotspot')].find(b => b.title.indexOf('The Hall of Founders') === 0).click();
      await w(1600);
      const vb = re => [...document.querySelectorAll('#hf_verbGrid button')].find(b => re.test(b.textContent));
      const hot = id => document.querySelector('#hf_sceneWrap button.hotspot[data-id="' + id + '"]');
      const played = [];
      const PQ = window.CODEBOOK_PLAY_LINE_QUEUE;
      window.CODEBOOK_PLAY_LINE_QUEUE = function(l){ (l || []).forEach(c => played.push(c)); return PQ.apply(this, arguments); };
      const a = ${JSON.stringify(action)}.split(':');
      if (a[0] === 'talk'){
        vb(/talk to/i).click(); hot(a[1]).click(); await w(500);
        if (a[2]){ [...document.querySelectorAll('#hf_choices button')].find(b => b.textContent.indexOf(a[2]) !== -1).click(); await w(500); }
      } else {
        vb(/^use$/i).click();
        document.querySelector('#hf_sideInv .side-inv-slot[data-item="' + a[1] + '"]').click();
        hot(a[2]).click(); await w(500);
      }
      const slip = JSON.parse(localStorage.getItem('codebook_save_v1')).flags.predictionSlip || {};
      const inv = JSON.parse(localStorage.getItem('codebook_save_v1')).inventory;
      return { line: (document.getElementById('hf_line') || {}).textContent.replace(/\\s+/g, ' ').slice(0, 800),
               sound: slip.mechanismSound === true, mech: !!slip.mechanism, card: inv.indexOf('mechanismcard') !== -1,
               voiced: played.filter(c => /^vo-(profg|marx|durkheim|weber)-/.test(c)) };
    })()`);
  }
  console.log(JSON.stringify(out, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const none = o => !o.mech && !o.card;
  const ok = none(out.weber) && /ideal type/.test(out.weber.line) && out.weber.voiced.length === 1
          && none(out.marx) && /Class struggle/.test(out.marx.line) && out.marx.voiced.length === 1
          && none(out.gBefore) && /nervous/.test(out.gBefore.line) && !/USB stick/.test(out.gBefore.line) && out.gBefore.voiced.length === 1
          && /USB stick/.test(out.gNoUsb.line)
          && none(out.gNoCard) && /something to write on/i.test(out.gNoCard.line)
          && none(out.gNoPen) && /something to write with/i.test(out.gNoPen.line)
          && out.gGives.sound && out.gGives.card && /worked examples/.test(out.gGives.line) && out.gGives.voiced.length === 3
          && out.gCardOnHim.sound && out.gCardOnHim.card
          && none(out.weberPen) && /Professor G/.test(out.weberPen.line)
          && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
