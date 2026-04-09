/* CompetitiveSuiteSection.tsx
   Design: Clinical Precision / Swiss Medical Modernism
   Competitive Battle Cards + Label Comparison Tool */

import { useState } from "react";

type TabType = "battlecards" | "label-comparison";

interface BattleCard {
  id: string;
  competitor: string;
  genericName: string;
  company: string;
  mechanism: string;
  indications: string[];
  dosing: string;
  route: string;
  frequency: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
  amvuttraAdvantages: string[];
  keyData: string;
  rems: boolean;
  premedication: boolean;
  color: string;
}

interface LabelRow {
  attribute: string;
  amvuttra: string;
  tafamidis: string;
  patisiran: string;
  inotersen: string;
  eplontersen: string;
  highlight?: "amvuttra" | "all" | "none";
}

const BATTLE_CARDS: BattleCard[] = [
  {
    id: "tafamidis",
    competitor: "VYNDAMAX® / VYNDAQEL®",
    genericName: "tafamidis",
    company: "Pfizer",
    mechanism: "TTR tetramer stabiliser — prevents tetramer dissociation and monomer misfolding",
    indications: ["ATTR-CM (wt and hATTR)"],
    dosing: "61 mg (VYNDAMAX) or 80 mg (VYNDAQEL 4×20mg)",
    route: "Oral (capsule)",
    frequency: "Once daily (365 doses/year)",
    keyStrengths: [
      "Oral administration — no injection required",
      "ATTR-ACT trial: 30% mortality reduction (HR 0.70)",
      "Long-term safety data (8+ years)",
      "Established formulary access in many markets",
    ],
    keyWeaknesses: [
      "Only approved for ATTR-CM — NOT hATTR-PN",
      "Daily oral dosing (365 doses/year vs. 4 for AMVUTTRA)",
      "Stabiliser mechanism — does not reduce TTR levels",
      "No mortality benefit in NYHA Class III patients",
      "Drug interactions via P-glycoprotein",
    ],
    amvuttraAdvantages: [
      "35% vs. 30% all-cause mortality reduction (HELIOS-B vs. ATTR-ACT)",
      "Dual indication: ATTR-CM AND hATTR-PN — tafamidis has no PN indication",
      "4 doses/year vs. 365 — 99% reduction in dosing burden",
      "Silences TTR production (~88% suppression) vs. stabilisation only",
      "HELIOS-B benefit maintained in NYHA Class III patients",
    ],
    keyData: "ATTR-ACT: HR 0.70 (all-cause mortality), HR 0.68 (CV composite) vs. HELIOS-B: HR 0.65 (all-cause mortality), HR 0.72 (CV composite)",
    rems: false,
    premedication: false,
    color: "#3B82F6",
  },
  {
    id: "patisiran",
    competitor: "ONPATTRO®",
    genericName: "patisiran",
    company: "Alnylam Pharmaceuticals",
    mechanism: "RNAi — siRNA targeting TTR mRNA, delivered via lipid nanoparticle (LNP)",
    indications: ["hATTR-PN (polyneuropathy only)"],
    dosing: "0.3 mg/kg IV",
    route: "Intravenous infusion (60-80 min)",
    frequency: "Every 3 weeks (17 doses/year)",
    keyStrengths: [
      "APOLLO trial: NIS+7 +0.1 vs. +34.0 (P<0.001)",
      "First approved RNAi therapy for hATTR-PN",
      "Extensive long-term safety data (5+ years)",
      "Strong neuropathy stabilisation data",
    ],
    keyWeaknesses: [
      "NOT approved for ATTR-CM",
      "IV infusion required — hospital/clinic visit every 3 weeks",
      "Premedication required (corticosteroids, antihistamines, paracetamol)",
      "Infusion-related reactions in 19% of patients",
      "LNP delivery system — more complex manufacturing",
    ],
    amvuttraAdvantages: [
      "SC injection vs. IV infusion — no hospital visit required",
      "Q3M vs. Q3W — 4 doses/year vs. 17",
      "No premedication required",
      "Dual indication: ATTR-CM AND hATTR-PN — patisiran has no CM indication",
      "No infusion-related reactions (SC route)",
      "GalNAc platform: more targeted delivery, lower dose (25mg vs. 0.3mg/kg)",
    ],
    keyData: "HELIOS-A vs. APOLLO: NIS+7 +0.1 (vutrisiran) vs. +0.1 (patisiran) — comparable neuropathy efficacy with superior convenience",
    rems: false,
    premedication: true,
    color: "#8E44AD",
  },
  {
    id: "inotersen",
    competitor: "TEGSEDI®",
    genericName: "inotersen",
    company: "Ionis / AstraZeneca",
    mechanism: "Antisense oligonucleotide (ASO) — binds TTR mRNA and promotes degradation",
    indications: ["hATTR-PN (polyneuropathy only)"],
    dosing: "284 mg SC",
    route: "Subcutaneous injection",
    frequency: "Once weekly (52 doses/year)",
    keyStrengths: [
      "SC injection — patient self-administration possible",
      "NEURO-TTR trial: NIS+7 −19.7 vs. placebo (P<0.001)",
      "Approved for hATTR-PN",
    ],
    keyWeaknesses: [
      "NOT approved for ATTR-CM",
      "Weekly dosing (52 doses/year vs. 4 for AMVUTTRA)",
      "REMS programme required — thrombocytopenia and glomerulonephritis risk",
      "Platelet monitoring required every 2 weeks",
      "Glomerulonephritis: 3% incidence (can be fatal)",
      "Thrombocytopenia: 3% incidence (can be fatal)",
      "Contraindicated in patients with platelet count < 100,000/μL",
    ],
    amvuttraAdvantages: [
      "4 doses/year vs. 52 — 92% reduction in dosing burden",
      "No REMS programme",
      "No thrombocytopenia or glomerulonephritis risk",
      "No platelet monitoring required",
      "Dual indication: ATTR-CM AND hATTR-PN",
      "Superior safety profile — no black box warning",
    ],
    keyData: "NEURO-TTR: NIS+7 −19.7 (inotersen) vs. HELIOS-A: NIS+7 +0.1 (vutrisiran) — both show benefit vs. placebo; vutrisiran has superior safety profile",
    rems: true,
    premedication: false,
    color: "#E74C3C",
  },
  {
    id: "eplontersen",
    competitor: "WAINUA®",
    genericName: "eplontersen",
    company: "Ionis / AstraZeneca",
    mechanism: "Ligand-conjugated antisense oligonucleotide (LICA-ASO) — GalNAc-conjugated ASO targeting TTR mRNA",
    indications: ["hATTR-PN (polyneuropathy only)"],
    dosing: "45 mg SC",
    route: "Subcutaneous injection (auto-injector)",
    frequency: "Once monthly (12 doses/year)",
    keyStrengths: [
      "SC auto-injector — patient self-administration",
      "NEURO-TTRansform trial: NIS+7 −9.7 vs. +17.6 (P<0.001)",
      "Monthly dosing — more convenient than weekly inotersen",
      "GalNAc conjugation — similar platform concept to vutrisiran",
    ],
    keyWeaknesses: [
      "NOT approved for ATTR-CM",
      "Monthly dosing (12 doses/year vs. 4 for AMVUTTRA)",
      "Platelet monitoring still required (ASO class effect)",
      "No mortality data in ATTR-CM",
      "Limited long-term data vs. AMVUTTRA",
    ],
    amvuttraAdvantages: [
      "Q3M vs. monthly — 4 doses/year vs. 12",
      "Dual indication: ATTR-CM AND hATTR-PN — eplontersen has no CM indication",
      "Proven mortality benefit (HELIOS-B) — eplontersen has no mortality data",
      "No platelet monitoring required",
      "Longer clinical experience with GalNAc-siRNA platform",
    ],
    keyData: "NEURO-TTRansform: NIS+7 −9.7 (eplontersen) vs. HELIOS-A: NIS+7 +0.1 (vutrisiran) — both show benefit; vutrisiran has CM indication and mortality data",
    rems: false,
    premedication: false,
    color: "#F0A500",
  },
  {
    id: "diflunisal",
    competitor: "Diflunisal (off-label)",
    genericName: "diflunisal",
    company: "Generic",
    mechanism: "NSAID with TTR stabilising properties — off-label use in hATTR-PN",
    indications: ["hATTR-PN (off-label, not FDA approved for ATTR)"],
    dosing: "250 mg BD",
    route: "Oral",
    frequency: "Twice daily (730 doses/year)",
    keyStrengths: [
      "Oral administration",
      "Low cost — generic availability",
      "Some evidence for neuropathy stabilisation (Berk et al. 2013)",
    ],
    keyWeaknesses: [
      "NOT FDA/EMA approved for ATTR — off-label use only",
      "NSAID side effects: GI, renal, cardiovascular",
      "Contraindicated in renal impairment (common in ATTR-CM)",
      "No cardiac indication",
      "Twice daily dosing (730 doses/year)",
      "No mortality data",
    ],
    amvuttraAdvantages: [
      "FDA + EMA approved vs. off-label only",
      "4 doses/year vs. 730",
      "No NSAID-related toxicity",
      "Dual indication with proven mortality benefit",
      "Superior efficacy data (RCT vs. small observational study)",
    ],
    keyData: "Berk et al. NEJM 2013 (diflunisal, n=130) vs. HELIOS-B (vutrisiran, n=655) — no comparison possible; AMVUTTRA has vastly superior evidence base",
    rems: false,
    premedication: false,
    color: "#6B7280",
  },
];

