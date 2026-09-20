const { connect } = require('./cdp');
(async () => {
  const p = await connect('http://localhost:8934/the-secret-of-the-codebook.html?cb=' + Date.now());
  const r = await p.evaluate(`(() => ({
    fail: window.CODEBOOK_FAIL,
    gateBefore: window.CODEBOOK_ACT_GATE(3)({ flags: {} }),
    gateAfter:  window.CODEBOOK_ACT_GATE(3)({ flags: { corridorDone: true } }),
    gate1:      window.CODEBOOK_ACT_GATE(1)({ flags: {} })
  }))()`);
  console.log(JSON.stringify(r), 'errors:', p.errors.length ? p.errors : 'none');
  const ok = r.fail && r.fail.theoryEmpty === 'theory_empty' && r.gateBefore === false
          && r.gateAfter === true && r.gate1 === true && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
