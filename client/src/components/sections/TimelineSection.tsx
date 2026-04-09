/* Timeline Section — 30/60/90-Day Plan
   Design: Animated vertical timeline with milestone cards
   Sticky takeaway: "Days 1–30: Learn & Map. Days 31–60: Engage & Educate. Days 61–90: Convert & Accelerate." */

import { useEffect, useRef, useState } from "react";

const PHASES = [
  {
    days: "30",
    title: "Days 1–30",
    subtitle: "LEARN & MAP",
    color: "#0093C4",
    bg: "#EBF5FB",
    items: [
      "Complete all product training (PI, MOA, clinical data, competitive intel)",
      "Map all Tier 1 and Tier 2 accounts: identify key stakeholders, current treatment patterns",
      "Identify top 10 target HCPs by prescribing potential and influence",
    ],
    kpi: "15–20 HCP introductions",
  },
  {
    days: "60",
    title: "Days 31–60",
    subtitle: "ENGAGE & EDUCATE",
    color: "#00C2A8",
    bg: "#E8F8F5",
    items: [
      "Host or attend 1–2 disease education events (grand rounds, lunch-and-learn)",
      "Identify 3–5 patients on tafamidis who may be progressing → position additive benefit",
      "Facilitate 1–2 peer-to-peer speaker programs with regional KOLs",
    ],
    kpi: "20+ HCPs detailed",
  },
  {
    days: "90",
    title: "Days 61–90",
    subtitle: "CONVERT & ACCELERATE",
    color: "#27AE60",
    bg: "#EAFAF1",
    items: [
      "Target first patient starts in 2–3 Tier 1 accounts",
      "Host cross-functional account planning session (sales + MSL + access) for top 5 accounts",
    ],
    kpi: "3–5 patient starts",
  },
];


export default function TimelineSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="timeline"
      style={{ padding: "80px 0", background: "#F8F9FA" }}
      aria-label="30/60/90-day plan"
    >
      <div className="container">
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
            30/60/90-Day Launch Plan
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            Structured ramp-up plan for the first 90 days as Senior Product Specialist
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "linear-gradient(135deg, #27AE60, #1E8449)",
              color: "white",
              padding: "8px 18px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Sticky Takeaway: "Learn → Engage → Convert. Structured momentum from day one."
          </div>
        </div>

        {/* Timeline */}
        <div ref={ref} style={{ marginBottom: "32px" }}>
          {PHASES.map((phase, i) => (
            <div
              key={phase.days}
              style={{
                display: "flex",
                gap: "24px",
                marginBottom: i < PHASES.length - 1 ? "0" : "0",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-20px)",
                transition: `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
              }}
            >
              {/* Timeline column */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: phase.color,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    boxShadow: `0 4px 16px ${phase.color}40`,
                    flexShrink: 0,
                  }}
                >
                  {phase.days}
                </div>
                {i < PHASES.length - 1 && (
                  <div
                    style={{
                      width: "2px",
                      flex: 1,
                      background: `linear-gradient(180deg, ${phase.color}, ${PHASES[i + 1].color})`,
                      margin: "4px 0",
                      minHeight: "40px",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  flex: 1,
                  marginBottom: "16px",
                  boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
                  border: "1px solid #E8ECF0",
                  borderLeft: `4px solid ${phase.color}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: phase.color, fontFamily: "'DM Sans', sans-serif" }}>
                      {phase.title}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: "1.2rem",
                        color: "#1A3A6B",
                        marginTop: "2px",
                      }}
                    >
                      {phase.subtitle}
                    </h3>
                  </div>
                  <div
                    style={{
                      background: phase.bg,
                      border: `1px solid ${phase.color}`,
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: phase.color,
                      fontFamily: "'DM Sans', sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    🎯 {phase.kpi}
                  </div>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        gap: "10px",
                        padding: "5px 0",
                        fontSize: "13px",
                        color: "#445566",
                        fontFamily: "'DM Sans', sans-serif",
                        lineHeight: 1.5,
                        borderBottom: "1px solid #F8F9FA",
                      }}
                    >
                      <span style={{ color: phase.color, fontWeight: 700, flexShrink: 0 }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
