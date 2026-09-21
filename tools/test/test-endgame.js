// Acts IV and V, then the reveal, submission and outro.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder','pen','redacted','examrecords','worksheets','rateprint','altcard','readinglist','enrolreg','slip'],
    flags:{ corridorDone:true, whirlpoolDone:true, profAtOffice:true,
      slipSealed:true, h27issued:true, actIIIDone:true, provenanceGiven:true,
      act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true, act5IntroSeen:true,
      predictionSlip:{ known:'k', knownSound:true, mechanism:'m', mechanismSound:true,
                       scope:'s', scopeSound:true, hypothesis:'h', hypothesisSound:true, junk:0 } }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await new Promise(r=>setTimeout(r,4000));
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

    // --- Bureau first: the queue ticket is what pauses KIRA's lever
    await go('The Bureau of Implications');
    verb('bu','pick up'); spot('counter'); await wait(400);
    out.ticket = !!document.querySelector('#bu_sideInv .side-inv-slot[data-item="ticket"]');

    // --- Delegation Engine: pause the lever, read the log, check a record, instruct her
    await go('The Delegation Engine');
    item('dl','ticket'); spot('lever'); await wait(400);
    verb('dl','look at'); spot('log'); await wait(400);
    verb('dl','look at'); spot('record'); await wait(400);
    verb('dl','talk to'); spot('kira'); await wait(400);
    ch('dl','exact fix'); await wait(400);
    ch('dl','Re-merge on the pseudonymous'); await wait(600);
    out.delegation = !!flags().delegationDone;
    out.cleandata = !!document.querySelector('#dl_sideInv .side-inv-slot[data-item="cleandata"]');

    // --- Statistics Basement: now it can actually be analysed
    await go('Statistics Basement');
    verb('sb','use'); spot('seal'); await wait(500); ch('sb','Run it'); await wait(700);
    out.stats = !!flags().statsDone;
    out.resultKind = flags().resultHolds ? 'holds' : flags().resultNull ? 'null' : '?';

    // --- Bureau again: now there is a number to interpret
    await go('The Bureau of Implications');
    verb('bu','talk to'); spot('clerk'); await wait(400);
    ch('bu','write my own'); await wait(400);
    ch('bu','One course'); await wait(300);
    ch('bu','cannot separate'); await wait(300);
    ch('bu','never answered'); await wait(300);
    ch('bu','Lodge it'); await wait(600);
    out.bureau = !!flags().bureauDone; out.actIV = !!flags().actIVDone;

    // --- Writing Room first: type the drawer label the Registry demands
    await go('The Writing Room');
    verb('wr','pick up'); spot('table'); await wait(450);
    out.label = !!document.querySelector('#wr_sideInv .side-inv-slot[data-item="drawerlabel"]');

    // --- Gap Registry
    await go('The Gap Registry');
    verb('gp','talk to'); spot('kira'); await wait(400);
    ch('gp','survived checking'); await wait(500);
    verb('gp','talk to'); spot('registrar'); await wait(400);
    ch('gp','boundary condition'); await wait(600);
    out.gap = !!flags().gapDone;

    // --- Writing Room: find the three words, refuse the title
    await go('The Writing Room');
    verb('wr','look at'); spot('abstract'); await wait(450);
    ch('wr','improved'); await wait(2300);
    ch('wr','demonstrate'); await wait(2300);
    ch('wr','people'); await wait(2300);
    ch('wr','This is what happened'); await wait(900);
    out.writing = !!flags().writingDone; out.actV = !!flags().actVDone;
    out.overstated = !!flags().claim_overstated;

    // --- Office: reveal + submission
    await go('The Seven-Second Office');
    out.revealStarts = /hourglass turns over/.test(document.getElementById('wp_line').textContent);
    ch('wp','Wait'); await wait(300);
    ch('wp','that.s it'); await wait(300);
    ch('wp','The Codebook'); await wait(300);
    ch('wp','Explain'); await wait(400);
    out.codebookLine = /used to call it Methods/.test(document.getElementById('wp_line').textContent);
    ch('wp','submission chute'); await wait(600);
    out.submitted = !!flags().submitted;
    ch('wp','Leave the building'); await wait(1200);
    out.outroRunning = !!document.querySelector('.il-stage, .interlude, [class*=il-]');
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = r.ticket && r.cleandata && r.label
    && r.stats && r.delegation && r.bureau && r.actIV && r.gap && r.writing && r.actV
    && !r.overstated && r.revealStarts && r.codebookLine && r.submitted && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
