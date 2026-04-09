/* References Section — AMVUTTRA Product Website
   Design: Numbered reference list with citation badges */

const REFERENCES = [
  {
    num: 1,
    citation: "Fontana M, Solomon SD, Bhatt DL, et al. Vutrisiran for Transthyretin Amyloid Cardiomyopathy with Heart Failure. N Engl J Med. 2024;391(22):2119-2130.",
    type: "Phase 3 RCT",
    color: "#27AE60",
    doi: "10.1056/NEJMoa2409134",
  },
  {
    num: 2,
    citation: "Gillmore JD, Maurer MS, Falk RH, et al. Nonbiopsy Diagnosis of Cardiac Transthyretin Amyloidosis. Circulation. 2016;133(24):2404-2412.",
    type: "Diagnostic Criteria",
    color: "#0093C4",
    doi: "10.1161/CIRCULATIONAHA.116.021612",
  },
  {
    num: 3,
    citation: "Adams D, Tournev IL, Taylor MS, et al. Efficacy and safety of vutrisiran for patients with hereditary transthyretin-mediated amyloidosis with polyneuropathy: a randomized clinical trial. Amyloid. 2023;30(1):1-9.",
    type: "Phase 3 RCT",
    color: "#E67E22",
    doi: "10.1080/13506129.2022.2091985",
  },
  {
    num: 4,
    citation: "Solomon SD, Bhatt DL, Fontana M, et al. Vutrisiran in Patients with Transthyretin Amyloid Cardiomyopathy — Open-Label Extension (HELIOS-B OLE). Presented at ESC Congress 2025.",
    type: "OLE Data",
    color: "#6366F1",
    doi: "",
  },
  {
    num: 5,
    citation: "Maurer MS, Schwartz JH, Gundapaneni B, et al. Tafamidis Treatment for Patients with Transthyretin Amyloid Cardiomyopathy. N Engl J Med. 2018;379(11):1007-1016.",
    type: "Phase 3 RCT",
    color: "#95A5A6",
    doi: "10.1056/NEJMoa1805689",
  },
  {
    num: 6,
    citation: "Damy T, Garcia-Pavia P, Hanna M, et al. Efficacy and Safety of Patisiran in Patients with Hereditary Transthyretin Amyloidosis with Cardiomyopathy (APOLLO-B). Eur J Heart Fail. 2022;24(8):1467-1477.",
    type: "Phase 3 RCT",
    color: "#0093C4",
    doi: "10.1002/ejhf.2578",
  },
  {
    num: 7,
    citation: "Hanna M, Damy T, Grogan M, et al. Eplontersen for Hereditary Transthyretin Amyloidosis with Polyneuropathy (NEURO-TTRansform). JAMA. 2023;330(15):1448-1458.",
    type: "Phase 3 RCT",
    color: "#E67E22",
    doi: "10.1001/jama.2023.18688",
  },
  {
    num: 8,
    citation: "Alnylam Pharmaceuticals. AMVUTTRA® (vutrisiran) Prescribing Information. Cambridge, MA: Alnylam Pharmaceuticals, Inc.; 2025. NDA 215515.",
    type: "FDA PI",
    color: "#C0392B",
    doi: "",
  },
  {
    num: 9,
    citation: "Ruberg FL, Grogan M, Hanna M, Kelly JW, Maurer MS. Transthyretin Amyloid Cardiomyopathy: JACC State-of-the-Art Review. J Am Coll Cardiol. 2019;73(22):2872-2891.",
    type: "Review",
    color: "#1A3A6B",
    doi: "10.1016/j.jacc.2019.04.003",
  },
  {
    num: 10,
    citation: "Castaño A, Narotsky DL, Hamid N, et al. Unveiling transthyretin cardiac amyloidosis and its predictors among elderly patients with severe aortic stenosis undergoing transcatheter aortic valve replacement. Eur Heart J. 2017;38(38):2879-2887.",
    type: "Epidemiology",
    color: "#566573",
    doi: "10.1093/eurheartj/ehx350",
  },
  {
    num: 11,
    citation: "Witteles RM, Bokhari S, Damy T, et al. Screening for Transthyretin Amyloid Cardiomyopathy in Everyday Practice. JACC Heart Fail. 2019;7(8):709-716.",
    type: "Screening",
    color: "#566573",
    doi: "10.1016/j.jchf.2019.04.010",
  },
  {
    num: 12,
    citation: "Connors LH, Sam F, Skinner M, et al. Heart Failure Resulting From Age-Related Cardiac Amyloid Disease Associated With Wild-Type Transthyretin: A Prospective, Observational Cohort Study. Circulation. 2016;133(3):282-290.",
    type: "Epidemiology",
    color: "#566573",
    doi: "10.1161/CIRCULATIONAHA.115.018852",
  },
];

export default function ReferencesSection() {
  return (
    <section
      id="references"
      style={{ padding: "80px 0", background: "#F8F9FA" }}
      aria-label="References"
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
            References
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            Key publications, clinical trial data, and prescribing information sources
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(26,58,107,0.06)",
            border: "1px solid #E8ECF0",
          }}
        >
          {REFERENCES.map((ref, i) => (
            <div
              key={ref.num}
              style={{
                display: "flex",
                gap: "16px",
                padding: "16px 24px",
                background: i % 2 === 0 ? "white" : "#FAFBFC",
                borderBottom: i < REFERENCES.length - 1 ? "1px solid #F0F4F8" : "none",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: ref.color,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  flexShrink: 0,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {ref.num}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      background: `${ref.color}15`,
                      color: ref.color,
                      border: `1px solid ${ref.color}40`,
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {ref.type}
                  </span>
                  {ref.doi && (
                    <a
                      href={`https://doi.org/${ref.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "9px",
                        color: "#0093C4",
                        textDecoration: "none",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      DOI: {ref.doi}
                    </a>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "12.5px",
                    color: "#445566",
                    lineHeight: 1.6,
                    fontFamily: "'DM Sans', sans-serif",
                    margin: 0,
                  }}
                >
                  {ref.citation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          style={{
            marginTop: "24px",
            background: "#FEF9E7",
            border: "1px solid #E67E22",
            borderRadius: "12px",
            padding: "16px 20px",
            fontSize: "12px",
            color: "#784212",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.6,
          }}
        >
          <strong>Disclaimer:</strong> This dossier is prepared for internal training and onboarding purposes at NewBridge Pharmaceuticals. It is not intended for distribution to healthcare professionals, patients, or the public. All clinical data should be verified against the current FDA-approved Prescribing Information and published literature. Data as of Q1 2026. AMVUTTRA® is a registered trademark of Alnylam Pharmaceuticals, Inc.
        </div>
      </div>
    </section>
  );
}
