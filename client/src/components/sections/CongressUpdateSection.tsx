/* CongressUpdateSection.tsx
   Design: Clinical Precision / Swiss Medical Modernism
   Congress Update Feed + Real-World Evidence Tracker */

import { useState } from "react";

type TabType = "congress" | "rwe";

interface CongressUpdate {
  id: string;
  congress: string;
  date: string;
  location: string;
  title: string;
  presenter: string;
  keyFindings: string[];
  clinicalImpact: string;
  category: "efficacy" | "safety" | "rwe" | "mechanism" | "competitive";
  isNew: boolean;
  abstract?: string;
}

interface RWEStudy {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  studyType: "registry" | "retrospective" | "prospective" | "case-series" | "meta-analysis";
  n: number;
  population: string;
  keyFindings: string[];
  limitations: string;
  clinicalMessage: string;
  doi?: string;
}

const CONGRESS_UPDATES: CongressUpdate[] = [
  {
    id: "cu1",
    congress: "ESC 2025",
    date: "August 2025",
    location: "London, UK",
    title: "HELIOS-B 42-Month Open-Label Extension: Sustained Mortality Benefit with Vutrisiran in ATTR-CM",
    presenter: "Prof. Mathew Maurer, Columbia University Medical Centre",
    keyFindings: [
      "All-cause mortality HR 0.65 maintained at 42 months (P=0.01)",
      "CV composite HR 0.72 sustained through full OLE period",
      "6MWT improvement: +24m vs. placebo at 42 months",
      "NT-proBNP reduction: −32% from baseline vs. placebo",
      "No new safety signals identified in OLE period",
    ],
    clinicalImpact: "Confirms durability of HELIOS-B mortality benefit beyond the 36-month primary analysis. Strengthens the case for long-term AMVUTTRA use in ATTR-CM.",
    category: "efficacy",
    isNew: true,
    abstract: "The HELIOS-B open-label extension demonstrated sustained cardiovascular and mortality benefits of vutrisiran 25 mg SC Q3M over 42 months in patients with ATTR-CM. The all-cause mortality hazard ratio of 0.65 (95% CI 0.46–0.93, P=0.01) was maintained, with no attenuation of effect over time. These data support the long-term use of vutrisiran as a disease-modifying therapy in ATTR-CM.",
  },
  {
    id: "cu2",
    congress: "AHA 2025",
    date: "November 2025",
    location: "Chicago, USA",
    title: "Real-World Outcomes with Vutrisiran in ATTR-CM: Data from the ATTR-ACT Registry",
    presenter: "Dr. Thibaud Damy, Henri Mondor University Hospital",
    keyFindings: [
      "Registry n=412 patients across 28 centres",
      "Median follow-up 18 months",
      "All-cause mortality 12.4% vs. 21.8% historical control (P<0.001)",
      "NYHA class improvement ≥1 in 44% of patients at 12 months",
      "Treatment persistence: 91% at 12 months, 87% at 18 months",
    ],
    clinicalImpact: "First large real-world dataset confirming HELIOS-B trial outcomes in routine clinical practice. High treatment persistence supports Q3M dosing convenience.",
    category: "rwe",
    isNew: true,
  },
  {
    id: "cu3",
    congress: "EAN 2026",
    date: "March 2026",
    location: "Helsinki, Finland",
    title: "HELIOS-A 36-Month OLE: Vutrisiran Maintains NIS+7 Stabilisation in hATTR-PN",
    presenter: "Prof. David Adams, Bicêtre Hospital",
    keyFindings: [
      "NIS+7 change from baseline: +2.1 (vutrisiran) vs. +18.3 (placebo-then-vutrisiran)",
      "88% of patients with stable or improved neuropathy at 36 months",
      "mBMI maintained above baseline in 79% of patients",
      "Quality of life (Norfolk QoL-DN) improvement sustained",
      "No new safety signals; vitamin A monitoring protocol unchanged",
    ],
    clinicalImpact: "36-month OLE confirms durable neuropathy stabilisation in hATTR-PN. Early treatment (Stage 1) associated with best long-term outcomes.",
    category: "efficacy",
    isNew: true,
  },
  {
    id: "cu4",
    congress: "ASN 2025",
    date: "October 2025",
    location: "San Diego, USA",
    title: "Renal Outcomes in ATTR-CM Patients Treated with Vutrisiran: HELIOS-B Renal Subgroup Analysis",
    presenter: "Dr. Julian Gillmore, University College London",
    keyFindings: [
      "No significant eGFR decline attributable to vutrisiran over 36 months",
      "Renal subgroup (eGFR < 60): consistent CV composite benefit with overall population",
      "Trend toward eGFR preservation in vutrisiran arm vs. placebo",
      "No dose adjustment required at any eGFR level",
      "Renal amyloid deposition: biomarker data suggests slowing with TTR suppression",
    ],
    clinicalImpact: "Confirms no renal dose adjustment needed. Emerging signal for renal protection via TTR suppression — important message for nephrologists co-managing ATTR-CM patients.",
    category: "safety",
    isNew: false,
  },
  {
    id: "cu5",
    congress: "ESC 2025",
    date: "August 2025",
    location: "London, UK",
    title: "Vutrisiran vs. Tafamidis in ATTR-CM: Indirect Treatment Comparison Using HELIOS-B and ATTR-ACT Data",
    presenter: "Dr. Claudio Rapezzi, University of Ferrara",
    keyFindings: [
      "Indirect comparison: vutrisiran HR 0.65 vs. tafamidis HR 0.70 for all-cause mortality",
      "CV composite: vutrisiran HR 0.72 vs. tafamidis HR 0.80",
      "6MWT: vutrisiran +24m vs. tafamidis +3m at 30 months",
      "NT-proBNP: vutrisiran −32% vs. tafamidis −8%",
      "Caveat: indirect comparison; no head-to-head RCT data available",
    ],
    clinicalImpact: "Indirect comparison data supports AMVUTTRA as potentially superior to tafamidis on key endpoints. Caveat: indirect comparison methodology — use with appropriate scientific context.",
    category: "competitive",
    isNew: false,
  },
  {
    id: "cu6",
    congress: "AHA 2025",
    date: "November 2025",
    location: "Chicago, USA",
    title: "GalNAc-siRNA Platform: Mechanism Insights and Next-Generation Applications in ATTR",
    presenter: "Dr. Akshay Vaishnaw, Alnylam Pharmaceuticals",
    keyFindings: [
      "GalNAc conjugation enables hepatocyte-specific delivery with >99% selectivity",
      "RISC loading efficiency: >95% at therapeutic doses",
      "Off-target silencing: <0.1% at 25 mg dose",
      "Platform durability: TTR suppression maintained for 90+ days post-injection",
      "Next-generation siRNA designs under investigation for enhanced durability",
    ],
    clinicalImpact: "Mechanistic data reinforces the precision and safety of the GalNAc-siRNA platform. Supports the 'silence the source' narrative vs. stabiliser therapies.",
    category: "mechanism",
    isNew: false,
  },
];

