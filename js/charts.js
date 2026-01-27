// ============================================================
//  Charts + Table — reads from DATA (data.js)
// ============================================================

// --- Reciprocal scale: 1/y transform zooms in on low values ---
class ReciprocalScale extends Chart.Scale {
  static id = "reciprocal";
  static defaults = {};

  determineDataLimits() {
    const { min, max } = this.getMinMax(true);
    this.min = min * 0.7;
    this.max = max * 1.3;
  }

  buildTicks() {
    const nice = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1.0];
    const ticks = nice
      .filter((v) => v >= this.min && v <= this.max)
      .map((v) => ({ value: v }));
    return ticks;
  }

  getPixelForValue(value) {
    if (value <= 0) value = this.min;
    var fMin = 1 / this.max;
    var fMax = 1 / this.min;
    var f = 1 / value;
    var decimal = (f - fMin) / (fMax - fMin);
    return this.getPixelForDecimal(decimal);
  }

  getValueForPixel(pixel) {
    var decimal = this.getDecimalForPixel(pixel);
    var fMin = 1 / this.max;
    var fMax = 1 / this.min;
    var f = fMin + decimal * (fMax - fMin);
    return 1 / f;
  }
}
Chart.register(ReciprocalScale);

(function () {
  "use strict";

  // --- helpers ---
  const fmt = (v) => (v === null || v === undefined ? "\u2014" : v);

  // --- Brier Chart ---
  function buildBrierChart() {
    const points = DATA
      .filter((d) => d.brier !== null)
      .map((d) => ({ x: d.date, y: d.brier }));

    new Chart(document.getElementById("brierChart"), {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Brier Score",
            data: points,
            showLine: true,
            tension: 0.35,
            borderColor: "#B795E4",
            backgroundColor: "rgba(183,149,228,0.15)",
            pointBackgroundColor: "#B795E4",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 11,
            borderWidth: 3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 1500, easing: "easeOutQuart" },
        scales: {
          x: {
            type: "time",
            time: { unit: "day", tooltipFormat: "MMM d, yyyy" },
            title: { display: true, text: "Date", font: { family: "Quicksand" } },
            grid: { color: "rgba(0,0,0,0.04)" },
          },
          y: {
            type: "reciprocal",
            title: { display: true, text: "Brier Score", font: { family: "Quicksand" } },
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: {
              callback: (v) => Number(v.toFixed(2)),
            },
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: "#fff",
            titleColor: "#3A3A3A",
            bodyColor: "#3A3A3A",
            borderColor: "#B795E4",
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            titleFont: { family: "Quicksand", weight: "700" },
            bodyFont: { family: "Nunito Sans" },
            callbacks: {
              afterBody: function (ctx) {
                const date = ctx[0].raw.x;
                const match = DATA.find((d) => d.date === date);
                return match && match.note ? "\n" + match.note : "";
              },
            },
          },
          legend: { display: false },
        },
      },
    });
  }

  // --- PnL Chart ---
  function buildPnLChart() {
    const points = DATA
      .filter((d) => d.pnl !== null)
      .map((d) => ({ x: d.date, y: d.pnl }));

    const canvas = document.getElementById("pnlChart");
    const overlay = document.getElementById("pnlOverlay");

    if (points.length === 0) {
      overlay.style.display = "flex";
    } else {
      overlay.style.display = "none";
    }

    new Chart(canvas, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "PnL ($)",
            data: points,
            showLine: true,
            tension: 0.35,
            borderColor: "#7EC8C8",
            backgroundColor: "rgba(126,200,200,0.12)",
            pointBackgroundColor: "#7EC8C8",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 11,
            borderWidth: 3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 1500, easing: "easeOutQuart" },
        scales: {
          x: {
            type: "time",
            time: { unit: "day", tooltipFormat: "MMM d, yyyy" },
            title: { display: true, text: "Date", font: { family: "Quicksand" } },
            grid: { color: "rgba(0,0,0,0.04)" },
          },
          y: {
            title: { display: true, text: "PnL ($)", font: { family: "Quicksand" } },
            grid: { color: "rgba(0,0,0,0.04)" },
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: "#fff",
            titleColor: "#3A3A3A",
            bodyColor: "#3A3A3A",
            borderColor: "#7EC8C8",
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            titleFont: { family: "Quicksand", weight: "700" },
            bodyFont: { family: "Nunito Sans" },
            callbacks: {
              afterBody: function (ctx) {
                const date = ctx[0].raw.x;
                const match = DATA.find((d) => d.date === date);
                return match && match.note ? "\n" + match.note : "";
              },
            },
          },
          legend: { display: false },
        },
      },
    });
  }

  // --- Table ---
  function buildTable() {
    const tbody = document.getElementById("logBody");
    const sorted = [...DATA].sort((a, b) => (b.date > a.date ? 1 : -1));

    sorted.forEach((d) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + d.date + "</td>" +
        "<td>" + fmt(d.brier) + "</td>" +
        "<td>" + fmt(d.pnl) + "</td>" +
        "<td>" + (d.note || "") + "</td>";
      tbody.appendChild(tr);
    });
  }

  // --- Init ---
  document.addEventListener("DOMContentLoaded", function () {
    buildBrierChart();
    buildPnLChart();
    buildTable();
  });
})();
