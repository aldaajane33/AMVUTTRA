/* CaseSimulatorSection.tsx
   Design: Step-by-step branching clinical decision simulator
   Features:
     - Case selection lobby (Case 1: ATTR-CM | Case 2: hATTR-PN)
     - 5-stage pathway per case: Suspect → Screen → Diagnose → Treat → Monitor
     - Multiple-choice decisions with correct/incorrect feedback
     - Evidence citations on each step
     - Score tracking with final performance summary
     - Animated transitions between stages
     - "Expert Commentary" on each decision
*/

import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Choice {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
  detail?: string;
}

interface Stage {
  id: string;
  phase: string;
  phaseColor: string;
  title: string;
  narrative: string;
  clinicalFindings?: string[];
  question: string;
  choices: Choice[];
  expertCommentary: string;
  evidence?: string;
  keyPoint?: string;
  algorithmStep?: { step: number; label: string; hint: string };
}

interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  indication: string;
  indicationColor: string;
  difficulty: string;
  duration: string;
  patientSummary: string[];
  stages: Stage[];
}

interface AnswerRecord {
  stageId: string;
  choiceId: string;
  correct: boolean;
}

// ─── Case 1 Data ──────────────────────────────────────────────────────────────
const CASE_1: CaseData = {
  id: "case-1",
  caseNumber: "Case 1",
  title: "The Missed Diagnosis",
  subtitle: "78-year-old male · HFpEF · Bilateral CTS · Low-voltage ECG",
  indication: "ATTR-CM",
  indicationColor: "#00C2A8",
  difficulty: "Intermediate",
  duration: "~10 min",
  patientSummary: [
    "78-year-old male",
    "HFpEF (LVEF 58%, NYHA Class II)",
    "Bilateral carpal tunnel syndrome (CTS) — surgically treated 3 years ago",
    "Low-voltage ECG despite LV wall thickening on echo",
    "Lumbar spinal stenosis (diagnosed 2 years ago)",
    "No family history of cardiac disease",
    "Currently on furosemide 40 mg/day, bisoprolol 2.5 mg/day",
  ],
  stages: [
    {
      id: "c1-stage-1",
      algorithmStep: { step: 1, label: "Red Flags", hint: "This stage mirrors Step 1 of the Dx Algorithm — recognising the classic ATTR-CM red flag cluster: HFpEF + LVH + low-voltage ECG + bilateral CTS." },
      phase: "SUSPECT",
      phaseColor: "#0093C4",
      title: "Recognising the Red Flags",
      narrative:
        "Mr. Al-Rashidi is a 78-year-old retired engineer presenting to his cardiologist for a 6-month follow-up. He reports worsening dyspnoea on exertion (NYHA II→III) and new ankle oedema despite optimised diuretic therapy. His echocardiogram shows LV wall thickness of 14 mm (up from 12 mm 18 months ago), preserved EF of 58%, and a granular sparkling appearance of the myocardium. His ECG shows low QRS voltage in limb leads despite the LVH on echo. He mentions his bilateral CTS was surgically treated 3 years ago.",
      clinicalFindings: [
        "LV wall thickness: 14 mm (↑ from 12 mm)",
        "LVEF: 58% (preserved)",
        "ECG: Low QRS voltage in limb leads",
        "Echo: Granular 'sparkling' myocardium",
        "History: Bilateral CTS (surgical repair ×2)",
        "History: Lumbar spinal stenosis",
        "Symptoms: Progressive dyspnoea, ankle oedema",
      ],
      question: "Based on these findings, what is the most appropriate next clinical action?",
      choices: [
        {
          id: "c1-1a",
          text: "Increase furosemide dose and recheck in 3 months — likely fluid overload",
          correct: false,
          feedback: "Incorrect. This misses the diagnosis.",
          detail:
            "Escalating diuretics without investigating the underlying cause is a common but dangerous error. The combination of HFpEF + LVH + low-voltage ECG + bilateral CTS + lumbar spinal stenosis in a 78-year-old male is a classic 'red flag' cluster for ATTR-CM. Diuretics treat symptoms but do not address the underlying amyloid deposition.",
        },
        {
          id: "c1-1b",
          text: "Refer for cardiac MRI to assess for infiltrative cardiomyopathy",
          correct: false,
          feedback: "Partially correct, but not the most efficient first step.",
          detail:
            "Cardiac MRI can show late gadolinium enhancement (LGE) patterns consistent with amyloid, but it is not the recommended first-line diagnostic test for ATTR-CM. The non-biopsy Tc-PYP bone scan pathway (Gillmore criteria, 2016) is more specific and is the current standard of care for non-invasive ATTR-CM diagnosis.",
        },
        {
          id: "c1-1c",
          text: "Order a Tc-PYP (technetium pyrophosphate) bone scan + serum/urine immunofixation + free light chains",
          correct: true,
          feedback: "Correct! This is the validated non-biopsy diagnostic pathway.",
          detail:
            "The Gillmore criteria (Circulation, 2016) establish the non-biopsy diagnosis of ATTR-CM: Grade 2 or 3 Tc-PYP uptake + negative serum/urine immunofixation + negative free light chains = ATTR-CM confirmed without biopsy. This is the current standard of care endorsed by ACC/AHA/ESC guidelines.",
        },
        {
          id: "c1-1d",
          text: "Refer for endomyocardial biopsy to confirm amyloid type",
          correct: false,
          feedback: "Incorrect. Biopsy is no longer required in most cases.",
          detail:
            "Endomyocardial biopsy was historically required but is now reserved for cases where non-biopsy criteria cannot be met. The Gillmore non-biopsy pathway has >99% specificity for ATTR-CM when criteria are met.",
        },
      ],
      expertCommentary:
        "The 'red flag' cluster in this case is textbook ATTR-CM: HFpEF in an elderly male, LVH with low-voltage ECG (voltage-mass discordance), granular echo appearance, bilateral CTS, and lumbar spinal stenosis. Studies show ATTR-CM is diagnosed in ~13% of HFpEF patients ≥60 years. The average diagnostic delay is 3–4 years — recognising these red flags is the single most impactful skill for a rare disease specialist.",
      evidence: "Gillmore JD et al. Circulation. 2016;133(24):2404-2412 | Ruberg FL et al. JACC. 2019;73(22):2872-2891",
      keyPoint: "Voltage-mass discordance (LVH on echo + low voltage on ECG) is pathognomonic for infiltrative cardiomyopathy.",
    },
    {
      id: "c1-stage-2",
      algorithmStep: { step: 3, label: "Monoclonal Exclusion", hint: "Before interpreting a PYP scan, Step 3 of the Dx Algorithm requires excluding monoclonal protein (SPEP/SIFE/UPEP/UIFE/sFLC). This is the critical gate before non-invasive diagnosis." },
      phase: "SCREEN",
      phaseColor: "#E67E22",
      title: "Interpreting the Diagnostic Results",
      narrative:
        "Results return 2 weeks later. The Tc-PYP bone scan shows Grade 3 cardiac uptake (H/CL = 1.72). Serum immunofixation: negative. Urine immunofixation: negative. Serum free light chains: kappa 12.4 mg/L, lambda 11.8 mg/L, ratio 1.05 (normal). The nuclear medicine report reads: 'Intense Grade 3 myocardial Tc-PYP uptake consistent with transthyretin cardiac amyloidosis.'",
      clinicalFindings: [
        "Tc-PYP: Grade 3 uptake (H/CL = 1.72)",
        "Serum immunofixation: Negative",
        "Urine immunofixation: Negative",
        "Free light chains: Normal ratio (1.05)",
        "Nuclear medicine report: ATTR-CM confirmed",
      ],
      question: "The Gillmore criteria are met. What is the next critical step before initiating treatment?",
      choices: [
        {
          id: "c1-2a",
          text: "Initiate tafamidis 61 mg immediately — diagnosis is confirmed",
          correct: false,
          feedback: "Incomplete. One critical step is missing.",
          detail:
            "While the non-biopsy diagnosis of ATTR-CM is confirmed, you must determine whether this is wild-type ATTR (wt-ATTR) or hereditary ATTR (hATTR) before initiating therapy. TTR genetic testing is mandatory at diagnosis.",
        },
        {
          id: "c1-2b",
          text: "Order TTR genetic testing (TTR gene sequencing) to distinguish wt-ATTR from hATTR",
          correct: true,
          feedback: "Correct! TTR genotyping is mandatory at diagnosis.",
          detail:
            "TTR gene sequencing must be performed in all newly diagnosed ATTR-CM patients. The most common pathogenic variants include V122I (~3.4% prevalence in African descent), V30M, T60A, and >130 others. If hATTR is confirmed, first-degree relatives should be offered genetic counselling and cascade testing.",
        },
        {
          id: "c1-2c",
          text: "Repeat the Tc-PYP scan in 6 months to confirm progression",
          correct: false,
          feedback: "Incorrect. Grade 3 uptake with negative haematologic workup is definitive.",
          detail:
            "A Grade 3 Tc-PYP scan with negative serum/urine immunofixation and normal free light chain ratio meets the Gillmore criteria. Repeating the scan adds no diagnostic value and delays treatment initiation.",
        },
        {
          id: "c1-2d",
          text: "Refer to haematology to rule out AL amyloidosis before proceeding",
          correct: false,
          feedback: "Unnecessary — haematologic workup is already negative.",
          detail:
            "The haematologic workup has already been performed and is negative, effectively excluding AL amyloidosis. Referring to haematology at this point would add unnecessary delay.",
        },
      ],
      expertCommentary:
        "TTR genotyping is the most commonly overlooked step at ATTR-CM diagnosis. In clinical practice, ~12% of patients diagnosed as 'wild-type' actually have a TTR mutation when formally tested. Identifying hATTR also triggers cascade genetic testing for first-degree relatives.",
      evidence: "Maurer MS et al. JACC. 2017;70(22):2836-2846 | Damy T et al. Eur Heart J. 2016;37(18):1428-1439",
      keyPoint: "TTR genetic testing is mandatory at diagnosis — ~12% of apparent wt-ATTR cases have a TTR mutation on formal testing.",
    },
    {
      id: "c1-stage-3",
      algorithmStep: { step: 6, label: "Genetic Testing", hint: "Step 6 of the Dx Algorithm: TTR genotyping is mandatory after ATTR-CM confirmation. ~12% of apparent wtATTR cases have a TTR mutation on formal testing." },
      phase: "DIAGNOSE",
      phaseColor: "#27AE60",
      title: "Genotype Result & Treatment Selection",
      narrative:
        "TTR genetic testing returns: No pathogenic TTR variant identified. Diagnosis confirmed: Wild-type ATTR cardiomyopathy (wt-ATTR-CM). Mr. Al-Rashidi is now 78 years old, NYHA Class II–III, with confirmed wt-ATTR-CM. He has no prior ATTR-directed therapy. His eGFR is 58 mL/min/1.73m² (mild-moderate CKD). He is eager to start treatment.",
      clinicalFindings: [
        "Diagnosis: Wild-type ATTR-CM (wt-ATTR-CM)",
        "NYHA Class: II–III",
        "Age: 78 years",
        "eGFR: 58 mL/min/1.73m² (mild-moderate CKD)",
        "No prior ATTR-directed therapy",
      ],
      question: "Which treatment approach best aligns with current evidence and AMVUTTRA's approval for this patient?",
      choices: [
        {
          id: "c1-3a",
          text: "Tafamidis 61 mg daily — TTR stabiliser, proven in ATTR-ACT trial",
          correct: false,
          feedback: "Reasonable, but not the most evidence-forward choice in 2026.",
          detail:
            "Tafamidis was the first approved therapy for ATTR-CM and remains valid. However, AMVUTTRA demonstrated a 28% reduction in CV composite and 35% reduction in all-cause mortality in HELIOS-B — with benefit even in patients already on tafamidis.",
        },
        {
          id: "c1-3b",
          text: "AMVUTTRA (vutrisiran) 25 mg SC Q3M — FDA-approved for ATTR-CM, superior mortality data",
          correct: true,
          feedback: "Correct! AMVUTTRA is the optimal choice for this patient.",
          detail:
            "AMVUTTRA received FDA approval for ATTR-CM in March 2025 based on HELIOS-B: HR 0.72 for CV composite (P=0.01) and HR 0.65 for all-cause mortality at 42 months (P=0.01). No dose adjustment needed for mild-moderate CKD. Q3M SC regimen (4 doses/year, no premedication) maximises adherence.",
        },
        {
          id: "c1-3c",
          text: "Patisiran (ONPATTRO) IV Q3W — proven RNAi therapy with APOLLO-B cardiac data",
          correct: false,
          feedback: "Not optimal — patisiran lacks FDA approval for ATTR-CM.",
          detail:
            "Patisiran is NOT FDA-approved for ATTR-CM. Additionally, it requires IV infusion every 3 weeks (17 doses/year) with mandatory premedication, making it significantly more burdensome than AMVUTTRA.",
        },
        {
          id: "c1-3d",
          text: "Watchful waiting — patient is elderly and may not tolerate aggressive therapy",
          correct: false,
          feedback: "Incorrect. Age alone is not a contraindication.",
          detail:
            "HELIOS-B enrolled patients up to age 93, with 62% ≥75 years. ATTR-CM is a progressive, fatal disease — median survival without treatment is 2–5 years from diagnosis.",
        },
      ],
      expertCommentary:
        "In 2026, AMVUTTRA is the most evidence-forward first-line choice for ATTR-CM, with the strongest mortality data of any ATTR therapy (HR 0.65 for ACM at 42 months). The HELIOS-B OLE further showed that patients who started vutrisiran earlier had better outcomes — reinforcing the importance of early initiation.",
      evidence: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130 | Maurer MS et al. N Engl J Med. 2018;379(11):1007-1016",
      keyPoint: "HELIOS-B enrolled patients up to age 93 — age alone is never a contraindication to AMVUTTRA.",
    },
    {
      id: "c1-stage-4",
      algorithmStep: { step: 8, label: "Treatment Decision", hint: "Step 8 of the Dx Algorithm: treatment selection based on indication (ATTR-CM vs hATTR-PN), staging, and patient profile. AMVUTTRA is the only dual-indication therapy." },
      phase: "TREAT",
      phaseColor: "#1A3A6B",
      title: "Initiating AMVUTTRA — Practical Considerations",
      narrative:
        "The decision is made to initiate AMVUTTRA (vutrisiran) 25 mg SC Q3M. Before the first injection, you review the pre-treatment checklist. The nurse asks: 'Do we need to premedicate him? And what about his vitamin A levels — should we check them first?'",
      clinicalFindings: [
        "Treatment decision: AMVUTTRA 25 mg SC Q3M",
        "Nurse query: Premedication needed?",
        "Nurse query: Check vitamin A levels first?",
        "Nurse query: Any REMS enrolment required?",
        "Nurse query: Which injection sites are approved?",
      ],
      question: "Which of the following correctly describes the pre-treatment and administration protocol for AMVUTTRA?",
      choices: [
        {
          id: "c1-4a",
          text: "Premedicate with oral corticosteroid + antihistamine; check baseline vitamin A; enrol in REMS; inject abdomen only",
          correct: false,
          feedback: "Incorrect on multiple counts.",
          detail:
            "AMVUTTRA requires NO premedication. There is NO REMS requirement. Approved injection sites include abdomen, thigh, AND upper arm — not abdomen only.",
        },
        {
          id: "c1-4b",
          text: "No premedication; no REMS; supplement vitamin A at RDA (700–900 mcg/day); inject abdomen, thigh, or upper arm",
          correct: true,
          feedback: "Correct! This is the complete and accurate protocol.",
          detail:
            "AMVUTTRA protocol: (1) No premedication required. (2) No REMS. (3) Supplement ALL patients with vitamin A at RDA. (4) Approved SC injection sites: abdomen, thigh, or upper arm — rotate sites. (5) HCP-administered. (6) Enrol in Alnylam Assist® for co-pay support.",
        },
        {
          id: "c1-4c",
          text: "No premedication; check and correct vitamin A deficiency first; enrol in REMS; inject abdomen or thigh only",
          correct: false,
          feedback: "Partially correct but contains errors.",
          detail:
            "There is no REMS for AMVUTTRA. Routine baseline vitamin A testing is not required — supplementation at RDA should begin at initiation without waiting for lab results. Upper arm is also an approved injection site.",
        },
        {
          id: "c1-4d",
          text: "Premedicate with antihistamine only; no REMS; high-dose vitamin A 10,000 IU/day; inject abdomen only",
          correct: false,
          feedback: "Incorrect — high-dose vitamin A is contraindicated.",
          detail:
            "No premedication is required. High-dose vitamin A supplementation (>RDA) is explicitly NOT recommended — it risks hypervitaminosis A. The FDA PI specifies supplementation at the RDA only (700–900 mcg/day RAE).",
        },
      ],
      expertCommentary:
        "The vitamin A question is the most common clinical query from nurses initiating AMVUTTRA. The mechanism: TTR is the primary transport protein for vitamin A. When TTR is reduced by ~88%, serum vitamin A drops by ~65%. This is a predictable pharmacodynamic effect — not a deficiency requiring correction before treatment.",
      evidence: "AMVUTTRA® Prescribing Information. Alnylam Pharmaceuticals. NDA 215515. 2025.",
      keyPoint: "No premedication. No REMS. Vitamin A at RDA only — never high-dose. Rotate injection sites.",
    },
    {
      id: "c1-stage-5",
      algorithmStep: { step: 7, label: "Staging & Monitoring", hint: "Step 7 of the Dx Algorithm: NAC/Gillmore staging (NT-proBNP, eGFR) guides monitoring frequency and treatment response assessment." },
      phase: "MONITOR",
      phaseColor: "#00C2A8",
      title: "6-Month Follow-Up — Assessing Response",
      narrative:
        "Six months after initiating AMVUTTRA, Mr. Al-Rashidi returns for follow-up. He reports: dyspnoea has improved (NYHA III → II), ankle oedema resolved, and he is walking 30 minutes daily. NT-proBNP: 1,240 pg/mL (down from 2,100 pg/mL). Serum TTR: 18 mg/dL (down from 22 mg/dL). He mentions mild blurry vision in dim light that started 3 weeks ago.",
      clinicalFindings: [
        "NYHA: III → II (improved)",
        "NT-proBNP: 2,100 → 1,240 pg/mL (↓41%)",
        "Serum TTR: 22 → 18 mg/dL (↓18%, early)",
        "Echo: LV wall thickness stable (14 mm)",
        "New symptom: Mild blurry vision in dim light (3 weeks)",
        "Adherence: 2/2 doses received on schedule",
      ],
      question: "How should you manage the new visual symptom in the context of AMVUTTRA therapy?",
      choices: [
        {
          id: "c1-5a",
          text: "Reassure the patient — blurry vision is unrelated to AMVUTTRA and likely age-related",
          correct: false,
          feedback: "Incorrect. This symptom requires investigation.",
          detail:
            "Blurry vision in dim light (nyctalopia) is a classic early symptom of vitamin A deficiency. Given that AMVUTTRA reduces serum vitamin A by ~65%, this symptom must be taken seriously and referred to ophthalmology.",
        },
        {
          id: "c1-5b",
          text: "Refer to ophthalmology urgently; check serum vitamin A level; do not discontinue AMVUTTRA",
          correct: true,
          feedback: "Correct! This is the appropriate management approach.",
          detail:
            "The FDA PI states: 'Refer patients who develop signs or symptoms of vitamin A deficiency (e.g., night blindness) to an ophthalmologist.' Management: (1) Urgent ophthalmology referral. (2) Check serum vitamin A level. (3) Verify RDA supplementation compliance. (4) Do NOT discontinue AMVUTTRA.",
        },
        {
          id: "c1-5c",
          text: "Discontinue AMVUTTRA immediately and switch to tafamidis",
          correct: false,
          feedback: "Incorrect. Discontinuation is not warranted.",
          detail:
            "Discontinuing AMVUTTRA for a potentially manageable vitamin A-related visual symptom is not appropriate. The clinical response is excellent (NYHA improvement, NT-proBNP ↓41%). The correct approach is ophthalmology referral + vitamin A assessment.",
        },
        {
          id: "c1-5d",
          text: "Start high-dose vitamin A 25,000 IU/day to rapidly correct the deficiency",
          correct: false,
          feedback: "Incorrect and potentially harmful.",
          detail:
            "High-dose vitamin A supplementation is explicitly contraindicated. Doses >10,000 IU/day risk hypervitaminosis A — liver toxicity, intracranial hypertension, and paradoxically worsening visual symptoms.",
        },
      ],
      expertCommentary:
        "This case illustrates the most clinically important safety monitoring point for AMVUTTRA: vitamin A-related ocular symptoms. Night blindness (nyctalopia) is the earliest and most sensitive symptom. Key teaching: proactively ask about visual symptoms at every follow-up visit, confirm RDA supplementation compliance, and have a low threshold for ophthalmology referral.",
      evidence: "AMVUTTRA® Prescribing Information. NDA 215515. 2025 | Benson MD et al. Amyloid. 2018;25(1):1-9",
      keyPoint: "Proactively ask about visual symptoms at every follow-up — nyctalopia is the earliest sign of vitamin A deficiency.",
    },
  ],
};