const LABEL_ROWS: LabelRow[] = [
  { attribute: "Generic Name", amvuttra: "vutrisiran", tafamidis: "tafamidis", patisiran: "patisiran", inotersen: "inotersen", eplontersen: "eplontersen", highlight: "none" },
  { attribute: "Brand Name", amvuttra: "AMVUTTRA®", tafamidis: "VYNDAMAX® / VYNDAQEL®", patisiran: "ONPATTRO®", inotersen: "TEGSEDI®", eplontersen: "WAINUA®", highlight: "none" },
  { attribute: "Mechanism", amvuttra: "GalNAc-siRNA (RNAi)", tafamidis: "TTR Stabiliser", patisiran: "LNP-siRNA (RNAi)", inotersen: "ASO", eplontersen: "GalNAc-ASO (LICA)", highlight: "none" },
  { attribute: "ATTR-CM Indication", amvuttra: "✓ FDA + EMA", tafamidis: "✓ FDA + EMA", patisiran: "✗ Not approved", inotersen: "✗ Not approved", eplontersen: "✗ Not approved", highlight: "amvuttra" },
  { attribute: "hATTR-PN Indication", amvuttra: "✓ FDA + EMA", tafamidis: "✗ Not approved", patisiran: "✓ FDA + EMA", inotersen: "✓ FDA + EMA", eplontersen: "✓ FDA + EMA", highlight: "none" },
  { attribute: "Dual Indication", amvuttra: "✓ UNIQUE", tafamidis: "✗", patisiran: "✗", inotersen: "✗", eplontersen: "✗", highlight: "amvuttra" },
  { attribute: "Route", amvuttra: "SC injection", tafamidis: "Oral capsule", patisiran: "IV infusion", inotersen: "SC injection", eplontersen: "SC auto-injector", highlight: "none" },
  { attribute: "Dose Frequency", amvuttra: "Q3M (4/year)", tafamidis: "Daily (365/year)", patisiran: "Q3W (17/year)", inotersen: "Weekly (52/year)", eplontersen: "Monthly (12/year)", highlight: "amvuttra" },
  { attribute: "Premedication", amvuttra: "None required", tafamidis: "None required", patisiran: "Required (steroids + antihistamines)", inotersen: "None required", eplontersen: "None required", highlight: "none" },
  { attribute: "REMS Programme", amvuttra: "None", tafamidis: "None", patisiran: "None", inotersen: "Required", eplontersen: "None", highlight: "none" },
  { attribute: "TTR Reduction", amvuttra: "~88% (serum)", tafamidis: "Stabilises (no reduction)", patisiran: "~80% (serum)", inotersen: "~74% (serum)", eplontersen: "~82% (serum)", highlight: "amvuttra" },
  { attribute: "All-Cause Mortality", amvuttra: "HR 0.65 (HELIOS-B)", tafamidis: "HR 0.70 (ATTR-ACT)", patisiran: "Not primary endpoint", inotersen: "Not studied in CM", eplontersen: "Not studied in CM", highlight: "amvuttra" },
  { attribute: "CV Composite", amvuttra: "HR 0.72 (HELIOS-B)", tafamidis: "HR 0.68 (ATTR-ACT)", patisiran: "Not approved for CM", inotersen: "Not approved for CM", eplontersen: "Not approved for CM", highlight: "none" },
  { attribute: "NIS+7 Change", amvuttra: "+0.1 (HELIOS-A)", tafamidis: "Not studied in PN", patisiran: "+0.1 (APOLLO)", inotersen: "−19.7 (NEURO-TTR)", eplontersen: "−9.7 (NEURO-TTRansform)", highlight: "none" },
  { attribute: "Renal Dose Adjustment", amvuttra: "None required", tafamidis: "None required", patisiran: "None required", inotersen: "Contraindicated in severe RI", eplontersen: "Monitor in RI", highlight: "none" },
  { attribute: "Hepatic Dose Adjustment", amvuttra: "None (mild-mod)", tafamidis: "None", patisiran: "None", inotersen: "None", eplontersen: "None", highlight: "none" },
  { attribute: "Pregnancy", amvuttra: "Contraindicated", tafamidis: "Contraindicated", patisiran: "Contraindicated", inotersen: "Contraindicated", eplontersen: "Contraindicated", highlight: "none" },
  { attribute: "Vitamin A Monitoring", amvuttra: "Required (RDA supplement)", tafamidis: "Not required", patisiran: "Required (RDA supplement)", inotersen: "Not required", eplontersen: "Not required", highlight: "none" },
  { attribute: "Platelet Monitoring", amvuttra: "Not required", tafamidis: "Not required", patisiran: "Not required", inotersen: "Every 2 weeks", eplontersen: "Recommended", highlight: "amvuttra" },
  { attribute: "Black Box Warning", amvuttra: "Fetal harm only", tafamidis: "None", patisiran: "None", inotersen: "Thrombocytopenia + Glomerulonephritis", eplontersen: "None", highlight: "none" },
  { attribute: "FDA Approval Date (CM)", amvuttra: "March 2025", tafamidis: "May 2019", patisiran: "N/A", inotersen: "N/A", eplontersen: "N/A", highlight: "none" },
  { attribute: "FDA Approval Date (PN)", amvuttra: "June 2022", tafamidis: "N/A", patisiran: "August 2018", inotersen: "October 2018", eplontersen: "December 2023", highlight: "none" },
];

