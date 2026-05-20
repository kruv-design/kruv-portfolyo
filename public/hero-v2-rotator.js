(function () {
  var WORDS = ["brands", "campaigns", "stories", "feeds"];
  var INTERVAL = 2400;
  var FIRST_ROTATE_DELAY = 1200;

  var wb = document.getElementById("hero-v2-wb");
  if (!wb) return;
  var current = document.getElementById("hero-v2-wa");
  if (!current) return;
  var idx = 0;
  var busy = false;
  var firstDelayId = null;
  var intervalId = null;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function styleRef() {
    return current && current.isConnected ? current : wb.querySelector(".hero-v2-word");
  }

  function measureWidth(text) {
    var ref = styleRef();
    var el = document.createElement("span");
    el.className = "hero-v2-word";
    el.setAttribute("aria-hidden", "true");
    el.textContent = text;
    el.style.cssText =
      "position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;white-space:nowrap;";
    if (ref) {
      try {
        var cs = window.getComputedStyle(ref);
        el.style.font = cs.font;
        el.style.letterSpacing = cs.letterSpacing;
      } catch (e) {}
    }
    wb.appendChild(el);
    var w = el.getBoundingClientRect().width;
    if (!w) w = el.offsetWidth;
    wb.removeChild(el);
    return Math.max(8, Math.ceil(w));
  }

  function setBoxWidth(text) {
    var w = measureWidth(text);
    wb.style.width = w + "px";
    return w;
  }

  function clearLoop() {
    if (firstDelayId) {
      clearTimeout(firstDelayId);
      firstDelayId = null;
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function rotateReduced() {
    if (busy) return;
    busy = true;
    try {
      var next = (idx + 1) % WORDS.length;
      current.textContent = WORDS[next];
      setBoxWidth(WORDS[next]);
      idx = next;
    } finally {
      busy = false;
    }
  }

  function rotate() {
    if (busy) return;
    busy = true;
    var next = (idx + 1) % WORDS.length;
    var incoming = document.createElement("span");
    incoming.className = "hero-v2-word";
    incoming.textContent = WORDS[next];
    incoming.style.cssText =
      "position:absolute;top:0;left:0;white-space:nowrap;transform:translateY(110%);opacity:0";
    wb.appendChild(incoming);
    current.classList.add("hero-v2-anim-out");
    current.style.position = "absolute";
    current.style.top = "0";
    current.style.left = "0";
    setBoxWidth(WORDS[next]);
    window.setTimeout(function () {
      incoming.style.cssText = "";
      incoming.classList.add("hero-v2-anim-in");
      window.setTimeout(function () {
        if (current && current.parentNode) current.remove();
        incoming.classList.remove("hero-v2-anim-in");
        current = incoming;
        idx = next;
        busy = false;
      }, 300);
    }, 50);
  }

  function beginLoop() {
    clearLoop();
    if (reduceMotion) {
      firstDelayId = window.setTimeout(function () {
        rotateReduced();
        intervalId = window.setInterval(rotateReduced, INTERVAL);
      }, FIRST_ROTATE_DELAY);
      return;
    }
    firstDelayId = window.setTimeout(function () {
      rotate();
      intervalId = window.setInterval(rotate, INTERVAL);
    }, FIRST_ROTATE_DELAY);
  }

  var booted = false;
  function boot() {
    if (setBoxWidth(WORDS[idx]) < 8) return;
    if (!booted) {
      booted = true;
      beginLoop();
    }
  }

  function scheduleBoot() {
    requestAnimationFrame(function () {
      requestAnimationFrame(boot);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleBoot, { once: true });
  } else {
    scheduleBoot();
  }
  window.addEventListener("load", scheduleBoot, { once: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleBoot, scheduleBoot);
  }
  window.setTimeout(scheduleBoot, 1200);
})();
