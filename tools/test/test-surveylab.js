// WP-2.1: the instrument is not finished until it measures what the hypothesis needs.
//
// ...and the four questions are things you CARRY. Each one, once made fit for human
// administration, is unclipped from its bed and handed over as an inventory item, and the
// bed it came from empties. Before, four fixes produced no object and no visible change --
// the healed chart was redrawn in exactly the same spot as the sick one.
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

  // ---- you leave carrying the instrument, and the ward empties as you go.
  // The room used to hand back nothing: four fixes changed four flags, redrew four charts
  // in exactly the same place, and left the player with no object and no visible progress.
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['pen','likertdie','calendarpage','folder'],
    flags:{ corridorDone:true, h27issued:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const carry = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const out = {};
    window.CODEBOOK_START(); await wait(500);
    document.querySelector('button.campus-hotspot[title^="Survey Lab"]').click(); await wait(900);
    const verb = v => [...document.querySelectorAll('#sv_verbGrid button')].find(b => new RegExp(v,'i').test(b.textContent)).click();
    const spot = id => document.querySelector('[data-id="' + id + '"]').click();
    const inv  = () => JSON.parse(localStorage.getItem('codebook_save_v1')).inventory;
    const charts = () => ['sv_p1','sv_p2','sv_p3','sv_p4']
      .filter(k => (document.getElementById(k) || {}).innerHTML);

    out.chartsAtStart = charts().length;                 // four patients hanging
    out.cardsAtStart  = inv().filter(i => /^q(satisfaction|policy|lectures|support)$/.test(i)).length;

    // patient 2 needs nothing but bare hands -- the cheapest one to drive here
    verb('look'); spot('gurney2'); await wait(400);
    verb('use');  spot('gurney2'); await wait(500);
    out.gotPolicyCard = inv().indexOf('qpolicy') >= 0;
    out.chartGone     = charts().indexOf('sv_p2') < 0;

    // patient 3 takes the calendar page from the Ethics Tribunal.
    // NB: arm USE before touching the inventory. With LOOK AT selected, clicking a slot
    // examines that item instead of picking it up to use -- which is correct, and is what
    // made this read as a game bug the first time round.
    verb('look'); spot('gurney3'); await wait(400);
    verb('use');
    document.querySelector('#sv_sideInv .side-inv-slot[data-item="calendarpage"]').click();
    spot('gurney3'); await wait(500);
    out.gotLecturesCard = inv().indexOf('qlectures') >= 0;

    // patient 4 is the clipboard, and it must announce itself as a patient
    out.clipboardLabel = (document.querySelector('[data-id="clipboard"]') || {}).dataset
      ? document.querySelector('[data-id="clipboard"]').dataset.label : '';
    verb('use');
    document.querySelector('#sv_sideInv .side-inv-slot[data-item="likertdie"]').click();
    spot('clipboard'); await wait(500);
    out.gotSupportCard = inv().indexOf('qsupport') >= 0;
    out.chartsLeft = charts().length;
    return out;
  })()`);
  console.log(JSON.stringify({ ...r, carry }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.machineRefuses && !r.boxBefore && r.choices === 3 && r.wrongRejected
          && r.practiceWritten && r.boxAfter
          && carry.chartsAtStart === 4 && carry.cardsAtStart === 0
          && carry.gotPolicyCard && carry.chartGone          // healed -> carried, bed empty
          && carry.gotLecturesCard && carry.gotSupportCard
          && /[Pp]atient/.test(carry.clipboardLabel)          // the clipboard IS patient 4
          && carry.chartsLeft === 1                           // only the double-barrel left
          && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
