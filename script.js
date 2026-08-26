/* Reeya Bansal — portfolio interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Headshot fallback: show monogram if image fails ---- */
  document.querySelectorAll("[data-portrait]").forEach(function (img) {
    img.addEventListener("error", function () {
      img.style.display = "none";
      var fb = img.parentElement.querySelector(".portrait-fallback");
      if (fb) fb.style.display = "grid";
    });
  });

  /* ---- Scroll reveal ---- */
  var revealables = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---- Blog expand/collapse ---- */
  document.querySelectorAll(".post-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var body = document.getElementById(btn.getAttribute("aria-controls"));
      if (!body) return;
      var open = body.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.querySelector("[data-label]").textContent = open ? "Show less" : "Read the post";
    });
  });

  /* ---- Hero node network (agentic-systems signature) ---- */
  var canvas = document.getElementById("net");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var W, H, DPR, nodes = [];
    var ACCENT = "69,54,232";
    var COUNT = 26;

    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function seed() {
      nodes = [];
      for (var i = 0; i < COUNT; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.6 + 1.1
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 108) {
            ctx.strokeStyle = "rgba(" + ACCENT + "," + (0.16 * (1 - d / 108)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        ctx.beginPath();
        ctx.arc(nodes[k].x, nodes[k].y, nodes[k].r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + ACCENT + ",0.55)";
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    size(); seed(); frame();
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t); t = setTimeout(function () { size(); seed(); }, 150);
    });
  }
})();