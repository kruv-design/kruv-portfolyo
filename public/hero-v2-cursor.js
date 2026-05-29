(function (global) {
  var activeTeardown = null;

  function initHeroV2Cursor() {
    if (activeTeardown) {
      activeTeardown();
      activeTeardown = null;
    }

    var section = document.querySelector(".hero-v2");
    var el = document.getElementById("hero-v2-cursor");
    if (!section) return;

    var cleanups = [];

    function on(target, ev, fn, opts) {
      target.addEventListener(ev, fn, opts);
      cleanups.push(function () {
        target.removeEventListener(ev, fn, opts);
      });
    }

    var scrollTarget = section.getAttribute("data-scroll-target") || "works";

    function resolveHeroNavigateHref() {
      var href = (section.getAttribute("data-scroll-href") || "").trim();
      if (href) return href;
      href = (section.getAttribute("data-cta-href") || "").trim();
      if (href) return href;
      var cta = section.querySelector("a.hero-v2-mobile-cta[href]");
      if (cta) return (cta.getAttribute("href") || "").trim();
      return "";
    }

    function onSectionClick(e) {
      if (e.button !== 0) return;
      if (e.target.closest("a[href], button, input, select, textarea")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var href = resolveHeroNavigateHref();
      if (href.charAt(0) === "#") {
        window.location.hash = href.slice(1) || scrollTarget;
        return;
      }
      if (href) {
        window.location.assign(href);
        return;
      }
      window.location.hash = scrollTarget;
    }

    on(section, "click", onSectionClick, false);

    if (!el) {
      activeTeardown = function () {
        cleanups.forEach(function (c) {
          c();
        });
      };
      return;
    }

    var mqDesktop = window.matchMedia("(min-width: 701px)");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function shouldUseCustomCursor() {
      return mqDesktop.matches;
    }

    var rootStyle = getComputedStyle(document.documentElement);

    function readLerp() {
      if (reduceMotion) return 1;
      var v = parseFloat(rootStyle.getPropertyValue("--hero-v2-cursor-lerp").trim());
      return v > 0 && v < 1 ? v : 0.18;
    }

    var targetX = 0;
    var targetY = 0;
    var posX = 0;
    var posY = 0;
    var visible = false;
    var rafId = 0;
    var lastX = 0;
    var lastY = 0;

    function setTransform() {
      el.style.transform =
        "translate3d(" + posX.toFixed(2) + "px," + posY.toFixed(2) + "px,0) translate(-50%,-50%)";
    }

    function stepLerp() {
      var k = readLerp();
      posX += (targetX - posX) * k;
      posY += (targetY - posY) * k;
      setTransform();
      var dist = Math.hypot(targetX - posX, targetY - posY);
      if (dist > 0.12) {
        rafId = requestAnimationFrame(stepLerp);
      } else {
        rafId = 0;
      }
    }

    function kickLerp() {
      if (!rafId) rafId = requestAnimationFrame(stepLerp);
    }

    function hideCursor() {
      visible = false;
      el.classList.remove("is-active");
      el.setAttribute("aria-hidden", "true");
      section.classList.remove("is-custom-cursor-active");
    }

    function showCursor(x, y) {
      targetX = x;
      targetY = y;
      if (!visible) {
        visible = true;
        el.classList.add("is-active");
        el.setAttribute("aria-hidden", "false");
        section.classList.add("is-custom-cursor-active");
        posX = targetX;
        posY = targetY;
        setTransform();
      }
      kickLerp();
    }

    function isPointerOverHero(clientX, clientY) {
      var r = section.getBoundingClientRect();
      return (
        clientX >= r.left &&
        clientX <= r.right &&
        clientY >= r.top &&
        clientY <= r.bottom
      );
    }

    function onPointerMove(clientX, clientY) {
      lastX = clientX;
      lastY = clientY;
      if (!shouldUseCustomCursor()) {
        if (visible) hideCursor();
        return;
      }
      if (!isPointerOverHero(clientX, clientY)) {
        if (visible) hideCursor();
        return;
      }
      targetX = clientX;
      targetY = clientY;
      if (!visible) {
        showCursor(clientX, clientY);
        return;
      }
      kickLerp();
    }

    function bindPointerMove(e) {
      if (e.pointerType === "touch") return;
      onPointerMove(e.clientX, e.clientY);
    }

    on(document, "mousemove", bindPointerMove, { passive: true });
    on(document, "pointermove", bindPointerMove, { passive: true });

    function onPointerEnter(e) {
      if (e.pointerType === "touch") return;
      if (!shouldUseCustomCursor()) return;
      onPointerMove(e.clientX, e.clientY);
    }

    on(section, "pointerenter", onPointerEnter, { passive: true });

    function onMouseLeave() {
      if (visible) hideCursor();
    }

    on(section, "mouseleave", onMouseLeave, false);

    function onScroll() {
      if (!visible) return;
      if (isPointerOverHero(lastX, lastY)) return;
      hideCursor();
    }

    on(window, "scroll", onScroll, { passive: true });

    function onMqChange() {
      if (!shouldUseCustomCursor() && visible) hideCursor();
    }

    if (mqDesktop.addEventListener) {
      mqDesktop.addEventListener("change", onMqChange);
      cleanups.push(function () {
        mqDesktop.removeEventListener("change", onMqChange);
      });
    } else if (mqDesktop.addListener) {
      mqDesktop.addListener(onMqChange);
      cleanups.push(function () {
        mqDesktop.removeListener(onMqChange);
      });
    }

    activeTeardown = function () {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      hideCursor();
      cleanups.forEach(function (c) {
        c();
      });
      activeTeardown = null;
    };
  }

  global.initHeroV2Cursor = initHeroV2Cursor;
  global.destroyHeroV2Cursor = function () {
    if (activeTeardown) activeTeardown();
  };

  initHeroV2Cursor();
})(typeof window !== "undefined" ? window : this);
