/* Knowledge Section — AMVUTTRA Product Website
   Design: Interactive flip cards for key clinical concepts
   Features: 12 flip cards with front (concept) and back (clinical context) */

export default function KnowledgeSection() {
  const cards = [
    {
      front: { icon: "🔬", title: "What is ATTR Amyloidosis?", tag: "Disease Biology" },
      back: {
        text: "Misfolded transthyretin (TTR) protein deposits as amyloid fibrils in heart, nerves, and other organs. Two forms: hereditary (hATTR — TTR gene mutation) and wild-type (wt-ATTR — age-related). Leads to restrictive cardiomyopathy (ATTR-CM) and/or polyneuropathy (hATTR-PN).",
        color: "#0093C4",
      },
    },
    {
      front: { icon: "🧬", title: "GalNAc-siRNA Platform", tag: "MOA" },
      back: {
        text: "Triantennary N-acetylgalactosamine (GalNAc) conjugate targets ASGPR on hepatocytes. Enables SC delivery (no LNP needed), high hepatocyte selectivity, and minimal off-target effects. ESC chemistry provides metabolic stability for Q3M dosing.",
        color: "#00C2A8",
      },
    },
    {
      front: { icon: "📊", title: "HELIOS-B Primary Endpoint", tag: "Clinical Evidence" },
      back: {
        text: "Composite of all-cause mortality (ACM) + recurrent CV events (CV hospitalization, urgent HF visit, resuscitated cardiac arrest). Overall: HR 0.72 (P=0.01). Monotherapy: HR 0.67 (P=0.02). ACM at 42 mo: HR 0.65 (P=0.01).",
        color: "#27AE60",
      },
    },
    {
      front: { icon: "🏥", title: "HELIOS-A Design", tag: "Clinical Evidence" },
      back: {
        text: "Phase 3, open-label, N=164 hATTR-PN patients. External placebo from APOLLO (patisiran Phase 3). Primary endpoint: change in mNIS+7 at 18 months. Result: −2.2 (vutrisiran) vs. +14.8 (placebo) → net −17.0 (P=3.5×10⁻¹²).",
        color: "#E67E22",
      },
    },
    {
      front: { icon: "💊", title: "Dosing Essentials", tag: "Dosing" },
      back: {
        text: "25 mg SC injection Q3M (every 3 months). HCP-administered. No premedication. No REMS. Rotate sites: abdomen, thigh, upper arm. No dose adjustments for age, mild-moderate renal/hepatic impairment. Missed dose: give ASAP, resume Q3M schedule.",
        color: "#1A3A6B",
      },
    },
    {
      front: { icon: "⚠️", title: "Key Safety: Vitamin A", tag: "Safety" },
      back: {
        text: "Vutrisiran reduces serum vitamin A by ~65% (mechanism: TTR is the transport protein for vitamin A). Supplement ALL patients at RDA (700–900 mcg/day RAE). Do NOT use high-dose supplements. Refer to ophthalmology if ocular symptoms develop.",
        color: "#E67E22",
      },
    },
    {
      front: { icon: "🤰", title: "Embryo-Fetal Toxicity", tag: "Safety" },
      back: {
        text: "Boxed Warning: May cause fetal harm based on animal data. Advise females of reproductive potential to use effective contraception during treatment AND for 7 months after last dose. Verify pregnancy status before initiating. Advise male patients with female partners.",
        color: "#C0392B",
      },
    },
    {
      front: { icon: "🔎", title: "Diagnosing ATTR-CM", tag: "Patient Identification" },
      back: {
        text: "Non-biopsy diagnosis: Grade 2/3 Tc-PYP bone scan + negative serum/urine immunofixation + negative free light chains (Gillmore criteria, 2016). Suspect in: HFpEF ≥60 y with unexplained LVH, low-voltage ECG with LVH, bilateral CTS, lumbar spinal stenosis.",
        color: "#0093C4",
      },
    },
    {
      front: { icon: "⚔️", title: "vs. Tafamidis", tag: "Competitive" },
      back: {
        text: "Tafamidis stabilizes TTR tetramer (no reduction). AMVUTTRA silences TTR (>80% reduction). HELIOS-B showed benefit ON TOP of background tafamidis (HR 0.79 in background tafamidis subgroup). AMVUTTRA also has hATTR-PN approval; tafamidis does not.",
        color: "#95A5A6",
      },
    },
    {
      front: { icon: "⚔️", title: "vs. Patisiran", tag: "Competitive" },
      back: {
        text: "Both are RNAi siRNA. Patisiran uses LNP → IV Q3W + premedication. Vutrisiran uses GalNAc → SC Q3M, no premedication. Vutrisiran has ATTR-CM approval (patisiran does not). Comparable TTR reduction (~87% vs ~88%). AMVUTTRA is strictly superior in convenience.",
        color: "#0093C4",
      },
    },
    {
      front: { icon: "📋", title: "Alnylam Assist®", tag: "Access & Support" },
      back: {
        text: "Comprehensive patient support program: prior authorization support, appeals assistance, co-pay assistance (eligible commercially insured patients), free drug program (uninsured/underinsured), specialty pharmacy coordination, nurse educator support, adherence monitoring.",
        color: "#27AE60",
      },
    },
    {
      front: { icon: "🎯", title: "Ideal Patient Profile", tag: "Patient Flow" },
      back: {
        text: "ATTR-CM: Symptomatic HFpEF (NYHA I–III), confirmed ATTR-CM (Tc-PYP Grade 2/3 + negative hematologic), any TTR genotype. hATTR-PN: Stage 1–2 polyneuropathy, TTR gene mutation confirmed. Progressing on tafamidis → consider switching/adding AMVUTTRA.",
        color: "#1A3A6B",
      },
    },
  ];

  return (
    <section
      id="knowledge"
      style={{ padding: "80px 0", background: "white" }}
      aria-label="Knowledge cards"
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
            Knowledge Cards
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            Hover over each card to reveal clinical context — 12 essential concepts
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.front.title}
              className="flip-card"
              style={{ height: "180px" }}
              tabIndex={0}
              role="button"
              aria-label={`Knowledge card: ${card.front.title}`}
            >
              <div className="flip-card-inner">
                {/* Front */}
                <div
                  className="flip-card-front"
                  style={{
                    background: "#F8F9FA",
                    border: "1px solid #E8ECF0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    textAlign: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ fontSize: "32px" }}>{card.front.icon}</div>
                  <div
                    style={{
                      fontFamily: "'DM Serif Display', Georgia, serif",
                      fontSize: "1rem",
                      color: "#1A3A6B",
                      lineHeight: 1.3,
                    }}
                  >
                    {card.front.title}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      background: "#E8ECF0",
                      color: "#566573",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {card.front.tag}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#95A5A6",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Hover to reveal →
                  </div>
                </div>

                {/* Back */}
                <div
                  className="flip-card-back"
                  style={{
                    background: card.back.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11.5px",
                      color: "white",
                      lineHeight: 1.6,
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: "left",
                      margin: 0,
                    }}
                  >
                    {card.back.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
