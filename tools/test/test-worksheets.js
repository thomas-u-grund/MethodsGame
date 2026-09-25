// The Act IV seal needs the merged data (Delegation) and the Act III exam records. The
// worked-example sheets are pinned up in the basement since ROADMAP 8zl (SB1), and breaking
// the seal is a choice of test: the one the slip names, or two tempting wrong ones.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
async function run(inv) {
  const p = await connect(U + Date.now());
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory: ${JSON.stringify(inv)},
    flags:{ corridorDone:true, slipSealed:true, h27issued:true, actIIIDone:true,
            act2IntroSeen:true, act3IntroSeen:true, act4IntroSeen:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    window.CODEBOOK_START(); await w(700);
    document.querySelector('button.campus-hotspot[title^="Statistics Basement"]').click(); await w(1200);
    [...document.querySelectorAll('#sb_verbGrid button')].find(b=>/use/i.test(b.textContent)).click();
    document.querySelector('[data-id="seal"]').click(); await w(600);
    return { line: document.getElementById('sb_line').textContent.slice(0,400),
             choices: [...document.querySelectorAll('#sb_choices button')].map(b=>b.textContent.slice(0,12)) };
  })()`);
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  const e = p.errors.slice(); p.close(); return { ...r, errors: e };
}
(async () => {
  const none  = await run(['folder','cleandata']);
  const marks = await run(['folder','cleandata','examrecords']);
  const both  = marks;
  console.log('nothing:   ', JSON.stringify(none));
  console.log('\nmarks only:', JSON.stringify(marks));
  console.log('\nboth:      ', JSON.stringify(both));
  const ok = /particular questions/.test(none.line) && none.choices.length === 0
    && /Which one\?/.test(marks.line) && marks.choices.length === 3
    && both.choices.some(c => /The one the/i.test(c))
    && ![none,marks,both].some(x => x.errors.length);
  console.log('\n' + (ok ? 'PASS' : 'FAIL')); process.exit(ok ? 0 : 1);
})();
