/* AccountProfileSection.tsx
   ATTR Patient Archetype Profiles
   Design: Clinical Precision / Swiss Medical Modernism — dark navy theme
   Purpose: Help reps recognise ATTR patients in HCP conversations,
            understand which indication applies, and deploy the right script. */

import { useState } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Indication = "ATTR-CM" | "hATTR-PN" | "Dual Indication";
type ProfileTab  = "clinical" | "diagnostic" | "treatment" | "playbook";

interface KeyTest {
  test: string;
  result: string;
  significance: string;
}

interface OutcomeData {
  trial: string;
  population: string;
  endpoint: string;
  result: string;
  pValue: string;
}

interface Objection {
  q: string;
  a: string;
}

interface PatientProfile {
  id: string;
  name: string;                    // archetype label
  subtitle: string;                // one-line clinical hook
  indication: Indication;
  demographics: {
    age: string;
    sex: string;
    region: string;
    variant?: string;
    bmi?: string;
    comorbidities: string[];
  };
  presentation: {
    chiefComplaint: string;
    redFlags: string[];
    examFindings: string[];
    functionalClass: string;
  };
  diagnosticJourney: {
    avgDelay: string;
    initialDiagnoses: string[];
    keyTests: KeyTest[];
    diagnosisConfirmation: string;
  };
  treatment: {
    indication: string;
    priorTherapy?: string;
    switchReason?: string;
    amvutraDose: string;
    monitoring: string[];
    patientSupportNeeds: string[];
  };
  outcomeData: OutcomeData[];
  repPlaybook: {
    opener: string;
    evidenceBridge: string;
    patientSupportHook: string;
    close: string;
    avoidTopics: string[];
  };
  objections: Objection[];
  urgencySignals: string[];        // clinical triggers the rep should flag to HCP
}

// ─── COLOUR SYSTEM ────────────────────────────────────────────────────────────

const IND_COLOR: Record<Indication, { fill: string; bg: string; border: string; label: string }> = {
  "ATTR-CM":        { fill: "#00C2A8", bg: "rgba(0,194,168,0.12)",   border: "rgba(0,194,168,0.35)",   label: "ATTR-CM" },
  "hATTR-PN":       { fill: "#22C55E", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.35)",   label: "hATTR-PN" },
  "Dual Indication":{ fill: "#F59E0B", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.35)",  label: "Dual Indication" },
};

// ─── PATIENT ARCHETYPE DATA ───────────────────────────────────────────────────