// ─── Case 2 Data ──────────────────────────────────────────────────────────────
const CASE_2: CaseData = {
  id: "case-2",
  caseNumber: "Case 2",
  title: "The Switch Decision",
  subtitle: "55-year-old female · hATTR-PN (V30M) · Stage 1 neuropathy · Progressing on patisiran",
  indication: "hATTR-PN",
  indicationColor: "#8E44AD",
  difficulty: "Advanced",
  duration: "~12 min",
  patientSummary: [
    "55-year-old female, Portuguese descent",
    "Hereditary ATTR polyneuropathy (hATTR-PN) — V30M mutation confirmed",
    "Stage 1 neuropathy (ambulatory without assistance)",
    "On patisiran (ONPATTRO) 0.3 mg/kg IV Q3W for 18 months",
    "Neurological progression: NIS+7 score increased by 8 points over 12 months",
    "Increasing infusion burden — 17 infusions/year with mandatory premedication",
    "Mild autonomic symptoms: orthostatic hypotension, early satiety",
    "No cardiac involvement (ECHO normal, NT-proBNP <125 pg/mL)",
  ],
  stages: [
    {
      id: "c2-stage-1",
      algorithmStep: { step: 1, label: "Red Flags", hint: "Step 1 of the Dx Algorithm: extracardiac red flags in hATTR-PN — bilateral peripheral neuropathy, autonomic dysfunction, and family history are the key triggers for suspicion." },
      phase: "SUSPECT",
      phaseColor: "#8E44AD",
      title: "Recognising Disease Progression on Current Therapy",
      narrative:
        "Dr. Nasser is reviewing Ms. Ferreira, a 55-year-old Portuguese-descent woman with confirmed hATTR-PN (V30M mutation). She was diagnosed 2 years ago and has been on patisiran 0.3 mg/kg IV Q3W for 18 months. At today's visit, she reports worsening numbness and tingling in her feet extending to mid-calf, new difficulty with fine motor tasks (buttoning shirts), and increasing fatigue. Her NIS+7 score has increased from 18 to 26 over the past 12 months (+8 points). She is frustrated by the 17 infusions per year and the 4-drug premedication regimen required before each infusion.",
      clinicalFindings: [
        "NIS+7 score: 18 → 26 (+8 points over 12 months)",
        "New symptoms: Fine motor difficulty, mid-calf numbness",
        "Autonomic: Orthostatic hypotension (↓20 mmHg systolic on standing)",
        "Cardiac: Normal ECHO, NT-proBNP <125 pg/mL",
        "Patisiran: 18 months, 17 infusions/year, mandatory premedication",
        "Patient-reported: High treatment burden, considering discontinuation",
      ],
      question: "How should you interpret the NIS+7 progression of +8 points over 12 months on patisiran?",
      choices: [
        {
          id: "c2-1a",
          text: "This is expected variability — NIS+7 fluctuates and does not indicate true progression",
          correct: false,
          feedback: "Incorrect. An 8-point increase is clinically meaningful.",
          detail:
            "In APOLLO (patisiran pivotal trial), the placebo group progressed by ~28 points over 18 months, while patisiran patients progressed by ~6 points. An 8-point increase over 12 months on patisiran is above the expected treatment response and indicates inadequate disease control. The minimal clinically important difference (MCID) for NIS+7 is approximately 2–4 points.",
        },
        {
          id: "c2-1b",
          text: "This represents inadequate disease control on patisiran — reassess treatment strategy",
          correct: true,
          feedback: "Correct. This patient is progressing on patisiran.",
          detail:
            "An NIS+7 increase of +8 points over 12 months on patisiran exceeds the expected treatment effect and indicates inadequate disease control. Combined with increasing treatment burden (17 infusions/year, 4-drug premedication), this patient is a strong candidate for switching to AMVUTTRA (vutrisiran) — which demonstrated superior NIS+7 outcomes in HELIOS-A and offers Q3M SC dosing with no premedication.",
        },
        {
          id: "c2-1c",
          text: "Increase patisiran dose to 0.45 mg/kg to achieve better TTR suppression",
          correct: false,
          feedback: "Incorrect. Dose escalation is not an approved strategy.",
          detail:
            "Patisiran is approved at a fixed dose of 0.3 mg/kg IV Q3W. There is no approved dose escalation strategy. Increasing the dose would be off-label and would not address the fundamental issue — the patient is progressing despite adequate TTR suppression (~80% reduction). The appropriate strategy is to reassess the treatment choice.",
        },
        {
          id: "c2-1d",
          text: "Add tafamidis to patisiran to provide dual mechanism coverage",
          correct: false,
          feedback: "Incorrect. Combination therapy is not evidence-based here.",
          detail:
            "There is no evidence supporting the combination of patisiran (TTR silencer) and tafamidis (TTR stabiliser) in hATTR-PN. Tafamidis is not approved for hATTR-PN. The appropriate response to progression on patisiran is to evaluate switching to a more effective or more convenient RNAi therapy — specifically vutrisiran (AMVUTTRA).",
        },
      ],
      expertCommentary:
        "Recognising progression on an approved therapy is a critical skill for rare disease specialists. In hATTR-PN, the NIS+7 is the primary efficacy endpoint. A patient who progresses by >4–6 NIS+7 points per year on treatment should be considered for therapy reassessment. The combination of neurological progression + high treatment burden in this case creates a compelling clinical and patient-centred argument for switching to AMVUTTRA.",
      evidence: "Adams D et al. N Engl J Med. 2018;379(1):11-21 (APOLLO) | Coelho T et al. Orphanet J Rare Dis. 2012;7:74",
      keyPoint: "NIS+7 increase >4 points/year on treatment indicates inadequate disease control — reassess therapy.",
    },
    {
      id: "c2-stage-2",
      algorithmStep: { step: 4, label: "PYP Scintigraphy", hint: "Step 4 of the Dx Algorithm: PYP scan interpretation. In hATTR-PN with cardiac involvement, PYP Grade 2-3 + negative monoclonal protein confirms ATTR-CM without biopsy." },
      phase: "SCREEN",
      phaseColor: "#C0392B",
      title: "Evaluating Eligibility for AMVUTTRA Switch",
      narrative:
        "You have determined that Ms. Ferreira is progressing on patisiran and is a candidate for switching to AMVUTTRA. Before making the switch, you conduct a comprehensive eligibility and baseline assessment. Her current labs show: serum TTR 8 mg/dL (suppressed from baseline ~25 mg/dL, ~68% reduction on patisiran), vitamin A 0.9 µmol/L (low-normal), ALT 28 U/L, eGFR 82 mL/min/1.73m², and she is not pregnant (negative hCG). She asks: 'Will I need to stop patisiran before starting the new drug?'",
      clinicalFindings: [
        "Serum TTR: 8 mg/dL (~68% reduction on patisiran)",
        "Vitamin A: 0.9 µmol/L (low-normal — borderline)",
        "ALT: 28 U/L (normal)",
        "eGFR: 82 mL/min/1.73m² (normal)",
        "Pregnancy test: Negative",
        "Last patisiran infusion: 2 weeks ago",
      ],
      question: "What is the correct approach to transitioning from patisiran to AMVUTTRA?",
      choices: [
        {
          id: "c2-2a",
          text: "Stop patisiran immediately; wait 3 months for washout; then start AMVUTTRA",
          correct: false,
          feedback: "Incorrect. A 3-month washout gap is unnecessary and harmful.",
          detail:
            "A 3-month treatment gap would allow TTR levels to recover and disease to progress. There is no pharmacological reason for a washout period between patisiran and vutrisiran — both are RNAi therapies targeting TTR mRNA. The transition should be seamless to maintain continuous TTR suppression.",
        },
        {
          id: "c2-2b",
          text: "Continue patisiran until the first AMVUTTRA dose is due; administer AMVUTTRA at the next scheduled dosing interval",
          correct: true,
          feedback: "Correct! Seamless transition maintains continuous TTR suppression.",
          detail:
            "The recommended transition strategy is to administer AMVUTTRA at the time the next patisiran dose would have been due — ensuring no gap in TTR suppression. Both agents target TTR mRNA via RNAi and there is no pharmacological interaction or contraindication to this approach. Continuous TTR suppression is essential to prevent disease progression during the switch.",
        },
        {
          id: "c2-2c",
          text: "Start AMVUTTRA immediately alongside patisiran for 1 month to ensure overlap",
          correct: false,
          feedback: "Incorrect. Concurrent administration is not recommended.",
          detail:
            "There is no evidence supporting concurrent administration of patisiran and vutrisiran. Both agents suppress TTR mRNA via RNAi — concurrent use would not provide additive benefit and the safety of combination use has not been established. The correct approach is seamless sequential transition.",
        },
        {
          id: "c2-2d",
          text: "Stop patisiran; start AMVUTTRA in 6 weeks; check TTR levels before initiating",
          correct: false,
          feedback: "Incorrect. A 6-week gap risks disease progression.",
          detail:
            "A 6-week treatment gap is unnecessary and risks TTR rebound and disease progression. TTR levels are not required before initiating AMVUTTRA — the drug's efficacy does not depend on baseline TTR levels. The seamless transition approach (administer AMVUTTRA at the next scheduled patisiran interval) is the correct strategy.",
        },
      ],
      expertCommentary:
        "The patisiran-to-vutrisiran transition is increasingly common in clinical practice. The key principle is maintaining continuous TTR suppression — any treatment gap risks TTR rebound and accelerated amyloid deposition. The low vitamin A level (0.9 µmol/L) in this patient reinforces the importance of RDA supplementation from day 1 of AMVUTTRA, and ophthalmology baseline assessment is recommended given the borderline level.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA® Prescribing Information. 2025 | Coelho T et al. J Neurol. 2020;267(9):2798-2806",
      keyPoint: "Seamless transition — administer AMVUTTRA at the next scheduled patisiran dose interval to avoid any TTR rebound gap.",
    },
    {
      id: "c2-stage-3",
      algorithmStep: { step: 6, label: "Genetic Testing", hint: "Step 6 of the Dx Algorithm: the TTR variant (V30M) determines phenotype, penetrance, and cascade screening requirements for family members." },
      phase: "DIAGNOSE",
      phaseColor: "#27AE60",
      title: "Confirming the Switch Decision — Evidence Review",
      narrative:
        "You are preparing to discuss the switch to AMVUTTRA with Ms. Ferreira. She has done her own research and asks: 'My neurologist mentioned vutrisiran. How does it compare to patisiran? Is it actually better, or just more convenient?' She is particularly concerned about: (1) whether it will control her neuropathy better, (2) the cardiac risk given her family history, and (3) whether the Q3M dosing is truly as effective as Q3W.",
      clinicalFindings: [
        "Patient concern 1: Neuropathy control — NIS+7 outcomes",
        "Patient concern 2: Cardiac protection — family history of ATTR-CM",
        "Patient concern 3: Q3M efficacy vs. Q3W patisiran",
        "HELIOS-A data available for vutrisiran in hATTR-PN",
        "HELIOS-B data available for vutrisiran in ATTR-CM",
      ],
      question: "Which statement most accurately summarises AMVUTTRA's evidence vs. patisiran for this patient's concerns?",
      choices: [
        {
          id: "c2-3a",
          text: "AMVUTTRA is less effective than patisiran for neuropathy but more convenient — a trade-off decision",
          correct: false,
          feedback: "Incorrect. AMVUTTRA demonstrated non-inferior or superior neuropathy outcomes.",
          detail:
            "In HELIOS-A (vutrisiran vs. placebo, with patisiran external comparator), vutrisiran showed a 2.2-point improvement in NIS+7 vs. baseline at 9 months, compared to a 14.8-point worsening in placebo. The external comparator analysis suggested vutrisiran was non-inferior to patisiran on NIS+7. AMVUTTRA is not a 'convenience trade-off' — it offers equivalent or better neuropathy control with a dramatically simpler regimen.",
        },
        {
          id: "c2-3b",
          text: "AMVUTTRA offers equivalent neuropathy control to patisiran, superior cardiac protection (HELIOS-B), and Q3M SC dosing with no premedication",
          correct: true,
          feedback: "Correct! This is the complete and accurate evidence summary.",
          detail:
            "HELIOS-A: Vutrisiran improved NIS+7 by 2.2 points vs. baseline (placebo worsened by 14.8 points). External comparator analysis: non-inferior to patisiran on NIS+7. HELIOS-B: 28% CV composite reduction, 35% all-cause mortality reduction at 42 months — the only hATTR-PN therapy with proven cardiac mortality benefit. Dosing: 25 mg SC Q3M (4 doses/year) vs. patisiran 0.3 mg/kg IV Q3W (17 doses/year) with 4-drug premedication. TTR suppression: ~88% vs. ~80% for patisiran.",
        },
        {
          id: "c2-3c",
          text: "AMVUTTRA is only approved for ATTR-CM — it is not an option for her hATTR-PN",
          correct: false,
          feedback: "Incorrect. AMVUTTRA is approved for both indications.",
          detail:
            "AMVUTTRA received FDA approval for hATTR-PN in June 2022 (based on HELIOS-A) and for ATTR-CM in March 2025 (based on HELIOS-B). It is the only RNAi therapy approved for both hATTR-PN and ATTR-CM — making it uniquely positioned for patients like Ms. Ferreira who may develop cardiac involvement over time.",
        },
        {
          id: "c2-3d",
          text: "Q3M dosing is less effective than Q3W because TTR suppression wanes between doses",
          correct: false,
          feedback: "Incorrect. TTR suppression is sustained throughout the Q3M interval.",
          detail:
            "Vutrisiran achieves ~88% peak TTR suppression, which is maintained at steady state throughout the 3-month dosing interval. The GalNAc-siRNA conjugate's durability of effect is the key pharmacological advantage — the RISC complex continues silencing TTR mRNA for the full 3-month period. Trough TTR levels at week 12 remain >80% suppressed.",
        },
      ],
      expertCommentary:
        "The HELIOS-A external comparator analysis is a powerful selling point: vutrisiran demonstrated non-inferior NIS+7 outcomes to patisiran with 4 doses/year vs. 17 doses/year. For a patient already frustrated by treatment burden, this data directly addresses her concern. The additional cardiac protection from HELIOS-B is a bonus — particularly relevant given that ~20% of hATTR-PN patients develop cardiac involvement over time.",
      evidence: "Alnylam. HELIOS-A. N Engl J Med. 2022;387(23):2131-2142 | Fontana M et al. N Engl J Med. 2024;391(22):2119-2130",
      keyPoint: "AMVUTTRA: non-inferior to patisiran on NIS+7 + superior cardiac mortality data + 4 doses/year vs. 17 — a clear upgrade.",
    },
    {
      id: "c2-stage-4",
      algorithmStep: { step: 8, label: "Treatment Decision", hint: "Step 8 of the Dx Algorithm: in hATTR-PN progressing on patisiran, AMVUTTRA offers superior efficacy (88% TTR suppression vs 80%), SC Q3M dosing, and no premedication — a compelling switch argument." },
      phase: "TREAT",
      phaseColor: "#1A3A6B",
      title: "Initiating AMVUTTRA in hATTR-PN — Dose & Special Considerations",
      narrative:
        "Ms. Ferreira agrees to switch to AMVUTTRA. You are preparing the treatment initiation checklist. She asks several practical questions: 'My friend with ATTR-CM also takes AMVUTTRA — do we get the same dose? And I read online that I should avoid vitamin A supplements — is that true?' She also mentions she is considering pregnancy in the next 2 years.",
      clinicalFindings: [
        "Indication: hATTR-PN (V30M)",
        "Patient query: Same dose as ATTR-CM patients?",
        "Patient query: Avoid vitamin A supplements?",
        "Patient query: Pregnancy planning in 2 years",
        "Current vitamin A: 0.9 µmol/L (low-normal)",
        "Contraception: Currently using oral contraceptive pill",
      ],
      question: "Which statement correctly addresses all three of Ms. Ferreira's practical questions?",
      choices: [
        {
          id: "c2-4a",
          text: "Same dose (25 mg SC Q3M) for both indications; avoid all vitamin A supplements; AMVUTTRA is safe in pregnancy",
          correct: false,
          feedback: "Incorrect on two counts — vitamin A and pregnancy guidance.",
          detail:
            "Vitamin A supplementation at RDA is REQUIRED (not avoided) — AMVUTTRA reduces serum vitamin A by ~65% and supplementation prevents deficiency. AMVUTTRA is classified FDA Category X equivalent — it may cause fetal harm and is contraindicated in pregnancy. Effective contraception must be used during treatment.",
        },
        {
          id: "c2-4b",
          text: "Same dose (25 mg SC Q3M) for both indications; supplement vitamin A at RDA; AMVUTTRA may cause fetal harm — effective contraception required",
          correct: true,
          feedback: "Correct! All three points are accurately addressed.",
          detail:
            "Dose: AMVUTTRA 25 mg SC Q3M is the approved dose for BOTH hATTR-PN and ATTR-CM — no dose adjustment by indication. Vitamin A: Supplement at RDA (700 mcg/day for women) throughout treatment — do NOT avoid. Given her low-normal baseline (0.9 µmol/L), consider ophthalmology baseline assessment. Pregnancy: AMVUTTRA may cause fetal harm (reduced fetal vitamin A). Effective contraception is required during treatment. Discuss family planning timeline — if pregnancy is planned within 2 years, factor this into the treatment decision.",
        },
        {
          id: "c2-4c",
          text: "Different doses by indication (hATTR-PN: 25 mg; ATTR-CM: 50 mg); supplement vitamin A at RDA; contraception required",
          correct: false,
          feedback: "Incorrect — the dose is the same for both indications.",
          detail:
            "AMVUTTRA is approved at 25 mg SC Q3M for BOTH hATTR-PN and ATTR-CM. There is no dose adjustment by indication, body weight, or renal function (mild-moderate CKD). The uniform dosing simplifies clinical management and reduces prescribing errors.",
        },
        {
          id: "c2-4d",
          text: "Same dose (25 mg SC Q3M); no vitamin A supplementation needed as patisiran already depleted her stores; contraception required",
          correct: false,
          feedback: "Incorrect — vitamin A supplementation is always required.",
          detail:
            "Vitamin A supplementation at RDA is required regardless of prior therapy. Ms. Ferreira's low-normal vitamin A (0.9 µmol/L) after 18 months of patisiran actually makes supplementation MORE urgent, not less. AMVUTTRA will further reduce TTR by ~88%, driving vitamin A even lower. RDA supplementation from day 1 is essential.",
        },
      ],
      expertCommentary:
        "The pregnancy question is increasingly relevant as AMVUTTRA is approved for younger hATTR-PN patients. The FDA PI states AMVUTTRA 'may cause fetal harm' — this is a Category D-equivalent warning. For patients of childbearing potential, the discussion must include: (1) effective contraception during treatment, (2) the fact that TTR is essential for fetal vitamin A transport, and (3) the need to discuss family planning timeline before initiating therapy.",
      evidence: "AMVUTTRA® Prescribing Information. NDA 215515. 2025 | Coelho T et al. Orphanet J Rare Dis. 2012;7:74",
      keyPoint: "25 mg SC Q3M for BOTH indications. Vitamin A at RDA is required — not optional. Contraception mandatory in women of childbearing potential.",
    },
    {
      id: "c2-stage-5",
      algorithmStep: { step: 7, label: "Staging & Monitoring", hint: "Step 7 of the Dx Algorithm: NIS+7 and KCCQ are the primary monitoring endpoints for hATTR-PN. A rise of >4-6 NIS+7 points/year on treatment signals inadequate disease control." },
      phase: "MONITOR",
      phaseColor: "#00C2A8",
      title: "12-Month Follow-Up — Evaluating the Switch Outcome",
      narrative:
        "Ms. Ferreira returns 12 months after switching to AMVUTTRA. She reports: 'I feel so much better — the numbness hasn't gotten worse and I'm not dreading my treatment days anymore.' Her NIS+7 score is now 23 (down from 26 at switch, improvement of 3 points). Serum TTR: 3 mg/dL (~88% suppression from original baseline). Vitamin A: 0.7 µmol/L (low — she admits she has been inconsistent with supplementation). NT-proBNP: 118 pg/mL (stable, no cardiac involvement). She asks: 'My sister just tested positive for the V30M mutation — should she start treatment now even though she has no symptoms?'",
      clinicalFindings: [
        "NIS+7: 26 → 23 (↓3 points — stabilisation + mild improvement)",
        "Serum TTR: 3 mg/dL (~88% suppression — at target)",
        "Vitamin A: 0.7 µmol/L (low — supplementation non-compliance)",
        "NT-proBNP: 118 pg/mL (stable, no cardiac involvement)",
        "Patient satisfaction: High — treatment burden dramatically reduced",
        "Family: Sister tested V30M positive, asymptomatic",
      ],
      question: "How should you address the two key issues at this visit: the low vitamin A and the sister's asymptomatic V30M status?",
      choices: [
        {
          id: "c2-5a",
          text: "Reinforce RDA supplementation compliance; recommend the sister start AMVUTTRA immediately as a preventive measure",
          correct: false,
          feedback: "Partially correct — vitamin A management is right, but pre-symptomatic treatment guidance needs nuance.",
          detail:
            "Reinforcing RDA supplementation is correct. However, recommending immediate AMVUTTRA for an asymptomatic V30M carrier is premature. Current guidelines recommend genetic counselling, baseline neurological assessment, and monitoring — not immediate pharmacological treatment — for asymptomatic carriers. Treatment is initiated when early symptoms or biomarker changes emerge.",
        },
        {
          id: "c2-5b",
          text: "Reinforce RDA supplementation; consider ophthalmology referral for low vitamin A; refer the sister to a specialist for genetic counselling and baseline neurological assessment",
          correct: true,
          feedback: "Correct! Both issues are managed appropriately.",
          detail:
            "Vitamin A management: Vitamin A 0.7 µmol/L is below the lower limit of normal (0.9–3.5 µmol/L). Reinforce RDA supplementation compliance, consider ophthalmology referral to assess for subclinical retinal changes, and check for symptoms of deficiency (night blindness, dry eyes). Sister management: Asymptomatic V30M carriers should be referred to a specialist centre for: (1) genetic counselling, (2) baseline NIS+7 and nerve conduction studies, (3) annual monitoring. Treatment initiation is guided by symptom onset or biomarker progression — not genetic status alone.",
        },
        {
          id: "c2-5c",
          text: "Discontinue AMVUTTRA due to vitamin A deficiency; refer the sister for immediate treatment",
          correct: false,
          feedback: "Incorrect on both counts.",
          detail:
            "Discontinuing AMVUTTRA for low vitamin A is not appropriate — the clinical response is excellent (NIS+7 stabilisation, 88% TTR suppression). The correct response is to optimise supplementation and refer to ophthalmology. Immediate treatment for an asymptomatic carrier is also not guideline-concordant.",
        },
        {
          id: "c2-5d",
          text: "Increase vitamin A supplementation to 5,000 IU/day; tell the sister she does not need monitoring until symptoms appear",
          correct: false,
          feedback: "Incorrect on both counts.",
          detail:
            "High-dose vitamin A (>RDA) is contraindicated with AMVUTTRA. The correct approach is to reinforce RDA compliance and refer to ophthalmology. Asymptomatic V30M carriers absolutely require regular monitoring — annual neurological assessment and biomarker tracking are standard of care to detect early disease and optimise treatment timing.",
        },
      ],
      expertCommentary:
        "This stage highlights two real-world challenges: vitamin A compliance and the management of asymptomatic genetic carriers. Vitamin A non-compliance is common — patients often deprioritise supplements when feeling well. Proactive monitoring (annual vitamin A levels) and patient education are essential. For V30M carriers, the 'watch and wait with structured monitoring' approach is evolving — some centres are now discussing earlier intervention, but this remains an area of active clinical debate.",
      evidence: "Alnylam. HELIOS-A. N Engl J Med. 2022;387(23):2131-2142 | Conceição I et al. J Neurol. 2019;266(10):2540-2553",
      keyPoint: "Asymptomatic V30M carriers need genetic counselling + annual monitoring — not immediate treatment. Vitamin A compliance requires active reinforcement.",
    },
  ],
};

