(function () {
  var WORDS = ["brands", "stories", "feeds"];
  var INTERVAL = 2400;
  var FIRST_ROTATE_DELAY = 1200;
  var ANIM_IN_MS = 320;
  var ANIM_STAGGER_MS = 40;
  var MIN_MEASURED_WIDTH = 40;
  /** Descender probe — slot yüksekliği tüm kelimelerde sabit */
  var SLOT_PROBE = "gypjq";

  var wb = document.getElementById("hero-v2-wb");
  if (!wb) return;
  var current = document.getElementById("hero-v2-wa");
  if (!current) return;
  var measureRoot = wb.closest(".hero-v2-inner") || wb.parentElement || document.body;
  var metricsRoot = wb.closest(".hero-v2-headline") || measureRoot;

  var idx = 0;
  var busy = false;
  var firstDelayId = null;
  var intervalId = null;
  var booted = false;
  var bootAttempts = 0;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function styleRef() {
    return current && current.isConnected ? current : wb.querySelector(".hero-v2-word");
  }

  function copyFontStyles(el, ref) {
    if (!ref) return;
    try {
      var cs = window.getComputedStyle(ref);
      el.style.fontFamily = cs.fontFamily;
      el.style.fontSize = cs.fontSize;
      el.style.fontWeight = cs.fontWeight;
      el.style.fontStyle = cs.fontStyle;
      el.style.fontStretch = cs.fontStretch;
      el.style.letterSpacing = cs.letterSpacing;
      el.style.fontVariant = cs.fontVariant;
      el.style.fontVariationSettings = cs.fontVariationSettings;
      el.style.textTransform = cs.textTransform;
      el.style.lineHeight = cs.lineHeight;
    } catch (e) {
      /* ignore */
    }
  }

  function measureWidth(text) {
    var ref = styleRef();
    var el = document.createElement("span");
    el.className = "hero-v2-word";
    el.setAttribute("aria-hidden", "true");
    el.textContent = text;
    el.style.cssText =
      "position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;white-space:nowrap;display:inline-block;";
    copyFontStyles(el, ref);
    measureRoot.appendChild(el);
    var w = el.getBoundingClientRect().width;
    if (!w) w = el.offsetWidth;
    if (!w && el.scrollWidth) w = el.scrollWidth;
    measureRoot.removeChild(el);
    return Math.ceil(w);
  }

  function measureSlotHeight() {
    var ref = styleRef();
    var el = document.createElement("span");
    el.className = "hero-v2-word";
    el.setAttribute("aria-hidden", "true");
    el.textContent = SLOT_PROBE;
    el.style.cssText =
      "position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;white-space:nowrap;display:inline-block;";
    copyFontStyles(el, ref);
    measureRoot.appendChild(el);
    var h = el.getBoundingClientRect().height;
    if (!h) h = el.offsetHeight;
    measureRoot.removeChild(el);
    return Math.ceil(h);
  }

  function isMeasurementReady() {
    for (var i = 0; i < WORDS.length; i++) {
      if (measureWidth(WORDS[i]) >= MIN_MEASURED_WIDTH) return true;
    }
    return false;
  }

  function lockMaxBoxWidth() {
    var max = 0;
    for (var i = 0; i < WORDS.length; i++) {
      max = Math.max(max, measureWidth(WORDS[i]));
    }
    if (max < MIN_MEASURED_WIDTH) return false;
    wb.style.width = max + "px";
    return true;
  }

  function syncSlotMetrics() {
    var slotH = measureSlotHeight();
    if (slotH < 8) return false;
    metricsRoot.style.setProperty("--hero-v2-slot-h", slotH + "px");
    metricsRoot.style.setProperty("--hero-v2-line1-h", slotH + "px");
    wb.style.height = slotH + "px";
    wb.style.minHeight = slotH + "px";

    var suffix = metricsRoot.querySelector(".hero-v2-suffix");
    if (suffix) {
      var sh = Math.ceil(suffix.getBoundingClientRect().height);
      if (sh > 0) {
        metricsRoot.style.setProperty("--hero-v2-suffix-h", sh + "px");
      }
    }
    return true;
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
    wb.appendChild(incoming);
    current.classList.add("hero-v2-anim-out");
    window.setTimeout(function () {
      incoming.classList.add("hero-v2-anim-in");
      window.setTimeout(function () {
        if (current && current.parentNode) current.remove();
        incoming.classList.remove("hero-v2-anim-in");
        current = incoming;
        idx = next;
        busy = false;
      }, ANIM_IN_MS);
    }, ANIM_STAGGER_MS);
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

  function boot() {
    if (!isMeasurementReady()) return false;
    if (!syncSlotMetrics()) return false;
    lockMaxBoxWidth();
    if (!booted) {
      booted = true;
      beginLoop();
    }
    return true;
  }

  function scheduleBoot() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (boot()) return;
        bootAttempts += 1;
        if (bootAttempts < 40) {
          window.setTimeout(scheduleBoot, bootAttempts < 6 ? 80 : 200);
        }
      });
    });
  }

  function whenDisplayFontReady(cb) {
    if (!document.fonts || !document.fonts.load) {
      cb();
      return;
    }
    var ref = styleRef();
    var size = "16px";
    var family = "Switzer";
    if (ref) {
      try {
        var cs = window.getComputedStyle(ref);
        if (cs.fontSize) size = cs.fontSize;
        if (cs.fontFamily) family = cs.fontFamily.split(",")[0].replace(/['"]/g, "").trim();
      } catch (e) {}
    }
    Promise.all([
      document.fonts.load("500 " + size + " " + family),
      document.fonts.ready,
    ])
      .then(cb, cb)
      .catch(cb);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleBoot, { once: true });
  } else {
    scheduleBoot();
  }
  window.addEventListener("load", scheduleBoot, { once: true });
  whenDisplayFontReady(scheduleBoot);
  window.setTimeout(scheduleBoot, 400);
  window.setTimeout(scheduleBoot, 1200);
  window.setTimeout(scheduleBoot, 2400);

  window.addEventListener(
    "resize",
    function () {
      if (!booted) return;
      syncSlotMetrics();
      lockMaxBoxWidth();
    },
    { passive: true },
  );
})();
