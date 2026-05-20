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

  var mq = window.matchMedia("(min-width: 701px) and (pointer: fine)");
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
  }

  section.addEventListener("mousemove", function (e) {
    if (!mq.matches) return;
    targetX = e.clientX;
    targetY = e.clientY;
    if (!visible) {
      visible = true;
      el.classList.add("is-active");
      el.setAttribute("aria-hidden", "false");
      posX = targetX;
      posY = targetY;
      setTransform();
    }
    kickLerp();
  });

  section.addEventListener("mouseleave", function () {
    if (!mq.matches) return;
    if (visible) hideCursor();
    kickLerp();
  });
})();
