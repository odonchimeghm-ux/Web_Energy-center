// Хөдөлгөөн: хэсгүүд гүйлгэхэд аажмаар тодорч гарч ирнэ.
// <head> доторх скрипт `reveal-on` классыг зөвхөн хөдөлгөөн зөвшөөрсөн үед нэмдэг.
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('reveal-on')) return;

  var targets = document.querySelectorAll(
    '.about, .services, .values, .quote, .results, .faq, .formats, .cta'
  );

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
