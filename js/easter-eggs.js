// ============================================================
//  Easter Eggs — pixel buddy, sparkles, card tilt, tilde mood
// ============================================================

(function () {
  "use strict";

  // ---------- 1. Pixel Buddy (squishy press) ----------
  const kaomoji = ["(◕‿◕)", "(ノ◕ヮ◕)ノ*:・゚✧", "(╯°□°)╯︵ ┻━┻", "(づ｡◕‿‿◕｡)づ", "ʕ•ᴥ•ʔ", "( ˘▽˘)っ♨", "(⌐■_■)"];
  const buddy = document.querySelector(".pixel-buddy");

  if (buddy) {
    // squish down on press, spring back on release
    buddy.addEventListener("mousedown", function () {
      buddy.classList.add("squish");
    });

    buddy.addEventListener("mouseup", function () {
      buddy.classList.remove("squish");
      buddy.classList.remove("spring");
      void buddy.offsetWidth;
      buddy.classList.add("spring");
    });

    buddy.addEventListener("mouseleave", function () {
      buddy.classList.remove("squish");
    });

    buddy.addEventListener("click", function () {
      var reaction = document.createElement("span");
      reaction.className = "buddy-reaction";
      reaction.textContent = kaomoji[Math.floor(Math.random() * kaomoji.length)];
      buddy.appendChild(reaction);
      setTimeout(function () { reaction.remove(); }, 1300);
    });
  }

  // ---------- 2. Click Sparkles ----------
  document.addEventListener("click", function (e) {
    if (e.target.closest("a, button, canvas, .pixel-buddy, .tilde, table")) return;

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
      var x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      var tiltX = y * -8;  // degrees
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
    // wrap each letter in a span for individual animation
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

  // ---------- 5. Footer Tilde — Mood Colors ----------
  var moods = ["#FFF8F0", "#F0F4FF", "#F4FFF0", "#FFF0F8", "#F0FFFA", "#FFF5E6"];
  var moodIdx = 0;
  var tilde = document.querySelector(".tilde");

  if (tilde) {
    tilde.addEventListener("click", function () {
      moodIdx = (moodIdx + 1) % moods.length;
      document.body.style.background = moods[moodIdx];
    });
  }
})();
