// Act III after the puzzle audit (ROADMAP 8zl): everything a room needs is found in or next
// to that room, and the act ends with the Professor's question.
//   Mensa: the Officer lists every requirement at once; the cook lends the mug and the SR-2,
//          which appear by the drum when handed over; the frame copies the register.
//   Fieldwork: the postcards are by its own phone, the voucher is the Director's.
//   Office: "where did those numbers come from?" sets actIIIDone -- Fieldwork does not.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const BASE = { corridorDone:true, act2IntroSeen:true, act3IntroSeen:true, slipSealed:true, h27issued:true, actRenumberMigrated:true,
               profAtOffice:true, lecturerGone:true, whirlpoolDone:true, tobiRoom:'' };

async function inRoom(p, inv, flags, room, body){
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({ inventory:${JSON.stringify(inv)}, flags:${JSON.stringify(Object.assign({}, BASE, flags))} }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  return p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_START(); await w(700);
    [...document.querySelectorAll('button.campus-hotspot')].find(b => b.title.indexOf(${JSON.stringify(room)}) === 0).click(); await w(1500);
    const g = () => JSON.parse(localStorage.getItem('codebook_save_v1'));
    const has = id => { const s = g(); return s.inventory.concat(s.filed || []).indexOf(id) !== -1; };
    const verb = (p, re) => [...document.querySelectorAll('#' + p + '_verbGrid button')].find(b => re.test(b.textContent)).click();
    const spot = id => document.querySelector('[data-id="' + id + '"]').click();
    const ch = (p, re) => { const b = [...document.querySelectorAll('#' + p + '_choices button, #' + p + ' ~ * button.choice')].find(x => re.test(x.textContent)); if (b) b.click(); return !!b; };
    const line = p => document.getElementById(p + '_line').textContent;
    const use = (p, item, target) => { verb(p, /^use$/i); document.querySelector('#' + p + '_sideInv .side-inv-slot[data-item="' + item + '"]').click(); spot(target); };
    ${body}
  })()`);
}

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:900, deviceScaleFactor:1, mobile:false });

  const mensa = await inRoom(p, ['folder','enrolreg'], {}, 'The Mensa', `
    const out = {};
    verb('mn', /talk to/i); spot('herald'); await w(400);
    out.listsAll = /receptacle/.test(line('mn')) && /randomiser/.test(line('mn')) && /frame/i.test(line('mn'));
    use('mn', 'enrolreg', 'frame'); await w(500);
    out.keptRegister = has('enrolreg');
    verb('mn', /talk to/i); spot('counters'); await w(400);
    ch('mn', /borrow a mug/); await w(500);
    verb('mn', /talk to/i); spot('counters'); await w(400);
    ch('mn', /SR-2/); await w(500);
    out.gotBoth = has('mug') && has('raffle');
    use('mn', 'mug', 'herald'); await w(400);
    use('mn', 'raffle', 'herald'); await w(400);
    const vis = id => { const e = document.getElementById('mn_spr_' + id); return !!e && getComputedStyle(e).display !== 'none'; };
    out.placedVisible = vis('placedMug') && vis('placedSR2');
    verb('mn', /talk to/i); spot('herald'); await w(500);
    out.done = !!g().flags.mensaDone;
    return out;`);

  const field = await inRoom(p, ['folder','ballotboxwrapped','altquestionnaire'], { surveyDone:true, ethicsDone:true, mensaDone:true }, 'The Fieldwork Arena', `
    const out = {};
    verb('fw', /talk to/i); spot('director'); await w(4500);
    out.running = !!g().flags.fwRunning;
    verb('fw', /talk to/i); spot('director'); await w(400);
    out.voucherOffered = ch('fw', /offer them something/); await w(400);
    verb('fw', /pick up/i); spot('phone'); await w(400);
    out.gotBoth = has('voucher') && has('reminders');
    use('fw', 'reminders', 'podiums'); await w(400);
    use('fw', 'altquestionnaire', 'podiums'); await w(400);
    use('fw', 'voucher', 'podiums'); await w(900);
    const f = g().flags;
    out.roomDone = !!f.fieldworkDone; out.actNotYet = !f.actIIIDone;
    out.pointsToProf = /Professor/.test(line('fw'));
    return out;`);

  const office = await inRoom(p, ['folder'], { surveyDone:true, ethicsDone:true, mensaDone:true, fieldworkDone:true }, 'The Seven-Second Office', `
    await w(600);
    const out = { asked: /Where exactly did those numbers come from/.test(document.getElementById('wp_line').textContent) };
    const c = [...document.querySelectorAll('button.choice')].find(b => /^C\\)/.test(b.textContent.trim()));
    if (c) c.click(); await w(600);
    out.actDone = !!g().flags.actIIIDone;
    return out;`);

  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  console.log(JSON.stringify({ mensa, field, office }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = mensa.listsAll && mensa.keptRegister && mensa.gotBoth && mensa.placedVisible && mensa.done
          && field.running && field.voucherOffered && field.gotBoth && field.roomDone && field.actNotYet && field.pointsToProf
          && office.asked && office.actDone && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
