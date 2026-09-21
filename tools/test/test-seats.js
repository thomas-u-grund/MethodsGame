// The Fieldwork Arena's response rate is now something you can see: twelve podium sprites
// that empty and fill with the board. This asserts the stage and the board never disagree,
// because a silent mismatch would make the room lie about its own mechanic.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const BASE = { corridorDone:true, act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true,
               act5IntroSeen:true, slipSealed:true, h27issued:true, actRenumberMigrated:true,
               surveyDone:true, ethicsDone:true, mensaDone:true };

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['folder','ballotboxwrapped','reminders','altquestionnaire','voucher'],
    flags: ${JSON.stringify({ ...BASE, fwRunning:true })} }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await sleep(4500);

  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const out = {};
    window.CODEBOOK_START(); await w(900);
    const il = document.getElementById('interlude'); if (il) il.remove();
    [...document.querySelectorAll('button.campus-hotspot')].find(x => x.title.indexOf('The Fieldwork Arena') === 0).click();
    await w(1800);

    const shown = () => { let n = 0; for (let i=1;i<=12;i++){
      const e = document.getElementById('fw_spr_r'+i);
      if (e && getComputedStyle(e).display !== 'none') n++; } return n; };
    const boardSeats = () => { const t = (document.getElementById('fw_board')||{}).textContent || '';
      const m = t.match(/SEATS FILLED (\\d+)/); return m ? Number(m[1]) : null; };
    const verb = v => [...document.querySelectorAll('#fw_verbGrid button')].find(b => new RegExp(v,'i').test(b.textContent)).click();
    const item = id => { verb('use'); document.querySelector('#fw_sideInv .side-inv-slot[data-item="'+id+'"]').click(); };
    const podiums = () => document.querySelector('#fw_sceneWrap [data-id="podiums"]').click();

    out.steps = [];
    const snap = label => out.steps.push([label, boardSeats(), shown()]);

    snap('arrive');                                    // 58% -> 7
    item('reminders');  podiums(); await w(900); snap('reminders');   // 64% -> 8
    item('altquestionnaire'); podiums(); await w(900); snap('altq');  // 70% -> 8
    item('voucher');    podiums(); await w(1200); snap('voucher');    // 75% -> 9

    // The named-empty seats are the ones the Director's dialogue calls out.
    out.emptyAtStart = [3,4,6];
    return out;
  })()`);

  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  // The final board reads "75% / RECORD HIGH" rather than a seat count, so the last step is
  // checked against the sprites alone.
  const head = r ? r.steps.slice(0, -1) : [];
  const last = r ? r.steps[r.steps.length - 1] : null;
  const agree = head.every(([, board, sprites]) => board !== null && board === sprites);
  const climbs = r && r.steps[0][2] === 7 && last && last[1] === null && last[2] === 9;
  const ok = agree && climbs && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
