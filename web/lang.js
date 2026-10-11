/* Language switch (English / German). Settings -> Language stores cb_lang and reloads.
   English is the default and needs nothing from this file. For German, lang-de.js supplies
   window.CODEBOOK_DE = { t: {...}, rx: [...], sprite: {...} }:
     t       English text -> German text. The key is the element's whitespace-collapsed textContent (or one
             quote / one stretch of narration, split the way CODEBOOK_VO_CLIPS splits it), so the game's English
             source needs no changes; a MutationObserver swaps in the German.
     rx      [regex, template] for strings the game assembles at run time ("Use X with Y").
     sprite  ENGLISH clip name -> ["voices-de/<german clip>.mp3", 0, seconds]. It replaces the English entry in
             CODEBOOK_VOICE_SPRITE, so every name test, duration and preload in the game keeps working.   Anything with no German entry stays English (text and voice), so the switch can ship early. */
(function(){
  var lang = 'en';
  try { if (localStorage.getItem('cb_lang') === 'de') lang = 'de'; } catch(e){}
  window.CODEBOOK_LANG = lang;
  window.CODEBOOK_SET_LANG = function(l){
    try { localStorage.setItem('cb_lang', l === 'de' ? 'de' : 'en'); } catch(e){}
    location.reload();
  };
  if (lang !== 'de') return;
  document.documentElement.lang = 'de';
  document.write('<script src="lang-de.js"><\/script>');

  function norm(s){ return s.replace(/\s+/g, ' ').trim(); }
  function start(){
    var DE = window.CODEBOOK_DE; if (!DE) return;
    var T = DE.t || {}, done = new WeakMap(), SKIP = { SCRIPT:1, STYLE:1, NOSCRIPT:1, TEXTAREA:1, INPUT:1 };
    if (DE.sprite && window.CODEBOOK_VOICE_SPRITE) for (var c in DE.sprite) window.CODEBOOK_VOICE_SPRITE[c] = DE.sprite[c];
    var VO = window.CODEBOOK_VO || {}, tmp = document.createElement('template');   // inert: no image fetches
    var INLINE = { B:1, I:1, EM:1, STRONG:1, SPAN:1, BR:1, SMALL:1, U:1, A:1, SUB:1, SUP:1, MARK:1, CODE:1, TT:1 };
    function textOf(h){ tmp.innerHTML = h.replace(/<br\s*\/?>/gi, ' '); return norm(tmp.content.textContent); }
    function trimDash(t){ return t.replace(/^[\s\u2014\u2013-]+|[\s\u2014\u2013-]+$/g, ''); }
    function esc(t){ return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
    // Same walk as CODEBOOK_VO_CLIPS: quotes someone speaks are units of their own, everything
    // else between them is narration. Returns the new html, or null when nothing had a German entry.
    function segHtml(html){
      var re = /\u201c([\s\S]*?)\u201d/g, m, last = 0, pending = '', out = '', hit = false;
      function narr(part){
        var t = trimDash(textOf(part)), de = t && T[t];
        if (de === undefined || de === '' ){ out += part; return; }
        hit = true;
        var w = part.match(/^(\s*(?:<[^>\/][^>]*>)*\s*)([\s\S]*?)(\s*(?:<\/[^>]+>)*\s*)$/);   // keep a wrapping <i>...</i>
        out += (w && !/</.test(w[2]) ? w[1] : '') + esc(de) + (w && !/</.test(w[2]) ? w[3] : '');
      }
      while ((m = re.exec(html))){
        var key = textOf(m[1]);
        if (VO[key]){
          narr(pending + html.slice(last, m.index)); pending = '';
          var de = T[key]; if (de !== undefined && de !== ''){ hit = true; out += '\u201e' + esc(de) + '\u201c'; } else out += '\u201c' + m[1] + '\u201d';
        } else pending += html.slice(last, m.index) + '\u201c' + m[1] + '\u201d';
        last = re.lastIndex;
      }
      narr(pending + html.slice(last));
      return hit ? out : null;
    }
    // Strings the game assembles at run time ("Use X with Y", "Case 1 of 4"): DE.rx = [[regex, template], ...]
    var RX = (DE.rx || []).map(function(r){ return [new RegExp(r[0]), r[1]]; });
    function tg(g){ g = norm(g); if (T[g] !== undefined) return T[g]; var l = 'the ' + g.charAt(0).toLowerCase() + g.slice(1); return T[l] !== undefined ? T[l] : g; }
    function rxText(k){
      for (var i = 0; i < RX.length; i++){ var m = k.match(RX[i][0]); if (m) return RX[i][1].replace(/\$(\d)/g, function(x, n){ return tg(m[n] || ''); }); }
      return null;
    }
    function inlineOnly(el){ for (var c = el.firstElementChild; c; c = c.nextElementSibling) if (!INLINE[c.tagName] || !inlineOnly(c)) return false; return true; }
    function tryEl(el){
      var tc = el.textContent, k = norm(tc); if (!k || k.length > 1500 || done.get(el) === k) return false;
      var v = T[k];
      if (v !== undefined && v !== '' && !el.firstElementChild){ el.textContent = v; done.set(el, norm(el.textContent)); return true; }
      if (!el.firstElementChild){ var rv = rxText(k); if (rv !== null && rv !== k){ el.textContent = rv; done.set(el, norm(el.textContent)); return true; } }
      if (inlineOnly(el)){
        var h = segHtml(el.innerHTML);
        if (h !== null){ el.innerHTML = h; done.set(el, norm(el.textContent)); return true; }
      }
      return false;
    }
    // Dev aid: localStorage cb_de_harvest=1 collects visible English text that has no German yet (cb_de_miss).
    var HARVEST = false; try { HARVEST = localStorage.getItem('cb_de_harvest') === '1'; } catch(e){}
    var EN = /\b(the|and|you|your|with|is|are|it|of|to|a)\b/i, DEW = /[\u00e4\u00f6\u00fc\u00df]|\b(der|die|das|und|du|ist|nicht|ein|eine|mit|dein|deine|zu)\b/i;
    function harvest(k){ try { var m = JSON.parse(localStorage.getItem('cb_de_miss') || '{}'); m[k] = 1; localStorage.setItem('cb_de_miss', JSON.stringify(m)); } catch(e){} }
    // An element with block children (a panel with a <div class="state-line">, say) still has runs of text and
    // inline tags between them. Translate each run as one line, so a quote split by <b>/<i> still matches.
    var FMT = { B:1, I:1, EM:1, STRONG:1, SMALL:1, U:1, BR:1, SUB:1, SUP:1, MARK:1, CODE:1 };   // no listeners to lose
    function fmtOnly(n){ if (!FMT[n.tagName]) return false; for (var c = n.firstElementChild; c; c = c.nextElementSibling) if (!fmtOnly(c)) return false; return true; }
    function runs(el){
      var kids = [].slice.call(el.childNodes), run = [], i;
      function flush(){
        if (run.length && run.some(function(n){ return n.nodeType === 3 && norm(n.nodeValue); }) && run.some(function(n){ return n.nodeType === 1; })){
          var h = run.map(function(n){ return n.nodeType === 3 ? esc(n.nodeValue) : n.outerHTML; }).join('');
          var out = segHtml(h);
          if (out !== null){ var t = document.createElement('template'); t.innerHTML = out; var f = t.content, first = run[0];
            [].slice.call(f.childNodes).forEach(function(c){ el.insertBefore(c, first); done.set(c, norm(c.textContent)); }); run.forEach(function(n){ el.removeChild(n); }); }
        }
        run = [];
      }
      for (i = 0; i < kids.length; i++){
        var n = kids[i];
        if (n.nodeType === 3 || (n.nodeType === 1 && fmtOnly(n))) run.push(n); else flush();
      }
      flush();
    }
    function walk(el){
      if (el.nodeType === 3){                       // a bare text node between elements
        var k = norm(el.nodeValue), v = k && T[k];
        if (k && v === undefined && done.get(el) !== k){
          var rv = rxText(k); if (rv === null){ var sh = segHtml(esc(el.nodeValue)); if (sh !== null){ tmp.innerHTML = sh; rv = tmp.content.textContent; } }
          if (rv !== null){ v = rv; }
        }
        if (v !== undefined && v !== '' && done.get(el) !== k){
          el.nodeValue = el.nodeValue.match(/^\s*/)[0] + v + el.nodeValue.match(/\s*$/)[0]; done.set(el, norm(el.nodeValue)); }
        else if (HARVEST && k && k.length > 7 && EN.test(k) && !DEW.test(k) && v === undefined){   // still English a moment later?
          setTimeout(function(){ if (el.isConnected && norm(el.nodeValue) === k) harvest(k); }, 400); }
        return;
      }
      if (el.nodeType !== 1 || SKIP[el.tagName]) return;
      if (tryEl(el)) return;
      runs(el);
      for (var n = el.firstChild; n; n = n.nextSibling) walk(n);
      ['title', 'placeholder', 'aria-label'].forEach(function(a){
        var av = el.getAttribute(a), ak = av && norm(av); if (ak && T[ak]) el.setAttribute(a, T[ak]);
      });
    }
    walk(document.body);
    new MutationObserver(function(muts){
      muts.forEach(function(m){
        if (m.type === 'childList'){
          for (var i = 0; i < m.addedNodes.length; i++) walk(m.addedNodes[i]);
          if (m.target.nodeType === 1 && m.target !== document.body) walk(m.target);
        } else if (m.type === 'characterData' && m.target.parentNode) walk(m.target.parentNode);
      });
    }).observe(document.body, { subtree: true, childList: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
