// The spectacularly wrong complete theory. Since 2026-09-30 (author: "they can only progress if they got
// things right") the device refuses to seal it and names the boxes to fix; nothing is sealed.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['question','folder','pen','chalk'],
    flags:{ corridorDone:true, whirlpoolDone:true, profAtOffice:true, act2IntroSeen:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const S = window.CODEBOOK_SLIP, out = {};
    // fill all four boxes with the junk the rooms will happily accept
    S.set('known', 'Six references, immaculately formatted.', false);
    S.set('mechanism', 'As Weber reminds us, education mediates the institutional reproduction of structured sociality.', false);
    S.set('scope', 'Human civilisation.', false);
    S.set('hypothesis', 'Something will probably happen.', false);
    out.coherence = S.coherence();
    window.CODEBOOK_START(); await wait(500);
    document.querySelector('button.campus-hotspot[title^="The Seven-Second Office"]').click(); await wait(800);
    out.prompt = /PREREGISTRATION-ADJACENT/.test(document.getElementById('wp_line').textContent);
    // press the button that should not exist
    [...document.querySelectorAll('#wp_choices button')].find(b=>/SEE THE DATA FIRST/.test(b.textContent)).click();
    await wait(500);
    out.alarm = /REQUEST NOTED/.test(document.getElementById('wp_line').textContent);
    [...document.querySelectorAll('#wp_choices button')].find(b=>/^YES/.test(b.textContent)).click();
    await wait(700);
    const line = document.getElementById('wp_line').textContent;
    const f = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    out.refused = /will not seal/.test(line) && /SCOPE/.test(line);
    out.sealed = !!f.slipSealed; out.h27 = !!f.h27issued; out.theoryEmpty = !!f.theory_empty;
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.coherence === 'EVERYTHING EXPLAINS EVERYTHING' && r.prompt && r.alarm
          && r.refused && !r.sealed && !r.h27 && !r.theoryEmpty && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
