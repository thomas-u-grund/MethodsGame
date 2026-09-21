// WP-2.2: linkage is a fourth requirement, and over-redaction now blocks it.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

async function run(flags, pick) {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['pen','folder'], flags: Object.assign({corridorDone:true,h27issued:true}, ${JSON.stringify(flags)}) }))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await wait(500);
    document.querySelector('button.campus-hotspot[title^="The Ethics Tribunal"]').click(); await wait(800);
    [...document.querySelectorAll('#et_verbGrid button')].find(b=>/talk/i.test(b.textContent)).click();
    document.querySelector('[data-id="tribunal"], [data-id="chair"]').click(); await wait(500);
    const btn = t => [...document.querySelectorAll('#et_choices button')].find(b => new RegExp(t,'i').test(b.textContent));
    const link = btn('link the answers');
    if (!link) return { noLinkOption: true, choices: [...document.querySelectorAll('#et_choices button')].map(b=>b.textContent.slice(0,30)) };
    link.click(); await wait(600);
    const sub = btn('${pick}');
    if (!sub) return { noSub: true, line: document.getElementById('et_line').textContent.slice(0,120) };
    sub.click(); await wait(900);
    const f = JSON.parse(localStorage.getItem('codebook_save_v1')).flags;
    return { line: document.getElementById('et_line').textContent.slice(0,400),
             etLinkage: !!f.etLinkage, ethicsDone: !!f.ethicsDone };
  })()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const errs = p.errors.slice(); p.close(); return { ...r, errors: errs };
}

(async () => {
  const over = await run({ etConsent:true, etWithdraw:true, etRedact:true, overRedacted:true }, 'Question by question');
  const good = await run({ etConsent:true, etWithdraw:true, etRedact:true }, 'Question by question');
  const lazy = await run({ etConsent:true, etWithdraw:true, etRedact:true }, 'mark is fine');
  console.log('over-redacted:', JSON.stringify(over));
  console.log('\nproper:      ', JSON.stringify(good));
  console.log('\noverall-only:', JSON.stringify(lazy));
  const ok = over.etLinkage === false && /Impossible|nothing left/.test(over.line)
          && good.etLinkage === true && good.ethicsDone === true
          && lazy.etLinkage === false && /particular/.test(lazy.line)
          && ![over,good,lazy].some(x => x.errors.length);
  console.log('\n' + (ok ? 'PASS' : 'FAIL'));
  process.exit(ok ? 0 : 1);
})();
