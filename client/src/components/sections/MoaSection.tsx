/* MOA Section — AMVUTTRA Product Website
   Design: SVG pathway infographic + GalNAc platform mind map
   Features: Animated step-by-step pathway, TTR reduction bars, mind map nodes
   Sticky takeaway: "Silence the source — not just stabilize it." */

import { useEffect, useRef, useState } from "react";

const MOA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663157530477/SD6zCgt629P7QNrjfpq6Wp/amvuttra-moa-diagram-A76jZFZXhLGU7jBtDUfBkL.webp";

const MOA_STEPS = [
  {
    icon: "💉",
    title: "SC Injection",
    desc: "25 mg GalNAc-siRNA injected subcutaneously every 3 months",
    color: "#00C2A8",
    step: 1,
  },
  {
    icon: "🎯",
    title: "GalNAc → ASGPR",
    desc: "Triantennary GalNAc binds ASGPR receptor exclusively on hepatocytes",
    color: "#0093C4",
    step: 2,
  },
  {
    icon: "🔄",
    title: "Endocytosis",
    desc: "Receptor-mediated uptake; siRNA released into hepatocyte cytoplasm",
    color: "#1A3A6B",
    step: 3,
  },
  {
    icon: "✂️",
    title: "RISC Loading",
    desc: "Antisense strand guides RISC to complementary TTR mRNA sequence",
    color: "#E67E22",
    step: 4,
  },
  {
    icon: "🗑️",
    title: "mRNA Cleavage",
    desc: "Endonucleolytic cleavage of TTR mRNA — both mutant & wild-type",
    color: "#C0392B",
    step: 5,
  },
  {
    icon: "📉",
    title: "TTR Reduction",
    desc: "~88% peak / ~81% trough reduction in serum TTR at steady state",
    color: "#27AE60",
    step: 6,
  },
];

const TTR_BARS = [
  { label: "AMVUTTRA (vutrisiran) — Peak", value: 88, color: "linear-gradient(90deg, #27AE60, #00C2A8)", highlight: true },
  { label: "AMVUTTRA (vutrisiran) — Trough", value: 81, color: "linear-gradient(90deg, #27AE60, #00C2A8)", highlight: true },
  { label: "ONPATTRO (patisiran)", value: 87, color: "#0093C4", highlight: false },
  { label: "WAINUA (eplontersen)", value: 81, color: "#E67E22", highlight: false },
  { label: "TEGSEDI (inotersen)", value: 74, color: "#95A5A6", highlight: false },
];

const MIND_MAP_NODES = [
  { icon: "🎯", title: "Hepatocyte Selectivity", desc: "ASGPR exclusively expressed on hepatocytes — minimal off-target effects" },
  { icon: "💉", title: "SC Delivery", desc: "No LNP needed (vs patisiran IV) — simple prefilled syringe injection" },
  { icon: "⏱️", title: "Long Duration", desc: "ESC chemistry → Q3M dosing sustained (~81% trough) throughout interval" },
  { icon: "🧬", title: "Dual TTR Silencing", desc: "Silences both mutant AND wild-type TTR — covers full ATTR spectrum" },
  { icon: "🚀", title: "Rapid Onset", desc: "Significant TTR reduction within days of first dose" },
  { icon: "🛡️", title: "No Premedication", desc: "No LNP → no infusion reactions → no steroids or antihistamines needed" },
];

function BarChart({ animated }: { animated: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {TTR_BARS.map((bar) => (
        <div key={bar.label}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
              fontSize: "12.5px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: bar.highlight ? 700 : 500,
              color: bar.highlight ? "#1A3A6B" : "#566573",
            }}
          >
            <span>{bar.label}</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: bar.highlight ? "#27AE60" : "#566573",
                fontWeight: 700,
              }}
            >
              ~{bar.value}%
            </span>
          </div>
          <div
            style={{
              background: "#E8ECF0",
              borderRadius: "9999px",
              height: "14px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "9999px",
                background: bar.color,
                width: animated ? `${bar.value}%` : "0%",
                transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: animated ? "0.2s" : "0s",
              }}
            />
          </div>
        </div>
      ))}
      <p style={{ fontSize: "11px", color: "#95A5A6", marginTop: "4px", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
        ℹ️ Stabilizers (tafamidis, acoramidis) do NOT reduce TTR — they stabilize the tetramer only.
      </p>
    </div>
  );
}

