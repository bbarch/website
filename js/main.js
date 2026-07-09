/* bbArch — dark cinematic v2 */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  var loader = document.querySelector(".loader");
  if (loader) {
    var seen = sessionStorage.getItem("bb-seen");
    if (seen || reduced) {
      loader.remove();
    } else {
      var pct = loader.querySelector(".pct");
      var n = 0;
      var t = setInterval(function () {
        n = Math.min(100, n + Math.ceil(Math.random() * 22));
        if (pct) pct.textContent = String(n).padStart(3, "0") + " %";
        if (n >= 100) {
          clearInterval(t);
          loader.classList.add("done");
          sessionStorage.setItem("bb-seen", "1");
          setTimeout(function () { loader.remove(); }, 1000);
        }
      }, 120);
    }
  }

  /* ---------- Theme toggle (dark / light) ---------- */
  var root = document.documentElement;
  function syncMeta() {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", root.getAttribute("data-theme") === "light" ? "#f5f3ec" : "#0b0b09");
  }
  syncMeta();
  var themeBtn = document.querySelector(".theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("bb-theme", next); } catch (e) {}
      themeBtn.setAttribute("aria-pressed", next === "light" ? "true" : "false");
      syncMeta();
    });
  }

  /* ---------- Header state + progress ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".progress");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Fullscreen menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      var label = menuBtn.querySelector(".menu-label");
      if (label) label.textContent = open ? "Close" : "Menu";
      document.querySelectorAll(".menu nav a").forEach(function (a, i) {
        a.style.transitionDelay = open ? 0.15 + i * 0.06 + "s" : "0s";
      });
      document.body.style.overflow = open ? "hidden" : "";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) menuBtn.click();
    });
  }

  /* ---------- Custom cursor ---------- */
  if (window.matchMedia("(pointer: fine)").matches && !reduced) {
    var dot = document.createElement("div"); dot.className = "cursor";
    var ring = document.createElement("div"); ring.className = "cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", function (e) {
      ring.classList.toggle("hot", !!e.target.closest("a,button,.gcard,.strip figure"));
    }, { passive: true });
  }

  /* ---------- Reveals ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll("[data-reveal],[data-reveal-line]").forEach(function (el) { io.observe(el); });

  /* ---------- Parallax bands ---------- */
  var bands = document.querySelectorAll(".band img");
  if (bands.length && !reduced) {
    var ticking = false;
    var parallax = function () {
      bands.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        img.style.transform = "translateY(" + p * -7 + "%)";
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* ---------- Stat counters ---------- */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target, target = parseInt(el.getAttribute("data-count"), 10), cur = 0;
      var step = Math.max(1, Math.round(target / 50));
      (function tick() {
        cur = Math.min(target, cur + step);
        el.textContent = String(cur).padStart(2, "0");
        if (cur < target) requestAnimationFrame(tick);
      })();
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  /* ---------- Magnetic buttons ---------- */
  if (window.matchMedia("(pointer: fine)").matches && !reduced) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.14 + "px," +
          (e.clientY - r.top - r.height / 2) * 0.22 + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---------- Image fallback ---------- */
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    img.addEventListener("error", function () {
      var ph = document.createElement("div");
      ph.style.cssText = "display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:200px;background:#1a1a17;color:#8f8b7e;font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;text-align:center;padding:20px";
      ph.textContent = img.getAttribute("data-fallback") || "bbArch";
      img.replaceWith(ph);
    }, { once: true });
  });

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Analytics events (GoatCounter) ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || !(window.goatcounter && window.goatcounter.count)) return;
    var href = a.getAttribute("href") || "";
    var name = null;
    if (href.indexOf("tel:") === 0) name = "phone-click";
    else if (href.indexOf("mailto:") === 0) name = "email-click";
    else if (href.indexOf("forms.gle") !== -1) name = "careers-apply";
    if (name) window.goatcounter.count({ path: name, title: name, event: true });
  }, { passive: true });
})();
