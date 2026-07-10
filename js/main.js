/* bbArch — dark cinematic v2 */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll intro: the HEADER BRAND ITSELF is the flying logo.
       It starts centre-screen (big, rotated back a full turn) and eases into its natural
       header position as you scroll. One element, no swap — so no swap can ever flicker.
       The hidden #introLogo in the intro section only provides the start geometry. ---------- */
  var intro = document.getElementById("intro");
  var introBrandA = document.querySelector(".site-header .brand");
  var introBrandLogo = document.querySelector(".site-header .brand-logo");
  if (intro && introBrandA && introBrandLogo && !reduced) {
    var introLogo = document.getElementById("introLogo"); /* invisible size/position reference */
    var introCap = document.getElementById("introCap");
    document.body.classList.add("introjs");
    var geo = null;
    var introPin = intro.querySelector(".intro__pin");
    var introTarget = 0, introCur = null, introRaf = null, introLanded = false, introPrevT = null;
    function introMeasure() {
      var c = introLogo.getBoundingClientRect(); /* visibility:hidden but still laid out */
      var range = Math.max(1, intro.offsetHeight - introPin.offsetHeight);
      var end = intro.offsetTop + range;
      /* if the pin has scrolled past its sticky end, normalise back to viewport-locked space */
      var shift = Math.max(0, window.scrollY - end);
      geo = {
        cx: c.left + c.width / 2,
        cy: c.top + shift + c.height / 2,
        ch: c.height,
        range: range,
        end: end
      };
    }
    function introApply(p) {
      /* hysteresis only decides when the transform is pinned to exactly zero */
      if (!introLanded && p >= 1) introLanded = true;
      else if (introLanded && p < 0.99) introLanded = false;
      if (introLanded) {
        introBrandLogo.style.transform = "";
        introBrandLogo.style.setProperty("--glow", "0");
      } else {
        var q = 1 - p; /* reverse progress: 1 = centre of screen, 0 = seated in header */
        var h = introBrandA.getBoundingClientRect(); /* anchor = natural spot; unaffected by the svg's transform */
        var dx = geo.cx - (h.left + h.width / 2);
        var dy = geo.cy - (h.top + h.height / 2);
        var S = geo.ch / h.height;
        introBrandLogo.style.transform =
          "translate(" + (dx * q) + "px," + (dy * q) + "px) rotate(" + (-360 * q) + "deg) scale(" + (1 + (S - 1) * q) + ")";
        introBrandLogo.style.setProperty("--glow", Math.max(0, 1 - p * 1.4).toFixed(3));
      }
      if (introCap) introCap.style.opacity = Math.max(0, 1 - p * 2.6).toFixed(3);
      document.body.classList.toggle("header-in", p > 0.45);
      document.body.classList.toggle("logo-in", introLanded);
    }
    function introLoop(t) {
      /* time-based easing: identical feel on 60Hz and 120Hz displays */
      var dt = introPrevT === null ? 1 / 60 : Math.min(0.05, (t - introPrevT) / 1000);
      introPrevT = t;
      introCur += (introTarget - introCur) * (1 - Math.exp(-8.4 * dt));
      if (Math.abs(introTarget - introCur) < 0.0004) introCur = introTarget;
      introApply(introCur);
      introRaf = (introCur === introTarget) ? null : requestAnimationFrame(introLoop);
      if (introRaf === null) introPrevT = null;
    }
    function introKick() {
      if (!geo) introMeasure();
      introTarget = Math.min(1, Math.max(0, (window.scrollY - (geo.end - geo.range)) / geo.range));
      if (introCur === null) { introCur = introTarget; introApply(introCur); return; }
      if (introRaf === null && introCur !== introTarget) introRaf = requestAnimationFrame(introLoop);
    }
    window.addEventListener("scroll", introKick, { passive: true });
    window.addEventListener("resize", function () { geo = null; introKick(); });
    setTimeout(introKick, 60);
    introKick();
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

  /* ---------- Card spotlight (cursor-tracked glow) ---------- */
  if (window.matchMedia("(pointer: fine)").matches && !reduced) {
    document.querySelectorAll(".cap,.pcard").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      }, { passive: true });
    });
  }

  /* ---------- Marquee: leans with scroll velocity ---------- */
  var marquee = document.querySelector(".marquee");
  if (marquee && !reduced) {
    var mLastY = window.scrollY, mSkew = 0, mRaf = null;
    var mLoop = function () {
      mSkew *= 0.9;
      if (Math.abs(mSkew) < 0.05) {
        mSkew = 0; marquee.style.transform = ""; mRaf = null; return;
      }
      marquee.style.transform = "skewX(" + mSkew.toFixed(2) + "deg)";
      mRaf = requestAnimationFrame(mLoop);
    };
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      mSkew = Math.max(-10, Math.min(10, (y - mLastY) * 0.28));
      mLastY = y;
      if (mRaf === null) mRaf = requestAnimationFrame(mLoop);
    }, { passive: true });
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
