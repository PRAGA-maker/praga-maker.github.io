// ============================================================
//  Easter Eggs — donut ring, sparkles, card tilt, title wobble
// ============================================================

(function () {
  "use strict";

  // ---------- 1. 2D Circular Donut Orbit ----------
  var kaomoji = ["(◕‿◕)", "(ノ◕ヮ◕)ノ*:・゚✧", "(╯°□°)╯︵ ┻━┻", "(づ｡◕‿‿◕｡)づ", "ʕ•ᴥ•ʔ", "( ˘▽˘)っ♨", "(⌐■_■)"];

  var scene = document.querySelector(".donut-scene");
  var ring = document.querySelector(".donut-ring");
  var clickLabel = document.querySelector(".click-me-label");

  if (scene && ring) {
    var faces = ring.querySelectorAll(".donut-face");
    var numFaces = faces.length;
    var angleY = 0;
    var baseSpeed = 0.3;
    var currentSpeed = baseSpeed;
    var targetSpeed = baseSpeed;
    var isTouchDevice = "ontouchstart" in window;

    // Orbit radius — responsive
    var orbitRadius = window.innerWidth > 768 ? 200 : 120;
    window.addEventListener("resize", function () {
      orbitRadius = window.innerWidth > 768 ? 200 : 120;
    });

    // Cursor-speed tracking
    var prevMouseX = null;
    var prevTime = null;
    var lastDirection = 1;
    var mouseIdleTimer = null;
    var cumulativeX = 0;
    var directionThreshold = 30;

    // Gaussian burst tracking
    var burstStartTime = null;
    var burstDirection = 1;

    function animate() {
      var now = performance.now();

      // Gaussian bell-curve click burst
      if (burstStartTime !== null) {
        var elapsed = (now - burstStartTime) / 1000;
        if (elapsed > 0.2) {
          burstStartTime = null;
        } else {
          var t = (elapsed - 0.1) / 0.04;
          var boost = baseSpeed * Math.exp(-(t * t));
          currentSpeed += burstDirection * boost;
        }
      }

      // Smooth ease toward target speed
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;

      angleY += currentSpeed;

      // Position each face on a flat circular orbit
      for (var i = 0; i < numFaces; i++) {
        var deg = angleY + i * (360 / numFaces);
        var rad = deg * Math.PI / 180;
        var x = orbitRadius * Math.cos(rad);
        var y = orbitRadius * Math.sin(rad);
        faces[i].style.transform = "translate(" + x + "px, " + y + "px)";
      }

      requestAnimationFrame(animate);
    }

    animate();

    if (!isTouchDevice) {
      // Desktop: cursor-speed-based exponential acceleration
      document.addEventListener("mousemove", function (e) {
        var now = performance.now();
        var rect = scene.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (prevMouseX !== null && prevTime !== null) {
          var vx = e.clientX - prevMouseX;
          var dt = Math.max(now - prevTime, 1);
          var velocity = Math.abs(vx) / dt;

          // Cumulative hysteresis: only flip direction after sustained movement
          cumulativeX += vx;
          if (Math.abs(cumulativeX) > directionThreshold) {
            lastDirection = Math.sign(cumulativeX);
            cumulativeX = 0;
          }

          targetSpeed = lastDirection * baseSpeed * Math.exp(0.02 * velocity);
          targetSpeed = Math.max(-15, Math.min(15, targetSpeed));
        }

        prevMouseX = e.clientX;
        prevTime = now;

        // Decay targetSpeed toward baseSpeed when mouse stops
        clearTimeout(mouseIdleTimer);
        mouseIdleTimer = setTimeout(function () {
          targetSpeed = baseSpeed;
        }, 150);

        // Show "Click Me!" when close
        if (clickLabel) {
          clickLabel.style.opacity = dist < 150 ? "1" : "0";
        }
      });
    }

    // Click: Gaussian burst + kaomoji
    scene.addEventListener("click", function () {
      burstStartTime = performance.now();
      burstDirection = Math.sign(currentSpeed) || 1;
      spawnKaomoji();
    });

    // Mobile: tap spawns kaomoji
    if (isTouchDevice) {
      scene.addEventListener("touchend", function () {
        burstStartTime = performance.now();
        burstDirection = Math.sign(currentSpeed) || 1;
        spawnKaomoji();
      });
    }

    function spawnKaomoji() {
      var reaction = document.createElement("span");
      reaction.className = "buddy-reaction";
      reaction.textContent = kaomoji[Math.floor(Math.random() * kaomoji.length)];
      scene.appendChild(reaction);
      setTimeout(function () { reaction.remove(); }, 1300);
    }
  }

  // ---------- 2. Click Sparkles ----------
  document.addEventListener("click", function (e) {
    if (e.target.closest("a, button, canvas, .donut-scene, table")) return;

    for (var i = 0; i < 6; i++) {
      var s = document.createElement("div");
      s.className = "sparkle";
      var angle = Math.random() * Math.PI * 2;
      var dist = 20 + Math.random() * 30;
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.background = Math.random() > 0.5 ? "#F4A8A0" : "#B795E4";
      s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      document.body.appendChild(s);
      setTimeout(function (el) { el.remove(); }, 800, s);
    }
  });

  // ---------- 3. Card Tilt (3D perspective follow) ----------
  var cards = document.querySelectorAll(".card");
  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      var tiltX = y * -8;
      var tiltY = x *  8;
      card.style.transform = "perspective(600px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg) translateY(-2px)";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  // ---------- 4. Title Wobble on Hover ----------
  var title = document.querySelector(".header h1");
  if (title) {
    var text = title.textContent;
    title.textContent = "";
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement("span");
      span.textContent = text[i];
      span.className = "wobble-letter";
      span.style.animationDelay = (i * 0.06) + "s";
      title.appendChild(span);
    }

    title.addEventListener("mouseenter", function () {
      var letters = title.querySelectorAll(".wobble-letter");
      letters.forEach(function (l) {
        l.classList.remove("wobbling");
        void l.offsetWidth;
        l.classList.add("wobbling");
      });
    });
  }
})();
