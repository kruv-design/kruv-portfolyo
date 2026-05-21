(function () {
  var section = document.querySelector(".hero-v2");
  var el = document.getElementById("hero-v2-cursor");
  if (!section) return;

  var scrollTarget = section.getAttribute("data-scroll-target") || "works";
  var scrollHref = (section.getAttribute("data-scroll-href") || "").trim();

  section.addEventListener(
    "click",
    function (e) {
      if (e.button !== 0) return;
      if (e.target.closest("a[href], button, input, select, textarea")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (scrollHref) {
        window.location.href = scrollHref;
      } else {
        window.location.hash = scrollTarget;
      }
    },
    false,
  );

  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* Windows / hibrit: pointer:fine tek başına yetersiz; hover veya any-pointer:fine */
  var mqDesktop = window.matchMedia("(min-width: 701px)");
  var mqHover = window.matchMedia("(hover: hover)");
  var mqAnyFine = window.matchMedia("(any-pointer: fine)");

  /* Win hibrit: medya sorgusu coarse dese bile gerçek mousemove gelirse aç */
  var forceFromMouse = false;

  function shouldUseCustomCursor() {
    if (!mqDesktop.matches) return false;
    if (forceFromMouse) return true;
    return mqHover.matches || mqAnyFine.matches;
  }

  var rootStyle = getComputedStyle(document.documentElement);

  function readLerp() {
    var v = parseFloat(rootStyle.getPropertyValue("--hero-v2-cursor-lerp").trim());
    return v > 0 && v < 1 ? v : 0.18;
  }

  var targetX = 0;
  var targetY = 0;
  var posX = 0;
  var posY = 0;
  var visible = false;
  var rafId = 0;

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
    if (mqDesktop.matches && !mqHover.matches && !mqAnyFine.matches) {
      forceFromMouse = true;
    }
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

  document.addEventListener(
    "mousemove",
    function (e) {
      onPointerMove(e.clientX, e.clientY);
    },
    { passive: true },
  );

  section.addEventListener(
    "mouseleave",
    function () {
      if (visible) hideCursor();
    },
    false,
  );

  window.addEventListener(
    "scroll",
    function () {
      if (!visible) return;
      hideCursor();
    },
    { passive: true },
  );

  function onMqChange() {
    if (!shouldUseCustomCursor() && visible) hideCursor();
  }

  if (mqDesktop.addEventListener) {
    mqDesktop.addEventListener("change", onMqChange);
    mqHover.addEventListener("change", onMqChange);
    mqAnyFine.addEventListener("change", onMqChange);
  } else if (mqDesktop.addListener) {
    mqDesktop.addListener(onMqChange);
    mqHover.addListener(onMqChange);
    mqAnyFine.addListener(onMqChange);
  }
})();
