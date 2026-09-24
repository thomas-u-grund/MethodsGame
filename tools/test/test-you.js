// The student speaks (ROADMAP 8v). Clicking a quoted choice plays her clip, and the reply
// that choice triggers waits for her instead of cutting her off.
//
//   1. in the Office, "Continue..." is an action, not speech: no vo-you clip.
//   2. choice A at W1 is quoted: her clip plays FIRST, then the Professor's retry line,
//      and the Professor's clip does not start until hers has ended.
//   3. Space while she is answering skips only her: the reply starts at once and its
//      caption stays up.
//   4. her quoted lines resolve to her clips through CODEBOOK_VO ("Where is Professor
//      Stellmacher?", the Lecture Theatre question, is the canary).
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

const spy = `
  window.__played = [];
  const V = window.CODEBOOK_VOICE;
  window.CODEBOOK_VOICE = function(src){
    const a = V(src), name = String(src).split('/').pop(), p = a.play.bind(a);
    a.play = function(){ window.__played.push({ name, t: performance.now() });
      a.addEventListener('ended', () => { const e = window.__played.find(x => x.name === name && !x.end); if (e) e.end = performance.now(); });
      return p(); };
    return a;
  };`;

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:1000, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:[],
    flags:{ lectureDone:true, lecturerGone:true, profAtOffice:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();

  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_START(); await w(700);
    ${spy}
    [...document.querySelectorAll('button.campus-hotspot')]
      .find(x => x.title.indexOf('The Seven-Second Office') === 0).click();
    await w(1200);
    const out = {};
    const btn = re => [...document.querySelectorAll('#wp_choices button')].find(b => re.test(b.textContent));
    window.CODEBOOK_STOP_LINE_AUDIO();
    window.__played.length = 0;
    btn(/^Continue/).click(); await w(400);
    out.continueSilent = !window.__played.some(x => /^vo-you-/.test(x.name));
    window.CODEBOOK_STOP_LINE_AUDIO();
    window.__played.length = 0;
    btn(/^A\\)/).click();
    for (let i = 0; i < 120 && window.__played.length < 2; i++) await w(100);
    const [a, b] = window.__played;
    out.order = window.__played.map(x => x.name);
    out.youFirst  = !!a && /^vo-you-/.test(a.name);
    out.profAfter = !!b && /^office-/.test(b.name) && !!a.end && b.t >= a.end - 50;

    // Space mid-answer skips HER, and the reply starts at once instead of being lost.
    await w(1500);
    btn(/^Try again/).click(); await w(400);
    window.CODEBOOK_STOP_LINE_AUDIO();
    window.__played.length = 0;
    btn(/^A\\)/).click();
    for (let i = 0; i < 50 && !window.__played.length; i++) await w(100);
    await w(300);
    const t0 = performance.now();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { code:'Space', key:' ', bubbles:true }));
    for (let i = 0; i < 30 && window.__played.length < 2; i++) await w(100);
    const reply = window.__played[1];
    out.skipOrder  = window.__played.map(x => x.name);
    out.skipToReply = !!reply && /^office-/.test(reply.name) && reply.t - t0 < 1500;
    out.captionKept = !document.querySelector('.scene-caption.caption-dismissed');
    return out;
  })()`);

  // Her own quoted line resolves to her clip.
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:[], flags:{} }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const pond = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_START(); await w(700);
    ${spy}
    const clips = window.CODEBOOK_VO_CLIPS('&ldquo;Where is Professor Stellmacher?&rdquo;');
    return { mapped: clips.length === 1 && /^vo-you-/.test(clips[0]) };
  })()`);

  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  console.log(JSON.stringify({ r, pond }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = r && r.continueSilent && r.youFirst && r.profAfter && r.skipToReply && r.captionKept
          && pond.mapped && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  process.exit(ok ? 0 : 1);
})();
