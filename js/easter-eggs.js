// ============================================================
//  Easter Eggs — donut ring, sparkles, card tilt, title wobble
// ============================================================

(function () {
  "use strict";

  // ---------- 1. 3D Donut Ring ----------
  var kaomoji = ["(◕‿◕)", "(ノ◕ヮ◕)ノ*:・゚✧", "(╯°□°)╯︵ ┻━┻", "(づ｡◕‿‿◕｡)づ", "ʕ•ᴥ•ʔ", "( ˘▽˘)っ♨", "(⌐■_■)"];

  var scene = document.querySelector(".donut-scene");
  var ring = document.querySelector(".donut-ring");
  var clickLabel = document.querySelector(".click-me-label");

  if (scene && ring) {
    var angleY = 0;
    var angleX = 0;
    var baseSpeed = 0.3;
    var currentSpeed = baseSpeed;
    var targetSpeed = baseSpeed;
    var targetTiltX = 0;
    var targetTiltY = 0;
    var isTouchDevice = "ontouchstart" in window;

    // Cursor-speed tracking
    var prevMouseX = null;
    var prevTime = null;
    var lastDirection = 1;
    var mouseIdleTimer = null;

    // Gaussian burst tracking
    var burstStartTime = null;
    var burstDirection = 1;

    function animate() {
      var now = performance.now();

      if (!isTouchDevice) {
        // Smooth tilt toward cursor
        angleX += (targetTiltX - angleX) * 0.08;
      } else {
        angleX = 0;
      }

      // Gaussian bell-curve click burst
      if (burstStartTime !== null) {
        var elapsed = (now - burstStartTime) / 1000;
        if (elapsed > 1.5) {
          burstStartTime = null;
        } else {
          var t = (elapsed - 0.75) / 0.25;
          var boost = 20 * Math.exp(-(t * t));
          currentSpeed += burstDirection * boost;
        }
      }

      // Smooth ease toward target speed
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;

      angleY += currentSpeed;

      ring.style.transform =
        "rotateX(" + angleX + "deg) " +
        "rotateY(" + angleY + "deg)";

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
          var dt = Math.max(now - prevTime, 1); // clamp to avoid div-by-zero
          var velocity = Math.abs(vx) / dt;
          var direction = vx !== 0 ? Math.sign(vx) : lastDirection;

          targetSpeed = direction * baseSpeed * Math.exp(0.02 * velocity);
          // Cap at ±15 to prevent runaway
          targetSpeed = Math.max(-15, Math.min(15, targetSpeed));

          if (vx !== 0) lastDirection = direction;
        }

        prevMouseX = e.clientX;
        prevTime = now;

        // Tilt toward cursor
        targetTiltX = (dy / 250) * -15;
        targetTiltY += ((dx / 250) * 15 - targetTiltY) * 0.08;

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
