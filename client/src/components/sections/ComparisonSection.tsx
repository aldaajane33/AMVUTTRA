/* Comparison Section — AMVUTTRA Product Website
   Design: Side-by-side competitor comparison table + radar chart placeholder
   Sticky takeaway: "The only therapy with dual approval — no competitor matches this." */

export default function ComparisonSection() {
  const competitors = [
    {
      name: "AMVUTTRA",
      generic: "vutrisiran",
      mechanism: "RNAi siRNA-GalNAc",
      route: "SC Q3M",
      attrCm: true,
      hattrPn: true,
      mortality: "HR 0.65 (42 mo)",
      ttrReduction: "~88% peak",
      premedication: false,
      rems: false,
      annualWac: "~$477K",
      highlight: true,
      color: "#00C2A8",
    },
    {
      name: "ONPATTRO",
      generic: "patisiran",
      mechanism: "RNAi siRNA-LNP",
      route: "IV Q3W",
      attrCm: false,
      hattrPn: true,
      mortality: "Not established",
      ttrReduction: "~87%",
      premedication: true,
      rems: false,
      annualWac: "~$450K",
      highlight: false,
      color: "#0093C4",
    },
    {
      name: "WAINUA",
      generic: "eplontersen",
      mechanism: "ASO",
      route: "SC Monthly",
      attrCm: false,
      hattrPn: true,
      mortality: "Pending (2026)",
      ttrReduction: "~81%",
      premedication: false,
      rems: false,
      annualWac: "~$298K",
      highlight: false,
      color: "#E67E22",
    },
    {
      name: "VYNDAQEL/MAX",
      generic: "tafamidis",
      mechanism: "TTR Stabilizer",
      route: "Oral Daily",
      attrCm: true,
      hattrPn: false,
      mortality: "HR 0.70 (30 mo)",
      ttrReduction: "Stabilizes (no reduction)",
      premedication: false,
      rems: false,
      annualWac: "~$225K",
      highlight: false,
      color: "#95A5A6",
    },
    {
      name: "ATTRUBY",
      generic: "acoramidis",
      mechanism: "TTR Stabilizer",
      route: "Oral BID",
      attrCm: true,
      hattrPn: false,
      mortality: "42% ACM+CV",
      ttrReduction: "Stabilizes ≥90%",
      premedication: false,
      rems: false,
      annualWac: "~$198K",
      highlight: false,
      color: "#95A5A6",
    },
    {
      name: "TEGSEDI",
      generic: "inotersen",
      mechanism: "ASO",
      route: "SC Weekly",
      attrCm: false,
      hattrPn: true,
      mortality: "—",
      ttrReduction: "~74%",
      premedication: false,
      rems: true,
      annualWac: "~$450K",
      highlight: false,
      color: "#C0392B",
    },
  ];

  const features = [
    { key: "mechanism", label: "Mechanism" },
    { key: "route", label: "Route / Frequency" },
    { key: "attrCm", label: "ATTR-CM Approval" },
    { key: "hattrPn", label: "hATTR-PN Approval" },
    { key: "mortality", label: "Mortality Data (CM)" },
    { key: "ttrReduction", label: "TTR Reduction" },
    { key: "premedication", label: "Premedication" },
    { key: "rems", label: "REMS" },
    { key: "annualWac", label: "Annual WAC (approx.)" },
  ];

  type CompKey = keyof typeof competitors[0];
  const renderCell = (comp: typeof competitors[0], key: string) => {
    const val = comp[key as CompKey];
    if (typeof val === "boolean") {
      return val ? (
        <span style={{ color: "#27AE60", fontWeight: 700 }}>✅ Yes</span>
      ) : (
        <span style={{ color: "#C0392B", fontWeight: 700 }}>❌ No</span>
      );
    }
    if (key === "premedication") {
      return val ? (
        <span style={{ color: "#C0392B", fontWeight: 700 }}>Required</span>
      ) : (
        <span style={{ color: "#27AE60", fontWeight: 700 }}>None</span>
      );
    }
    if (key === "rems") {
      return val ? (
        <span style={{ color: "#C0392B", fontWeight: 700 }}>Required</span>
      ) : (
        <span style={{ color: "#27AE60", fontWeight: 700 }}>Not required</span>
      );
    }
    return val;
  };

  const differentiators = [
    { icon: "🎯", title: "Dual Indication", desc: "Only approved therapy for both ATTR-CM AND hATTR-PN — covers ~50% of patients with mixed phenotype", color: "#EBF5FB", border: "#1A3A6B" },
    { icon: "⏰", title: "Q3M Convenience", desc: "4 doses/year vs. daily (stabilizers), weekly (inotersen), monthly (eplontersen), Q3W IV (patisiran)", color: "#EAFAF1", border: "#27AE60" },
    { icon: "📊", title: "Hard CV Outcome Data", desc: "HELIOS-B: mortality + hospitalization endpoints, benefit even on top of background tafamidis", color: "#FEF9E7", border: "#E67E22" },
    { icon: "☠️", title: "Mortality Signal", desc: "35% reduction in ACM at 42 months (HR 0.65) — strongest mortality evidence in RNAi ATTR-CM class", color: "#FDEDEC", border: "#C0392B" },
    { icon: "🚫", title: "No REMS · No Premedication", desc: "SC injection, no IV, no monitoring requirements beyond standard vitamin A supplementation", color: "#F3E8FF", border: "#8E44AD" },
    { icon: "🔇", title: "Silencing vs. Stabilization", desc: "Eliminates TTR at source (>80% sustained reduction) — addresses both mutant and wild-type TTR", color: "#E8F8F5", border: "#00C2A8" },
  ];

  return (
    <section
      id="comparison"
      style={{ padding: "80px 0", background: "white" }}
      aria-label="Competitor comparison"
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
            Competitive Landscape
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            Head-to-head comparison — AMVUTTRA vs. the field
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "linear-gradient(135deg, #1A3A6B, #0D2047)",
              color: "white",
              padding: "8px 18px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Sticky Takeaway: "The only therapy with dual approval — no competitor matches this."
          </div>
        </div>

        {/* Comparison table */}
        <div
          style={{
            background: "#F8F9FA",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
            border: "1px solid #E8ECF0",
            marginBottom: "32px",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr>
                <th style={{ padding: "14px 16px", textAlign: "left", background: "#F0F4F8", color: "#1A3A6B", fontWeight: 700, minWidth: "140px" }}>
                  Feature
                </th>
                {competitors.map((comp) => (
                  <th
                    key={comp.name}
                    style={{
                      padding: "14px 12px",
                      textAlign: "center",
                      background: comp.highlight ? "#0D2047" : "#F0F4F8",
                      color: comp.highlight ? "white" : "#1A3A6B",
                      fontWeight: 700,
                      minWidth: "120px",
                      borderLeft: comp.highlight ? "none" : "1px solid #E8ECF0",
                    }}
                  >
                    <div style={{ color: comp.highlight ? "#00C2A8" : comp.color, fontSize: "13px" }}>{comp.name}</div>
                    <div style={{ fontSize: "10px", opacity: 0.7, fontWeight: 400, marginTop: "2px" }}>{comp.generic}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, fi) => (
                <tr key={feature.key} style={{ background: fi % 2 === 0 ? "white" : "#FAFBFC", borderBottom: "1px solid #F0F4F8" }}>
                  <td style={{ padding: "10px 16px", color: "#566573", fontWeight: 600 }}>{feature.label}</td>
                  {competitors.map((comp) => (
                    <td
                      key={comp.name}
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        color: comp.highlight ? "#1A3A6B" : "#445566",
                        background: comp.highlight ? "rgba(0,194,168,0.05)" : "transparent",
                        fontWeight: comp.highlight ? 600 : 400,
                        borderLeft: comp.highlight ? "2px solid rgba(0,194,168,0.3)" : "1px solid #F0F4F8",
                        borderRight: comp.highlight ? "2px solid rgba(0,194,168,0.3)" : "none",
                        fontSize: "11.5px",
                      }}
                    >
                      {renderCell(comp, feature.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "10px 16px", background: "#F0F4F8", fontSize: "10px", color: "#95A5A6", fontFamily: "'DM Sans', sans-serif" }}>
            WAC = Wholesale Acquisition Cost (approximate annual). Data as of Q1 2026. Sources: FDA PI, company press releases, ICER reports.
          </div>
        </div>

        {/* 6 Key Differentiators */}
        <div
          style={{
            background: "#F8F9FA",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "24px",
            boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
            border: "1px solid #E8ECF0",
          }}
        >
          <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: "#1A3A6B", marginBottom: "20px" }}>
            AMVUTTRA's 6 Key Differentiators
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {differentiators.map((d) => (
              <div
                key={d.title}
                style={{
                  background: d.color,
                  borderTop: `4px solid ${d.border}`,
                  borderRadius: "12px",
                  padding: "16px",
                  transition: "transform 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>{d.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "12.5px", color: "#1A3A6B", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                  {d.title}
                </div>
                <div style={{ fontSize: "11.5px", color: "#566573", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                  {d.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive intelligence note */}
        <div
          style={{
            background: "#FEF9E7",
            border: "1px solid #E67E22",
            borderLeft: "4px solid #E67E22",
            borderRadius: "0 12px 12px 0",
            padding: "16px 20px",
            marginBottom: "24px",
            fontSize: "12.5px",
            color: "#784212",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <strong>⚡ Competitive Intelligence Note (Q1 2026):</strong> Intellia's nex-z (in vivo CRISPR) program is in FDA clinical hold since October 2025 following a patient death in the MAGNITUDE Phase 3 trial — not a near-term competitive threat. Eplontersen's CARDIO-TTRansform trial for ATTR-CM readout expected 2026 — monitor closely.
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
              <li>→ AMVUTTRA is the only therapy with dual approval (ATTR-CM + hATTR-PN) — no competitor matches this</li>
              <li>→ Patisiran: same mechanism but IV Q3W + premedication, no CM approval → AMVUTTRA is strictly superior in convenience and indication coverage</li>
              <li>→ vs. Stabilizers: AMVUTTRA silences TTR (&gt;80% reduction) while tafamidis/acoramidis merely stabilize; AMVUTTRA showed benefit ON TOP of tafamidis</li>
              <li>→ Intellia nex-z (CRISPR) in clinical hold since Oct 2025 — not a near-term competitive threat</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
