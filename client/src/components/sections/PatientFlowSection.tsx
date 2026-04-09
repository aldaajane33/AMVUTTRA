/* Patient Flow Section — AMVUTTRA Product Website
   Design: Visual pathway with icons and color-coded steps
   Sticky takeaway: "Up to 13% of HFpEF patients may have undiagnosed ATTR-CM." */

export default function PatientFlowSection() {
  const steps = [
    {
      icon: "🔎",
      title: "SUSPECT",
      color: "#EBF5FB",
      border: "#0093C4",
      textColor: "#1A3A6B",
      criteria: [
        "HFpEF age ≥60 with unexplained LVH",
        "Low-voltage ECG with LVH on echo",
        "Bilateral carpal tunnel syndrome",
        "Lumbar spinal stenosis",
        "TTR gene mutation carriers",
        "Autonomic neuropathy",
      ],
    },
    {
      icon: "🩺",
      title: "SCREEN",
      color: "#E8F8F5",
      border: "#00C2A8",
      textColor: "#148F77",
      criteria: [
        "Tc-PYP bone scintigraphy (Grade 2/3)",
        "Serum + urine immunofixation",
        "Free light chains",
        "Genetic testing (TTR gene)",
        "Echocardiography",
        "NT-proBNP / troponin",
      ],
    },
    {
      icon: "🔬",
      title: "DIAGNOSE",
      color: "#FEF9E7",
      border: "#E67E22",
      textColor: "#784212",
      criteria: [
        "Non-biopsy: Grade 2/3 + negative hematologic",
        "Gillmore criteria (2016)",
        "Tissue biopsy if needed",
        "Genotyping: wt vs. hATTR",
        "Staging: NYHA / NIS / 6MWT",
        "Multidisciplinary team review",
      ],
    },
    {
      icon: "💉",
      title: "TREAT",
      color: "#1A3A6B",
      border: "#1A3A6B",
      textColor: "white",
      criteria: [
        "Initiate AMVUTTRA 25 mg SC Q3M",
        "Begin vitamin A supplementation (RDA)",
        "Ophthalmology referral if ocular Sx",
        "Set patient expectations",
        "Enroll in Alnylam Assist®",
        "Coordinate with specialty pharmacy",
      ],
    },
    {
      icon: "📋",
      title: "MONITOR",
      color: "#EAFAF1",
      border: "#27AE60",
      textColor: "#1E8449",
      criteria: [
        "Q3M visits aligned with dosing",
        "NT-proBNP / troponin trend",
        "Functional assessment (6MWT, NYHA)",
        "Ophthalmology if ocular symptoms",
        "Adherence check (HCP-administered)",
        "Annual echocardiography",
      ],
    },
  ];

  return (
    <section
      id="patient-flow"
      style={{ padding: "80px 0", background: "#F8F9FA" }}
      aria-label="Patient identification and flow"
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
            Patient Identification & Flow
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            From clinical suspicion to treatment initiation and long-term monitoring
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "linear-gradient(135deg, #E67E22, #D35400)",
              color: "white",
              padding: "8px 18px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Sticky Takeaway: "Up to 13% of HFpEF patients may have undiagnosed ATTR-CM."
          </div>
        </div>

        {/* Epidemiology callout */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "20px 28px",
            marginBottom: "32px",
            boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
            border: "1px solid #E8ECF0",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {[
            { val: "~500K", label: "US ATTR-CM patients", sub: "Largely undiagnosed", color: "#0093C4" },
            { val: "13%", label: "HFpEF with ATTR-CM", sub: "Hospitalized patients", color: "#E67E22" },
            { val: "50K+", label: "hATTR-PN patients", sub: "Worldwide (est.)", color: "#27AE60" },
            { val: "~5 yrs", label: "Avg. diagnostic delay", sub: "From symptom onset", color: "#C0392B" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "2.2rem",
                  color: item.color,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.val}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1A3A6B", marginTop: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "11px", color: "#95A5A6", fontFamily: "'DM Sans', sans-serif" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Pathway steps */}
        <div
          style={{
            display: "flex",
            gap: "0",
            overflowX: "auto",
            alignItems: "stretch",
            marginBottom: "32px",
          }}
        >
          {steps.map((step, i) => (
            <div key={step.title} style={{ display: "flex", alignItems: "center", flex: "1 0 auto" }}>
              <div
                style={{
                  minWidth: "180px",
                  maxWidth: "220px",
                  background: step.color,
                  border: `2px solid ${step.border}`,
                  borderRadius: "14px",
                  padding: "20px 16px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${step.border}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{step.icon}</div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: step.textColor,
                    marginBottom: "10px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {step.title}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {step.criteria.map((c) => (
                    <li
                      key={c}
                      style={{
                        fontSize: "11px",
                        color: step.textColor === "white" ? "rgba(255,255,255,0.85)" : step.textColor,
                        lineHeight: 1.5,
                        padding: "2px 0",
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      <span style={{ opacity: 0.6, flexShrink: 0 }}>·</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    fontSize: "20px",
                    color: "#0093C4",
                    padding: "0 8px",
                    flexShrink: 0,
                    fontWeight: 700,
                  }}
                >
                  ▶
                </div>
              )}
            </div>
          ))}
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
              <li>→ ATTR-CM is significantly underdiagnosed — up to 13% of hospitalized HFpEF patients may have it</li>
              <li>→ Non-biopsy diagnosis possible: Grade 2/3 Tc-PYP + negative hematologic workup (Gillmore criteria)</li>
              <li>→ Offer HCPs a structured diagnostic pathway — this builds trust and identifies treatable patients</li>
              <li>→ Q3M dosing aligns monitoring visits with treatment — built-in adherence and HCP touchpoints</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
