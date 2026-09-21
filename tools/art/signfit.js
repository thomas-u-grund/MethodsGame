// Measure every campus signboard's text in the real font at the real size, and print the
// MEASURED table that tools/art/maptables.py sizes the boards from.
//
//   node tools/art/signfit.js            # needs the dev server on :8934 and headless Chrome
//
// Why this exists: board widths used to be hand-picked numbers. "Probability Pond" needed
// 11.13% and had 10.91%, so it wrapped to two lines and spilled over both curled ends of
// the scroll. A board is as wide as its text; that is a measurement, not a guess.
const { connect } = require('../test/cdp');
const { execFileSync } = require('child_process');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

const items = JSON.parse(execFileSync('python3', ['-c', `
import importlib.util, json, os
spec = importlib.util.spec_from_file_location('mt', os.path.join('${__dirname}', 'maptables.py'))
mt = importlib.util.module_from_spec(spec); spec.loader.exec_module(mt)
out = {k: (a + ('<br>' + b if b else '')) for k, (cx, t, a, b) in mt.SIGNS_RAW.items()}
# The pond is measured painted: three lines, and the widest it ever gets.
out['pond'] = 'Probability Pond<br>(Now literally 50/50)<br><span class="map-stamp">FALSIFIED</span>'
print(json.dumps(out))
`], { cwd: __dirname }).toString());

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();
  const r = await p.evaluate(`(async()=>{ const w = ms => new Promise(r=>setTimeout(r,ms));
    const s = document.getElementById('bootSplash'); if (s) s.remove();
    window.CODEBOOK_START(); await w(900); await document.fonts.ready;
    const items = ${JSON.stringify(items)};
    const mw = document.querySelector('.map-wrap'), mr = mw.getBoundingClientRect(), out = {};
    for (const k in items){
      const d = document.createElement('div'); d.className = 'map-sign';
      d.style.cssText = 'position:absolute;left:-9999px;top:0;width:auto;height:auto;display:inline-flex;';
      d.innerHTML = '<span style="white-space:nowrap">' + items[k] + '</span>';
      mw.appendChild(d); const b = d.getBoundingClientRect();
      out[k] = [ +((b.width/mr.width)*100).toFixed(2), +((b.height/mr.height)*100).toFixed(2) ];
      d.remove();
    }
    return out; })()`);
  const rows = Object.entries(r).sort((a,b) => b[1][0] - a[1][0]);
  console.log('MEASURED = {');
  for (const [k, [w, h]] of rows) console.log(` '${k}':${' '.repeat(Math.max(1, 15 - k.length))}(${w.toFixed(2).padStart(5)}, ${h.toFixed(2)}),`);
  console.log('}');
  console.log('\nerrors:', p.errors.length ? p.errors : 'none');
  p.close(); process.exit(0);
})();