// ─── Case 3 Data ──────────────────────────────────────────────────────────────
const CASE_3: CaseData = {
  id: "case-3",
  caseNumber: "Case 3",
  title: "The Upgrade Decision",
  subtitle: "62-year-old male · wt-ATTR-CM · On tafamidis 61 mg · Considering switch to AMVUTTRA",
  indication: "ATTR-CM",
  indicationColor: "#E67E22",
  difficulty: "Advanced",
  duration: "~12 min",
  patientSummary: [
    "62-year-old male, retired accountant",
    "Wild-type ATTR cardiomyopathy (wt-ATTR-CM) — diagnosed 14 months ago",
    "On tafamidis 61 mg daily for 12 months",
    "NYHA Class II, stable — no hospitalisation since diagnosis",
    "NT-proBNP: 1,840 pg/mL (down from 2,600 pg/mL at baseline)",
    "LVEF: 52% (mildly reduced, down from 55% at diagnosis)",
    "6MWT: 380 m (down from 420 m at baseline)",
    "Asks: 'My cardiologist mentioned a new injection — should I switch?'",
  ],
  stages: [
    {
      id: "c3-stage-1",
      algorithmStep: { step: 1, label: "Red Flags", hint: "Step 1 of the Dx Algorithm: bilateral CTS requiring surgery is a high-urgency extracardiac red flag. Tenosynovial tissue from CTS surgery should be sent for Congo red staining — a missed diagnostic window." },
      phase: "SUSPECT",
      phaseColor: "#E67E22",
      title: "Assessing Disease Trajectory on Tafamidis",
      narrative:
        "Mr. Khalid is a 62-year-old retired accountant with wt-ATTR-CM, diagnosed 14 months ago. He has been on tafamidis 61 mg daily for 12 months. At today's cardiology visit, he reports stable functional status (NYHA II) with no hospitalisations. However, his 6-minute walk test has declined from 420 m to 380 m (−40 m), his LVEF has dropped from 55% to 52%, and his NT-proBNP has fallen from 2,600 to 1,840 pg/mL (a 29% reduction). His cardiologist has mentioned AMVUTTRA as a potential option. He asks: 'Am I doing well enough on tafamidis, or should I consider switching?'",
      clinicalFindings: [
        "NT-proBNP: 2,600 → 1,840 pg/mL (↓29% on tafamidis)",
        "LVEF: 55% → 52% (mild decline over 12 months)",
        "6MWT: 420 → 380 m (↓40 m — functional decline)",
        "NYHA: Class II (stable)",
        "No hospitalisations in 14 months",
        "Tafamidis: 12 months, 61 mg daily, good adherence",
      ],
      question:
        "How would you characterise Mr. Khalid's current disease trajectory on tafamidis?",
      choices: [
        {
          id: "c3-1a",
          text: "Excellent response — NT-proBNP reduction of 29% confirms tafamidis is working optimally",
          correct: false,
          feedback: "Incomplete assessment. NT-proBNP improvement alone is insufficient.",
          detail:
            "While the NT-proBNP reduction is encouraging, the overall trajectory shows mixed signals: LVEF has declined by 3% and 6MWT has dropped by 40 m — both indicators of progressive functional and structural deterioration. In ATTR-CM, tafamidis stabilises TTR tetramers but does not reduce TTR levels or amyloid deposition. Ongoing disease progression despite tafamidis is well-documented and is the rationale for considering TTR silencing therapy.",
        },
        {
          id: "c3-1b",
          text: "Partial response — NT-proBNP improved but LVEF decline and 6MWT reduction indicate ongoing disease progression",
          correct: true,
          feedback: "Correct. This is a partial response with evidence of ongoing progression.",
          detail:
            "This is the correct interpretation. Tafamidis stabilises TTR tetramers but does not eliminate the source of amyloid production. In ATTR-ACT, even patients on tafamidis showed gradual functional decline over 30 months — the drug slows but does not stop progression. The combination of LVEF decline (−3%) and 6MWT reduction (−40 m) over 12 months indicates that amyloid deposition is continuing. This patient is a strong candidate for escalation to AMVUTTRA, which silences TTR production at the source.",
        },
        {
          id: "c3-1c",
          text: "Treatment failure — tafamidis should be discontinued immediately and AMVUTTRA started",
          correct: false,
          feedback: "Too aggressive. This is partial response, not failure.",
          detail:
            "Tafamidis has provided meaningful benefit (29% NT-proBNP reduction, no hospitalisations). This is partial response, not treatment failure. The appropriate approach is to assess whether adding or switching to AMVUTTRA would provide incremental benefit — not to abruptly discontinue a drug that is providing some benefit. The HELIOS-B tafamidis subgroup data directly addresses this clinical question.",
        },
        {
          id: "c3-1d",
          text: "Insufficient data — repeat all tests in 6 months before making any treatment decision",
          correct: false,
          feedback: "Incorrect. Sufficient data exists to make a treatment decision now.",
          detail:
            "Waiting 6 months to gather more data is not appropriate when there is already evidence of functional decline (6MWT −40 m, LVEF −3%) over 12 months. ATTR-CM is a progressive disease and delayed treatment escalation has been associated with worse outcomes. The HELIOS-B data provides clear guidance on the benefit of AMVUTTRA in patients already on tafamidis.",
        },
      ],
      expertCommentary:
        "The 'partial response on tafamidis' scenario is the most common clinical situation a rare disease specialist will encounter in 2026. Tafamidis was a landmark therapy (ATTR-ACT, NEJM 2018) but it stabilises rather than silences TTR. AMVUTTRA's mechanism — reducing TTR production by >80% — addresses the root cause. The HELIOS-B tafamidis subgroup is the pivotal dataset for this conversation: it shows that even patients already on tafamidis derive significant additional benefit from vutrisiran.",
      evidence: "Maurer MS et al. N Engl J Med. 2018;379(11):1007-1016 (ATTR-ACT) | Fontana M et al. N Engl J Med. 2024;391(22):2119-2130 (HELIOS-B)",
      keyPoint: "Tafamidis slows but does not stop ATTR-CM progression — ongoing LVEF decline and 6MWT reduction indicate residual disease activity.",
    },
    {
      id: "c3-stage-2",
      algorithmStep: { step: 2, label: "Initial Workup", hint: "Step 2 of the Dx Algorithm: the initial workup panel — NT-proBNP, hs-troponin, ECG, and echocardiography — is the foundation for raising diagnostic suspicion before imaging." },
      phase: "SCREEN",
      phaseColor: "#C0392B",
      title: "Interpreting the HELIOS-B Tafamidis Subgroup Data",
      narrative:
        "You sit down with Mr. Khalid to discuss the HELIOS-B data. He has printed out a summary from the internet and asks: 'This trial tested vutrisiran against placebo — but I'm already on tafamidis, not placebo. Does the data apply to me?' You explain that HELIOS-B included a pre-specified subgroup of patients who were already on tafamidis at enrolment — approximately 50% of the trial population.",
      clinicalFindings: [
        "HELIOS-B total N: 655 patients",
        "Tafamidis subgroup: ~50% of participants on tafamidis at baseline",
        "Primary endpoint: CV composite (CV death + urgent CV hospitalisation)",
        "Key secondary endpoint: All-cause mortality",
        "Follow-up: 42 months",
        "Patient question: 'Does the benefit apply to patients already on tafamidis?'",
      ],
      question:
        "Which statement most accurately describes AMVUTTRA's benefit in the HELIOS-B tafamidis subgroup?",
      choices: [
        {
          id: "c3-2a",
          text: "AMVUTTRA showed no additional benefit in patients already on tafamidis — benefit was only in tafamidis-naive patients",
          correct: false,
          feedback: "Incorrect. The tafamidis subgroup showed consistent benefit.",
          detail:
            "The HELIOS-B tafamidis subgroup showed consistent benefit with the overall trial results. Patients already on tafamidis who added/switched to vutrisiran showed reductions in CV composite events and all-cause mortality consistent with the overall HR 0.72 and HR 0.65 results. The benefit of vutrisiran was not limited to tafamidis-naive patients.",
        },
        {
          id: "c3-2b",
          text: "AMVUTTRA showed consistent benefit regardless of tafamidis use — HR for CV composite and mortality were similar in tafamidis-treated and tafamidis-naive subgroups",
          correct: true,
          feedback: "Correct! The benefit was consistent across tafamidis subgroups.",
          detail:
            "In HELIOS-B, the pre-specified subgroup analysis by baseline tafamidis use showed consistent benefit: the HR for CV composite (0.72 overall) and all-cause mortality (0.65 overall) were directionally consistent in both the tafamidis-treated and tafamidis-naive subgroups. This directly supports the clinical decision to add or switch to AMVUTTRA in patients already on tafamidis. The mechanistic rationale is clear: tafamidis stabilises existing TTR tetramers, while vutrisiran silences new TTR production — complementary mechanisms.",
        },
        {
          id: "c3-2c",
          text: "AMVUTTRA is only approved as add-on to tafamidis, not as a replacement",
          correct: false,
          feedback: "Incorrect. AMVUTTRA is approved as monotherapy or add-on.",
          detail:
            "AMVUTTRA is FDA-approved for ATTR-CM regardless of concomitant tafamidis use. It can be used as monotherapy (replacing tafamidis) or as add-on therapy. The prescribing information does not restrict its use to either approach. The clinical decision depends on individual patient factors, tolerability, cost, and preference.",
        },
        {
          id: "c3-2d",
          text: "The tafamidis subgroup was too small to draw conclusions — the data is not applicable to this patient",
          correct: false,
          feedback: "Incorrect. The subgroup was pre-specified and adequately powered.",
          detail:
            "The tafamidis subgroup in HELIOS-B was a pre-specified analysis, not a post-hoc exploration. With ~50% of 655 patients (~328) on tafamidis at baseline, the subgroup was adequately sized to assess consistency of effect. Pre-specified subgroup analyses in large RCTs are considered reliable evidence for clinical decision-making.",
        },
      ],
      expertCommentary:
        "The HELIOS-B tafamidis subgroup is the most important dataset for the 'should I switch?' conversation. The key message: vutrisiran's benefit is additive to tafamidis — the two mechanisms are complementary (stabilise existing TTR vs. silence new TTR production). For a patient like Mr. Khalid who is partially responding to tafamidis, the HELIOS-B data provides a strong evidence-based rationale for escalation.",
      evidence: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130 | Supplementary Appendix: Tafamidis subgroup analysis",
      keyPoint: "HELIOS-B tafamidis subgroup: consistent CV composite and mortality benefit regardless of baseline tafamidis use — the benefit is additive.",
    },
    {
      id: "c3-stage-3",
      algorithmStep: { step: 4, label: "PYP Scintigraphy", hint: "Step 4 of the Dx Algorithm: Perugini Grade 3 + H/CL ≥1.5 + negative monoclonal protein = ATTR-CM confirmed without biopsy. This is the Gillmore non-biopsy pathway." },
      phase: "DIAGNOSE",
      phaseColor: "#27AE60",
      title: "Choosing the Transition Strategy: Add-On vs. Switch",
      narrative:
        "Mr. Khalid understands the HELIOS-B data and is now open to AMVUTTRA. He asks: 'Should I keep taking tafamidis and add the injection on top, or should I stop tafamidis and just take the injection?' You explain that both approaches are clinically valid and that the decision depends on several factors. His insurance covers both options, cost is not a barrier, and he is tolerating tafamidis well (no adverse effects).",
      clinicalFindings: [
        "Patient preference: Wants simplest possible regimen",
        "Tafamidis tolerability: Excellent — no adverse effects",
        "Insurance: Both options covered",
        "Adherence: Perfect — takes tafamidis daily without fail",
        "Concern: 'More pills = more to forget'",
        "Cardiac status: NYHA II, LVEF 52%, no recent hospitalisation",
      ],
      question:
        "Given Mr. Khalid's preference for simplicity and excellent tafamidis tolerability, what is the most appropriate transition strategy?",
      choices: [
        {
          id: "c3-3a",
          text: "Add AMVUTTRA to tafamidis — dual mechanism coverage provides maximum benefit",
          correct: false,
          feedback: "Reasonable, but conflicts with the patient's stated preference for simplicity.",
          detail:
            "Add-on therapy is clinically valid and supported by HELIOS-B subgroup data. However, Mr. Khalid has explicitly stated he wants the simplest possible regimen and is concerned about adherence with more medications. For a patient who is already partially responding to tafamidis and prefers simplicity, switching to AMVUTTRA monotherapy (4 SC injections/year, no daily pills) is the more patient-centred approach.",
        },
        {
          id: "c3-3b",
          text: "Switch to AMVUTTRA monotherapy — discontinue tafamidis at the first AMVUTTRA dose; aligns with patient preference for simplicity",
          correct: true,
          feedback: "Correct! Switch to monotherapy aligns with evidence and patient preference.",
          detail:
            "Switching to AMVUTTRA monotherapy is appropriate and evidence-supported. AMVUTTRA achieves ~88% TTR suppression — substantially greater than tafamidis's stabilisation mechanism. The switch eliminates the daily pill burden and replaces it with 4 SC injections/year. Discontinue tafamidis on the day of the first AMVUTTRA injection. AMVUTTRA's superior TTR reduction means the loss of tafamidis's stabilisation effect is more than compensated by the silencing mechanism.",
        },
        {
          id: "c3-3c",
          text: "Continue tafamidis alone and increase the dose to 80 mg — higher stabiliser dose may provide better control",
          correct: false,
          feedback: "Incorrect. Tafamidis 80 mg is not an approved dose for ATTR-CM.",
          detail:
            "Tafamidis is approved at 61 mg daily for ATTR-CM (ATTR-ACT used 80 mg in one arm, but the approved commercial dose is 61 mg as tafamidis meglumine or 20 mg as tafamidis free acid equivalent). Dose escalation is not an approved strategy and does not address the fundamental limitation of tafamidis — it stabilises existing TTR tetramers but does not reduce TTR production. AMVUTTRA addresses the root cause.",
        },
        {
          id: "c3-3d",
          text: "Discontinue tafamidis immediately and wait 3 months before starting AMVUTTRA to allow full washout",
          correct: false,
          feedback: "Incorrect. A washout gap risks disease progression.",
          detail:
            "There is no pharmacological reason for a washout period between tafamidis and AMVUTTRA. Tafamidis's half-life is ~60 hours — it clears within days. A 3-month gap would leave the patient without any ATTR-directed therapy, risking TTR tetramer destabilisation and accelerated amyloid deposition. The correct approach is to discontinue tafamidis on the day of the first AMVUTTRA injection — seamless transition.",
        },
      ],
      expertCommentary:
        "The add-on vs. switch decision is nuanced and should be patient-centred. For patients who are tolerating tafamidis well and have good adherence, add-on therapy maximises mechanistic coverage. For patients who prefer simplicity or have adherence concerns, switching to AMVUTTRA monotherapy is appropriate — the ~88% TTR suppression more than compensates for the loss of tafamidis stabilisation. In Mr. Khalid's case, his explicit preference for simplicity makes the switch the right choice.",
      evidence: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130 | AMVUTTRA® Prescribing Information. NDA 215515. 2025",
      keyPoint: "Add-on and switch are both valid — let patient preference, adherence profile, and cost guide the decision. No washout needed.",
    },
    {
      id: "c3-stage-4",
      algorithmStep: { step: 8, label: "Treatment Decision", hint: "Step 8 of the Dx Algorithm: early-stage ATTR-CM (NAC Stage I-II) represents the largest therapeutic window. HELIOS-B showed the greatest absolute benefit in Stage I-II patients." },
      phase: "TREAT",
      phaseColor: "#1A3A6B",
      title: "Initiating the Switch — Practical Protocol",
      narrative:
        "The decision is made: discontinue tafamidis and initiate AMVUTTRA 25 mg SC Q3M. Mr. Khalid's nurse coordinator calls you with three questions before the first injection: (1) 'He's been on tafamidis for 12 months — do we need to taper it or can we stop abruptly?' (2) 'He takes a daily multivitamin with 5,000 IU of vitamin A — is that OK?' (3) 'He travels frequently for work — can he self-inject at home?'",
      clinicalFindings: [
        "Transition plan: Discontinue tafamidis day of first AMVUTTRA injection",
        "Nurse query 1: Taper tafamidis or stop abruptly?",
        "Nurse query 2: Multivitamin with 5,000 IU vitamin A — acceptable?",
        "Nurse query 3: Can patient self-inject at home?",
        "Patient lifestyle: Frequent travel, values convenience",
        "Vitamin A status: Not checked (no baseline)",
      ],
      question:
        "Which response correctly addresses all three of the nurse's queries?",
      choices: [
        {
          id: "c3-4a",
          text: "Stop tafamidis abruptly on day 1; multivitamin 5,000 IU vitamin A is acceptable; self-injection is approved",
          correct: false,
          feedback: "Incorrect on two counts — vitamin A dose and self-injection.",
          detail:
            "Stopping tafamidis abruptly is correct — no taper is needed. However, 5,000 IU/day vitamin A (1,500 mcg RAE) exceeds the RDA (900 mcg/day for men) and approaches the tolerable upper intake level. The FDA PI specifies RDA supplementation only — high-dose vitamin A is contraindicated. AMVUTTRA is HCP-administered only — self-injection is NOT approved.",
        },
        {
          id: "c3-4b",
          text: "Stop tafamidis abruptly on day 1; switch multivitamin to RDA-level vitamin A (900 mcg/day for men); AMVUTTRA is HCP-administered only — arrange infusion centre or office visits",
          correct: true,
          feedback: "Correct! All three queries are accurately addressed.",
          detail:
            "(1) Tafamidis: Stop abruptly on the day of the first AMVUTTRA injection — no taper needed, half-life ~60 hours. (2) Vitamin A: Switch to a multivitamin containing ≤900 mcg RAE/day (the RDA for adult men). The current 5,000 IU (1,500 mcg RAE) exceeds the RDA and risks hypervitaminosis A given that AMVUTTRA will further reduce TTR-mediated vitamin A transport. (3) Administration: AMVUTTRA is HCP-administered SC injection — not approved for self-injection. Arrange quarterly office visits or infusion centre appointments. For a frequent traveller, coordinate with local healthcare providers at travel destinations if needed.",
        },
        {
          id: "c3-4c",
          text: "Taper tafamidis over 4 weeks; multivitamin 5,000 IU is acceptable; self-injection is approved for trained patients",
          correct: false,
          feedback: "Incorrect on all three counts.",
          detail:
            "No taper is needed for tafamidis — it can be stopped abruptly. 5,000 IU vitamin A exceeds the RDA and is not recommended with AMVUTTRA. AMVUTTRA is NOT approved for self-injection — it is HCP-administered only. Unlike some biologics, there is no approved patient self-injection program for AMVUTTRA.",
        },
        {
          id: "c3-4d",
          text: "Stop tafamidis abruptly; stop all vitamin A supplementation; AMVUTTRA is HCP-administered only",
          correct: false,
          feedback: "Incorrect — stopping all vitamin A supplementation is harmful.",
          detail:
            "Stopping all vitamin A supplementation is explicitly contraindicated. AMVUTTRA reduces serum vitamin A by ~65% by suppressing TTR (the primary vitamin A transport protein). Without supplementation, patients risk clinically significant vitamin A deficiency — including night blindness, dry eyes, and immune dysfunction. The correct approach is to supplement at the RDA (900 mcg/day for men), not to stop supplementation entirely.",
        },
      ],
      expertCommentary:
        "The vitamin A supplementation question is the most common practical error at AMVUTTRA initiation. Many patients already take multivitamins with high-dose vitamin A (2,500–5,000 IU) — these must be switched to RDA-level supplements. The HCP-administration requirement is also frequently misunderstood — unlike adalimumab or other self-injectable biologics, AMVUTTRA requires a healthcare professional for each injection. For frequent travellers, this requires proactive scheduling and coordination.",
      evidence: "AMVUTTRA® Prescribing Information. NDA 215515. 2025 | Institute of Medicine. Dietary Reference Intakes for Vitamin A. 2001",
      keyPoint: "Switch multivitamin to RDA-level vitamin A (≤900 mcg/day men). AMVUTTRA is HCP-administered only — no self-injection. No taper needed for tafamidis.",
    },
    {
      id: "c3-stage-5",
      algorithmStep: { step: 7, label: "Staging & Monitoring", hint: "Step 7 of the Dx Algorithm: 6MWT and KCCQ are key functional endpoints. Stable or improving scores on AMVUTTRA confirm treatment response." },
      phase: "MONITOR",
      phaseColor: "#00C2A8",
      title: "9-Month Follow-Up — Evaluating the Switch Outcome",
      narrative:
        "Nine months after switching from tafamidis to AMVUTTRA, Mr. Khalid returns for follow-up. He is enthusiastic: 'I feel much better — I'm back to playing golf twice a week.' His results: NT-proBNP 1,020 pg/mL (down from 1,840 pg/mL at switch — a further 45% reduction). LVEF: 54% (improved from 52%). 6MWT: 430 m (improved from 380 m — +50 m, above his pre-tafamidis baseline of 420 m). Serum TTR: 2.8 mg/dL (~88% suppression from original baseline). Vitamin A: 0.95 µmol/L (normal — compliant with RDA multivitamin). He asks: 'My cardiologist says my heart function has actually improved — is that expected?'",
      clinicalFindings: [
        "NT-proBNP: 1,840 → 1,020 pg/mL (↓45% since switch; ↓61% from original baseline)",
        "LVEF: 52% → 54% (improved — reversal of prior decline)",
        "6MWT: 380 → 430 m (+50 m — above pre-tafamidis baseline)",
        "Serum TTR: 2.8 mg/dL (~88% suppression at steady state)",
        "Vitamin A: 0.95 µmol/L (normal — RDA compliance confirmed)",
        "Patient-reported: Resumed golf, improved exercise tolerance",
      ],
      question:
        "How should you explain the LVEF improvement and 6MWT recovery to Mr. Khalid, and what does this mean for his ongoing management?",
      choices: [
        {
          id: "c3-5a",
          text: "LVEF improvement is unexpected and suggests a measurement error — repeat echo to confirm",
          correct: false,
          feedback: "Incorrect. LVEF improvement is consistent with HELIOS-B findings.",
          detail:
            "LVEF improvement is not unexpected — it is consistent with the HELIOS-B OLE data, which showed that patients on vutrisiran demonstrated improvements in cardiac structure and function over time. The mechanism: by suppressing TTR production by ~88%, vutrisiran dramatically reduces new amyloid deposition, allowing the myocardium to partially recover from the amyloid burden. Repeat echo is not needed to 'confirm' — the result is clinically plausible and consistent with the drug's mechanism.",
        },
        {
          id: "c3-5b",
          text: "LVEF improvement and 6MWT recovery are consistent with HELIOS-B OLE data — vutrisiran's ~88% TTR suppression reduces new amyloid deposition, allowing partial myocardial recovery; continue AMVUTTRA and monitor annually",
          correct: true,
          feedback: "Correct! This is the accurate and evidence-based explanation.",
          detail:
            "HELIOS-B OLE (ESC 2025) showed that patients on vutrisiran demonstrated improvements in KCCQ, 6MWT, and biomarkers over 42+ months — with early-start patients showing better outcomes than crossover patients, reinforcing the benefit of early initiation. The mechanism of LVEF improvement: ~88% TTR suppression dramatically reduces new amyloid fibril formation, allowing the myocardium to partially remodel. This is a fundamentally different outcome from tafamidis, which stabilises but does not reduce amyloid burden. Continue AMVUTTRA Q3M, annual echo, annual 6MWT, and 6-monthly NT-proBNP and TTR levels.",
        },
        {
          id: "c3-5c",
          text: "The improvement is due to residual tafamidis effect — it will plateau once tafamidis fully clears",
          correct: false,
          feedback: "Incorrect. Tafamidis cleared within days of discontinuation.",
          detail:
            "Tafamidis has a half-life of ~60 hours — it would have fully cleared within 1–2 weeks of discontinuation. The improvements seen at 9 months are attributable to AMVUTTRA's sustained ~88% TTR suppression, not residual tafamidis. The trajectory of improvement (LVEF 52% → 54%, 6MWT +50 m) is consistent with AMVUTTRA's mechanism of reducing new amyloid deposition over time.",
        },
        {
          id: "c3-5d",
          text: "Since the patient is doing so well, reduce AMVUTTRA to Q6M dosing to minimise long-term exposure",
          correct: false,
          feedback: "Incorrect. Dose interval modification is not approved.",
          detail:
            "AMVUTTRA is approved at 25 mg SC Q3M — this dosing interval is not modifiable. Extending to Q6M would result in TTR rebound between doses, loss of sustained suppression, and potential disease progression. The Q3M interval is specifically designed to maintain steady-state TTR suppression throughout the dosing period. Dose reduction or interval extension is not supported by evidence and risks loss of efficacy.",
        },
      ],
      expertCommentary:
        "The LVEF and 6MWT improvement in this case is one of the most powerful clinical messages for AMVUTTRA: it is the only ATTR-CM therapy with evidence of functional improvement (not just stabilisation). The HELIOS-B OLE data showing that early-start patients outperform late-start (crossover) patients is the strongest argument for not waiting — every month of delayed initiation means more amyloid deposition and less potential for recovery. This patient's outcome — returning to golf above his pre-tafamidis baseline — is exactly the kind of result that resonates with both patients and HCPs.",
      evidence: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130 | HELIOS-B OLE. ESC Congress 2025 | Maurer MS et al. N Engl J Med. 2018;379(11):1007-1016",
      keyPoint: "AMVUTTRA is the only ATTR-CM therapy with evidence of functional improvement — not just stabilisation. Early initiation maximises recovery potential.",
    },
  ],
};

