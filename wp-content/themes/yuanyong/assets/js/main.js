/* YUANYONG site interactions */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header: solid background after scrolling */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-solid', header.hasAttribute('data-solid') || window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* hero carousel */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slides .media'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.dots button'));
  var cur = document.querySelector('.dots .cur');
  if (slides.length > 1) {
    var idx = 0, timer = null;
    var show = function (i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === idx); });
      dots.forEach(function (d, n) { d.setAttribute('aria-current', n === idx ? 'true' : 'false'); });
      if (cur) cur.textContent = String(idx + 1).padStart(2, '0');
    };
    var start = function () {
      if (reduce) return;
      clearInterval(timer);
      timer = setInterval(function () { show(idx + 1); }, 6000);
    };
    dots.forEach(function (d, n) { d.addEventListener('click', function () { show(n); start(); }); });
    show(0);
    start();
  }

  /* portfolio filter */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filters button'));
  var works = Array.prototype.slice.call(document.querySelectorAll('.work'));
  var empty = document.querySelector('.empty');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var shown = 0;
      works.forEach(function (w) {
        var match = cat === 'all' || w.getAttribute('data-cat') === cat;
        w.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.style.display = shown ? 'none' : 'block';
    });
  });

  /* copy buttons */
  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.textContent = '已複製';
        btn.classList.add('is-done');
        setTimeout(function () { btn.textContent = '複製'; btn.classList.remove('is-done'); }, 1800);
      };
      var fallback = function () {
        var target = document.getElementById(btn.getAttribute('aria-controls'));
        if (!target) return;
        var r = document.createRange();
        r.selectNodeContents(target);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        btn.textContent = '已選取，請按複製';
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  /* 3D vs completed comparison slider */
  document.querySelectorAll('.compare').forEach(function (box) {
    var range = box.querySelector('input');
    if (!range) return;
    var set = function () { box.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', set);
    set();
  });

  /* gallery lightbox */
  var items = document.querySelectorAll('.g-item');
  if (items.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', '照片檢視');
    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = '關閉 ✕';
    var stage = document.createElement('div');
    stage.className = 'media';
    lb.appendChild(close);
    lb.appendChild(stage);
    document.body.appendChild(lb);
    var lastFocus = null;
    var closeLb = function () { lb.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        lastFocus = item;
        var src = item.querySelector('.media');
        stage.innerHTML = src.innerHTML;
        var big = stage.querySelector('img');
        if (big && big.getAttribute('data-full')) {
          big.removeAttribute('srcset');
          big.removeAttribute('sizes');
          big.src = big.getAttribute('data-full');
          big.style.objectFit = 'contain';
        }
        stage.setAttribute('data-label', src.getAttribute('data-label') || '');
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
        close.focus();
      });
    });
    close.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
  }

  /* year in footer */
  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
