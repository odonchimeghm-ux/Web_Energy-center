// Дэлгүүр хуудас: хэсгүүд тодрох, дэвтрийн зургийн галерей, томруулж үзэх цонх.
(function () {
  'use strict';

  /* ---------- 1. Хэсгүүд аажмаар тодорно ---------- */
  if (document.documentElement.classList.contains('reveal-on')) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.s-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- 2. Галерей: жижиг зураг дарахад гол зураг солигдоно ---------- */
  var mainImg = document.getElementById('s-gallery-img');
  var thumbs = document.querySelectorAll('.s-thumb');
  var animate = matchMedia('(prefers-reduced-motion: no-preference)').matches;

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      if (thumb.getAttribute('aria-pressed') === 'true') return;
      thumbs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === thumb)); });

      var swap = function () {
        mainImg.src = thumb.dataset.src;
        mainImg.alt = thumb.dataset.alt;
        mainImg.classList.remove('is-swapping');
      };
      if (animate) {
        mainImg.classList.add('is-swapping');
        setTimeout(swap, 200);
      } else {
        swap();
      }
    });
  });

  /* ---------- 3. Томруулж үзэх ---------- */
  var dialog = document.getElementById('s-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var dialogImg = dialog.querySelector('img');

  document.querySelectorAll('[data-zoom]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = document.querySelector(btn.dataset.zoom);
      dialogImg.src = src.currentSrc || src.src;
      dialogImg.alt = src.alt;
      dialog.showModal();
    });
  });

  dialog.querySelector('.s-lightbox-close').addEventListener('click', function () {
    dialog.close();
  });
  // Зургийн гадна талд дарахад хаагдана
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });
})();
