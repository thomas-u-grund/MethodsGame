// WP-0.1 acceptance: every voiced clip resolves to its own file, and audio actually advances.
const { connect } = require('./cdp');

(async () => {
  const p = await connect('http://localhost:8934/the-secret-of-the-codebook.html?cb=' + Date.now());
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);

  const r = await p.evaluate(`(async () => { try {
    const out = {};
    const html = await (await fetch('the-secret-of-the-codebook.html?cb=' + Date.now())).text();
    const names = new Set();
    for (const m of html.matchAll(/['"]([a-z0-9-]+\\.mp3)['"]/gi)) names.add(m[1]);
    const sprite = window.CODEBOOK_VOICE_SPRITE || {};
    const bundles = new Set(Object.values(sprite).map(v => v[0]));
    // Music, not clips: the rap battle's three founder verses are full beat-and-voice mixes
    // and Professor G's track is 4:45 of recorded music, so they stream as their own files.
    const nonClip = new Set([...bundles, 'title-theme.mp3','office-bgm.mp3','lecture-bgm.mp3','sfx-act1.mp3','sfx-act3.mp3',
      'rap-marx.mp3','rap-durkheim.mp3','rap-weber.mp3','profg-live.mp3','sfx-rap.mp3',
      'bingo-tense.mp3','bingo-tight.mp3','bingo-hit.mp3','bingo-miss.mp3','sfx-ringback.mp3','sfx-phone-bell.mp3','silence.mp3','sfx-monkey-1.mp3','sfx-monkey-2.mp3','sfx-typewriter.mp3','sfx-drawer.mp3','sfx-knock.mp3','sfx-lever.mp3','sfx-chair-crash.mp3']);   // silence: unlocks the voice players on the first tap
    out.referenced = names.size;
    out.spriteClips = Object.keys(sprite).length;
    out.unresolved = [...names].filter(n => !sprite[n] && !nonClip.has(n));

    // one file per clip (2026-09-27): every file the table names must exist, and a random
    // sample must be as long as the table says (a wrong length cuts a line short)
    out.bundles = {};
    const files = [...bundles];
    // in batches: 1,700 requests at once overwhelm the little local test server
    const heads = [];
    for (let i = 0; i < files.length; i += 50)
      heads.push(...await Promise.all(files.slice(i, i + 50).map(f => fetch(f, { method:'HEAD', cache:'no-store' }).then(r => r.ok).catch(() => false))));
    out.missingFiles = files.filter((f, i) => !heads[i]);
    const sample = Object.entries(sprite).sort(() => Math.random() - 0.5).slice(0, 60);
    for (const [k, v] of sample) {
      const a = new Audio(v[0]);
      await new Promise(res => { a.addEventListener('loadedmetadata', res, {once:true}); a.addEventListener('error', res, {once:true}); });
      out.bundles[v[0]] = a.duration;
    }
    out.overruns = sample.filter(([k,v]) => !(Math.abs(out.bundles[v[0]] - (v[1] + v[2])) < 0.35)).map(([k,v]) => k + ' ' + out.bundles[v[0]] + ' vs ' + v[2]);

    // actually play clips through the real code path and prove each one ENDS on schedule
    async function probe(name){
      const seg = sprite[name];
      const snd = window.CODEBOOK_VOICE(name);
      const t0 = performance.now();
      const done = new Promise(res => snd.addEventListener('ended', () => res((performance.now()-t0)/1000)));
      await snd.play();
      const elapsed = await Promise.race([done, new Promise(r => setTimeout(() => r(null), (seg[2]+4)*1000))]);
      try { snd.pause(); } catch(e) {}
      return { name, expected: seg[2], actual: elapsed };
    }
    // Warm the bundles through the game's own loader before timing anything: the first
    // play() otherwise pays for a multi-megabyte fetch and the timing means nothing.
    out.warmup = [];
    // (per-clip files: warm only the two probed clips)
    const byDur0 = Object.keys(sprite).sort((a,b) => sprite[a][2]-sprite[b][2]);
    for (const b of [sprite[byDur0[0]][0], sprite['doorman-chapterone.mp3'][0]]){ const t = performance.now();
      await new Promise(res => window.CODEBOOK_PRELOAD([b], null, res));
      out.warmup.push([b, Math.round(performance.now() - t)]); }

    const byDur = Object.keys(sprite).sort((a,b) => sprite[a][2]-sprite[b][2]);
    out.probes = [];
    for (const n of [byDur[0], 'doorman-chapterone.mp3']) out.probes.push(await probe(n));
    out.allPlayed = out.probes.every(x => x.actual !== null && Math.abs(x.actual - x.expected) < 1.2);

    return out;
  } catch(e){ return { ERROR: String(e && e.stack || e) }; } })()`);

  console.log(JSON.stringify(r, null, 2));
  console.log('page errors:', p.errors.length ? p.errors : 'none');
  const ok = r && r.unresolved.length === 0 && r.overruns.length === 0 && r.missingFiles.length === 0 && r.allPlayed && p.errors.length === 0;
  console.log(ok ? '\nPASS' : '\nFAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
