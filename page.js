/* NetHGL project page: findings tabs, section highlight in the header, copy button. No dependencies. */
(function () {
  'use strict';

  // ---- Findings: each button shows its figure and explanation
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  function show(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { show(tab, false); });
    tab.addEventListener('keydown', function (ev) {
      var to = ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? i + 1 : ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? i - 1 :
               ev.key === 'Home' ? 0 : ev.key === 'End' ? tabs.length - 1 : null;
      if (to === null) return;
      ev.preventDefault(); show(tabs[(to + tabs.length) % tabs.length], true);
    });
  });

  // ---- Header: mark the section in view
  var links = Array.prototype.slice.call(document.querySelectorAll('.navlinks a'));
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  function mark() {
    var line = window.scrollY + window.innerHeight * 0.3, current = 0;
    sections.forEach(function (sec, i) { if (sec && sec.getBoundingClientRect().top + window.scrollY <= line) current = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections.length - 1;
    links.forEach(function (a, i) { if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var queued = false;
  window.addEventListener('scroll', function () {
    if (queued) return; queued = true;
    requestAnimationFrame(function () { queued = false; mark(); });
  }, { passive: true });
  window.addEventListener('resize', mark);
  mark();

  // ---- BibTeX copy
  var copy = document.getElementById('copybib');
  if (copy) copy.addEventListener('click', function () {
    var text = document.getElementById('bib').textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
      function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1600); },
      function () { var r = document.createRange(); r.selectNodeContents(document.getElementById('bib')); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); });
  });
})();
