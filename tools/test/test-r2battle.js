// The Reviewer 2 battle (ROADMAP 8zy). A wrong card costs composure and leaves the comment;
// the right cards address all of them, comment 17 last, and the verdict is REVISE AND
// RESUBMIT. claim_overstated makes the fight longer (two more comments).
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';
(async () => {
  const p = await connect(U + Date.now());
  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    window.CODEBOOK_R2_FAST = true;
    const run = async (G) => {
      let finished = false;
      window.CODEBOOK_R2_BATTLE(G, () => { finished = true; }); await w(200);
      const o = { total: window.CODEBOOK_R2_STATE().total, cards: document.querySelectorAll('#r2b .r2-card').length };
      window.CODEBOOK_R2_ANSWER_WRONG(); await w(200);
      const s1 = window.CODEBOOK_R2_STATE(); o.wrongCost = s1.composure < 100 && s1.idx === 0;
      const seen = [];
      for (let i = 0; i < 12 && !finished; i++){ const st = window.CODEBOOK_R2_STATE(); if (st.n) seen.push(st.n); window.CODEBOOK_R2_ANSWER_RIGHT(); await w(250); }
      o.seen = seen; o.bossLast = seen[seen.length - 1] === 17;
      await w(900);
      o.finished = finished; o.gone = !document.getElementById('r2b');
      return o;
    };
    const honest = await run({});
    const over = await run({ claim_overstated: true });
    return { honest, over, won: !!JSON.parse(localStorage.getItem('codebook_save_v1') || '{"flags":{}}').flags.r2Won };
  })()`);
  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = r.honest.total === 4 && r.over.total === 6 && r.honest.cards === 7 && r.honest.wrongCost
    && r.honest.bossLast && r.over.bossLast && r.honest.finished && r.honest.gone && r.over.finished && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
