/* Evidence Section — AMVUTTRA Product Website
   Design: Dark navy theme matching the rest of the dossier
   Features: HELIOS-B/A data, interactive forest plot, Chart.js bar charts, evidence table
   Palette: bg #060D18, cards rgba(255,255,255,0.05), teal #00C2A8, gold #C89620 */

import { useEffect, useRef, useState } from "react";

declare const Chart: any;

// ── Data ────────────────────────────────────────────────────────────────────
const FOREST_ROWS = [
  { subgroup: "Overall Population", n: 655, hr: 0.72, ci_low: 0.56, ci_high: 0.93, p: "0.01" },
  { subgroup: "Monotherapy (no background tafamidis)", n: 392, hr: 0.67, ci_low: 0.48, ci_high: 0.93, p: "0.02" },
  { subgroup: "Background tafamidis", n: 263, hr: 0.79, ci_low: 0.54, ci_high: 1.15, p: "0.22" },
  { subgroup: "Wild-type ATTR-CM", n: 576, hr: 0.73, ci_low: 0.56, ci_high: 0.95, p: "0.02" },
  { subgroup: "Hereditary ATTR-CM", n: 79, hr: 0.67, ci_low: 0.36, ci_high: 1.24, p: "0.20" },
  { subgroup: "NYHA Class I–II", n: 380, hr: 0.64, ci_low: 0.45, ci_high: 0.91, p: "0.01" },
  { subgroup: "NYHA Class III", n: 275, hr: 0.83, ci_low: 0.59, ci_high: 1.17, p: "0.29" },
  { subgroup: "Age < 75 years", n: 248, hr: 0.68, ci_low: 0.46, ci_high: 1.00, p: "0.05" },
  { subgroup: "Age ≥ 75 years", n: 407, hr: 0.75, ci_low: 0.55, ci_high: 1.02, p: "0.07" },
  { subgroup: "All-Cause Mortality (42 mo)", n: 655, hr: 0.65, ci_low: 0.47, ci_high: 0.90, p: "0.01" },
];

const EVIDENCE_TABLE = [
  {
    study: "HELIOS-B",
    nct: "NCT04153149",
    n: 655,
    population: "ATTR-CM (88% wt); Median age 77; NYHA I–III; ~40% on background tafamidis",
    endpoint: "Composite ACM + recurrent CV events",
    result: "HR 0.72 (0.56–0.93) overall; HR 0.67 monotherapy; HR 0.65 ACM at 42 mo",
    pvalue: "P=0.01 / P=0.02 / P=0.01",
    badge: "NEJM 2024",
    badgeColor: "#27AE60",
  },
  {
    study: "HELIOS-B OLE",
    nct: "",
    n: 655,
    population: "ATTR-CM (all on vutrisiran)",
    endpoint: "Long-term outcomes (48 mo)",
    result: "37% ACM+first CV event (overall); 42% mono; attenuated LV wall thickness",
    pvalue: "P<0.001",
    badge: "ESC 2025",
    badgeColor: "#0093C4",
  },
  {
    study: "HELIOS-A",
    nct: "NCT03759379",
    n: 164,
    population: "hATTR-PN stage 1–2; External placebo (APOLLO)",
    endpoint: "Change in mNIS+7 at 18 months",
    result: "−17.0 net treatment difference (−2.2 vutrisiran vs. +14.8 placebo)",
    pvalue: "P=3.5×10⁻¹²",
    badge: "Amyloid 2022",
    badgeColor: "#E67E22",
  },
  {
    study: "HELIOS-A OLE",
    nct: "",
    n: 164,
    population: "hATTR-PN (all on vutrisiran)",
    endpoint: "Long-term neurologic outcomes (36+ mo)",
    result: "Sustained stabilization/improvement; former patisiran patients improved after switch",
    pvalue: "—",
    badge: "JACC 2025",
    badgeColor: "#6366F1",
  },
];

// ── Shared dark card style ───────────────────────────────────────────────────
const darkCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  overflow: "hidden",
};

const cardHeader: React.CSSProperties = {
  padding: "18px 24px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,194,168,0.06)",
};

