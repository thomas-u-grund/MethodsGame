// The Ethics Tribunal (WP-2.2, reworked in ROADMAP 8zl / E1). Names and linkage are ONE
// decision: numbering the forms instead of naming them is what makes joining them to exam
// results possible. With consent and withdrawal already met:
//   over-redact  -> no linkage, and the Chair says why on the spot
//   keep names   -> refused
//   number forms -> linkage, approval, and the bagged ballot box handed down with it;
//                   four red seals on the bench.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

async function run(pick) {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['pen','folder'], flags:{ corridorDone:true, h27issued:true, slipSealed:true, act3IntroSeen:true, etConsent:true, etWithdraw:true } }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_START(); await wait(600);
    document.querySelector('button.campus-hotspot[title^="The Ethics Tribunal"]').click(); await wait(900);
    [...document.querySelectorAll('#et_verbGrid button')].find(b=>/talk/i.test(b.textContent)).click();
    document.querySelector('[data-id="tribunal"]').click(); await wait(500);
    const named = /Four seals/.test(document.getElementById('et_line').textContent);
    const btn = t => [...document.querySelectorAll('#et_choices button')].find(b => new RegExp(t,'i').test(b.textContent));
    const q = btn('names, and linking'); if (!q) return { noOption: true };
    q.click(); await wait(500);
    btn('${pick}').click(); await wait(900);
    const g = JSON.parse(localStorage.getItem('codebook_save_v1'));
    const red = [...document.querySelectorAll('#et_seals > div > div:first-child')].filter(d => /9c1f16/.test(d.getAttribute('style'))).length;
    return { named, line: document.getElementById('et_line').textContent.slice(0,500), etLinkage: !!g.flags.etLinkage, ethicsDone: !!g.flags.ethicsDone,
             box: g.inventory.indexOf('ballotboxwrapped') !== -1, red };
  })()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const errs = p.errors.slice(); p.close(); return { ...r, errors: errs };
}

(async () => {
  const over = await run('REDACTED over every name');
  const names = await run('Keep the names');
  const good = await run('Number each form');
  console.log(JSON.stringify({ over, names, good }, null, 1));
  const ok = over.named && !over.etLinkage && /nothing left/.test(over.line)
          && !names.etLinkage && /No\./.test(names.line)
          && good.etLinkage && good.ethicsDone && good.box && good.red === 4
          && ![over, names, good].some(x => x.errors.length);
  console.log('\n' + (ok ? 'PASS' : 'FAIL'));
  process.exit(ok ? 0 : 1);
})();