// ─── Case 4 Data ──────────────────────────────────────────────────────────────
const CASE_4: CaseData = {
  id: "case-4",
  caseNumber: "Case 4",
  title: "The Pre-Symptomatic Decision",
  subtitle: "42-year-old female, asymptomatic V30M carrier, asking about prophylactic treatment",
  indication: "hATTR-PN",
  indicationColor: "#8E44AD",
  difficulty: "Expert",
  duration: "~15 min",
  patientSummary: [
    "42-year-old female, software engineer",
    "Confirmed V30M TTR mutation (genetic testing after father diagnosed with hATTR-PN Stage 2)",
    "Completely asymptomatic — no neuropathy, no cardiac symptoms",
    "NIS+7 = 0, echocardiogram normal, Holter normal",
    "Highly health-literate, researched vutrisiran online",
    "Asks: 'Should I start treatment now before symptoms appear?'",
  ],
  stages: [
    {
      id: "c4-s1",
      algorithmStep: { step: 1, label: "Red Flags", hint: "Step 1 of the Dx Algorithm: recognising the red flag cluster in the clinical context — the combination of cardiac and extracardiac findings drives the index of suspicion." },
      phase: "ASSESS",
      phaseColor: "#8E44AD",
      title: "Establishing the Clinical Context",
      narrative:
        "Dr. Yamamoto, a neurologist at a tertiary referral centre, is seeing Layla for the first time. She was referred by her GP after genetic testing confirmed V30M following her father's diagnosis. She has done extensive research and arrives with printed papers about vutrisiran and prophylactic treatment. She is anxious but highly informed. Her full neurological examination is normal. NIS+7 = 0. Baseline nerve conduction studies are within normal limits. Echocardiogram shows no features of cardiac amyloidosis. She asks directly: 'My father was diagnosed at Stage 2 and lost the ability to walk within 3 years. I want to start treatment now. Is that possible?'",
      clinicalFindings: [
        "NIS+7: 0 (normal)",
        "Nerve conduction studies: normal",
        "Echocardiogram: normal, no amyloid features",
        "Holter monitor: normal sinus rhythm",
        "Serum TTR: normal level, confirmed V30M mutation",
        "Family history: father Stage 2 hATTR-PN, diagnosed age 52",
      ],
      question:
        "Layla asks whether she should start AMVUTTRA now, before symptoms develop. What is the most clinically appropriate and evidence-based response?",
      choices: [
        {
          id: "c4-s1-a",
          text: "AMVUTTRA is only approved for symptomatic hATTR-PN — you don't qualify yet. Come back when symptoms develop.",
          correct: false,
          feedback: "Clinically accurate but dismissive — and misses the nuance of the evidence.",
          detail:
            "While AMVUTTRA's current FDA approval is for symptomatic hATTR-PN (Stage 1 and 2), the response is dismissive and fails to engage with the legitimate clinical question about pre-symptomatic treatment. The HELIOS-A trial included a Stage 0 subgroup (asymptomatic carriers), and the emerging evidence on early intervention is an important part of this conversation. A neurologist should engage with the evidence, not simply cite the label.",
        },
        {
          id: "c4-s1-b",
          text: "Your question is clinically important and the evidence is evolving. AMVUTTRA is currently approved for symptomatic hATTR-PN (Stage 1 and 2). The HELIOS-A trial included a small Stage 0 subgroup, and the data suggests that earlier intervention may preserve nerve function better than waiting. However, off-label prophylactic treatment in an asymptomatic carrier is a complex decision that requires a detailed discussion about the benefit-risk balance, genetic counselling, and your personal goals. Let's work through this together.",
          correct: true,
          feedback: "Excellent — evidence-informed, honest about the label, and patient-centred.",
          detail:
            "This response correctly acknowledges the current FDA approval boundary (symptomatic Stage 1/2), references the HELIOS-A Stage 0 subgroup data as emerging evidence, and frames the decision as a collaborative process requiring genetic counselling and shared decision-making. It validates Layla's question without overclaiming or dismissing. This is the gold standard response for a complex pre-symptomatic treatment decision.",
        },
        {
          id: "c4-s1-c",
          text: "Yes, you should start AMVUTTRA now — the earlier the better. I'll write the prescription today.",
          correct: false,
          feedback: "Overclaims the evidence and bypasses essential shared decision-making.",
          detail:
            "Prescribing AMVUTTRA off-label to an asymptomatic carrier without a thorough discussion of the benefit-risk balance, genetic counselling, and the patient's informed consent is clinically inappropriate. While early intervention may be beneficial, the decision to treat an asymptomatic patient with a $400,000/year therapy requires careful shared decision-making, not a same-day prescription.",
        },
        {
          id: "c4-s1-d",
          text: "We should repeat your nerve conduction studies every 6 months and start treatment when you develop the first signs of neuropathy.",
          correct: false,
          feedback: "Reasonable monitoring plan, but doesn't engage with the pre-symptomatic treatment question.",
          detail:
            "A 6-monthly monitoring protocol is appropriate, but the response avoids the patient's direct question about prophylactic treatment. Layla has done her research and deserves a substantive answer about the evidence for and against early intervention. Simply deferring to monitoring without discussing the treatment question is a missed opportunity for shared decision-making.",
        },
      ],
      expertCommentary:
        "The pre-symptomatic treatment question is one of the most nuanced in the hATTR-PN field. The HELIOS-A Stage 0 subgroup (n=27) showed that asymptomatic carriers who received vutrisiran maintained NIS+7 near baseline, while placebo patients showed early NIS+7 worsening — suggesting that amyloid deposition begins before clinical symptoms. However, this is a small subgroup, and the benefit-risk calculation for a healthy 42-year-old starting a $400,000/year therapy with 65% vitamin A reduction is genuinely complex. The correct approach is evidence-informed shared decision-making, not a reflexive 'not yet' or an immediate prescription.",
      evidence: "Adams D et al. N Engl J Med. 2023;388(25):2353-2363 (HELIOS-A) | Coelho T et al. Neurology. 2021;97(21):e2136-e2146 | Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025",
      keyPoint: "Pre-symptomatic V30M carriers represent an emerging treatment frontier — the HELIOS-A Stage 0 subgroup data supports early intervention, but shared decision-making and genetic counselling are essential.",
    },
    {
      id: "c4-s2",
      algorithmStep: { step: 6, label: "Genetic Testing", hint: "Step 6 of the Dx Algorithm: TTR genotyping determines hATTR vs wtATTR and triggers cascade screening. The Ile68Leu variant is particularly relevant in Saudi Arabia and the Middle East." },
      phase: "COUNSEL",
      phaseColor: "#3498DB",
      title: "Genetic Counselling and Family Planning",
      narrative:
        "During the consultation, Layla reveals that she is planning to start a family within the next 2 years. She asks two questions: (1) What is the risk of passing V30M to her children? and (2) Can she take AMVUTTRA during pregnancy if she decides to start treatment now?",
      clinicalFindings: [
        "V30M: autosomal dominant inheritance",
        "Each child has 50% risk of inheriting the mutation",
        "AMVUTTRA Pregnancy Category: Contraindicated (fetal harm — TTR is essential for fetal vitamin A transport)",
        "Vitamin A reduction ~65% — teratogenic risk in pregnancy",
        "Pre-implantation genetic diagnosis (PGD) available",
      ],
      question:
        "How do you counsel Layla on the genetic inheritance risk and the safety of AMVUTTRA during pregnancy?",
      choices: [
        {
          id: "c4-s2-a",
          text: "V30M is autosomal dominant — each child has a 50% risk. AMVUTTRA is contraindicated in pregnancy because it reduces vitamin A, which is essential for fetal development. If she plans to start treatment, she should complete her family first or use effective contraception throughout treatment.",
          correct: true,
          feedback: "Accurate, complete, and appropriately counsels on both inheritance and pregnancy safety.",
          detail:
            "This response correctly explains the autosomal dominant inheritance pattern (50% risk per child), the mechanism of AMVUTTRA's pregnancy contraindication (TTR is the primary vitamin A transport protein — 65% reduction creates teratogenic risk), and the practical implication for family planning. Recommending completion of family planning before starting treatment or use of effective contraception is the clinically appropriate guidance.",
        },
        {
          id: "c4-s2-b",
          text: "The inheritance risk is 50%. AMVUTTRA is probably safe in pregnancy — the vitamin A reduction is manageable with supplementation.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA is contraindicated in pregnancy, not 'probably safe'.",
          detail:
            "AMVUTTRA is explicitly contraindicated in pregnancy. The 65% reduction in serum vitamin A is not manageable with supplementation during pregnancy — vitamin A supplementation above the RDA is itself teratogenic. The prescribing information states that AMVUTTRA may cause fetal harm and that females of reproductive potential must use effective contraception. Describing it as 'probably safe' is a serious clinical error.",
        },
        {
          id: "c4-s2-c",
          text: "The inheritance risk is 25% — V30M has incomplete penetrance.",
          correct: false,
          feedback: "Incorrect — V30M is autosomal dominant with 50% inheritance risk per child.",
          detail:
            "V30M TTR mutation is autosomal dominant — each child of an affected carrier has a 50% probability of inheriting the mutation, not 25%. While penetrance varies by geographic origin (Portuguese V30M has near-complete penetrance; Swedish V30M has lower penetrance), the inheritance probability is always 50% for an autosomal dominant mutation. Telling a patient the risk is 25% will lead to under-appreciation of the family planning implications.",
        },
        {
          id: "c4-s2-d",
          text: "She should consider pre-implantation genetic diagnosis (PGD) to select unaffected embryos — this eliminates the inheritance risk entirely.",
          correct: false,
          feedback: "PGD is a valid option but doesn't answer the AMVUTTRA pregnancy safety question.",
          detail:
            "Pre-implantation genetic diagnosis is a legitimate option for carriers who wish to avoid passing V30M to their children, and it should be mentioned as part of comprehensive genetic counselling. However, the response doesn't address the AMVUTTRA pregnancy contraindication, which is the most clinically urgent part of the question. A complete response addresses both the inheritance risk and the treatment safety question.",
        },
      ],
      expertCommentary:
        "Family planning is a critical component of the pre-symptomatic treatment discussion for a 42-year-old female V30M carrier. AMVUTTRA's pregnancy contraindication is absolute — not a relative contraindication. The mechanism is important to understand: TTR is the primary vitamin A transport protein, and 65% suppression of TTR creates a state of functional vitamin A deficiency that is teratogenic. This is not manageable with supplementation. The practical clinical guidance is: complete family planning before starting treatment, or use highly effective contraception throughout. PGD is a valuable option for carriers who wish to have biological children without passing the mutation.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | Coelho T et al. Neurology. 2021 | ACMG Guidelines for Genetic Counselling in Hereditary Amyloidosis. 2023",
      keyPoint: "AMVUTTRA is contraindicated in pregnancy — the 65% vitamin A reduction is teratogenic. Family planning must be completed before starting treatment, or effective contraception used throughout.",
    },
    {
      id: "c4-s3",
      algorithmStep: { step: 8, label: "Treatment Decision", hint: "Step 8 of the Dx Algorithm: evidence-based treatment selection. AMVUTTRA's dual indication (ATTR-CM + hATTR-PN) is a key differentiator in mixed-phenotype hATTR patients." },
      phase: "EVIDENCE",
      phaseColor: "#27AE60",
      title: "Reviewing the Stage 0 Evidence",
      narrative:
        "Layla has decided she wants to delay pregnancy for now and is seriously considering starting treatment. She asks you to walk her through the evidence for treating asymptomatic V30M carriers. She has read a paper about the HELIOS-A trial and asks specifically: 'The paper says there was a Stage 0 subgroup — what did it show?'",
      clinicalFindings: [
        "HELIOS-A Stage 0 subgroup: n=27 (18 vutrisiran, 9 placebo)",
        "NIS+7 at 9 months: vutrisiran +0.3 vs. placebo +3.1 (early worsening in placebo)",
        "TTR suppression in Stage 0: ~88% (consistent with overall trial)",
        "Limitation: small subgroup, not powered for statistical significance",
        "Ongoing: HELIOS-A OLE Stage 0 data expected 2026",
      ],
      question:
        "How do you accurately summarise the HELIOS-A Stage 0 subgroup data for Layla?",
      choices: [
        {
          id: "c4-s3-a",
          text: "The Stage 0 subgroup showed that vutrisiran prevented all neuropathy progression in asymptomatic carriers — the evidence for prophylactic treatment is very strong.",
          correct: false,
          feedback: "Overclaims — the subgroup was small and not powered for statistical significance.",
          detail:
            "The HELIOS-A Stage 0 subgroup (n=27) showed a trend toward preserved NIS+7 with vutrisiran vs. early worsening in placebo, but the subgroup was too small to be statistically powered. Claiming the evidence is 'very strong' or that it 'prevented all neuropathy progression' is an overclaim that could mislead a patient making a high-stakes treatment decision. Accurate representation of the evidence — including its limitations — is essential for informed consent.",
        },
        {
          id: "c4-s3-b",
          text: "The Stage 0 subgroup included 27 patients — 18 on vutrisiran and 9 on placebo. At 9 months, vutrisiran patients maintained near-baseline NIS+7 (+0.3 points) while placebo patients showed early worsening (+3.1 points). This suggests that amyloid-mediated nerve damage begins before clinical symptoms appear, and that early intervention may slow this subclinical progression. However, the subgroup is small and not statistically powered — it's hypothesis-generating, not definitive. The HELIOS-A open-label extension data for Stage 0 patients is expected in 2026 and will provide more robust evidence.",
          correct: true,
          feedback: "Accurate, balanced, and appropriately contextualises the limitations.",
          detail:
            "This response provides the exact subgroup data (n=27, NIS+7 +0.3 vs. +3.1), explains the clinical implication (subclinical nerve damage before symptoms), and critically acknowledges the limitation (small, underpowered subgroup). Mentioning the OLE data expected in 2026 shows up-to-date knowledge and gives Layla a timeline for more robust evidence. This is the gold standard for communicating emerging evidence to a health-literate patient.",
        },
        {
          id: "c4-s3-c",
          text: "The Stage 0 data is not relevant to your decision — it's too small to be meaningful. We should wait for larger trials.",
          correct: false,
          feedback: "Dismissive — the Stage 0 data is hypothesis-generating and clinically relevant.",
          detail:
            "While the Stage 0 subgroup is small and underpowered, dismissing it as 'not relevant' is incorrect. The trend toward preserved NIS+7 with early intervention is clinically meaningful and informs the shared decision-making process. A patient making a decision about prophylactic treatment deserves to know what the available evidence shows, including its limitations — not a dismissal of the data.",
        },
        {
          id: "c4-s3-d",
          text: "The HELIOS-A trial showed that vutrisiran significantly improved NIS+7 vs. placebo — that's the evidence you need.",
          correct: false,
          feedback: "Correct for the overall trial but doesn't address the Stage 0 subgroup question.",
          detail:
            "The overall HELIOS-A NIS+7 result (−2.2 vs. +14.8 at 9 months) is the primary efficacy endpoint for symptomatic Stage 1/2 patients. Layla specifically asked about the Stage 0 subgroup — citing the overall trial result without addressing the Stage 0 data doesn't answer her question and misses the opportunity to discuss the pre-symptomatic evidence.",
        },
      ],
      expertCommentary:
        "The HELIOS-A Stage 0 subgroup is one of the most important emerging datasets in the hATTR-PN field. The finding that placebo patients showed NIS+7 worsening even at Stage 0 (+3.1 points at 9 months) challenges the assumption that asymptomatic carriers are truly 'pre-disease' — amyloid deposition and subclinical nerve damage appear to begin well before clinical symptoms. This has profound implications for the optimal timing of treatment initiation. The HELIOS-A OLE Stage 0 data expected in 2026 will be a landmark dataset. For now, the correct clinical stance is: acknowledge the hypothesis-generating evidence, discuss the benefit-risk balance, and engage in shared decision-making.",
      evidence: "Adams D et al. N Engl J Med. 2023;388(25):2353-2363 (HELIOS-A Stage 0 subgroup) | Coelho T et al. Neurology. 2021 | Ando Y et al. Orphanet J Rare Dis. 2022",
      keyPoint: "HELIOS-A Stage 0 subgroup: vutrisiran maintained NIS+7 near baseline (+0.3) vs. early worsening in placebo (+3.1) — suggesting subclinical nerve damage begins before symptoms. Small subgroup (n=27); OLE data expected 2026.",
    },
    {
      id: "c4-s4",
      algorithmStep: { step: 8, label: "Treatment Decision", hint: "Step 8 of the Dx Algorithm: the treatment decision in complex cases requires balancing efficacy, safety, dosing convenience, and patient preference. Review the drug comparison grid." },
      phase: "DECIDE",
      phaseColor: "#F0A500",
      title: "Shared Decision-Making and Treatment Initiation",
      narrative:
        "After a thorough discussion, Layla decides she wants to start treatment. She understands the off-label nature of the decision, the pregnancy contraindication, and the vitamin A monitoring requirements. She asks: 'If I start now, what exactly do I need to do before the first injection, and what does the treatment look like?'",
      clinicalFindings: [
        "Decision: off-label prophylactic treatment, fully informed consent documented",
        "Pre-treatment checklist required before first injection",
        "Dose: AMVUTTRA 25 mg SC Q3M (same as symptomatic patients)",
        "No dose adjustment for asymptomatic status",
        "Effective contraception confirmed (IUD in place)",
      ],
      question:
        "What is the correct pre-treatment protocol before Layla's first AMVUTTRA injection?",
      choices: [
        {
          id: "c4-s4-a",
          text: "No special pre-treatment workup is needed for an asymptomatic patient — just write the prescription and start.",
          correct: false,
          feedback: "Incorrect — the pre-treatment protocol applies regardless of symptomatic status.",
          detail:
            "The AMVUTTRA pre-treatment protocol (baseline vitamin A, ophthalmology referral, RDA supplementation, effective contraception confirmation) applies to all patients, including asymptomatic carriers. Skipping the baseline vitamin A level means you have no reference point for monitoring the 65% reduction. Skipping the ophthalmology referral means subclinical vitamin A deficiency (nyctalopia, dry eyes) may go undetected.",
        },
        {
          id: "c4-s4-b",
          text: "Before the first injection: (1) Baseline serum vitamin A level; (2) Ophthalmology referral for baseline visual assessment; (3) Confirm RDA vitamin A supplementation started (900 mcg/day — check her multivitamin); (4) Confirm effective contraception (she has an IUD — document this); (5) Baseline NIS+7 and nerve conduction studies for future monitoring reference. Then: AMVUTTRA 25 mg SC administered by HCP, no premedication required. Schedule next injection in 3 months.",
          correct: true,
          feedback: "Complete and correct — the full pre-treatment protocol applied appropriately.",
          detail:
            "This response covers all five pre-treatment steps: baseline vitamin A (reference point for monitoring), ophthalmology referral (baseline visual acuity for nyctalopia monitoring), RDA supplementation confirmation (900 mcg/day — not high-dose), contraception documentation (IUD confirmed), and baseline NIS+7/NCS (critical for an asymptomatic patient to detect early subclinical change). The administration details (25 mg SC, no premedication, Q3M) are correct.",
        },
        {
          id: "c4-s4-c",
          text: "Start with a lower dose — 12.5 mg SC Q3M — since she's asymptomatic and we want to minimise side effects.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA has only one approved dose: 25 mg SC Q3M.",
          detail:
            "AMVUTTRA is approved at a single fixed dose of 25 mg SC Q3M. There is no approved lower dose, and dose reduction is not supported by evidence. The 25 mg dose was specifically selected to achieve the ~88% TTR suppression required for sustained clinical benefit. A 12.5 mg dose would result in subtherapeutic TTR suppression and loss of efficacy.",
        },
        {
          id: "c4-s4-d",
          text: "She needs to enrol in the REMS programme before starting treatment.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA does not have a REMS programme.",
          detail:
            "AMVUTTRA does not require REMS enrolment. This is one of its key advantages over patisiran (which also has no REMS) and over older therapies. Telling a patient they need to enrol in a REMS programme creates an unnecessary barrier and is factually incorrect. The correct pre-treatment steps are the vitamin A protocol, ophthalmology referral, contraception confirmation, and baseline assessments.",
        },
      ],
      expertCommentary:
        "The pre-treatment protocol for an asymptomatic carrier starting AMVUTTRA is identical to that for symptomatic patients — the vitamin A monitoring requirements, ophthalmology referral, and contraception documentation apply regardless of disease stage. The additional step for an asymptomatic patient is establishing a robust baseline: NIS+7 = 0 and normal NCS provide the reference point for detecting any future subclinical change. This baseline documentation is also important for insurance and off-label prescribing justification.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | Adams D et al. N Engl J Med. 2023 | Coelho T et al. Neurology. 2021",
      keyPoint: "The AMVUTTRA pre-treatment protocol (baseline vitamin A, ophthalmology, RDA supplementation, contraception) applies to all patients. For asymptomatic carriers, also document baseline NIS+7 and NCS as reference points.",
    },
    {
      id: "c4-s5",
      algorithmStep: { step: 7, label: "Staging & Monitoring", hint: "Step 7 of the Dx Algorithm: monitoring biomarkers (NT-proBNP, hs-troponin, eGFR) and functional endpoints (6MWT, KCCQ) track disease trajectory and treatment response." },
      phase: "MONITOR",
      phaseColor: "#00C2A8",
      title: "12-Month Follow-Up — Monitoring and Emerging Challenges",
      narrative:
        "Layla has completed 4 quarterly injections over 12 months. She remains asymptomatic — NIS+7 = 0, NCS normal. Her vitamin A level at 6 months was 0.35 mg/L (reduced from baseline 0.55 mg/L — a 36% reduction). At the 12-month visit, she reports that she has been taking a high-dose vitamin A supplement (10,000 IU/day) because she read online that 'more is better' for vitamin A replacement. She also asks whether her 16-year-old daughter should be tested for the V30M mutation.",
      clinicalFindings: [
        "NIS+7 at 12 months: 0 (stable — no subclinical progression)",
        "Vitamin A at 12 months: 0.38 mg/L (baseline 0.55 mg/L — 31% reduction)",
        "Patient self-medicating with 10,000 IU/day vitamin A supplement",
        "Ophthalmology: normal visual acuity, no nyctalopia",
        "Daughter: 16 years old, asymptomatic, no testing done",
      ],
      question:
        "How do you address the high-dose vitamin A self-supplementation and the question about testing Layla's daughter?",
      choices: [
        {
          id: "c4-s5-a",
          text: "The high-dose vitamin A is fine — more supplementation is better to counteract the AMVUTTRA-related reduction. For the daughter, she can be tested at any age.",
          correct: false,
          feedback: "Both statements are incorrect — high-dose vitamin A is toxic, and paediatric testing requires careful ethical consideration.",
          detail:
            "High-dose vitamin A supplementation (10,000 IU/day = ~3,000 mcg/day) is toxic — the tolerable upper limit is 3,000 mcg/day for adults, and chronic excess causes hepatotoxicity, bone toxicity, and teratogenicity. The correct dose is RDA: 900 mcg/day (3,000 IU/day). Regarding paediatric genetic testing: testing a minor for an adult-onset disease raises significant ethical issues — the child cannot give informed consent, and a positive result may cause psychological harm without immediate clinical benefit. Most genetics guidelines recommend deferring predictive testing for adult-onset conditions until the individual can consent as an adult.",
        },
        {
          id: "c4-s5-b",
          text: "Stop the high-dose supplement immediately — 10,000 IU/day (3,000 mcg) is at the tolerable upper limit for vitamin A and risks toxicity with chronic use. The correct dose is RDA: 900 mcg/day (3,000 IU/day). For her daughter: predictive genetic testing in a minor for an adult-onset condition is ethically complex. Most genetics guidelines recommend deferring testing until the child can give informed consent as an adult, typically at 18. Refer to a genetic counsellor for a family discussion.",
          correct: true,
          feedback: "Correct on both counts — addresses the toxicity risk and the ethical dimension of paediatric testing.",
          detail:
            "This response correctly identifies the toxicity risk of 10,000 IU/day vitamin A (at the tolerable upper limit, chronic excess causes hepatotoxicity and bone toxicity), provides the correct RDA dose (900 mcg/day = 3,000 IU/day), and addresses the paediatric testing question with appropriate ethical nuance. Referring to a genetic counsellor for the family discussion is the correct clinical pathway. This response demonstrates the breadth of knowledge required for managing a pre-symptomatic carrier on long-term treatment.",
        },
        {
          id: "c4-s5-c",
          text: "Reduce the supplement to 5,000 IU/day — that's a safer middle ground. For the daughter, she should be tested now so she can plan her future.",
          correct: false,
          feedback: "5,000 IU/day is still above the RDA — the correct dose is 900 mcg/day (3,000 IU/day).",
          detail:
            "5,000 IU/day (1,500 mcg/day) is above the RDA of 900 mcg/day but below the tolerable upper limit. While it reduces the toxicity risk compared to 10,000 IU/day, the correct guidance is to take the RDA dose — not a 'middle ground'. Regarding the daughter: testing a 16-year-old for an adult-onset condition without her being able to give fully informed adult consent raises ethical concerns that should be addressed by a genetic counsellor, not resolved by a simple 'test her now'.",
        },
        {
          id: "c4-s5-d",
          text: "The vitamin A level at 12 months (0.38 mg/L) is within normal range — no action needed on the supplementation. For the daughter, the decision is entirely up to the family.",
          correct: false,
          feedback: "Incorrect — the patient is self-medicating with a potentially toxic dose, which requires intervention regardless of the current level.",
          detail:
            "Even if the current vitamin A level appears acceptable, the patient is taking 10,000 IU/day — which is at the tolerable upper limit and risks chronic toxicity. The correct action is to correct the dose to RDA (900 mcg/day) to prevent future toxicity. Saying 'no action needed' because the current level is acceptable ignores the risk of continued high-dose supplementation. Regarding the daughter: 'the decision is entirely up to the family' abdicates the physician's responsibility to provide ethical guidance on paediatric predictive genetic testing.",
        },
      ],
      expertCommentary:
        "This final stage tests two advanced competencies: vitamin A toxicology and the ethics of paediatric predictive genetic testing. The vitamin A toxicology point is critical: patients often assume 'more is better' for replacement therapy, but vitamin A has a narrow therapeutic window. The RDA (900 mcg/day = 3,000 IU/day) is the correct dose — not a high-dose supplement. The paediatric testing question is one of the most ethically nuanced in genetics: testing a minor for an adult-onset condition deprives them of the right to decide as an adult whether they want to know their genetic status. Most ACMG and European genetics guidelines recommend deferring predictive testing for adult-onset conditions until the individual can consent. A genetic counsellor referral is the appropriate next step.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | ACMG Guidelines: Genetic Testing in Minors. 2023 | Institute of Medicine. Dietary Reference Intakes for Vitamin A. 2001",
      keyPoint: "Vitamin A RDA = 900 mcg/day (3,000 IU/day) — high-dose supplementation is toxic. Predictive genetic testing in minors for adult-onset conditions is ethically complex — defer to genetic counselling and adult consent.",
    },
  ],
};

