/* bbArch — interactions (refined) */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        header.classList.remove("menu-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Scroll progress bar ---- */
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  /* ---- Header solid-on-scroll ---- */
  var hero = document.querySelector(".hero, .page-hero");
  function headerState() {
    if (!header) return;
    var threshold = hero ? hero.offsetHeight - 90 : 100;
    header.classList.toggle("solid", window.scrollY > threshold);
  }

  /* ---- Scroll reveal (content) ---- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Image mask reveal (elegant clip) ---- */
  var imgWraps = document.querySelectorAll(".imgband, .gcard, .partner__img");
  imgWraps.forEach(function (el) { el.classList.add("reveal-img"); });
  if ("IntersectionObserver" in window && imgWraps.length && !reduce) {
    var io2 = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io2.unobserve(e.target); }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -4% 0px" }
    );
    imgWraps.forEach(function (el) { io2.observe(el); });
  } else {
    imgWraps.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Parallax (hero bg only; feature images use clip reveal) ---- */
  var heroImg = document.querySelector(".hero__bg img");
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }
  function update() {
    var y = window.scrollY;
    var vh = window.innerHeight;

    // progress bar
    var docH = document.documentElement.scrollHeight - vh;
    bar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";

    headerState();

    if (!reduce && heroImg) {
      heroImg.style.transform = "translateY(" + y * 0.16 + "px)";
    }
    ticking = false;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();

  /* ---- Scrollspy (single-page nav) ---- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = {};
  document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) {
    navLinks[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window && sections.length && Object.keys(navLinks).length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var id = e.target.id;
            Object.keys(navLinks).forEach(function (k) {
              navLinks[k].removeAttribute("aria-current");
            });
            if (navLinks[id]) navLinks[id].setAttribute("aria-current", "page");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Image fallback ---- */
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    img.addEventListener("error", function () {
      var ph = document.createElement("div");
      ph.className = "ph";
      ph.style.cssText = "position:absolute;inset:0;";
      var s = document.createElement("span");
      s.textContent = img.getAttribute("data-fallback") || "bbArch";
      ph.appendChild(s);
      if (img.parentElement) {
        img.parentElement.style.position = img.parentElement.style.position || "relative";
        img.parentElement.appendChild(ph);
      }
      img.style.display = "none";
    });
  });

  /* ---- Current year ---- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
