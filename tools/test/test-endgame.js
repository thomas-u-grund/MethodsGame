// Acts IV and V, then the reveal, submission and outro.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder','redacted','examrecords','rateprint','altcard','readinglist','enrolreg','slip'],
    flags:{ corridorDone:true, whirlpoolDone:true, profAtOffice:true,
      slipSealed:true, h27issued:true, actIIIDone:true, provenanceGiven:true,
      act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true,
      predictionSlip:{ known:'k', knownSound:true, mechanism:'m', mechanismSound:true,
                       scope:'s', scopeSound:true, hypothesis:'h', hypothesisSound:true, junk:0 } }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const out = {};
    const go = async t => { window.CODEBOOK_START(); await wait(700);
      const b = document.querySelector('button.campus-hotspot[title^="' + t + '"]');
      if (!b) throw new Error('no button ' + t); b.click(); await wait(1200); };
    const verb = (p,v) => [...document.querySelectorAll('#'+p+'_verbGrid button')].find(b=>new RegExp(v,'i').test(b.textContent)).click();
    const spot = id => document.querySelector('[data-id="'+id+'"]').click();
    // "Look at" on an inventory item now describes it, so arm the USE verb first.
    const item = (p, id) => { [...document.querySelectorAll('#'+p+'_verbGrid button')].find(b => /^use$/i.test(b.textContent.trim())).click();
      document.querySelector('#'+p+'_sideInv .side-inv-slot[data-item="'+id+'"]').click(); };
    const ch = (p,re) => { const b=[...document.querySelectorAll('#'+p+'_choices button')].find(x=>new RegExp(re,'i').test(x.textContent));
      if(!b) throw new Error('no choice /'+re+'/ in '+p+': '+[...document.querySelectorAll('#'+p+'_choices button')].map(x=>x.textContent.slice(0,32)).join(' | ')); b.click(); };
    const flags = () => JSON.parse(localStorage.getItem('codebook_save_v1')).flags;

    // --- Delegation Engine, now KIRA's terminal (ROADMAP 8zp): ask, flag the seven wrong
    // lines (with the right reason), leave the three true ones, and take the data.
    await go('The Delegation Engine');
    verb('dl','talk to'); spot('kira'); await wait(400);
    document.querySelector('#dl_termFoot [data-prompt="0"]').click(); await wait(5200);
    const term = document.getElementById('dl_term');
    // a true line must not count as wrong
    term.querySelector('[data-claim="rr"]').click(); await wait(150);
    [...term.querySelectorAll('#dl_termFoot [data-r]')].find(b => b.dataset.r === 'bad').click(); await wait(200);
    out.trueNotFlagged = !term.querySelector('[data-claim="rr"]').classList.contains('flagged');
    // a wrong reason must not flag
    term.querySelector('[data-claim="n"]').click(); await wait(150);
    [...term.querySelectorAll('#dl_termFoot [data-r]')].find(b => b.dataset.r !== '-1').click(); await wait(200);
    out.wrongReasonNotFlagged = !term.querySelector('[data-claim="n"]').classList.contains('flagged');
    // flag five yourself, then show her: she must circle the two you missed
    for (const id of ['n','merge','miss','p','cause']){
      term.querySelector('[data-claim="' + id + '"]').click(); await wait(150);
      term.querySelector('#dl_termFoot [data-ok="1"]').click(); await wait(200);
    }
    document.getElementById('dl_showProf').click(); await wait(900 + 2*800 + 1400);
    out.profCircled = term.querySelectorAll('.kt-claim.circled, .kt-fig.circled').length;   // cite (+chart line and figure)
    out.noVerdictYet = !term.querySelector('#dl_termFoot [data-v]');
    for (const id of ['cite','chart']){
      term.querySelector('.kt-claim[data-claim="' + id + '"]').click(); await wait(150);
      term.querySelector('#dl_termFoot [data-ok="1"]').click(); await wait(200);
    }
    document.getElementById('dl_showProf').click(); await wait(900 + 1400);
    out.stamps = term.querySelectorAll('.kt-claim.flagged').length;
    out.paused = !!flags().dlPaused;
    term.querySelector('#dl_termFoot [data-v="fix"]').click(); await wait(200);
    out.fixNotDone = !flags().delegationDone;
    term.querySelector('#dl_termFoot [data-v="own"]').click(); await wait(600);
    out.delegation = !!flags().delegationDone;
    // the clean data is filed in the folder (ROADMAP 8zf), not an inventory slot of its own
    out.cleandata = window.CODEBOOK_IS_FILED('cleandata') && !document.querySelector('#dl_sideInv .side-inv-slot[data-item="cleandata"]');

    // --- Statistics Basement: now it can actually be analysed
    await go('Statistics Basement');
    verb('sb','use'); spot('seal'); await wait(500); ch('sb','The one the slip names'); await wait(700);
    out.stats = !!flags().statsDone;
    out.resultKind = flags().resultHolds ? 'holds' : flags().resultNull ? 'null' : '?';

    // --- Bureau again: now there is a number to interpret
    await go('The Bureau of Implications');
    verb('bu','talk to'); spot('clerk'); await wait(400);
    ch('bu','write my own'); await wait(400);
    // BU1: each limitation is shown, not ticked -- its evidence goes on the counter
    for (const ev of ['enrolreg','altcard','rateprint']){ item('bu', ev); spot('clerk'); await wait(2900); }
    out.evidenceIcons = document.querySelectorAll('#bu_evidence img, [id^=bu_ev] img').length;
    ch('bu','Lodge it'); await wait(600);
    out.bureau = !!flags().bureauDone; out.actIV = !!flags().actIVDone;

    // --- Act V opens in the Psych Lab: register the sealed slip with Dr. Achterberg (8zv)
    await go('The Infinite Monkey Project');
    verb('pl','talk to'); spot('achterberg'); await wait(400);
    ch('pl','your result'); await wait(300); out.resultRefused = !flags().labDone;
    verb('pl','talk to'); spot('achterberg'); await wait(400);
    ch('pl','sealed Prediction Slip'); await wait(500);
    out.registered = !!flags().labDone;
    // --- Writing Room: find the three words, refuse the title
    await go('The Writing Room');
    // The Registrar asks the Gap Registry's question here now (8zv)
    verb('wr','talk to'); spot('registrar'); await wait(400);
    out.papersLaid = !!flags().gpCompared;
    ch('wr','confirms the three papers'); await wait(400);
    out.gapWrongRefused = !flags().gapDone;
    verb('wr','talk to'); spot('registrar'); await wait(400);
    ch('wr','boundary condition'); await wait(600);
    out.gap = !!flags().gapDone;
    // WR1: let Feldstrom inflate the title first; finishing must then be refused
    verb('wr','talk to'); spot('feldstrom'); await wait(400);
    verb('wr','talk to'); spot('feldstrom'); await wait(400);
    ch('wr','bigger'); await wait(400);
    verb('wr','look at'); spot('abstract'); await wait(450);
    ch('wr','improved'); await wait(300); ch('wr','^.caused'); await wait(2900);
    out.wrongWordKept = [...document.querySelectorAll('#wr_choices button')].some(b => /improved/.test(b.textContent));
    ch('wr','improved'); await wait(300); ch('wr','was associated'); await wait(2300);
    ch('wr','demonstrate'); await wait(300); ch('wr','consistent with'); await wait(2300);
    ch('wr','people'); await wait(300); ch('wr','first-year'); await wait(2300);
    ch('wr','This is what happened'); await wait(600);
    out.titleBlocks = !flags().writingDone;
    verb('wr','talk to'); spot('feldstrom'); await wait(400);
    ch('wr','Refuse him'); await wait(900);
    out.writing = !!flags().writingDone;
    // --- the Poster Session: five visitors, answer each properly (8zv)
    await go('The Poster Session');
    verb('ps','use'); spot('poster'); await wait(3200);
    for (let i = 0; i < 5; i++){ window.CODEBOOK_PS_ANSWER_RIGHT(); await wait(4800); }
    await wait(600);
    out.posters = !!flags().postersDone; out.audience = flags().posterCrowd;
    out.actV = !!flags().actVDone;
    out.dbg = JSON.stringify({lab:flags().labDone, wr:flags().writingDone, ps:flags().postersDone, crowd:flags().posterCrowd, v:flags().actVDone});
    out.overstated = !!flags().claim_overstated;

    // --- Office: reveal + submission
    await go('The Seven-Second Office');
    out.revealStarts = /hourglass turns over/.test(document.getElementById('wp_line').textContent);
    ch('wp','is that the Codebook'); await wait(400);
    out.codebookLine = /used to call it Methods/.test(document.getElementById('wp_line').textContent)
      && /accurate/.test(document.getElementById('wp_line').textContent);
    ch('wp','submission chute'); await wait(600);
    out.submitted = !!flags().submitted;
    out.folderGone = !JSON.parse(localStorage.getItem('codebook_save_v1')).inventory.includes('folder');
    ch('wp','Leave the building'); await wait(1200);
    out.outroRunning = !!document.querySelector('.il-stage, .interlude, [class*=il-]');
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.registered && r.resultRefused && r.posters && r.audience === 5 && r.paused && r.trueNotFlagged && r.wrongReasonNotFlagged && r.stamps === 7 && r.profCircled >= 2 && r.noVerdictYet && r.fixNotDone && r.cleandata && r.papersLaid && r.gapWrongRefused && r.wrongWordKept && r.titleBlocks && r.folderGone
    && r.stats && r.delegation && r.bureau && r.actIV && r.gap && r.writing && r.actV
    && !r.overstated && r.revealStarts && r.codebookLine && r.submitted && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