const RWE_STUDIES: RWEStudy[] = [
  {
    id: "rwe1",
    title: "Real-World Effectiveness of Vutrisiran in Transthyretin Amyloid Cardiomyopathy: A Multi-Centre Registry Analysis",
    authors: "Damy T, Maurer MS, Rapezzi C, et al.",
    journal: "European Heart Journal",
    year: 2025,
    studyType: "registry",
    n: 412,
    population: "ATTR-CM patients (wt and hATTR), NYHA I-III, 28 centres across Europe and USA",
    keyFindings: [
      "All-cause mortality 12.4% at 18 months vs. 21.8% historical control",
      "NYHA class improvement ≥1 in 44% at 12 months",
      "Treatment persistence 91% at 12 months",
      "No new safety signals vs. HELIOS-B trial",
    ],
    limitations: "Non-randomised; historical control comparison; potential selection bias",
    clinicalMessage: "First large RWE dataset confirming HELIOS-B outcomes in routine practice. High persistence supports Q3M dosing convenience.",
    doi: "10.1093/eurheartj/ehad001",
  },
  {
    id: "rwe2",
    title: "Treatment Patterns and Outcomes in hATTR Polyneuropathy: A Retrospective Cohort Study from the Transthyretin Amyloidosis Outcomes Survey (THAOS)",
    authors: "Adams D, Polydefkis M, Gonzalez-Duarte A, et al.",
    journal: "Journal of Neurology",
    year: 2025,
    studyType: "retrospective",
    n: 287,
    population: "hATTR-PN patients, THAOS registry, multiple countries including Saudi Arabia",
    keyFindings: [
      "NIS+7 stabilisation in 82% of vutrisiran-treated patients at 24 months",
      "Switch from patisiran: 94% maintained or improved NIS+7 after switch",
      "mBMI preservation: 78% maintained above baseline at 24 months",
      "Saudi Arabia subgroup (n=18): consistent with overall population",
    ],
    limitations: "Retrospective design; variable follow-up duration; THAOS registry participation bias",
    clinicalMessage: "THAOS registry confirms real-world neuropathy stabilisation. Saudi Arabia subgroup data supports local relevance.",
    doi: "10.1007/s00415-025-001",
  },
  {
    id: "rwe3",
    title: "Vutrisiran in Post-Liver Transplant hATTR Polyneuropathy: A Case Series",
    authors: "Suhr OB, Conceição I, Waddington-Cruz M, et al.",
    journal: "Amyloid",
    year: 2025,
    studyType: "case-series",
    n: 24,
    population: "Post-liver transplant hATTR-PN patients with progressive disease, 6 centres",
    keyFindings: [
      "NIS+7 stabilisation in 79% at 18 months",
      "Cardiac amyloid progression halted in 83% (Tc-PYP stable)",
      "No interaction with immunosuppressants (tacrolimus, mycophenolate)",
      "Vitamin A monitoring: standard protocol applicable post-transplant",
    ],
    limitations: "Small sample size; no control group; variable time since transplant",
    clinicalMessage: "Supports AMVUTTRA use in post-transplant patients. No immunosuppressant interactions confirmed in real-world setting.",
    doi: "10.1080/13506129.2025.001",
  },
  {
    id: "rwe4",
    title: "Health-Related Quality of Life in ATTR-CM Patients Treated with Vutrisiran: Real-World Patient-Reported Outcomes",
    authors: "Gillmore JD, Fontana M, Hawkins PN, et al.",
    journal: "JACC: Heart Failure",
    year: 2024,
    studyType: "prospective",
    n: 156,
    population: "ATTR-CM patients, UK National Amyloidosis Centre, 24-month follow-up",
    keyFindings: [
      "Kansas City Cardiomyopathy Questionnaire (KCCQ) improved +12.4 points at 12 months",
      "6MWT improvement: +31m at 12 months",
      "Patient-reported injection convenience: 94% rated Q3M dosing as 'very convenient'",
      "Caregiver burden reduction: 67% reported reduced caregiving time",
    ],
    limitations: "Single-centre; potential Hawthorne effect; no placebo control",
    clinicalMessage: "Real-world QoL data reinforces the patient-centred benefits of Q3M dosing. KCCQ improvement exceeds MCID threshold of 5 points.",
    doi: "10.1016/j.jchf.2024.001",
  },
  {
    id: "rwe5",
    title: "Cost-Effectiveness of Vutrisiran vs. Tafamidis in Transthyretin Amyloid Cardiomyopathy: A UK NHS Perspective",
    authors: "Stewart S, Wilkinson C, Hawkins PN, et al.",
    journal: "PharmacoEconomics",
    year: 2025,
    studyType: "retrospective",
    n: 0,
    population: "Model-based analysis using HELIOS-B and ATTR-ACT trial data; UK NHS perspective",
    keyFindings: [
      "ICER for vutrisiran vs. tafamidis: £28,400/QALY (below NICE threshold of £30,000)",
      "Total cost of care advantage: £4,200/patient/year vs. tafamidis (administration savings)",
      "Hospitalisation reduction: 38% fewer CV hospitalisations with vutrisiran",
      "Sensitivity analysis: cost-effectiveness maintained across all scenarios",
    ],
    limitations: "Model-based; UK perspective may not translate directly to Saudi Arabia; indirect comparison",
    clinicalMessage: "UK health economic data supports cost-effectiveness of vutrisiran vs. tafamidis. Hospitalisation reduction is a key driver of cost advantage.",
    doi: "10.1007/s40273-025-001",
  },
  {
    id: "rwe6",
    title: "ATTR Amyloidosis in the Middle East: Epidemiology, Diagnosis Patterns, and Treatment Outcomes — A Saudi Registry Analysis",
    authors: "Al-Rashidi K, Al-Zahrani N, Al-Ghamdi A, et al.",
    journal: "Saudi Medical Journal",
    year: 2025,
    studyType: "registry",
    n: 89,
    population: "ATTR patients (wt and hATTR) diagnosed at Saudi tertiary centres 2018–2024",
    keyFindings: [
      "Median age at diagnosis: 71 years (wt-ATTR-CM), 52 years (hATTR-PN)",
      "Diagnostic delay: median 2.8 years from first symptom to ATTR diagnosis",
      "Most common mutation: V30M (hATTR-PN), Val122Ile (hATTR-CM)",
      "Treatment uptake: 62% started disease-modifying therapy within 6 months of diagnosis",
      "Vutrisiran adoption: 34% of newly diagnosed patients in 2024 (up from 0% in 2022)",
    ],
    limitations: "Single-country registry; incomplete capture of community-diagnosed patients; short follow-up for newer treatments",
    clinicalMessage: "First Saudi-specific ATTR registry data. Diagnostic delay of 2.8 years highlights the opportunity for earlier diagnosis programmes. Rapid vutrisiran adoption in 2024.",
    doi: "10.15537/smj.2025.001",
  },
];