export default function MoaSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          MOA_STEPS.forEach((_, i) => {
            setTimeout(() => setVisibleSteps((prev) => [...prev, i]), i * 180);
          });
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setBarsAnimated(true);
      },
      { threshold: 0.2 }
    );
    if (barsRef.current) observer.observe(barsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="moa"
      style={{ padding: "80px 0", background: "#F8F9FA" }}
      aria-label="Mechanism of action"
    >
      <div className="container">
        {/* Section header */}
        <div style={{ marginBottom: "48px" }}>
          <div className="section-accent" />
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              color: "#1A3A6B",
              marginBottom: "8px",
            }}
          >
            Mechanism of Action
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            GalNAc-siRNA pathway — from subcutaneous injection to sustained TTR silencing
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "linear-gradient(135deg, #1A3A6B, #0093C4)",
              color: "white",
              padding: "8px 18px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.3px",
            }}
          >
            Sticky Takeaway: "Silence the source — not just stabilize it."
          </div>
        </div>

        {/* MOA visual background */}
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            marginBottom: "32px",
            position: "relative",
            background: "#0D1B3E",
            boxShadow: "0 8px 40px rgba(0,147,196,0.20)",
            border: "1px solid #1A3A6B",
          }}
        >
          <img
            src={MOA_BG}
            alt="Mechanism of action: GalNAc-siRNA pathway from injection to TTR mRNA cleavage"
            style={{ width: "100%", height: "auto", maxHeight: "340px", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(13,27,62,0.85))",
              height: "80px",
            }}
          />
        </div>

        {/* Step-by-step pathway */}
        <div
          ref={sectionRef}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 4px 24px rgba(26,58,107,0.08)",
            border: "1px solid #E8ECF0",
            marginBottom: "32px",
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "1.2rem",
              color: "#1A3A6B",
              marginBottom: "24px",
            }}
          >
            MOA Pathway — Step by Step
          </h3>
          <div
            style={{
              display: "flex",
              gap: "0",
              overflowX: "auto",
              alignItems: "stretch",
              paddingBottom: "8px",
            }}
          >
            {MOA_STEPS.map((step, i) => (
              <div
                key={step.step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0",
                  flex: "1 0 auto",
                }}
              >
                <div
                  style={{
                    minWidth: "130px",
                    maxWidth: "160px",
                    background: visibleSteps.includes(i) ? `${step.color}10` : "transparent",
                    border: `2px solid ${visibleSteps.includes(i) ? step.color : "#E8ECF0"}`,
                    borderRadius: "12px",
                    padding: "16px 12px",
                    textAlign: "center",
                    opacity: visibleSteps.includes(i) ? 1 : 0,
                    transform: visibleSteps.includes(i) ? "translateY(0)" : "translateY(16px)",
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{step.icon}</div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "12px",
                      color: step.color,
                      marginBottom: "6px",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#566573",
                      lineHeight: 1.4,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
                {i < MOA_STEPS.length - 1 && (
                  <div
                    style={{
                      fontSize: "18px",
                      color: "#0093C4",
                      padding: "0 6px",
                      flexShrink: 0,
                      opacity: visibleSteps.includes(i) ? 1 : 0,
                      transition: "opacity 0.3s ease 0.3s",
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Two-column: TTR bars + Mind map */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* TTR Reduction bars */}
          <div
            ref={barsRef}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 4px 24px rgba(26,58,107,0.08)",
              border: "1px solid #E8ECF0",
            }}
          >
            <h3
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "1.1rem",
                color: "#1A3A6B",
                marginBottom: "20px",
              }}
            >
              TTR Reduction Comparison — Silencers
            </h3>
            <BarChart animated={barsAnimated} />
          </div>

          {/* GalNAc Platform Mind Map */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 4px 24px rgba(26,58,107,0.08)",
              border: "1px solid #E8ECF0",
            }}
          >
            <h3
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "1.1rem",
                color: "#1A3A6B",
                marginBottom: "20px",
              }}
            >
              GalNAc Platform Advantages
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {MIND_MAP_NODES.map((node) => (
                <div
                  key={node.title}
                  style={{
                    background: "#F0F4F8",
                    border: "1px solid #D5DBDB",
                    borderRadius: "10px",
                    padding: "12px",
                    transition: "all 0.2s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "#EBF5FB";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#0093C4";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "#F0F4F8";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#D5DBDB";
                  }}
                >
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>{node.icon}</div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "11.5px",
                      color: "#1A3A6B",
                      marginBottom: "3px",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {node.title}
                  </div>
                  <div
                    style={{
                      fontSize: "10.5px",
                      color: "#566573",
                      lineHeight: 1.4,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {node.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key takeaway */}
        <div
          style={{
            marginTop: "24px",
            background: "linear-gradient(135deg, #1A3A6B, #0D2047)",
            color: "white",
            borderRadius: "16px",
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "28px", flexShrink: 0 }}>🔑</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Section Key Takeaways
            </div>
            <ul style={{ fontSize: "13px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", listStyle: "none", padding: 0, margin: 0 }}>
              <li>→ GalNAc targets ASGPR exclusively on hepatocytes — highly selective, enables SC route without LNP</li>
              <li>→ RISC-mediated mRNA cleavage eliminates the source of amyloid (both mutant AND wild-type TTR)</li>
              <li>→ ~88% peak / ~81% trough TTR reduction — comparable to patisiran (IV) but with SC Q3M convenience</li>
              <li>→ ESC chemistry = enhanced metabolic stability → sustained suppression across the full 3-month dosing interval</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