// ─── Case 5 Data ──────────────────────────────────────────────────────────────
const CASE_5: CaseData = {
  id: "case-5",
  caseNumber: "Case 5",
  title: "The Renal Comorbidity",
  subtitle: "65-year-old male with ATTR-CM + CKD Stage 3 — does he need a dose adjustment?",
  indication: "ATTR-CM",
  indicationColor: "#E67E22",
  difficulty: "Intermediate",
  duration: "~12 min",
  patientSummary: [
    "65-year-old male, retired engineer, Riyadh",
    "wt-ATTR-CM confirmed by Tc-PYP Grade 3 + negative haematologic workup",
    "NYHA Class II, LVEF 48%, 6MWT 320m",
    "CKD Stage 3a: eGFR 48 mL/min/1.73m² (stable for 2 years)",
    "Concomitant medications: furosemide 40mg, bisoprolol 5mg, spironolactone 25mg",
    "Nephrologist asks: 'Is AMVUTTRA safe with his kidney function? Does he need a lower dose?'",
  ],
  stages: [
    {
      id: "c5-s1",
      algorithmStep: { step: 2, label: "Initial Workup", hint: "Step 2 of the Dx Algorithm: the initial workup panel establishes the diagnostic baseline. Echocardiographic findings (wall thickness, strain pattern) are critical for raising ATTR suspicion." },
      phase: "ASSESS",
      phaseColor: "#E67E22",
      title: "Evaluating Renal Function and Dosing",
      narrative:
        "Dr. Al-Rashidi, a cardiologist at King Faisal Specialist Hospital, has confirmed wt-ATTR-CM in this 65-year-old retired engineer. The patient has stable CKD Stage 3a (eGFR 48) and is well-controlled on standard heart failure therapy. The nephrologist has sent a query: 'Is AMVUTTRA renally cleared? Does the eGFR of 48 require dose adjustment or is the standard 25 mg Q3M dose appropriate?' Dr. Al-Rashidi turns to you for guidance.",
      clinicalFindings: [
        "eGFR: 48 mL/min/1.73m² — CKD Stage 3a",
        "Serum creatinine: 1.4 mg/dL (stable)",
        "Urine albumin-creatinine ratio: 45 mg/g (mildly elevated)",
        "No dialysis, no renal transplant",
        "Hepatic function: normal (ALT 28, AST 31, bilirubin 0.8)",
      ],
      question:
        "The nephrologist asks whether AMVUTTRA requires dose adjustment for CKD Stage 3a (eGFR 48). What is the correct answer?",
      choices: [
        {
          id: "c5-s1-a",
          text: "AMVUTTRA requires dose reduction to 12.5 mg Q3M for eGFR < 60 mL/min.",
          correct: false,
          feedback: "Incorrect — no dose adjustment is required for any degree of renal impairment.",
          detail:
            "AMVUTTRA does not require dose adjustment for renal impairment at any stage. The prescribing information explicitly states that no dose modification is needed for patients with mild, moderate, or severe renal impairment. Vutrisiran is not renally cleared — it is metabolised by the RISC complex within hepatocytes and eliminated via biliary/faecal routes. Recommending a 12.5 mg dose would result in subtherapeutic TTR suppression.",
        },
        {
          id: "c5-s1-b",
          text: "No dose adjustment is required. AMVUTTRA is not renally cleared — it is metabolised intracellularly within hepatocytes via the RISC complex and eliminated primarily via biliary/faecal routes. The standard dose of 25 mg SC Q3M is appropriate regardless of eGFR. This has been confirmed in the HELIOS-B trial, which included patients with renal impairment without dose modification.",
          correct: true,
          feedback: "Correct — no dose adjustment for any degree of renal impairment.",
          detail:
            "This is the complete and accurate answer. Vutrisiran's mechanism of action (intracellular RISC-mediated mRNA cleavage in hepatocytes) means renal function is irrelevant to its pharmacokinetics. The AMVUTTRA PI explicitly states: 'No dose adjustment is recommended for patients with renal impairment.' The HELIOS-B trial included patients with eGFR as low as 30 mL/min without dose modification. This is a key differentiating message vs. older therapies.",
        },
        {
          id: "c5-s1-c",
          text: "AMVUTTRA should be avoided in CKD Stage 3 — the safety data is insufficient for this population.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA has been used in patients with renal impairment in clinical trials without safety signals.",
          detail:
            "There is no contraindication or safety warning for AMVUTTRA in renal impairment. The HELIOS-B trial included patients with a range of renal function, and no specific renal safety signals were identified. Avoiding AMVUTTRA in CKD Stage 3 would deny a patient with confirmed ATTR-CM access to the only therapy with proven mortality benefit in this population.",
        },
        {
          id: "c5-s1-d",
          text: "Extend the dosing interval to Q4M to reduce the cumulative dose burden on the kidneys.",
          correct: false,
          feedback: "Incorrect — interval extension is not approved and would compromise efficacy.",
          detail:
            "The Q3M dosing interval is specifically designed to maintain steady-state TTR suppression (~88%) throughout the dosing period. Extending to Q4M would result in TTR rebound between doses and loss of sustained suppression. There is no pharmacokinetic rationale for interval extension in renal impairment, as vutrisiran is not renally cleared.",
        },
      ],
      expertCommentary:
        "The renal impairment question is one of the most common practical queries from nephrologists and internists co-managing ATTR-CM patients. The key message is simple but must be delivered with confidence: AMVUTTRA is NOT renally cleared. Its mechanism — intracellular RISC-mediated mRNA cleavage in hepatocytes — means the kidneys play no role in its elimination. This is a significant practical advantage over older therapies and should be proactively communicated to co-managing specialists.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | Fontana M et al. N Engl J Med. 2024 (HELIOS-B) | Vaishnaw AK et al. Nucleic Acid Ther. 2020",
      keyPoint: "AMVUTTRA requires NO dose adjustment for renal impairment at any stage. It is not renally cleared — metabolised intracellularly in hepatocytes via RISC complex.",
    },
    {
      id: "c5-s2",
      algorithmStep: { step: 8, label: "Treatment Decision", hint: "Step 8 of the Dx Algorithm: safety considerations in treatment selection. Review the supportive care do/avoid list — particularly the risk of digoxin and calcium channel blocker toxicity in ATTR-CM." },
      phase: "SAFETY",
      phaseColor: "#E74C3C",
      title: "Drug Interactions in a Complex Regimen",
      narrative:
        "The patient is on furosemide 40mg, bisoprolol 5mg, and spironolactone 25mg. The cardiologist asks whether any of these medications interact with AMVUTTRA, and whether the vitamin A monitoring protocol needs modification given the patient's renal function.",
      clinicalFindings: [
        "Current medications: furosemide 40mg OD, bisoprolol 5mg OD, spironolactone 25mg OD",
        "No anticoagulants, no immunosuppressants",
        "Baseline vitamin A: 0.52 mg/L (normal)",
        "Ophthalmology: normal visual acuity, no nyctalopia",
      ],
      question:
        "Does AMVUTTRA have clinically significant interactions with furosemide, bisoprolol, or spironolactone? Does CKD Stage 3 modify the vitamin A monitoring protocol?",
      choices: [
        {
          id: "c5-s2-a",
          text: "AMVUTTRA has no clinically significant interactions with furosemide, bisoprolol, or spironolactone. It is not metabolised by CYP450 enzymes and has no known drug-drug interactions. The vitamin A monitoring protocol (baseline level, RDA supplementation, ophthalmology referral) is the same regardless of renal function.",
          correct: true,
          feedback: "Correct — no DDIs and standard vitamin A protocol applies.",
          detail:
            "Vutrisiran is not metabolised by CYP450 enzymes — it is processed intracellularly by the RISC complex. This means it has an extremely clean drug interaction profile. No dose adjustments or interaction monitoring is required with standard heart failure medications. The vitamin A monitoring protocol is not modified for renal impairment — the 65% TTR suppression-mediated vitamin A reduction occurs regardless of renal function.",
        },
        {
          id: "c5-s2-b",
          text: "AMVUTTRA may interact with furosemide via shared renal tubular secretion pathways — monitor renal function closely.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA is not renally cleared and has no renal tubular interaction.",
          detail:
            "Vutrisiran is not renally cleared and does not interact with renal tubular secretion pathways. There is no pharmacokinetic basis for an interaction with furosemide via this mechanism. This response confuses vutrisiran's pharmacokinetics with those of small-molecule drugs.",
        },
        {
          id: "c5-s2-c",
          text: "Spironolactone may reduce AMVUTTRA efficacy by competing for hepatic uptake via OATP transporters.",
          correct: false,
          feedback: "Incorrect — vutrisiran is not an OATP substrate and has no known transporter interactions.",
          detail:
            "Vutrisiran enters hepatocytes via GalNAc-ASGPR receptor-mediated endocytosis — not via OATP transporters. Spironolactone does not interact with this uptake mechanism. The AMVUTTRA prescribing information does not list any transporter-mediated drug interactions.",
        },
        {
          id: "c5-s2-d",
          text: "In CKD Stage 3, vitamin A supplementation should be reduced to 450 mcg/day (half the RDA) to avoid accumulation.",
          correct: false,
          feedback: "Incorrect — the RDA (900 mcg/day) applies regardless of renal function.",
          detail:
            "The AMVUTTRA prescribing information recommends RDA vitamin A supplementation (900 mcg/day for males) for all patients. There is no recommendation to reduce supplementation in renal impairment. Vitamin A is primarily metabolised hepatically, not renally, so CKD Stage 3 does not significantly affect its metabolism at RDA doses.",
        },
      ],
      expertCommentary:
        "AMVUTTRA's clean drug interaction profile is one of its most underappreciated clinical advantages. In a complex ATTR-CM patient on multiple heart failure medications, the absence of CYP450 metabolism and transporter interactions means no dose adjustments, no interaction monitoring, and no need to sequence medications. This is a meaningful practical benefit vs. small-molecule therapies.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | Nair JK et al. J Am Chem Soc. 2014 (GalNAc-siRNA pharmacokinetics)",
      keyPoint: "AMVUTTRA has NO CYP450-mediated drug interactions. Clean interaction profile is a key practical advantage in complex multi-medication ATTR-CM patients.",
    },
    {
      id: "c5-s3",
      algorithmStep: { step: 4, label: "PYP Scintigraphy", hint: "Step 4 of the Dx Algorithm: PYP scan is the pivotal non-invasive diagnostic test. Understanding Perugini grading and the H/CL ratio is essential for correct interpretation." },
      phase: "EVIDENCE",
      phaseColor: "#27AE60",
      title: "HELIOS-B Renal Subgroup",
      narrative:
        "The nephrologist is now engaged and asks: 'Was there a renal subgroup in the HELIOS-B trial? What happened to kidney function in patients on AMVUTTRA over 42 months?'",
      clinicalFindings: [
        "HELIOS-B: 42-month median follow-up",
        "Renal subgroup: patients with baseline eGFR < 60 included",
        "Primary endpoint maintained across renal subgroups",
        "No significant change in eGFR attributable to AMVUTTRA",
        "ATTR-CM itself causes renal amyloid deposition — treatment may slow renal decline",
      ],
      question:
        "How do you respond to the nephrologist's question about renal outcomes in the HELIOS-B trial?",
      choices: [
        {
          id: "c5-s3-a",
          text: "HELIOS-B did not include patients with renal impairment — the data is not applicable to this patient.",
          correct: false,
          feedback: "Incorrect — HELIOS-B included patients with a range of renal function.",
          detail:
            "HELIOS-B did not exclude patients with renal impairment. The trial included patients with eGFR as low as 30 mL/min, and the primary endpoint (CV composite) was maintained across renal subgroups. Telling the nephrologist the data is 'not applicable' is factually incorrect and undermines confidence in the therapy.",
        },
        {
          id: "c5-s3-b",
          text: "HELIOS-B included patients with renal impairment and the primary CV composite benefit was maintained across renal subgroups. AMVUTTRA did not cause significant changes in eGFR over 42 months. Importantly, ATTR-CM itself causes renal amyloid deposition — by reducing TTR and slowing amyloid accumulation, AMVUTTRA may help preserve renal function over time, though this is a secondary observation rather than a primary endpoint.",
          correct: true,
          feedback: "Accurate, complete, and adds the important point about renal amyloid deposition.",
          detail:
            "This response correctly confirms that HELIOS-B included patients with renal impairment, that the CV benefit was maintained, and that AMVUTTRA did not cause eGFR decline. The additional point about ATTR-CM causing renal amyloid deposition is clinically important — it reframes the conversation from 'is AMVUTTRA safe for the kidneys?' to 'will treating ATTR-CM protect the kidneys?' This is a powerful message for a nephrologist.",
        },
        {
          id: "c5-s3-c",
          text: "AMVUTTRA significantly improved eGFR in the renal subgroup — it has a renoprotective effect.",
          correct: false,
          feedback: "Overclaims — renoprotection is a secondary observation, not a primary endpoint.",
          detail:
            "While there is biological plausibility for renoprotection (ATTR amyloid deposits in the kidney), claiming that AMVUTTRA 'significantly improved eGFR' overclaims the available evidence. Renal outcomes were not a primary endpoint in HELIOS-B, and making this claim to a nephrologist without robust data could damage credibility.",
        },
        {
          id: "c5-s3-d",
          text: "Renal function is not relevant to AMVUTTRA's efficacy — the trial data is cardiac-focused and the nephrologist should defer to the cardiologist.",
          correct: false,
          feedback: "Dismissive — the nephrologist's question is clinically valid and deserves a substantive answer.",
          detail:
            "Dismissing the nephrologist's question is a missed opportunity to build a multidisciplinary advocate for AMVUTTRA. Nephrologists are increasingly involved in ATTR diagnosis and management, particularly as renal amyloidosis becomes better recognised. Engaging the nephrologist with the renal subgroup data and the ATTR-renal connection builds a broader base of support for the therapy.",
        },
      ],
      expertCommentary:
        "The renal amyloidosis angle is an underutilised message in ATTR-CM discussions. TTR amyloid deposits in the kidney as well as the heart, and progressive renal amyloidosis is a recognised complication of ATTR. By reducing TTR and slowing amyloid accumulation, AMVUTTRA may offer renal protection as a secondary benefit — a message that resonates strongly with nephrologists and reinforces the systemic nature of the disease.",
      evidence: "Fontana M et al. N Engl J Med. 2024 (HELIOS-B renal subgroup) | Damy T et al. Eur J Heart Fail. 2021 (renal involvement in ATTR) | Gillmore JD et al. Circulation. 2020",
      keyPoint: "HELIOS-B included patients with renal impairment — CV benefit maintained. ATTR-CM causes renal amyloid deposition; treating the disease may protect the kidneys.",
    },
    {
      id: "c5-s4",
      algorithmStep: { step: 8, label: "Treatment Decision", hint: "Step 8 of the Dx Algorithm: AMVUTTRA 25mg SC Q3M — 4 injections per year, no premedication, 88% TTR suppression. Review the full drug comparison grid for context." },
      phase: "TREAT",
      phaseColor: "#F0A500",
      title: "Initiating Treatment in a Complex Patient",
      narrative:
        "The multidisciplinary team has agreed to start AMVUTTRA. The patient's cardiologist asks whether the standard pre-treatment protocol applies, and whether any additional monitoring is needed given the CKD Stage 3a.",
      clinicalFindings: [
        "Decision: start AMVUTTRA 25 mg SC Q3M",
        "eGFR stable at 48 mL/min/1.73m² for 2 years",
        "No proteinuria above mildly elevated baseline",
        "Baseline vitamin A: 0.52 mg/L",
        "Ophthalmology referral arranged",
      ],
      question:
        "What is the complete pre-treatment protocol for this patient, and is any additional monitoring required for CKD Stage 3a?",
      choices: [
        {
          id: "c5-s4-a",
          text: "Standard protocol: baseline vitamin A, ophthalmology referral, RDA supplementation (900 mcg/day). No additional renal monitoring is required beyond his existing nephrology follow-up. eGFR should be monitored as part of standard CKD care, not as an AMVUTTRA-specific requirement.",
          correct: true,
          feedback: "Correct — standard protocol, no AMVUTTRA-specific renal monitoring required.",
          detail:
            "The pre-treatment protocol for AMVUTTRA is the same regardless of renal function: baseline vitamin A, ophthalmology referral, RDA supplementation, and (if applicable) contraception confirmation. No AMVUTTRA-specific renal monitoring is required. eGFR monitoring should continue as part of standard CKD Stage 3 management — this is not an additional burden imposed by AMVUTTRA.",
        },
        {
          id: "c5-s4-b",
          text: "Additional renal monitoring every 4 weeks is required — AMVUTTRA may cause acute kidney injury in CKD patients.",
          correct: false,
          feedback: "Incorrect — no AMVUTTRA-specific renal monitoring is required.",
          detail:
            "There is no evidence that AMVUTTRA causes acute kidney injury, and no AMVUTTRA-specific renal monitoring protocol is recommended in the prescribing information. Recommending 4-weekly renal monitoring creates an unnecessary burden and may deter prescribing.",
        },
        {
          id: "c5-s4-c",
          text: "Reduce the vitamin A supplementation to 450 mcg/day in CKD Stage 3 to avoid vitamin A accumulation.",
          correct: false,
          feedback: "Incorrect — RDA (900 mcg/day) applies regardless of renal function.",
          detail:
            "The RDA vitamin A supplementation (900 mcg/day for adult males) is recommended for all patients on AMVUTTRA. There is no recommendation to reduce supplementation in renal impairment in the prescribing information.",
        },
        {
          id: "c5-s4-d",
          text: "Delay treatment until eGFR improves above 60 mL/min — the safety data is insufficient below this threshold.",
          correct: false,
          feedback: "Incorrect — there is no eGFR threshold below which AMVUTTRA is contraindicated.",
          detail:
            "AMVUTTRA has no eGFR threshold contraindication. The prescribing information does not recommend delaying treatment for any level of renal impairment. Waiting for eGFR to improve in a patient with stable CKD Stage 3 is clinically inappropriate and would delay treatment of a progressive, life-threatening disease.",
        },
      ],
      expertCommentary:
        "The key message for complex multi-morbidity patients is that AMVUTTRA's safety and dosing profile is remarkably simple: one dose (25 mg SC Q3M), no renal adjustment, no hepatic adjustment (mild-moderate), no drug interactions, no premedication, no REMS. In a patient already managing CKD, heart failure, and multiple medications, this simplicity is a significant quality-of-life benefit.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | Fontana M et al. N Engl J Med. 2024",
      keyPoint: "Standard pre-treatment protocol applies in CKD. No AMVUTTRA-specific renal monitoring required. The simplicity of the dosing and safety profile is a key benefit in complex multi-morbidity patients.",
    },
    {
      id: "c5-s5",
      algorithmStep: { step: 7, label: "Staging & Monitoring", hint: "Step 7 of the Dx Algorithm: NAC Stage I-III survival data provides the prognostic framework. Monitoring NT-proBNP and eGFR tracks disease progression and guides dose timing." },
      phase: "MONITOR",
      phaseColor: "#00C2A8",
      title: "6-Month Follow-Up — Renal and Cardiac Outcomes",
      narrative:
        "At 6 months, the patient reports improved exercise tolerance. 6MWT has increased from 320m to 385m. LVEF is 51% (up from 48%). eGFR is stable at 46 mL/min/1.73m² (within expected CKD variability). Vitamin A level is 0.31 mg/L (40% reduction from baseline 0.52 mg/L). The patient asks: 'My kidney doctor says my eGFR dropped slightly — is that because of AMVUTTRA?'",
      clinicalFindings: [
        "6MWT: 385m (up from 320m — +65m improvement)",
        "LVEF: 51% (up from 48%)",
        "eGFR: 46 mL/min/1.73m² (down from 48 — within CKD variability)",
        "Vitamin A: 0.31 mg/L (40% reduction — above 0.20 mg/L threshold)",
        "Ophthalmology: normal visual acuity, no nyctalopia",
        "No new adverse events",
      ],
      question:
        "How do you respond to the patient's concern that AMVUTTRA caused his eGFR to drop from 48 to 46?",
      choices: [
        {
          id: "c5-s5-a",
          text: "The 2-point eGFR drop is within normal variability for CKD Stage 3 and is not attributable to AMVUTTRA. AMVUTTRA is not renally cleared and has no known nephrotoxic mechanism. Your overall response has been excellent — 6MWT improved by 65m and LVEF increased to 51%. We will continue to monitor eGFR as part of your standard CKD care.",
          correct: true,
          feedback: "Correct — reassures the patient with evidence and contextualises the eGFR change.",
          detail:
            "A 2-point eGFR fluctuation (48 → 46) is within normal measurement variability for CKD Stage 3 and is not clinically significant. AMVUTTRA has no known nephrotoxic mechanism. The response correctly contextualises the eGFR change, highlights the excellent cardiac response (6MWT +65m, LVEF +3%), and reassures the patient without dismissing his concern.",
        },
        {
          id: "c5-s5-b",
          text: "The eGFR drop is concerning — we should reduce the AMVUTTRA dose to 12.5 mg Q3M to protect the kidneys.",
          correct: false,
          feedback: "Incorrect — dose reduction is not indicated and would compromise efficacy.",
          detail:
            "A 2-point eGFR drop is within normal variability and is not attributable to AMVUTTRA. Dose reduction to 12.5 mg Q3M is not an approved dose and would result in subtherapeutic TTR suppression. This response is both clinically incorrect and potentially harmful.",
        },
        {
          id: "c5-s5-c",
          text: "We should stop AMVUTTRA and switch to tafamidis, which has a better renal safety profile.",
          correct: false,
          feedback: "Incorrect — tafamidis does not have superior renal safety, and switching would lose the mortality benefit.",
          detail:
            "There is no evidence that tafamidis has superior renal safety vs. AMVUTTRA. Switching from AMVUTTRA to tafamidis based on a 2-point eGFR fluctuation would lose the 35% all-cause mortality reduction demonstrated in HELIOS-B — a decision that cannot be justified on the available evidence.",
        },
        {
          id: "c5-s5-d",
          text: "The vitamin A level of 0.31 mg/L is dangerously low — stop AMVUTTRA immediately and refer to ophthalmology urgently.",
          correct: false,
          feedback: "Incorrect — 0.31 mg/L is above the threshold for urgent action (0.20 mg/L).",
          detail:
            "The AMVUTTRA prescribing information recommends ophthalmology referral if vitamin A levels fall below 0.20 mg/L or if ocular symptoms develop. At 0.31 mg/L, the patient is above this threshold and has no ocular symptoms. Stopping AMVUTTRA based on a vitamin A level above the action threshold is clinically inappropriate.",
        },
      ],
      expertCommentary:
        "The 6-month follow-up in this case demonstrates three important teaching points: (1) a 2-point eGFR fluctuation in CKD Stage 3 is within normal variability and not attributable to AMVUTTRA; (2) the cardiac response (6MWT +65m, LVEF +3%) at 6 months is consistent with HELIOS-B OLE data showing functional improvement; (3) vitamin A monitoring at 0.31 mg/L is above the action threshold — no intervention required beyond continuing RDA supplementation. The ability to contextualise these findings confidently is a key competency for the field.",
      evidence: "Fontana M et al. N Engl J Med. 2024 (HELIOS-B OLE) | Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | KDIGO CKD Guidelines 2024",
      keyPoint: "A 2-point eGFR fluctuation in CKD Stage 3 is within normal variability — not attributable to AMVUTTRA. Vitamin A 0.31 mg/L is above the 0.20 mg/L action threshold. Excellent cardiac response at 6 months.",
    },
  ],
};