export default function CompetitiveSuiteSection() {
  const [activeTab, setActiveTab] = useState<TabType>("label-comparison");
  const [selectedCard, setSelectedCard] = useState<BattleCard>(BATTLE_CARDS[0]);
  const [highlightAmvuttra, setHighlightAmvuttra] = useState(true);

  return (
    <section
      id="competitive-suite"
      style={{
        background: "#fff",
        padding: "80px 0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ width: "48px", height: "3px", background: "#00C2A8", marginBottom: "16px" }} />
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#060D18", margin: "0 0 8px" }}>
            Competitive Intelligence Landscape
          </h2>
          <p style={{ color: "#5A6A7A", fontSize: "1rem", margin: 0 }}>
            Battle cards and label comparison for tafamidis, patisiran, inotersen, and eplontersen
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "32px", background: "#E8ECF0", borderRadius: "8px", padding: "4px", width: "fit-content" }}>
          {[
            { key: "label-comparison" as TabType, label: "Label Comparison" },
            { key: "battlecards" as TabType, label: "Battle Cards" },
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
            </button>
          ))}
        </div>

        {activeTab === "battlecards" && (
          <div>
            {/* Competitor selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
              {BATTLE_CARDS.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: selectedCard.id === card.id ? `2px solid ${card.color}` : "2px solid #E8ECF0",
                    background: selectedCard.id === card.id ? `${card.color}10` : "transparent",
                    color: selectedCard.id === card.id ? card.color : "#5A6A7A",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {card.competitor.split("®")[0]}
                </button>
              ))}
            </div>

            {/* Battle Card */}
            <div style={{ background: "#F8F9FA", borderRadius: "16px", border: `2px solid ${selectedCard.color}`, overflow: "hidden" }}>
              {/* Card Header */}
              <div style={{ background: "#060D18", padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", alignItems: "start" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#00C2A8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                    Competitive Battle Card
                  </div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.6rem", color: "#fff", margin: "0 0 4px" }}>
                    {selectedCard.competitor}
                  </h3>
                  <div style={{ fontSize: "12px", color: "#9AA5B4", marginBottom: "8px" }}>
                    {selectedCard.genericName} · {selectedCard.company}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9AA5B4", lineHeight: 1.5 }}>{selectedCard.mechanism}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                  <div style={{ background: `${selectedCard.color}20`, border: `1px solid ${selectedCard.color}`, borderRadius: "8px", padding: "12px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#9AA5B4", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Dosing</div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: selectedCard.color }}>{selectedCard.frequency}</div>
                    <div style={{ fontSize: "10px", color: "#9AA5B4" }}>{selectedCard.route}</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {selectedCard.rems && (
                      <span style={{ background: "#E74C3C", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: 700 }}>REMS</span>
                    )}
                    {selectedCard.premedication && (
                      <span style={{ background: "#F0A500", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: 700 }}>PREMED</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                {/* Strengths */}
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#27AE60", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>✓</span> Their Strengths
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                    {selectedCard.keyStrengths.map((s, i) => (
                      <li key={i} style={{ fontSize: "11px", color: "#374151", marginBottom: "6px", lineHeight: 1.5 }}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#E74C3C", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>✗</span> Their Weaknesses
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                    {selectedCard.keyWeaknesses.map((w, i) => (
                      <li key={i} style={{ fontSize: "11px", color: "#374151", marginBottom: "6px", lineHeight: 1.5 }}>{w}</li>
                    ))}
                  </ul>
                </div>

                {/* AMVUTTRA Advantages */}
                <div style={{ background: "#060D18", borderRadius: "10px", padding: "16px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#00C2A8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                    AMVUTTRA Advantages
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                    {selectedCard.amvuttraAdvantages.map((a, i) => (
                      <li key={i} style={{ fontSize: "11px", color: "#E2E8F0", marginBottom: "6px", lineHeight: 1.5 }}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Data */}
              <div style={{ padding: "0 32px 28px" }}>
                <div style={{ background: `${selectedCard.color}10`, border: `1px solid ${selectedCard.color}30`, borderRadius: "8px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: selectedCard.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                    Key Data Comparison
                  </div>
                  <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>{selectedCard.keyData}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "label-comparison" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <p style={{ color: "#5A6A7A", fontSize: "12px", margin: 0 }}>
                Side-by-side prescribing information comparison across all approved ATTR therapies
              </p>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#5A6A7A", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={highlightAmvuttra}
                  onChange={(e) => setHighlightAmvuttra(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                Highlight AMVUTTRA advantages
              </label>
            </div>

            <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #E8ECF0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                <thead>
                  <tr style={{ background: "#060D18" }}>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#9AA5B4", width: "180px", position: "sticky", left: 0, background: "#060D18" }}>
                      Attribute
                    </th>
                    {[
                      { name: "AMVUTTRA®", color: "#00C2A8" },
                      { name: "VYNDAMAX®", color: "#3B82F6" },
                      { name: "ONPATTRO®", color: "#8E44AD" },
                      { name: "TEGSEDI®", color: "#E74C3C" },
                      { name: "WAINUA®", color: "#F0A500" },
                    ].map((col) => (
                      <th
                        key={col.name}
                        style={{
                          padding: "14px 16px",
                          textAlign: "center",
                          fontSize: "12px",
                          fontWeight: 800,
                          color: col.color,
                          borderLeft: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LABEL_ROWS.map((row, i) => {
                    const isHighlighted = highlightAmvuttra && row.highlight === "amvuttra";
                    return (
                      <tr
                        key={row.attribute}
                        style={{
                          background: isHighlighted
                            ? "#00C2A808"
                            : i % 2 === 0
                            ? "#fff"
                            : "#F8F9FA",
                          borderBottom: "1px solid #E8ECF0",
                        }}
                      >
                        <td
                          style={{
                            padding: "10px 16px",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#5A6A7A",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            position: "sticky",
                            left: 0,
                            background: isHighlighted ? "#00C2A808" : i % 2 === 0 ? "#fff" : "#F8F9FA",
                            borderRight: "1px solid #E8ECF0",
                          }}
                        >
                          {row.attribute}
                        </td>
                        {[row.amvuttra, row.tafamidis, row.patisiran, row.inotersen, row.eplontersen].map((val, colIdx) => {
                          const isAmvuttra = colIdx === 0;
                          const hasCheckmark = val.startsWith("✓");
                          const hasCross = val.startsWith("✗");
                          return (
                            <td
                              key={colIdx}
                              style={{
                                padding: "10px 16px",
                                fontSize: "11px",
                                color: hasCheckmark
                                  ? "#27AE60"
                                  : hasCross
                                  ? "#E74C3C"
                                  : isAmvuttra && isHighlighted
                                  ? "#00C2A8"
                                  : "#374151",
                                fontWeight: (hasCheckmark || hasCross || (isAmvuttra && isHighlighted)) ? 700 : 400,
                                textAlign: "center",
                                borderLeft: "1px solid #E8ECF0",
                                background: isAmvuttra && isHighlighted ? "#00C2A815" : "transparent",
                              }}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "10px", color: "#9AA5B4", marginTop: "12px" }}>
              * Based on FDA prescribing information as of April 2026. For the most current information, refer to the full prescribing information for each product.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
