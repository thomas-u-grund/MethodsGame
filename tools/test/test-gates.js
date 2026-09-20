// Act gating: one table, act granularity only. See HANDOVER 03.
const { connect } = require('./cdp');
(async () => {
  const p = await connect('http://localhost:8934/the-secret-of-the-codebook.html?cb=' + Date.now());
  const r = await p.evaluate(`(() => {
    const G = window.CODEBOOK_ACT_GATE;
    const f = o => ({ flags: o });
    return {
      fail: window.CODEBOOK_FAIL,
      act1_always:      G(1)(f({})),
      act2_beforeCorr:  G(2)(f({})),
      act2_afterCorr:   G(2)(f({corridorDone:true})),
      act3_beforeSeal:  G(3)(f({corridorDone:true})),
      act3_afterSeal:   G(3)(f({slipSealed:true})),
      act3_legacySave:  G(3)(f({h27issued:true})),
      act4_beforeData:  G(4)(f({slipSealed:true})),
      act4_afterData:   G(4)(f({actIIIDone:true})),
      act5_afterEvid:   G(5)(f({actIVDone:true}))
    };
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = r.fail.theoryEmpty === 'theory_empty'
    && r.act1_always && !r.act2_beforeCorr && r.act2_afterCorr
    && !r.act3_beforeSeal && r.act3_afterSeal && r.act3_legacySave
    && !r.act4_beforeData && r.act4_afterData && r.act5_afterEvid && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