const PROFILES: PatientProfile[] = [
  // ── 1. ATTRwt-CM Classic ──────────────────────────────────────────────────
  {
    id: "attrwt-cm-classic",
    name: "ATTRwt-CM Classic",
    subtitle: "72M · HFpEF + bilateral CTS · low-voltage ECG",
    indication: "ATTR-CM",
    demographics: {
      age: "72 years",
      sex: "Male",
      region: "Riyadh Region",
      variant: "Wild-type (no TTR mutation)",
      bmi: "28.4 kg/m²",
      comorbidities: ["HFpEF (EF 52%)", "Hypertension", "Bilateral carpal tunnel syndrome (CTS)", "Lumbar spinal stenosis", "Mild renal impairment (eGFR 52)"],
    },
    presentation: {
      chiefComplaint: "Progressive exertional dyspnea, bilateral leg oedema, and reduced exercise tolerance over 18 months. Bilateral hand paraesthesia for 3 years.",
      redFlags: [
        "HFpEF with disproportionate LVH (wall thickness ≥12 mm)",
        "Low-voltage ECG despite LVH on echo",
        "Bilateral CTS (3–5 years before cardiac symptoms)",
        "Lumbar spinal stenosis (amyloid deposition)",
        "Sparkling granular myocardial texture on echo",
        "History of bilateral CTS surgery",
        "Age >65 male with unexplained HFpEF",
      ],
      examFindings: ["LVEF 52%, IVS 17mm", "Grade II diastolic dysfunction", "Pericardial effusion", "Low-voltage limb leads on 12-lead ECG", "Voltage-to-mass discordance"],
      functionalClass: "NYHA Class II–III",
    },
    diagnosticJourney: {
      avgDelay: "3.4 years (national average; many patients undiagnosed)",
      initialDiagnoses: ["Hypertensive heart disease", "Idiopathic HFpEF", "Age-related LVH", "Hypertrophic cardiomyopathy"],
      keyTests: [
        { test: "Tc-PYP Scintigraphy", result: "Grade 2–3 uptake, H/CL ratio >1.5", significance: "Diagnostic for ATTR-CM without biopsy when monoclonal protein excluded (Gillmore criteria)" },
        { test: "Serum/urine protein electrophoresis + FLC", result: "Negative (excludes AL amyloid)", significance: "Mandatory before non-biopsy Tc-PYP diagnosis" },
        { test: "TTR genetic testing", result: "No pathogenic variant detected", significance: "Confirms wild-type ATTR-CM" },
        { test: "CMR with late gadolinium enhancement", result: "Diffuse subendocardial/transmural LGE", significance: "Supports amyloid infiltration pattern" },
        { test: "NT-proBNP", result: "3,842 pg/mL (elevated)", significance: "Biomarker of cardiac stress; used for monitoring response to AMVUTTRA" },
      ],
      diagnosisConfirmation: "Non-biopsy diagnosis: Tc-PYP Grade ≥2 + negative haematological workup (Gillmore 2016 criteria). Confirmed ATTRwt-CM.",
    },
    treatment: {
      indication: "AMVUTTRA is indicated for the treatment of cardiomyopathy of wild-type or hereditary transthyretin-mediated amyloidosis (ATTR-CM) in adults.",
      amvutraDose: "25 mg SC every 3 months (Q3M)",
      monitoring: ["NT-proBNP at baseline, 3, 6, 12 months", "Echo at baseline and 12 months (LVEF, wall thickness, GLS)", "eGFR and liver function at baseline", "6-minute walk test (6MWT) every 6 months", "KCCQ-OS at each visit"],
      patientSupportNeeds: ["Alnylam Assist® enrolment (reimbursement navigation)", "Injection training (SC self-injection or caregiver)", "Vitamin A supplementation counselling (not required for AMVUTTRA)", "Cardiac rehab referral", "Patient ID card for emergency departments"],
    },
    outcomeData: [
      { trial: "HELIOS-B", population: "ATTR-CM (all-comers)", endpoint: "All-cause mortality + CV events (composite)", result: "28% RRR (HR 0.72, 95% CI 0.56–0.93)", pValue: "p=0.0106" },
      { trial: "HELIOS-B", population: "ATTR-CM (monotherapy)", endpoint: "All-cause mortality + CV events", result: "33% RRR (HR 0.67, 95% CI 0.50–0.90)", pValue: "p=0.0074" },
      { trial: "HELIOS-B", population: "ATTR-CM (all-comers)", endpoint: "All-cause mortality (36 months)", result: "35% RRR vs placebo", pValue: "p=0.0013" },
      { trial: "HELIOS-B", population: "ATTR-CM (all-comers)", endpoint: "6MWT distance", result: "+24.8 m vs −4.2 m (placebo)", pValue: "p<0.001" },
    ],
    repPlaybook: {
      opener: "Dr., I want to share a profile I think you'll recognise — a 72-year-old male with HFpEF, bilateral CTS, and low-voltage ECG. We know that up to 13% of HFpEF patients have undiagnosed ATTR-CM. Does this patient type come through your clinic?",
      evidenceBridge: "In HELIOS-B, patients like this — ATTRwt-CM, NYHA II–III — saw a 35% reduction in all-cause mortality and a 28% reduction in the CV composite at 30 months. These are landmark outcomes for a disease that until recently had no approved RNAi option.",
      patientSupportHook: "Alnylam Assist® handles the prior auth and reimbursement work so your team doesn't carry that burden. Same-day enrolment via a single form.",
      close: "Could we identify 2–3 patients in your HFpEF clinic who've had CTS or unexplained LVH? I can arrange a Tc-PYP referral conversation with the nuclear medicine team if that would help.",
      avoidTopics: ["Head-to-head comparisons without full data context", "Off-label dosing questions", "Speculative combination with tafamidis"],
    },
    objections: [
      { q: "My patient is already on tafamidis — why switch?", a: "AMVUTTRA works via a different mechanism — TTR knockdown vs. stabilisation. In the HELIOS-B tafamidis-naïve subgroup, the mortality benefit was even stronger (HR 0.67 monotherapy). For patients with ongoing functional decline on tafamidis, the evidence supports considering AMVUTTRA." },
      { q: "The Tc-PYP scan isn't available at my hospital.", a: "KFSH&RC, KAMC-NGHA, and KFSH Jeddah all have active Tc-PYP programmes. I can facilitate a direct referral pathway — your patient can have the scan and come back to you with a confirmed diagnosis." },
      { q: "I'm not sure this patient's HFpEF is actually ATTR.", a: "That uncertainty is exactly why Tc-PYP is so powerful — it gives you a non-invasive, non-biopsy diagnosis in under 90 minutes. Given the CTS history and low-voltage ECG, this patient's pre-test probability is high. The scan rules it in or out definitively." },
    ],
    urgencySignals: [
      "HFpEF + unexplained LVH (IVS >12mm) in male >65",
      "Low-voltage ECG with preserved EF",
      "Bilateral CTS ± lumbar spinal stenosis",
      "NT-proBNP elevation disproportionate to symptoms",
      "Biceps tendon rupture in patient's history",
    ],
  },

  // ── 2. hATTR-PN Val30Met Classic ─────────────────────────────────────────
  {
    id: "hattr-pn-v30m",
    name: "hATTR-PN (Val30Met)",
    subtitle: "54F · progressive polyneuropathy · family history",
    indication: "hATTR-PN",
    demographics: {
      age: "54 years",
      sex: "Female",
      region: "Riyadh Region",
      variant: "Val30Met (p.V30M) — most prevalent hATTR variant in KSA",
      bmi: "22.1 kg/m²",
      comorbidities: ["Hereditary transthyretin amyloid polyneuropathy (hATTR-PN)", "Autonomic neuropathy (orthostatic hypotension)", "Father diagnosed with ATTR at age 61"],
    },
    presentation: {
      chiefComplaint: "2-year history of bilateral distal lower limb numbness and paraesthesia progressing proximally, unsteady gait, and episodic dizziness on standing. Recent weight loss of 6 kg.",
      redFlags: [
        "Length-dependent sensorimotor polyneuropathy",
        "Autonomic features: orthostatic hypotension, GI dysmotility, impotence",
        "Family history of ATTR in first-degree relative",
        "Early CTS (>10 years before PN symptoms)",
        "Inexplicable weight loss",
        "Negative routine workup (anti-MAG, anti-GM1, paraneoplastic all negative)",
      ],
      examFindings: ["Reduced vibration sense (128Hz tuning fork) from toes to mid-calf", "Absent ankle reflexes bilaterally", "Positive Romberg", "NIS+7 score: 34 (moderate impairment)", "Orthostatic BP drop: 22/14 mmHg"],
      functionalClass: "PND Stage IIIa (ambulatory with assistance)",
    },
    diagnosticJourney: {
      avgDelay: "4.7 years (longer in hATTR-PN due to mimicry of CIDP, DPN, CMT)",
      initialDiagnoses: ["Diabetic peripheral neuropathy", "CIDP (chronic inflammatory demyelinating polyneuropathy)", "Charcot-Marie-Tooth disease", "Idiopathic axonal polyneuropathy"],
      keyTests: [
        { test: "TTR genetic testing (blood)", result: "Val30Met (p.V30M) confirmed", significance: "Diagnostic. Genetic counselling offered to first-degree relatives." },
        { test: "Nerve biopsy (sural nerve)", result: "Congophilic amyloid deposits; TTR immunostaining positive", significance: "Confirmatory if genetic result equivocal; not always required" },
        { test: "NIS+7 (Neuropathy Impairment Score + 7)", result: "Baseline 34; +7.2 at 12 months (untreated disease course)", significance: "Primary endpoint in HELIOS-A; tracks treatment response" },
        { test: "mBMI", result: "678 kg/m² × g/L (below 900 threshold)", significance: "Marker of nutritional status and prognosis; used as HELIOS-A secondary endpoint" },
        { test: "Cardiac echo + NT-proBNP", result: "IVS 11 mm, NT-proBNP 420 pg/mL (borderline)", significance: "Assess for early cardiac co-involvement; informs dual indication consideration" },
      ],
      diagnosisConfirmation: "Genetic testing (Val30Met) confirmed hATTR-PN. Nerve biopsy showed TTR-positive amyloid deposits.",
    },
    treatment: {
      indication: "AMVUTTRA is indicated for the treatment of the polyneuropathy of hereditary transthyretin-mediated amyloidosis (hATTR-PN) in adults.",
      amvutraDose: "25 mg SC every 3 months (Q3M)",
      monitoring: ["NIS+7 at baseline, 9, 18 months", "mBMI at each visit", "Norfolk QOL-DN questionnaire", "NT-proBNP for cardiac monitoring", "Ophthalmology review (vitreous amyloid deposits possible)", "Liver function (TTR synthesised in liver)"],
      patientSupportNeeds: ["Alnylam Assist® reimbursement support", "Genetic counselling referral (family cascade testing)", "Nutritional support referral (weight loss, mBMI)", "Physiotherapy for gait rehabilitation", "Orthostatic hypotension management education"],
    },
    outcomeData: [
      { trial: "HELIOS-A", population: "hATTR-PN (all stages)", endpoint: "NIS+7 change at 9 months", result: "−0.6 vs +17.4 (inotersen-RNAi 21 comparator)", pValue: "p<0.001" },
      { trial: "HELIOS-A", population: "hATTR-PN (all stages)", endpoint: "mBMI (nutritional status)", result: "+3.0 vs −14.7 (placebo comparison)", pValue: "p<0.001" },
      { trial: "HELIOS-A", population: "hATTR-PN (all stages)", endpoint: "Norfolk QOL-DN (quality of life)", result: "Significant improvement vs comparator", pValue: "p<0.001" },
      { trial: "HELIOS-A", population: "hATTR-PN TTR suppression", endpoint: "Mean serum TTR reduction", result: "94% suppression from baseline", pValue: "p<0.001" },
    ],
    repPlaybook: {
      opener: "Dr., I'd like to walk you through a patient archetype that I think is underdiagnosed in your neurology practice — a patient in their 50s with progressive distal neuropathy, autonomic features, and a family member diagnosed with ATTR. Do you see patients like this?",
      evidenceBridge: "In HELIOS-A, AMVUTTRA patients showed near-complete arrest of NIS+7 progression — a mean change of −0.6 versus +17.4 in the comparator arm at 9 months. This is a disease that otherwise progresses relentlessly, and we now have a SC Q3M option with 94% TTR suppression.",
      patientSupportHook: "For your patient's family members, Alnylam Assist® can coordinate cascade genetic testing. Early identification means treatment before irreversible axonal loss.",
      close: "If you have a patient with unexplained axonal polyneuropathy and autonomic features — especially with a family history — would you consider adding TTR genetic testing to your workup? I can leave you a testing request card from Alnylam Act® today.",
      avoidTopics: ["Comparing directly to patisiran without full data context in this setting", "Specific time to response claims beyond trial data"],
    },
    objections: [
      { q: "She's been stable on patisiran — is there a reason to switch?", a: "AMVUTTRA offers the same RNAi mechanism as patisiran, but subcutaneously every 3 months versus IV every 3 weeks. In HELIOS-A, the SC formulation achieved 94% TTR suppression — equivalent to patisiran. The convenience benefit is real: no IV centre visits, no pre-medication. Many patients report significant quality of life improvement with the switch." },
      { q: "The genetic result came back negative — does that rule out hATTR?", a: "Not entirely. There are over 130 reported TTR pathogenic variants. If clinical suspicion remains high, a nerve biopsy with TTR immunostaining is the next step. Negative testing for common variants doesn't exclude rare or novel mutations." },
    ],
    urgencySignals: [
      "Progressive length-dependent polyneuropathy + autonomic features",
      "First-degree relative with ATTR or unexplained neuropathy",
      "CTS >10 years before neuropathy symptoms",
      "Negative routine neuropathy workup (anti-MAG, paraneoplastic)",
      "NIS+7 score rapidly worsening (>4 points/year)",
    ],
  },

  // ── 3. Dual Indication — Val142Ile (KSA-prevalent) ────────────────────────
  {
    id: "dual-val142ile",
    name: "Dual Indication (Val142Ile)",
    subtitle: "63M · cardiac + neurological involvement · KSA-prevalent variant",
    indication: "Dual Indication",
    demographics: {
      age: "63 years",
      sex: "Male",
      region: "Riyadh / Jeddah corridor",
      variant: "Val142Ile (p.V142I) — ~60% of hATTR-PN burden in Saudi Arabia",
      bmi: "26.8 kg/m²",
      comorbidities: ["hATTR-PN (Val142Ile)", "ATTR-CM (hereditary)", "HFrEF (EF 41%)", "Bilateral CTS (operated 2 years prior)", "Autonomic neuropathy"],
    },
    presentation: {
      chiefComplaint: "Combined presentation: exertional dyspnea (NYHA III), bilateral leg swelling, and distal upper and lower limb numbness. Strong family history — brother diagnosed with 'heart failure' at 58.",
      redFlags: [
        "Both cardiac and neurological involvement simultaneously",
        "Val142Ile variant (high prevalence in KSA population)",
        "Family history of premature heart failure",
        "Bilateral CTS preceding other symptoms by years",
        "Autonomic dysfunction (GI motility, orthostasis)",
        "Young-onset HFrEF without ischaemia",
      ],
      examFindings: ["LVEF 41%, IVS 14mm", "NIS+7 score: 28", "Bilateral reduced vibration sense (ankles)", "Grade 2 ankle oedema", "NT-proBNP: 4,210 pg/mL"],
      functionalClass: "NYHA III / PND Stage IIIa",
    },
    diagnosticJourney: {
      avgDelay: "5+ years — dual presentation often leads to separate cardiac/neurology workup with no unified diagnosis",
      initialDiagnoses: ["Non-ischaemic cardiomyopathy", "Idiopathic neuropathy", "Metabolic syndrome", "Diabetic cardiomyopathy (despite no diabetes)"],
      keyTests: [
        { test: "TTR genetic testing", result: "Val142Ile (p.V142I) confirmed", significance: "Establishes hereditary ATTR. First-degree family members should be tested." },
        { test: "Tc-PYP scintigraphy", result: "Grade 3 uptake (H/CL 1.82)", significance: "Confirms ATTR-CM component; together with genetic result, both indications established." },
        { test: "Nerve conduction study (NCS/EMG)", result: "Axonal sensorimotor polyneuropathy — length-dependent", significance: "Confirms hATTR-PN component; NIS+7 baseline for treatment monitoring." },
        { test: "Echocardiogram", result: "IVS 14mm, EF 41%, grade 2 diastolic dysfunction", significance: "Quantifies cardiac amyloid burden; baseline for AMVUTTRA response." },
        { test: "CMR", result: "Transmural LGE in basal inferolateral segments", significance: "Consistent with advanced cardiac amyloid deposition." },
      ],
      diagnosisConfirmation: "Both ATTR-CM and hATTR-PN confirmed. AMVUTTRA uniquely addresses both indications simultaneously with one Q3M SC injection.",
    },
    treatment: {
      indication: "AMVUTTRA is the only RNAi therapy approved for BOTH ATTR-CM AND hATTR-PN — addressing both disease manifestations with a single treatment.",
      amvutraDose: "25 mg SC every 3 months (Q3M) — same dose regardless of indication",
      monitoring: ["NT-proBNP + echo at baseline, 6, 12 months", "NIS+7 at baseline, 9, 18 months", "mBMI at each visit", "Liver function tests", "Norfolk QOL-DN + KCCQ-OS", "Ophthalmology (vitreous deposits)"],
      patientSupportNeeds: ["Alnylam Assist® — dual indication navigation", "Cardiology + Neurology co-management coordination", "Family genetic cascade testing (Val142Ile)", "Injection technique training", "Emergency ID card (immunosuppression-free agent)"],
    },
    outcomeData: [
      { trial: "HELIOS-B", population: "ATTR-CM (all variants)", endpoint: "All-cause mortality + CV composite", result: "28% RRR overall; 33% RRR in monotherapy arm", pValue: "p=0.0106" },
      { trial: "HELIOS-A", population: "hATTR-PN (all variants)", endpoint: "NIS+7 progression arrest at 9 months", result: "−0.6 (AMVUTTRA) vs +17.4 (comparator)", pValue: "p<0.001" },
      { trial: "Both trials", population: "All hATTR genotypes", endpoint: "TTR suppression", result: "~86–94% sustained TTR reduction", pValue: "p<0.001" },
    ],
    repPlaybook: {
      opener: "Dr., the Val142Ile variant — which accounts for ~60% of hATTR-PN burden in Saudi Arabia — often presents with both cardiac and neurological involvement simultaneously. For a patient already on your HF radar, the neuropathy component may be underappreciated. Is this a conversation you're having with your neurology colleagues?",
      evidenceBridge: "AMVUTTRA is the only agent approved for both ATTR-CM and hATTR-PN — so for your dual-indication patient, one SC injection every 3 months addresses both disease manifestations. The HELIOS-B and HELIOS-A data together show unprecedented TTR suppression (86–94%) with durable clinical benefit across both phenotypes.",
      patientSupportHook: "Alnylam Assist® is set up to handle dual-indication patients — reimbursement, injection training, and family cascade testing coordination all through one programme.",
      close: "Would it be worth discussing this patient with your neurology colleague jointly? I can arrange a multi-disciplinary case discussion, and I can bring the dual-indication prescribing guide for both of you.",
      avoidTopics: ["Claiming superiority over tafamidis without the monotherapy data context", "Cardiac remodelling timelines beyond what HELIOS-B data support"],
    },
    objections: [
      { q: "Are both indications covered under one prescription?", a: "Yes — AMVUTTRA 25 mg SC Q3M is the approved dose for both ATTR-CM and hATTR-PN. One prescription covers both manifestations. Alnylam Assist® can navigate the prior authorisation process to ensure coverage is established for both indications simultaneously." },
      { q: "Shouldn't I refer to a specialist for the cardiac component first?", a: "Absolutely — a cardiologist familiar with cardiac amyloidosis should be involved. I'd encourage co-management. The key advantage is that AMVUTTRA treats the upstream cause (TTR production), so both the cardiac and neurological disease are addressed by a single agent, simplifying the treatment plan." },
    ],
    urgencySignals: [
      "Val142Ile variant confirmed on genetic testing",
      "Combined cardiac + neurological ATTR features",
      "Family history of 'premature heart failure' or unexplained neuropathy in siblings/parents",
      "Young-onset HFrEF without ischaemia in South Asian / Middle Eastern male",
    ],
  },

  // ── 4. Progressor on Tafamidis ────────────────────────────────────────────
  {
    id: "tafamidis-progressor",
    name: "Progressor on Tafamidis",
    subtitle: "68M · wt-ATTR-CM · partial responder · NT-proBNP rising",
    indication: "ATTR-CM",
    demographics: {
      age: "68 years",
      sex: "Male",
      region: "Eastern Province",
      variant: "Wild-type (no TTR mutation)",
      bmi: "29.1 kg/m²",
      comorbidities: ["ATTRwt-CM on tafamidis 80mg daily ×18 months", "HFpEF (EF 48%)", "Atrial fibrillation (rate controlled)", "Bilateral CTS (operated)", "eGFR 58"],
    },
    presentation: {
      chiefComplaint: "Despite 18 months of tafamidis, patient reports worsening exercise intolerance (NYHA II → III), 2 hospitalisations for acute decompensated HF in past year, and rising NT-proBNP from 2,100 to 4,600 pg/mL.",
      redFlags: [
        "NT-proBNP rising >20% on tafamidis despite compliance",
        "Hospitalisation for HF decompensation on stabiliser therapy",
        "Functional decline: NYHA II → III progression",
        "6MWT distance declining (−42 m in 12 months)",
        "Echo: worsening diastolic dysfunction, decreasing GLS",
        "Patient expressing frustration with oral daily dosing burden",
      ],
      examFindings: ["LVEF 48% (was 52% at baseline)", "IVS 18mm (unchanged)", "GLS −11% (was −14%)", "6MWT: 298m (from 340m)", "NT-proBNP: 4,610 pg/mL"],
      functionalClass: "NYHA Class III (deteriorating from Class II)",
    },
    diagnosticJourney: {
      avgDelay: "Already diagnosed — partial response assessment is the current clinical question",
      initialDiagnoses: ["ATTRwt-CM confirmed (Tc-PYP Grade 3, negative haematological workup)", "Currently managed on tafamidis 80mg QD"],
      keyTests: [
        { test: "Serial NT-proBNP", result: "Baseline 2,100 → 6M 2,850 → 12M 3,920 → 18M 4,610 pg/mL", significance: "Consistent upward trajectory despite tafamidis — indicates disease progression on stabiliser" },
        { test: "Echo (serial)", result: "GLS deteriorating: −14% → −12% → −11%", significance: "Declining GLS despite tafamidis — suggests inadequate disease modification" },
        { test: "6MWT (serial)", result: "340m → 325m → 298m (−12% from baseline)", significance: "Functional decline on treatment; below threshold for HELIOS-B eligibility at this level" },
        { test: "TTR serum level (optional)", result: "Serum TTR within normal range on stabiliser (expected)", significance: "Tafamidis stabilises TTR tetramer but does not reduce TTR levels; contrast with AMVUTTRA knockdown approach" },
      ],
      diagnosisConfirmation: "Partial responder to tafamidis. Mechanistic rationale for switching to TTR knockdown therapy (AMVUTTRA) is strong.",
    },
    treatment: {
      indication: "AMVUTTRA for ATTR-CM in patients with partial or inadequate response to tafamidis (TTR knockdown vs stabilisation).",
      priorTherapy: "Tafamidis 80mg daily × 18 months",
      switchReason: "Progressive functional decline, NT-proBNP rise >20%, 2 HF hospitalisations despite tafamidis compliance. Switching from stabiliser to RNAi knockdown eliminates pathogenic TTR production at source.",
      amvutraDose: "25 mg SC every 3 months (Q3M)",
      monitoring: ["NT-proBNP trend at 3, 6, 12 months post-switch", "Echo GLS at 6 and 12 months", "6MWT at 6 and 12 months", "KCCQ-OS quality-of-life score", "Hospitalisation rates (12-month composite)"],
      patientSupportNeeds: ["Alnylam Assist® — transition from tafamidis to AMVUTTRA", "Patient education on mechanism switch (stabilisation → knockdown)", "SC injection training (significant improvement in adherence burden)"],
    },
    outcomeData: [
      { trial: "HELIOS-B", population: "Tafamidis-naïve subgroup (planned analysis)", endpoint: "All-cause mortality + CV composite", result: "33% RRR (HR 0.67, 95% CI 0.50–0.90)", pValue: "p=0.0074" },
      { trial: "HELIOS-B", population: "Prior tafamidis subgroup (exploratory)", endpoint: "All-cause mortality + CV composite", result: "Directionally consistent benefit; add-on data informative", pValue: "p=0.08 (exploratory)" },
      { trial: "HELIOS-B", population: "All-comers ATTR-CM", endpoint: "HF hospitalisation", result: "Significant reduction in CV hospitalisations", pValue: "p<0.05" },
    ],
    repPlaybook: {
      opener: "Dr., I know you're seeing patients on tafamidis who aren't responding the way you hoped — NT-proBNP drifting up, one or two HF admissions. I'd like to discuss the mechanistic rationale for why a partial responder to TTR stabilisation might respond differently to TTR knockdown.",
      evidenceBridge: "Tafamidis stabilises the tetramer but doesn't reduce TTR production. AMVUTTRA knocks down TTR synthesis by 86–94% — eliminating the pathogenic protein at source. In the HELIOS-B tafamidis-naïve subgroup, the mortality + CV composite showed a 33% RRR. For your partial responder, the TTR knockdown approach addresses the fundamental driver of the disease.",
      patientSupportHook: "The switch also frees your patient from daily oral dosing — 4 injections per year instead of 365 pills. For patients with compliance concerns or HF-related GI absorption issues, this is clinically meaningful.",
      close: "Would you be open to reviewing this patient's 18-month NT-proBNP trend together? I can walk you through the HELIOS-B tafamidis switch data and the Alnylam Assist® transition pathway.",
      avoidTopics: ["Claiming AMVUTTRA is superior to tafamidis across all patients (tafamidis-naïve data is the primary read)", "Suggesting immediate discontinuation of tafamidis without clinical discussion"],
    },
    objections: [
      { q: "The HELIOS-B primary analysis included tafamidis patients — doesn't that dilute the signal?", a: "The pre-specified subgroup analysis of tafamidis-naïve patients showed a 33% RRR in the composite endpoint — that's actually a stronger signal than the all-comers result. The full population benefit was maintained even with prior tafamidis use, which speaks to the robustness of the data." },
      { q: "Can I add AMVUTTRA on top of tafamidis rather than switch?", a: "The HELIOS-B add-on subgroup showed a directionally consistent benefit. However, the approved indication and the label studied AMVUTTRA primarily as monotherapy for ATTR-CM. The prescribing decision should weigh the individual patient's progression risk. The Alnylam Assist® medical team can support a prior-auth for the combination if that's the clinical decision." },
    ],
    urgencySignals: [
      "NT-proBNP rising >20% over 6 months on tafamidis",
      "Any HF hospitalisation while on tafamidis",
      "NYHA class progression on tafamidis therapy",
      "6MWT declining >30m from tafamidis baseline",
    ],
  },

  // ── 5. Patisiran Switch Candidate ─────────────────────────────────────────
  {
    id: "patisiran-switch",
    name: "Patisiran Switch Candidate",
    subtitle: "57F · hATTR-PN · stable on Onpattro · SC upgrade",
    indication: "hATTR-PN",
    demographics: {
      age: "57 years",
      sex: "Female",
      region: "Makkah Region (Jeddah)",
      variant: "Val30Met (p.V30M)",
      bmi: "21.4 kg/m²",
      comorbidities: ["hATTR-PN on patisiran (Onpattro) IV × 2 years", "Stable NIS+7 (25.8 at last visit)", "Requires IV centre every 3 weeks (60-minute infusion)", "Pre-medication: dexamethasone + antihistamine prior to each infusion"],
    },
    presentation: {
      chiefComplaint: "Patient is clinically stable on patisiran but expresses significant burden from every-3-week IV infusions. Has missed 3 doses in past year due to travel schedule and IV centre availability. No disease progression, but compliance at risk.",
      redFlags: [
        "Missed doses due to IV centre access issues",
        "High infusion burden: 17 IV visits/year + pre-medication",
        "Corticosteroid pre-medication burden (potential metabolic effects long-term)",
        "Patient planning relocation — new IV centre access uncertain",
        "Quality of life impact: work disruption, travel constraints",
      ],
      examFindings: ["NIS+7 stable at 25.8 (no progression since patisiran initiation)", "mBMI 842 kg/m² × g/L (improved from 780 at start)", "6MWT: 410m (stable)", "NT-proBNP 380 pg/mL (stable, no cardiac progression)"],
      functionalClass: "PND Stage IIIa (stable — ambulatory with cane)",
    },
    diagnosticJourney: {
      avgDelay: "Already diagnosed and treated — this is a switch candidacy assessment",
      initialDiagnoses: ["hATTR-PN confirmed (Val30Met, nerve biopsy TTR-positive)", "Currently stable on patisiran; switch evaluation underway"],
      keyTests: [
        { test: "Comparative TTR suppression", result: "Patisiran: ~80% suppression; AMVUTTRA (from HELIOS-A): 94% suppression", significance: "AMVUTTRA achieves higher TTR suppression — may translate to stronger disease modification over time" },
        { test: "NIS+7 trend on patisiran", result: "Stable: 25.8 at start → 25.8 at 2 years (excellent response)", significance: "Confirms patisiran efficacy; switch maintains stable disease but improves compliance profile" },
        { test: "Patient preference assessment", result: "Strong preference for SC Q3M vs IV Q3W", significance: "Patient-reported outcome — adherence is a predictor of long-term efficacy" },
        { test: "Cardiac monitoring (echo, NT-proBNP)", result: "No cardiac progression detected", significance: "Cardiac safety maintained; AMVUTTRA has ATTR-CM approval as secondary benefit" },
      ],
      diagnosisConfirmation: "Clinical rationale for switch: equivalent or superior efficacy (94% vs 80% TTR suppression), significant reduction in treatment burden (4 SC injections/year vs 17 IV infusions/year), elimination of pre-medication steroid burden.",
    },
    treatment: {
      indication: "AMVUTTRA hATTR-PN — SC switch from patisiran IV for compliant but burdened patients.",
      priorTherapy: "Patisiran (Onpattro) 0.3 mg/kg IV every 3 weeks × 2 years",
      switchReason: "Infusion burden, missed doses, travel restrictions, patient preference for SC administration. AMVUTTRA offers equivalent or superior TTR suppression (94% vs ~80%) with 4 injections per year.",
      amvutraDose: "25 mg SC every 3 months (Q3M) — no pre-medication required",
      monitoring: ["NIS+7 at 9 and 18 months post-switch", "mBMI at each visit", "Norfolk QOL-DN at 9 months", "Serum TTR level at 3 months (confirm suppression)", "Liver function (routine)"],
      patientSupportNeeds: ["Alnylam Assist® — transition support and SC training", "Injection site rotation education", "Elimination of IV centre dependency", "Patient-held emergency information card"],
    },
    outcomeData: [
      { trial: "HELIOS-A", population: "hATTR-PN (SC vutrisiran)", endpoint: "NIS+7 change at 9 months", result: "−0.6 (AMVUTTRA) vs +17.4 (placebo-comparator)", pValue: "p<0.001" },
      { trial: "HELIOS-A", population: "hATTR-PN SC vs IV benchmark", endpoint: "Mean TTR suppression", result: "94% (AMVUTTRA) vs ~80% (patisiran historical)", pValue: "p<0.001" },
      { trial: "HELIOS-A", population: "hATTR-PN quality of life", endpoint: "Norfolk QOL-DN improvement", result: "Statistically significant improvement vs comparator", pValue: "p=0.003" },
    ],
    repPlaybook: {
      opener: "Dr., I know your hATTR-PN patients on patisiran are doing well clinically — and that stability is important to protect. I'd like to discuss whether some of those patients are struggling with the IV burden in ways that might be affecting their long-term compliance.",
      evidenceBridge: "AMVUTTRA achieves 94% TTR suppression subcutaneously every 3 months — higher than the ~80% seen with patisiran, with no pre-medication required. In HELIOS-A, the SC route was validated across all hATTR genotypes with a disease-arresting NIS+7 result of −0.6 at 9 months.",
      patientSupportHook: "Alnylam Assist® has a dedicated patisiran-to-AMVUTTRA transition pathway. The SC training takes about 30 minutes and patients can self-administer at home. For your patient who is travelling frequently, this could be transformative.",
      close: "Could we review your active patisiran patient list together? I'd like to help you identify candidates who might benefit from the switch — particularly anyone who has had a missed or delayed infusion in the past 6 months.",
      avoidTopics: ["Claiming clinical superiority to patisiran on efficacy endpoints without cross-trial caveats", "Suggesting switching patients who are clearly thriving on patisiran without clinical reason"],
    },
    objections: [
      { q: "My patient is stable on patisiran — why change something that's working?", a: "The clinical stability is absolutely what we want to protect. The case for switching isn't about efficacy failure — it's about compliance sustainability. If a patient is missing infusions due to travel or access, the stability you've built is at risk. AMVUTTRA with 4 injections a year removes those structural barriers while matching or exceeding the TTR suppression your patient currently has." },
      { q: "Is there any washout period needed between patisiran and AMVUTTRA?", a: "There's no formal washout requirement specified in the AMVUTTRA prescribing information. In clinical practice, the last patisiran infusion can be the natural switch point — with AMVUTTRA initiated at the next scheduled treatment window. Alnylam Assist® can provide transition protocol guidance." },
    ],
    urgencySignals: [
      "Any missed or delayed patisiran infusion in past 12 months",
      "Patient expressing IV centre access concerns",
      "Patient planning travel or relocation",
      "Pre-medication steroid burden causing metabolic or tolerance concerns",
      "Patient requesting SC option unprompted",
    ],
  },

  // ── 6. Late Diagnosis / Advanced ATTR-CM ──────────────────────────────────
  {
    id: "late-diagnosis",
    name: "Late Diagnosis — Advanced ATTR-CM",
    subtitle: "75M · 4-year diagnostic odyssey · NYHA III–IV at diagnosis",
    indication: "ATTR-CM",
    demographics: {
      age: "75 years",
      sex: "Male",
      region: "Al-Qassim Region",
      variant: "Wild-type (ATTRwt-CM)",
      bmi: "27.2 kg/m²",
      comorbidities: ["ATTRwt-CM — NYHA III–IV", "HFpEF (EF 44%)", "Aortic stenosis (mild, likely co-amyloid)", "PICC line placed for prior HF management", "3 HF hospitalisations in past 2 years", "Lumbar spinal stenosis", "Bilateral CTS ×12 years"],
    },
    presentation: {
      chiefComplaint: "4-year history of progressive dyspnea, 3 HF hospitalisations in 24 months, and bilateral CTS symptoms for over a decade. Previously managed as hypertensive cardiomyopathy — now presenting to tertiary ATTR centre for first evaluation.",
      redFlags: [
        "HFpEF with advanced wall thickening (IVS 21mm)",
        "Low-voltage ECG despite severe LVH",
        "3+ HF hospitalisations — indicates rapidly progressive disease",
        "CTS >10 years — almost pathognomonic combination with HF",
        "Aortic stenosis co-occurring (amyloid + valve disease)",
        "Patient referred from peripheral hospital with no Tc-PYP access",
        "Significant NT-proBNP elevation (>10,000 pg/mL)",
      ],
      examFindings: ["LVEF 44%, IVS 21mm, EDD 42mm", "Severe diastolic dysfunction (E/e' 28)", "NT-proBNP: 11,200 pg/mL", "6MWT: 182m", "NIS+7: 18 (subclinical neuropathy)", "Mild AS (AVA 1.6 cm²)"],
      functionalClass: "NYHA Class III–IV",
    },
    diagnosticJourney: {
      avgDelay: "4.2 years from first cardiac symptom to ATTR diagnosis",
      initialDiagnoses: ["Hypertensive cardiomyopathy (4 years)", "HFpEF — attributed to age and hypertension", "Possible HCM (one cardiologist)", "Aortic valve disease requiring monitoring"],
      keyTests: [
        { test: "Tc-PYP scintigraphy (first time)", result: "Grade 3 uptake (H/CL 2.1) — diagnostic", significance: "10-minute scan that would have been diagnostic 4 years ago — highlights missed opportunity" },
        { test: "Protein electrophoresis + FLC", result: "Negative for monoclonal protein", significance: "Excludes AL amyloid; non-biopsy ATTR-CM diagnosis confirmed (Gillmore criteria met)" },
        { test: "TTR genetic testing", result: "No pathogenic variant — ATTRwt-CM confirmed", significance: "Wild-type — no family cascade testing required, but patient in highest-risk demographic" },
        { test: "CMR", result: "Diffuse transmural LGE, ECV 52% (severely elevated)", significance: "Advanced amyloid deposition; high extracellular volume indicates significant myocardial replacement" },
        { test: "NT-proBNP + BNP trend", result: "Rapid rise from 3,200 → 11,200 pg/mL over 24 months", significance: "Rapid progression; urgency for AMVUTTRA initiation demonstrated by biomarker trajectory" },
      ],
      diagnosisConfirmation: "ATTRwt-CM, advanced stage (ECV 52%, NT-proBNP >10,000, NYHA III). Late diagnosis represents a missed 4-year window for earlier intervention.",
    },
    treatment: {
      indication: "AMVUTTRA for ATTR-CM — urgent initiation given advanced disease stage and rapid NT-proBNP progression.",
      amvutraDose: "25 mg SC every 3 months (Q3M)",
      monitoring: ["NT-proBNP at 3 months (first response signal)", "Echo GLS every 6 months", "6MWT at 6 months", "HF hospitalisation rate (12-month composite)", "KCCQ-OS quality of life", "Renal function (eGFR) — HF-related renal impairment risk"],
      patientSupportNeeds: ["Urgent Alnylam Assist® enrolment (active disease, hospitalisation history)", "Cardiac rehab referral", "HF team + amyloid specialist co-management", "Patient + family education on ATTR disease trajectory", "Advance care planning discussion (disease stage)"],
    },
    outcomeData: [
      { trial: "HELIOS-B", population: "ATTR-CM NYHA III–IV (pre-specified subgroup)", endpoint: "All-cause mortality + CV composite", result: "Consistent directional benefit; NYHA III included in primary population", pValue: "p<0.05 subgroup" },
      { trial: "HELIOS-B", population: "Advanced ATTR-CM", endpoint: "HF hospitalisation", result: "Significant reduction in CV hospitalisations", pValue: "p<0.05" },
      { trial: "HELIOS-B", population: "All-comers", endpoint: "6MWT at 30 months", result: "+24.8 m vs −4.2 m (placebo)", pValue: "p<0.001" },
    ],
    repPlaybook: {
      opener: "Dr., this is the patient that keeps me motivated — the one who had ATTR for 4 years before anyone ran a Tc-PYP scan. I want to make sure that doesn't happen to your next patient. Can I show you the 10-minute scan protocol that KFSH&RC uses for any HFpEF patient with CTS?",
      evidenceBridge: "Even in advanced ATTR-CM — NYHA III, NT-proBNP >10,000 — HELIOS-B showed that AMVUTTRA reduced CV hospitalisations and supported functional improvement in the 6MWT. It's not too late to treat, but every quarter of delay matters at this stage.",
      patientSupportHook: "For a patient this advanced, Alnylam Assist® can expedite the prior auth and get the first injection within 10 working days of enrolment. The team manages the reimbursement process entirely.",
      close: "The takeaway from this case is earlier detection. Could we put together a shared ATTR screening protocol for your HFpEF clinic — even a simple checklist trigger for Tc-PYP referral? I can draft a one-page tool for your team.",
      avoidTopics: ["Suggesting AMVUTTRA will reverse established amyloid deposition (it halts progression, not reversal)", "Unrealistic timeline expectations for functional improvement in advanced disease"],
    },
    objections: [
      { q: "Is it still worth treating at NYHA III–IV?", a: "Absolutely. The HELIOS-B population included NYHA III patients, and the CV hospitalisation reduction is particularly meaningful in advanced disease — where each admission carries significant mortality risk and quality-of-life cost. The goal is stabilisation and slowing further progression. Even halting the NT-proBNP trajectory has real clinical value at this stage." },
      { q: "The patient's eGFR is borderline — is AMVUTTRA safe?", a: "AMVUTTRA's prescribing information does not require dose adjustment for renal impairment. The renal safety profile in HELIOS-B was consistent across eGFR strata. This is an important differentiator from some other therapeutic classes in this patient population." },
    ],
    urgencySignals: [
      "NT-proBNP >5,000 pg/mL with unexplained HFpEF",
      "Multiple HF hospitalisations (>2 in 24 months) — ATTR investigation overdue",
      "Long CTS history (>5 years) in elderly male with HF",
      "Tc-PYP never performed despite years of HFpEF management",
      "Rapid NT-proBNP trajectory (doubling in <12 months)",
    ],
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function AccountProfileSection() {
  const [selectedId, setSelectedId] = useState<string>(PROFILES[0].id);
  const [activeTab, setActiveTab]   = useState<ProfileTab>("clinical");

  const selected = PROFILES.find((p) => p.id === selectedId) ?? PROFILES[0];
  const ind = IND_COLOR[selected.indication];

  const TABS: { id: ProfileTab; label: string; icon: string }[] = [
    { id: "clinical",    label: "Clinical Picture",       icon: "🩺" },
    { id: "diagnostic",  label: "Diagnostic Journey",     icon: "🔬" },
    { id: "treatment",   label: "Treatment Strategy",     icon: "💉" },
    { id: "playbook",    label: "Rep Playbook",           icon: "🎯" },
  ];

  return (
    <section
      id="account-profiles"
      style={{
        background: "linear-gradient(180deg, #060D18 0%, #0A1628 100%)",
        padding: "80px 0",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
      }}
    >
      {/* Grid texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(0,194,168,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative" }}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ width: "40px", height: "3px", background: "#00C2A8", borderRadius: "2px", marginBottom: "16px" }} />
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#E8F4F8", margin: "0 0 8px", letterSpacing: "0.02em" }}>
                ATTR PATIENT ARCHETYPES
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", margin: 0, maxWidth: "520px" }}>
                Recognise these 6 ATTR patient profiles in HCP conversations — understand which indication applies, what the data says, and exactly how to open the discussion.
              </p>
            </div>
            {/* Indication legend */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(["ATTR-CM", "hATTR-PN", "Dual Indication"] as Indication[]).map((ind) => (
                <div key={ind} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: IND_COLOR[ind].bg, border: `1px solid ${IND_COLOR[ind].border}`,
                  borderRadius: "20px", padding: "4px 12px",
                }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: IND_COLOR[ind].fill }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: IND_COLOR[ind].fill, letterSpacing: "0.05em" }}>{ind}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── LAYOUT: SIDEBAR + DETAIL PANEL ──────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", alignItems: "start" }}>

          {/* SIDEBAR — Profile List */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 8px 12px" }}>
              6 Patient Archetypes
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {PROFILES.map((p) => {
                const c = IND_COLOR[p.indication];
                const isActive = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedId(p.id); setActiveTab("clinical"); }}
                    aria-label={`View ${p.name} patient archetype`}
                    aria-pressed={isActive}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "10px",
                      padding: "12px 12px",
                      borderRadius: "10px",
                      border: isActive ? `1.5px solid ${c.fill}` : "1.5px solid transparent",
                      background: isActive ? c.bg : "transparent",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: "8px", height: "8px", borderRadius: "50%",
                      background: c.fill, flexShrink: 0, marginTop: "5px",
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: "12px", fontWeight: 700,
                        color: isActive ? "#E8F4F8" : "rgba(255,255,255,0.75)",
                        marginBottom: "2px",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>
                        {p.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DETAIL PANEL */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid ${ind.border}`,
            borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}>

            {/* Panel header */}
            <div style={{
              background: `linear-gradient(135deg, ${ind.bg} 0%, rgba(255,255,255,0.02) 100%)`,
              borderBottom: `1px solid ${ind.border}`,
              padding: "20px 28px",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              flexWrap: "wrap", gap: "12px",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{
                    background: ind.bg, border: `1px solid ${ind.border}`,
                    borderRadius: "20px", padding: "3px 12px",
                    fontSize: "10px", fontWeight: 800, color: ind.fill, letterSpacing: "0.06em",
                  }}>
                    {selected.indication}
                  </span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                    {selected.demographics.age} · {selected.demographics.sex} · {selected.demographics.region}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "1.5rem", color: "#E8F4F8", margin: "0 0 4px",
                }}>
                  {selected.name}
                </h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", margin: 0 }}>
                  {selected.subtitle}
                </p>
              </div>

              {/* Urgency signals badge */}
              <div style={{
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: "10px", padding: "10px 14px", maxWidth: "240px",
              }}>
                <div style={{ fontSize: "9px", fontWeight: 800, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                  ⚡ Urgency Signals
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 12px", listStyle: "disc" }}>
                  {selected.urgencySignals.slice(0, 3).map((s, i) => (
                    <li key={i} style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)", marginBottom: "2px", lineHeight: 1.5 }}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 28px" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={`${tab.label} tab`}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                  style={{
                    padding: "14px 16px", background: "transparent",
                    border: "none", borderBottom: activeTab === tab.id ? `2px solid ${ind.fill}` : "2px solid transparent",
                    color: activeTab === tab.id ? ind.fill : "rgba(255,255,255,0.4)",
                    cursor: "pointer", fontSize: "11px", fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: "5px",
                    marginBottom: "-1px", whiteSpace: "nowrap",
                  }}
                >
                  <span>{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: "28px" }}>

              {/* ── CLINICAL PICTURE ─────────────────────────────────────── */}
              {activeTab === "clinical" && (
                <div>
                  {/* Demographics + comorbidities */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                    {/* Left: Chief complaint */}
                    <div style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "16px 18px",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                        Chief Complaint
                      </div>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
                        {selected.presentation.chiefComplaint}
                      </p>
                    </div>
                    {/* Right: Comorbidities */}
                    <div style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "16px 18px",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                        Background &amp; Comorbidities
                      </div>
                      <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                        {selected.demographics.comorbidities.map((c, i) => (
                          <li key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", marginBottom: "4px", lineHeight: 1.5 }}>{c}</li>
                        ))}
                      </ul>
                      {selected.demographics.variant && (
                        <div style={{
                          marginTop: "10px", padding: "6px 10px",
                          background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)",
                          borderRadius: "6px", display: "flex", alignItems: "center", gap: "6px",
                        }}>
                          <span style={{ fontSize: "11px" }}>🧬</span>
                          <span style={{ fontSize: "10px", color: "#22C55E", fontWeight: 700 }}>{selected.demographics.variant}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Red flags */}
                  <div style={{
                    background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "12px", padding: "16px 18px", marginBottom: "16px",
                  }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                      🚩 ATTR Red Flags — what to flag to the HCP
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      {selected.presentation.redFlags.map((f, i) => (
                        <div key={i} style={{ display: "flex", gap: "7px", alignItems: "flex-start" }}>
                          <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "2px", flexShrink: 0 }}>▸</span>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exam findings + functional class */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "start" }}>
                    <div style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "16px 18px",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                        Key Exam &amp; Investigation Findings
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {selected.presentation.examFindings.map((f, i) => (
                          <span key={i} style={{
                            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px", padding: "4px 10px",
                            fontSize: "11px", color: "rgba(255,255,255,0.7)", fontWeight: 600,
                          }}>{f}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{
                      background: ind.bg, border: `1px solid ${ind.border}`,
                      borderRadius: "12px", padding: "16px 18px", textAlign: "center", minWidth: "130px",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                        Functional Class
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#E8F4F8" }}>
                        {selected.presentation.functionalClass}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── DIAGNOSTIC JOURNEY ───────────────────────────────────── */}
              {activeTab === "diagnostic" && (
                <div>
                  {/* Missed diagnoses + delay */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    <div style={{
                      background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                      borderRadius: "12px", padding: "16px 18px",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                        ⏱ Diagnostic Delay
                      </div>
                      <div style={{ fontSize: "1.6rem", fontFamily: "'DM Serif Display', Georgia, serif", color: "#F59E0B", fontWeight: 400, marginBottom: "4px" }}>
                        {selected.diagnosticJourney.avgDelay.split(" ")[0]}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                        {selected.diagnosticJourney.avgDelay}
                      </div>
                    </div>
                    <div style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "16px 18px",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                        Initially Misdiagnosed As
                      </div>
                      <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                        {selected.diagnosticJourney.initialDiagnoses.map((d, i) => (
                          <li key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginBottom: "4px", lineHeight: 1.5 }}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Key tests table */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                      Diagnostic Workup
                    </div>
                    {selected.diagnosticJourney.keyTests.map((t, i) => (
                      <div key={i} style={{
                        display: "grid", gridTemplateColumns: "180px 1fr 1fr",
                        gap: "12px", alignItems: "start",
                        padding: "12px 14px",
                        background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: i === 0 ? "10px 10px 0 0" : i === selected.diagnosticJourney.keyTests.length - 1 ? "0 0 10px 10px" : "0",
                      }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: ind.fill }}>{t.test}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>{t.result}</div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", fontStyle: "italic", lineHeight: 1.5 }}>{t.significance}</div>
                      </div>
                    ))}
                  </div>

                  {/* Confirmation statement */}
                  <div style={{
                    background: ind.bg, border: `1px solid ${ind.border}`,
                    borderRadius: "10px", padding: "14px 16px",
                    borderLeft: `4px solid ${ind.fill}`,
                  }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      ✓ Diagnosis Confirmed
                    </div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>
                      {selected.diagnosticJourney.diagnosisConfirmation}
                    </p>
                  </div>
                </div>
              )}

              {/* ── TREATMENT STRATEGY ───────────────────────────────────── */}
              {activeTab === "treatment" && (
                <div>
                  {/* Indication statement */}
                  <div style={{
                    background: ind.bg, border: `1px solid ${ind.border}`,
                    borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
                    borderLeft: `4px solid ${ind.fill}`,
                  }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      Approved Indication
                    </div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.6 }}>
                      {selected.treatment.indication}
                    </p>
                  </div>

                  {/* Dose + prior therapy */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    <div style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "16px 18px", textAlign: "center",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                        AMVUTTRA Dose
                      </div>
                      <div style={{ fontSize: "1.4rem", fontFamily: "'DM Serif Display', Georgia, serif", color: ind.fill, marginBottom: "4px" }}>
                        25 mg SC
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                        Every 3 months (Q3M)
                      </div>
                    </div>
                    {selected.treatment.priorTherapy ? (
                      <div style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px", padding: "16px 18px",
                      }}>
                        <div style={{ fontSize: "9px", fontWeight: 800, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                          Switch From
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.75)", marginBottom: "4px" }}>
                          {selected.treatment.priorTherapy}
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                          {selected.treatment.switchReason}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px", padding: "16px 18px",
                      }}>
                        <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                          Monitoring Plan
                        </div>
                        <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                          {selected.treatment.monitoring.slice(0, 4).map((m, i) => (
                            <li key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginBottom: "3px", lineHeight: 1.5 }}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Outcome data */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                      Supporting Clinical Evidence
                    </div>
                    {selected.outcomeData.map((o, i) => (
                      <div key={i} style={{
                        display: "grid", gridTemplateColumns: "90px 120px 1fr auto",
                        gap: "12px", alignItems: "center",
                        padding: "12px 14px",
                        background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: i === 0 ? "10px 10px 0 0" : i === selected.outcomeData.length - 1 ? "0 0 10px 10px" : "0",
                      }}>
                        <div style={{ fontSize: "10px", fontWeight: 800, color: ind.fill }}>{o.trial}</div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{o.population}</div>
                        <div>
                          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", marginBottom: "2px" }}>{o.endpoint}</div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#E8F4F8" }}>{o.result}</div>
                        </div>
                        <div style={{
                          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
                          borderRadius: "6px", padding: "3px 8px",
                          fontSize: "10px", fontWeight: 700, color: "#22C55E", whiteSpace: "nowrap",
                        }}>
                          {o.pValue}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Patient support needs */}
                  <div style={{
                    background: "rgba(0,194,168,0.06)", border: "1px solid rgba(0,194,168,0.2)",
                    borderRadius: "10px", padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: "#00C2A8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      🤝 Patient Support Needs — Alnylam Assist®
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {selected.treatment.patientSupportNeeds.map((s, i) => (
                        <span key={i} style={{
                          background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.25)",
                          borderRadius: "6px", padding: "4px 10px",
                          fontSize: "10px", color: "#00C2A8", fontWeight: 600,
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── REP PLAYBOOK ──────────────────────────────────────────── */}
              {activeTab === "playbook" && (
                <div>
                  {/* Opener */}
                  <div style={{
                    background: ind.bg, border: `1px solid ${ind.border}`,
                    borderRadius: "12px", padding: "16px 18px", marginBottom: "14px",
                    borderLeft: `4px solid ${ind.fill}`,
                  }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: ind.fill, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                      🗣 Opening Statement
                    </div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
                      "{selected.repPlaybook.opener}"
                    </p>
                  </div>

                  {/* Evidence bridge + PSP hook */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "14px 16px",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                        📊 Evidence Bridge
                      </div>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.7 }}>
                        {selected.repPlaybook.evidenceBridge}
                      </p>
                    </div>
                    <div style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "14px 16px",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: "#00C2A8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                        🤝 Patient Support Hook
                      </div>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.7 }}>
                        {selected.repPlaybook.patientSupportHook}
                      </p>
                    </div>
                  </div>

                  {/* Close */}
                  <div style={{
                    background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "12px", padding: "14px 16px", marginBottom: "14px",
                  }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: "#22C55E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      🎯 Close / Call-to-Action
                    </div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.7, fontWeight: 600 }}>
                      {selected.repPlaybook.close}
                    </p>
                  </div>

                  {/* Avoid topics */}
                  <div style={{
                    background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "10px", padding: "12px 14px", marginBottom: "16px",
                  }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      ⚠️ Avoid These Topics
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {selected.repPlaybook.avoidTopics.map((t, i) => (
                        <span key={i} style={{
                          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                          borderRadius: "6px", padding: "3px 10px",
                          fontSize: "10px", color: "#ef4444", fontWeight: 600,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Objection handler */}
                  <div>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                      Common Objections
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {selected.objections.map((o, i) => (
                        <div key={i} style={{
                          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "10px", overflow: "hidden",
                        }}>
                          <div style={{
                            padding: "10px 14px",
                            background: "rgba(255,255,255,0.04)",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            fontSize: "11px", fontWeight: 700, color: "#F59E0B",
                          }}>
                            Q: {o.q}
                          </div>
                          <div style={{ padding: "10px 14px", fontSize: "11px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                            {o.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>{/* end grid */}

      </div>
    </section>
  );
}
