// WP-2.1: the instrument is not finished until it measures what the hypothesis needs.
// ROADMAP 8zj: no machine step any more. With four patients out the nurse asks for the fifth
// question herself (on Talk To, or on the clipboard/machine), the pen writes it, the room is
// done and the machine glows green. Patient 2 is healed by crossing words out with the pen.
//
// ...and the four questions are things you CARRY. Each one, once made fit for human
// administration, is unclipped from its bed and handed over -- filed into the folder, under
// DATA, since ROADMAP 8zf -- and the bed it came from empties. Before, four fixes produced no object and no visible change --
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

    // ROADMAP 8zk: four healed patients on the DISCHARGED board IS the room. A save with all
    // four fixed (from before the board) is finished on entry.
    await wait(1800);
    const g = JSON.parse(localStorage.getItem('codebook_save_v1'));
    out.boxAfter = !!g.flags.surveyDone;
    out.gotQuestionnaire = (g.filed || []).concat(g.inventory).indexOf('questionnaire') !== -1;
    out.pinned = document.querySelectorAll('#sv_board .sv-pinned').length;
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
    const inv  = () => { const g = JSON.parse(localStorage.getItem('codebook_save_v1')); return g.inventory.concat(g.filed || []); };
    const charts = () => ['sv_p1','sv_p2','sv_p3','sv_p4']
      .filter(k => (document.getElementById(k) || {}).innerHTML);

    out.chartsAtStart = charts().length;                 // four patients hanging
    out.cardsAtStart  = document.querySelectorAll('#sv_board .sv-pinned').length;

    // patient 2: the pen crosses the leading words out, visibly, then it is discharged
    verb('look'); spot('gurney2'); await wait(400);
    verb('use'); document.querySelector('#sv_sideInv .side-inv-slot[data-item="pen"]').click();
    spot('gurney2'); await wait(300);
    out.struckVisible = !!document.querySelector('#sv_p2 .sv-strike');
    await wait(2000);
    out.gotPolicyCard = document.querySelectorAll('#sv_board .sv-pinned').length === 1;   // pinned, not carried
    out.chartGone     = charts().indexOf('sv_p2') < 0;

    // patient 3 takes the calendar page from the Ethics Tribunal.
    // NB: arm USE before touching the inventory. With LOOK AT selected, clicking a slot
    // examines that item instead of picking it up to use -- which is correct, and is what
    // made this read as a game bug the first time round.
    verb('look'); spot('gurney3'); await wait(400);
    verb('use');
    document.querySelector('#sv_sideInv .side-inv-slot[data-item="calendarpage"]').click();
    spot('gurney3'); await wait(500);
    await wait(300); out.gotLecturesCard = document.querySelectorAll('#sv_board .sv-pinned').length === 2;

    // patient 4 is the clipboard, and it must announce itself as a patient
    out.clipboardLabel = (document.querySelector('[data-id="clipboard"]') || {}).dataset
      ? document.querySelector('[data-id="clipboard"]').dataset.label : '';
    verb('use');
    document.querySelector('#sv_sideInv .side-inv-slot[data-item="likertdie"]').click();
    spot('clipboard'); await wait(500);
    await wait(300); out.gotSupportCard = document.querySelectorAll('#sv_board .sv-pinned').length === 3;
    out.chartsLeft = charts().length;
    return out;
  })()`);
  console.log(JSON.stringify({ ...r, carry }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.boxAfter && r.gotQuestionnaire && r.pinned === 4 && carry.struckVisible
          && carry.chartsAtStart === 4 && carry.cardsAtStart === 0
          && carry.gotPolicyCard && carry.chartGone          // healed -> pinned on the board, bed empty
          && carry.gotLecturesCard && carry.gotSupportCard
          && /[Pp]atient/.test(carry.clipboardLabel)          // the clipboard IS patient 4
          && carry.chartsLeft === 1                           // only the double-barrel left
          && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
