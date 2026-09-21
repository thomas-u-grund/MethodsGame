// WP-2.1: the instrument is not finished until it measures what the hypothesis needs.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['pen','likertdie','folder'],
    flags:{ corridorDone:true, h27issued:true,
            svFixDB:true, svFixLead:true, svFixOften:true, svFixScale:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const out = {};
    out.hypothesis = window.CODEBOOK_HYPOTHESIS().slice(0, 60);
    window.CODEBOOK_START(); await wait(500);
    document.querySelector('button.campus-hotspot[title^="Survey Lab"]').click(); await wait(800);
    const line = () => document.getElementById('sv_line').textContent;
    const verb = v => [...document.querySelectorAll('#sv_verbGrid button')].find(b => new RegExp(v,'i').test(b.textContent)).click();
    const spot = id => document.querySelector('[data-id="' + id + '"]').click();

    // all four patients stable -> the machine should still refuse
    verb('use'); spot('machine'); await wait(600);
    out.machineRefuses = /INSTRUMENT INCOMPLETE/.test(line());
    out.namesHypothesis = /practice elsewhere|getting that practice/.test(line());
    out.boxBefore = !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.surveyDone;

    // write the missing item with the Act I chewed pen
    document.querySelector('#sv_sideInv .side-inv-slot[data-item="pen"]').click();
    spot('clipboard'); await wait(500);
    const choices = [...document.querySelectorAll('#sv_choices button')].map(b => b.textContent.slice(0,40));
    out.choices = choices.length;
    // wrong one first
    document.querySelectorAll('#sv_choices button')[0]?.click(); await wait(400);
    out.wrongRejected = !JSON.parse(localStorage.getItem('codebook_save_v1')).flags.svFixPractice;
    spot('clipboard'); await wait(400);
    const btns = [...document.querySelectorAll('#sv_choices button')];
    btns[btns.length-1]?.click(); await wait(600);
    out.practiceWritten = !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.svFixPractice;

    verb('use'); spot('machine'); await wait(700);
    out.boxAfter = !!JSON.parse(localStorage.getItem('codebook_save_v1')).flags.surveyDone;
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.machineRefuses && !r.boxBefore && r.choices === 3 && r.wrongRejected
          && r.practiceWritten && r.boxAfter && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
