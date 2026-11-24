(function () {
  var d = document, h = d.documentElement;
  function flash(b, key) {
    var l = b.querySelector('.lbl'), o = b.getAttribute('data-orig') || l.textContent;
    b.setAttribute('data-orig', o);
    l.textContent = b.getAttribute(key);
    b.classList.toggle('done', key === 'data-done');
    clearTimeout(b._t);
    b._t = setTimeout(function () { l.textContent = o; b.classList.remove('done'); }, 2200);
  }
  function legacyCopy(t) {
    var a = d.createElement('textarea');
    a.value = t; a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;top:0;opacity:0';
    d.body.appendChild(a); a.select();
    var ok = false;
    try { ok = d.execCommand('copy'); } catch (e) {}
    d.body.removeChild(a);
    return ok;
  }
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (b) {
      var code = b.getAttribute('data-copy');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(function () { flash(b, 'data-done'); }, function () {
          flash(b, legacyCopy(code) ? 'data-done' : 'data-fail');
        });
      } else { flash(b, legacyCopy(code) ? 'data-done' : 'data-fail'); }
      return;
    }
    var c = e.target.closest('[data-set-country]');
    if (c) {
      h.setAttribute('data-country', c.getAttribute('data-set-country'));
      d.querySelectorAll('[data-set-country]').forEach(function (x) {
        x.setAttribute('aria-pressed', String(x === c));
      });
      return;
    }
    var s = e.target.closest('[data-share]');
    if (s && navigator.share) {
      navigator.share({ title: d.title, url: s.getAttribute('data-share') }).catch(function () {});
    }
  });
  // Live date (Dubai time) for "Last verified: auto" and expiry handling. Static HTML keeps the build date for crawlers.
  var today = null;
  try { today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai' }).format(new Date()); } catch (e) {}
  if (/^\d{4}-\d{2}-\d{2}$/.test(today || '')) {
    d.querySelectorAll('time[data-today]').forEach(function (x) { x.setAttribute('datetime', today); x.textContent = today.split('-').reverse().join('/'); });
    d.querySelectorAll('.tk[data-expiry]').forEach(function (x) { if (today > x.getAttribute('data-expiry')) x.classList.add('exp'); });
  }
  if (navigator.share) d.querySelectorAll('[data-share]').forEach(function (x) { x.hidden = false; });
})();
