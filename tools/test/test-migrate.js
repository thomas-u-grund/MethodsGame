// The II -> III renumbering migration: it has to fix old saves, and it has to leave new
// ones completely alone, however many times the page is loaded.
//
// Both names it renames are live again -- the new Act II sets `act2IntroSeen` when its
// interlude plays and `actIIDone` when its four rooms are finished. The migration used to
// run on every load, so a current save lost them on the very next reload: the Act II
// interlude replayed every session and Act III's never played at all.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function load(p, save) {
  if (save) await p.evaluate(`localStorage.setItem('codebook_save_v1', ${JSON.stringify(JSON.stringify(save))})`);
  await p.send('Page.navigate', { url: U + Date.now() });
  await sleep(4000);
  return p.evaluate(`JSON.parse(localStorage.getItem('codebook_save_v1')).flags`);
}

(async () => {
  const p = await connect(U + Date.now());
  const out = {};

  // 1. An OLD save -- from before theory became Act II -- is renumbered and keeps its progress.
  const old = await load(p, { inventory:['folder'], flags:{ corridorDone:true, surveyDone:true,
    ethicsDone:true, mensaDone:true, fieldworkDone:true, h27issued:true,
    actIIDone:true, act2IntroSeen:true }});
  out.oldRenamed = old.actIIIDone === true && old.act3IntroSeen === true
                && old.actIIDone === undefined && old.act2IntroSeen === undefined;

  // 2. ...and reloading it again does not re-run anything or lose anything.
  const old2 = await load(p, null);
  out.oldStable = old2.actIIIDone === true && old2.act3IntroSeen === true;

  // 3. A NEW save -- one that has been through the four-room Act II -- is left untouched.
  const neu = await load(p, { inventory:['folder','slip'], flags:{ corridorDone:true,
    act2IntroSeen:true, libraryDone:true, hallDone:true, workshopDone:true, seminarDone:true,
    actIIDone:true, slipSealed:true, h27issued:true }});
  out.newKept = neu.act2IntroSeen === true && neu.actIIDone === true;
  out.newNotRenamed = neu.act3IntroSeen === undefined && neu.actIIIDone === undefined;

  // 4. ...and it survives repeated loads, which is the bug that actually shipped.
  let flags = neu;
  for (let i = 0; i < 3; i++) flags = await load(p, null);
  out.newSurvivesReloads = flags.act2IntroSeen === true && flags.actIIDone === true
                        && flags.act3IntroSeen === undefined;

  console.log(JSON.stringify(out, null, 1), 'errors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = Object.values(out).every(Boolean) && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
