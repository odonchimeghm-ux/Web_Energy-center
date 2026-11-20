// Бүлгийн уулзалт (ном): хэсгүүд тодрох, номын хөдөлгөөнт тавиур, номын цонх, бүртгэлийн маягт.
(function () {
  'use strict';

  var reduceMotion = !matchMedia('(prefers-reduced-motion: no-preference)').matches;

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

    document.querySelectorAll('.m-reveal').forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 2. Номын тавиур: шүүлтүүр, хайлт, тасралтгүй гүйдэг эгнээ ---------- */
  var shelf = document.getElementById('m-shelf');
  var list = document.getElementById('m-books');
  var books = Array.prototype.slice.call(list.querySelectorAll('.m-book'));
  var filters = document.querySelectorAll('.m-filter');
  var search = document.getElementById('m-book-search');
  var result = document.getElementById('m-result');
  var empty = document.getElementById('m-empty');
  var controls = document.querySelector('.m-shelf-controls');
  var motionBtn = document.getElementById('m-motion');
  var prevBtn = document.getElementById('m-prev');
  var nextBtn = document.getElementById('m-next');

  var activeFilter = 'all';
  var setWidth = 0;      // нэг бүтэн эгнээний өргөн (тасралтгүй эргэлтэд)
  var looping = false;
  var playing = !reduceMotion;
  var hoverPause = false;

  books.forEach(function (book, i) { book.dataset.index = i; });
  document.querySelector('[data-count]').textContent = books.length;

  function titleOf(book) {
    return book.querySelector('.m-book-title').innerText.replace(/\s+/g, ' ').trim();
  }

  function normalize(text) { return text.toLowerCase().replace(/\s+/g, ' ').trim(); }

  function pitch() {
    var first = list.querySelector('.m-book:not([hidden])');
    if (!first) return 0;
    return first.getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap || 28);
  }

  function jump(left) { shelf.scrollTo({ left: left, behavior: 'instant' }); }

  function render() {
    list.querySelectorAll('.m-clone').forEach(function (c) { c.remove(); });

    var query = normalize(search.value);
    var visible = books.filter(function (book) {
      var inFilter = activeFilter === 'all' || book.dataset.category === activeFilter;
      var text = normalize(titleOf(book) + ' ' + book.querySelector('.m-book-author').textContent);
      var match = inFilter && (!query || text.indexOf(query) !== -1);
      book.hidden = !match;
      return match;
    });

    result.textContent = visible.length + ' ном';
    empty.hidden = visible.length > 0;

    // 3-аас цөөн ном бол эргэлдүүлэхгүй
    looping = visible.length >= 3;
    controls.hidden = !looping;
    jump(0);
    if (!looping) return;

    setWidth = visible.length * pitch();
    var sets = 1 + Math.ceil(shelf.clientWidth / setWidth);
    for (var s = 0; s < sets; s++) {
      visible.forEach(function (book) {
        var clone = book.cloneNode(true);
        clone.classList.add('m-clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelector('.m-book-cover').tabIndex = -1;
        list.appendChild(clone);
      });
    }
  }

  // Эгнээ нэг бүтэн тойрсон бол анзаарагдахгүйгээр эхэнд нь буцаана
  function wrap() {
    if (looping && shelf.scrollLeft >= setWidth - 1) jump(shelf.scrollLeft - setWidth);
  }

  function step(dir) {
    if (!looping) return;
    var p = pitch();
    wrap();
    if (dir < 0 && shelf.scrollLeft < p / 2) jump(shelf.scrollLeft + setWidth);
    shelf.scrollBy({ left: dir * p, behavior: reduceMotion ? 'instant' : 'smooth' });
  }

  var settle;
  shelf.addEventListener('scroll', function () {
    clearTimeout(settle);
    settle = setTimeout(wrap, 160);
  }, { passive: true });

  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });

  function setPlaying(value) {
    playing = value;
    motionBtn.dataset.playing = String(playing);
    motionBtn.querySelector('.m-motion-text').textContent = playing ? 'Түр зогсоох' : 'Үргэлжлүүлэх';
  }
  setPlaying(playing);
  motionBtn.addEventListener('click', function () { setPlaying(!playing); });

  // Хулгана эсвэл гарын фокус тавиур дээр байхад түр зогсоно
  ['mouseenter', 'focusin'].forEach(function (type) {
    shelf.addEventListener(type, function () { hoverPause = true; });
  });
  shelf.addEventListener('mouseleave', function () { hoverPause = false; });
  shelf.addEventListener('focusout', function (e) {
    if (!shelf.contains(e.relatedTarget)) hoverPause = false;
  });

  setInterval(function () {
    if (playing && !hoverPause && !document.hidden) step(1);
  }, 3500);

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeFilter = btn.dataset.filter;
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      render();
    });
  });
  search.addEventListener('input', render);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 200);
  });

  render();

  /* ---------- 3. Номын дэлгэрэнгүй цонх ---------- */
  var dialog = document.getElementById('m-book-dialog');
  var topic = document.getElementById('m-topic');

  if (dialog && typeof dialog.showModal === 'function') {
    var dCover = dialog.querySelector('.m-dialog-cover');
    var dCat = document.getElementById('m-dialog-cat');
    var dTitle = document.getElementById('m-dialog-title');
    var dAuthor = document.getElementById('m-dialog-author');
    var current = null;

    list.addEventListener('click', function (e) {
      var cover = e.target.closest('.m-book-cover');
      if (!cover) return;
      current = books[cover.closest('.m-book').dataset.index];
      var img = current.querySelector('img');
      dCover.src = img.currentSrc || img.src;
      dCover.alt = titleOf(current) + ' номын хавтас';
      dCat.textContent = current.dataset.category;
      dTitle.textContent = titleOf(current);
      dAuthor.textContent = current.querySelector('.m-book-author').textContent;
      dialog.showModal();
    });

    document.getElementById('m-dialog-join').addEventListener('click', function () {
      if (current) topic.value = current.dataset.category;
      dialog.close();
    });
    dialog.querySelector('.m-dialog-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
  }

  /* ---------- 4. Бүртгэлийн маягт ---------- */
  var form = document.getElementById('m-form');
  var nameInput = document.getElementById('m-name');
  var contactInput = document.getElementById('m-contact');
  var consent = document.getElementById('m-consent');
  var dateSelect = document.getElementById('m-date');
  var status = document.getElementById('m-status');

  var phoneRe = /^(\+?976)?[\s-]?\d{4}[\s-]?\d{4}$/;
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function checks() {
    var contact = contactInput.value.trim();
    return [
      { field: nameInput, error: 'm-name-error', ok: nameInput.value.trim().length > 0 },
      { field: contactInput, error: 'm-contact-error', ok: phoneRe.test(contact) || emailRe.test(contact) },
      { field: consent, error: 'm-consent-error', ok: consent.checked }
    ];
  }

  var topicSelect = document.getElementById('m-topic');

  function refresh() {
    var incomplete = !nameInput.value.trim() || !contactInput.value.trim() || !consent.checked;
    form.classList.toggle('is-incomplete', incomplete);

    // Uniform Connectedness: бөглөгдсөн алхмын дугаар тодорно
    var contact = contactInput.value.trim();
    [
      [dateSelect, !!dateSelect.value],
      [nameInput, nameInput.value.trim().length > 0],
      [contactInput, phoneRe.test(contact) || emailRe.test(contact)],
      [topicSelect, !!topicSelect.value]
    ].forEach(function (pair) {
      pair[0].closest('.m-field').classList.toggle('is-done', pair[1]);
    });
  }

  // «Энэ өдөр бүртгүүлэх» — маягт дээр тэр огноог сонгоно
  document.getElementById('m-next-link').addEventListener('click', function () {
    dateSelect.selectedIndex = 0;
    refresh();
  });
  [dateSelect, topicSelect].forEach(function (el) { el.addEventListener('change', refresh); });

  function showError(item, show) {
    var msg = document.getElementById(item.error);
    msg.hidden = !show;
    if (show) {
      item.field.setAttribute('aria-invalid', 'true');
      item.field.setAttribute('aria-describedby', item.error);
    } else {
      item.field.removeAttribute('aria-invalid');
      item.field.removeAttribute('aria-describedby');
    }
  }

  [nameInput, contactInput, consent].forEach(function (el) {
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () {
      refresh();
      // Алдаа харагдаж байсан талбарыг засахад алдааг арилгана
      checks().forEach(function (item) {
        if (item.field === el && item.ok) showError(item, false);
      });
    });
  });
  refresh();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var items = checks();
    var firstBad = null;
    items.forEach(function (item) {
      showError(item, !item.ok);
      if (!item.ok && !firstBad) firstBad = item.field;
    });
    if (firstBad) {
      status.textContent = '';
      firstBad.focus();
      return;
    }

    // Сервергүй тул бүртгэлийг имэйлээр илгээнэ
    var body = [
      'Оролцох уулзалт: ' + dateSelect.value,
      'Нэр: ' + nameInput.value.trim(),
      'Утас / имэйл: ' + contactInput.value.trim(),
      'Сонирхож буй сэдэв: ' + topic.value
    ].join('\n');
    window.location.href = 'mailto:Motakenergy@gmail.com'
      + '?subject=' + encodeURIComponent('Бүлгийн уулзалтын бүртгэл — ' + dateSelect.value)
      + '&body=' + encodeURIComponent(body);
    status.textContent = 'Имэйл програм тань бэлэн захидалтай нээгдэнэ. Түүнийг илгээснээр бүртгэл бидэнд хүрнэ. Нээгдэхгүй бол +976 8811 6562 дугаарт залгаарай.';
  });
})();
