/* DiagnosticAlgorithmSection.tsx
   Design: Clinical Precision / Swiss Medical Modernism
   Interactive 8-step ATTR diagnostic algorithm
   Based on: ACC 2023 ECDP, AHA Expert Consensus (Maurer et al. 2019),
   Asia Guidelines (Lin et al. 2022)
   Sections: Red Flags → Workup → Monoclonal Exclusion → PYP Scan →
             Biopsy → Genetic Testing → Staging → Treatment Decision */

import { useState } from "react";

const DARK   = "#060D18";
const TEAL   = "#00C2A8";
const GREEN  = "#10B981";
const BLUE   = "#3B82F6";
const PURPLE = "#8B5CF6";
const AMBER  = "#F59E0B";
const RED    = "#EF4444";
const INDIGO = "#6366F1";

type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Step {
  id: StepId;
  label: string;
  shortLabel: string;
  color: string;
  icon: string;
  tag: string;
  indications: string[];
}

const STEPS: Step[] = [
  { id: 1, label: "Clinical Suspicion & Red Flags",   shortLabel: "Red Flags",   color: RED,    icon: "🚩", tag: "Step 1", indications: ["ATTR-CM", "hATTR-PN"] },
  { id: 2, label: "Initial Workup",                   shortLabel: "Workup",      color: AMBER,  icon: "🔬", tag: "Step 2", indications: ["ATTR-CM", "hATTR-PN"] },
  { id: 3, label: "Monoclonal Protein Exclusion",     shortLabel: "M-Protein",   color: PURPLE, icon: "🧫", tag: "Step 3", indications: ["ATTR-CM", "hATTR-PN"] },
  { id: 4, label: "Nuclear Scintigraphy (PYP/DPD)",   shortLabel: "PYP Scan",    color: BLUE,   icon: "☢️", tag: "Step 4", indications: ["ATTR-CM"] },
  { id: 5, label: "Biopsy (if required)",             shortLabel: "Biopsy",      color: INDIGO, icon: "🩺", tag: "Step 5", indications: ["ATTR-CM", "hATTR-PN"] },
  { id: 6, label: "Genetic Testing (TTR Genotyping)", shortLabel: "Genetics",    color: GREEN,  icon: "🧬", tag: "Step 6", indications: ["ATTR-CM", "hATTR-PN"] },
  { id: 7, label: "Disease Staging",                  shortLabel: "Staging",     color: TEAL,   icon: "📊", tag: "Step 7", indications: ["ATTR-CM", "hATTR-PN"] },
  { id: 8, label: "Treatment Decision",               shortLabel: "Treatment",   color: "#E11D48", icon: "💊", tag: "Step 8", indications: ["ATTR-CM", "hATTR-PN"] },
];

// ── Step → Practice Case mapping ────────────────────────────────────────────
const STEP_PRACTICE_CASES: Record<StepId, { caseId: string; caseNum: string; title: string; context: string }> = {
  1: { caseId: "case-1", caseNum: "Case 1", title: "The Missed Diagnosis",          context: "Classic ATTR-CM red flag cluster: HFpEF + LVH + low-voltage ECG + bilateral CTS" },
  2: { caseId: "case-5", caseNum: "Case 5", title: "The Renal Comorbidity",         context: "Workup in a complex ATTR-CM patient with CKD Stage 3" },
  3: { caseId: "case-1", caseNum: "Case 1", title: "The Missed Diagnosis",          context: "M-protein exclusion as the critical gate before non-invasive PYP diagnosis" },
  4: { caseId: "case-3", caseNum: "Case 3", title: "The Upgrade Decision",          context: "PYP-confirmed wt-ATTR-CM — interpreting Perugini Grade 3 and H/CL ratio" },
  5: { caseId: "case-6", caseNum: "Case 6", title: "The Post-Transplant Question",  context: "Biopsy required when M-protein is present alongside a positive PYP scan" },
  6: { caseId: "case-4", caseNum: "Case 4", title: "The Pre-Symptomatic Decision",  context: "TTR genotyping in an asymptomatic V30M carrier — to treat or not to treat" },
  7: { caseId: "case-5", caseNum: "Case 5", title: "The Renal Comorbidity",         context: "NAC staging with CKD comorbidity — impact on NT-proBNP and eGFR thresholds" },
  8: { caseId: "case-2", caseNum: "Case 2", title: "The Switch Decision",           context: "Treatment selection in progressing hATTR-PN — patisiran vs AMVUTTRA" },
};

type Pathway = "both" | "attr-cm" | "hattr-pn";