// ─── Case 6 Data ──────────────────────────────────────────────────────────────
const CASE_6: CaseData = {
  id: "case-6",
  caseNumber: "Case 6",
  title: "The Post-Transplant Question",
  subtitle: "58-year-old male, post-liver transplant for hATTR-PN, asking if AMVUTTRA is still needed",
  indication: "hATTR-PN",
  indicationColor: "#8E44AD",
  difficulty: "Advanced",
  duration: "~14 min",
  patientSummary: [
    "58-year-old male, V30M mutation, Jeddah",
    "Liver transplant 8 years ago for hATTR-PN Stage 1 — successful, no rejection",
    "Post-transplant: neuropathy stabilised for 5 years, then slowly progressing",
    "Current: NIS+7 = 18 (Stage 1 → early Stage 2 progression)",
    "New finding: echocardiogram shows early ATTR-CM features (IVS 14mm, low-voltage ECG)",
    "Patient asks: 'I thought the liver transplant cured me — why is my neuropathy getting worse?'",
  ],
  stages: [
    {
      id: "c6-s1",
      algorithmStep: { step: 1, label: "Red Flags", hint: "Step 1 of the Dx Algorithm: extracardiac red flags — autonomic dysfunction, GI symptoms, and family history — are the earliest and most specific indicators of hATTR amyloidosis." },
      phase: "EXPLAIN",
      phaseColor: "#8E44AD",
      title: "Why Is the Disease Progressing After Liver Transplant?",
      narrative:
        "Dr. Hassan, a neurologist at King Abdulaziz Medical City, is reviewing this 58-year-old V30M patient who had a liver transplant 8 years ago. For 5 years post-transplant, his neuropathy was stable. Now NIS+7 has risen from 0 to 18 over the past 3 years. A new echocardiogram shows early cardiac amyloidosis features. The patient is distressed: 'I thought the liver transplant was supposed to stop the disease. Why is it coming back?'",
      clinicalFindings: [
        "NIS+7: 18 (up from 0 at 5 years post-transplant)",
        "Echo: IVS 14mm, LVEF 55%, low-voltage ECG pattern",
        "Tc-PYP: Grade 2 uptake (early cardiac amyloid)",
        "Liver function: normal (transplanted liver producing wild-type TTR only)",
        "Serum TTR: normal level, wild-type sequence (transplanted liver)",
      ],
      question:
        "How do you explain to the patient why his disease is progressing despite a successful liver transplant?",
      choices: [
        {
          id: "c6-s1-a",
          text: "The liver transplant must have failed — his new liver is producing mutant TTR again. He needs re-transplantation.",
          correct: false,
          feedback: "Incorrect — the transplanted liver is producing wild-type TTR only. The progression is due to a different mechanism.",
          detail:
            "A successful liver transplant replaces the source of mutant TTR with a liver producing only wild-type TTR. If the transplant is functioning normally (as confirmed by normal liver function and wild-type serum TTR), re-transplantation is not indicated. The progression is explained by a different mechanism: residual amyloid deposits and wild-type TTR contribution to amyloid formation.",
        },
        {
          id: "c6-s1-b",
          text: "The liver transplant stopped the production of mutant TTR — but it didn't remove the amyloid deposits that had already formed in your nerves and heart. Over time, two things happen: (1) existing amyloid deposits continue to cause tissue damage even without new TTR production; (2) your new liver produces wild-type TTR, which can also deposit as amyloid — particularly in the heart. This is called 'wild-type amyloid progression' and explains the cardiac findings. AMVUTTRA can suppress both mutant and wild-type TTR production, which is why it may still be beneficial.",
          correct: true,
          feedback: "Excellent — accurately explains residual amyloid and wild-type TTR progression.",
          detail:
            "This response correctly explains two mechanisms of post-transplant progression: (1) pre-existing amyloid deposits continue to cause tissue damage regardless of new TTR production; (2) wild-type TTR from the transplanted liver can deposit as amyloid, particularly in the heart (cardiac amyloidosis is predominantly wild-type in older patients). The key insight — that AMVUTTRA suppresses both mutant and wild-type TTR — is the clinical rationale for treating post-transplant patients.",
        },
        {
          id: "c6-s1-c",
          text: "The neuropathy progression is likely due to a different cause — peripheral neuropathy from diabetes or vitamin B12 deficiency. The liver transplant should have cured the hATTR-PN.",
          correct: false,
          feedback: "Incorrect — post-transplant hATTR-PN progression is a well-recognised phenomenon.",
          detail:
            "Post-transplant hATTR-PN progression is a well-documented clinical phenomenon, particularly in V30M patients. The mechanism involves residual amyloid deposits and wild-type TTR contribution. Attributing the progression to an alternative cause without evidence dismisses the clinical picture and delays appropriate treatment.",
        },
        {
          id: "c6-s1-d",
          text: "The liver transplant cures hATTR-PN completely — the NIS+7 worsening must be measurement error. Repeat the assessment in 6 months.",
          correct: false,
          feedback: "Incorrect — post-transplant progression is real and well-documented.",
          detail:
            "Dismissing a NIS+7 increase from 0 to 18 over 3 years as 'measurement error' is clinically inappropriate. Post-transplant hATTR-PN progression is a recognised entity, and the concurrent development of early cardiac amyloidosis (Tc-PYP Grade 2, IVS 14mm) strongly supports ongoing amyloid disease activity. Delaying assessment by 6 months risks further progression.",
        },
      ],
      expertCommentary:
        "Post-transplant hATTR-PN progression is one of the most important clinical concepts in the ATTR field. The liver transplant stops mutant TTR production but does not remove pre-existing amyloid deposits or prevent wild-type TTR deposition. This is why cardiac amyloidosis can develop or progress after a 'successful' liver transplant — the heart is particularly susceptible to wild-type TTR deposition in older patients. AMVUTTRA's ability to suppress both mutant and wild-type TTR makes it a rational treatment option in this setting.",
      evidence: "Suhr OB et al. J Intern Med. 2016 (post-transplant progression) | Ruberg FL et al. Circulation. 2019 (wild-type ATTR) | Ando Y et al. Orphanet J Rare Dis. 2022",
      keyPoint: "Post-transplant progression occurs via two mechanisms: residual amyloid deposits and wild-type TTR deposition from the transplanted liver. AMVUTTRA suppresses both mutant and wild-type TTR.",
    },
    {
      id: "c6-s2",
      algorithmStep: { step: 4, label: "PYP Scintigraphy", hint: "Step 4 of the Dx Algorithm: in hATTR with cardiac involvement, PYP scan confirms ATTR-CM non-invasively. The Perugini grade and H/CL ratio determine whether biopsy is needed." },
      phase: "EVIDENCE",
      phaseColor: "#27AE60",
      title: "Evidence for AMVUTTRA in Post-Transplant Patients",
      narrative:
        "Dr. Hassan asks: 'Is there clinical trial data supporting AMVUTTRA in post-liver transplant patients? Were they included in HELIOS-A or HELIOS-B?'",
      clinicalFindings: [
        "HELIOS-A: included post-transplant hATTR-PN patients",
        "HELIOS-B: included patients with prior liver transplant",
        "Post-transplant subgroup: consistent benefit with overall trial population",
        "AMVUTTRA suppresses wild-type TTR from transplanted liver (~88%)",
        "No contraindication to AMVUTTRA in post-transplant patients (with stable immunosuppression)",
      ],
      question:
        "What is the evidence base for using AMVUTTRA in a post-liver transplant patient with progressive hATTR-PN and early ATTR-CM?",
      choices: [
        {
          id: "c6-s2-a",
          text: "Post-transplant patients were excluded from HELIOS-A and HELIOS-B — there is no clinical trial data to support AMVUTTRA in this setting.",
          correct: false,
          feedback: "Incorrect — post-transplant patients were included in both trials.",
          detail:
            "Both HELIOS-A and HELIOS-B included patients with prior liver transplants. Post-transplant patients were not excluded from either trial, and the subgroup data showed consistent benefit with the overall trial population. Telling the physician there is 'no data' is factually incorrect.",
        },
        {
          id: "c6-s2-b",
          text: "Both HELIOS-A and HELIOS-B included post-liver transplant patients. The subgroup data showed consistent benefit with the overall trial population. Mechanistically, AMVUTTRA suppresses wild-type TTR production from the transplanted liver by ~88% — directly addressing the source of ongoing amyloid deposition. There is no contraindication to AMVUTTRA in post-transplant patients with stable immunosuppression, and no known interaction with standard immunosuppressants (tacrolimus, mycophenolate).",
          correct: true,
          feedback: "Accurate and complete — covers trial inclusion, mechanism, and interaction profile.",
          detail:
            "This response correctly confirms trial inclusion of post-transplant patients, explains the mechanistic rationale (suppression of wild-type TTR from the transplanted liver), and addresses the practical concern about immunosuppressant interactions. AMVUTTRA is not metabolised by CYP3A4 (the primary pathway for tacrolimus), so there is no pharmacokinetic interaction.",
        },
        {
          id: "c6-s2-c",
          text: "AMVUTTRA is only approved for patients who have NOT had a liver transplant — post-transplant patients should continue on immunosuppression alone.",
          correct: false,
          feedback: "Incorrect — there is no such restriction in the AMVUTTRA label.",
          detail:
            "The AMVUTTRA prescribing information does not restrict use to patients who have not had a liver transplant. Post-transplant patients were included in clinical trials and the label does not exclude this population. Immunosuppression alone does not address the ongoing amyloid deposition from wild-type TTR.",
        },
        {
          id: "c6-s2-d",
          text: "AMVUTTRA may interact with tacrolimus via CYP3A4 — the immunosuppressant dose would need to be reduced before starting.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA is not metabolised by CYP3A4 and does not interact with tacrolimus.",
          detail:
            "Vutrisiran is not metabolised by CYP450 enzymes, including CYP3A4. There is no pharmacokinetic interaction with tacrolimus or other CYP3A4-metabolised immunosuppressants. No dose adjustment of immunosuppressants is required when starting AMVUTTRA.",
        },
      ],
      expertCommentary:
        "The post-transplant AMVUTTRA question is a niche but increasingly important clinical scenario as the first wave of liver transplant patients (transplanted in the 1990s-2000s) ages and develops progressive disease. The key messages are: (1) both HELIOS trials included post-transplant patients; (2) AMVUTTRA suppresses wild-type TTR from the transplanted liver; (3) no interaction with standard immunosuppressants. This is a compelling case for AMVUTTRA as a 'second-line' therapy after liver transplant.",
      evidence: "Adams D et al. N Engl J Med. 2023 (HELIOS-A post-transplant subgroup) | Fontana M et al. N Engl J Med. 2024 (HELIOS-B) | Suhr OB et al. J Intern Med. 2016",
      keyPoint: "Both HELIOS trials included post-transplant patients. AMVUTTRA suppresses wild-type TTR from the transplanted liver (~88%). No interaction with tacrolimus or mycophenolate.",
    },
    {
      id: "c6-s3",
      algorithmStep: { step: 5, label: "Biopsy", hint: "Step 5 of the Dx Algorithm: biopsy is required when monoclonal protein is present alongside a positive PYP scan. Congo red staining + TTR IHC or mass spectrometry confirms the fibril type." },
      phase: "DIAGNOSE",
      phaseColor: "#3498DB",
      title: "Dual-Indication Strategy: Treating Both PN and CM",
      narrative:
        "This patient has both progressive hATTR-PN (NIS+7 = 18) and early ATTR-CM (Tc-PYP Grade 2, IVS 14mm). Dr. Hassan asks: 'Can AMVUTTRA treat both the neuropathy and the cardiac disease simultaneously? Or does he need separate therapies?'",
      clinicalFindings: [
        "hATTR-PN: NIS+7 = 18, Stage 1-2 transition, V30M",
        "ATTR-CM: Tc-PYP Grade 2, IVS 14mm, LVEF 55%, low-voltage ECG",
        "Both conditions confirmed in the same patient",
        "AMVUTTRA: FDA-approved for BOTH hATTR-PN AND ATTR-CM",
        "Only therapy approved for both indications simultaneously",
      ],
      question:
        "How do you advise Dr. Hassan on the treatment strategy for a patient with both progressive hATTR-PN and early ATTR-CM?",
      choices: [
        {
          id: "c6-s3-a",
          text: "He needs two separate therapies: patisiran for the neuropathy and tafamidis for the cardiac disease.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA is the only therapy approved for both indications simultaneously.",
          detail:
            "Using two separate RNAi therapies (patisiran + tafamidis) is not only unnecessary but also exposes the patient to two injection regimens and two safety profiles. AMVUTTRA is the only FDA-approved therapy for both hATTR-PN and ATTR-CM — a single 25 mg SC Q3M injection addresses both conditions simultaneously. This is one of AMVUTTRA's most powerful differentiating messages.",
        },
        {
          id: "c6-s3-b",
          text: "AMVUTTRA is the only FDA-approved therapy for both hATTR-PN and ATTR-CM simultaneously. A single 25 mg SC Q3M injection addresses both conditions — no additional cardiac therapy is required. This is particularly relevant for this patient, where treating the underlying TTR amyloid production will slow progression in both the nervous system and the heart. Starting AMVUTTRA now, while the cardiac disease is still early (LVEF 55%, Stage A/B), maximises the opportunity for cardiac stabilisation and potential improvement.",
          correct: true,
          feedback: "Excellent — highlights the unique dual-indication advantage and the importance of early cardiac treatment.",
          detail:
            "This response correctly identifies AMVUTTRA as the only dual-indication therapy, explains the single-injection simplicity, and makes the critical point about early cardiac intervention. The HELIOS-B data shows that patients with earlier cardiac disease (lower baseline NT-proBNP, higher LVEF) derive greater benefit — starting while LVEF is still 55% maximises the treatment window.",
        },
        {
          id: "c6-s3-c",
          text: "Treat the neuropathy first with AMVUTTRA, then add tafamidis for the cardiac disease once the neuropathy is stable.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA treats both simultaneously; sequential therapy is not indicated.",
          detail:
            "Sequential therapy is not indicated when a single agent (AMVUTTRA) is approved for both conditions. Adding tafamidis to AMVUTTRA is not supported by evidence and would add cost and complexity without proven additional benefit. The HELIOS-B trial specifically excluded patients on concomitant tafamidis.",
        },
        {
          id: "c6-s3-d",
          text: "The cardiac disease is too early to treat — wait until LVEF drops below 45% before starting AMVUTTRA for the cardiac indication.",
          correct: false,
          feedback: "Incorrect — early intervention maximises cardiac benefit; waiting for LVEF to decline is the wrong strategy.",
          detail:
            "The HELIOS-B data consistently shows that earlier intervention (higher baseline LVEF, lower NT-proBNP) is associated with greater benefit. Waiting for LVEF to drop to 45% means waiting for significant myocardial amyloid infiltration that may be irreversible. The correct strategy is to treat early, while the cardiac disease is still in a recoverable stage.",
        },
      ],
      expertCommentary:
        "The dual-indication advantage is AMVUTTRA's most powerful differentiating message in the competitive landscape. No other therapy is approved for both hATTR-PN and ATTR-CM. In a post-transplant patient developing both progressive neuropathy and early cardiac amyloidosis, AMVUTTRA offers a single-injection solution that addresses both conditions simultaneously — a compelling argument for both the neurologist and the cardiologist.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | Adams D et al. N Engl J Med. 2023 | Fontana M et al. N Engl J Med. 2024",
      keyPoint: "AMVUTTRA is the ONLY therapy approved for both hATTR-PN and ATTR-CM simultaneously. One injection every 3 months treats both conditions — no additional cardiac therapy required.",
    },
    {
      id: "c6-s4",
      algorithmStep: { step: 8, label: "Treatment Decision", hint: "Step 8 of the Dx Algorithm: post-transplant hATTR-PN is a complex treatment scenario. AMVUTTRA suppresses wild-type TTR from the transplanted liver — addressing the ongoing amyloid source." },
      phase: "TREAT",
      phaseColor: "#F0A500",
      title: "Immunosuppression and Pre-Treatment Protocol",
      narrative:
        "The patient is on tacrolimus 2mg BD and mycophenolate 500mg BD for post-transplant immunosuppression. The transplant team asks whether AMVUTTRA can be safely initiated alongside these medications, and whether any dose adjustments are needed.",
      clinicalFindings: [
        "Tacrolimus: 2mg BD (trough level 5.2 ng/mL — within target range)",
        "Mycophenolate mofetil: 500mg BD",
        "Prednisolone: 5mg OD (maintenance)",
        "Liver function: normal",
        "No rejection episodes in 8 years",
      ],
      question:
        "Can AMVUTTRA be safely initiated alongside tacrolimus and mycophenolate? Are any dose adjustments required?",
      choices: [
        {
          id: "c6-s4-a",
          text: "AMVUTTRA can be safely initiated alongside tacrolimus and mycophenolate. It is not metabolised by CYP3A4 (the primary pathway for tacrolimus) and has no known interaction with mycophenolate. No dose adjustments are required for either the immunosuppressants or AMVUTTRA. Continue monitoring tacrolimus trough levels as per standard post-transplant protocol.",
          correct: true,
          feedback: "Correct — no interactions, no dose adjustments required.",
          detail:
            "Vutrisiran is not metabolised by CYP450 enzymes. Tacrolimus is primarily metabolised by CYP3A4 — since vutrisiran does not affect CYP3A4, there is no pharmacokinetic interaction. Mycophenolate is metabolised by UGT enzymes, which are also unaffected by vutrisiran. Standard post-transplant tacrolimus trough monitoring should continue as per the transplant team's protocol — this is not an AMVUTTRA-specific requirement.",
        },
        {
          id: "c6-s4-b",
          text: "Reduce tacrolimus by 50% before starting AMVUTTRA to avoid supratherapeutic levels due to CYP3A4 inhibition.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA does not inhibit CYP3A4.",
          detail:
            "Vutrisiran does not inhibit or induce CYP3A4. Reducing tacrolimus based on a non-existent drug interaction risks acute rejection — a potentially life-threatening complication. This response demonstrates a fundamental misunderstanding of vutrisiran's pharmacokinetics.",
        },
        {
          id: "c6-s4-c",
          text: "AMVUTTRA is contraindicated in immunosuppressed patients — the liver transplant team should be consulted before prescribing.",
          correct: false,
          feedback: "Incorrect — there is no contraindication to AMVUTTRA in immunosuppressed patients.",
          detail:
            "The AMVUTTRA prescribing information does not list immunosuppression as a contraindication. Post-transplant patients were included in clinical trials. Consulting the transplant team is good clinical practice, but framing AMVUTTRA as 'contraindicated' in immunosuppressed patients is factually incorrect.",
        },
        {
          id: "c6-s4-d",
          text: "AMVUTTRA may increase the risk of opportunistic infections when combined with immunosuppression — prophylactic antibiotics should be started.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA does not increase immunosuppression or infection risk.",
          detail:
            "AMVUTTRA acts intracellularly in hepatocytes to silence TTR mRNA. It does not affect immune function, white cell counts, or susceptibility to infection. There is no evidence that AMVUTTRA increases the risk of opportunistic infections, and prophylactic antibiotics are not indicated.",
        },
      ],
      expertCommentary:
        "The immunosuppression interaction question is a practical barrier that the transplant team will raise before approving AMVUTTRA. The answer is straightforward: vutrisiran's non-CYP450 metabolism means it has no interaction with tacrolimus, mycophenolate, or prednisolone. This clean interaction profile, combined with the absence of REMS requirements and the Q3M dosing convenience, makes AMVUTTRA an easy addition to a post-transplant regimen.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | Nair JK et al. J Am Chem Soc. 2014 | Vaishnaw AK et al. Nucleic Acid Ther. 2020",
      keyPoint: "No interaction with tacrolimus (CYP3A4) or mycophenolate (UGT). No dose adjustments required. AMVUTTRA's non-CYP450 metabolism ensures a clean interaction profile with all standard immunosuppressants.",
    },
    {
      id: "c6-s5",
      algorithmStep: { step: 7, label: "Staging & Monitoring", hint: "Step 7 of the Dx Algorithm: post-transplant monitoring requires tracking both neurological (NIS+7) and cardiac (NT-proBNP, echo) endpoints, as both can progress independently." },
      phase: "MONITOR",
      phaseColor: "#00C2A8",
      title: "12-Month Follow-Up — Dual-Indication Response",
      narrative:
        "At 12 months, the patient shows significant improvement. NIS+7 has decreased from 18 to 12 (neuropathy improving). Echo shows IVS stable at 14mm, LVEF improved to 58%. The patient is delighted: 'I feel better than I have in years.' However, the transplant team notes that tacrolimus trough levels have dropped from 5.2 to 3.8 ng/mL — below the target range of 5-10 ng/mL. They ask whether AMVUTTRA caused this.",
      clinicalFindings: [
        "NIS+7: 12 (down from 18 — improving neuropathy)",
        "LVEF: 58% (up from 55%)",
        "IVS: 14mm (stable)",
        "Tacrolimus trough: 3.8 ng/mL (below target 5-10 ng/mL)",
        "Liver function: normal",
        "No rejection episodes",
      ],
      question:
        "The transplant team asks whether the drop in tacrolimus trough levels (5.2 → 3.8 ng/mL) is caused by AMVUTTRA. How do you respond?",
      choices: [
        {
          id: "c6-s5-a",
          text: "AMVUTTRA does not affect tacrolimus levels — it is not metabolised by CYP3A4 and has no effect on tacrolimus pharmacokinetics. The trough drop is more likely due to improved hepatic function (as ATTR-CM improves, hepatic blood flow and CYP3A4 activity may normalise), a change in tacrolimus formulation, or dietary factors (grapefruit, St John's Wort). The transplant team should investigate these causes and adjust the tacrolimus dose as clinically indicated.",
          correct: true,
          feedback: "Correct — AMVUTTRA cannot cause tacrolimus trough changes; other causes should be investigated.",
          detail:
            "This response correctly exonerates AMVUTTRA (no CYP3A4 interaction), and importantly offers a clinically plausible alternative explanation: improved cardiac function leading to improved hepatic perfusion and normalised CYP3A4 activity. This is a sophisticated response that demonstrates deep pharmacological knowledge and builds credibility with the transplant team.",
        },
        {
          id: "c6-s5-b",
          text: "AMVUTTRA likely caused the tacrolimus drop via CYP3A4 induction — increase tacrolimus to 3mg BD.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA does not induce CYP3A4.",
          detail:
            "Vutrisiran does not induce CYP3A4. Attributing the tacrolimus trough drop to AMVUTTRA is factually incorrect and could lead to unnecessary tacrolimus dose increases, risking nephrotoxicity.",
        },
        {
          id: "c6-s5-c",
          text: "Stop AMVUTTRA immediately — the tacrolimus trough drop suggests a serious drug interaction that could lead to transplant rejection.",
          correct: false,
          feedback: "Incorrect — stopping AMVUTTRA based on a non-existent drug interaction is clinically harmful.",
          detail:
            "Stopping AMVUTTRA based on a pharmacokinetically impossible drug interaction would deprive the patient of a therapy showing excellent dual-indication response (NIS+7 improving, LVEF improving). The tacrolimus trough drop has an alternative explanation and should be investigated by the transplant team — it is not a reason to stop AMVUTTRA.",
        },
        {
          id: "c6-s5-d",
          text: "The tacrolimus drop is expected — AMVUTTRA reduces hepatic protein synthesis broadly, which affects tacrolimus binding proteins.",
          correct: false,
          feedback: "Incorrect — AMVUTTRA silences only TTR mRNA, not broad hepatic protein synthesis.",
          detail:
            "AMVUTTRA is highly specific — it silences only TTR mRNA via GalNAc-targeted siRNA. It does not broadly suppress hepatic protein synthesis or affect tacrolimus binding proteins. This response demonstrates a fundamental misunderstanding of the mechanism of action.",
        },
      ],
      expertCommentary:
        "This final stage tests the ability to defend AMVUTTRA's clean interaction profile under pressure from a transplant team. The tacrolimus trough drop is a real clinical scenario that will occur in post-transplant patients — and the ability to confidently exonerate AMVUTTRA while offering a plausible alternative explanation (improved cardiac function → improved hepatic perfusion → normalised CYP3A4) is a high-level competency. The 12-month response in this case — NIS+7 improving from 18 to 12, LVEF improving to 58% — is one of the most compelling dual-indication outcomes in the dossier.",
      evidence: "Alnylam Pharmaceuticals. AMVUTTRA Prescribing Information. 2025 | Fontana M et al. N Engl J Med. 2024 | Adams D et al. N Engl J Med. 2023",
      keyPoint: "AMVUTTRA cannot cause tacrolimus trough changes — no CYP3A4 interaction. Improved cardiac function may explain improved hepatic CYP3A4 activity. Excellent dual-indication response at 12 months.",
    },
  ],
};

