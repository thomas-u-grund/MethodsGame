// ROADMAP 8f: "look at" an inventory item says a line, in both kinds of room.
// Also guards the two rules the descriptions are written under: every item has one, and
// none of them name a room or tell you which verb to use.
const { connect } = require('./cdp');
const U = 'http://localhost:8934/the-secret-of-the-codebook.html?cb=';

(async () => {
  const p = await connect(U + Date.now());
  await p.send('Emulation.setDeviceMetricsOverride', { width:1600, height:900, deviceScaleFactor:1, mobile:false });
  await p.evaluate(`localStorage.setItem('codebook_save_v1', JSON.stringify({
    inventory:['question','folder','hourglass','slip'],
    flags:{ corridorDone:true, pondDone:true, whirlpoolDone:true, lectureDone:true,
            act2IntroSeen:true, libraryDone:true, hallDone:true }}))`);
  await p.send('Page.navigate', { url: U + Date.now() }); await p.ready();

  const r = await p.evaluate(`(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    const sp = document.getElementById('bootSplash'); if (sp) sp.remove();
    const out = {};
    const go = async (title) => { window.CODEBOOK_START(); await w(700);
      const b = [...document.querySelectorAll('button.campus-hotspot')].find(x => x.title.indexOf(title) === 0);
      if (!b) throw new Error('no room ' + title); b.click(); await w(1400); };
    const verb = (pre, v) => [...document.querySelectorAll('#'+pre+'_verbGrid button')].find(b => new RegExp(v,'i').test(b.textContent)).click();
    const slot = (pre, id) => { const s = document.querySelector('#'+pre+'_sideInv [data-item="'+id+'"]');
      if (!s) throw new Error('no inventory slot ' + id); s.click(); };
    const line = pre => document.getElementById(pre+'_line').textContent;

    // Every item has a line, and none of them are the fallback.
    const labels = Object.keys(window.CODEBOOK_ITEM_LABELS);
    const looks = labels.map(k => window.CODEBOOK_ITEM_LOOK(k));
    out.count = labels.length;
    out.fellBack = labels.filter((k,i) => /exactly what it says it is/.test(looks[i]));
    // Rule: about the object, not the puzzle. No description may name a room or a verb.
    const rooms = /\\b(Library|Hall of Founders|Workshop|Seminar Room|Survey Lab|Ethics|Mensa|Gap Registry|Writing Room|Bureau|Basement)\\b/;
    out.namesRoom = labels.filter((k,i) => rooms.test(looks[i]));
    out.tellsVerb = labels.filter((k,i) => /\\b(use (it|this) on|give (it|this) to|take (it|this) to|combine)\\b/i.test(looks[i]));

    // An adventure room (Act II scaffolding)
    await go('The Library');
    verb('lb','look at'); slot('lb','hourglass'); await w(500);
    out.advLine = line('lb');
    out.advWorks = /Seven seconds/.test(out.advLine);
    // ...and with any other verb the click still arms the item for use
    verb('lb','use'); slot('lb','hourglass'); await w(300);
    out.armed = /Use A Cracked Hourglass/i.test(document.getElementById('lb_sentenceLine').textContent);

    // A hand-built Act I room
    await go('Causality Corridor');
    verb('cc','look at'); slot('cc','question'); await w(500);
    out.actILine = line('cc');
    out.actIWorks = /Twelve words/.test(out.actILine);

    // The two state-dependent entries actually read state
    out.folderBefore = window.CODEBOOK_ITEM_LOOK('folder');
    out.slipBefore = window.CODEBOOK_ITEM_LOOK('slip');
    window.CODEBOOK_SET_FLAG('slipSealed');
    window.CODEBOOK_SET_FLAG('actIIIDone');
    out.folderAfter = window.CODEBOOK_ITEM_LOOK('folder');
    out.slipAfter = window.CODEBOOK_ITEM_LOOK('slip');
    return out;
  })()`);

  console.log(JSON.stringify(r, null, 1), '\nerrors:', p.errors.length ? p.errors : 'none');
  await p.evaluate(`localStorage.removeItem('codebook_save_v1')`);
  // The count is a tripwire, not a fact about the world: bump it deliberately when items
  // are added, so a new item cannot slip in without a description. 48 -> 52 when the Survey
  // Lab's four question cards became things you carry.
  const ok = r && r.count === 56 && r.fellBack.length === 0 && r.namesRoom.length === 0 &&
             r.tellsVerb.length === 0 && r.advWorks && r.armed && r.actIWorks &&
             r.folderAfter !== r.folderBefore && /Data/.test(r.folderAfter) &&
             r.slipAfter !== r.slipBefore && /wax/i.test(r.slipAfter) && !p.errors.length;
  console.log(ok ? 'PASS' : 'FAIL');
  p.close(); process.exit(ok ? 0 : 1);
})();
