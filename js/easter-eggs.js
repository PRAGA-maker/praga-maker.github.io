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
    var squishX = 1;
    var squishY = 1;
    var isSquishing = false;
    var targetTiltX = 0;
    var targetTiltY = 0;
    var isTouchDevice = "ontouchstart" in window;

    function animate() {
      if (!isTouchDevice) {
        // Desktop: proximity-based speed and tilt are set via mousemove
        angleX += (targetTiltX - angleX) * 0.08;
      } else {
        // Mobile: constant auto-rotate, no tilt
        angleX = 0;
      }

      angleY += currentSpeed;

      // Squish spring-back
      if (!isSquishing) {
        squishX += (1 - squishX) * 0.15;
        squishY += (1 - squishY) * 0.15;
      }

      ring.style.transform =
        "rotateX(" + angleX + "deg) " +
        "rotateY(" + angleY + "deg) " +
        "scaleX(" + squishX + ") " +
        "scaleY(" + squishY + ")";

      requestAnimationFrame(animate);
    }

    animate();

    if (!isTouchDevice) {
      // Desktop: mouse proximity
      document.addEventListener("mousemove", function (e) {
        var rect = scene.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 250) {
          // Ramp speed: closer = faster, up to 4x
          var t = 1 - dist / 250;
          currentSpeed = baseSpeed + t * baseSpeed * 3;
          // Tilt toward cursor
          targetTiltX = (dy / 250) * -15;
          targetTiltY += ((dx / 250) * 15 - targetTiltY) * 0.08;
        } else {
          currentSpeed = baseSpeed;
          targetTiltX = 0;
          targetTiltY = 0;
        }

        // Show "Click Me!" when close
        if (clickLabel) {
          clickLabel.style.opacity = dist < 100 ? "1" : "0";
        }
      });

      // Desktop: squish on mousedown
      scene.addEventListener("mousedown", function () {
        isSquishing = true;
        squishX = 1.3;
        squishY = 0.6;
      });

      document.addEventListener("mouseup", function () {
        isSquishing = false;
      });
    } else {
      // Mobile: tap to squish
      scene.addEventListener("touchstart", function (e) {
        e.preventDefault();
        isSquishing = true;
        squishX = 1.3;
        squishY = 0.6;
      });

      scene.addEventListener("touchend", function () {
        isSquishing = false;
        // Spawn kaomoji on tap
        spawnKaomoji();
      });
    }

    // Click: spawn kaomoji
    scene.addEventListener("click", function () {
      spawnKaomoji();
    });

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
