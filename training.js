// Сургалт хуудас: хэсгүүд тодрох, 7 хоногийн таб, 1 минутын амьсгалын дадлага.
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

    document.querySelectorAll('.t-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- 2. 7 хоногийн хөтөлбөр (tabs) ---------- */
  // 1-р өдрийн текст Figma-аас. 2–7-р өдрийн текст нь ноорог —
  // багш хөтөлбөрийн бодит агуулгаар солих шаардлагатай.
  var DAYS = [
    {
      scene: 'Өглөөний тэнгэр',
      meta: '1–2-р хичээл · Суурь ойлголт',
      title: 'Амьсгалаа таних,<br>аюулгүй эхлэх',
      text: 'Амьсгалын тухай суурь ойлголт, ач тус, дадлагын түүхтэй танилцана. Дасгал хийх орчин, тухтай байрлал, аюулгүй байдлын зарчмыг ойлгоно.',
      list: ['Яагаад амьсгалдаа анхаарах хэрэгтэй вэ?', 'Өөрийн хэмнэлийг хүндэтгэх нь'],
      foot: 'Видео тайлбар + Удирдуулсан дадлага'
    },
    {
      scene: 'Үүрийн далай',
      meta: '3-р хичээл · Анхны дадлага',
      title: 'Анхны дадлагаа<br>хамтдаа хийх',
      text: 'Багшийн удирдлагаар анхны амьсгалын дасгалаа хийж, биеийнхээ мэдрэмжийг анзаарна.',
      list: ['Тухтай байрлал олох', 'Амьсгалаа ажиглах'],
      foot: 'Видео тайлбар + Удирдуулсан дадлага'
    },
    {
      scene: 'Ногоон цэцэрлэг',
      meta: '4–5-р хичээл · Хэмнэл',
      title: 'Өөрийн амьсгалын<br>хэмнэлийг олох',
      text: 'Амьсгал авах, гаргах хэмнэлийг тоолж, өөрт тухтай хэмнэлээ олж дадлагажуулна.',
      list: ['Амьсгалаа тоолох', 'Хэмнэлээ тогтвортой барих'],
      foot: 'Видео тайлбар + Удирдуулсан дадлага'
    },
    {
      scene: 'Ойн гэрэл',
      meta: '6-р хичээл · Мэдрэмж',
      title: 'Бие, сэтгэлийн<br>мэдрэмжээ анзаарах',
      text: 'Дасгалын өмнө, дараа биеийн болон сэтгэл санааны өөрчлөлтөө ажиглаж сурна.',
      list: ['Биеийн мэдрэмжийг анзаарах', 'Сэтгэл санааныхаа өөрчлөлтийг тэмдэглэх'],
      foot: 'Видео тайлбар + Удирдуулсан дадлага'
    },
    {
      scene: 'Бороотой нуур',
      meta: '7–8-р хичээл · Сонголт',
      title: 'Өөрт тохирох<br>аргаа сонгох',
      text: 'Сурсан аргуудаа харьцуулж, нөхцөл байдал бүрт өөрт тохирох аргаа сонгоно.',
      list: ['Аргуудыг харьцуулах', 'Өөрт тохирохыг тодорхойлох'],
      foot: 'Видео тайлбар + Удирдуулсан дадлага'
    },
    {
      scene: 'Уулын горхи',
      meta: '9-р хичээл · Давтлага',
      title: 'Сурсан зүйлээ<br>давтан бататгах',
      text: 'Өмнөх өдрүүдэд сурсан аргуудаа давтаж, дадал болгох алхмаа тодорхойлно.',
      list: ['Аргуудаа давтах', 'Дадлагын тэмдэглэл хөтлөх'],
      foot: 'Видео тайлбар + Удирдуулсан дадлага'
    },
    {
      scene: 'Одот тэнгэр',
      meta: '10-р хичээл · Өдөр тутамд',
      title: 'Өдөр тутмын<br>амьдралдаа шингээх',
      text: 'Ажил, гэр бүл, өөртөө зориулсан цагтаа амьсгалын дадлагаа хэрэгжүүлэх төлөвлөгөө гаргана.',
      list: ['Өдрийн хуваарьтаа дадлагаа оруулах', 'Түр азнах мөчөө анзаарах'],
      foot: 'Видео тайлбар + Удирдуулсан дадлага'
    }
  ];

  var tablist = document.querySelector('[data-days]');
  var panel = document.querySelector('[data-day-panel]');

  if (tablist && panel) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var field = function (name) { return panel.querySelector('[data-day-field="' + name + '"]'); };

    var escapeHtml = function (s) {
      return s.replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    };

    var selectDay = function (index, focus) {
      var day = DAYS[index];
      var tab = tabs[index];

      tabs.forEach(function (t, i) {
        var on = i === index;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        t.classList.toggle('is-done', i < index); // өмнөх өдрүүдийн холбоос тод
      });
      if (focus) tab.focus();

      panel.setAttribute('aria-labelledby', tab.id);
      panel.style.setProperty('--col', tab.style.getPropertyValue('--col'));
      panel.style.setProperty('--row', tab.style.getPropertyValue('--row'));

      field('num').textContent = String(index + 1);
      field('scene').textContent = day.scene;
      field('meta').textContent = day.meta;
      field('title').innerHTML = day.title; // зөвхөн дээрх тогтмол өгөгдөл (<br>)
      field('text').textContent = day.text;
      field('list').innerHTML = day.list.map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      }).join('');
      field('foot').textContent = day.foot;
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectDay(i, false); });
    });

    tablist.addEventListener('keydown', function (e) {
      var current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      var next = null;
      if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      selectDay(next, true);
    });
  }

  /* ---------- 3. 1 минутын амьсгалын дадлага ---------- */
  var stage = document.querySelector('[data-breath]');
  var toggle = document.querySelector('[data-breath-toggle]');
  if (!stage || !toggle) return;

  var section = stage.closest('.t-breath');
  var q = function (sel) { return section.querySelector(sel); };
  var el = {
    phase: q('[data-breath-phase]'),
    sub: q('[data-breath-sub]'),
    sec: q('[data-breath-sec]'),
    trail: q('[data-breath-trail]'),
    dot: q('[data-breath-dot]'),
    cycles: q('[data-breath-cycles]'),
    time: q('[data-breath-time]'),
    progress: q('[data-breath-progress]'),
    fill: q('[data-breath-fill]'),
    legendIn: q('[data-breath-legend="in"]'),
    legendOut: q('[data-breath-legend="out"]')
  };

  var INHALE = 4;          // сек
  var EXHALE = 6;          // сек
  var CYCLE = INHALE + EXHALE;
  var TOTAL = 60;          // сек → 6 хэмнэл

  // wave-line.svg доторх долгионы хэлбэр (SVG координат):
  // оргил x≈56.3 → хотгор x≈296.8 (6 сек, гаргах) → оргил x≈458 (4 сек, авах).
  var PEAK_A = 56.3, TROUGH = 296.8, PEAK_B = 458;
  var Y_TOP = 0.846, Y_BOTTOM = 123.408;
  // SVG координатыг 634.25 × 296 талбайн хувь руу шилжүүлэх
  var OFFSET_X = -11.4, OFFSET_Y = 90.2, BOX_W = 634.25, BOX_H = 296;

  var easeHalf = function (t) { return (1 - Math.cos(Math.PI * t)) / 2; };

  var placeDot = function (u, v, opacity) {
    var x = ((u + OFFSET_X) / BOX_W) * 100;
    var y = ((v + OFFSET_Y) / BOX_H) * 100;
    el.dot.style.setProperty('--dot-x', x + '%');
    el.dot.style.setProperty('--dot-y', y + '%');
    el.dot.style.setProperty('--dot-o', opacity);
    el.trail.style.setProperty('--trail', x + '%');
  };

  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var setTime = function (remaining) {
    var s = Math.max(0, Math.ceil(remaining));
    el.time.textContent = pad(Math.floor(s / 60)) + ':' + pad(s % 60);
  };

  var lastPhase = '';
  var setPhase = function (name) {
    if (name === lastPhase) return;
    lastPhase = name;
    var inhale = name === 'in';
    el.phase.textContent = inhale ? 'Амьсгалаа ав.' : 'Амьсгалаа гарга.';
    el.sub.textContent = inhale ? 'Гэрэлт цэгийг даган аажуухан.' : 'Удаан, зөөлөн гаргаарай.';
    el.legendIn.classList.toggle('is-active', inhale);
    el.legendOut.classList.toggle('is-active', !inhale);
  };

  var running = false;
  var startTime = null;
  var rafId = 0;

  var render = function (elapsed) {
    var t = Math.min(elapsed, TOTAL);
    var p = t % CYCLE;
    var done = Math.floor(t / CYCLE);
    var u, v, opacity = 1, secLeft;

    if (p < INHALE) {
      // Авах: хотгороос оргил руу өгсөнө
      var a = p / INHALE;
      u = TROUGH + (PEAK_B - TROUGH) * a;
      v = Y_BOTTOM - (Y_BOTTOM - Y_TOP) * easeHalf(a);
      secLeft = INHALE - p;
      setPhase('in');
    } else {
      // Гаргах: оргилоос хотгор руу уруудна
      var b = (p - INHALE) / EXHALE;
      u = PEAK_A + (TROUGH - PEAK_A) * b;
      v = Y_TOP + (Y_BOTTOM - Y_TOP) * easeHalf(b);
      secLeft = CYCLE - p;
      setPhase('out');
    }

    // Оргил дээр цэг нэг оргилоос нөгөөд шилжихдээ зөөлөн бүдгэрнэ
    var edge = Math.abs(p - INHALE);
    if (edge < 0.25) opacity = edge / 0.25;

    placeDot(u, v, opacity);
    el.sec.textContent = String(Math.max(1, Math.ceil(secLeft)));
    el.cycles.textContent = done + ' / 6';
    setTime(TOTAL - t);
    el.fill.style.setProperty('--progress', t / TOTAL);
    el.progress.setAttribute('aria-valuenow', String(Math.floor(t)));
  };

  var reset = function () {
    lastPhase = '';
    placeDot(TROUGH, Y_BOTTOM, 1);
    el.cycles.textContent = '0 / 6';
    setTime(TOTAL);
    el.fill.style.setProperty('--progress', 0);
    el.progress.setAttribute('aria-valuenow', '0');
    el.legendIn.classList.remove('is-active');
    el.legendOut.classList.remove('is-active');
  };

  var stop = function (finished) {
    running = false;
    cancelAnimationFrame(rafId);
    section.classList.remove('is-running');
    reset();
    if (finished) {
      el.phase.textContent = 'Сайн байна.';
      el.sub.textContent = 'Та өөртөө нэг минут зориуллаа.';
      el.cycles.textContent = '6 / 6';
      setTime(0);
      toggle.textContent = 'Дахин турших';
    } else {
      el.phase.textContent = 'Түр азна.';
      el.sub.textContent = 'Бэлэн болохоороо эхлээрэй.';
      toggle.textContent = '1 минут турших';
    }
  };

  var tick = function (now) {
    if (!running) return;
    if (startTime === null) startTime = now; // эхний кадрын цагаас тоолно
    var elapsed = Math.max(0, (now - startTime) / 1000);
    if (elapsed >= TOTAL) {
      stop(true);
      return;
    }
    render(elapsed);
    rafId = requestAnimationFrame(tick);
  };

  var start = function () {
    running = true;
    lastPhase = '';
    section.classList.add('is-running');
    toggle.textContent = 'Зогсоох';
    startTime = null;
    rafId = requestAnimationFrame(tick);
  };

  toggle.addEventListener('click', function () {
    if (running) stop(false);
    else start();
  });

  // Хөтчийн таб нуугдвал дадлагыг зогсооно
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && running) stop(false);
  });
})();