// ── Forest Plot ──────────────────────────────────────────────────────────────
function ForestPlot() {
  const [tooltip, setTooltip] = useState<{ row: typeof FOREST_ROWS[0]; x: number; y: number } | null>(null);
  const plotWidth = 280;
  const hrMin = 0.3;
  const hrMax = 1.5;
  const hrToX = (hr: number) => ((Math.log(hr) - Math.log(hrMin)) / (Math.log(hrMax) - Math.log(hrMin))) * plotWidth;
  const nullLineX = hrToX(1.0);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
        <thead>
          <tr style={{ background: "rgba(0,194,168,0.08)" }}>
            <th style={{ padding: "10px 14px", textAlign: "left", color: "#00C2A8", fontWeight: 700, width: "34%" }}>Subgroup</th>
            <th style={{ padding: "10px 8px", textAlign: "center", color: "#00C2A8", fontWeight: 700, width: "7%" }}>N</th>
            <th style={{ padding: "10px 8px", textAlign: "center", color: "#00C2A8", fontWeight: 700, width: "13%" }}>HR (95% CI)</th>
            <th style={{ padding: "10px 8px", textAlign: "center", color: "#00C2A8", fontWeight: 700, width: "8%" }}>P-value</th>
            <th style={{ padding: "10px 14px", textAlign: "center", color: "#00C2A8", fontWeight: 700, minWidth: `${plotWidth + 40}px` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>
                <span>← Favors AMVUTTRA</span>
                <span>Favors Placebo →</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                <span>0.3</span><span>0.5</span><span>1.0</span><span>1.5</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {FOREST_ROWS.map((row, i) => {
            const centerX = hrToX(row.hr);
            const leftX = hrToX(row.ci_low);
            const rightX = hrToX(row.ci_high);
            const isSignificant = parseFloat(row.p) < 0.05;
            const isBold = row.subgroup.includes("Overall") || row.subgroup.includes("Mortality");
            return (
              <tr
                key={row.subgroup}
                style={{
                  background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(0,194,168,0.07)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"; }}
              >
                <td style={{ padding: "10px 14px", color: isBold ? "#E8F4F8" : "rgba(255,255,255,0.75)", fontWeight: isBold ? 700 : 400 }}>
                  {row.subgroup}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "center", color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.n}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", color: isSignificant ? "#00C2A8" : "rgba(255,255,255,0.5)", fontWeight: isSignificant ? 700 : 400 }}>
                  {row.hr} ({row.ci_low}–{row.ci_high})
                </td>
                <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", color: isSignificant ? "#00C2A8" : "rgba(255,255,255,0.5)", fontWeight: isSignificant ? 700 : 400 }}>
                  {row.p}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <svg width={plotWidth} height="24" style={{ overflow: "visible" }}>
                    <line x1={nullLineX} y1={0} x2={nullLineX} y2={24} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3,2" />
                    <line x1={leftX} y1={12} x2={rightX} y2={12} stroke={isSignificant ? "#00C2A8" : "rgba(255,255,255,0.3)"} strokeWidth={2} />
                    <line x1={leftX} y1={7} x2={leftX} y2={17} stroke={isSignificant ? "#00C2A8" : "rgba(255,255,255,0.3)"} strokeWidth={2} />
                    <line x1={rightX} y1={7} x2={rightX} y2={17} stroke={isSignificant ? "#00C2A8" : "rgba(255,255,255,0.3)"} strokeWidth={2} />
                    <polygon
                      points={`${centerX},4 ${centerX + 7},12 ${centerX},20 ${centerX - 7},12`}
                      fill={isSignificant ? "#00C2A8" : "rgba(255,255,255,0.3)"}
                      onMouseEnter={(e) => setTooltip({ row, x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setTooltip(null)}
                      style={{ cursor: "pointer" }}
                    />
                  </svg>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {tooltip && (
        <div style={{
          position: "fixed", left: tooltip.x + 12, top: tooltip.y - 70,
          background: "linear-gradient(135deg, #0D1B2A, #1A2B4A)",
          border: "1px solid rgba(0,194,168,0.4)",
          color: "white", padding: "10px 14px", borderRadius: "10px",
          fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
          zIndex: 1000, pointerEvents: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxWidth: "240px",
        }}>
          <div style={{ fontWeight: 700, marginBottom: "4px", color: "#E8F4F8" }}>{tooltip.row.subgroup}</div>
          <div style={{ color: "rgba(255,255,255,0.75)" }}>HR: <strong style={{ color: "#00C2A8" }}>{tooltip.row.hr}</strong> (95% CI: {tooltip.row.ci_low}–{tooltip.row.ci_high})</div>
          <div style={{ color: "rgba(255,255,255,0.75)" }}>P-value: <strong style={{ color: parseFloat(tooltip.row.p) < 0.05 ? "#00C2A8" : "rgba(255,255,255,0.75)" }}>{tooltip.row.p}</strong></div>
        </div>
      )}

      <p style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", marginTop: "10px", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", padding: "0 14px 14px" }}>
        Forest plot: HELIOS-B composite endpoint (ACM + recurrent CV events). CI = confidence interval; HR = hazard ratio. Fontana et al., NEJM 2024.
      </p>
    </div>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────
export default function EvidenceSection() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartBRef = useRef<HTMLCanvasElement>(null);
  const [chartMounted, setChartMounted] = useState(false);
  const [chartJsFailed, setChartJsFailed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !chartMounted) setChartMounted(true); },
      { threshold: 0.1 }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [chartMounted]);

  useEffect(() => {
    if (!chartMounted) return;
    if (typeof Chart === "undefined" || (window as Window & { __chartJsFailed?: boolean }).__chartJsFailed) {
      setChartJsFailed(true);
      return;
    }

    const darkGrid = "rgba(255,255,255,0.06)";
    const darkTick = { color: "rgba(255,255,255,0.5)", font: { family: "'JetBrains Mono', monospace", size: 10 } };

    // HELIOS-B bar chart
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["CV Composite\n(Overall)", "CV Composite\n(Monotherapy)", "All-Cause\nMortality (42mo)"],
            datasets: [{
              label: "Hazard Ratio",
              data: [0.72, 0.67, 0.65],
              backgroundColor: ["rgba(0,194,168,0.75)", "rgba(0,147,196,0.75)", "rgba(39,174,96,0.75)"],
              borderColor: ["#00C2A8", "#0093C4", "#27AE60"],
              borderWidth: 2,
              borderRadius: 6,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(13,27,42,0.95)",
                borderColor: "rgba(0,194,168,0.4)",
                borderWidth: 1,
                titleColor: "#E8F4F8",
                bodyColor: "rgba(255,255,255,0.75)",
                callbacks: {
                  label: (ctx: any) => `HR: ${ctx.parsed.y} (${ctx.dataIndex === 0 ? "P=0.01" : ctx.dataIndex === 1 ? "P=0.02" : "P=0.01"})`,
                },
              },
            },
            scales: {
              y: {
                min: 0, max: 1.2,
                title: { display: true, text: "Hazard Ratio", color: "rgba(255,255,255,0.5)", font: { family: "'DM Sans', sans-serif", size: 11 } },
                grid: { color: darkGrid },
                ticks: darkTick,
              },
              x: {
                grid: { display: false },
                ticks: { color: "rgba(255,255,255,0.6)", font: { family: "'DM Sans', sans-serif", size: 11 } },
              },
            },
            animation: { duration: 1200, easing: "easeOutQuart" },
          },
        });
      }
    }

    // HELIOS-A bar chart
    if (chartBRef.current) {
      const ctx2 = chartBRef.current.getContext("2d");
      if (ctx2) {
        new Chart(ctx2, {
          type: "bar",
          data: {
            labels: ["Vutrisiran", "Placebo (External)"],
            datasets: [{
              label: "mNIS+7 Change",
              data: [-2.2, 14.8],
              backgroundColor: ["rgba(0,194,168,0.75)", "rgba(192,57,43,0.75)"],
              borderColor: ["#00C2A8", "#C0392B"],
              borderWidth: 2,
              borderRadius: 6,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(13,27,42,0.95)",
                borderColor: "rgba(0,194,168,0.4)",
                borderWidth: 1,
                titleColor: "#E8F4F8",
                bodyColor: "rgba(255,255,255,0.75)",
                callbacks: {
                  label: (ctx: any) => `mNIS+7: ${ctx.parsed.y > 0 ? "+" : ""}${ctx.parsed.y} points`,
                },
              },
            },
            scales: {
              y: {
                title: { display: true, text: "mNIS+7 Change (lower = better)", color: "rgba(255,255,255,0.5)", font: { family: "'DM Sans', sans-serif", size: 11 } },
                grid: { color: darkGrid },
                ticks: darkTick,
              },
              x: {
                grid: { display: false },
                ticks: { color: "rgba(255,255,255,0.6)", font: { family: "'DM Sans', sans-serif", size: 12 } },
              },
            },
            animation: { duration: 1200, easing: "easeOutQuart" },
          },
        });
      }
    }
  }, [chartMounted]);

  const fallbackStyle: React.CSSProperties = {
    height: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "10px",
    background: "rgba(0,194,168,0.04)", borderRadius: "10px",
    border: "1px dashed rgba(0,194,168,0.25)",
  };

  return (
    <section
      id="evidence"
      style={{
        padding: "80px 0",
        background: "linear-gradient(180deg, #060D18 0%, #0A1628 100%)",
        position: "relative",
      }}
      aria-label="Clinical evidence"
    >
      {/* Subtle grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(0,194,168,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="container" style={{ position: "relative" }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ width: "40px", height: "3px", background: "#00C2A8", borderRadius: "2px", marginBottom: "16px" }} />
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            color: "#E8F4F8",
            marginBottom: "10px",
            letterSpacing: "0.02em",
          }}>
            Evidence Intelligence
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px", lineHeight: 1.6 }}>
            HELIOS-B · HELIOS-A · Long-term OLE data — robust hard-endpoint evidence across both indications
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            marginTop: "14px",
            background: "rgba(39,174,96,0.15)",
            border: "1px solid rgba(39,174,96,0.35)",
            color: "#27AE60",
            padding: "8px 18px",
            borderRadius: "30px",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <span>🔑</span>
            <span>35% mortality reduction at 42 months — the strongest RNAi signal in ATTR-CM</span>
          </div>
        </div>

        {/* ── Stat strip ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "36px" }}>
          {[
            { value: "28%", label: "CV Composite Reduction", sub: "HR 0.72 · P=0.01", color: "#00C2A8" },
            { value: "35%", label: "All-Cause Mortality", sub: "HR 0.65 · 42 months", color: "#27AE60" },
            { value: "88%", label: "Peak TTR Suppression", sub: "Steady-state serum", color: "#C89620" },
            { value: "−17.0", label: "mNIS+7 Net Difference", sub: "HELIOS-A · P=3.5×10⁻¹²", color: "#E67E22" },
          ].map((s) => (
            <div key={s.label} style={{
              ...darkCard,
              padding: "20px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: s.color, fontFamily: "'Orbitron', sans-serif", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: "11px", color: "#E8F4F8", fontWeight: 600, marginTop: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "3px", fontFamily: "'JetBrains Mono', monospace" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          {/* HELIOS-B chart */}
          <div style={darkCard}>
            <div style={cardHeader}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#E8F4F8", margin: 0 }}>
                HELIOS-B — Key Hazard Ratios
              </h3>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "3px", fontFamily: "'DM Sans', sans-serif" }}>
                Phase 3 RCT · N=655 · 88% wt-ATTR · Median age 77 · NEJM 2024
              </p>
            </div>
            <div style={{ padding: "20px", height: "220px" }}>
              {chartJsFailed ? (
                <div style={fallbackStyle}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 1.8 }}>
                    <div style={{ fontWeight: 700, color: "#00C2A8", marginBottom: "8px" }}>HELIOS-B Key Hazard Ratios</div>
                    <div>CV Composite (Overall): <strong style={{ color: "#00C2A8" }}>HR 0.72</strong> (P=0.01)</div>
                    <div>CV Composite (Monotherapy): <strong style={{ color: "#0093C4" }}>HR 0.67</strong> (P=0.02)</div>
                    <div>All-Cause Mortality (42mo): <strong style={{ color: "#27AE60" }}>HR 0.65</strong> (P=0.01)</div>
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>Chart unavailable — CDN offline</div>
                </div>
              ) : (
                <canvas ref={chartRef} style={{ width: "100%", height: "100%" }} />
              )}
            </div>
          </div>

          {/* HELIOS-A chart */}
          <div style={darkCard}>
            <div style={cardHeader}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#E8F4F8", margin: 0 }}>
                HELIOS-A — mNIS+7 at 18 Months
              </h3>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "3px", fontFamily: "'DM Sans', sans-serif" }}>
                Phase 3 · N=164 · hATTR-PN · External placebo (APOLLO) · Amyloid 2022
              </p>
            </div>
            <div style={{ padding: "20px", height: "220px" }}>
              {chartJsFailed ? (
                <div style={{ ...fallbackStyle, background: "rgba(192,57,43,0.04)", border: "1px dashed rgba(192,57,43,0.25)" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 1.8 }}>
                    <div style={{ fontWeight: 700, color: "#00C2A8", marginBottom: "8px" }}>HELIOS-A — mNIS+7 at 18 Months</div>
                    <div>Vutrisiran: <strong style={{ color: "#00C2A8" }}>−2.2</strong> (improvement)</div>
                    <div>Placebo (External): <strong style={{ color: "#C0392B" }}>+14.8</strong> (worsening)</div>
                    <div style={{ marginTop: "6px" }}>Net difference: <strong style={{ color: "#00C2A8" }}>−17.0</strong> (P=3.5×10⁻¹²)</div>
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>Chart unavailable — CDN offline</div>
                </div>
              ) : (
                <canvas ref={chartBRef} style={{ width: "100%", height: "100%" }} />
              )}
            </div>
          </div>
        </div>

        {/* ── Interactive Forest Plot ── */}
        <div style={{ ...darkCard, marginBottom: "24px" }}>
          <div style={cardHeader}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#E8F4F8", margin: 0 }}>
              HELIOS-B Interactive Forest Plot — Subgroup Analysis
            </h3>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "3px", fontFamily: "'DM Sans', sans-serif" }}>
              Hover over diamonds for details · Teal = statistically significant (P&lt;0.05)
            </p>
          </div>
          <ForestPlot />
        </div>

        {/* ── Evidence Table ── */}
        <div style={{ ...darkCard, marginBottom: "24px" }}>
          <div style={cardHeader}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#E8F4F8", margin: 0 }}>
              Clinical Evidence Summary Table
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr style={{ background: "rgba(0,194,168,0.08)" }}>
                  {["Study", "N", "Population", "Primary Endpoint", "Key Result", "P-value"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#00C2A8", fontWeight: 700, whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EVIDENCE_TABLE.map((row, i) => (
                  <tr key={row.study} style={{
                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#E8F4F8" }}>
                      <div>{row.study}</div>
                      <span style={{ background: row.badgeColor, color: "white", fontSize: "9px", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, display: "inline-block", marginTop: "3px" }}>
                        {row.badge}
                      </span>
                      {row.nct && <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{row.nct}</div>}
                    </td>
                    <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.5)" }}>{row.n}</td>
                    <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.65)", maxWidth: "200px", lineHeight: 1.5 }}>{row.population}</td>
                    <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.65)" }}>{row.endpoint}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#E8F4F8" }}>{row.result}</td>
                    <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono', monospace", color: "#27AE60", fontWeight: 700, whiteSpace: "nowrap" }}>{row.pvalue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Key Takeaways ── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(0,194,168,0.12), rgba(0,147,196,0.08))",
          border: "1px solid rgba(0,194,168,0.25)",
          borderRadius: "16px",
          padding: "24px 28px",
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
        }}>
          <div style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }}>🔑</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "11px", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif", color: "#00C2A8", textTransform: "uppercase", letterSpacing: "1px" }}>
              Section Key Takeaways
            </div>
            <ul style={{ fontSize: "13px", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", listStyle: "none", padding: 0, margin: 0, color: "rgba(255,255,255,0.75)" }}>
              <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "6px", marginBottom: "6px" }}>
                <span style={{ color: "#00C2A8", marginRight: "8px" }}>→</span>
                HELIOS-B: Rigorous RCT with hard endpoints — 28% CV composite reduction (HR 0.72) including benefit on top of background tafamidis
              </li>
              <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "6px", marginBottom: "6px" }}>
                <span style={{ color: "#00C2A8", marginRight: "8px" }}>→</span>
                Mortality signal: HR 0.65 at 42 months is the strongest mortality evidence for RNAi in ATTR-CM to date
              </li>
              <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "6px", marginBottom: "6px" }}>
                <span style={{ color: "#00C2A8", marginRight: "8px" }}>→</span>
                HELIOS-A: 17-point net treatment advantage on mNIS+7 — halted polyneuropathy progression
              </li>
              <li>
                <span style={{ color: "#00C2A8", marginRight: "8px" }}>→</span>
                OLE data (up to 48 mo): sustained benefits with no new safety signals; attenuated LV wall thickness progression
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
