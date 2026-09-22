// The Office desk, and the rule that nothing in this game can be permanently missed.
//
// Two bugs met here. The guard on the desk pickups read `if (profHere)`, but a `var
// profHere` declared inside one unrelated branch of the same click handler hoisted to the
// top of the function and shadowed the room's real one with undefined -- so the guard was
// dead and you could clear her desk while she sat watching you.
//
// Fixing that alone would have created the opposite bug: she never leaves again once the
// interview is won, so winning it would have stranded the pen for good -- and the pen is
// what writes the MECHANISM, which is what opens Act III. So she only invigilates while
// the interview is still ahead of you.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
const SPOTS = ['penjar','bingocard','glassdesk','hourglass','likertdie','usb','stamp','mug','shelfR'];

async function visit(p, flags){
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['question','folder'], flags:${JSON.stringify(flags)}}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  return p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    window.CODEBOOK_START(); await w(900);
    [...document.querySelectorAll('button.campus-hotspot')]
      .find(b => b.title.indexOf('The Seven-Second Office') === 0).click();
    await w(1600);
    const vb = re => [...document.querySelectorAll('#wp_verbGrid button')].find(b => re.test(b.textContent));
    let blocked = 0, taken = 0;
    for (const id of ${JSON.stringify(SPOTS)}){
      const spot = document.querySelector('#wp_sceneWrap .hotspot[data-id="' + id + '"]');
      if (!spot) continue;
      vb(/pick up/i).click(); spot.click(); await w(320);
      if (/sitting right there/i.test(document.getElementById('wp_line').textContent)) blocked++; else taken++;
    }
    return { blocked, taken };
  })()`);
}

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1500, height:1000, deviceScaleFactor:1, mobile:false });
  const watching = await visit(p, { profAtOffice:true, lectureDone:true, lecturerGone:true });
  const won      = await visit(p, { profAtOffice:true, lectureDone:true, lecturerGone:true, whirlpoolDone:true });
  const away     = await visit(p, { lectureDone:true });
  console.log(JSON.stringify({ watching, won, away }, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const ok = watching.blocked > 0 && watching.taken === 0   // the beat works
          && won.blocked === 0                             // ...and never strands anything
          && away.blocked === 0
          && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