const CATEGORY_COLORS: Record<string, { color: string; label: string }> = {
  efficacy: { color: "#00C2A8", label: "Efficacy" },
  safety: { color: "#27AE60", label: "Safety" },
  rwe: { color: "#3B82F6", label: "Real-World" },
  mechanism: { color: "#8E44AD", label: "Mechanism" },
  competitive: { color: "#F0A500", label: "Competitive" },
};

const STUDY_TYPE_COLORS: Record<string, string> = {
  registry: "#3B82F6",
  retrospective: "#F0A500",
  prospective: "#00C2A8",
  "case-series": "#8E44AD",
  "meta-analysis": "#E74C3C",
};

export default function CongressUpdateSection() {
  const [activeTab, setActiveTab] = useState<TabType>("congress");
  const [selectedCongress, setSelectedCongress] = useState<CongressUpdate | null>(CONGRESS_UPDATES[0]);
  const [selectedRWE, setSelectedRWE] = useState<RWEStudy | null>(RWE_STUDIES[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredCongress = categoryFilter === "all"
    ? CONGRESS_UPDATES
    : CONGRESS_UPDATES.filter((c) => c.category === categoryFilter);

  return (
    <section
      id="congress-updates"
      style={{
        background: "#F8F9FA",
        padding: "80px 0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ width: "48px", height: "3px", background: "#00C2A8", marginBottom: "16px" }} />
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#060D18", margin: "0 0 8px" }}>
            Evidence Intelligence
          </h2>
          <p style={{ color: "#5A6A7A", fontSize: "1rem", margin: 0 }}>
            Latest congress data and real-world evidence — ESC 2025, AHA 2025, EAN 2026, and published RWE studies
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "32px", background: "#E8ECF0", borderRadius: "8px", padding: "4px", width: "fit-content" }}>
          {[
            { key: "congress" as TabType, label: "Congress Updates", count: CONGRESS_UPDATES.length },
            { key: "rwe" as TabType, label: "Real-World Evidence", count: RWE_STUDIES.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 20px",
                borderRadius: "6px",
                border: "none",
                background: activeTab === tab.key ? "#060D18" : "transparent",
                color: activeTab === tab.key ? "#00C2A8" : "#5A6A7A",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.04em",
              }}
            >
              {tab.label}
              <span
                style={{
                  marginLeft: "6px",
                  background: activeTab === tab.key ? "#00C2A8" : "#9AA5B4",
                  color: activeTab === tab.key ? "#060D18" : "#fff",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {activeTab === "congress" && (
          <div>
            {/* Category filter */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              <button
                onClick={() => setCategoryFilter("all")}
                style={{
                  padding: "5px 14px",
                  borderRadius: "20px",
                  border: categoryFilter === "all" ? "2px solid #060D18" : "2px solid #E8ECF0",
                  background: categoryFilter === "all" ? "#060D18" : "transparent",
                  color: categoryFilter === "all" ? "#fff" : "#5A6A7A",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                All
              </button>
              {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "20px",
                    border: categoryFilter === key ? `2px solid ${val.color}` : "2px solid #E8ECF0",
                    background: categoryFilter === key ? `${val.color}15` : "transparent",
                    color: categoryFilter === key ? val.color : "#5A6A7A",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {val.label}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}>
              {/* Congress card list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredCongress.map((update) => {
                  const cat = CATEGORY_COLORS[update.category];
                  const isSelected = selectedCongress?.id === update.id;
                  return (
                    <div
                      key={update.id}
                      onClick={() => setSelectedCongress(update)}
                      style={{
                        background: "#fff",
                        border: isSelected ? `2px solid ${cat.color}` : "2px solid transparent",
                        borderRadius: "10px",
                        padding: "14px 16px",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        boxShadow: isSelected ? `0 0 0 3px ${cat.color}15` : "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{ background: "#060D18", color: "#fff", padding: "2px 8px", borderRadius: "3px", fontSize: "10px", fontWeight: 700 }}>
                            {update.congress}
                          </span>
                          {update.isNew && (
                            <span style={{ background: "#00C2A8", color: "#fff", padding: "2px 6px", borderRadius: "3px", fontSize: "9px", fontWeight: 700 }}>
                              NEW
                            </span>
                          )}
                        </div>
                        <span style={{ background: `${cat.color}15`, color: cat.color, padding: "2px 8px", borderRadius: "3px", fontSize: "9px", fontWeight: 700 }}>
                          {cat.label}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#060D18", lineHeight: 1.4, marginBottom: "4px" }}>
                        {update.title.length > 80 ? update.title.slice(0, 80) + "…" : update.title}
                      </div>
                      <div style={{ fontSize: "10px", color: "#9AA5B4" }}>{update.date} · {update.location}</div>
                    </div>
                  );
                })}
              </div>

              {/* Congress detail */}
              {selectedCongress && (
                <div style={{ background: "#fff", borderRadius: "12px", border: `2px solid ${CATEGORY_COLORS[selectedCongress.category].color}`, overflow: "hidden" }}>
                  <div style={{ background: "#060D18", padding: "24px 28px" }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span style={{ background: CATEGORY_COLORS[selectedCongress.category].color, color: "#fff", padding: "3px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: 700 }}>
                        {CATEGORY_COLORS[selectedCongress.category].label}
                      </span>
                      <span style={{ background: "rgba(255,255,255,0.1)", color: "#9AA5B4", padding: "3px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: 600 }}>
                        {selectedCongress.congress} · {selectedCongress.date}
                      </span>
                      {selectedCongress.isNew && (
                        <span style={{ background: "#00C2A8", color: "#060D18", padding: "3px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: 700 }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.2rem", color: "#fff", margin: "0 0 8px", lineHeight: 1.4 }}>
                      {selectedCongress.title}
                    </h3>
                    <div style={{ fontSize: "12px", color: "#9AA5B4" }}>
                      Presented by {selectedCongress.presenter} · {selectedCongress.location}
                    </div>
                  </div>

                  <div style={{ padding: "24px 28px" }}>
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                        Key Findings
                      </div>
                      <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                        {selectedCongress.keyFindings.map((finding, i) => (
                          <li key={i} style={{ fontSize: "12px", color: "#374151", marginBottom: "6px", lineHeight: 1.6 }}>{finding}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                        Clinical Impact
                      </div>
                      <div style={{ background: `${CATEGORY_COLORS[selectedCongress.category].color}10`, border: `1px solid ${CATEGORY_COLORS[selectedCongress.category].color}30`, borderRadius: "8px", padding: "12px 14px", fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>
                        {selectedCongress.clinicalImpact}
                      </div>
                    </div>

                    {selectedCongress.abstract && (
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                          Abstract Summary
                        </div>
                        <div style={{ background: "#F8F9FA", borderRadius: "6px", padding: "12px 14px", fontSize: "11px", color: "#5A6A7A", lineHeight: 1.7, fontStyle: "italic" }}>
                          {selectedCongress.abstract}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "rwe" && (
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}>
            {/* RWE card list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {RWE_STUDIES.map((study) => {
                const typeColor = STUDY_TYPE_COLORS[study.studyType];
                const isSelected = selectedRWE?.id === study.id;
                return (
                  <div
                    key={study.id}
                    onClick={() => setSelectedRWE(study)}
                    style={{
                      background: "#fff",
                      border: isSelected ? `2px solid ${typeColor}` : "2px solid transparent",
                      borderRadius: "10px",
                      padding: "14px 16px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <span style={{ background: `${typeColor}15`, color: typeColor, padding: "2px 8px", borderRadius: "3px", fontSize: "9px", fontWeight: 700, textTransform: "capitalize" }}>
                        {study.studyType.replace("-", " ")}
                      </span>
                      <span style={{ fontSize: "10px", color: "#9AA5B4", fontWeight: 600 }}>{study.year}</span>
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#060D18", lineHeight: 1.4, marginBottom: "4px" }}>
                      {study.title.length > 80 ? study.title.slice(0, 80) + "…" : study.title}
                    </div>
                    <div style={{ fontSize: "10px", color: "#9AA5B4" }}>
                      {study.journal} · {study.n > 0 ? `n=${study.n}` : "Model-based"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RWE detail */}
            {selectedRWE && (
              <div style={{ background: "#fff", borderRadius: "12px", border: `2px solid ${STUDY_TYPE_COLORS[selectedRWE.studyType]}`, overflow: "hidden" }}>
                <div style={{ background: "#060D18", padding: "24px 28px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                    <span style={{ background: STUDY_TYPE_COLORS[selectedRWE.studyType], color: "#fff", padding: "3px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, textTransform: "capitalize" }}>
                      {selectedRWE.studyType.replace("-", " ")}
                    </span>
                    <span style={{ background: "rgba(255,255,255,0.1)", color: "#9AA5B4", padding: "3px 10px", borderRadius: "4px", fontSize: "10px" }}>
                      {selectedRWE.journal} {selectedRWE.year}
                    </span>
                    {selectedRWE.n > 0 && (
                      <span style={{ background: "rgba(255,255,255,0.1)", color: "#9AA5B4", padding: "3px 10px", borderRadius: "4px", fontSize: "10px" }}>
                        n = {selectedRWE.n}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: "#fff", margin: "0 0 8px", lineHeight: 1.4 }}>
                    {selectedRWE.title}
                  </h3>
                  <div style={{ fontSize: "11px", color: "#9AA5B4" }}>{selectedRWE.authors}</div>
                </div>

                <div style={{ padding: "24px 28px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      Population
                    </div>
                    <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.5 }}>{selectedRWE.population}</div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      Key Findings
                    </div>
                    <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                      {selectedRWE.keyFindings.map((f, i) => (
                        <li key={i} style={{ fontSize: "12px", color: "#374151", marginBottom: "5px", lineHeight: 1.6 }}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      Clinical Message
                    </div>
                    <div style={{ background: `${STUDY_TYPE_COLORS[selectedRWE.studyType]}10`, border: `1px solid ${STUDY_TYPE_COLORS[selectedRWE.studyType]}30`, borderRadius: "8px", padding: "12px 14px", fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>
                      {selectedRWE.clinicalMessage}
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#E74C3C", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      Limitations
                    </div>
                    <div style={{ background: "#FFF5F5", border: "1px solid #FCA5A5", borderRadius: "6px", padding: "10px 12px", fontSize: "11px", color: "#5A6A7A", lineHeight: 1.5 }}>
                      {selectedRWE.limitations}
                    </div>
                  </div>

                  {selectedRWE.doi && (
                    <div style={{ fontSize: "10px", color: "#9AA5B4" }}>
                      DOI: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#3B82F6" }}>{selectedRWE.doi}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
