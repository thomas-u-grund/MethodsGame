const { connect } = require('./cdp');
(async () => {
  const p = await connect('http://localhost:8934/the-secret-of-the-codebook.html?cb=' + Date.now());
  const r = await p.evaluate(`(() => {
    const S = window.CODEBOOK_SLIP, out = {};
    out.start = S.coherence();
    S.set('known', 'Three real sources.', true);       out.afterGood = S.coherence();
    S.set('mechanism', 'As Weber reminds us...', false); out.afterJunk = S.coherence();
    S.set('scope', 'Human civilisation.', false);
    S.set('hypothesis', 'Something will probably happen.', false);
    out.worst = S.coherence(); out.filled = S.filled(); out.allSound = S.allSound();
    S.set('mechanism', 'Students practise worked examples.', true);
    out.recovered = S.coherence();
    out.html = S.html().length > 200;
    return out;
  })()`);
  console.log(JSON.stringify(r), '\nerrors:', p.errors.length ? p.errors : 'none');
  const ok = r.start === 'EXEMPLARY' && r.afterGood === 'EXEMPLARY' && r.afterJunk === 'ADEQUATE'
    && r.worst === 'THEORETICALLY BUSY' && r.filled === 4 && r.allSound === false
    && r.recovered === 'CONCERNING' && r.html && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL'); p.close(); process.exit(ok ? 0 : 1);
})();
