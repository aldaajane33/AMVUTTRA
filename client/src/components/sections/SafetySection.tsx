/* Safety Section — AMVUTTRA Product Website
   Design: Traffic light model, adverse events table, fair balance layout
   IMPORTANT: Safety information is clearly visible — no burying
   Sticky takeaway: "No REMS. No premedication. One management action: vitamin A at RDA." */

export default function SafetySection() {
  const adverseEvents = [
    { event: "Arthralgia", vutrisiran: "8%", placebo: "6%", category: "yellow" },
    { event: "Injection site reactions", vutrisiran: "4%", placebo: "2%", category: "yellow" },
    { event: "Vitamin A decrease (≥50%)", vutrisiran: "~65%", placebo: "N/A", category: "yellow" },
    { event: "Dyspnea", vutrisiran: "8%", placebo: "8%", category: "green" },
    { event: "Peripheral edema", vutrisiran: "10%", placebo: "11%", category: "green" },
    { event: "Fatigue", vutrisiran: "6%", placebo: "6%", category: "green" },
    { event: "Nausea", vutrisiran: "5%", placebo: "4%", category: "green" },
    { event: "Diarrhea", vutrisiran: "5%", placebo: "5%", category: "green" },
  ];

  const warningBoxes = [
    {
      level: "WARNING",
      color: "#C0392B",
      bg: "#FDEDEC",
      border: "#C0392B",
      icon: "⚠️",
      title: "Embryo-Fetal Toxicity",
      text: "AMVUTTRA may cause fetal harm based on animal data. Advise females of reproductive potential to use effective contraception during treatment and for 7 months after the last dose. Verify pregnancy status prior to initiating treatment.",
      source: "FDA PI 2025 — Boxed Warning",
    },
  ];

  const managementItems = [
    {
      icon: "🌿",
      title: "Vitamin A Supplementation",
      color: "#E67E22",
      bg: "#FEF9E7",
      border: "#E67E22",
      text: "Supplement all patients with vitamin A at the Recommended Daily Allowance (RDA: 700–900 mcg/day RAE). Do NOT use high-dose supplements. Routine serum vitamin A monitoring is not recommended.",
    },
    {
      icon: "👁️",
      title: "Ophthalmology Referral",
      color: "#0093C4",
      bg: "#EBF5FB",
      border: "#0093C4",
      text: "Refer patients to ophthalmology if they develop ocular symptoms (e.g., night blindness, dry eyes, blurred vision). Vitamin A deficiency can affect retinal function. Routine ophthalmology screening is not required.",
    },
    {
      icon: "🤰",
      title: "Contraception Counseling",
      color: "#C0392B",
      bg: "#FDEDEC",
      border: "#C0392B",
      text: "Counsel females of reproductive potential on the risk of embryo-fetal toxicity. Effective contraception required during treatment and for 7 months after last dose. Advise male patients with female partners of reproductive potential.",
    },
    {
      icon: "💉",
      title: "Injection Site Reactions",
      color: "#27AE60",
      bg: "#EAFAF1",
      border: "#27AE60",
      text: "Injection site reactions (ISR) occurred in ~4% of patients — mild and transient. No special management required. Rotate injection sites (abdomen, thigh, upper arm). No premedication needed.",
    },
  ];

  return (
    <section
      id="safety"
      style={{ padding: "80px 0", background: "#F8F9FA" }}
      aria-label="Safety information"
    >
      <div className="container">
        <div style={{ marginBottom: "48px" }}>
          <div className="section-accent" style={{ background: "#C0392B" }} />
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              color: "#1A3A6B",
              marginBottom: "8px",
            }}
          >
            Safety Profile
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            Warnings, adverse events, contraindications, and management guidance — FDA PI 2025
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "linear-gradient(135deg, #C0392B, #922B21)",
              color: "white",
              padding: "8px 18px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Sticky Takeaway: "No REMS. No premedication. One management action: vitamin A at RDA."
          </div>
        </div>

        {/* Warning box */}
        {warningBoxes.map((w) => (
          <div
            key={w.title}
            style={{
              background: w.bg,
              border: `2px solid ${w.border}`,
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "24px",
            }}
            role="alert"
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ fontSize: "24px", flexShrink: 0 }}>{w.icon}</div>
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: w.color,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "4px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {w.level}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "14px",
                    color: w.color,
                    marginBottom: "6px",
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  {w.title}
                </div>
                <p style={{ fontSize: "13px", color: "#445566", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  {w.text}
                </p>
                <div style={{ fontSize: "10.5px", color: "#95A5A6", marginTop: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                  📚 {w.source}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Traffic light overview */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "24px",
            boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
            border: "1px solid #E8ECF0",
          }}
        >
          <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: "#1A3A6B", marginBottom: "20px" }}>
            Safety Traffic Light Overview
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              {
                color: "green",
                bg: "#EAFAF1",
                border: "#27AE60",
                textColor: "#1E8449",
                icon: "✅",
                title: "No Concerns",
                items: ["No REMS required", "No premedication needed", "No routine lab monitoring", "No clinically significant drug interactions", "No formal contraindications"],
              },
              {
                color: "yellow",
                bg: "#FEF9E7",
                border: "#E67E22",
                textColor: "#784212",
                icon: "⚡",
                title: "Monitor & Manage",
                items: ["Vitamin A reduction ~65% → supplement at RDA", "Injection site reactions ~4% (mild, transient)", "Ophthalmology referral if ocular symptoms", "Routine vitamin A levels not useful during treatment"],
              },
              {
                color: "red",
                bg: "#FDEDEC",
                border: "#C0392B",
                textColor: "#C0392B",
                icon: "⚠️",
                title: "Precautions",
                items: ["Embryo-fetal toxicity (animal data)", "Contraception required during treatment + 7 months post", "Verify pregnancy status before initiating", "No data in severe hepatic impairment"],
              },
            ].map((box) => (
              <div
                key={box.title}
                style={{
                  background: box.bg,
                  border: `2px solid ${box.border}`,
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{box.icon}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: box.textColor,
                    marginBottom: "10px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {box.title}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {box.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: "11.5px",
                        color: box.textColor,
                        lineHeight: 1.5,
                        padding: "3px 0",
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      <span style={{ opacity: 0.5, flexShrink: 0 }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Adverse events table */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
            border: "1px solid #E8ECF0",
            marginBottom: "24px",
          }}
        >
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #E8ECF0" }}>
            <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: "#1A3A6B" }}>
              Selected Adverse Reactions — HELIOS-B (≥5% incidence)
            </h3>
            <p style={{ fontSize: "11px", color: "#95A5A6", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>
              Source: FDA Prescribing Information 2025 (NDA 215515)
            </p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr style={{ background: "#F0F4F8" }}>
                <th style={{ padding: "10px 20px", textAlign: "left", color: "#1A3A6B", fontWeight: 700 }}>Adverse Reaction</th>
                <th style={{ padding: "10px 14px", textAlign: "center", color: "#1A3A6B", fontWeight: 700 }}>AMVUTTRA (n=328)</th>
                <th style={{ padding: "10px 14px", textAlign: "center", color: "#1A3A6B", fontWeight: 700 }}>Placebo (n=327)</th>
                <th style={{ padding: "10px 14px", textAlign: "center", color: "#1A3A6B", fontWeight: 700 }}>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {adverseEvents.map((ae, i) => (
                <tr key={ae.event} style={{ background: i % 2 === 0 ? "white" : "#FAFBFC", borderBottom: "1px solid #F0F4F8" }}>
                  <td style={{ padding: "10px 20px", color: "#1A3A6B", fontWeight: 500 }}>{ae.event}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: ae.category === "yellow" ? "#E67E22" : "#566573" }}>
                    {ae.vutrisiran}
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", color: "#95A5A6" }}>
                    {ae.placebo}
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>
                    <span
                      style={{
                        background: ae.category === "yellow" ? "#FEF9E7" : "#EAFAF1",
                        color: ae.category === "yellow" ? "#E67E22" : "#27AE60",
                        border: `1px solid ${ae.category === "yellow" ? "#E67E22" : "#27AE60"}`,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {ae.category === "yellow" ? "Monitor" : "Low Risk"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Management guidance */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "24px",
            boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
            border: "1px solid #E8ECF0",
          }}
        >
          <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: "#1A3A6B", marginBottom: "20px" }}>
            Clinical Management Guidance
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {managementItems.map((item) => (
              <div
                key={item.title}
                style={{
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                  borderLeft: `4px solid ${item.border}`,
                  borderRadius: "0 10px 10px 0",
                  padding: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "18px" }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "13px", color: item.color, fontFamily: "'DM Sans', sans-serif" }}>
                    {item.title}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#445566", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Special populations */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "24px",
            boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
            border: "1px solid #E8ECF0",
          }}
        >
          <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: "#1A3A6B", marginBottom: "16px" }}>
            Special Populations
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {[
              { pop: "Elderly (≥65 y)", finding: "92% of HELIOS-B population ≥65 y; 62% ≥75 y. No overall differences in safety or efficacy.", icon: "👴" },
              { pop: "Renal Impairment", finding: "No dose adjustment required for mild-moderate renal impairment. Not studied in severe renal impairment.", icon: "🫘" },
              { pop: "Hepatic Impairment", finding: "No dose adjustment for mild-moderate hepatic impairment. Not studied in severe hepatic impairment.", icon: "🫀" },
              { pop: "Pregnancy", finding: "May cause fetal harm based on animal data. Avoid use. Effective contraception required.", icon: "🤰" },
              { pop: "Lactation", finding: "Unknown if present in human milk. Consider developmental risks. Advise against breastfeeding during treatment.", icon: "🍼" },
              { pop: "Pediatric", finding: "Safety and efficacy not established in pediatric patients.", icon: "👶" },
            ].map((sp) => (
              <div
                key={sp.pop}
                style={{
                  background: "#F8F9FA",
                  border: "1px solid #E8ECF0",
                  borderRadius: "10px",
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "16px" }}>{sp.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "12px", color: "#1A3A6B", fontFamily: "'DM Sans', sans-serif" }}>{sp.pop}</span>
                </div>
                <p style={{ fontSize: "11.5px", color: "#566573", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  {sp.finding}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key takeaway */}
        <div
          style={{
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
              <li>→ No REMS, no premedication, no routine monitoring — the simplest safety profile in the class</li>
              <li>→ Vitamin A reduction is predictable and manageable with daily RDA supplementation</li>
              <li>→ Embryo-fetal toxicity is the key warning — counsel all patients of reproductive potential</li>
              <li>→ ISR ~4%, mild and transient — no special management required</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
