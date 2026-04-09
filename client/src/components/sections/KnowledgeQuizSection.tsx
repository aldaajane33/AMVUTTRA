/**
 * KnowledgeQuizSection.tsx
 * Design: Clinical Precision / Swiss Medical Modernism
 * — 10 scored MCQs drawn from the knowledge cards
 * — Optional 90-second timed mode per question
 * — Domain tagging: MOA, Safety, Evidence, Competitive, Access
 * — Pass/fail grade (≥70% = Pass), detailed review, localStorage score persistence
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  RefreshCw,
  ChevronRight,
  BookOpen,
  BarChart2,
  Zap,
  Shield,
  TrendingUp,
  DollarSign,
  FlaskConical,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Domain = "MOA" | "Evidence" | "Safety" | "Competitive" | "Access" | "Dosing";

interface QuizQuestion {
  id: string;
  domain: Domain;
  difficulty: "Easy" | "Moderate" | "Challenging";
  question: string;
  choices: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  keyFact: string;
}

interface QuizResult {
  questionId: string;
  selectedId: string | null;
  correct: boolean;
  timeUsed: number;
  domain: Domain;
}

// ─── Domain Config ────────────────────────────────────────────────────────────

const DOMAIN_CONFIG: Record<Domain, { color: string; icon: React.ReactNode; label: string }> = {
  MOA: { color: "#3498DB", icon: <FlaskConical size={12} />, label: "Mechanism of Action" },
  Evidence: { color: "#27AE60", icon: <TrendingUp size={12} />, label: "Clinical Evidence" },
  Safety: { color: "#C0392B", icon: <Shield size={12} />, label: "Safety Profile" },
  Competitive: { color: "#8E44AD", icon: <Zap size={12} />, label: "Competitive Landscape" },
  Access: { color: "#E67E22", icon: <DollarSign size={12} />, label: "Access & Reimbursement" },
  Dosing: { color: "#00C2A8", icon: <BookOpen size={12} />, label: "Dosing & Administration" },
};

// ─── Quiz Questions ───────────────────────────────────────────────────────────

const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    domain: "MOA",
    difficulty: "Easy",
    question:
      "AMVUTTRA (vutrisiran) achieves TTR silencing by which primary mechanism?",
    choices: [
      { id: "a", text: "Stabilising TTR tetramers to prevent misfolding" },
      { id: "b", text: "Binding to TTR protein and blocking amyloid fibril formation" },
      { id: "c", text: "Cleaving TTR mRNA via the RISC complex after GalNAc-mediated hepatocyte uptake" },
      { id: "d", text: "Inhibiting the TTR gene promoter in hepatocyte nuclei" },
    ],
    correctId: "c",
    explanation:
      "Vutrisiran is a GalNAc-conjugated siRNA. The GalNAc ligand binds ASGPR receptors on hepatocytes, enabling endocytosis. Inside the cell, the siRNA is loaded into the RISC (RNA-Induced Silencing Complex), which cleaves TTR mRNA — preventing TTR protein synthesis. This is fundamentally different from tafamidis (tetramer stabilisation) or inotersen (ASO-mediated mRNA degradation).",
    keyFact: "GalNAc → ASGPR → endocytosis → RISC → TTR mRNA cleavage → ~88% TTR suppression",
  },
  {
    id: "q2",
    domain: "Evidence",
    difficulty: "Moderate",
    question:
      "In the HELIOS-B trial, what was the hazard ratio for the primary composite cardiovascular endpoint (all-cause mortality + CV events) in the overall population?",
    choices: [
      { id: "a", text: "HR 0.56 (P<0.001)" },
      { id: "b", text: "HR 0.72 (P=0.01)" },
      { id: "c", text: "HR 0.65 (P=0.01)" },
      { id: "d", text: "HR 0.81 (P=0.04)" },
    ],
    correctId: "b",
    explanation:
      "HELIOS-B (n=655, 42 months) demonstrated a 28% relative risk reduction in the primary composite CV endpoint: HR 0.72 (95% CI 0.56–0.93, P=0.01). The all-cause mortality HR was 0.65 (35% reduction, P=0.01). Note: HR 0.65 is the all-cause mortality endpoint — a common source of confusion in exam settings.",
    keyFact: "Primary CV composite: HR 0.72 (28% RRR) · All-cause mortality: HR 0.65 (35% RRR)",
  },
  {
    id: "q3",
    domain: "Safety",
    difficulty: "Easy",
    question:
      "AMVUTTRA carries a black box warning for which of the following?",
    choices: [
      { id: "a", text: "Hepatotoxicity — transaminase elevation >3× ULN" },
      { id: "b", text: "Embryo-fetal toxicity — contraindicated in pregnancy" },
      { id: "c", text: "Severe hypersensitivity reactions including anaphylaxis" },
      { id: "d", text: "QTc prolongation — ECG monitoring required" },
    ],
    correctId: "b",
    explanation:
      "AMVUTTRA has a BLACK BOX WARNING for embryo-fetal toxicity. Animal studies demonstrated embryo-fetal lethality and teratogenicity. Female patients of reproductive potential must use effective contraception during treatment and for 7 months after the last dose. This is the most critical safety fact and must be communicated to all prescribers.",
    keyFact: "BBW: Embryo-fetal toxicity · Contraception required during treatment + 7 months post-dose",
  },
  {
    id: "q4",
    domain: "MOA",
    difficulty: "Moderate",
    question:
      "Why does AMVUTTRA reduce serum vitamin A levels by approximately 65%?",
    choices: [
      { id: "a", text: "Vutrisiran directly inhibits retinol absorption in the small intestine" },
      { id: "b", text: "TTR is the primary transport protein for retinol (vitamin A) in the bloodstream" },
      { id: "c", text: "The GalNAc ligand competitively binds retinol-binding protein" },
      { id: "d", text: "Hepatic TTR suppression upregulates retinol catabolism enzymes" },
    ],
    correctId: "b",
    explanation:
      "Transthyretin (TTR) is the primary carrier protein for retinol (vitamin A) in the circulation, forming a complex with retinol-binding protein (RBP). When AMVUTTRA suppresses TTR production by ~88%, the retinol-RBP complex loses its stabilising carrier, leading to increased renal clearance and a ~65% reduction in serum vitamin A. This is a class effect of all TTR-silencing therapies.",
    keyFact: "TTR carries retinol-RBP complex → TTR suppression → ~65% serum vitamin A reduction → supplement at RDA",
  },
  {
    id: "q5",
    domain: "Evidence",
    difficulty: "Challenging",
    question:
      "In HELIOS-A (hATTR-PN), what was the change in NIS+7 score for vutrisiran vs. placebo at 9 months?",
    choices: [
      { id: "a", text: "Vutrisiran: −2.2 points vs. placebo: +14.8 points" },
      { id: "b", text: "Vutrisiran: −4.0 points vs. placebo: +8.3 points" },
      { id: "c", text: "Vutrisiran: +1.1 points vs. placebo: +17.6 points" },
      { id: "d", text: "Vutrisiran: −6.5 points vs. placebo: +11.2 points" },
    ],
    correctId: "a",
    explanation:
      "In HELIOS-A (n=164, 9 months), the mean change in NIS+7 (Neuropathy Impairment Score + 7 neurophysiology tests) was −2.2 points for vutrisiran vs. +14.8 points for placebo (difference: −17.0 points, P<0.001). A lower NIS+7 score indicates less neurological impairment. The placebo group's +14.8 point increase demonstrates the natural progression of hATTR-PN without treatment.",
    keyFact: "HELIOS-A NIS+7: Vutrisiran −2.2 vs. Placebo +14.8 (difference −17.0, P<0.001)",
  },
  {
    id: "q6",
    domain: "Evidence",
    difficulty: "Moderate",
    question:
      "In the HELIOS-B trial, what was the all-cause mortality hazard ratio (HR) in the overall population at 42 months, and how did it compare in patients who were already on background tafamidis at baseline?",
    choices: [
      { id: "a", text: "Overall HR 0.65 (P=0.01); the benefit was consistent and maintained in the tafamidis subgroup" },
      { id: "b", text: "Overall HR 0.65 (P=0.01); the tafamidis subgroup showed no benefit (HR ~1.0)" },
      { id: "c", text: "Overall HR 0.72 (P=0.01); the tafamidis subgroup showed a greater benefit than the overall population" },
      { id: "d", text: "Overall HR 0.80 (P=0.05); the tafamidis subgroup was excluded from the primary analysis" },
    ],
    correctId: "a",
    explanation:
      "HELIOS-B demonstrated an overall all-cause mortality HR of 0.65 (95% CI 0.46–0.93, P=0.01) at 42 months. Importantly, approximately 50% of patients were on background tafamidis at baseline, and the mortality benefit was consistent in this subgroup — a critical finding that supports AMVUTTRA's use even in patients already receiving tafamidis. The CV composite HR was 0.72 (P<0.001). This is a key differentiator from the ATTR-ACT trial (tafamidis alone, HR 0.70), which did not include an RNAi backbone.",
    keyFact: "HELIOS-B: HR 0.65 overall · Benefit maintained in tafamidis subgroup · ~50% of patients on background tafamidis at baseline",
  },
  {
    id: "q7",
    domain: "Competitive",
    difficulty: "Moderate",
    question:
      "Which statement most accurately describes the key differentiator between AMVUTTRA and patisiran (ONPATTRO)?",
    choices: [
      { id: "a", text: "AMVUTTRA has demonstrated superior NIS+7 outcomes vs. patisiran in a head-to-head trial" },
      { id: "b", text: "AMVUTTRA uses the same RNAi mechanism but requires premedication with corticosteroids" },
      { id: "c", text: "AMVUTTRA and patisiran have equivalent efficacy; the primary difference is administration (SC Q3M vs. IV Q3W) and the absence of premedication with vutrisiran" },
      { id: "d", text: "AMVUTTRA is approved only for hATTR-PN, while patisiran is approved for both indications" },
    ],
    correctId: "c",
    explanation:
      "There is no head-to-head trial between vutrisiran and patisiran. Both are siRNA agents targeting TTR mRNA with comparable efficacy profiles. The key differentiators are: (1) Administration — AMVUTTRA is SC Q3M (4 injections/year) vs. patisiran IV Q3W (17 infusions/year); (2) Premedication — patisiran requires corticosteroids + antihistamines + paracetamol before each infusion; AMVUTTRA requires none. AMVUTTRA is approved for both ATTR-CM and hATTR-PN; patisiran is approved only for hATTR-PN.",
    keyFact: "No head-to-head trial · AMVUTTRA: SC Q3M, no premedication · Patisiran: IV Q3W, premedication required",
  },
  {
    id: "q8",
    domain: "Safety",
    difficulty: "Moderate",
    question:
      "What is the recommended vitamin A supplementation protocol for patients initiating AMVUTTRA?",
    choices: [
      { id: "a", text: "High-dose vitamin A supplementation (10,000 IU/day) starting 2 weeks before first injection" },
      { id: "b", text: "No supplementation required — monitor serum vitamin A levels annually" },
      { id: "c", text: "Supplement at the Recommended Dietary Allowance (RDA): 900 mcg/day for men, 700 mcg/day for women, starting at the first injection" },
      { id: "d", text: "Supplement at 2× RDA for the first 6 months, then reduce to RDA thereafter" },
    ],
    correctId: "c",
    explanation:
      "Patients should supplement vitamin A at the RDA — 900 mcg/day for men and 700 mcg/day for women — starting at the time of the first AMVUTTRA injection. High-dose supplementation is not recommended and may cause toxicity. A baseline serum vitamin A level should be checked before initiation, and an ophthalmology referral is recommended to monitor for nyctalopia (night blindness) and other ocular manifestations of vitamin A deficiency.",
    keyFact: "RDA supplementation: 900 mcg/day (men) / 700 mcg/day (women) · Baseline vitamin A level · Ophthalmology referral",
  },
  {
    id: "q9",
    domain: "Competitive",
    difficulty: "Challenging",
    question:
      "Which of the following statements about tafamidis (VYNDAMAX/VYNDAQEL) is CORRECT in the context of the ATTR-CM treatment landscape?",
    choices: [
      { id: "a", text: "Tafamidis demonstrated a statistically significant reduction in all-cause mortality as a primary endpoint in ATTR-ACT" },
      { id: "b", text: "Tafamidis is an RNAi therapy that reduces TTR production by approximately 80%" },
      { id: "c", text: "Tafamidis stabilises TTR tetramers to prevent amyloid fibril formation; ATTR-ACT showed mortality benefit as a secondary endpoint" },
      { id: "d", text: "Tafamidis is approved for both ATTR-CM and hATTR-PN, similar to AMVUTTRA" },
    ],
    correctId: "c",
    explanation:
      "Tafamidis is a TTR tetramer stabiliser (not an RNAi therapy). In the ATTR-ACT trial, all-cause mortality was a secondary endpoint — the primary endpoint was a hierarchical composite. Mortality benefit was observed but was not the primary statistical test. AMVUTTRA's HELIOS-B showed all-cause mortality reduction as a key secondary endpoint (HR 0.65, P=0.01). Tafamidis is approved only for ATTR-CM (not hATTR-PN). This distinction is critical in competitive conversations.",
    keyFact: "Tafamidis: TTR stabiliser, ATTR-CM only · ATTR-ACT: mortality as secondary · HELIOS-B: mortality HR 0.65 as key secondary",
  },
  {
    id: "q10",
    domain: "Access",
    difficulty: "Easy",
    question:
      "Which patient support programme provides prior authorisation navigation, specialty pharmacy coordination, and nurse educator support for AMVUTTRA?",
    choices: [
      { id: "a", text: "Alnylam Assist®" },
      { id: "b", text: "AMVUTTRA REMS Programme" },
      { id: "c", text: "Rare Disease Access Network (RDAN)" },
      { id: "d", text: "Alnylam ACT Programme" },
    ],
    correctId: "a",
    explanation:
      "Alnylam Assist® is the comprehensive patient support programme for AMVUTTRA. It provides: prior authorisation navigation, specialty pharmacy coordination, co-pay support ($0 co-pay for eligible commercially insured patients), nurse educator support for the first injection, and ongoing adherence support. Importantly, AMVUTTRA does NOT have a REMS programme — this is a key differentiator from some other rare disease therapies.",
    keyFact: "Alnylam Assist® · No REMS · $0 co-pay for eligible commercially insured patients · PA navigation + nurse educator",
  },
];

// ─── Timed Mode Question Bank (separate from standard) ──────────────────────

const TIMED_QUESTIONS: QuizQuestion[] = [
  {
    id: "t1",
    domain: "MOA",
    difficulty: "Moderate",
    question: "What is the primary receptor that mediates hepatocyte uptake of GalNAc-conjugated siRNA such as vutrisiran?",
    choices: [
      { id: "a", text: "Low-density lipoprotein receptor (LDLR)" },
      { id: "b", text: "Asialoglycoprotein receptor (ASGPR)" },
      { id: "c", text: "Transferrin receptor (TfR1)" },
      { id: "d", text: "Megalin / LRP2" },
    ],
    correctId: "b",
    explanation: "The GalNAc (N-acetylgalactosamine) ligand on vutrisiran binds with high affinity and specificity to the asialoglycoprotein receptor (ASGPR), which is expressed at very high density (~500,000 copies) exclusively on hepatocytes. This enables targeted delivery to the liver — the primary site of TTR synthesis — without systemic off-target effects. ASGPR-mediated endocytosis internalises the siRNA, which then escapes the endosome and loads into RISC.",
    keyFact: "GalNAc → ASGPR (hepatocyte-specific, ~500K copies/cell) → endocytosis → RISC loading",
  },
  {
    id: "t2",
    domain: "Evidence",
    difficulty: "Challenging",
    question: "In the HELIOS-B OLE (open-label extension) at 48 months, what was the reduction in all-cause mortality + CV events in the monotherapy subgroup (no background tafamidis)?",
    choices: [
      { id: "a", text: "28% reduction (HR 0.72)" },
      { id: "b", text: "35% reduction (HR 0.65)" },
      { id: "c", text: "42% reduction" },
      { id: "d", text: "37% reduction" },
    ],
    correctId: "c",
    explanation: "The HELIOS-B OLE at 48 months showed a 37% reduction in ACM + first CV event in the overall population. In the monotherapy subgroup (patients not on background tafamidis), the reduction was 42% — the strongest efficacy signal in the entire AMVUTTRA evidence base. Critically, patients who crossed over from placebo to vutrisiran at the OLE showed attenuated benefit compared to those on vutrisiran from Day 1, reinforcing the importance of early initiation.",
    keyFact: "OLE 48 mo: 37% overall · 42% monotherapy subgroup · Crossover patients: attenuated benefit",
  },
  {
    id: "t3",
    domain: "Safety",
    difficulty: "Moderate",
    question: "A 68-year-old female patient with ATTR-CM is about to start AMVUTTRA. She asks about the vitamin A supplement. Which of the following is the CORRECT counselling point?",
    choices: [
      { id: "a", text: "Take 10,000 IU/day of vitamin A starting 4 weeks before the first injection" },
      { id: "b", text: "No supplementation needed; serum vitamin A will be monitored quarterly" },
      { id: "c", text: "Take vitamin A at the RDA (700 mcg/day for women) from the first injection; avoid high-dose supplements" },
      { id: "d", text: "Supplement with beta-carotene 25 mg/day as a safer alternative to retinol" },
    ],
    correctId: "c",
    explanation: "The correct counselling is RDA supplementation (700 mcg/day for women, 900 mcg/day for men) starting at the time of the first injection. High-dose vitamin A supplementation (>10,000 IU/day) is contraindicated due to risk of hypervitaminosis A toxicity. Beta-carotene is not an adequate substitute. Patients should also have a baseline ophthalmology referral to monitor for nyctalopia (night blindness) and other ocular signs of vitamin A deficiency.",
    keyFact: "RDA only: 700 mcg/day (women) · High-dose contraindicated · Baseline ophthalmology referral",
  },
  {
    id: "t4",
    domain: "Competitive",
    difficulty: "Challenging",
    question: "Compared to eplontersen (WAINUA), which of the following statements about AMVUTTRA is CORRECT?",
    choices: [
      { id: "a", text: "Both AMVUTTRA and eplontersen are approved for ATTR-CM and hATTR-PN" },
      { id: "b", text: "AMVUTTRA achieves greater TTR suppression (~88%) vs. eplontersen (~81%), and is the only one approved for ATTR-CM" },
      { id: "c", text: "Eplontersen is dosed Q3M like AMVUTTRA, but uses a different delivery mechanism" },
      { id: "d", text: "AMVUTTRA and eplontersen have identical indications; the only difference is the delivery mechanism (siRNA vs. ASO)" },
    ],
    correctId: "b",
    explanation: "AMVUTTRA (siRNA, GalNAc-conjugated) achieves ~88% peak TTR suppression vs. eplontersen (ASO, GalNAc-conjugated) ~81%. Critically, AMVUTTRA is approved for both ATTR-CM and hATTR-PN, while eplontersen is approved only for hATTR-PN. Eplontersen is dosed monthly (Q1M), not Q3M. For any patient with cardiac involvement, AMVUTTRA is the only RNAi/ASO option with an ATTR-CM indication.",
    keyFact: "AMVUTTRA: ~88% TTR suppression, Q3M, ATTR-CM + hATTR-PN · Eplontersen: ~81%, Q1M, hATTR-PN only",
  },
  {
    id: "t5",
    domain: "Dosing",
    difficulty: "Easy",
    question: "What is the approved dose and administration schedule of AMVUTTRA for both ATTR-CM and hATTR-PN?",
    choices: [
      { id: "a", text: "25 mg SC every 3 months (Q3M) — no dose adjustment for renal or hepatic impairment" },
      { id: "b", text: "50 mg SC every 6 months (Q6M) — dose reduction required for CKD Stage 3+" },
      { id: "c", text: "25 mg IV every 3 weeks (Q3W) — premedication with corticosteroids required" },
      { id: "d", text: "25 mg SC every 3 months (Q3M) — dose reduction required for patients >80 years" },
    ],
    correctId: "a",
    explanation: "AMVUTTRA is dosed at 25 mg SC every 3 months (Q3M) for both approved indications. No dose adjustment is required for age, renal impairment (mild-to-moderate), or hepatic impairment (mild). No premedication is required. This is a key differentiator from patisiran (IV Q3W, premedication required). The Q3M schedule results in only 4 injections per year — dramatically reducing the treatment burden compared to daily oral therapies or more frequent injectables.",
    keyFact: "25 mg SC Q3M · No dose adjustment · No premedication · 4 injections/year",
  },
  {
    id: "t6",
    domain: "Evidence",
    difficulty: "Moderate",
    question: "HELIOS-A (hATTR-PN) used an external placebo comparator rather than a concurrent randomised placebo group. What was the primary reason for this design choice?",
    choices: [
      { id: "a", text: "Regulatory agencies required an external comparator to reduce trial costs" },
      { id: "b", text: "It was considered unethical to withhold treatment from hATTR-PN patients given available therapies, so a concurrent placebo arm was not feasible" },
      { id: "c", text: "The external comparator was used because hATTR-PN is too rare to enrol a concurrent placebo group" },
      { id: "d", text: "The FDA mandated an external comparator for all rare disease trials after 2018" },
    ],
    correctId: "b",
    explanation: "HELIOS-A used an external placebo comparator (from the APOLLO patisiran trial) because withholding treatment from hATTR-PN patients — given that patisiran was already approved — was considered ethically untenable. This is a common design approach in rare disease trials where effective therapies already exist. The primary endpoint was the change in mNIS+7 at 9 months: vutrisiran −2.2 vs. external placebo +14.8 (difference −17.0, P<0.001).",
    keyFact: "External placebo from APOLLO trial · Ethical constraint · mNIS+7 difference: −17.0 (P<0.001)",
  },
  {
    id: "t7",
    domain: "MOA",
    difficulty: "Challenging",
    question: "Which of the following best explains why AMVUTTRA's TTR suppression is described as 'durable' despite being administered only once every 3 months?",
    choices: [
      { id: "a", text: "The GalNAc ligand remains bound to ASGPR receptors for 90 days, providing sustained siRNA release" },
      { id: "b", text: "The siRNA integrates into the hepatocyte genome, providing permanent TTR gene silencing" },
      { id: "c", text: "RISC-loaded siRNA is catalytic — one RISC complex can cleave multiple TTR mRNA molecules, and the complex is long-lived within hepatocytes" },
      { id: "d", text: "Vutrisiran has a plasma half-life of 90 days, maintaining therapeutic concentrations between doses" },
    ],
    correctId: "c",
    explanation: "The durability of RNAi silencing is explained by the catalytic nature of RISC. Once the siRNA is loaded into the RISC complex, it acts as a multiple-turnover enzyme — each RISC complex can sequentially cleave many TTR mRNA molecules. The RISC complex itself is stable within hepatocytes, maintaining silencing activity well beyond the plasma half-life of the siRNA (which is actually short). This is fundamentally different from antisense oligonucleotides (ASOs) and explains why Q3M dosing achieves sustained >80% TTR suppression.",
    keyFact: "RISC is catalytic (multiple-turnover) · Long-lived in hepatocytes · Explains Q3M durability despite short plasma t½",
  },
  {
    id: "t8",
    domain: "Safety",
    difficulty: "Challenging",
    question: "A 72-year-old male on AMVUTTRA for 6 months reports new-onset blurred vision at night. What is the most appropriate next step?",
    choices: [
      { id: "a", text: "Discontinue AMVUTTRA immediately — nyctalopia is a contraindication to continued therapy" },
      { id: "b", text: "Check serum vitamin A level and refer urgently to ophthalmology; do not discontinue unless deficiency is confirmed and severe" },
      { id: "c", text: "Increase vitamin A supplementation to 5,000 IU/day and reassess in 3 months" },
      { id: "d", text: "Reassure the patient — nyctalopia is a known, benign side effect that resolves spontaneously" },
    ],
    correctId: "b",
    explanation: "Nyctalopia (night blindness) is a classic early symptom of vitamin A deficiency. The correct response is to: (1) check serum vitamin A level immediately, (2) refer urgently to ophthalmology for formal assessment, and (3) verify the patient is taking RDA supplementation correctly. AMVUTTRA should NOT be discontinued unless deficiency is confirmed and severe — the benefit-risk ratio remains favourable in most cases. Increasing to high-dose supplementation without ophthalmology assessment is not appropriate.",
    keyFact: "Nyctalopia → check serum vitamin A + urgent ophthalmology referral · Do not auto-discontinue",
  },
  {
    id: "t9",
    domain: "Access",
    difficulty: "Moderate",
    question: "Under which Medicare benefit part is AMVUTTRA typically reimbursed, and why?",
    choices: [
      { id: "a", text: "Medicare Part D — as a self-administered specialty drug dispensed at a pharmacy" },
      { id: "b", text: "Medicare Part B — as a physician-administered injectable drug covered under 'incident to' billing" },
      { id: "c", text: "Medicare Part A — as an inpatient hospital drug" },
      { id: "d", text: "AMVUTTRA is not covered by Medicare and requires private insurance" },
    ],
    correctId: "b",
    explanation: "AMVUTTRA is administered by a healthcare professional (SC injection in office/clinic), qualifying it for Medicare Part B coverage under the 'incident to' billing pathway. Part B covers 80% of the Medicare-approved amount after the deductible; the remaining 20% may be covered by Medigap supplemental insurance. This is a significant advantage over oral TTR stabilisers (tafamidis, acoramidis) which fall under Part D and face formulary tier challenges. Alnylam Assist® has a dedicated Medicare support pathway for the 20% co-insurance.",
    keyFact: "Medicare Part B (physician-administered) · 80% covered after deductible · Advantage over oral Part D drugs",
  },
  {
    id: "t10",
    domain: "Competitive",
    difficulty: "Challenging",
    question: "A cardiologist says: 'The ATTRibute-CM trial showed acoramidis had an HR of 0.64 — that's better than AMVUTTRA's 0.72.' What is the most accurate and complete response?",
    choices: [
      { id: "a", text: "Agree — acoramidis has superior efficacy based on the lower HR" },
      { id: "b", text: "The trials used different endpoints and follow-up durations: ATTRibute-CM HR 0.64 was for a composite at 30 months; HELIOS-B HR 0.65 was for all-cause mortality alone at 42 months — a harder endpoint" },
      { id: "c", text: "The HR values are not comparable because acoramidis is an oral drug and AMVUTTRA is injectable" },
      { id: "d", text: "AMVUTTRA's HR 0.72 is for the composite endpoint; the all-cause mortality HR was 0.56 — superior to acoramidis" },
    ],
    correctId: "b",
    explanation: "This is a critical competitive intelligence point. ATTRibute-CM (acoramidis, HR 0.64) used a composite endpoint of ACM + CV hospitalisations at 30 months. HELIOS-B (vutrisiran, HR 0.65) used all-cause mortality as a key secondary endpoint at 42 months — a harder, more clinically meaningful endpoint. Direct HR comparison across trials is methodologically invalid. Additionally, AMVUTTRA requires only 4 SC injections/year vs. acoramidis 730 oral doses/year (2 tablets twice daily), virtually eliminating adherence risk.",
    keyFact: "Different endpoints: ATTRibute-CM composite vs. HELIOS-B ACM alone · Longer follow-up (42 vs. 30 mo) · No valid cross-trial HR comparison",
  },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const PASS_THRESHOLD = 0.7; // 70%
const TIME_PER_QUESTION = 90; // seconds

// ─── Domain Badge ─────────────────────────────────────────────────────────────

function DomainBadge({ domain }: { domain: Domain }) {
  const config = DOMAIN_CONFIG[domain];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ color: config.color, background: config.color + "20" }}
    >
      {config.icon}
      {domain}
    </span>
  );
}

// ─── Timer Ring ───────────────────────────────────────────────────────────────

function TimerRing({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = timeLeft / total;
  const r = 20;
  const circ = 2 * Math.PI * r;
  const color = pct > 0.5 ? "#00C2A8" : pct > 0.25 ? "#F0A500" : "#C0392B";

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>
      <span className="text-sm font-bold font-mono" style={{ color }}>
        {timeLeft}
      </span>
    </div>
  );
}

// ─── Quiz Component ───────────────────────────────────────────────────────────

export default function KnowledgeQuizSection() {
  const [mode, setMode] = useState<"lobby" | "quiz" | "review">("lobby");
  const [timedMode, setTimedMode] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQ = questions[currentIdx];

  // ── Timer ──
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const autoSubmit = useCallback(() => {
    clearTimer();
    setShowAnswer(true);
    setResults((prev) => [
      ...prev,
      {
        questionId: questions[currentIdx]?.id ?? "",
        selectedId: null,
        correct: false,
        timeUsed: TIME_PER_QUESTION,
        domain: questions[currentIdx]?.domain ?? "MOA",
      },
    ]);
  }, [clearTimer, currentIdx, questions]);

  useEffect(() => {
    if (mode === "quiz" && timedMode && !showAnswer) {
      setTimeLeft(TIME_PER_QUESTION);
      setQuestionStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            autoSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [mode, timedMode, currentIdx, showAnswer, autoSubmit, clearTimer]);

  // ── Start Quiz ──
  const startQuiz = (timed: boolean) => {
    setTimedMode(timed);
    setQuestions(shuffle(timed ? TIMED_QUESTIONS : QUESTIONS));
    setCurrentIdx(0);
    setSelectedId(null);
    setShowAnswer(false);
    setResults([]);
    setTimeLeft(TIME_PER_QUESTION);
    setQuestionStartTime(Date.now());
    setMode("quiz");
  };

  // ── Select Answer ──
  const handleSelect = (choiceId: string) => {
    if (showAnswer) return;
    clearTimer();
    const timeUsed = Math.round((Date.now() - questionStartTime) / 1000);
    setSelectedId(choiceId);
    setShowAnswer(true);
    setResults((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedId: choiceId,
        correct: choiceId === currentQ.correctId,
        timeUsed,
        domain: currentQ.domain,
      },
    ]);
  };

  // ── Next Question ──
  const handleNext = () => {
    if (currentIdx >= questions.length - 1) {
      // Save to localStorage
      const score = results.filter((r) => r.correct).length + (selectedId === currentQ?.correctId ? 1 : 0);
      const pct = Math.round((score / questions.length) * 100);
      const existing = JSON.parse(localStorage.getItem("amvuttra_progress") || "{}");
      const quizHistory = existing.quizHistory || [];
      quizHistory.push({
        date: new Date().toISOString(),
        score,
        total: QUESTIONS.length,
        percentage: pct,
        passed: pct >= PASS_THRESHOLD * 100,
        timed: timedMode,
      });
      // Domain scores
      const domainScores = existing.domainScores || {};
      const allResults = [...results, { questionId: currentQ.id, selectedId, correct: selectedId === currentQ.correctId, timeUsed: 0, domain: currentQ.domain }];
      allResults.forEach((r) => {
        if (!domainScores[r.domain]) domainScores[r.domain] = { correct: 0, total: 0 };
        domainScores[r.domain].total += 1;
        if (r.correct) domainScores[r.domain].correct += 1;
      });
      try {
        localStorage.setItem("amvuttra_progress", JSON.stringify({ ...existing, quizHistory, domainScores, lastUpdated: new Date().toISOString() }));
      } catch {
        // Storage unavailable (private browsing / quota exceeded) — progress will not persist this session
      }
      setMode("review");
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedId(null);
      setShowAnswer(false);
      setTimeLeft(TIME_PER_QUESTION);
      setQuestionStartTime(Date.now());
    }
  };

  // ── Compute final results ──
  const finalResults = (() => {
    if (mode !== "review") return null;
    const allResults = results;
    const correct = allResults.filter((r) => r.correct).length;
    const pct = Math.round((correct / questions.length) * 100);
    const passed = pct >= PASS_THRESHOLD * 100;
    const byDomain: Record<string, { correct: number; total: number }> = {};
    allResults.forEach((r) => {
      if (!byDomain[r.domain]) byDomain[r.domain] = { correct: 0, total: 0 };
      byDomain[r.domain].total += 1;
      if (r.correct) byDomain[r.domain].correct += 1;
    });
    const avgTime = Math.round(allResults.reduce((s, r) => s + r.timeUsed, 0) / allResults.length);
    return { correct, pct, passed, byDomain, avgTime };
  })();

  // ─── Lobby ───────────────────────────────────────────────────────────────────
  if (mode === "lobby") {
    return (
      <section id="quiz" className="py-20" style={{ background: "#0A1628" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10">
            <div className="w-12 h-0.5 bg-[#00C2A8] mb-4" />
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Knowledge Quiz
            </h2>
            <p className="text-white/50 text-lg">10 questions · Drawn from the knowledge cards · Pass at 70%</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Standard Mode */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startQuiz(false)}
              className="text-left p-7 rounded-2xl border border-white/10 hover:border-[#00C2A8]/40 transition-all group"
              style={{ background: "#0D1B3E" }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#00C2A8]/15 flex items-center justify-center mb-4">
                <BookOpen size={22} className="text-[#00C2A8]" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Standard Mode
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Take your time. Review each explanation before moving on. Best for learning and first-time completion.
              </p>
              <div className="flex items-center gap-2 text-[#00C2A8] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Start <ChevronRight size={14} />
              </div>
            </motion.button>

            {/* Timed Mode */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startQuiz(true)}
              className="text-left p-7 rounded-2xl border transition-all group"
              style={{ background: "#1A0D3E", borderColor: "#F0A50033" }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#F0A500]/15 flex items-center justify-center mb-4">
                <Clock size={22} className="text-[#F0A500]" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Timed Mode
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                90 seconds per question. Simulates the pace of a real HCP conversation. Unanswered questions count as incorrect.
              </p>
              <div className="flex items-center gap-2 text-[#F0A500] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Start Timed <ChevronRight size={14} />
              </div>
            </motion.button>
          </div>

          {/* Domain overview */}
          <div className="rounded-xl p-5 border border-white/10 bg-white/3">
            <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">Topics Covered</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(DOMAIN_CONFIG) as Domain[]).map((domain) => {
                const config = DOMAIN_CONFIG[domain];
                const count = QUESTIONS.filter((q) => q.domain === domain).length;
                return (
                  <div key={domain} className="flex items-center gap-2.5 p-3 rounded-lg bg-white/5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: config.color + "22", color: config.color }}>
                      {config.icon}
                    </div>
                    <div>
                      <div className="text-white/80 text-xs font-bold">{domain}</div>
                      <div className="text-white/30 text-xs">{count} question{count !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Review Screen ────────────────────────────────────────────────────────────
  if (mode === "review" && finalResults) {
    const { correct, pct, passed, byDomain, avgTime } = finalResults;
    return (
      <section id="quiz" className="py-20" style={{ background: "#0A1628" }}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Score card */}
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: passed ? "#27AE6015" : "#C0392B15",
                border: `1px solid ${passed ? "#27AE6033" : "#C0392B33"}`,
              }}
            >
              {passed ? (
                <Trophy size={44} className="mx-auto mb-3 text-[#F0A500]" />
              ) : (
                <XCircle size={44} className="mx-auto mb-3 text-[#C0392B]" />
              )}
              <div
                className="text-6xl font-bold mb-2"
                style={{ color: passed ? "#27AE60" : "#C0392B", fontFamily: "'DM Serif Display', serif" }}
              >
                {pct}%
              </div>
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {passed ? "PASS" : "NOT YET"}
              </div>
              <div className="text-white/50 text-sm">
                {correct} / {QUESTIONS.length} correct
                {timedMode && <span className="ml-3">· Avg {avgTime}s per question</span>}
              </div>
              <div className="mt-3 text-white/30 text-xs">
                {passed ? "Well done — you've demonstrated solid AMVUTTRA product knowledge." : "Review the explanations below and retake to achieve the 70% pass mark."}
              </div>
            </div>

            {/* Domain breakdown */}
            <div className="rounded-xl p-5 border border-white/10 bg-white/3">
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <BarChart2 size={12} /> Performance by Domain
              </h4>
              <div className="space-y-3">
                {Object.entries(byDomain).map(([domain, { correct: dc, total }]) => {
                  const dpct = Math.round((dc / total) * 100);
                  const config = DOMAIN_CONFIG[domain as Domain];
                  return (
                    <div key={domain} className="flex items-center gap-3">
                      <div className="w-24 text-xs font-bold" style={{ color: config.color }}>{domain}</div>
                      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dpct}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: config.color }}
                        />
                      </div>
                      <div className="text-white/50 text-xs font-mono w-16 text-right">{dc}/{total} ({dpct}%)</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question review */}
            <div>
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">Question Review</h4>
              <div className="space-y-4">
                {questions.map((q, i) => {
                  const result = results[i];
                  const isCorrect = result?.correct;
                  const selectedChoice = q.choices.find((c) => c.id === result?.selectedId);
                  const correctChoice = q.choices.find((c) => c.id === q.correctId);
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl p-5 border"
                      style={{
                        background: isCorrect ? "#27AE6008" : "#C0392B08",
                        borderColor: isCorrect ? "#27AE6033" : "#C0392B33",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          {isCorrect ? (
                            <CheckCircle size={18} className="text-[#27AE60]" />
                          ) : (
                            <XCircle size={18} className="text-[#C0392B]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-white/40 text-xs font-mono">Q{i + 1}</span>
                            <DomainBadge domain={q.domain} />
                            <span className="text-white/30 text-xs">{q.difficulty}</span>
                          </div>
                          <p className="text-white/80 text-sm font-medium mb-3 leading-relaxed">{q.question}</p>
                          {!isCorrect && selectedChoice && (
                            <div className="text-xs text-[#C0392B] mb-1 flex items-center gap-1.5">
                              <XCircle size={11} /> Your answer: {selectedChoice.text}
                            </div>
                          )}
                          {!isCorrect && !selectedChoice && (
                            <div className="text-xs text-[#C0392B] mb-1 flex items-center gap-1.5">
                              <XCircle size={11} /> Time expired — no answer selected
                            </div>
                          )}
                          <div className="text-xs text-[#27AE60] mb-3 flex items-center gap-1.5">
                            <CheckCircle size={11} /> Correct: {correctChoice?.text}
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-white/60 text-xs leading-relaxed mb-2">{q.explanation}</p>
                            <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-white/10">
                              <span className="text-[#F0A500] text-xs font-bold shrink-0">Key Fact:</span>
                              <span className="text-[#F0A500]/80 text-xs font-mono leading-relaxed">{q.keyFact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => startQuiz(timedMode)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: "#00C2A8", color: "#060E24" }}
              >
                <RefreshCw size={14} /> Retake Quiz
              </button>
              <button
                onClick={() => startQuiz(!timedMode)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all"
              >
                <Clock size={14} /> Switch to {timedMode ? "Standard" : "Timed"} Mode
              </button>
              <button
                onClick={() => setMode("lobby")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-white/40 hover:bg-white/10 transition-all"
              >
                Back to Lobby
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ─── Active Quiz ──────────────────────────────────────────────────────────────
  if (mode === "quiz" && currentQ) {
    return (
      <section id="quiz" className="py-20" style={{ background: "#0A1628" }}>
        <div className="max-w-3xl mx-auto px-6">
          {/* Progress bar + timer */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-xs font-mono">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-white/40 text-xs">
                  {results.filter((r) => r.correct).length} correct so far
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00C2A8] rounded-full"
                  animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            {timedMode && <TimerRing timeLeft={timeLeft} total={TIME_PER_QUESTION} />}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Question */}
              <div className="rounded-2xl p-6 border border-white/10" style={{ background: "#0D1B3E" }}>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <DomainBadge domain={currentQ.domain} />
                  <span className="text-white/30 text-xs">{currentQ.difficulty}</span>
                </div>
                <p className="text-white text-lg font-medium leading-relaxed" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {currentQ.question}
                </p>
              </div>

              {/* Choices */}
              <div className="grid gap-3">
                {currentQ.choices.map((choice, idx) => {
                  const isSelected = selectedId === choice.id;
                  const isCorrect = choice.id === currentQ.correctId;
                  let borderColor = "rgba(255,255,255,0.1)";
                  let bgColor = "rgba(255,255,255,0.03)";
                  let textColor = "rgba(255,255,255,0.75)";

                  if (showAnswer) {
                    if (isCorrect) { borderColor = "#27AE60"; bgColor = "#27AE6015"; textColor = "#27AE60"; }
                    else if (isSelected && !isCorrect) { borderColor = "#C0392B"; bgColor = "#C0392B15"; textColor = "#C0392B88"; }
                  } else if (isSelected) {
                    borderColor = "#00C2A8"; bgColor = "#00C2A811";
                  }

                  return (
                    <motion.button
                      key={choice.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelect(choice.id)}
                      disabled={showAnswer}
                      className="text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3"
                      style={{ borderColor, background: bgColor, cursor: showAnswer ? "default" : "pointer" }}
                    >
                      <div
                        className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all"
                        style={{
                          borderColor: showAnswer && isCorrect ? "#27AE60" : showAnswer && isSelected ? "#C0392B" : isSelected ? "#00C2A8" : "rgba(255,255,255,0.2)",
                          color: showAnswer && isCorrect ? "#27AE60" : showAnswer && isSelected ? "#C0392B" : isSelected ? "#00C2A8" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {showAnswer && isCorrect ? <CheckCircle size={14} /> : showAnswer && isSelected && !isCorrect ? <XCircle size={14} /> : String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm leading-relaxed" style={{ color: textColor }}>
                        {choice.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-5 border border-[#00C2A8]/20"
                  style={{ background: "#00C2A808" }}
                >
                  <h4 className="text-[#00C2A8] text-xs font-bold uppercase tracking-wider mb-2">Explanation</h4>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">{currentQ.explanation}</p>
                  <div className="flex items-start gap-2 pt-3 border-t border-white/10">
                    <span className="text-[#F0A500] text-xs font-bold shrink-0">Key Fact:</span>
                    <span className="text-[#F0A500]/80 text-xs font-mono leading-relaxed">{currentQ.keyFact}</span>
                  </div>
                </motion.div>
              )}

              {/* Next button */}
              {showAnswer && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: "#00C2A8", color: "#060E24" }}
                  >
                    {currentIdx >= questions.length - 1 ? (
                      <>See Results <Trophy size={14} /></>
                    ) : (
                      <>Next Question <ChevronRight size={14} /></>
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    );
  }

  return null;
}