function getStepContent(pathway: Pathway): Record<StepId, React.ReactNode> {
  const showCM = pathway === "both" || pathway === "attr-cm";
  const showPN = pathway === "both" || pathway === "hattr-pn";
  return {
  1: (
    <div>
      {/* Dual-indication pathway banner */}
      <div style={{ display: "grid", gridTemplateColumns: showCM && showPN ? "1fr 1fr" : "1fr", gap: "10px", marginBottom: "20px" }}>
        {showCM && <div style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🫀</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#1D4ED8", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>ATTR-CM Pathway</div>
            <div style={{ fontSize: "11px", color: "#374151" }}>Cardiac-dominant presentation · Elderly · HFpEF</div>
          </div>
        </div>}
        {showPN && <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🦶</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#15803D", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>hATTR-PN Pathway</div>
            <div style={{ fontSize: "11px", color: "#374151" }}>Neurological-dominant · Hereditary · Any age</div>
          </div>
        </div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: showCM && showPN ? "1fr 1fr" : "1fr", gap: "20px" }}>
      {showCM && <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          🫀 Cardiac Red Flags <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", marginLeft: "6px" }}>ATTR-CM</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
          {[
            { flag: "HFpEF in elderly patient (>60y)", urgency: "high" },
            { flag: "LV wall thickening ≥12mm without hypertension or AS", urgency: "high" },
            { flag: "Low ECG voltage despite increased wall thickness (voltage-to-mass mismatch)", urgency: "high" },
            { flag: "Apical sparing pattern on strain echocardiography", urgency: "high" },
            { flag: "Restrictive cardiomyopathy pattern", urgency: "high" },
            { flag: "Intolerance to low-dose beta-blockers or ACE inhibitors", urgency: "medium" },
            { flag: "Aortic stenosis in elderly (TAVI population — 13-16% ATTR prevalence)", urgency: "medium" },
            { flag: "Atrial fibrillation with HFpEF", urgency: "medium" },
            { flag: "AV block or bundle branch block without clear cause", urgency: "medium" },
            { flag: "Pseudo-infarct pattern on ECG (Q waves without MI history)", urgency: "medium" },
          ].map((f) => (
            <div key={f.flag} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "7px 10px", background: f.urgency === "high" ? "#FEF2F2" : "#FFF8E1", borderRadius: "7px", borderLeft: `3px solid ${f.urgency === "high" ? RED : AMBER}` }}>
              <span style={{ fontSize: "10px", color: f.urgency === "high" ? RED : AMBER, fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>▲</span>
              <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{f.flag}</span>
            </div>
          ))}
        </div>
      </div>}
      {showPN && <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          🦶 Neurological & Extracardiac Red Flags <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", marginLeft: "6px" }}>hATTR-PN</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px", marginBottom: "16px" }}>
          {[
            { flag: "Progressive sensorimotor polyneuropathy — length-dependent, small fibre first", urgency: "high", ind: "hATTR-PN" },
            { flag: "Bilateral carpal tunnel syndrome (especially requiring surgery)", urgency: "high", ind: "both" },
            { flag: "Family history of ATTR amyloidosis, unexplained neuropathy, or cardiomyopathy", urgency: "high", ind: "both" },
            { flag: "Autonomic dysfunction: orthostatic hypotension, GI dysmotility, erectile dysfunction", urgency: "high", ind: "hATTR-PN" },
            { flag: "Bilateral peripheral neuropathy unresponsive to CIDP/MGUS treatment", urgency: "high", ind: "hATTR-PN" },
            { flag: "Lumbar spinal stenosis or rotator cuff tear", urgency: "medium", ind: "both" },
            { flag: "Unexplained weight loss (>10% over 6 months)", urgency: "medium", ind: "hATTR-PN" },
            { flag: "Vitreous opacities or glaucoma", urgency: "medium", ind: "hATTR-PN" },
            { flag: "Renal insufficiency or proteinuria without clear cause", urgency: "medium", ind: "both" },
            { flag: "Leptomeningeal amyloidosis: seizures, dementia, ataxia (rare, CNS hATTR)", urgency: "medium", ind: "hATTR-PN" },
          ].map((f) => (
            <div key={f.flag} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "7px 10px", background: f.urgency === "high" ? "#FEF2F2" : "#FFF8E1", borderRadius: "7px", borderLeft: `3px solid ${f.urgency === "high" ? RED : AMBER}` }}>
              <span style={{ fontSize: "10px", color: f.urgency === "high" ? RED : AMBER, fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>▲</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{f.flag}</span>
                {f.ind && f.ind !== "both" && (
                  <span style={{ marginLeft: "6px", fontSize: "8.5px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px",
                    background: f.ind === "hATTR-PN" ? "#F0FDF4" : "#EFF6FF",
                    color: f.ind === "hATTR-PN" ? "#15803D" : "#1D4ED8",
                    border: `1px solid ${f.ind === "hATTR-PN" ? "#BBF7D0" : "#BFDBFE"}`,
                  }}>{f.ind}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#FEF2F2", borderRadius: "10px", padding: "14px 16px", border: "1px solid #FECACA" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: RED, marginBottom: "6px" }}>⚠️ Clinical Pearl</div>
          <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
            Bilateral carpal tunnel syndrome precedes cardiac diagnosis by <strong>5–10 years</strong> in many hATTR patients. Carpal tunnel surgery specimens can be sent for Congo red staining — a missed opportunity to diagnose ATTR years earlier.
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "#F0FDF4", borderRadius: "10px", padding: "14px 16px", border: "1px solid #BBF7D0" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: GREEN, marginBottom: "6px" }}>✅ Action Trigger</div>
          <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
            Any combination of cardiac + extracardiac red flags, or a single high-urgency red flag, should prompt immediate referral for diagnostic workup. <strong>Do not wait for all red flags to be present.</strong>
          </div>
         </div>
      </div>}
      </div>
    </div>
  ),
  2: (
    <div>
    {showCM && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
      {[
        {
          title: "Biomarkers",
          icon: "🩸",
          color: AMBER,
          items: [
            { test: "NT-proBNP or BNP", finding: "Elevated — often disproportionately high relative to LV function" },
            { test: "High-sensitivity troponin T/I", finding: "Elevated — reflects ongoing myocardial injury" },
            { test: "eGFR", finding: "Baseline renal function; used for NAC staging" },
            { test: "CBC, LFTs, albumin", finding: "Baseline systemic assessment" },
          ],
        },
        {
          title: "ECG",
          icon: "📈",
          color: BLUE,
          items: [
            { test: "Low voltage (limb leads)", finding: "QRS amplitude <0.5mV in all limb leads — classic but not universal" },
            { test: "Pseudo-infarct pattern", finding: "Q waves without history of MI — common in ATTR-CM" },
            { test: "Conduction abnormalities", finding: "AV block, bundle branch block, fascicular block" },
            { test: "Atrial fibrillation / flutter", finding: "Common in advanced disease" },
          ],
        },
        {
          title: "Echocardiography",
          icon: "🫀",
          color: RED,
          items: [
            { test: "LV wall thickness", finding: "≥12mm (often ≥15mm in ATTR-CM); concentric pattern" },
            { test: "Granular sparkling texture", finding: "Bright, speckled myocardial appearance on 2D echo" },
            { test: "Diastolic dysfunction", finding: "Grade II–III restrictive filling pattern" },
            { test: "Apical sparing strain", finding: "Reduced basal/mid longitudinal strain with preserved apex — bull's-eye pattern; highly specific for cardiac amyloidosis" },
            { test: "Biatrial enlargement", finding: "Thickened interatrial septum; pericardial effusion" },
          ],
        },
        {
          title: "Cardiac MRI (CMR)",
          icon: "🧲",
          color: PURPLE,
          items: [
            { test: "Late gadolinium enhancement (LGE)", finding: "Diffuse subendocardial or transmural pattern; difficulty nulling myocardium" },
            { test: "Native T1 mapping", finding: "Elevated native T1 values — reflects amyloid infiltration" },
            { test: "Extracellular volume (ECV)", finding: "Elevated ECV fraction (>40%) — correlates with amyloid burden" },
          ],
        },
        {
          title: "Cardiac CT (optional)",
          icon: "🖥️",
          color: TEAL,
          items: [
            { test: "Myocardial ECV by CT", finding: "Alternative to CMR in patients with contraindications (pacemaker, claustrophobia)" },
            { test: "Coronary calcium scoring", finding: "Low coronary calcium despite significant LV hypertrophy — supports amyloid diagnosis" },
          ],
        },
        {
          title: "Clinical Pearl",
          icon: "💡",
          color: GREEN,
          items: [
            { test: "Voltage-to-mass mismatch", finding: "Low ECG voltage + thick LV walls on echo = classic ATTR-CM pattern. Opposite of hypertensive heart disease." },
            { test: "Apical sparing", finding: "Bull's-eye strain pattern: reduced basal/mid strain with preserved apical strain. Highly specific for cardiac amyloidosis over HCM or HHD." },
          ],
        },
      ].map((card) => (
        <div key={card.title} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ background: `${card.color}10`, padding: "10px 14px", borderBottom: `2px solid ${card.color}30`, display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>{card.icon}</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: card.color, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{card.title}</span>
          </div>
          <div style={{ padding: "12px 14px" }}>
            {card.items.map((item) => (
              <div key={item.test} style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #F3F4F6" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "2px" }}>{item.test}</div>
                <div style={{ fontSize: "10px", color: "#5A6A7A", lineHeight: 1.4 }}>{item.finding}</div>
              </div>
            ))}
          </div>
         </div>
      ))}
    </div>}
    {/* hATTR-PN Specific Workup */}
    {showPN && <div style={{ marginTop: "20px", background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: "12px", padding: "16px 20px" }}>
      <div style={{ fontSize: "11px", fontWeight: 800, color: "#15803D", textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>🦶</span> hATTR-PN Additional Workup
        <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}>hATTR-PN</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        {[
          { title: "NCS / EMG", icon: "⚡", items: [
            { test: "Nerve Conduction Studies", finding: "Reduced SNAP amplitudes (sural, radial); axonal > demyelinating pattern" },
            { test: "EMG", finding: "Denervation in distal muscles; confirms axonal neuropathy" },
            { test: "Small fibre assessment", finding: "Reduced IENFD on skin punch biopsy; quantitative sensory testing (QST)" },
          ]},
          { title: "Autonomic Testing", icon: "🔄", items: [
            { test: "Tilt-table test", finding: "Orthostatic hypotension: ≥20 mmHg systolic drop within 3 min of standing" },
            { test: "QSART / Sudomotor", finding: "Reduced sweat output — reflects postganglionic sympathetic dysfunction" },
            { test: "Heart rate variability", finding: "Reduced HRV — early autonomic marker in hATTR-PN" },
          ]},
          { title: "Ophthalmology & Other", icon: "👁️", items: [
            { test: "Slit-lamp exam", finding: "Vitreous opacities (amyloid deposits) — pathognomonic for hATTR-PN" },
            { test: "Skin punch biopsy", finding: "Intraepidermal nerve fibre density (IENFD) — detects small fibre loss; Congo red for amyloid deposits" },
            { test: "Rectal biopsy", finding: "High sensitivity (>80%) for systemic amyloidosis; less invasive than nerve biopsy" },
          ]},
        ].map((col) => (
          <div key={col.title} style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", border: "1px solid #BBF7D0" }}>
            <div style={{ background: "#DCFCE7", padding: "8px 12px", borderBottom: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "14px" }}>{col.icon}</span>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#15803D", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{col.title}</span>
            </div>
            <div style={{ padding: "10px 12px" }}>
              {col.items.map((item) => (
                <div key={item.test} style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #F0FDF4" }}>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: DARK, marginBottom: "2px" }}>{item.test}</div>
                  <div style={{ fontSize: "10px", color: "#5A6A7A", lineHeight: 1.5 }}>{item.finding}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "12px", background: "#fff", borderRadius: "8px", padding: "10px 14px", border: "1px solid #BBF7D0" }}>
        <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#15803D" }}>🎯 mNIS+7 Baseline: </span>
        <span style={{ fontSize: "10.5px", color: "#374151" }}>Establish baseline mNIS+7 score at diagnosis. Used to track neuropathy progression and assess AMVUTTRA response (HELIOS-A: 79.4% reduction in mNIS+7 worsening vs placebo at 9 months).</span>
      </div>
    </div>}
    </div>
  ),
  3: (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <div>
        <div style={{ background: "#FDF4FF", borderRadius: "10px", padding: "16px 18px", border: "1px solid #E9D5FF", marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: PURPLE, marginBottom: "8px" }}>⚠️ Why This Step is Critical</div>
          <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.7 }}>
            AL (light-chain) amyloidosis can mimic ATTR-CM on imaging, including a positive PYP scan. <strong>Before proceeding to nuclear scintigraphy, monoclonal protein must be excluded.</strong> A positive PYP scan in the presence of a monoclonal protein cannot confirm ATTR-CM — biopsy is required.
          </div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          Required Tests (All Four)
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
          {[
            { test: "Serum Protein Electrophoresis (SPEP)", purpose: "Detects M-protein band in serum", sensitivity: "~80%" },
            { test: "Serum Immunofixation (SIFE)", purpose: "Identifies immunoglobulin heavy and light chain type", sensitivity: "~95%" },
            { test: "Urine Protein Electrophoresis (UPEP)", purpose: "Detects Bence Jones protein (free light chains) in urine", sensitivity: "~70%" },
            { test: "Urine Immunofixation (UIFE)", purpose: "Confirms and types urinary M-protein", sensitivity: "~90%" },
            { test: "Serum Free Light Chains (sFLC)", purpose: "Kappa and lambda quantification with ratio; most sensitive single test", sensitivity: "~97%" },
          ].map((t) => (
            <div key={t.test} style={{ padding: "10px 14px", background: "#F8F9FA", borderRadius: "9px", border: "1px solid #E8ECF0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "2px" }}>{t.test}</div>
                  <div style={{ fontSize: "10px", color: "#5A6A7A" }}>{t.purpose}</div>
                </div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: PURPLE, background: "#F3E8FF", padding: "2px 7px", borderRadius: "5px", flexShrink: 0 }}>{t.sensitivity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          Interpretation & Next Steps
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
          <div style={{ borderRadius: "10px", border: `2px solid ${GREEN}`, overflow: "hidden" }}>
            <div style={{ background: GREEN, padding: "10px 14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>✅ All Negative → Proceed to PYP Scan</div>
            </div>
            <div style={{ padding: "12px 14px", background: "#F0FDF4" }}>
              <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
                No monoclonal protein detected. Proceed to nuclear scintigraphy (Step 4). A positive PYP scan (Grade 2-3) in this context confirms ATTR-CM <strong>without biopsy</strong> with ~99% specificity.
              </div>
            </div>
          </div>
          <div style={{ borderRadius: "10px", border: `2px solid ${RED}`, overflow: "hidden" }}>
            <div style={{ background: RED, padding: "10px 14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>⚠️ Any Positive → Refer to Haematology</div>
            </div>
            <div style={{ padding: "12px 14px", background: "#FEF2F2" }}>
              <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
                Monoclonal protein detected. Cannot exclude AL amyloidosis. Refer to haematology for bone marrow biopsy and AL workup. If PYP scan is also positive, <strong>endomyocardial biopsy with TTR immunohistochemistry or mass spectrometry is required</strong> to confirm ATTR vs AL.
              </div>
            </div>
          </div>
          <div style={{ background: "#FFFBEB", borderRadius: "10px", padding: "14px 16px", border: "1px solid #FDE68A" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: AMBER, marginBottom: "6px" }}>💡 Clinical Pearl</div>
            <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
              The combination of <strong>all five tests</strong> (SPEP + SIFE + UPEP + UIFE + sFLC) provides the highest sensitivity for monoclonal protein detection. Using fewer tests risks missing AL amyloidosis and misclassifying the patient as ATTR-CM.
            </div>
          </div>
        </div>
      </div>
    </div>
  ),

  4: (
    <div>
    <div style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <span style={{ fontSize: "20px", flexShrink: 0 }}>ℹ️</span>
      <div>
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#1D4ED8", marginBottom: "4px" }}>ATTR-CM Pathway Only — PYP/DPD Scintigraphy</div>
        <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
          Nuclear scintigraphy (PYP, DPD, or HMDP) is a <strong>non-invasive diagnostic tool specific to ATTR-CM</strong>. It is <strong>not used in the hATTR-PN diagnostic pathway</strong>, where cardiac involvement is absent or minor. For hATTR-PN, tissue biopsy (sural nerve, skin punch, or rectal) is the equivalent confirmatory step — proceed directly to <strong>Step 5 (Biopsy)</strong>.
        </div>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          Perugini Visual Grading Scale
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px", marginBottom: "16px" }}>
          {[
            { grade: "Grade 0", desc: "No cardiac uptake", interpretation: "ATTR-CM unlikely", color: GREEN, bg: "#F0FDF4", border: "#BBF7D0" },
            { grade: "Grade 1", desc: "Mild cardiac uptake < rib uptake", interpretation: "Non-diagnostic — consider biopsy if clinical suspicion remains high", color: AMBER, bg: "#FFFBEB", border: "#FDE68A" },
            { grade: "Grade 2", desc: "Moderate cardiac uptake = rib uptake", interpretation: "Suggestive of ATTR-CM — confirm with H/CL ratio", color: BLUE, bg: "#EFF6FF", border: "#BFDBFE" },
            { grade: "Grade 3", desc: "Intense cardiac uptake > rib uptake, reduced rib uptake", interpretation: "Highly diagnostic for ATTR-CM", color: RED, bg: "#FEF2F2", border: "#FECACA" },
          ].map((g) => (
            <div key={g.grade} style={{ borderRadius: "9px", background: g.bg, border: `1px solid ${g.border}`, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: g.color }}>{g.grade}</span>
                <span style={{ fontSize: "10px", color: "#5A6A7A" }}>{g.desc}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{g.interpretation}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#EFF6FF", borderRadius: "10px", padding: "14px 16px", border: "1px solid #BFDBFE" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: BLUE, marginBottom: "8px" }}>📐 H/CL Ratio (Quantitative)</div>
          <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
            Heart-to-Contralateral Lung (H/CL) ratio measured at 1 hour post-injection. <strong>H/CL ≥ 1.5</strong> is highly sensitive and specific for ATTR-CM. Use in combination with visual Perugini grade for highest diagnostic accuracy.
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          Diagnostic Decision Tree
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
          <div style={{ borderRadius: "10px", border: `2px solid ${GREEN}`, overflow: "hidden" }}>
            <div style={{ background: GREEN, padding: "10px 14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>✅ Grade 2–3 + No Monoclonal Protein</div>
            </div>
            <div style={{ padding: "12px 14px", background: "#F0FDF4" }}>
              <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
                <strong>ATTR-CM confirmed without biopsy</strong> (~99% specificity). Proceed directly to TTR genotyping (Step 6) to determine hATTR vs wtATTR. No tissue biopsy required.
              </div>
            </div>
          </div>
          <div style={{ borderRadius: "10px", border: `2px solid ${AMBER}`, overflow: "hidden" }}>
            <div style={{ background: AMBER, padding: "10px 14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>⚠️ Grade 2–3 + Monoclonal Protein Present</div>
            </div>
            <div style={{ padding: "12px 14px", background: "#FFFBEB" }}>
              <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
                Cannot confirm ATTR-CM noninvasively. <strong>Biopsy required</strong> (Step 5) to differentiate ATTR from AL amyloidosis. Endomyocardial biopsy with TTR immunohistochemistry or mass spectrometry is the gold standard.
              </div>
            </div>
          </div>
          <div style={{ borderRadius: "10px", border: `2px solid ${RED}`, overflow: "hidden" }}>
            <div style={{ background: RED, padding: "10px 14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>❌ Grade 0–1 + High Clinical Suspicion</div>
            </div>
            <div style={{ padding: "12px 14px", background: "#FEF2F2" }}>
              <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
                ATTR-CM unlikely but not excluded. If clinical suspicion remains high, consider <strong>biopsy</strong> (Step 5) — particularly abdominal fat pad aspirate or endomyocardial biopsy. Consider cardiac MRI for additional characterisation.
              </div>
            </div>
          </div>
          <div style={{ background: "#F8F9FA", borderRadius: "10px", padding: "14px 16px", border: "1px solid #E8ECF0" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "8px" }}>🌍 Available Tracers</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
              {[
                { tracer: "99mTc-PYP", region: "USA, Saudi Arabia" },
                { tracer: "99mTc-DPD", region: "Europe" },
                { tracer: "99mTc-HMDP", region: "France, Australia" },
              ].map((t) => (
                <div key={t.tracer} style={{ padding: "8px 10px", background: "#fff", borderRadius: "7px", border: "1px solid #E8ECF0", textAlign: "center" as const }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: BLUE }}>{t.tracer}</div>
                  <div style={{ fontSize: "9px", color: "#9CA3AF" }}>{t.region}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  ),

  5: (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <div>
        <div style={{ background: "#EEF2FF", borderRadius: "10px", padding: "14px 18px", border: "1px solid #C7D2FE", marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: INDIGO, marginBottom: "6px" }}>When is Biopsy Required?</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "5px" }}>
            {[
              "Monoclonal protein present AND PYP Grade 2–3 (cannot confirm ATTR noninvasively)",
              "PYP Grade 0–1 but strong clinical suspicion remains",
              "Atypical presentation requiring tissue confirmation",
              "Suspected mixed amyloidosis (ATTR + AL co-existing)",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                <span style={{ color: INDIGO, fontSize: "11px", flexShrink: 0, marginTop: "1px" }}>▸</span>
                <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          Biopsy Sites
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
          {[
            { site: "Abdominal Fat Pad Aspirate", invasiveness: "Least invasive", sensitivity: "70–80%", detail: "First-line biopsy option. Simple office procedure. Lower sensitivity for ATTR-CM than AL amyloidosis.", ind: "ATTR-CM" },
            { site: "Endomyocardial Biopsy (EMB)", invasiveness: "Most invasive", sensitivity: "~100%", detail: "Gold standard for ATTR-CM. Catheter-based. Required when fat pad is negative but suspicion remains high, or when monoclonal protein is present.", ind: "ATTR-CM" },
            { site: "Sural Nerve Biopsy", invasiveness: "Moderate", sensitivity: "~80–90%", detail: "Primary confirmatory biopsy for hATTR-PN. Demonstrates amyloid deposits in endoneurium/perineurium. Congo red + TTR IHC required.", ind: "hATTR-PN" },
            { site: "Skin Punch Biopsy (IENFD)", invasiveness: "Least invasive", sensitivity: "~75–85%", detail: "Intraepidermal nerve fibre density (IENFD) quantification. Detects small fibre neuropathy. Also used for Congo red amyloid staining. Preferred first-line for hATTR-PN.", ind: "hATTR-PN" },
            { site: "Rectal Biopsy", invasiveness: "Moderate", sensitivity: "~75–80%", detail: "Includes submucosal vessels. Useful for both ATTR-CM and hATTR-PN when other sites are inconclusive.", ind: "Both" },
            { site: "Salivary Gland Biopsy", invasiveness: "Moderate", sensitivity: "~80%", detail: "Minor salivary glands (labial). Useful in centres with expertise.", ind: "Both" },
            { site: "Tenosynovial Tissue (Carpal Tunnel)", invasiveness: "Low (during surgery)", sensitivity: "~85%", detail: "Carpal tunnel surgery specimens should routinely be sent for Congo red staining in patients with suspected ATTR.", ind: "Both" },
          ].map((b) => (
            <div key={b.site} style={{ padding: "10px 14px", background: "#F8F9FA", borderRadius: "9px", border: "1px solid #E8ECF0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>{b.site}</span>
                  {b.ind && b.ind !== "Both" && (
                    <span style={{ fontSize: "8.5px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px",
                      background: b.ind === "hATTR-PN" ? "#F0FDF4" : "#EFF6FF",
                      color: b.ind === "hATTR-PN" ? "#15803D" : "#1D4ED8",
                      border: `1px solid ${b.ind === "hATTR-PN" ? "#BBF7D0" : "#BFDBFE"}`,
                    }}>{b.ind}</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#EEF2FF", color: INDIGO }}>{b.invasiveness}</span>
                  <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#F0FDF4", color: GREEN }}>Sens: {b.sensitivity}</span>
                </div>
              </div>
              <div style={{ fontSize: "10px", color: "#5A6A7A", lineHeight: 1.4 }}>{b.detail}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          Staining & Fibril Typing
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px", marginBottom: "16px" }}>
          {[
            { method: "Congo Red Staining", detail: "Apple-green birefringence under polarised light = amyloid confirmed. Confirms amyloid deposits but does not identify fibril type.", color: RED },
            { method: "TTR Immunohistochemistry (IHC)", detail: "TTR-specific antibody staining. Confirms TTR fibril type. Less sensitive than mass spectrometry but widely available.", color: AMBER },
            { method: "Laser Microdissection + Mass Spectrometry (LMD/MS)", detail: "Gold standard for fibril typing. Identifies specific protein type (TTR, AL kappa/lambda, AA, etc.) with highest accuracy. Available at specialist amyloid centres.", color: PURPLE },
          ].map((s) => (
            <div key={s.method} style={{ borderRadius: "9px", border: `1px solid ${s.color}30`, overflow: "hidden" }}>
              <div style={{ background: `${s.color}10`, padding: "8px 12px", borderBottom: `1px solid ${s.color}20` }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: s.color }}>{s.method}</span>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.5 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#F0FDF4", borderRadius: "10px", padding: "14px 16px", border: "1px solid #BBF7D0" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: GREEN, marginBottom: "8px" }}>✅ After Positive Biopsy</div>
          <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
            Once TTR amyloid is confirmed on biopsy, proceed to <strong>TTR genotyping</strong> (Step 6) to determine hATTR vs wtATTR. All patients with confirmed ATTR-CM should undergo genetic testing regardless of age.
          </div>
        </div>
      </div>
    </div>
  ),

  6: (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <div>
        <div style={{ background: "#F0FDF4", borderRadius: "10px", padding: "14px 18px", border: "1px solid #BBF7D0", marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: GREEN, marginBottom: "6px" }}>🧬 Why All ATTR Patients Need TTR Genotyping</div>
          <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.7 }}>
            All patients with confirmed ATTR amyloidosis should undergo TTR gene sequencing, regardless of age. This determines whether the patient has <strong>hereditary ATTR (hATTR)</strong> — a pathogenic TTR variant — or <strong>wild-type ATTR (wtATTR)</strong>. The distinction has critical implications for prognosis, treatment selection, and family screening.
          </div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          Key TTR Variants
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
          {[
            { variant: "Val30Met (p.V30M)", phenotype: "Neurological (hATTR-PN)", prevalence: "Most common globally; endemic in Portugal, Sweden, Japan", color: BLUE },
            { variant: "Val122Ile (p.V142I)", phenotype: "Cardiac (ATTR-CM)", prevalence: "~3-4% of Black Americans; most common cardiac variant", color: RED },
            { variant: "Thr60Ala (p.T60A)", phenotype: "Mixed (cardiac + neuro)", prevalence: "~1% of Irish descent; mixed phenotype", color: PURPLE },
            { variant: "Ile68Leu (p.I68L)", phenotype: "Cardiac", prevalence: "Reported in Saudi Arabia & Middle East", color: AMBER },
            { variant: "Glu89Gln (p.E89Q)", phenotype: "Cardiac", prevalence: "South Asian (India, Bangladesh)", color: TEAL },
            { variant: "Wild-type (no variant)", phenotype: "Cardiac only (wtATTR-CM)", prevalence: "Elderly males >65y; no family screening needed", color: "#9CA3AF" },
          ].map((v) => (
            <div key={v.variant} style={{ display: "flex", gap: "10px", padding: "8px 12px", background: "#F8F9FA", borderRadius: "8px", alignItems: "flex-start" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: v.color, flexShrink: 0, marginTop: "4px" }} />
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "2px", flexWrap: "wrap" as const }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>{v.variant}</span>
                  <span style={{ fontSize: "9px", fontWeight: 700, padding: "1px 6px", borderRadius: "4px", background: `${v.color}18`, color: v.color }}>{v.phenotype}</span>
                </div>
                <div style={{ fontSize: "10px", color: "#5A6A7A" }}>{v.prevalence}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          hATTR vs wtATTR: Key Differences
        </div>
        <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
            <thead>
              <tr style={{ background: "#F8F9FA" }}>
                <th style={{ padding: "10px 14px", fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Feature</th>
                <th style={{ padding: "10px 14px", fontSize: "10px", fontWeight: 700, color: GREEN, textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>hATTR</th>
                <th style={{ padding: "10px 14px", fontSize: "10px", fontWeight: 700, color: BLUE, textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>wtATTR</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Cause", hattr: "Pathogenic TTR variant", wtattr: "No TTR variant (age-related)" },
                { feature: "Typical age", hattr: "Variable (30s–80s, variant-dependent)", wtattr: ">65 years" },
                { feature: "Sex", hattr: "M and F (equal)", wtattr: "Predominantly male (>90%)" },
                { feature: "Phenotype", hattr: "Cardiac and/or neurological", wtattr: "Cardiac only" },
                { feature: "Family screening", hattr: "Required — 50% risk per 1st-degree relative", wtattr: "Not required" },
                { feature: "Alnylam Act®", hattr: "Eligible (family members)", wtattr: "Not applicable" },
                { feature: "AMVUTTRA", hattr: "Both ATTR-CM + hATTR-PN indications", wtattr: "ATTR-CM indication" },
              ].map((row, idx) => (
                <tr key={row.feature} style={{ background: idx % 2 === 0 ? "#fff" : "#F8F9FA" }}>
                  <td style={{ padding: "8px 14px", fontSize: "11px", fontWeight: 600, color: DARK, borderBottom: "1px solid #F3F4F6" }}>{row.feature}</td>
                  <td style={{ padding: "8px 14px", fontSize: "11px", color: "#374151", borderBottom: "1px solid #F3F4F6" }}>{row.hattr}</td>
                  <td style={{ padding: "8px 14px", fontSize: "11px", color: "#374151", borderBottom: "1px solid #F3F4F6" }}>{row.wtattr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "14px 16px", border: "1px solid #14b8a6" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#0d9488", marginBottom: "8px" }}>🧬 Alnylam Act® Integration</div>
          <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
            For confirmed hATTR patients, refer first-degree relatives to <strong>Alnylam Act®</strong> for no-charge TTR gene testing. Family members with a confirmed family history qualify under Track A eligibility — no additional clinical criteria required. Each first-degree relative has a ~50% probability of carrying the same variant.
          </div>
        </div>
      </div>
    </div>
  ),

  7: (
    <div>
    {showCM && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          NAC / Gillmore Staging System (ATTR-CM)
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px", marginBottom: "16px" }}>
          {[
            { stage: "Stage I", criteria: "NT-proBNP <3,000 pg/mL AND eGFR ≥45 mL/min", survival: "~69 months", color: GREEN, bg: "#F0FDF4", border: "#BBF7D0" },
            { stage: "Stage II", criteria: "NT-proBNP ≥3,000 pg/mL OR eGFR <45 mL/min (not both)", survival: "~46 months", color: AMBER, bg: "#FFFBEB", border: "#FDE68A" },
            { stage: "Stage III", criteria: "NT-proBNP ≥3,000 pg/mL AND eGFR <45 mL/min", survival: "~24 months", color: RED, bg: "#FEF2F2", border: "#FECACA" },
          ].map((s) => (
            <div key={s.stage} style={{ borderRadius: "10px", background: s.bg, border: `1px solid ${s.border}`, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: s.color, fontFamily: "'DM Serif Display', Georgia, serif" }}>{s.stage}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", background: `${s.color}18`, color: s.color }}>Median survival: {s.survival}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.5 }}>{s.criteria}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#F8F9FA", borderRadius: "10px", padding: "14px 16px", border: "1px solid #E8ECF0" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "8px" }}>NYHA Functional Class</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
            {[
              { cls: "Class I", desc: "No symptoms with ordinary activity", color: GREEN },
              { cls: "Class II", desc: "Mild symptoms; slight limitation", color: TEAL },
              { cls: "Class III", desc: "Marked limitation; comfortable only at rest", color: AMBER },
              { cls: "Class IV", desc: "Symptoms at rest; unable to carry on any activity", color: RED },
            ].map((c) => (
              <div key={c.cls} style={{ flex: "1 1 140px", padding: "8px 10px", background: "#fff", borderRadius: "8px", border: `1px solid ${c.color}30` }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: c.color, marginBottom: "2px" }}>{c.cls}</div>
                <div style={{ fontSize: "10px", color: "#5A6A7A" }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          Additional Staging Biomarkers
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px", marginBottom: "16px" }}>
          {[
            { marker: "NT-proBNP / BNP", role: "Primary staging biomarker; reflects cardiac wall stress; elevated disproportionately in ATTR-CM" },
            { marker: "High-sensitivity troponin T/I", role: "Reflects ongoing myocardial injury; elevated in all stages; rising trend indicates progression" },
            { marker: "eGFR", role: "Renal function; used in NAC staging; also affects drug dosing and monitoring" },
            { marker: "6-Minute Walk Test (6MWT)", role: "Functional capacity assessment; correlates with NYHA class and quality of life; used in clinical trials" },
            { marker: "Kansas City Cardiomyopathy Questionnaire (KCCQ)", role: "Patient-reported quality of life; primary endpoint in HELIOS-B" },
            { marker: "Echocardiographic GLS", role: "Global longitudinal strain; correlates with amyloid burden; apical sparing pattern tracks disease progression" },
          ].map((b) => (
            <div key={b.marker} style={{ padding: "9px 12px", background: "#F8F9FA", borderRadius: "8px", border: "1px solid #E8ECF0" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "2px" }}>{b.marker}</div>
              <div style={{ fontSize: "10px", color: "#5A6A7A", lineHeight: 1.4 }}>{b.role}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "14px 16px", border: "1px solid #14b8a6" }}>
           <div style={{ fontSize: "11px", fontWeight: 700, color: "#0d9488", marginBottom: "8px" }}>💊 Staging & AMVUTTRA</div>
          <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
            HELIOS-B enrolled patients with NAC Stage I–III. The greatest absolute benefit was observed in <strong>Stage I–II patients</strong>. Earlier staging = larger therapeutic window. This reinforces the importance of early diagnosis and treatment initiation before disease progression to Stage III.
          </div>
        </div>
      </div>
    </div>}
    {/* hATTR-PN Staging */}
    {showPN && <div style={{ marginTop: "20px", background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: "12px", padding: "16px 20px" }}>
      <div style={{ fontSize: "11px", fontWeight: 800, color: "#15803D", textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>🦶</span> hATTR-PN Staging Systems
        <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}>hATTR-PN</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "10px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>PND Score (Polyneuropathy Disability)</div>
          {[
            { score: "PND 0", desc: "No neuropathy symptoms", color: GREEN, bg: "#F0FDF4", border: "#BBF7D0" },
            { score: "PND I", desc: "Sensory disturbances; walking unimpaired", color: TEAL, bg: "#F0FDFA", border: "#99F6E4" },
            { score: "PND II", desc: "Mild walking impairment; no aid required", color: AMBER, bg: "#FFFBEB", border: "#FDE68A" },
            { score: "PND IIIa", desc: "Walking with 1 support (cane/stick)", color: "#F97316", bg: "#FFF7ED", border: "#FED7AA" },
            { score: "PND IIIb", desc: "Walking with 2 supports (bilateral)", color: RED, bg: "#FEF2F2", border: "#FECACA" },
            { score: "PND IV", desc: "Wheelchair-bound or bedridden", color: "#7F1D1D", bg: "#FEF2F2", border: "#FCA5A5" },
          ].map((p) => (
            <div key={p.score} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "6px 10px", background: p.bg, borderRadius: "7px", border: `1px solid ${p.border}`, marginBottom: "5px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: p.color, flexShrink: 0, minWidth: "52px" }}>{p.score}</span>
              <span style={{ fontSize: "10px", color: "#374151", lineHeight: 1.4 }}>{p.desc}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "10px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>FAP Staging (Coutinho)</div>
          {[
            { stage: "Stage 0", desc: "Asymptomatic TTR variant carrier — no clinical neuropathy", color: GREEN, bg: "#F0FDF4", border: "#BBF7D0" },
            { stage: "Stage 1", desc: "Mild neuropathy; ambulatory without aid; sensory > motor", color: AMBER, bg: "#FFFBEB", border: "#FDE68A" },
            { stage: "Stage 2", desc: "Moderate neuropathy; requires walking aid; autonomic involvement", color: "#F97316", bg: "#FFF7ED", border: "#FED7AA" },
            { stage: "Stage 3", desc: "Severe neuropathy; wheelchair-bound; cachexia", color: RED, bg: "#FEF2F2", border: "#FECACA" },
          ].map((s) => (
            <div key={s.stage} style={{ padding: "8px 12px", background: s.bg, borderRadius: "8px", border: `1px solid ${s.border}`, marginBottom: "6px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: 800, color: s.color, marginBottom: "3px" }}>{s.stage}</div>
              <div style={{ fontSize: "10px", color: "#374151", lineHeight: 1.4 }}>{s.desc}</div>
            </div>
          ))}
          <div style={{ background: "#fff", borderRadius: "8px", padding: "10px 12px", border: "1px solid #BBF7D0", marginTop: "8px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#15803D", marginBottom: "4px" }}>AMVUTTRA HELIOS-A Eligibility</div>
            <div style={{ fontSize: "10px", color: "#374151", lineHeight: 1.5 }}>FAP Stage 1 or Stage 2 (PND ≤IIIb). Stage 3 / PND IV patients were excluded from HELIOS-A. Early treatment is critical.</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "10px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>mNIS+7 Monitoring</div>
          <div style={{ background: "#fff", borderRadius: "10px", padding: "12px 14px", border: "1px solid #BBF7D0", marginBottom: "10px" }}>
            <div style={{ fontSize: "10.5px", fontWeight: 700, color: DARK, marginBottom: "6px" }}>Modified Neuropathy Impairment Score +7</div>
            <div style={{ fontSize: "10px", color: "#374151", lineHeight: 1.5, marginBottom: "8px" }}>Composite score assessing motor, sensory, autonomic, and reflex function. Range: 0–346.32. Higher = worse neuropathy.</div>
            {[
              { label: "HELIOS-A Baseline", value: "~74 points", color: AMBER },
              { label: "Placebo worsening at 9 mo", value: "+17.8 points", color: RED },
              { label: "AMVUTTRA change at 9 mo", value: "-0.6 points", color: GREEN },
              { label: "Relative reduction", value: "79.4% less worsening", color: TEAL },
            ].map((m) => (
              <div key={m.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #F0FDF4" }}>
                <span style={{ fontSize: "10px", color: "#5A6A7A" }}>{m.label}</span>
                <span style={{ fontSize: "10px", fontWeight: 700, color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: "10px", padding: "12px 14px", border: "1px solid #BBF7D0" }}>
            <div style={{ fontSize: "10.5px", fontWeight: 700, color: DARK, marginBottom: "6px" }}>Monitoring Schedule</div>
            {[
              { timepoint: "Baseline", tests: "mNIS+7, NCS/EMG, autonomic, QoL (Norfolk)" },
              { timepoint: "3 months", tests: "Symptom review, tolerability" },
              { timepoint: "6 months", tests: "mNIS+7, NCS, autonomic, biomarkers" },
              { timepoint: "12 months", tests: "Full reassessment; treatment response evaluation" },
            ].map((t) => (
              <div key={t.timepoint} style={{ display: "flex", gap: "8px", padding: "4px 0", borderBottom: "1px solid #F0FDF4" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#15803D", flexShrink: 0, minWidth: "70px" }}>{t.timepoint}</span>
                <span style={{ fontSize: "10px", color: "#374151" }}>{t.tests}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>}
    </div>
  ),
  8: (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          {
            drug: "AMVUTTRA® (vutrisiran)",
            class: "GalNAc-siRNA (RNAi)",
            company: "Alnylam",
            indication: "ATTR-CM + hATTR-PN",
            dosing: "25 mg SC Q3M (4×/year)",
            approval: "ATTR-CM: March 2025 | hATTR-PN: June 2022",
            keyData: "HELIOS-B: 28% CV composite ↓, 35% all-cause mortality ↓, 88% TTR suppression",
            highlight: true,
            color: TEAL,
          },
          {
            drug: "Tafamidis (Vyndaqel/Vyndamax)",
            class: "TTR Stabiliser",
            company: "Pfizer",
            indication: "ATTR-CM only",
            dosing: "80 mg (Vyndaqel) or 61 mg (Vyndamax) oral daily",
            approval: "FDA: May 2019",
            keyData: "ATTR-ACT: 30% all-cause mortality ↓; no neurological indication",
            highlight: false,
            color: BLUE,
          },
          {
            drug: "Acoramidis (Attruby)",
            class: "TTR Stabiliser",
            company: "BridgeBio",
            indication: "ATTR-CM only",
            dosing: "800 mg oral twice daily",
            approval: "FDA: November 2024",
            keyData: "ATTRibute-CM: significant reduction in CV events; no neurological indication",
            highlight: false,
            color: PURPLE,
          },
          {
            drug: "Patisiran (Onpattro)",
            class: "siRNA (RNAi) — lipid nanoparticle",
            company: "Alnylam",
            indication: "hATTR-PN only",
            dosing: "0.3 mg/kg IV Q3W; premedication required",
            approval: "FDA: August 2018",
            keyData: "APOLLO: 56% mNIS+7 ↓; older generation — superseded by AMVUTTRA for most patients",
            highlight: false,
            color: "#9CA3AF",
          },
          {
            drug: "Inotersen (Tegsedi)",
            class: "Antisense Oligonucleotide (ASO)",
            company: "Ionis/AstraZeneca",
            indication: "hATTR-PN only",
            dosing: "284 mg SC weekly",
            approval: "FDA: October 2018",
            keyData: "NEURO-TTRansform: 55% mNIS+7 ↓; requires platelet monitoring (thrombocytopenia risk)",
            highlight: false,
            color: "#9CA3AF",
          },
          {
            drug: "Eplontersen (Wainua)",
            class: "GalNAc-ASO (next-gen ASO)",
            company: "Ionis/AstraZeneca",
            indication: "hATTR-PN only",
            dosing: "45 mg SC monthly",
            approval: "FDA: December 2023",
            keyData: "NEURO-TTRansform: 63% mNIS+7 ↓; monthly dosing; no platelet monitoring required",
            highlight: false,
            color: INDIGO,
          },
        ].map((d) => (
          <div key={d.drug} style={{ borderRadius: "12px", border: d.highlight ? `2px solid ${TEAL}` : "1px solid #E8ECF0", overflow: "hidden", boxShadow: d.highlight ? "0 4px 20px rgba(0,194,168,0.15)" : "none" }}>
            {d.highlight && (
              <div style={{ background: TEAL, padding: "6px 14px", textAlign: "center" as const }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#fff", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>⭐ Preferred — Dual Indication</span>
              </div>
            )}
            <div style={{ background: `${d.color}10`, padding: "12px 14px", borderBottom: `1px solid ${d.color}20` }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: DARK, marginBottom: "3px" }}>{d.drug}</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
                <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: `${d.color}20`, color: d.color }}>{d.class}</span>
                <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: "#F3F4F6", color: "#5A6A7A" }}>{d.company}</span>
              </div>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A" }}>Indication: </span>
                <span style={{ fontSize: "10px", color: DARK, fontWeight: 600 }}>{d.indication}</span>
              </div>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A" }}>Dosing: </span>
                <span style={{ fontSize: "10px", color: DARK }}>{d.dosing}</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A" }}>Approval: </span>
                <span style={{ fontSize: "10px", color: DARK }}>{d.approval}</span>
              </div>
              <div style={{ fontSize: "10px", color: "#374151", lineHeight: 1.5, padding: "6px 8px", background: "#F8F9FA", borderRadius: "6px" }}>{d.keyData}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Supportive care */}
      <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", padding: "18px 20px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
          ⚠️ Supportive Care Considerations
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: GREEN, marginBottom: "8px" }}>✅ Use with Caution / Recommended</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "5px" }}>
              {[
                "Loop diuretics — for fluid management (titrate carefully)",
                "Direct oral anticoagulants (DOACs) — for AF (preferred over warfarin)",
                "ICD / pacemaker — for conduction disease and arrhythmia risk",
                "Compression stockings — for orthostatic hypotension",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                  <span style={{ color: GREEN, fontSize: "11px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "11px", color: "#374151" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: RED, marginBottom: "8px" }}>❌ Avoid / Use with Extreme Caution</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "5px" }}>
              {[
                "Beta-blockers — poorly tolerated; may cause severe hypotension",
                "ACE inhibitors / ARBs — poorly tolerated; hypotension risk",
                "Calcium channel blockers — bind to amyloid fibrils; risk of toxicity",
                "Digoxin — binds to amyloid fibrils; risk of toxicity even at therapeutic levels",
                "Spironolactone — use with caution; renal function monitoring required",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                  <span style={{ color: RED, fontSize: "11px", flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: "11px", color: "#374151" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
}
export default function DiagnosticAlgorithmSection() {
  const [activeStep, setActiveStep] = useState<StepId>(1);
  const [pathway, setPathway] = useState<Pathway>("both");

  return (
    <section
      id="diagnostic-algorithm"
      style={{
        background: "linear-gradient(180deg, #F8F9FA 0%, #EFF6FF 100%)",
        padding: "80px 0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="container">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ width: "48px", height: "3px", background: BLUE }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: BLUE, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
              Clinical Decision Support
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "16px" }}>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: DARK, margin: "0 0 6px" }}>
                ATTR Amyloidosis Diagnostic Algorithm
              </h2>
              <p style={{ color: "#5A6A7A", fontSize: "1rem", margin: 0 }}>
                Evidence-based 8-step pathway from initial suspicion to treatment decision — ACC 2023 ECDP &amp; AHA Expert Consensus
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "8px 14px", textAlign: "center" as const }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: BLUE }}>Guideline Source</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: DARK }}>ACC 2023 ECDP</div>
              </div>
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "8px 14px", textAlign: "center" as const }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: RED }}>Diagnostic Delay</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: DARK }}>3–4 Years Average</div>
              </div>
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px", padding: "8px 14px", textAlign: "center" as const }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: GREEN }}>Non-invasive Dx</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: DARK }}>PYP + No M-Protein</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PATHWAY SWITCHER ───────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" as const }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
            Filter Pathway:
          </span>
          {([
            { key: "both", label: "Both Indications", icon: "⬡", activeColor: "#1E3A5F", activeBg: "#EFF6FF", activeBorder: "#BFDBFE" },
            { key: "attr-cm", label: "ATTR-CM", icon: "🫀", activeColor: "#1D4ED8", activeBg: "#EFF6FF", activeBorder: "#93C5FD" },
            { key: "hattr-pn", label: "hATTR-PN", icon: "🦶", activeColor: "#15803D", activeBg: "#F0FDF4", activeBorder: "#86EFAC" },
          ] as { key: Pathway; label: string; icon: string; activeColor: string; activeBg: string; activeBorder: string }[]).map((p) => {
            const isActive = pathway === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setPathway(p.key)}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "9px 18px", borderRadius: "50px", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: isActive ? 800 : 600,
                  border: `2px solid ${isActive ? p.activeBorder : "#E8ECF0"}`,
                  background: isActive ? p.activeBg : "#fff",
                  color: isActive ? p.activeColor : "#5A6A7A",
                  boxShadow: isActive ? `0 2px 10px ${p.activeBorder}80` : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "14px" }}>{p.icon}</span>
                {p.label}
                {isActive && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.activeColor, marginLeft: "2px" }} />}
              </button>
            );
          })}
          {pathway !== "both" && (
            <div style={{
              marginLeft: "auto", padding: "8px 14px", borderRadius: "8px",
              background: pathway === "attr-cm" ? "#EFF6FF" : "#F0FDF4",
              border: `1px solid ${pathway === "attr-cm" ? "#BFDBFE" : "#BBF7D0"}`,
              fontSize: "11px", color: pathway === "attr-cm" ? "#1D4ED8" : "#15803D", fontWeight: 600,
            }}>
              {pathway === "attr-cm"
                ? "Showing ATTR-CM pathway · PYP scintigraphy-based non-invasive diagnosis"
                : "Showing hATTR-PN pathway · Nerve biopsy + NCS/EMG-based diagnosis"}
            </div>
          )}
        </div>

        {/* ── STEP NAVIGATOR ─────────────────────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", marginBottom: "0" }}>
          {/* Step pills */}
          <div style={{ padding: "20px 24px 0", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto" as const, scrollbarWidth: "none" as const, paddingBottom: "20px" }}>
              {STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: activeStep === step.id ? `2px solid ${step.color}` : "2px solid #E8ECF0",
                    background: activeStep === step.id ? `${step.color}10` : "#F8F9FA",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative" as const,
                    opacity: pathway === "both" ? 1 : (
                      (pathway === "attr-cm" && step.indications.includes("ATTR-CM")) ||
                      (pathway === "hattr-pn" && step.indications.includes("hATTR-PN"))
                        ? 1 : 0.35
                    ),
                  }}
                >
                  {/* Connector line */}
                  {idx < STEPS.length - 1 && (
                    <div style={{
                      position: "absolute" as const,
                      right: "-10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "2px",
                      background: "#E8ECF0",
                      zIndex: 1,
                    }} />
                  )}
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: activeStep === step.id ? step.color : "#E8ECF0",
                    color: activeStep === step.id ? "#fff" : "#9CA3AF",
                    fontSize: "11px",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {step.id}
                  </div>
                  <div style={{ textAlign: "left" as const }}>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: activeStep === step.id ? step.color : "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{step.tag}</div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: activeStep === step.id ? DARK : "#6B7280", whiteSpace: "nowrap" as const }}>{step.shortLabel}</div>
                  </div>
                  <span style={{ fontSize: "14px" }}>{step.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active step header */}
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F3F4F6", background: `${STEPS[activeStep - 1].color}06` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${STEPS[activeStep - 1].color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                {STEPS[activeStep - 1].icon}
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: STEPS[activeStep - 1].color, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: "2px" }}>
                  {STEPS[activeStep - 1].tag}
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: DARK, fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  {STEPS[activeStep - 1].label}
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "5px", flexWrap: "wrap" as const }}>
                  {STEPS[activeStep - 1].indications.map((ind) => (
                    <span key={ind} style={{
                      fontSize: "9.5px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
                      background: ind === "ATTR-CM" ? "#EFF6FF" : "#F0FDF4",
                      color: ind === "ATTR-CM" ? "#1D4ED8" : "#15803D",
                      border: `1px solid ${ind === "ATTR-CM" ? "#BFDBFE" : "#BBF7D0"}`,
                      letterSpacing: "0.04em",
                    }}>{ind}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                {activeStep > 1 && (
                  <button
                    onClick={() => setActiveStep((prev) => (prev - 1) as StepId)}
                    style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 700, border: "1px solid #E8ECF0", borderRadius: "8px", background: "#fff", cursor: "pointer", color: "#374151" }}
                  >
                    ← Previous
                  </button>
                )}
                {activeStep < 8 && (
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) as StepId)}
                    style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 700, border: "none", borderRadius: "8px", background: STEPS[activeStep - 1].color, cursor: "pointer", color: "#fff" }}
                  >
                    Next Step →
                  </button>
                )}
                {/* Practice this step button */}
                <button
                  onClick={() => {
                    const practiceCase = STEP_PRACTICE_CASES[activeStep];
                    window.dispatchEvent(new CustomEvent("practice-case", { detail: practiceCase.caseId }));
                  }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    padding: "6px 14px", fontSize: "11px", fontWeight: 700,
                    border: "1.5px solid #00C2A8", borderRadius: "8px",
                    background: "#E6F7F5", color: "#00796B", cursor: "pointer",
                  }}
                  title={`Practice Step ${activeStep} with ${STEP_PRACTICE_CASES[activeStep].caseNum}: ${STEP_PRACTICE_CASES[activeStep].title}`}
                >
                  ▶ Practice this Step
                </button>
              </div>
            </div>
          </div>

          {/* Step content */}
          <div style={{ padding: "24px" }}>
            {/* Pathway relevance banner */}
            {pathway !== "both" && !STEPS[activeStep - 1].indications.includes(pathway === "attr-cm" ? "ATTR-CM" : "hATTR-PN") && (
              <div style={{
                marginBottom: "20px", padding: "14px 18px", borderRadius: "10px",
                background: pathway === "attr-cm" ? "#EFF6FF" : "#F0FDF4",
                border: `1.5px dashed ${pathway === "attr-cm" ? "#93C5FD" : "#86EFAC"}`,
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <span style={{ fontSize: "20px" }}>{pathway === "attr-cm" ? "🫀" : "🦶"}</span>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: pathway === "attr-cm" ? "#1D4ED8" : "#15803D", marginBottom: "3px" }}>
                    {pathway === "attr-cm" ? "ATTR-CM Pathway" : "hATTR-PN Pathway"}: This step is not part of the standard {pathway === "attr-cm" ? "ATTR-CM" : "hATTR-PN"} diagnostic pathway
                  </div>
                  <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.5 }}>
                    {pathway === "attr-cm"
                      ? "Step 4 (PYP Scintigraphy) is specific to ATTR-CM. The ATTR-CM pathway proceeds: Red Flags → Workup → M-Protein Exclusion → PYP Scan → (Biopsy if needed) → Genetics → Staging → Treatment."
                      : "Step 4 (PYP Scintigraphy) is not used in hATTR-PN diagnosis. The hATTR-PN pathway proceeds: Red Flags → Workup (NCS/EMG) → M-Protein Exclusion → Biopsy (Sural Nerve/Skin Punch) → Genetics → Staging → Treatment."}
                  </div>
                </div>
              </div>
            )}
            {/* Active pathway highlight banner */}
            {pathway !== "both" && STEPS[activeStep - 1].indications.includes(pathway === "attr-cm" ? "ATTR-CM" : "hATTR-PN") && (
              <div style={{
                marginBottom: "16px", padding: "10px 16px", borderRadius: "8px",
                background: pathway === "attr-cm" ? "#EFF6FF" : "#F0FDF4",
                border: `1px solid ${pathway === "attr-cm" ? "#BFDBFE" : "#BBF7D0"}`,
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{ fontSize: "13px" }}>{pathway === "attr-cm" ? "🫀" : "🦶"}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: pathway === "attr-cm" ? "#1D4ED8" : "#15803D" }}>
                  {pathway === "attr-cm" ? "ATTR-CM" : "hATTR-PN"} Pathway — This step is part of the {pathway === "attr-cm" ? "ATTR-CM" : "hATTR-PN"} diagnostic algorithm.
                  {pathway === "hattr-pn" && activeStep === 2 && " Focus on NCS/EMG, autonomic testing, and skin punch biopsy findings."}
                  {pathway === "hattr-pn" && activeStep === 5 && " Focus on sural nerve biopsy and skin punch biopsy (IENFD) sections below."}
                  {pathway === "hattr-pn" && activeStep === 7 && " Focus on the PND Score, FAP Staging, and mNIS+7 monitoring panels below."}
                  {pathway === "attr-cm" && activeStep === 7 && " Focus on the NAC/Gillmore Staging System and NYHA class panels above."}
                </span>
              </div>
            )}
            {getStepContent(pathway)[activeStep]}
            {/* Practice Case contextual card */}
            <div
              style={{
                marginTop: "24px",
                background: "linear-gradient(135deg, #E6F7F5 0%, #EFF6FF 100%)",
                border: "1.5px solid #00C2A8",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                flexWrap: "wrap" as const,
              }}
            >
              <div style={{ fontSize: "24px", flexShrink: 0 }}>🩺</div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ fontSize: "10px", fontWeight: 800, color: "#00C2A8", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: "3px" }}>
                  Recommended Practice Case · Step {activeStep}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#060D18", marginBottom: "2px" }}>
                  {STEP_PRACTICE_CASES[activeStep].caseNum}: {STEP_PRACTICE_CASES[activeStep].title}
                </div>
                <div style={{ fontSize: "11.5px", color: "#475569" }}>
                  {STEP_PRACTICE_CASES[activeStep].context}
                </div>
              </div>
              <button
                onClick={() => {
                  const practiceCase = STEP_PRACTICE_CASES[activeStep];
                  window.dispatchEvent(new CustomEvent("practice-case", { detail: practiceCase.caseId }));
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "9px 18px", fontSize: "12px", fontWeight: 700,
                  border: "none", borderRadius: "8px",
                  background: "#00C2A8", color: "#fff", cursor: "pointer",
                  boxShadow: "0 3px 12px rgba(0,194,168,0.30)",
                  whiteSpace: "nowrap" as const,
                  flexShrink: 0,
                }}
              >
                ▶ Practice this Step
              </button>
            </div>
          </div>
        </div>

        {/* ── QUICK SUMMARY STRIP ────────────────────────────────── */}
        <div style={{ marginTop: "24px", background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", padding: "18px 24px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "14px" }}>
            Algorithm at a Glance
          </div>
          <div style={{ display: "flex", gap: "0", overflowX: "auto" as const, scrollbarWidth: "none" as const }}>
            {STEPS.map((step, idx) => (
              <div key={step.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <button
                  onClick={() => setActiveStep(step.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    gap: "4px",
                    padding: "8px 12px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    opacity: pathway === "both" ? 1 : (
                      (pathway === "attr-cm" && step.indications.includes("ATTR-CM")) ||
                      (pathway === "hattr-pn" && step.indications.includes("hATTR-PN"))
                        ? 1 : 0.3
                    ),
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: activeStep === step.id ? step.color : `${step.color}20`,
                    color: activeStep === step.id ? "#fff" : step.color,
                    fontSize: "12px",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s ease",
                  }}>
                    {step.id}
                  </div>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: activeStep === step.id ? step.color : "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.04em", whiteSpace: "nowrap" as const }}>
                    {step.shortLabel}
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <div style={{ width: "20px", height: "2px", background: "#E8ECF0", flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
