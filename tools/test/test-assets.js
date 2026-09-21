const { connect } = require('./cdp');
(async () => {
  const p = await connect('http://localhost:8934/the-secret-of-the-codebook.html?cb=' + Date.now());
  const r = await p.evaluate(`(async () => {
    const html = await (await fetch('the-secret-of-the-codebook.html?cb=' + Date.now())).text();
    const names = new Set();
    for (const m of html.matchAll(/['"]([A-Za-z0-9_.-]+\\.(?:webp|png|jpg|mp3))['"]/g)) names.add(m[1]);
    const sprite = window.CODEBOOK_VOICE_SPRITE || {};
    const bad = [];
    for (const n of names) {
      if (sprite[n]) continue;                      // a clip inside a bundle, not a file
      const res = await fetch(n, { method: 'HEAD' });
      if (!res.ok) bad.push(n + ' ' + res.status);
    }
    const acts = {};
    for (const m of html.matchAll(/id: '([a-z]+)',\s*act: '([^']+)'/g)) (acts[m[2]] = acts[m[2]] || []).push(m[1]);
    // Every carryable item needs an icon, or the side panel silently falls back to a
    // two-letter text tile — the most visible kind of unfinished, and easy to miss.
    const labels = window.CODEBOOK_ITEM_LABELS || {}, icons = window.CODEBOOK_ITEM_ICONS || {};
    const iconless = Object.keys(labels).filter(k => !icons[k]);
    return { checked: names.size, missing: bad, iconless, acts,
             assetLists: Object.keys(window.CODEBOOK_ACT_ASSETS || {}) };
  })()`);
  console.log(JSON.stringify(r, null, 2));
  console.log('errors:', p.errors.length ? p.errors : 'none');
  const ok = r.missing.length === 0 && r.iconless.length === 0 && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
