/**
 * CertificationModeSection — AMVUTTRA Product Dossier
 * Design: Clinical Precision / Swiss Medical Modernism
 * 40-question timed certification exam (80% pass threshold = 32/40)
 * Domains: MOA, Evidence, Safety, Competitive, Access/PSP, Dosing, Dx Algorithm, Territory
 * On pass: printable certificate with name, date, score, and digital badge
 * localStorage persistence for certificate history
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Award, Clock, CheckCircle2, XCircle, AlertTriangle, Printer, RotateCcw, ChevronRight, ChevronLeft, Trophy, Target, BookOpen, Lock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Domain = "MOA" | "Evidence" | "Safety" | "Competitive" | "Access/PSP" | "Dosing" | "Dx Algorithm" | "Territory";

interface CertQuestion {
  id: string;
  domain: Domain;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  reference: string;
}

interface CertAttempt {
  date: string;
  name: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timeUsed: number; // seconds
  domainBreakdown: Record<Domain, { correct: number; total: number }>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PASS_THRESHOLD = 0.80; // 80% = 32/40
const TOTAL_QUESTIONS = 40;
const TIME_LIMIT = 45 * 60; // 45 minutes in seconds
const STORAGE_KEY = "amvuttra_cert_history";

const DOMAIN_COLORS: Record<Domain, string> = {
  "MOA": "#00C2A8",
  "Evidence": "#3B82F6",
  "Safety": "#EF4444",
  "Competitive": "#F59E0B",
  "Access/PSP": "#8B5CF6",
  "Dosing": "#10B981",
  "Dx Algorithm": "#0093C4",
  "Territory": "#E67E22",
};

// ─── 40 Certification Questions ───────────────────────────────────────────────

const CERT_QUESTIONS: CertQuestion[] = [
  // MOA (6 questions)
  {
    id: "c01", domain: "MOA",
    question: "What is the primary mechanism by which vutrisiran (AMVUTTRA) reduces TTR protein production?",
    options: [
      "Binding to the T4 binding site on the TTR tetramer to prevent dissociation",
      "Antisense oligonucleotide-mediated degradation of TTR pre-mRNA in the nucleus",
      "GalNAc-conjugated siRNA that triggers RISC-mediated cleavage of TTR mRNA in hepatocytes",
      "Monoclonal antibody that sequesters circulating TTR protein",
    ],
    correctIndex: 2,
    explanation: "Vutrisiran uses GalNAc-siRNA technology: the GalNAc ligand binds ASGPR on hepatocytes, enabling targeted delivery. Inside the cell, the antisense strand loads into RISC, which cleaves TTR mRNA, preventing translation.",
    reference: "AMVUTTRA US PI, Section 12.1; Springer et al. Nucleic Acid Ther 2019",
  },
  {
    id: "c02", domain: "MOA",
    question: "By approximately what percentage does AMVUTTRA reduce serum TTR at steady state?",
    options: ["~50%", "~65%", "~75%", "~88%"],
    correctIndex: 3,
    explanation: "AMVUTTRA achieves approximately 88% peak TTR suppression at steady state — the highest of any approved TTR-targeting therapy. This is maintained with Q3M dosing.",
    reference: "HELIOS-A primary publication; HELIOS-B NEJM 2024",
  },
  {
    id: "c03", domain: "MOA",
    question: "Why does AMVUTTRA cause a ~65% reduction in serum vitamin A levels?",
    options: [
      "Direct hepatotoxicity reducing vitamin A synthesis",
      "TTR is the primary transport protein for retinol-RBP complex; suppressing TTR increases renal clearance of retinol",
      "GalNAc ligand competes with vitamin A for ASGPR binding",
      "RISC complex degrades retinol-binding protein mRNA as an off-target effect",
    ],
    correctIndex: 1,
    explanation: "TTR forms a complex with retinol-binding protein (RBP) to transport vitamin A in circulation. When TTR is suppressed ~88%, the RBP-retinol complex loses its carrier and is cleared renally, reducing serum vitamin A by ~65%.",
    reference: "AMVUTTRA US PI, Section 5.2; Benson et al. Orphanet J Rare Dis 2020",
  },
  {
    id: "c04", domain: "MOA",
    question: "What is the role of the RISC complex in RNAi-mediated TTR silencing?",
    options: [
      "RISC transports siRNA from the injection site to the liver",
      "RISC is the endosomal escape mechanism that releases siRNA into the cytoplasm",
      "RISC incorporates the antisense strand and catalytically cleaves complementary TTR mRNA",
      "RISC phosphorylates TTR protein to mark it for proteasomal degradation",
    ],
    correctIndex: 2,
    explanation: "RISC (RNA-Induced Silencing Complex) incorporates the antisense strand of the siRNA duplex. It then seeks out complementary TTR mRNA and cleaves it at a specific site. RISC is catalytic — one complex can cleave multiple mRNA molecules.",
    reference: "Fire et al. Nature 1998; Elbashir et al. Nature 2001",
  },
  {
    id: "c05", domain: "MOA",
    question: "How does vutrisiran's mechanism differ from tafamidis (VYNDAQEL/MAX)?",
    options: [
      "Vutrisiran stabilises the TTR tetramer; tafamidis silences TTR mRNA",
      "Vutrisiran reduces TTR production at the mRNA level; tafamidis stabilises the TTR tetramer to prevent misfolding",
      "Both have the same mechanism but different routes of administration",
      "Vutrisiran is liver-targeted; tafamidis targets TTR in cardiac tissue specifically",
    ],
    correctIndex: 1,
    explanation: "Vutrisiran silences TTR gene expression (reduces production), while tafamidis stabilises the TTR tetramer by binding the T4 binding sites, preventing tetramer dissociation into amyloidogenic monomers. These are complementary mechanisms.",
    reference: "Maurer et al. NEJM 2018 (ATTR-ACT); HELIOS-B NEJM 2024",
  },
  {
    id: "c06", domain: "MOA",
    question: "What is the ASGPR and why is it important for AMVUTTRA's delivery?",
    options: [
      "Aspartate-specific glycoprotein receptor; found on cardiac myocytes enabling direct cardiac delivery",
      "Asialoglycoprotein receptor; expressed at high density (~500,000 copies/cell) on hepatocytes, enabling targeted liver delivery of GalNAc-conjugated siRNA",
      "Amino-sugar glycoprotein receptor; expressed on TTR-producing neurons enabling CNS delivery",
      "Amyloid-specific glycoprotein receptor; binds TTR fibrils to facilitate clearance",
    ],
    correctIndex: 1,
    explanation: "The asialoglycoprotein receptor (ASGPR) is expressed at very high density (~500,000 copies per hepatocyte) and binds GalNAc with high affinity. This enables highly selective hepatocyte targeting without the need for lipid nanoparticles.",
    reference: "Springer et al. Nucleic Acid Ther 2019; D'Souza et al. Liver Int 2008",
  },
  // Evidence (7 questions)
  {
    id: "c07", domain: "Evidence",
    question: "What was the primary endpoint of HELIOS-B and the reported hazard ratio?",
    options: [
      "All-cause mortality; HR 0.65 (P=0.01)",
      "CV composite (ACM + CV hospitalisations + urgent CV visits); HR 0.72 (P<0.001)",
      "6-minute walk distance change; mean difference −35m (P<0.001)",
      "NT-proBNP change from baseline; HR 0.68 (P=0.003)",
    ],
    correctIndex: 1,
    explanation: "HELIOS-B's primary endpoint was a CV composite: ACM + CV hospitalisations + urgent CV visits, with HR 0.72 (P<0.001). All-cause mortality was a key secondary endpoint with HR 0.65 (P=0.01) at 42 months.",
    reference: "Fontana et al. NEJM 2024 (HELIOS-B primary publication)",
  },
  {
    id: "c08", domain: "Evidence",
    question: "In HELIOS-B, what was the all-cause mortality hazard ratio and the percentage reduction?",
    options: [
      "HR 0.72, 28% reduction at 30 months",
      "HR 0.70, 30% reduction at 36 months",
      "HR 0.65, 35% reduction at 42 months",
      "HR 0.58, 42% reduction at 48 months",
    ],
    correctIndex: 2,
    explanation: "HELIOS-B demonstrated HR 0.65 for all-cause mortality at 42 months, representing a 35% relative reduction. This is the strongest mortality evidence for any RNAi therapy in ATTR-CM.",
    reference: "Fontana et al. NEJM 2024; HELIOS-B OLE data",
  },
  {
    id: "c09", domain: "Evidence",
    question: "What was the HELIOS-B trial design? Select the most complete description.",
    options: [
      "Phase 2, open-label, N=200, 24 months, ATTR-CM only",
      "Phase 3, randomised 1:1, N=655, 42 months, ATTR-CM (wt and hATTR), ~50% on background tafamidis",
      "Phase 3, randomised 2:1, N=400, 36 months, ATTR-CM only, tafamidis-naive",
      "Phase 3, randomised 1:1, N=655, 30 months, ATTR-CM and hATTR-PN combined",
    ],
    correctIndex: 1,
    explanation: "HELIOS-B: Phase 3, randomised 1:1 (vutrisiran vs. placebo), N=655, 42 months, ATTR-CM (wt and hATTR), with ~50% of patients on background tafamidis at baseline. Stratified by NYHA class and tafamidis use.",
    reference: "Fontana et al. NEJM 2024",
  },
  {
    id: "c10", domain: "Evidence",
    question: "What was the key finding of the HELIOS-B monotherapy subgroup (no background tafamidis)?",
    options: [
      "No significant benefit was observed in tafamidis-naive patients",
      "A 42% reduction in ACM + first CV event at 48 months OLE — the strongest efficacy signal in the AMVUTTRA evidence base",
      "Benefit was limited to patients with NYHA class III/IV at baseline",
      "The monotherapy subgroup showed HR 0.72, identical to the overall population",
    ],
    correctIndex: 1,
    explanation: "In the monotherapy subgroup (no background tafamidis), the OLE at 48 months showed a 42% reduction in ACM + first CV event — the strongest efficacy signal in the AMVUTTRA evidence base, reinforcing early initiation before stabiliser therapy.",
    reference: "HELIOS-B OLE data; ACC 2024 presentation",
  },
  {
    id: "c11", domain: "Evidence",
    question: "What were the two primary endpoints of HELIOS-A (hATTR-PN) and the results at 9 months?",
    options: [
      "mNIS+7 and Norfolk QoL-DN; mNIS+7 change −2.2 vs. +14.8 (P<0.001)",
      "PND score and 10-metre walk test; PND improvement 65% vs. 30% (P<0.001)",
      "Nerve conduction velocity and autonomic testing; both P<0.001",
      "mNIS+7 and FAP stage; mNIS+7 change −5.1 vs. +12.3 (P<0.001)",
    ],
    correctIndex: 0,
    explanation: "HELIOS-A primary endpoints: (1) mNIS+7 change at 9 months: −2.2 (vutrisiran) vs. +14.8 (external placebo), difference −17.0 (P<0.001); (2) Norfolk QoL-DN: −21.1 vs. +5.5 (P<0.001).",
    reference: "Adams et al. Amyloid 2022 (HELIOS-A primary publication)",
  },
  {
    id: "c12", domain: "Evidence",
    question: "Why is it methodologically invalid to directly compare HELIOS-B HR 0.65 to ATTRibute-CM HR 0.64 (acoramidis)?",
    options: [
      "The trials enrolled different patient populations (wt-ATTR vs. hATTR)",
      "Different primary endpoints (ACM alone at 42mo vs. ACM+CV hospitalisations at 30mo), different follow-up durations, and different background therapies",
      "HELIOS-B used an external placebo control while ATTRibute-CM used a concurrent placebo",
      "The statistical methods used were incompatible (log-rank vs. Cox regression)",
    ],
    correctIndex: 1,
    explanation: "Cross-trial HR comparisons are methodologically invalid due to: different endpoints (ACM alone at 42 months vs. ACM+CV hospitalisations at 30 months), different follow-up durations, different proportions on background tafamidis, and different patient populations.",
    reference: "Bhatt et al. NEJM 2023 (ATTRibute-CM); Fontana et al. NEJM 2024",
  },
  {
    id: "c13", domain: "Evidence",
    question: "What was the significance of the tafamidis subgroup analysis in HELIOS-B?",
    options: [
      "Patients on tafamidis showed no benefit from adding vutrisiran",
      "The mortality benefit was only seen in patients NOT on tafamidis",
      "Vutrisiran benefit was consistent in patients already on background tafamidis, supporting add-on use",
      "Tafamidis use was an exclusion criterion in HELIOS-B",
    ],
    correctIndex: 2,
    explanation: "In the ~50% of HELIOS-B patients on background tafamidis, the CV composite and mortality benefit of vutrisiran was consistent with the overall population — supporting AMVUTTRA's use even in patients already receiving tafamidis.",
    reference: "Fontana et al. NEJM 2024, supplementary appendix",
  },
  // Safety (5 questions)
  {
    id: "c14", domain: "Safety",
    question: "What is the Black Box Warning for AMVUTTRA?",
    options: [
      "Hepatotoxicity — monitor LFTs monthly for the first 6 months",
      "Thrombocytopenia — monitor platelet count every 3 months",
      "Embryo-fetal toxicity — women of reproductive potential must use effective contraception",
      "Severe hypersensitivity reactions — REMS programme required",
    ],
    correctIndex: 2,
    explanation: "AMVUTTRA carries a Black Box Warning for embryo-fetal toxicity. Women of reproductive potential must use effective contraception during treatment and for 7 months after the last dose. Confirm negative pregnancy test before initiating.",
    reference: "AMVUTTRA US PI, Boxed Warning",
  },
  {
    id: "c15", domain: "Safety",
    question: "What vitamin A supplementation is recommended for patients on AMVUTTRA?",
    options: [
      "High-dose vitamin A 25,000 IU/day to compensate for TTR-mediated depletion",
      "No supplementation required; dietary intake is sufficient",
      "RDA supplementation: 900 mcg/day (men) / 700 mcg/day (women), starting at first injection; avoid >10,000 IU/day",
      "Vitamin A 5,000 IU/day plus beta-carotene 15mg/day",
    ],
    correctIndex: 2,
    explanation: "Supplement at the RDA: 900 mcg/day for men, 700 mcg/day for women, starting at the first injection. High-dose supplementation (>10,000 IU/day) is NOT recommended due to risk of hypervitaminosis A.",
    reference: "AMVUTTRA US PI, Section 5.2 and 2.3",
  },
  {
    id: "c16", domain: "Safety",
    question: "Which adverse event profile best distinguishes AMVUTTRA from inotersen (TEGSEDI)?",
    options: [
      "AMVUTTRA requires REMS monitoring; inotersen does not",
      "AMVUTTRA causes severe thrombocytopenia and glomerulonephritis; inotersen does not",
      "AMVUTTRA has no REMS, no thrombocytopenia, no glomerulonephritis risk; inotersen requires REMS for thrombocytopenia/nephropathy monitoring",
      "Both have identical safety profiles; the only difference is route of administration",
    ],
    correctIndex: 2,
    explanation: "AMVUTTRA has no REMS requirement and no significant risk of thrombocytopenia or glomerulonephritis. Inotersen requires a REMS programme due to risks of severe thrombocytopenia (platelet monitoring) and glomerulonephritis.",
    reference: "TEGSEDI US PI REMS; AMVUTTRA US PI",
  },
  {
    id: "c17", domain: "Safety",
    question: "A patient on AMVUTTRA reports night blindness (nyctalopia) at 6 months. What is the correct management sequence?",
    options: [
      "Immediately discontinue AMVUTTRA and refer to ophthalmology",
      "Increase vitamin A supplementation to 25,000 IU/day empirically",
      "Check serum vitamin A level, refer urgently to ophthalmology, verify RDA supplementation compliance; do not auto-discontinue",
      "No action required — nyctalopia is an expected side effect that resolves spontaneously",
    ],
    correctIndex: 2,
    explanation: "Nyctalopia protocol: (1) Check serum vitamin A immediately; (2) Refer urgently to ophthalmology; (3) Verify RDA supplementation compliance; (4) Do NOT auto-discontinue — benefit-risk remains favourable unless deficiency is confirmed severe. High-dose supplementation without specialist guidance is inappropriate.",
    reference: "AMVUTTRA US PI, Section 5.2; Ophthalmology referral guidance",
  },
  {
    id: "c18", domain: "Safety",
    question: "Does AMVUTTRA require dose adjustment for renal or hepatic impairment?",
    options: [
      "Yes — reduce dose by 50% for eGFR <30 mL/min/1.73m²",
      "Yes — contraindicated in Child-Pugh B/C hepatic impairment",
      "No dose adjustment for mild renal or hepatic impairment (Child-Pugh A); not studied in moderate/severe hepatic impairment",
      "Yes — dose reduction required for both renal and hepatic impairment",
    ],
    correctIndex: 2,
    explanation: "No dose adjustment is required for mild renal or hepatic impairment (Child-Pugh A). AMVUTTRA has not been studied in moderate/severe hepatic impairment (Child-Pugh B/C) — use with caution in these patients.",
    reference: "AMVUTTRA US PI, Section 8.6 and 8.7",
  },
  // Competitive (5 questions)
  {
    id: "c19", domain: "Competitive",
    question: "Which TTR-targeting therapy is the ONLY one approved for BOTH ATTR-CM and hATTR-PN?",
    options: ["Patisiran (ONPATTRO)", "Tafamidis (VYNDAQEL/MAX)", "Vutrisiran (AMVUTTRA)", "Eplontersen (WAINUA)"],
    correctIndex: 2,
    explanation: "AMVUTTRA (vutrisiran) is the only approved therapy with dual indication for both ATTR-CM and hATTR-PN. Patisiran/eplontersen/inotersen are approved only for hATTR-PN; tafamidis/acoramidis only for ATTR-CM.",
    reference: "FDA approval history; AMVUTTRA US PI",
  },
  {
    id: "c20", domain: "Competitive",
    question: "How does AMVUTTRA's dosing frequency compare to patisiran (ONPATTRO)?",
    options: [
      "Both are dosed every 3 months subcutaneously",
      "AMVUTTRA is SC Q3M (4 doses/year); patisiran is IV Q3W (17 doses/year) with premedication",
      "AMVUTTRA is IV monthly; patisiran is SC Q3M",
      "Both require IV administration but AMVUTTRA is less frequent",
    ],
    correctIndex: 1,
    explanation: "AMVUTTRA: SC injection Q3M (every 3 months = 4 doses/year), no premedication, no IV required. Patisiran: IV infusion Q3W (every 3 weeks = ~17 doses/year), requires premedication (corticosteroid, antihistamine, acetaminophen).",
    reference: "AMVUTTRA US PI; ONPATTRO US PI",
  },
  {
    id: "c21", domain: "Competitive",
    question: "What is the current regulatory status of Intellia's nex-z (CRISPR-based TTR silencing) as of Q1 2026?",
    options: [
      "FDA-approved for hATTR-PN in adults",
      "Phase 3 trial ongoing with expected readout in 2026",
      "In FDA clinical hold since October 2025 following a patient death in the MAGNITUDE Phase 3 trial",
      "Approved in Europe but not yet in the US",
    ],
    correctIndex: 2,
    explanation: "Intellia's nex-z (in vivo CRISPR gene editing) program was placed on FDA clinical hold in October 2025 following a patient death in the MAGNITUDE Phase 3 trial. This is not a near-term competitive threat.",
    reference: "Intellia press release October 2025; FDA clinical hold notification",
  },
  {
    id: "c22", domain: "Competitive",
    question: "Which competitor trial (CARDIO-TTRansform) is monitoring for ATTR-CM readout in 2026?",
    options: ["Patisiran (ONPATTRO)", "Inotersen (TEGSEDI)", "Eplontersen (WAINUA)", "Acoramidis (ATTRUBY)"],
    correctIndex: 2,
    explanation: "Eplontersen's (WAINUA) CARDIO-TTRansform trial for ATTR-CM is expected to read out in 2026. If positive, this would give eplontersen a dual indication — the key competitive intelligence item to monitor.",
    reference: "AstraZeneca/Ionis CARDIO-TTRansform trial; ClinicalTrials.gov",
  },
  {
    id: "c23", domain: "Competitive",
    question: "In the HELIOS-B tafamidis subgroup, what does the consistent benefit of vutrisiran demonstrate for competitive positioning?",
    options: [
      "AMVUTTRA should replace tafamidis as first-line therapy for ATTR-CM",
      "AMVUTTRA provides additional benefit ON TOP of tafamidis, supporting add-on use in patients already on a stabiliser",
      "Tafamidis is ineffective and should be discontinued when starting AMVUTTRA",
      "The combination of AMVUTTRA + tafamidis is contraindicated",
    ],
    correctIndex: 1,
    explanation: "The tafamidis subgroup analysis in HELIOS-B showed consistent CV composite and mortality benefit for vutrisiran even in patients already on tafamidis. This supports positioning AMVUTTRA as an add-on therapy — silencing complements stabilisation.",
    reference: "Fontana et al. NEJM 2024; HELIOS-B supplementary data",
  },
  // Access/PSP (4 questions)
  {
    id: "c24", domain: "Access/PSP",
    question: "What are the three main financial assistance programmes offered through Alnylam Assist® for AMVUTTRA?",
    options: [
      "Free drug programme, discount card, and hospital rebate scheme",
      "Copay Assistance Programme, Patient Assistance Programme (PAP), and Bridge Programme",
      "Insurance navigation, prior authorisation support, and appeals assistance only",
      "Government reimbursement coordination, hospital formulary listing, and physician education grants",
    ],
    correctIndex: 1,
    explanation: "Alnylam Assist® offers: (1) Copay Assistance Programme — reduces out-of-pocket costs for commercially insured patients; (2) Patient Assistance Programme (PAP) — free drug for uninsured/underinsured patients meeting income criteria; (3) Bridge Programme — free drug during insurance approval delays.",
    reference: "Alnylam Assist® programme guide; alnylam.com/alnylam-assist",
  },
  {
    id: "c25", domain: "Access/PSP",
    question: "What is the Alnylam Act® programme and who is eligible?",
    options: [
      "A patient advocacy programme for ATTR awareness campaigns",
      "A free genetic testing programme for TTR variants, available to patients with clinical suspicion of hATTR and their at-risk family members",
      "A clinical trial enrolment programme for experimental TTR therapies",
      "A reimbursement support programme for nuclear medicine procedures (PYP scintigraphy)",
    ],
    correctIndex: 1,
    explanation: "Alnylam Act® provides free TTR genetic testing for patients with clinical suspicion of hATTR (Track A: 1 of 3 high-suspicion criteria; Track B: 2 of 6 symptom categories) and cascade screening for at-risk family members.",
    reference: "Alnylam Act® programme documentation",
  },
  {
    id: "c26", domain: "Access/PSP",
    question: "What is the typical Alnylam Assist® enrolment timeline from submission to first shipment?",
    options: [
      "Same-day approval for all patients",
      "4–6 weeks for all patients regardless of insurance status",
      "~48 hours for commercially insured patients; Bridge Programme available during insurance review",
      "2–3 months due to mandatory prior authorisation requirements",
    ],
    correctIndex: 2,
    explanation: "For commercially insured patients, Alnylam Assist® typically processes enrolment within ~48 hours. The Bridge Programme provides free drug during insurance review periods to prevent treatment delays.",
    reference: "Alnylam Assist® enrolment guide; field reimbursement team data",
  },
  {
    id: "c27", domain: "Access/PSP",
    question: "What ICD-10 codes are used for ATTR-CM billing in Saudi Arabia?",
    options: [
      "I42.5 (Other restrictive cardiomyopathy) and E85.4 (Organ-limited amyloidosis)",
      "I43 (Cardiomyopathy in diseases classified elsewhere) and E85.1 (Neuropathic heredofamilial amyloidosis)",
      "I50.9 (Heart failure, unspecified) and E85.9 (Amyloidosis, unspecified)",
      "I42.0 (Dilated cardiomyopathy) and E85.0 (Non-neuropathic heredofamilial amyloidosis)",
    ],
    correctIndex: 0,
    explanation: "For ATTR-CM billing: I42.5 (Other restrictive cardiomyopathy) is the primary cardiac code; E85.4 (Organ-limited amyloidosis) specifies the amyloid aetiology. These are the standard ICD-10-CM codes used in Saudi NHIC reimbursement submissions.",
    reference: "NHIC Saudi Arabia coding guidelines; ICD-10-CM 2024",
  },
  // Dosing (4 questions)
  {
    id: "c28", domain: "Dosing",
    question: "What is the approved dose and dosing frequency of AMVUTTRA for both ATTR-CM and hATTR-PN?",
    options: [
      "25 mg SC every 6 months",
      "50 mg SC every 3 months (Q3M)",
      "25 mg IV every 3 weeks",
      "100 mg SC every 6 months",
    ],
    correctIndex: 1,
    explanation: "AMVUTTRA is dosed at 25 mg SC every 3 months (Q3M) for both ATTR-CM and hATTR-PN indications. This single dose and schedule applies regardless of indication, body weight, or renal status.",
    reference: "AMVUTTRA US PI, Section 2.1",
  },
  {
    id: "c29", domain: "Dosing",
    question: "Where should AMVUTTRA be injected, and what should be avoided at the injection site?",
    options: [
      "IV infusion only; no SC administration permitted",
      "SC injection into the abdomen, upper arm, or thigh; avoid areas of skin disease, injury, or active injection site reactions",
      "SC injection into the abdomen only; thigh and arm are not approved sites",
      "IM injection into the deltoid or gluteus; SC injection is not effective",
    ],
    correctIndex: 1,
    explanation: "AMVUTTRA is administered as a SC injection into the abdomen, upper arm, or thigh. Avoid areas with skin disease, injury, bruising, or active injection site reactions. Rotate injection sites.",
    reference: "AMVUTTRA US PI, Section 2.2",
  },
  {
    id: "c30", domain: "Dosing",
    question: "What should be done if a patient misses an AMVUTTRA dose?",
    options: [
      "Administer the missed dose immediately and resume the original schedule",
      "Skip the missed dose and wait for the next scheduled dose",
      "Administer the missed dose as soon as possible within 3 months; if >3 months have passed, administer and restart the Q3M schedule from that date",
      "Double the next dose to compensate for the missed dose",
    ],
    correctIndex: 2,
    explanation: "If a dose is missed: administer as soon as possible within 3 months of the scheduled date. If more than 3 months have passed, administer the dose and restart the Q3M schedule from that administration date.",
    reference: "AMVUTTRA US PI, Section 2.1",
  },
  {
    id: "c31", domain: "Dosing",
    question: "What monitoring is recommended before initiating AMVUTTRA?",
    options: [
      "Monthly CBC, LFTs, and renal function for the first 6 months",
      "Baseline serum vitamin A level, ophthalmology referral, and pregnancy test (women of reproductive potential)",
      "Echocardiogram and cardiac MRI at baseline and every 6 months",
      "No monitoring required — AMVUTTRA has no pre-treatment assessment requirements",
    ],
    correctIndex: 1,
    explanation: "Before initiating AMVUTTRA: (1) Baseline serum vitamin A level; (2) Ophthalmology referral (baseline eye exam); (3) Confirm negative pregnancy test for women of reproductive potential. No routine CBC or LFT monitoring is required.",
    reference: "AMVUTTRA US PI, Sections 5.1 and 5.2",
  },
  // Dx Algorithm (5 questions)
  {
    id: "c32", domain: "Dx Algorithm",
    question: "What is the first step in the ATTR diagnostic algorithm when a patient presents with HFpEF and LVH?",
    options: [
      "Immediately proceed to PYP scintigraphy",
      "Identify red flag features: cardiac (LVH >12mm, HFpEF, low-flow low-gradient AS, biventricular thickening) and extracardiac (carpal tunnel, lumbar stenosis, neuropathy)",
      "Order TTR gene sequencing as the first diagnostic test",
      "Perform endomyocardial biopsy to confirm amyloid deposition",
    ],
    correctIndex: 1,
    explanation: "Step 1 of the ATTR diagnostic algorithm: identify red flag features. Cardiac: LVH >12mm, HFpEF, low-flow low-gradient AS, biventricular wall thickening, ECG-echo discordance. Extracardiac: bilateral CTS, lumbar spinal stenosis, peripheral neuropathy, autonomic dysfunction.",
    reference: "ACC 2023 ECDP; Maurer et al. AHA Expert Consensus 2022",
  },
  {
    id: "c33", domain: "Dx Algorithm",
    question: "What is the significance of a Perugini Grade 2-3 PYP scan with negative serum/urine protein electrophoresis?",
    options: [
      "Confirms AL amyloidosis — proceed to haematology referral",
      "Non-diagnostic — biopsy is mandatory before any treatment decision",
      "Highly specific for ATTR-CM — can diagnose ATTR-CM without biopsy per ACC 2023 ECDP",
      "Indicates cardiac sarcoidosis — proceed to PET-CT",
    ],
    correctIndex: 2,
    explanation: "Per the ACC 2023 ECDP and AHA Expert Consensus, a Perugini Grade 2-3 PYP scan with negative monoclonal protein studies (SPEP + UPEP + serum FLC) is highly specific for ATTR-CM and can establish the diagnosis without biopsy.",
    reference: "Dorbala et al. JACC 2019; ACC 2023 ECDP; Maurer et al. 2022",
  },
  {
    id: "c34", domain: "Dx Algorithm",
    question: "Which TTR variant is most prevalent in the Saudi Arabian population and which region has the highest concentration?",
    options: [
      "Val30Met; Riyadh region",
      "Val142Ile; Eastern Province (Aramco communities)",
      "Ile68Leu; Eastern Province",
      "Thr80Ala; Makkah region",
    ],
    correctIndex: 2,
    explanation: "The Ile68Leu (p.Ile88Leu) TTR variant is the most prevalent pathogenic variant in Saudi Arabia, with the highest concentration in the Eastern Province. This was identified in the KAUST 2021 exome study of the Saudi population.",
    reference: "KAUST 2021 Saudi exome study; Ahmad et al. 2024; Alqarni et al. 2024",
  },
  {
    id: "c35", domain: "Dx Algorithm",
    question: "In the NAC (National Amyloidosis Centre) staging system for ATTR-CM, what defines Stage III?",
    options: [
      "NT-proBNP <3000 ng/L and troponin I <0.05 µg/L",
      "Both NT-proBNP ≥3000 ng/L AND troponin I ≥0.05 µg/L (both markers elevated)",
      "NYHA class III or IV regardless of biomarker levels",
      "eGFR <30 mL/min/1.73m² with elevated NT-proBNP",
    ],
    correctIndex: 1,
    explanation: "NAC/Gillmore staging for ATTR-CM: Stage I = both markers below threshold; Stage II = one marker elevated; Stage III = both NT-proBNP ≥3000 ng/L AND troponin I ≥0.05 µg/L. Stage III carries the worst prognosis (median survival ~20 months without treatment).",
    reference: "Gillmore et al. Circulation 2018; ACC 2023 ECDP",
  },
  {
    id: "c36", domain: "Dx Algorithm",
    question: "Why is PYP scintigraphy NOT recommended as a diagnostic tool for hATTR-PN?",
    options: [
      "PYP is too expensive for routine use in neuropathy patients",
      "PYP scintigraphy detects cardiac amyloid deposition; hATTR-PN primarily affects peripheral nerves where PYP does not accumulate",
      "PYP gives false-positive results in all neuropathy patients",
      "hATTR-PN requires biopsy only; no nuclear medicine imaging is indicated",
    ],
    correctIndex: 1,
    explanation: "PYP scintigraphy detects calcium-binding to cardiac amyloid fibrils. In hATTR-PN, amyloid deposits primarily in peripheral nerves, dorsal root ganglia, and autonomic ganglia — not in cardiac tissue (unless cardiac involvement is also present). Therefore, PYP is not a diagnostic tool for pure hATTR-PN.",
    reference: "Adams et al. NEJM 2018; ACC 2023 ECDP",
  },
  // Territory (4 questions)
  {
    id: "c37", domain: "Territory",
    question: "What is the estimated total number of ATTR-CM patients in Saudi Arabia, and what is the primary source for this estimate?",
    options: [
      "~1,200 patients; based on KFSH&RC registry data 2022",
      "~6,036 patients; based on Mohty D et al. 2023 prevalence model applied to GASTAT 2024 population data",
      "~15,000 patients; based on WHO global prevalence estimates",
      "~3,500 patients; based on Saudi Heart Association registry 2021",
    ],
    correctIndex: 1,
    explanation: "The national ATTR-CM estimate of ~6,036 patients is derived from the Mohty D et al. 2023 prevalence model (1.5–2.5% of HFpEF patients have ATTR-CM) applied to GASTAT 2024 Saudi population data and HFpEF prevalence estimates.",
    reference: "Mohty D et al. 2023; GASTAT 2024 Saudi population census",
  },
  {
    id: "c38", domain: "Territory",
    question: "Which Saudi region has the highest ATTR-CM patient estimate and is home to the primary Tier 1 ATTR centre?",
    options: [
      "Makkah Region — King Abdullah Medical City",
      "Eastern Province — King Fahd Hospital of the University",
      "Riyadh Region — King Faisal Specialist Hospital & Research Centre (KFSH&RC)",
      "Madinah Region — Prince Mohammed bin Abdulaziz Hospital",
    ],
    correctIndex: 2,
    explanation: "Riyadh Region has the highest ATTR-CM patient estimate (~1,900 patients) and is home to KFSH&RC — the primary Tier 1 ATTR centre in Saudi Arabia, led by Dr. Diala Mohty (cardiologist) and Dr. Hani Alsergani (nuclear medicine).",
    reference: "Territory Heat Map data; Ahmad et al. 2024; Mohty et al. 2023",
  },
  {
    id: "c39", domain: "Territory",
    question: "What is the estimated number of hATTR-PN patients in Saudi Arabia, and what is the primary TTR variant driving this estimate?",
    options: [
      "~2,000 patients; Val30Met variant",
      "~5,800 patients; Ile68Leu variant (Eastern Province predominant)",
      "~8,000 patients; Val142Ile variant",
      "~1,200 patients; Thr80Ala variant",
    ],
    correctIndex: 1,
    explanation: "The national hATTR-PN estimate is ~5,800 patients, driven primarily by the Ile68Leu TTR variant which is the most prevalent pathogenic variant in Saudi Arabia, with the highest concentration in the Eastern Province.",
    reference: "KAUST 2021 Saudi exome study; Territory Heat Map data",
  },
  {
    id: "c40", domain: "Territory",
    question: "Which Saudi region uses a telemedicine-first referral strategy for ATTR patients due to geographic isolation?",
    options: [
      "Riyadh Region — due to high patient volume",
      "Eastern Province — due to Aramco occupational health network",
      "Northern Borders Region — due to distance from nearest Tier 1 centre (>1,000 km to KFSH&RC Riyadh)",
      "Asir Region — due to mountainous terrain limiting road access",
    ],
    correctIndex: 2,
    explanation: "The Northern Borders Region uses a telemedicine-first strategy because it is the most geographically isolated region in Saudi Arabia, with the nearest Tier 1 ATTR centre (KFSH&RC Riyadh) being >1,000 km away. Telemedicine via SEHA platform is the primary referral pathway.",
    reference: "Territory Heat Map referral pathway data; SEHA telemedicine platform",
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function loadCertHistory(): CertAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCertHistory(history: CertAttempt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage unavailable — history will not persist
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Certificate Component ────────────────────────────────────────────────────

function Certificate({ attempt }: { attempt: CertAttempt }) {
  return (
    <div
      id="cert-printable"
      style={{
        background: "white",
        border: "3px solid #1A3A6B",
        borderRadius: "16px",
        padding: "48px",
        maxWidth: "720px",
        margin: "0 auto",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background watermark */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-30deg)", fontSize: "120px", opacity: 0.03, fontFamily: "'DM Serif Display', serif", color: "#1A3A6B", whiteSpace: "nowrap", pointerEvents: "none" }}>
        AMVUTTRA
      </div>
      {/* Top accent */}
      <div style={{ height: "6px", background: "linear-gradient(90deg, #00C2A8, #0093C4, #1A3A6B)", borderRadius: "3px", marginBottom: "32px" }} />
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#566573", marginBottom: "8px" }}>
          NewBridge Pharmaceuticals · Saudi Arabia
        </div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "#1A3A6B", marginBottom: "8px" }}>
          Certificate of Completion
        </div>
        <div style={{ fontSize: "13px", color: "#566573" }}>
          AMVUTTRA® (vutrisiran) Product Specialist Certification
        </div>
      </div>
      {/* Badge */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "100px", height: "100px", borderRadius: "50%",
          background: "linear-gradient(135deg, #00C2A8, #0093C4)",
          boxShadow: "0 8px 32px rgba(0,194,168,0.4)",
        }}>
          <Trophy size={40} color="white" />
        </div>
      </div>
      {/* Body */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "13px", color: "#566573", marginBottom: "8px" }}>This certifies that</div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "#1A3A6B", marginBottom: "8px", borderBottom: "2px solid #00C2A8", display: "inline-block", paddingBottom: "4px" }}>
          {attempt.name}
        </div>
        <div style={{ fontSize: "13px", color: "#566573", marginTop: "16px", lineHeight: 1.7, maxWidth: "480px", margin: "16px auto 0" }}>
          has successfully completed the AMVUTTRA® Product Specialist Certification Examination,
          demonstrating comprehensive knowledge of vutrisiran's mechanism of action, clinical evidence,
          safety profile, competitive positioning, and Saudi Arabia territory management.
        </div>
      </div>
      {/* Score grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Score", value: `${attempt.score}/${attempt.total}` },
          { label: "Percentage", value: `${attempt.percentage}%` },
          { label: "Time Used", value: formatTime(attempt.timeUsed) },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center", background: "#F8F9FA", borderRadius: "12px", padding: "16px", border: "1px solid #E8ECF0" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.4rem", fontWeight: 700, color: "#00C2A8" }}>{item.value}</div>
            <div style={{ fontSize: "11px", color: "#566573", marginTop: "4px" }}>{item.label}</div>
          </div>
        ))}
      </div>
      {/* Domain breakdown */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#566573", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Domain Performance</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
          {Object.entries(attempt.domainBreakdown).map(([domain, stats]) => {
            const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            return (
              <div key={domain} style={{ background: "#F8F9FA", borderRadius: "8px", padding: "10px", border: `2px solid ${DOMAIN_COLORS[domain as Domain]}20` }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: DOMAIN_COLORS[domain as Domain], textTransform: "uppercase", marginBottom: "4px" }}>{domain}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 700, color: "#1A3A6B" }}>{pct}%</div>
                <div style={{ fontSize: "9px", color: "#95A5A6" }}>{stats.correct}/{stats.total}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #E8ECF0", paddingTop: "20px" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#95A5A6" }}>Date of Completion</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#1A3A6B" }}>{new Date(attempt.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "9px", color: "#95A5A6", marginBottom: "4px" }}>Certification ID</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#566573" }}>
            AMVUTTRA-{attempt.date.replace(/[-:T.Z]/g, "").slice(0, 14)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10px", color: "#95A5A6" }}>Pass Threshold</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#1A3A6B" }}>80% (32/40)</div>
        </div>
      </div>
      {/* Bottom accent */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #1A3A6B, #0093C4, #00C2A8)", borderRadius: "2px", marginTop: "20px" }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Mode = "intro" | "exam" | "review" | "certificate" | "history";

export default function CertificationModeSection() {
  const [mode, setMode] = useState<Mode>("intro");
  const [candidateName, setCandidateName] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TOTAL_QUESTIONS).fill(null));
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [currentAttempt, setCurrentAttempt] = useState<CertAttempt | null>(null);
  const [certHistory, setCertHistory] = useState<CertAttempt[]>(() => loadCertHistory());
  const [reviewIdx, setReviewIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQ = CERT_QUESTIONS[currentIdx];
  const answeredCount = answers.filter((a) => a !== null).length;

  // ── Timer ──
  useEffect(() => {
    if (mode === "exam") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitExam(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleStartExam = () => {
    if (!candidateName.trim()) return;
    setMode("exam");
    setCurrentIdx(0);
    setAnswers(Array(TOTAL_QUESTIONS).fill(null));
    setSelectedId(null);
    setShowAnswer(false);
    setTimeLeft(TIME_LIMIT);
    setExamStartTime(Date.now());
  };

  const handleSelectAnswer = (idx: number) => {
    if (showAnswer) return;
    setSelectedId(idx);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIdx < TOTAL_QUESTIONS - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedId(answers[currentIdx + 1]);
      setShowAnswer(answers[currentIdx + 1] !== null);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
      setSelectedId(answers[currentIdx - 1]);
      setShowAnswer(answers[currentIdx - 1] !== null);
    }
  };

  const handleSubmitExam = useCallback((timedOut = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timeUsed = timedOut ? TIME_LIMIT : TIME_LIMIT - timeLeft;

    // Compute score
    let score = 0;
    const domainBreakdown: Record<Domain, { correct: number; total: number }> = {
      "MOA": { correct: 0, total: 0 },
      "Evidence": { correct: 0, total: 0 },
      "Safety": { correct: 0, total: 0 },
      "Competitive": { correct: 0, total: 0 },
      "Access/PSP": { correct: 0, total: 0 },
      "Dosing": { correct: 0, total: 0 },
      "Dx Algorithm": { correct: 0, total: 0 },
      "Territory": { correct: 0, total: 0 },
    };

    CERT_QUESTIONS.forEach((q, i) => {
      const ans = answers[i];
      domainBreakdown[q.domain].total += 1;
      if (ans === q.correctIndex) {
        score += 1;
        domainBreakdown[q.domain].correct += 1;
      }
    });

    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    const passed = percentage >= PASS_THRESHOLD * 100;

    const attempt: CertAttempt = {
      date: new Date().toISOString(),
      name: candidateName,
      score,
      total: TOTAL_QUESTIONS,
      percentage,
      passed,
      timeUsed,
      domainBreakdown,
    };

    setCurrentAttempt(attempt);
    const newHistory = [attempt, ...certHistory].slice(0, 10); // keep last 10
    setCertHistory(newHistory);
    saveCertHistory(newHistory);
    setMode("review");
  }, [answers, candidateName, certHistory, timeLeft]);

  const handlePrint = () => {
    window.print();
  };

  const timerColor = timeLeft < 300 ? "#C0392B" : timeLeft < 600 ? "#E67E22" : "#27AE60";
  const progressPct = (answeredCount / TOTAL_QUESTIONS) * 100;

  // ── Intro Screen ──
  if (mode === "intro") {
    return (
      <section id="certification" style={{ padding: "80px 0", background: "linear-gradient(180deg, #F0F4F8 0%, white 100%)" }} aria-label="Certification Mode">
        <div className="container">
          <div style={{ marginBottom: "48px" }}>
            <div className="section-accent" />
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1A3A6B", marginBottom: "8px" }}>
              Certification Mode
            </h2>
            <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
              40-question timed examination · 80% pass threshold · Printable certificate on completion
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "900px" }}>
            {/* Exam info card */}
            <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(26,58,107,0.08)", border: "1px solid #E8ECF0" }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "#1A3A6B", marginBottom: "20px" }}>Exam Overview</h3>
              {[
                { icon: <BookOpen size={16} />, label: "Questions", value: "40 multiple choice" },
                { icon: <Clock size={16} />, label: "Time Limit", value: "45 minutes" },
                { icon: <Target size={16} />, label: "Pass Threshold", value: "80% (32/40 correct)" },
                { icon: <Award size={16} />, label: "On Pass", value: "Printable certificate" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ color: "#00C2A8", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#95A5A6", fontFamily: "'DM Sans', sans-serif" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A3A6B", fontFamily: "'DM Sans', sans-serif" }}>{item.value}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "20px", padding: "12px", background: "#F0F4F8", borderRadius: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#1A3A6B", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Domain Coverage</div>
                {(Object.keys(DOMAIN_COLORS) as Domain[]).map((d) => {
                  const count = CERT_QUESTIONS.filter((q) => q.domain === d).length;
                  return (
                    <div key={d} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: DOMAIN_COLORS[d], flexShrink: 0 }} />
                      <div style={{ fontSize: "11px", color: "#566573", fontFamily: "'DM Sans', sans-serif", flex: 1 }}>{d}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#1A3A6B", fontWeight: 700 }}>{count}Q</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Start card */}
            <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(26,58,107,0.08)", border: "1px solid #E8ECF0" }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "#1A3A6B", marginBottom: "20px" }}>Begin Examination</h3>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#566573", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>
                  Full Name (for certificate)
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your full name"
                  aria-label="Enter your full name for the certificate"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" && candidateName.trim()) handleStartExam(); }}
                />
              </div>
              <div style={{ background: "#FEF9E7", border: "1px solid #E67E22", borderRadius: "10px", padding: "12px", marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", color: "#784212", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
                  <strong>⚠️ Important:</strong> Once started, the timer cannot be paused. Answer all 40 questions within 45 minutes. You may navigate between questions and change answers before submitting.
                </div>
              </div>
              <button
                onClick={handleStartExam}
                disabled={!candidateName.trim()}
                aria-label="Start certification examination"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: candidateName.trim() ? "linear-gradient(135deg, #1A3A6B, #0D2047)" : "#D1D5DB",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: candidateName.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                {candidateName.trim() ? <><Award size={16} /> Begin Examination</> : <><Lock size={16} /> Enter Name to Begin</>}
              </button>

              {/* History */}
              {certHistory.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#566573", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>
                    Previous Attempts
                  </div>
                  {certHistory.slice(0, 3).map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "#F8F9FA", borderRadius: "8px", marginBottom: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: h.passed ? "#27AE60" : "#C0392B", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#1A3A6B", fontFamily: "'DM Sans', sans-serif" }}>{h.name}</div>
                        <div style={{ fontSize: "10px", color: "#95A5A6" }}>{new Date(h.date).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 700, color: h.passed ? "#27AE60" : "#C0392B" }}>
                        {h.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Exam Screen ──
  if (mode === "exam") {
    const isCorrect = selectedId === currentQ.correctIndex;
    return (
      <section id="certification" style={{ padding: "80px 0", background: "#F0F4F8" }} aria-label="Certification examination">
        <div className="container">
          {/* Exam header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "#1A3A6B" }}>AMVUTTRA Certification Exam</div>
              <div style={{ fontSize: "12px", color: "#566573", fontFamily: "'DM Sans', sans-serif" }}>Candidate: {candidateName}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Timer */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "white", padding: "8px 14px", borderRadius: "10px", border: `2px solid ${timerColor}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <Clock size={14} color={timerColor} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 700, color: timerColor }}>{formatTime(timeLeft)}</span>
              </div>
              {/* Progress */}
              <div style={{ background: "white", padding: "8px 14px", borderRadius: "10px", border: "1px solid #E8ECF0" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#1A3A6B", fontWeight: 700 }}>{answeredCount}/{TOTAL_QUESTIONS}</span>
                <span style={{ fontSize: "11px", color: "#95A5A6", marginLeft: "4px" }}>answered</span>
              </div>
              {/* Submit */}
              {answeredCount === TOTAL_QUESTIONS && (
                <button
                  onClick={() => handleSubmitExam(false)}
                  aria-label="Submit examination"
                  style={{ padding: "8px 16px", background: "linear-gradient(135deg, #27AE60, #1E8449)", color: "white", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: "6px", background: "#E8ECF0", borderRadius: "3px", marginBottom: "24px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, #00C2A8, #0093C4)", borderRadius: "3px", transition: "width 0.3s ease" }} />
          </div>

          {/* Question navigator */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
            {CERT_QUESTIONS.map((q, i) => {
              const ans = answers[i];
              const isAnswered = ans !== null;
              const isCurrent = i === currentIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => { setCurrentIdx(i); setSelectedId(answers[i]); setShowAnswer(answers[i] !== null); }}
                  aria-label={`Question ${i + 1}${isAnswered ? " (answered)" : ""}`}
                  aria-current={isCurrent ? "true" : undefined}
                  style={{
                    width: "28px", height: "28px", borderRadius: "6px", border: "none", cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", fontWeight: 700,
                    background: isCurrent ? "#1A3A6B" : isAnswered ? "#00C2A8" : "#E8ECF0",
                    color: isCurrent || isAnswered ? "white" : "#566573",
                    transition: "all 0.15s ease",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Question card */}
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(26,58,107,0.08)", border: "1px solid #E8ECF0", marginBottom: "20px" }}>
            {/* Domain badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ padding: "4px 10px", background: `${DOMAIN_COLORS[currentQ.domain]}15`, color: DOMAIN_COLORS[currentQ.domain], borderRadius: "20px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                {currentQ.domain}
              </span>
              <span style={{ fontSize: "11px", color: "#95A5A6", fontFamily: "'DM Sans', sans-serif" }}>Question {currentIdx + 1} of {TOTAL_QUESTIONS}</span>
            </div>

            {/* Question text */}
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "#1A3A6B", lineHeight: 1.6, marginBottom: "24px" }}>
              {currentQ.question}
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentQ.options.map((opt, i) => {
                let bg = "white";
                let border = "1px solid #E8ECF0";
                let textColor = "#1A3A6B";
                if (showAnswer) {
                  if (i === currentQ.correctIndex) { bg = "#EAFAF1"; border = "2px solid #27AE60"; }
                  else if (i === selectedId && i !== currentQ.correctIndex) { bg = "#FDEDEC"; border = "2px solid #C0392B"; }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(i)}
                    aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
                    aria-pressed={selectedId === i}
                    style={{
                      width: "100%", textAlign: "left", padding: "14px 16px", background: bg, border, borderRadius: "10px",
                      cursor: showAnswer ? "default" : "pointer", transition: "all 0.15s ease",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: textColor, lineHeight: 1.5,
                      display: "flex", alignItems: "flex-start", gap: "12px",
                    }}
                  >
                    <span style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "50%", background: showAnswer && i === currentQ.correctIndex ? "#27AE60" : showAnswer && i === selectedId ? "#C0392B" : "#F0F4F8", color: showAnswer && (i === currentQ.correctIndex || i === selectedId) ? "white" : "#566573", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {showAnswer && i === currentQ.correctIndex && <CheckCircle2 size={16} color="#27AE60" style={{ flexShrink: 0, marginTop: "2px" }} />}
                    {showAnswer && i === selectedId && i !== currentQ.correctIndex && <XCircle size={16} color="#C0392B" style={{ flexShrink: 0, marginTop: "2px" }} />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showAnswer && (
              <div style={{ marginTop: "20px", padding: "16px", background: isCorrect ? "#EAFAF1" : "#FEF9E7", borderRadius: "10px", border: `1px solid ${isCorrect ? "#27AE60" : "#E67E22"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  {isCorrect ? <CheckCircle2 size={14} color="#27AE60" /> : <AlertTriangle size={14} color="#E67E22" />}
                  <span style={{ fontSize: "11px", fontWeight: 700, color: isCorrect ? "#1E8449" : "#784212", fontFamily: "'DM Sans', sans-serif" }}>
                    {isCorrect ? "Correct!" : "Incorrect — Review this concept"}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  {currentQ.explanation}
                </p>
                <div style={{ marginTop: "8px", fontSize: "10px", color: "#95A5A6", fontFamily: "'JetBrains Mono', monospace" }}>
                  📚 {currentQ.reference}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={handlePrev} disabled={currentIdx === 0} aria-label="Previous question" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: currentIdx === 0 ? "#E8ECF0" : "white", border: "1px solid #E8ECF0", borderRadius: "10px", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: currentIdx === 0 ? "not-allowed" : "pointer", color: currentIdx === 0 ? "#95A5A6" : "#1A3A6B" }}>
              <ChevronLeft size={14} /> Previous
            </button>
            {answeredCount === TOTAL_QUESTIONS && currentIdx === TOTAL_QUESTIONS - 1 ? (
              <button onClick={() => handleSubmitExam(false)} aria-label="Submit examination" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", background: "linear-gradient(135deg, #27AE60, #1E8449)", color: "white", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                <Award size={14} /> Submit & Get Results
              </button>
            ) : (
              <button onClick={handleNext} disabled={currentIdx === TOTAL_QUESTIONS - 1} aria-label="Next question" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: currentIdx === TOTAL_QUESTIONS - 1 ? "#E8ECF0" : "linear-gradient(135deg, #1A3A6B, #0D2047)", color: currentIdx === TOTAL_QUESTIONS - 1 ? "#95A5A6" : "white", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: currentIdx === TOTAL_QUESTIONS - 1 ? "not-allowed" : "pointer" }}>
                Next <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ── Review / Results Screen ──
  if (mode === "review" && currentAttempt) {
    const passed = currentAttempt.passed;
    const reviewQ = CERT_QUESTIONS[reviewIdx];
    const reviewAns = answers[reviewIdx];
    const reviewCorrect = reviewAns === reviewQ.correctIndex;

    return (
      <section id="certification" style={{ padding: "80px 0", background: passed ? "linear-gradient(180deg, #EAFAF1 0%, white 100%)" : "linear-gradient(180deg, #FDEDEC 0%, white 100%)" }} aria-label="Exam results">
        <div className="container">
          {/* Result banner */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>{passed ? "🏆" : "📚"}</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: passed ? "#1E8449" : "#C0392B", marginBottom: "8px" }}>
              {passed ? "Congratulations — Certified!" : "Not Yet Certified"}
            </h2>
            <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif" }}>
              {passed
                ? `You scored ${currentAttempt.percentage}% — above the 80% pass threshold. Your certificate is ready.`
                : `You scored ${currentAttempt.percentage}% — below the 80% pass threshold (${Math.round(PASS_THRESHOLD * TOTAL_QUESTIONS)} correct required). Review the areas below and try again.`}
            </p>
          </div>

          {/* Score summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
            {[
              { label: "Score", value: `${currentAttempt.score}/${currentAttempt.total}`, color: passed ? "#27AE60" : "#C0392B" },
              { label: "Percentage", value: `${currentAttempt.percentage}%`, color: passed ? "#27AE60" : "#C0392B" },
              { label: "Time Used", value: formatTime(currentAttempt.timeUsed), color: "#1A3A6B" },
              { label: "Status", value: passed ? "PASS" : "FAIL", color: passed ? "#27AE60" : "#C0392B" },
            ].map((item) => (
              <div key={item.label} style={{ background: "white", borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 4px 16px rgba(26,58,107,0.06)", border: "1px solid #E8ECF0" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.6rem", fontWeight: 700, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: "11px", color: "#95A5A6", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Domain breakdown */}
          <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 24px rgba(26,58,107,0.06)", border: "1px solid #E8ECF0", marginBottom: "32px" }}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "#1A3A6B", marginBottom: "20px" }}>Domain Performance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {(Object.entries(currentAttempt.domainBreakdown) as [Domain, { correct: number; total: number }][]).map(([domain, stats]) => {
                const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                const domainPassed = pct >= 80;
                return (
                  <div key={domain} style={{ background: "#F8F9FA", borderRadius: "12px", padding: "16px", border: `2px solid ${domainPassed ? "#27AE6030" : "#C0392B30"}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: DOMAIN_COLORS[domain], textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{domain}</span>
                      {domainPassed ? <CheckCircle2 size={12} color="#27AE60" /> : <XCircle size={12} color="#C0392B" />}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.2rem", fontWeight: 700, color: domainPassed ? "#27AE60" : "#C0392B" }}>{pct}%</div>
                    <div style={{ height: "4px", background: "#E8ECF0", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: domainPassed ? "#27AE60" : "#C0392B", borderRadius: "2px" }} />
                    </div>
                    <div style={{ fontSize: "10px", color: "#95A5A6", marginTop: "4px" }}>{stats.correct}/{stats.total} correct</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
            {passed && (
              <button
                onClick={() => setMode("certificate")}
                aria-label="View and print certificate"
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "linear-gradient(135deg, #1A3A6B, #0D2047)", color: "white", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
              >
                <Award size={16} /> View Certificate
              </button>
            )}
            <button
              onClick={() => { setMode("intro"); setCandidateName(""); }}
              aria-label="Retake examination"
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "white", color: "#1A3A6B", border: "2px solid #1A3A6B", borderRadius: "12px", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
            >
              <RotateCcw size={16} /> Retake Exam
            </button>
          </div>

          {/* Question review */}
          <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 24px rgba(26,58,107,0.06)", border: "1px solid #E8ECF0" }}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "#1A3A6B", marginBottom: "20px" }}>
              Question Review ({reviewIdx + 1}/{TOTAL_QUESTIONS})
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {CERT_QUESTIONS.map((q, i) => {
                const ans = answers[i];
                const correct = ans === q.correctIndex;
                return (
                  <button key={q.id} onClick={() => setReviewIdx(i)} aria-label={`Review question ${i + 1}: ${correct ? "correct" : "incorrect"}`}
                    style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", fontWeight: 700, background: i === reviewIdx ? "#1A3A6B" : correct ? "#27AE60" : "#C0392B", color: "white" }}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div style={{ padding: "4px 10px", background: `${DOMAIN_COLORS[reviewQ.domain]}15`, color: DOMAIN_COLORS[reviewQ.domain], borderRadius: "20px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", display: "inline-block", marginBottom: "12px" }}>
              {reviewQ.domain}
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1rem", color: "#1A3A6B", lineHeight: 1.6, marginBottom: "16px" }}>
              {reviewQ.question}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {reviewQ.options.map((opt, i) => {
                let bg = "#F8F9FA";
                let border = "1px solid #E8ECF0";
                if (i === reviewQ.correctIndex) { bg = "#EAFAF1"; border = "2px solid #27AE60"; }
                else if (i === reviewAns && i !== reviewQ.correctIndex) { bg = "#FDEDEC"; border = "2px solid #C0392B"; }
                return (
                  <div key={i} style={{ padding: "10px 14px", background: bg, border, borderRadius: "8px", fontSize: "12px", color: "#374151", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ flexShrink: 0, fontWeight: 700, color: "#566573" }}>{String.fromCharCode(65 + i)}.</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {i === reviewQ.correctIndex && <CheckCircle2 size={14} color="#27AE60" style={{ flexShrink: 0 }} />}
                    {i === reviewAns && i !== reviewQ.correctIndex && <XCircle size={14} color="#C0392B" style={{ flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "14px", background: reviewCorrect ? "#EAFAF1" : "#FEF9E7", borderRadius: "10px", border: `1px solid ${reviewCorrect ? "#27AE60" : "#E67E22"}` }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: reviewCorrect ? "#1E8449" : "#784212", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
                {reviewCorrect ? "✓ You answered correctly" : `✗ You selected: ${reviewAns !== null ? reviewQ.options[reviewAns] : "Not answered"}`}
              </div>
              <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{reviewQ.explanation}</p>
              <div style={{ marginTop: "8px", fontSize: "10px", color: "#95A5A6", fontFamily: "'JetBrains Mono', monospace" }}>📚 {reviewQ.reference}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
              <button onClick={() => setReviewIdx((i) => Math.max(0, i - 1))} disabled={reviewIdx === 0} aria-label="Previous review question" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: reviewIdx === 0 ? "#E8ECF0" : "white", border: "1px solid #E8ECF0", borderRadius: "8px", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: reviewIdx === 0 ? "not-allowed" : "pointer", color: reviewIdx === 0 ? "#95A5A6" : "#1A3A6B" }}>
                <ChevronLeft size={14} /> Previous
              </button>
              <button onClick={() => setReviewIdx((i) => Math.min(TOTAL_QUESTIONS - 1, i + 1))} disabled={reviewIdx === TOTAL_QUESTIONS - 1} aria-label="Next review question" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: reviewIdx === TOTAL_QUESTIONS - 1 ? "#E8ECF0" : "linear-gradient(135deg, #1A3A6B, #0D2047)", color: reviewIdx === TOTAL_QUESTIONS - 1 ? "#95A5A6" : "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: reviewIdx === TOTAL_QUESTIONS - 1 ? "not-allowed" : "pointer" }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Certificate Screen ──
  if (mode === "certificate" && currentAttempt) {
    return (
      <section id="certification" style={{ padding: "80px 0", background: "#F0F4F8" }} aria-label="Certificate of completion">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1A3A6B", marginBottom: "8px" }}>
              Certificate of Completion
            </h2>
            <p style={{ fontSize: "14px", color: "#566573", fontFamily: "'DM Sans', sans-serif" }}>
              Use the Print button to save or print your certificate
            </p>
          </div>
          <Certificate attempt={currentAttempt} />
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "32px", flexWrap: "wrap" }}>
            <button onClick={handlePrint} aria-label="Print certificate" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "linear-gradient(135deg, #00C2A8, #0093C4)", color: "white", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
              <Printer size={16} /> Print Certificate
            </button>
            <button onClick={() => setMode("review")} aria-label="Back to results" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "white", color: "#1A3A6B", border: "2px solid #1A3A6B", borderRadius: "12px", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
              ← Back to Results
            </button>
            <button onClick={() => { setMode("intro"); setCandidateName(""); }} aria-label="Return to home" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "#F0F4F8", color: "#566573", border: "1px solid #E8ECF0", borderRadius: "12px", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
              <RotateCcw size={16} /> New Attempt
            </button>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
