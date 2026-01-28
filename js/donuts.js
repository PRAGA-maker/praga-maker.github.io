// ============================================================
//  Pixel-Art Donut Renderer — 16x16 canvas sprites
// ============================================================

(function () {
  "use strict";

  // Each sprite is a 16-row string array.
  // Characters map to palette entries; "." = transparent.

  var SPRITES = {
    // 1. Classic Pink Frosted — ring with pink frosting drips
    "classic-frosted": {
      palette: {
        b: "#8B4513",  // brown dough
        B: "#A0622E",  // dough highlight
        f: "#FF90A0",  // pink frosting
        F: "#FFB6C1",  // frosting highlight
        d: "#FF6B8A"   // frosting drip
      },
      rows: [
        "......bbbb......",
        "....bbBBBBbb....",
        "...bFFFFFFFFb...",
        "..bFFFFFFFFFfb..",
        ".bFFFF....FFFfb.",
        ".bFFF......FFfb.",
        "bfFF........Ffbb",
        "bfF..........fbb",
        "bbf..........bbb",
        "bbb..........bbb",
        ".bbb........bbb.",
        ".bbbd......bbb..",
        "..bbbb....bbbb..",
        "...bbbdbbbbb....",
        "....bbbbbbbb....",
        "......bbbb......"
      ]
    },

    // 2. Boston Cream — filled, chocolate glaze on top, cream side
    "boston-cream": {
      palette: {
        b: "#C8963C",  // golden dough
        B: "#DDAA50",  // dough highlight
        c: "#4A2800",  // dark chocolate
        C: "#6B3A10",  // chocolate highlight
        k: "#FFFDD0",  // cream
        K: "#FFF8C0"   // cream highlight
      },
      rows: [
        "......cccc......",
        "....ccCCCCcc....",
        "...cCCCCCCCCc...",
        "..cCCCCCCCCCCc..",
        ".cCCCCCCCCCCCCc.",
        ".cCCCCCCCCCCCCc.",
        "bccCCCCCCCCCCccb",
        "bbBBBBBBBBBBBBbb",
        "bBBBBBBBBBBBBBBb",
        "bBBBBBBBBBBBBBBb",
        ".bBBBkkkkkBBBb..",
        ".bbBBKKKKKBBbb..",
        "..bbbBBBBBbbb...",
        "...bbbBBBbbb....",
        "....bbbbbbbb....",
        "......bbbb......"
      ]
    },

    // 3. Rainbow Sprinkles — ring with white frosting + colorful sprinkles
    "rainbow-sprinkles": {
      palette: {
        b: "#8B4513",  // brown dough
        B: "#A0622E",  // dough highlight
        w: "#FFFFFF",  // white frosting
        W: "#F0F0F0",  // frosting shadow
        r: "#FF3333",  // red sprinkle
        g: "#33CC33",  // green sprinkle
        u: "#3366FF",  // blue sprinkle
        y: "#FFCC00",  // yellow sprinkle
        p: "#CC33FF",  // purple sprinkle
        o: "#FF8800"   // orange sprinkle
      },
      rows: [
        "......bbbb......",
        "....bbBBBBbb....",
        "...brwWwgwWwb...",
        "..bwWuwWwWpwWb..",
        ".bwWww....owWwb.",
        ".bWwg......wWrb.",
        "bwWw........Wwbb",
        "byw..........wbb",
        "bbw..........bbb",
        "bbb..........bbb",
        ".bbb........bbb.",
        ".bbbb......bbbb.",
        "..bbbb....bbbb..",
        "...bbbbbbbbbb...",
        "....bbbbbbbb....",
        "......bbbb......"
      ]
    },

    // 4. Blueberry Glazed — thick ring (3x3 hole), deep purple glaze
    "blueberry-glazed": {
      palette: {
        b: "#2A1050",  // dark purple dough
        B: "#3D1870",  // dough highlight
        g: "#6040B0",  // purple glaze
        G: "#7858D0",  // glaze highlight
        s: "#9080E0",  // glaze shine
        S: "#A898F0"   // bright shine
      },
      rows: [
        "......gggg......",
        "....ggGGGGgg....",
        "...gGGsGGSGGg...",
        "..gGsGGGGGGSGg..",
        ".gGGGGG..GGGGGg.",
        ".gGSGG....GGsGg.",
        "gGGGG......GGGGb",
        "gGGG........GGGb",
        "gGGg........gGgb",
        "bggg........gggb",
        ".bbbb......bbbb.",
        ".bbbbb....bbbbb.",
        "..bbbbbbbbbbbb..",
        "...bbbbBBbbbb...",
        "....bbbBbbbb....",
        "......bbbb......"
      ]
    },

    // 5. Matcha — filled, green glaze on top, powder dust pixels
    "matcha": {
      palette: {
        b: "#C8A860",  // pale dough
        B: "#D4B870",  // dough highlight
        m: "#5A8C2A",  // matcha green
        M: "#6CA03A",  // matcha highlight
        g: "#7BB848",  // bright matcha
        d: "#8CCF60",  // matcha dust/powder
        D: "#A0E070"   // bright dust
      },
      rows: [
        "......mmmm......",
        "....mmMgMgmm....",
        "...mMgdMgMdgm...",
        "..mMgMgMgDgMgm..",
        ".mMgdMgMgMgdMgm.",
        ".mgMgMgMgMgMgMm.",
        "bmMgMgMgMgMgMgBb",
        "bmmmmmmmmmmmmmBb",
        "bBBBBBBBBBBBBBBb",
        "bBBBBBBBBBBBBBBb",
        ".bBBBBBBBBBBBb..",
        ".bbbBBBBBBbbbb..",
        "..bbbBBBBBbbb...",
        "...bbbBBBbbb....",
        "....bbbbbbbb....",
        "......bbbb......"
      ]
    },

    // 6. Strawberry Drizzle — ring, red frosting + white drizzle zigzag
    "strawberry-drizzle": {
      palette: {
        b: "#8B4513",  // brown dough
        B: "#A0622E",  // dough highlight
        s: "#CC2244",  // strawberry red
        S: "#E03358",  // red highlight
        w: "#FFFFFF",  // white drizzle
        W: "#F0E0E8"   // drizzle shadow
      },
      rows: [
        "......bbbb......",
        "....bbBBBBbb....",
        "...bsSSwSSSsb...",
        "..bSSswSSSwSSb..",
        ".bSSwSS....sSsb.",
        ".bSSsw......Ssb.",
        "bsSS........SSbb",
        "bsS..........Sbb",
        "bbs..........bbb",
        "bbb..........bbb",
        ".bbb........bbb.",
        ".bbbb......bbbb.",
        "..bbbb....bbbb..",
        "...bbbbbbbbbb...",
        "....bbbbbbbb....",
        "......bbbb......"
      ]
    },

    // 7. Lavender Cream Puff — filled, powdered sugar, lavender cream slit
    "lavender-cream": {
      palette: {
        b: "#D4B880",  // light dough
        B: "#E0C890",  // dough highlight
        p: "#F4ECF8",  // powdered sugar
        P: "#FFFFFF",  // bright powder
        l: "#B795E4",  // lavender cream
        L: "#CAA8F0",  // cream highlight
        s: "#E8D8F4"   // slit shadow
      },
      rows: [
        "......bbbb......",
        "....bbpBPBbb....",
        "...bPBpPbPBPb...",
        "..bBpPBpBPpBPb..",
        ".bPBpPBpPBpPBPb.",
        ".bBpPBpPBpPBpBb.",
        "bPBpPBpPBpPBpPbb",
        "bBpPBpPBpPBpPBBb",
        "bsslLlLlLlLlssbb",
        "bBBBBBBBBBBBBBBb",
        ".bBBBBBBBBBBBBb.",
        ".bbbBBBBBBBBbbb.",
        "..bbbBBBBBbbb...",
        "...bbbBBBbbb....",
        "....bbbbbbbb....",
        "......bbbb......"
      ]
    }
  };

  // Map from old donut names to new sprite keys
  var DONUT_NAMES = [
    "classic-frosted",
    "boston-cream",
    "rainbow-sprinkles",
    "blueberry-glazed",
    "matcha",
    "strawberry-drizzle",
    "lavender-cream"
  ];

  function renderDonut(name) {
    var sprite = SPRITES[name];
    if (!sprite) return null;

    var canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    canvas.className = "donut-canvas";
    var ctx = canvas.getContext("2d");

    var rows = sprite.rows;
    var palette = sprite.palette;

    for (var y = 0; y < rows.length; y++) {
      var row = rows[y];
      for (var x = 0; x < row.length; x++) {
        var ch = row[x];
        if (ch === ".") continue;
        var color = palette[ch];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    return canvas;
  }

  function init() {
    var faces = document.querySelectorAll(".donut-face[data-donut]");
    faces.forEach(function (face) {
      var name = face.getAttribute("data-donut");
      var canvas = renderDonut(name);
      if (canvas) {
        face.appendChild(canvas);
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
