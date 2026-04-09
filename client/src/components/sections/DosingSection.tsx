/* Dosing Section — AMVUTTRA Product Website
   Design: Visual dosing timeline + parameter table + comparison
   Sticky takeaway: "4 injections per year — vs. 730 oral doses (acoramidis BID)." */

export default function DosingSection() {
  const dosingParams = [
    { param: "Dose", value: "25 mg", highlight: true },
    { param: "Route", value: "Subcutaneous injection" },
    { param: "Frequency", value: "Once every 3 months (Q3M)", highlight: true },
    { param: "Administration", value: "By a healthcare professional (HCP)" },
    { param: "Injection sites", value: "Abdomen, thigh, or upper arm" },
    { param: "Formulation", value: "25 mg/0.5 mL prefilled syringe" },
    { param: "Premedication", value: "None required", positive: true },
    { param: "REMS", value: "Not required", positive: true },
    { param: "Dose adjustments", value: "None for age, mild-moderate renal/hepatic impairment" },
    { param: "Drug interactions", value: "No clinically significant interactions identified" },
    { param: "Missed dose", value: "Administer as soon as possible; resume Q3M schedule" },
  ];

  const convenienceComparison = [
    { drug: "AMVUTTRA (vutrisiran)", doses: "4", route: "SC Q3M", premedication: "None", rems: "No", color: "#00C2A8", highlight: true },
    { drug: "ONPATTRO (patisiran)", doses: "~17", route: "IV Q3W", premedication: "Required", rems: "No", color: "#0093C4" },
    { drug: "WAINUA (eplontersen)", doses: "~12", route: "SC Monthly", premedication: "None", rems: "No", color: "#E67E22" },
    { drug: "VYNDAQEL (tafamidis)", doses: "365", route: "Oral Daily", premedication: "None", rems: "No", color: "#95A5A6" },
    { drug: "ATTRUBY (acoramidis)", doses: "730", route: "Oral BID", premedication: "None", rems: "No", color: "#95A5A6" },
    { drug: "TEGSEDI (inotersen)", doses: "~52", route: "SC Weekly", premedication: "None", rems: "Required", color: "#C0392B" },
  ];

  return (
    <section
      id="dosing"
      style={{ padding: "80px 0", background: "white" }}
      aria-label="Dosing and administration"
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
            Dosing & Administration
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            Simple, HCP-administered subcutaneous injection — only 4 times per year
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "linear-gradient(135deg, #0093C4, #006B9C)",
              color: "white",
              padding: "8px 18px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Sticky Takeaway: "4 injections per year — vs. 730 oral doses (acoramidis BID)."
          </div>
        </div>

        {/* 12-month dosing timeline */}
        <div
          style={{
            background: "#F8F9FA",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "32px",
            boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
            border: "1px solid #E8ECF0",
          }}
        >
          <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: "#1A3A6B", marginBottom: "20px" }}>
            12-Month Dosing Timeline
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0", overflowX: "auto", marginBottom: "16px" }}>
            {[
              { label: "Day 1", sub: "Dose 1", color: "#1A3A6B" },
              { label: "Month 3", sub: "Dose 2", color: "#00C2A8" },
              { label: "Month 6", sub: "Dose 3", color: "#00C2A8" },
              { label: "Month 9", sub: "Dose 4", color: "#00C2A8" },
              { label: "Month 12", sub: "Year end", color: "#0093C4" },
            ].map((dose, i) => (
              <div key={dose.label} style={{ display: "flex", alignItems: "center", flex: i < 4 ? "1 0 auto" : "0 0 auto" }}>
                <div style={{ textAlign: "center", minWidth: "80px" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      background: dose.color,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 900,
                      fontSize: "12px",
                      margin: "0 auto",
                      fontFamily: "'DM Sans', sans-serif",
                      boxShadow: `0 4px 12px ${dose.color}40`,
                    }}
                  >
                    {dose.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#566573", marginTop: "6px", fontFamily: "'DM Sans', sans-serif" }}>{dose.sub}</div>
                </div>
                {i < 4 && (
                  <div style={{ flex: 1, height: "3px", background: "linear-gradient(90deg, #00C2A8, #0093C4)", minWidth: "40px" }} />
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              background: "#EAFAF1",
              borderRadius: "8px",
              padding: "10px 16px",
              fontSize: "13px",
              color: "#1E8449",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ✅ Only 4 injections per year vs. 730 oral doses (acoramidis BID) or ~17 IV infusions (patisiran Q3W)
          </div>
        </div>

        {/* Two-column: Dosing params + Convenience comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          {/* Dosing parameters */}
          <div
            style={{
              background: "#F8F9FA",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
              border: "1px solid #E8ECF0",
            }}
          >
            <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: "#1A3A6B", marginBottom: "16px" }}>
              Dosing Parameters
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", fontFamily: "'DM Sans', sans-serif" }}>
              <tbody>
                {dosingParams.map((row, i) => (
                  <tr key={row.param} style={{ borderBottom: "1px solid #F0F4F8", background: i % 2 === 0 ? "white" : "transparent" }}>
                    <td style={{ padding: "9px 12px", color: "#566573", width: "45%" }}>{row.param}</td>
                    <td
                      style={{
                        padding: "9px 12px",
                        fontWeight: row.highlight ? 700 : 500,
                        color: row.positive ? "#27AE60" : row.highlight ? "#1A3A6B" : "#445566",
                      }}
                    >
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Annual doses comparison */}
          <div
            style={{
              background: "#F8F9FA",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
              border: "1px solid #E8ECF0",
            }}
          >
            <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: "#1A3A6B", marginBottom: "16px" }}>
              Annual Treatment Burden Comparison
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {convenienceComparison.map((drug) => (
                <div
                  key={drug.drug}
                  style={{
                    background: drug.highlight ? "#1A3A6B" : "white",
                    border: `1px solid ${drug.highlight ? "#1A3A6B" : "#E8ECF0"}`,
                    borderRadius: "10px",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Serif Display', Georgia, serif",
                      fontSize: "1.6rem",
                      color: drug.color,
                      lineHeight: 1,
                      minWidth: "52px",
                      textAlign: "center",
                    }}
                  >
                    {drug.doses}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "12px",
                        color: drug.highlight ? "white" : "#1A3A6B",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {drug.drug}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: drug.highlight ? "rgba(255,255,255,0.65)" : "#95A5A6",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {drug.route} · Premedication: {drug.premedication} · REMS: {drug.rems}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <li>→ 25 mg SC Q3M — only 4 doses/year, HCP-administered, no premedication, no REMS</li>
              <li>→ No formal contraindications in the FDA PI; no clinically significant drug interactions</li>
              <li>→ Key management: vitamin A supplementation at RDA for ALL patients; ophthalmology referral if ocular symptoms develop</li>
              <li>→ Safe in elderly (HELIOS-B population was 92% ≥65 y); dose adjustment not required for mild-moderate renal/hepatic impairment</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