const ALL_CASES: CaseData[] = [CASE_1, CASE_2, CASE_3, CASE_4, CASE_5, CASE_6];

// ─── Score badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  const color = pct >= 80 ? "#27AE60" : pct >= 60 ? "#E67E22" : "#C0392B";
  const label = pct >= 80 ? "Expert Clinician" : pct >= 60 ? "Developing Proficiency" : "Review Recommended";
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: `conic-gradient(${color} ${pct}%, #E8ECF0 0%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: 800, color, fontFamily: "'DM Sans', sans-serif" }}>
            {score}/{total}
          </div>
          <div style={{ fontSize: "10px", color: "#566573", fontFamily: "'DM Sans', sans-serif" }}>{pct}%</div>
        </div>
      </div>
      <div style={{ fontWeight: 700, fontSize: "14px", color, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total, phaseColors }: { current: number; total: number; phaseColors: string[] }) {
  const phases = ["SUSPECT", "SCREEN", "DIAGNOSE", "TREAT", "MONITOR"];
  const colors = phaseColors.length === total ? phaseColors : ["#0093C4", "#E67E22", "#27AE60", "#1A3A6B", "#00C2A8"];
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "24px", alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div
            style={{
              height: "4px",
              borderRadius: "2px",
              background: i <= current ? colors[i] : "#E8ECF0",
              width: "100%",
              transition: "background 0.3s ease",
            }}
          />
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              color: i <= current ? colors[i] : "#BDC3C7",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {phases[i] || `Stage ${i + 1}`}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Case Selection Lobby ─────────────────────────────────────────────────────
function CaseLobby({ onSelect }: { onSelect: (c: CaseData) => void }) {
  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#566573", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>
          Select a Clinical Case
        </div>
        <p style={{ fontSize: "13.5px", color: "#566573", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          Each case covers a distinct AMVUTTRA indication and clinical scenario. Choose a case to begin your simulation.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {ALL_CASES.map((c) => (
          <div
            key={c.id}
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(26,58,107,0.10)",
              border: "1px solid #E8ECF0",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={() => onSelect(c)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(26,58,107,0.16)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(26,58,107,0.10)";
            }}
          >
            {/* Card header */}
            <div
              style={{
                background: "linear-gradient(135deg, #0D2047, #1A3A6B)",
                padding: "28px",
                color: "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div
                  style={{
                    background: c.indicationColor,
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "4px",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {c.caseNumber}
                </div>
                <div
                  style={{
                    background: `${c.indicationColor}22`,
                    border: `1px solid ${c.indicationColor}55`,
                    color: c.indicationColor,
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "4px",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  {c.indication}
                </div>
              </div>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "1.35rem",
                  marginBottom: "6px",
                  letterSpacing: "-0.01em",
                }}
              >
                {c.title}
              </h3>
              <p style={{ opacity: 0.7, fontSize: "12.5px", fontFamily: "'DM Sans', sans-serif", margin: 0, lineHeight: 1.5 }}>
                {c.subtitle}
              </p>
            </div>

            {/* Card body */}
            <div style={{ padding: "20px 28px 24px" }}>
              {/* Meta row */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                {[
                  { icon: "⏱", label: c.duration },
                  { icon: "📊", label: `5 stages` },
                  { icon: "🎯", label: c.difficulty },
                ].map((m) => (
                  <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#566573", fontFamily: "'DM Sans', sans-serif" }}>
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Patient summary preview */}
              <div style={{ marginBottom: "20px" }}>
                {c.patientSummary.slice(0, 4).map((item) => (
                  <div key={item} style={{ display: "flex", gap: "8px", padding: "3px 0", fontSize: "12.5px", color: "#445566", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                    <span style={{ color: c.indicationColor, fontWeight: 700, flexShrink: 0 }}>·</span>
                    {item}
                  </div>
                ))}
                {c.patientSummary.length > 4 && (
                  <div style={{ fontSize: "11px", color: "#95A5A6", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>
                    +{c.patientSummary.length - 4} more details...
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(c); }}
                style={{
                  background: `linear-gradient(135deg, ${c.indicationColor}, ${c.indicationColor}CC)`,
                  color: "white",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  width: "100%",
                  letterSpacing: "0.3px",
                  boxShadow: `0 4px 16px ${c.indicationColor}40`,
                }}
              >
                Begin {c.caseNumber} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CaseSimulatorSection() {
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [started, setStarted] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showExpert, setShowExpert] = useState(false);
  const [completed, setCompleted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stage = selectedCase ? selectedCase.stages[currentStageIndex] : null;
  const score = answers.filter((a) => a.correct).length;

  // ── Listen for "practice-case" custom event from Dx Algorithm ──────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const caseId = (e as CustomEvent<string>).detail;
      const found = ALL_CASES.find((c) => c.id === caseId);
      if (found) {
        setSelectedCase(found);
        setStarted(false);
        setCurrentStageIndex(0);
        setSelectedChoice(null);
        setAnswered(false);
        setAnswers([]);
        setShowExpert(false);
        setCompleted(false);
        // Scroll to this section
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    };
    window.addEventListener("practice-case", handler);
    return () => window.removeEventListener("practice-case", handler);
  }, []);

  const handleCaseSelect = (c: CaseData) => {
    setSelectedCase(c);
    setStarted(false);
    setCurrentStageIndex(0);
    setSelectedChoice(null);
    setAnswered(false);
    setAnswers([]);
    setShowExpert(false);
    setCompleted(false);
  };

  const handleChoice = (choiceId: string) => {
    if (answered || !stage) return;
    const choice = stage.choices.find((c) => c.id === choiceId)!;
    setSelectedChoice(choiceId);
    setAnswered(true);
    setAnswers((prev) => [
      ...prev,
      { stageId: stage.id, choiceId, correct: choice.correct },
    ]);
  };

  const handleNext = () => {
    if (!selectedCase) return;
    if (currentStageIndex < selectedCase.stages.length - 1) {
      setCurrentStageIndex((i) => i + 1);
      setSelectedChoice(null);
      setAnswered(false);
      setShowExpert(false);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setSelectedCase(null);
    setStarted(false);
    setCurrentStageIndex(0);
    setSelectedChoice(null);
    setAnswered(false);
    setAnswers([]);
    setShowExpert(false);
    setCompleted(false);
  };

  const selectedChoiceData = selectedChoice && stage
    ? stage.choices.find((c) => c.id === selectedChoice)
    : null;
  void selectedChoiceData;

  const phaseColors = selectedCase
    ? selectedCase.stages.map((s) => s.phaseColor)
    : [];

  return (
    <section
      id="case-simulator"
      ref={sectionRef}
      style={{ padding: "80px 0", background: "linear-gradient(180deg, #F0F4F8 0%, #E8ECF0 100%)" }}
      aria-label="Patient case simulator"
    >
      <div className="container">
        {/* Section header */}
        <div style={{ marginBottom: "40px" }}>
          <div className="section-accent" />
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              color: "#1A3A6B",
              marginBottom: "8px",
            }}
          >
            Patient Case Simulator
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "640px" }}>
            Interactive clinical decision training — make real-time diagnostic and treatment choices with expert feedback
          </p>
          <div style={{ marginTop: "14px", display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "linear-gradient(135deg, #E6F7F5, #EFF6FF)", border: "1.5px solid #00C2A8", borderRadius: "10px" }}>
            <span style={{ fontSize: "18px" }}>🔬</span>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#00C2A8", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: "2px" }}>Integrated with Dx Algorithm</div>
              <div style={{ fontSize: "12px", color: "#1A3A6B" }}>Each case stage links directly to the relevant algorithm step — contextual hints appear after every decision.</div>
            </div>
            <a
              href="#diagnostic-algorithm"
              onClick={(e) => { e.preventDefault(); const el = document.getElementById("diagnostic-algorithm"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "#00C2A8", textDecoration: "none", padding: "5px 12px", borderRadius: "7px", border: "1px solid #00C2A840", background: "#fff", whiteSpace: "nowrap" as const }}
            >
              Open Dx Algorithm →
            </a>
          </div>
        </div>

        {/* ── LOBBY: No case selected ── */}
        {!selectedCase && (
          <CaseLobby onSelect={handleCaseSelect} />
        )}

        {/* ── START SCREEN: Case selected, not yet started ── */}
        {selectedCase && !started && !completed && (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(26,58,107,0.10)",
              border: "1px solid #E8ECF0",
            }}
          >
            {/* Case header */}
            <div
              style={{
                background: "linear-gradient(135deg, #0D2047, #1A3A6B)",
                padding: "32px",
                color: "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div
                  style={{
                    background: selectedCase.indicationColor,
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {selectedCase.caseNumber}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.6, fontFamily: "'DM Sans', sans-serif" }}>
                  5 stages · {selectedCase.duration} · {selectedCase.indication}
                </div>
              </div>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "1.6rem",
                  marginBottom: "6px",
                  letterSpacing: "-0.02em",
                }}
              >
                {selectedCase.title}
              </h3>
              <p style={{ opacity: 0.75, fontSize: "14px", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                {selectedCase.subtitle}
              </p>
            </div>

            {/* Patient summary */}
            <div style={{ padding: "28px 32px" }}>
              <div style={{ fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#1A3A6B", marginBottom: "14px", fontFamily: "'DM Sans', sans-serif" }}>
                Patient Presentation
              </div>
              <div
                style={{
                  background: "#F8F9FA",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid #E8ECF0",
                  marginBottom: "24px",
                }}
              >
                {selectedCase.patientSummary.map((item) => (
                  <div key={item} style={{ display: "flex", gap: "10px", padding: "4px 0", fontSize: "13.5px", color: "#445566", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                    <span style={{ color: selectedCase.indicationColor, fontWeight: 700, flexShrink: 0 }}>·</span>
                    {item}
                  </div>
                ))}
              </div>

              {/* What to expect */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
                {[
                  { icon: "🔍", label: "5 Clinical Stages", desc: "Suspect → Screen → Diagnose → Treat → Monitor" },
                  { icon: "🎯", label: "Decision Points", desc: "4 choices per stage — only one is fully correct" },
                  { icon: "📊", label: "Expert Feedback", desc: "Evidence-based commentary on every decision" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "#F0F4F8",
                      borderRadius: "10px",
                      padding: "14px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "6px" }}>{item.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "12px", color: "#1A3A6B", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontSize: "11px", color: "#566573", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setStarted(true)}
                  style={{
                    background: `linear-gradient(135deg, ${selectedCase.indicationColor}, ${selectedCase.indicationColor}CC)`,
                    color: "white",
                    border: "none",
                    padding: "14px 36px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    letterSpacing: "0.3px",
                    boxShadow: `0 4px 16px ${selectedCase.indicationColor}40`,
                  }}
                >
                  Begin Case Simulation →
                </button>
                <button
                  onClick={() => setSelectedCase(null)}
                  style={{
                    background: "white",
                    color: "#566573",
                    border: "1px solid #E8ECF0",
                    padding: "14px 24px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  ← Back to Cases
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── COMPLETED SCREEN ── */}
        {completed && selectedCase && (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(26,58,107,0.10)",
              border: "1px solid #E8ECF0",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #0D2047, #1A3A6B)",
                padding: "28px 32px",
                color: "white",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.6rem", marginBottom: "4px" }}>
                Case Complete
              </div>
              <div style={{ opacity: 0.7, fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>
                {selectedCase.title}
              </div>
            </div>
            <div style={{ padding: "36px 32px" }}>
              <ScoreBadge score={score} total={selectedCase.stages.length} />

              <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {selectedCase.stages.map((s, i) => {
                  const ans = answers.find((a) => a.stageId === s.id);
                  const correct = ans?.correct ?? false;
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        background: correct ? "#EAFAF1" : "#FDEDEC",
                        border: `1px solid ${correct ? "#27AE60" : "#C0392B"}`,
                        borderRadius: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: correct ? "#27AE60" : "#C0392B",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          flexShrink: 0,
                        }}
                      >
                        {correct ? "✓" : "✗"}
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: s.phaseColor, fontFamily: "'DM Sans', sans-serif" }}>
                          Stage {i + 1}: {s.phase}
                        </div>
                        <div style={{ fontSize: "13px", color: "#1A3A6B", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                          {s.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "28px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={handleRestart}
                  style={{
                    background: "linear-gradient(135deg, #0093C4, #00C2A8)",
                    color: "white",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  ← Choose Another Case
                </button>
                <button
                  onClick={() => {
                    // Replay same case
                    setStarted(false);
                    setCurrentStageIndex(0);
                    setSelectedChoice(null);
                    setAnswered(false);
                    setAnswers([]);
                    setShowExpert(false);
                    setCompleted(false);
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${selectedCase.indicationColor}, ${selectedCase.indicationColor}CC)`,
                    color: "white",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Replay This Case
                </button>
                <button
                  onClick={() => {
                    document.getElementById("knowledge")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    background: "white",
                    color: "#1A3A6B",
                    border: "1px solid #E8ECF0",
                    padding: "12px 28px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Review Knowledge Cards
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVE STAGE ── */}
        {started && !completed && stage && selectedCase && (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(26,58,107,0.10)",
              border: "1px solid #E8ECF0",
            }}
          >
            {/* Stage header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${stage.phaseColor}22, ${stage.phaseColor}08)`,
                borderBottom: `3px solid ${stage.phaseColor}`,
                padding: "20px 28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: stage.phaseColor, fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>
                  Stage {currentStageIndex + 1} of {selectedCase.stages.length} · {stage.phase} · {selectedCase.caseNumber}
                </div>
                <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: "#1A3A6B", margin: 0 }}>
                  {stage.title}
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <div style={{ textAlign: "right", fontSize: "12px", color: "#566573", fontFamily: "'DM Sans', sans-serif" }}>
                  Score: <strong style={{ color: "#1A3A6B" }}>{score}/{answers.length}</strong>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "11px",
                    color: "#95A5A6",
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  ← Cases
                </button>
                <a
                  href="#diagnostic-algorithm"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("diagnostic-algorithm");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "4px",
                    fontSize: "10px", fontWeight: 700, color: "#00C2A8",
                    textDecoration: "none",
                    padding: "3px 8px", borderRadius: "5px",
                    border: "1px solid #00C2A840",
                    background: "#E6F7F5",
                  }}
                >
                  🔬 Dx Algorithm
                </a>
              </div>
            </div>

            <div style={{ padding: "28px" }}>
              {/* Progress */}
              <ProgressBar current={currentStageIndex} total={selectedCase.stages.length} phaseColors={phaseColors} />

              {/* Narrative */}
              <div
                style={{
                  background: "#F8F9FA",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #E8ECF0",
                  borderLeft: `4px solid ${stage.phaseColor}`,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: stage.phaseColor, marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                  Clinical Scenario
                </div>
                <p style={{ fontSize: "13.5px", color: "#2C3E50", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  {stage.narrative}
                </p>
              </div>

              {/* Clinical findings */}
              {stage.clinicalFindings && (
                <div
                  style={{
                    background: "#EBF5FB",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    border: "1px solid #AED6F1",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#0093C4", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                    Key Clinical Findings
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px" }}>
                    {stage.clinicalFindings.map((f) => (
                      <div key={f} style={{ display: "flex", gap: "8px", fontSize: "12.5px", color: "#1A5276", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                        <span style={{ color: "#0093C4", flexShrink: 0 }}>→</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question */}
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1A3A6B", marginBottom: "16px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                {stage.question}
              </div>

              {/* Choices */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {stage.choices.map((choice) => {
                  const isSelected = selectedChoice === choice.id;
                  const showResult = answered && isSelected;
                  let bg = "white";
                  let border = "1px solid #E8ECF0";
                  let textColor = "#2C3E50";
                  if (showResult && choice.correct) { bg = "#EAFAF1"; border = "2px solid #27AE60"; }
                  if (showResult && !choice.correct) { bg = "#FDEDEC"; border = "2px solid #C0392B"; }
                  if (answered && !isSelected && choice.correct) { bg = "#EAFAF1"; border = "2px dashed #27AE60"; }
                  void textColor;

                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice.id)}
                      disabled={answered}
                      style={{
                        background: bg,
                        border,
                        borderRadius: "12px",
                        padding: "14px 18px",
                        textAlign: "left",
                        cursor: answered ? "default" : "pointer",
                        transition: "all 0.15s ease",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? (choice.correct ? "#27AE60" : "#C0392B") : "#BDC3C7"}`,
                          background: isSelected ? (choice.correct ? "#27AE60" : "#C0392B") : "transparent",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        {isSelected ? (choice.correct ? "✓" : "✗") : ""}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13.5px", color: "#2C3E50", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, lineHeight: 1.5 }}>
                          {choice.text}
                        </div>
                        {showResult && (
                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "12.5px",
                              color: choice.correct ? "#1E8449" : "#922B21",
                              fontFamily: "'DM Sans', sans-serif",
                              lineHeight: 1.6,
                              fontWeight: 600,
                            }}
                          >
                            {choice.feedback}
                          </div>
                        )}
                        {showResult && choice.detail && (
                          <div
                            style={{
                              marginTop: "6px",
                              fontSize: "12px",
                              color: "#445566",
                              fontFamily: "'DM Sans', sans-serif",
                              lineHeight: 1.6,
                            }}
                          >
                            {choice.detail}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Post-answer panel */}
              {answered && (
                <div>
                  {/* Key point */}
                  {stage.keyPoint && (
                    <div
                      style={{
                        background: `${stage.phaseColor}12`,
                        border: `1px solid ${stage.phaseColor}40`,
                        borderRadius: "10px",
                        padding: "12px 16px",
                        marginBottom: "12px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{ fontSize: "16px", flexShrink: 0 }}>💡</span>
                      <div style={{ fontSize: "12.5px", color: "#1A3A6B", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, lineHeight: 1.5 }}>
                        <strong>Key Point:</strong> {stage.keyPoint}
                      </div>
                    </div>
                  )}

                  {/* Dx Algorithm contextual hint */}
                  {stage.algorithmStep && (
                    <div
                      style={{
                        background: "linear-gradient(135deg, #E6F7F5, #EFF6FF)",
                        border: "1.5px solid #00C2A8",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        marginBottom: "12px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "8px",
                        background: "#00C2A8", color: "#fff",
                        fontSize: "13px", fontWeight: 800,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {stage.algorithmStep.step}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "10px", fontWeight: 800, color: "#00C2A8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Dx Algorithm · Step {stage.algorithmStep.step}
                          </span>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 8px", borderRadius: "4px", background: "#00C2A820", color: "#0d9488" }}>
                            {stage.algorithmStep.label}
                          </span>
                        </div>
                        <p style={{ fontSize: "12px", color: "#1A3A6B", lineHeight: 1.6, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>
                          {stage.algorithmStep.hint}
                        </p>
                        <a
                          href="#diagnostic-algorithm"
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById("diagnostic-algorithm");
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "5px",
                            fontSize: "11px", fontWeight: 700, color: "#00C2A8",
                            textDecoration: "none",
                            padding: "4px 10px", borderRadius: "6px",
                            border: "1px solid #00C2A840",
                            background: "#fff",
                          }}
                        >
                          View Step {stage.algorithmStep.step} in Dx Algorithm →
                        </a>
                      </div>
                    </div>
                  )}
                  {/* Expert commentary toggle */}
                  <button
                    onClick={() => setShowExpert((v) => !v)}
                    style={{
                      background: "none",
                      border: `1px solid ${stage.phaseColor}`,
                      color: stage.phaseColor,
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: "pointer",
                      marginBottom: "12px",
                    }}
                  >
                    {showExpert ? "▲ Hide Expert Commentary" : "▼ Show Expert Commentary"}
                  </button>

                  {showExpert && (
                    <div
                      style={{
                        background: "#F8F9FA",
                        borderRadius: "12px",
                        padding: "18px",
                        marginBottom: "12px",
                        border: "1px solid #E8ECF0",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#566573", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                        Expert Commentary
                      </div>
                      <p style={{ fontSize: "13px", color: "#2C3E50", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: "0 0 10px" }}>
                        {stage.expertCommentary}
                      </p>
                      {stage.evidence && (
                        <div style={{ fontSize: "11px", color: "#95A5A6", fontFamily: "'JetBrains Mono', monospace", borderTop: "1px solid #E8ECF0", paddingTop: "8px" }}>
                          📚 {stage.evidence}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Next button */}
                  <button
                    onClick={handleNext}
                    style={{
                      background: `linear-gradient(135deg, ${stage.phaseColor}, ${stage.phaseColor}CC)`,
                      color: "white",
                      border: "none",
                      padding: "12px 28px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 700,
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: "pointer",
                      boxShadow: `0 4px 16px ${stage.phaseColor}40`,
                    }}
                  >
                    {currentStageIndex < selectedCase.stages.length - 1
                      ? `Continue to Stage ${currentStageIndex + 2}: ${selectedCase.stages[currentStageIndex + 1].phase} →`
                      : "View Final Results →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
