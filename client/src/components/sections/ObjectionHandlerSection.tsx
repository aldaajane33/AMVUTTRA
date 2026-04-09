/* HCP Objection Handler — AMVUTTRA Product Website
   Design: Searchable card grid with category filters, keyword tag chips, multi-select filtering
   Features:
     - 20 objections across 6 categories
     - Real-time text search
     - Clickable keyword tag chips (multi-select, with frequency counts)
     - Combined tag + text + category + difficulty filtering
     - Active filter summary bar with individual clear buttons
     - ABEC framework (Acknowledge → Bridge → Evidence → Close)
     - Copy-to-clipboard script
     - Difficulty badge (Easy / Moderate / Challenging)
     - Favourite/bookmark toggle
*/

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Objection {
  id: string;
  category: string;
  categoryColor: string;
  objection: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  acknowledge: string;
  bridge: string;
  evidence: string;
  close: string;
  dataPoint: string;
  citation: string;
  tags: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const OBJECTIONS: Objection[] = [
  {
    id: "e1",
    category: "Efficacy",
    categoryColor: "#27AE60",
    objection: "My patient is stable on tafamidis — why would I change anything?",
    difficulty: "Challenging",
    acknowledge: "I completely understand — stability is the goal, and tafamidis has been a meaningful advance for these patients.",
    bridge: "What's important to know is that HELIOS-B specifically enrolled ~40% of patients already on background tafamidis — and vutrisiran showed benefit even in that subgroup. The two mechanisms are complementary: tafamidis stabilises the TTR tetramer, while AMVUTTRA silences TTR production entirely, reducing serum TTR by over 80%.",
    evidence: "In the overall HELIOS-B population, vutrisiran reduced the composite of all-cause mortality and CV events by 28% (HR 0.72, P=0.01). All-cause mortality alone was reduced by 35% at 42 months (HR 0.65, P=0.01). The HELIOS-B OLE at 48 months showed a 37% reduction in the overall population — and patients who started vutrisiran earlier had better outcomes than those who crossed over from placebo.",
    close: "The question isn't whether tafamidis is working — it's whether we can do more for this patient. AMVUTTRA offers an additional layer of disease modification on top of stabilisation.",
    dataPoint: "HR 0.72 overall · HR 0.79 in background tafamidis subgroup · OLE: 37% ACM+CV reduction",
    citation: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130 | HELIOS-B OLE, ESC 2025",
    tags: ["tafamidis", "stable", "combination", "mortality", "HELIOS-B", "OLE"],
  },
  {
    id: "e2",
    category: "Efficacy",
    categoryColor: "#27AE60",
    objection: "The HELIOS-B trial only showed a 28% reduction — that's not very impressive.",
    difficulty: "Moderate",
    acknowledge: "I appreciate you looking closely at the numbers — that's exactly the right approach.",
    bridge: "A 28% reduction in the composite endpoint translates to a 35% reduction in all-cause mortality (HR 0.65) at 42 months — that's one of the strongest mortality signals ever seen in a heart failure trial.",
    evidence: "HELIOS-B: HR 0.65 for ACM at 42 months (P=0.01). In the monotherapy subgroup (no background tafamidis), HR was 0.67 for the composite (P=0.02). The OLE at 48 months showed 42% ACM+CV reduction in the monotherapy subgroup — with the benefit curve continuing to widen over time.",
    close: "When you consider the patient population — median age 76, 88% wild-type — a 35% mortality reduction is a landmark result. These patients have historically had no disease-modifying options beyond tafamidis.",
    dataPoint: "HR 0.65 for ACM · HR 0.67 monotherapy composite · OLE 42% monotherapy",
    citation: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130",
    tags: ["efficacy", "mortality", "HR", "statistics", "HELIOS-B", "monotherapy"],
  },
  {
    id: "e3",
    category: "Efficacy",
    categoryColor: "#27AE60",
    objection: "What's the evidence for AMVUTTRA in polyneuropathy? I only know the cardiac data.",
    difficulty: "Easy",
    acknowledge: "That's a great point — AMVUTTRA actually has a dual approval that's often overlooked.",
    bridge: "AMVUTTRA was first approved in June 2022 for hATTR polyneuropathy, based on the HELIOS-A trial — before the cardiac approval in March 2025. It is the only therapy approved for both ATTR-CM and hATTR-PN.",
    evidence: "HELIOS-A (N=164, 18 months): vutrisiran reduced mNIS+7 by −2.2 points vs. +14.8 in the external placebo group — a net difference of −17.0 points (P=3.5×10⁻¹²). Quality of life (Norfolk QoL-DN) also significantly improved. OLE data at 36+ months showed sustained benefit.",
    close: "For any patient with a TTR mutation and neuropathy symptoms — even mixed phenotype — AMVUTTRA covers both dimensions with a single Q3M injection.",
    dataPoint: "mNIS+7: −2.2 vs. +14.8 · Net diff −17.0 (P=3.5×10⁻¹²)",
    citation: "Adams D et al. Amyloid. 2023;30(1):1-9 | HELIOS-A OLE",
    tags: ["polyneuropathy", "hATTR-PN", "HELIOS-A", "neuropathy", "dual approval", "OLE"],
  },
  {
    id: "e4",
    category: "Efficacy",
    categoryColor: "#27AE60",
    objection: "We don't have long-term data beyond 3–4 years. How do I know it works long-term?",
    difficulty: "Moderate",
    acknowledge: "That's a legitimate scientific question — long-term durability data is always important.",
    bridge: "The HELIOS-B OLE now provides 48-month data, and the HELIOS-A OLE extends to 36+ months. The benefit curves continue to widen over time.",
    evidence: "HELIOS-B OLE (48 months): 37% reduction in ACM + first CV event overall; 42% in the monotherapy subgroup. Patients who crossed over from placebo to vutrisiran at the OLE showed attenuated benefit compared to those on vutrisiran from day 1.",
    close: "The crossover data is perhaps the most compelling argument: starting early and staying on therapy matters.",
    dataPoint: "OLE 48 mo: 37% overall · 42% monotherapy · Crossover patients: attenuated benefit",
    citation: "HELIOS-B OLE. Presented at ESC Congress 2025.",
    tags: ["long-term", "OLE", "durability", "48 months", "crossover", "HELIOS-B"],
  },
  {
    id: "s1",
    category: "Safety",
    categoryColor: "#C0392B",
    objection: "I'm worried about the vitamin A reduction — is this dangerous?",
    difficulty: "Moderate",
    acknowledge: "This is one of the most common questions I hear, and it's a very reasonable concern.",
    bridge: "The vitamin A reduction is a predictable, manageable pharmacodynamic effect — not an unexpected toxicity. TTR is the transport protein for vitamin A, so when TTR is reduced by ~88%, serum vitamin A drops by ~65%. The solution is straightforward: supplement all patients with vitamin A at the Recommended Daily Allowance.",
    evidence: "In HELIOS-B, there were no cases of clinical vitamin A deficiency-related serious adverse events when RDA supplementation was provided. Key steps: (1) supplement at RDA (700–900 mcg/day RAE) from day 1, (2) do NOT use high-dose supplements, (3) refer to ophthalmology if patients develop visual symptoms such as night blindness.",
    close: "This is a well-understood, well-managed effect. With proper supplementation, it does not represent a barrier to treatment.",
    dataPoint: "Vitamin A ↓ ~65% · Managed with RDA supplementation · No clinical deficiency cases in HELIOS-B",
    citation: "AMVUTTRA® Prescribing Information. NDA 215515. 2025.",
    tags: ["vitamin A", "safety", "retinol", "supplementation", "night blindness", "ophthalmology"],
  },
  {
    id: "s2",
    category: "Safety",
    categoryColor: "#C0392B",
    objection: "The Boxed Warning about fetal harm concerns me for my female patients.",
    difficulty: "Moderate",
    acknowledge: "The Boxed Warning is important, and I appreciate you taking it seriously.",
    bridge: "The embryo-fetal toxicity warning is based on animal reproductive studies. In clinical practice, ATTR-CM predominantly affects patients ≥60 years old — the median age in HELIOS-B was 76 years.",
    evidence: "The PI requires: effective contraception during treatment AND for 7 months after the last dose. Verify pregnancy status before initiating. In HELIOS-B, there were no pregnancy-related adverse events — consistent with the predominantly elderly patient population.",
    close: "For the vast majority of your ATTR-CM patients — elderly men and post-menopausal women — this warning has no practical clinical impact.",
    dataPoint: "Median age HELIOS-B: 76 years · 92% ≥65 years · Contraception required during tx + 7 months after",
    citation: "AMVUTTRA® Prescribing Information. NDA 215515. 2025.",
    tags: ["boxed warning", "fetal", "pregnancy", "contraception", "safety", "women"],
  },
  {
    id: "s3",
    category: "Safety",
    categoryColor: "#C0392B",
    objection: "What are the most common side effects I should warn my patients about?",
    difficulty: "Easy",
    acknowledge: "Absolutely — setting appropriate patient expectations is key to adherence and satisfaction.",
    bridge: "AMVUTTRA has a very clean safety profile, which is one of its major advantages.",
    evidence: "In HELIOS-B, the most common AEs (≥5%) were: dyspnoea (25% vs. 22% placebo), peripheral oedema (20% vs. 18%), and injection site reactions (4% — mild, transient). No treatment-related serious adverse events at a higher rate than placebo. No hepatotoxicity signal. No infusion reactions (unlike patisiran).",
    close: "The safety profile is actually one of AMVUTTRA's strongest selling points — particularly compared to patisiran (IV, premedication required). Most patients tolerate it very well.",
    dataPoint: "ISR ~4% (mild, transient) · No treatment-related SAEs > placebo · No DDIs identified",
    citation: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130 | AMVUTTRA® PI 2025",
    tags: ["side effects", "AEs", "tolerability", "injection site", "safety profile", "dyspnoea"],
  },
  {
    id: "s4",
    category: "Safety",
    categoryColor: "#C0392B",
    objection: "My patient has CKD stage 3 — is AMVUTTRA safe to use?",
    difficulty: "Easy",
    acknowledge: "Renal function is always an important consideration in this patient population.",
    bridge: "No dose adjustment is required for mild-to-moderate renal impairment — which covers CKD stage 3 (eGFR 30–59 mL/min/1.73m²).",
    evidence: "In HELIOS-B, a significant proportion of patients had mild-to-moderate CKD. The pharmacokinetics of vutrisiran are not significantly altered by mild-to-moderate renal impairment. AMVUTTRA has not been formally studied in severe renal impairment (eGFR <30) — use with caution.",
    close: "CKD stage 3 is not a barrier to AMVUTTRA initiation. The therapeutic dose remains 25 mg SC Q3M regardless of renal function within the studied range.",
    dataPoint: "No dose adjustment for mild-moderate CKD · Not studied in severe RI (eGFR <30)",
    citation: "AMVUTTRA® Prescribing Information. NDA 215515. 2025.",
    tags: ["CKD", "renal", "kidney", "dose adjustment", "safety", "eGFR"],
  },
  {
    id: "a1",
    category: "Access & Cost",
    categoryColor: "#E67E22",
    objection: "The cost is prohibitive — my patients can't afford this.",
    difficulty: "Challenging",
    acknowledge: "Cost is a real and legitimate concern, and I want to make sure we have a clear plan for your patients.",
    bridge: "Alnylam Assist® is specifically designed to address this barrier — it's a comprehensive support program covering the full access journey from prior authorisation to ongoing adherence support.",
    evidence: "Alnylam Assist® provides: (1) Prior authorisation support and appeals assistance. (2) Co-pay assistance for eligible commercially insured patients. (3) Free drug program for uninsured/underinsured patients. (4) Specialty pharmacy coordination. The WAC is ~$477,000/year, but the vast majority of commercially insured patients with PA approval have manageable out-of-pocket costs.",
    close: "I'd recommend enrolling your patient in Alnylam Assist® at the time of prescribing — our team can handle the PA process and connect your patient with the appropriate financial support.",
    dataPoint: "WAC ~$477K/year · Alnylam Assist®: co-pay, free drug, PA support",
    citation: "Alnylam Pharmaceuticals. Alnylam Assist® Program. 2025.",
    tags: ["cost", "access", "Alnylam Assist", "co-pay", "prior authorisation", "insurance", "affordability"],
  },
  {
    id: "a2",
    category: "Access & Cost",
    categoryColor: "#E67E22",
    objection: "I've had prior authorisation denied before for ATTR therapies — it's too much hassle.",
    difficulty: "Challenging",
    acknowledge: "I hear this concern frequently, and I understand the frustration — the PA process can be time-consuming.",
    bridge: "This is exactly why Alnylam Assist® exists. The dedicated reimbursement team handles the PA process on your behalf — including appeals.",
    evidence: "The PA criteria for AMVUTTRA are well-defined: confirmed ATTR-CM (Tc-PYP Grade 2/3 + negative haematologic workup) or confirmed hATTR-PN (TTR mutation + polyneuropathy). With proper documentation, approval rates are high. The Alnylam Assist® team has experience with all major payers.",
    close: "The key is having the right documentation: Tc-PYP scan report, haematologic workup results, TTR genetic testing, and clinical notes documenting NYHA class and functional status.",
    dataPoint: "PA criteria: Tc-PYP Grade 2/3 + negative haematologic workup · Alnylam Assist® handles appeals",
    citation: "Alnylam Pharmaceuticals. Alnylam Assist® Program. 2025.",
    tags: ["prior authorisation", "PA", "denial", "insurance", "reimbursement", "documentation"],
  },
  {
    id: "a3",
    category: "Access & Cost",
    categoryColor: "#E67E22",
    objection: "My patient is on Medicare — will AMVUTTRA be covered?",
    difficulty: "Moderate",
    acknowledge: "Medicare coverage is a common question given the age of this patient population.",
    bridge: "AMVUTTRA is covered under Medicare Part B (physician-administered injectable) since it is HCP-administered in the office or clinic setting.",
    evidence: "As a physician-administered drug (25 mg SC Q3M), AMVUTTRA qualifies for Medicare Part B under the 'incident to' billing pathway. Part B covers 80% of the Medicare-approved amount after the deductible; the remaining 20% may be covered by supplemental insurance (Medigap). For Medicare patients without supplemental coverage, Alnylam Assist® offers a dedicated Medicare support pathway.",
    close: "The Part B pathway is actually advantageous for AMVUTTRA — it avoids the Part D formulary tier challenges that affect self-administered oral therapies like tafamidis.",
    dataPoint: "Medicare Part B (physician-administered) · Part B covers 80% after deductible",
    citation: "CMS Medicare Part B Drug Coverage Guidelines. 2025 | Alnylam Assist® Program.",
    tags: ["Medicare", "Part B", "coverage", "insurance", "elderly", "reimbursement"],
  },
  {
    id: "c1",
    category: "Competitive",
    categoryColor: "#0093C4",
    objection: "Why not just use patisiran? It's also an RNAi therapy and I'm familiar with it.",
    difficulty: "Moderate",
    acknowledge: "Familiarity with patisiran is understandable — it was the first approved RNAi therapy and has been an important advance.",
    bridge: "AMVUTTRA is the next-generation evolution of the same RNAi platform. The GalNAc conjugate technology was specifically designed to overcome the limitations of patisiran's LNP delivery system.",
    evidence: "Key differences: (1) Route/frequency: AMVUTTRA SC Q3M (4 doses/year) vs. patisiran IV Q3W (17 doses/year). (2) Premedication: AMVUTTRA none vs. patisiran requires corticosteroids + antihistamines + acetaminophen. (3) Indications: AMVUTTRA approved for ATTR-CM AND hATTR-PN; patisiran approved for hATTR-PN only. (4) No REMS for AMVUTTRA.",
    close: "For any patient with ATTR-CM — or a mixed phenotype — patisiran is simply not an option. And for hATTR-PN patients, AMVUTTRA offers dramatically better convenience with equivalent efficacy.",
    dataPoint: "4 vs. 17 doses/year · No premedication · ATTR-CM approved (patisiran: not approved)",
    citation: "AMVUTTRA® PI 2025 | ONPATTRO® PI 2023 | Adams D et al. Amyloid. 2023",
    tags: ["patisiran", "ONPATTRO", "RNAi", "comparison", "IV vs SC", "premedication", "GalNAc"],
  },
  {
    id: "c2",
    category: "Competitive",
    categoryColor: "#0093C4",
    objection: "Acoramidis just got approved — isn't it easier since it's an oral pill?",
    difficulty: "Challenging",
    acknowledge: "Oral administration is certainly appealing from a patient convenience standpoint, and acoramidis is a meaningful addition to the ATTR-CM landscape.",
    bridge: "The key distinction is mechanism and depth of effect. Acoramidis, like tafamidis, is a TTR stabiliser — it prevents tetramer dissociation but does not reduce TTR levels. AMVUTTRA silences TTR production, reducing serum TTR by >80%.",
    evidence: "ATTRibute-CM (acoramidis): HR 0.64 for ACM + CV hospitalisations at 30 months. HELIOS-B (vutrisiran): HR 0.65 for ACM alone at 42 months — a harder endpoint. AMVUTTRA requires only 4 SC injections per year vs. acoramidis 2 tablets twice daily (730 doses/year).",
    close: "Both are valid options, but AMVUTTRA offers the deepest TTR reduction of any approved therapy, a harder mortality endpoint, and a dosing schedule that virtually eliminates adherence issues.",
    dataPoint: "4 SC injections/year vs. 730 oral doses/year · ACM HR 0.65 vs. composite HR 0.64",
    citation: "Gillmore JD et al. N Engl J Med. 2024;390(2):132-142 (ATTRibute-CM) | HELIOS-B NEJM 2024",
    tags: ["acoramidis", "BridgeBio", "oral", "stabiliser", "comparison", "adherence", "ATTRibute-CM"],
  },
  {
    id: "c3",
    category: "Competitive",
    categoryColor: "#0093C4",
    objection: "What about eplontersen (WAINUA)? It's also once monthly and SC.",
    difficulty: "Moderate",
    acknowledge: "Eplontersen is a valid option for hATTR-PN, and the monthly SC injection is convenient.",
    bridge: "There are two important distinctions: indication coverage and dosing frequency. AMVUTTRA is approved for both ATTR-CM and hATTR-PN; eplontersen is approved for hATTR-PN only. And AMVUTTRA is Q3M vs. eplontersen monthly.",
    evidence: "NEURO-TTRansform (eplontersen, JAMA 2023): mNIS+7 change −14.8 vs. +14.8 external placebo. HELIOS-A (vutrisiran): mNIS+7 −2.2 vs. +14.8. Both show significant benefit. However, only AMVUTTRA has ATTR-CM approval. TTR reduction: eplontersen ~81% vs. vutrisiran ~88% peak.",
    close: "For pure hATTR-PN patients, both are reasonable options. For any patient with cardiac involvement, AMVUTTRA is the only RNAi/ASO option with ATTR-CM approval.",
    dataPoint: "Q3M vs. monthly · ATTR-CM approved (eplontersen: not approved) · TTR ↓ ~88% vs. ~81%",
    citation: "Hanna M et al. JAMA. 2023;330(15):1448-1458 | HELIOS-A Amyloid 2023",
    tags: ["eplontersen", "WAINUA", "AstraZeneca", "monthly", "ASO", "comparison", "hATTR-PN"],
  },
  {
    id: "c4",
    category: "Competitive",
    categoryColor: "#0093C4",
    objection: "I heard Intellia's gene editing therapy is coming — should I wait for that?",
    difficulty: "Challenging",
    acknowledge: "Gene editing for ATTR is a genuinely exciting scientific frontier, and I understand the appeal of a potentially curative approach.",
    bridge: "However, the current clinical reality is quite different from the promise. As of Q1 2026, Intellia's NTLA-2001 received an FDA clinical hold in October 2025 due to safety findings — the programme is currently paused.",
    evidence: "AMVUTTRA is FDA-approved today, with 42-month Phase 3 data demonstrating a 35% mortality reduction. ATTR-CM is a progressive disease with a median survival of 2–5 years from diagnosis without treatment. The HELIOS-B OLE crossover data showed that patients who delayed treatment had worse outcomes.",
    close: "I would never recommend waiting for an unapproved, clinically-held therapy when a proven, approved option is available today.",
    dataPoint: "Intellia NTLA-2001: FDA clinical hold Oct 2025 · AMVUTTRA: FDA approved Mar 2025",
    citation: "FDA Clinical Hold Notice. October 2025 | HELIOS-B OLE ESC 2025",
    tags: ["Intellia", "gene editing", "NTLA-2001", "clinical hold", "future therapy", "delay"],
  },
  {
    id: "d1",
    category: "Diagnosis",
    categoryColor: "#6366F1",
    objection: "ATTR-CM is too rare — I don't see these patients in my practice.",
    difficulty: "Moderate",
    acknowledge: "This is one of the most common misconceptions about ATTR-CM — and it's one I'm passionate about correcting.",
    bridge: "ATTR-CM is dramatically underdiagnosed. The prevalence is much higher than most cardiologists realise — it's estimated to affect 300,000–500,000 people in the US alone, with the vast majority undiagnosed.",
    evidence: "Studies show ATTR-CM in 13% of HFpEF patients ≥60 years, 16% of TAVI patients, and up to 25% of patients with bilateral CTS. The average diagnostic delay is 3–4 years. If you have a cardiology practice with HFpEF patients ≥60 years, you almost certainly have ATTR-CM patients.",
    close: "The question isn't whether you see these patients — it's whether you're recognising them. The red flag cluster (HFpEF + LVH + low-voltage ECG + bilateral CTS) is the key.",
    dataPoint: "ATTR-CM in 13% HFpEF ≥60y · 16% TAVI patients · 300K–500K undiagnosed in US",
    citation: "Castaño A et al. Eur Heart J. 2017;38(38):2879-2887 | Ruberg FL et al. JACC. 2019",
    tags: ["prevalence", "underdiagnosis", "rare disease", "HFpEF", "epidemiology", "TAVI"],
  },
  {
    id: "d2",
    category: "Diagnosis",
    categoryColor: "#6366F1",
    objection: "The Tc-PYP scan is not available at my centre — how do I diagnose these patients?",
    difficulty: "Moderate",
    acknowledge: "Access to Tc-PYP scanning can be a real barrier, and I want to help you find a solution.",
    bridge: "Tc-PYP bone scintigraphy is available at most academic medical centres and many community nuclear medicine departments. If it's not at your centre, a referral pathway can be established.",
    evidence: "The Gillmore non-biopsy criteria (Circulation 2016) require Grade 2 or 3 Tc-PYP uptake + negative serum/urine immunofixation + normal free light chains. In centres without Tc-PYP, cardiac MRI with late gadolinium enhancement can support the diagnosis. Endomyocardial biopsy with Congo red staining remains the gold standard if non-biopsy criteria cannot be met.",
    close: "I can help you identify the nearest Tc-PYP-capable nuclear medicine centre and establish a referral pathway.",
    dataPoint: "Tc-PYP available at most academic centres · Gillmore criteria: Grade 2/3 + negative haematologic workup",
    citation: "Gillmore JD et al. Circulation. 2016;133(24):2404-2412",
    tags: ["Tc-PYP", "diagnosis", "scan", "access", "referral", "Gillmore", "biopsy"],
  },
  {
    id: "d3",
    category: "Diagnosis",
    categoryColor: "#6366F1",
    objection: "How do I know if my HFpEF patient might have ATTR-CM?",
    difficulty: "Easy",
    acknowledge: "This is the most important clinical question in ATTR-CM — early identification is everything.",
    bridge: "There is a well-validated red flag cluster that should trigger Tc-PYP workup in any HFpEF patient.",
    evidence: "Red flags for ATTR-CM: (1) HFpEF in a male ≥60 years. (2) LVH (wall thickness ≥12 mm) with low-voltage ECG — 'voltage-mass discordance.' (3) Granular/sparkling myocardium on echo. (4) Bilateral carpal tunnel syndrome. (5) Lumbar spinal stenosis. (6) Biceps tendon rupture. (7) Low-flow, low-gradient aortic stenosis. Any 2–3 of these should prompt Tc-PYP + haematologic workup.",
    close: "A simple screening question: 'Has this patient ever had carpal tunnel surgery?' That single question has been shown to significantly increase ATTR-CM detection rates.",
    dataPoint: "Red flag cluster: HFpEF + LVH + low-voltage ECG + bilateral CTS + lumbar stenosis",
    citation: "Witteles RM et al. JACC Heart Fail. 2019;7(8):709-716 | Ruberg FL et al. JACC. 2019",
    tags: ["HFpEF", "red flags", "diagnosis", "screening", "carpal tunnel", "LVH", "ECG"],
  },
  {
    id: "p1",
    category: "Patient Population",
    categoryColor: "#8E44AD",
    objection: "My patient is 85 years old — is AMVUTTRA appropriate at that age?",
    difficulty: "Easy",
    acknowledge: "Age is always an important consideration, and I appreciate you thinking carefully about your patient's overall profile.",
    bridge: "HELIOS-B was specifically designed to reflect the real-world ATTR-CM population — which is predominantly elderly. Age alone is not a contraindication.",
    evidence: "In HELIOS-B: 92% of patients were ≥65 years, 62% were ≥75 years, and the oldest enrolled patient was 93 years old. The benefit was consistent across age subgroups. AMVUTTRA requires no dose adjustment for age. The SC Q3M regimen is particularly well-suited for elderly patients — 4 office visits per year, no complex oral regimen.",
    close: "An 85-year-old with confirmed ATTR-CM and NYHA Class II–III symptoms stands to benefit significantly from a 35% mortality reduction. The question is not age — it's functional status and patient goals.",
    dataPoint: "HELIOS-B: 92% ≥65y · 62% ≥75y · Oldest patient: 93y · Benefit consistent across age subgroups",
    citation: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130",
    tags: ["elderly", "age", "85 years", "geriatric", "patient selection", "NYHA"],
  },
  {
    id: "p2",
    category: "Patient Population",
    categoryColor: "#8E44AD",
    objection: "My patient has advanced HF (NYHA Class IV) — will AMVUTTRA help at this stage?",
    difficulty: "Challenging",
    acknowledge: "NYHA Class IV is a challenging clinical situation, and I want to give you an honest answer.",
    bridge: "HELIOS-B enrolled patients with NYHA Class I–III — Class IV patients were excluded from the trial. This is an important limitation to acknowledge.",
    evidence: "The evidence base for AMVUTTRA is in NYHA I–III patients. For Class IV patients, the primary focus should be on optimising HF management. If a Class IV patient has recently deteriorated from Class III — and the underlying ATTR-CM is driving the progression — there may be a rationale for initiating AMVUTTRA in consultation with a specialist amyloid centre.",
    close: "For Class IV patients, I would recommend referral to a specialist amyloid centre for a multidisciplinary discussion.",
    dataPoint: "HELIOS-B: NYHA I–III only · Class IV excluded · Specialist referral recommended",
    citation: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130",
    tags: ["NYHA IV", "advanced HF", "Class IV", "patient selection", "severe", "referral"],
  },
  {
    id: "p3",
    category: "Patient Population",
    categoryColor: "#8E44AD",
    objection: "My patient has a V122I mutation — does AMVUTTRA work for this variant?",
    difficulty: "Easy",
    acknowledge: "This is an excellent and clinically important question — the V122I variant deserves specific attention.",
    bridge: "AMVUTTRA silences ALL TTR mRNA — both wild-type and mutant sequences — because the siRNA targets a conserved region of the TTR transcript. It is genotype-agnostic.",
    evidence: "The siRNA in vutrisiran targets a sequence in the 3' UTR of TTR mRNA conserved across all TTR variants, including V122I, V30M, T60A, and all other pathogenic mutations. In HELIOS-B, ~12% of patients had hATTR (TTR mutation), including V122I carriers. Efficacy was consistent across genotype subgroups. V122I is present in ~3.4% of African Americans.",
    close: "AMVUTTRA is approved for all TTR genotypes in ATTR-CM and hATTR-PN. For V122I patients — who often have a more aggressive cardiac phenotype — early initiation is particularly important.",
    dataPoint: "Genotype-agnostic · V122I ~3.4% African Americans · Consistent efficacy across genotypes",
    citation: "Fontana M et al. N Engl J Med. 2024;391(22):2119-2130 | Jacobson DR et al. N Engl J Med. 1997",
    tags: ["V122I", "mutation", "genotype", "African American", "hATTR", "variant"],
  },
  {
    id: "e5",
    category: "Efficacy",
    categoryColor: "#27AE60",
    objection: "The HELIOS-B trial excluded NYHA Class IV patients — how do I know it works in real-world patients who are sicker?",
    difficulty: "Challenging",
    acknowledge: "That's a clinically important question, and it's a genuine limitation of the trial design that I want to address honestly.",
    bridge: "HELIOS-B enrolled NYHA Class I–III patients, which reflects the population where disease-modifying therapy is most likely to show benefit. The exclusion of Class IV was intentional — these patients have end-stage disease where any therapy's impact is limited.",
    evidence: "Real-world registry data from the Transthyretin Amyloidosis Outcomes Survey (THAOS) and the UK National Amyloidosis Centre show that ATTR-CM patients who initiate therapy earlier (NYHA I–II) have significantly better outcomes than those who start at NYHA III. The HELIOS-B OLE crossover data reinforces this: patients who delayed treatment had worse outcomes than those on vutrisiran from Day 1.",
    close: "The message is clear: identify and treat early. If your patient is NYHA III, initiate now — don't wait for Class IV.",
    dataPoint: "HELIOS-B: NYHA I–III · OLE crossover: delayed treatment = worse outcomes · Real-world: early initiation = better prognosis",
    citation: "Fontana M et al. N Engl J Med. 2024 | THAOS Registry | HELIOS-B OLE ESC 2025",
    tags: ["NYHA IV", "real-world", "sicker patients", "early treatment", "OLE", "crossover"],
  },
  {
    id: "e6",
    category: "Efficacy",
    categoryColor: "#27AE60",
    objection: "I don't see a difference in 6-minute walk test — does AMVUTTRA actually improve functional capacity?",
    difficulty: "Moderate",
    acknowledge: "That's a fair observation — functional capacity endpoints in ATTR-CM trials have been variable, and I want to give you an accurate picture.",
    bridge: "In HELIOS-B, the 6MWT showed a treatment difference favouring vutrisiran, but the primary value of AMVUTTRA is in slowing disease progression and reducing mortality — not necessarily producing dramatic functional gains in a population with advanced HF.",
    evidence: "HELIOS-B: 6MWT showed a +20.8 metre difference favouring vutrisiran at 30 months (P=0.06 — a trend). Kansas City Cardiomyopathy Questionnaire (KCCQ) showed a +4.1 point improvement (P=0.04). The most compelling functional data is from HELIOS-A (hATTR-PN): Norfolk QoL-DN improved by −21.1 points vs. +5.5 for placebo (P<0.001). For ATTR-CM, the primary goal is mortality and hospitalisation reduction — not symptom reversal.",
    close: "AMVUTTRA slows the relentless progression of ATTR-CM. In a disease where the natural history is inexorable decline, stabilisation is a major therapeutic win.",
    dataPoint: "HELIOS-B 6MWT: +20.8m (P=0.06) · KCCQ: +4.1 points (P=0.04) · HELIOS-A Norfolk QoL: −21.1 vs. +5.5",
    citation: "Fontana M et al. N Engl J Med. 2024 | Adams D et al. Amyloid. 2023",
    tags: ["6MWT", "functional capacity", "KCCQ", "quality of life", "Norfolk QoL", "functional outcomes"],
  },
  {
    id: "s5",
    category: "Safety",
    categoryColor: "#C0392B",
    objection: "My patient had a liver transplant for hATTR-PN 5 years ago — do they still need AMVUTTRA?",
    difficulty: "Challenging",
    acknowledge: "This is an excellent and nuanced question that comes up in specialist practice.",
    bridge: "Liver transplantation removes the primary source of mutant TTR production, but it does not eliminate wild-type TTR — which continues to be produced by the transplanted liver. More importantly, amyloid deposits already present in the heart at the time of transplant can continue to expand using wild-type TTR as a substrate.",
    evidence: "Post-transplant cardiac amyloidosis is a well-documented phenomenon. Studies show that cardiac amyloid burden can increase post-transplant despite removal of mutant TTR, because wild-type TTR continues to deposit onto existing amyloid fibrils. AMVUTTRA suppresses ALL TTR (both wild-type and mutant) by ~88%, potentially slowing or halting this residual cardiac progression.",
    close: "For post-transplant patients with evidence of cardiac amyloidosis (LVH, low-voltage ECG, elevated biomarkers), a discussion with an amyloid specialist about AMVUTTRA is warranted.",
    dataPoint: "Post-transplant cardiac amyloid: wild-type TTR deposits on existing fibrils · AMVUTTRA suppresses all TTR ~88%",
    citation: "Ruberg FL et al. JACC. 2019 | Transplant amyloid literature",
    tags: ["liver transplant", "post-transplant", "wild-type TTR", "cardiac amyloid", "residual disease", "hATTR-PN"],
  },
  {
    id: "s6",
    category: "Safety",
    categoryColor: "#C0392B",
    objection: "Are there any drug-drug interactions I need to worry about with AMVUTTRA?",
    difficulty: "Easy",
    acknowledge: "Drug interactions are always an important consideration, especially in an elderly population on multiple medications.",
    bridge: "This is actually one of AMVUTTRA's key safety advantages — it has no clinically significant drug-drug interactions identified to date.",
    evidence: "Vutrisiran is not a substrate, inhibitor, or inducer of CYP450 enzymes (CYP1A2, 2C8, 2C9, 2C19, 2D6, 3A4), P-glycoprotein, or other major drug transporters. This is a significant advantage in ATTR-CM patients who are typically on multiple cardiac medications (beta-blockers, ACE inhibitors, diuretics, anticoagulants). No dose adjustments are required for concomitant medications.",
    close: "No DDI monitoring is required. Your patient can continue all existing cardiac medications without adjustment.",
    dataPoint: "No CYP450 interactions · No transporter interactions · No dose adjustments for concomitant medications",
    citation: "AMVUTTRA® Prescribing Information. NDA 215515. 2025.",
    tags: ["drug interactions", "DDI", "CYP450", "polypharmacy", "cardiac medications", "safety"],
  },
  {
    id: "a4",
    category: "Access & Cost",
    categoryColor: "#E67E22",
    objection: "My hospital formulary committee hasn't approved AMVUTTRA yet — what can I do?",
    difficulty: "Challenging",
    acknowledge: "Formulary access is a real barrier, and I appreciate you raising it — it's one of the most important conversations we can have.",
    bridge: "A P&T committee submission for AMVUTTRA is a structured process, and I can support you with the clinical dossier, health economics data, and patient impact analysis.",
    evidence: "Key P&T submission elements: (1) FDA approval status (ATTR-CM March 2025, hATTR-PN June 2022). (2) HELIOS-B: HR 0.65 for ACM, 35% mortality reduction. (3) Health economics: ATTR-CM patients have high hospitalisation rates (avg 1.5 hospitalisations/year); HELIOS-B showed 26% reduction in CV hospitalisations. (4) Unmet need: estimated 300K–500K undiagnosed ATTR-CM patients in the US. (5) No REMS, no premedication, SC Q3M — minimal pharmacy and nursing burden.",
    close: "I can provide a complete P&T dossier template and connect you with the Alnylam Medical Affairs team for formulary support.",
    dataPoint: "P&T key data: HR 0.65 ACM · 26% CV hospitalisation reduction · No REMS · SC Q3M",
    citation: "Fontana M et al. N Engl J Med. 2024 | AMVUTTRA® PI 2025 | Alnylam Health Economics Data",
    tags: ["formulary", "P&T committee", "hospital access", "dossier", "health economics", "hospitalisation"],
  },
  {
    id: "c5",
    category: "Competitive",
    categoryColor: "#0093C4",
    objection: "Inotersen (TEGSEDI) is also approved for hATTR-PN — how does AMVUTTRA compare?",
    difficulty: "Moderate",
    acknowledge: "Inotersen is a valid option for hATTR-PN, and it was an important early approval in this space.",
    bridge: "AMVUTTRA and inotersen both target TTR mRNA, but they use fundamentally different mechanisms and have very different safety and convenience profiles.",
    evidence: "Key differences: (1) Mechanism: AMVUTTRA is GalNAc-siRNA (RISC-mediated cleavage); inotersen is an ASO (RNase H-mediated degradation). (2) Dosing: AMVUTTRA SC Q3M (4 injections/year); inotersen SC weekly (52 injections/year). (3) Safety: inotersen carries a REMS programme due to risks of thrombocytopenia (platelet monitoring required) and glomerulonephritis. AMVUTTRA has no REMS. (4) Indications: AMVUTTRA approved for ATTR-CM + hATTR-PN; inotersen approved for hATTR-PN only.",
    close: "For hATTR-PN patients, AMVUTTRA offers equivalent efficacy with dramatically better convenience and a cleaner safety profile — no REMS, no weekly injections, no platelet monitoring.",
    dataPoint: "4 vs. 52 injections/year · No REMS vs. REMS (thrombocytopenia, GN) · ATTR-CM approved (inotersen: not)",
    citation: "TEGSEDI® PI 2023 | AMVUTTRA® PI 2025 | Benson MD et al. N Engl J Med. 2018",
    tags: ["inotersen", "TEGSEDI", "ASO", "REMS", "thrombocytopenia", "weekly injection", "comparison"],
  },
  {
    id: "c6",
    category: "Competitive",
    categoryColor: "#0093C4",
    objection: "I've heard that diflunisal is used off-label for ATTR — is it a reasonable alternative?",
    difficulty: "Moderate",
    acknowledge: "Diflunisal is an interesting historical option, and some physicians in academic centres have used it off-label.",
    bridge: "Diflunisal is an NSAID that was found to have TTR-stabilising properties in addition to its anti-inflammatory effects. However, it is not approved for ATTR and carries significant safety concerns in the typical ATTR-CM patient population.",
    evidence: "The Berk 2013 NEJM trial showed diflunisal slowed neuropathy progression in hATTR-PN. However: (1) Not FDA-approved for ATTR. (2) NSAID toxicity: GI bleeding, renal impairment, fluid retention — all problematic in elderly ATTR-CM patients with HF. (3) Requires twice-daily dosing. (4) No cardiac outcome data comparable to HELIOS-B. AMVUTTRA has FDA approval, 42-month Phase 3 mortality data, and no NSAID-related toxicity.",
    close: "Diflunisal may have a role in resource-limited settings, but for patients who can access AMVUTTRA, there is no clinical rationale to use an off-label NSAID with significant toxicity risk.",
    dataPoint: "Diflunisal: off-label, NSAID toxicity, no cardiac outcome data · AMVUTTRA: FDA approved, HR 0.65 ACM",
    citation: "Berk JL et al. N Engl J Med. 2013;369(9):819-829 | AMVUTTRA® PI 2025",
    tags: ["diflunisal", "off-label", "NSAID", "TTR stabiliser", "alternative", "resource-limited"],
  },
  {
    id: "d4",
    category: "Diagnosis",
    categoryColor: "#6366F1",
    objection: "My patient has a positive Tc-PYP but also has multiple myeloma — can I still diagnose ATTR-CM non-invasively?",
    difficulty: "Challenging",
    acknowledge: "This is one of the most critical diagnostic pitfalls in ATTR-CM, and I'm glad you're thinking carefully about it.",
    bridge: "The Gillmore non-biopsy criteria require BOTH Grade 2/3 Tc-PYP AND a negative haematologic workup. Multiple myeloma — or any plasma cell dyscrasia — invalidates the non-biopsy pathway.",
    evidence: "AL amyloidosis (light chain) can also cause positive Tc-PYP uptake and is clinically indistinguishable from ATTR-CM without haematologic testing. The haematologic workup must include: serum protein electrophoresis (SPEP), serum immunofixation, urine immunofixation, and serum free light chains. If ANY of these are abnormal, biopsy is mandatory before initiating AMVUTTRA — treating AL amyloidosis with an RNAi therapy instead of chemotherapy would be a serious clinical error.",
    close: "In a patient with multiple myeloma, endomyocardial biopsy with Congo red staining and immunohistochemistry is required to confirm ATTR-CM before initiating AMVUTTRA.",
    dataPoint: "Gillmore criteria: Grade 2/3 Tc-PYP + negative haematologic workup · Multiple myeloma → biopsy mandatory",
    citation: "Gillmore JD et al. Circulation. 2016;133(24):2404-2412",
    tags: ["multiple myeloma", "AL amyloidosis", "Tc-PYP", "haematologic workup", "biopsy", "diagnosis", "Gillmore"],
  },
  {
    id: "p4",
    category: "Patient Population",
    categoryColor: "#8E44AD",
    objection: "My patient is a woman of childbearing age with hATTR-PN — is AMVUTTRA appropriate?",
    difficulty: "Challenging",
    acknowledge: "This requires careful counselling, and you're right to think through it thoroughly.",
    bridge: "AMVUTTRA carries a Black Box Warning for embryo-fetal toxicity. However, hATTR-PN is a progressive, life-altering disease — the benefit-risk discussion is nuanced and patient-specific.",
    evidence: "Requirements for women of reproductive potential: (1) Confirm negative pregnancy test before initiating. (2) Effective contraception required during treatment AND for 7 months after the last dose. (3) Counsel on the risks and the need for contraception. (4) If pregnancy is desired, AMVUTTRA must be discontinued at least 7 months before conception. For a 35-year-old with Stage 1 hATTR-PN, the progressive neurological damage from untreated disease must be weighed against the contraception requirement.",
    close: "A shared decision-making conversation with the patient, a neurologist, and ideally a maternal-fetal medicine specialist is essential. The disease does not wait.",
    dataPoint: "BBW: embryo-fetal toxicity · Contraception required during tx + 7 months post-dose · Negative pregnancy test before initiation",
    citation: "AMVUTTRA® Prescribing Information. NDA 215515. 2025.",
    tags: ["women", "childbearing", "pregnancy", "contraception", "hATTR-PN", "reproductive", "BBW"],
  },
  {
    id: "p5",
    category: "Patient Population",
    categoryColor: "#8E44AD",
    objection: "My patient has significant hepatic impairment — is AMVUTTRA safe and effective?",
    difficulty: "Moderate",
    acknowledge: "Hepatic function is particularly relevant for AMVUTTRA given that the liver is both the site of action and the organ responsible for TTR synthesis.",
    bridge: "Mild hepatic impairment does not require dose adjustment. However, AMVUTTRA has not been studied in moderate or severe hepatic impairment.",
    evidence: "Pharmacokinetic studies show no clinically meaningful difference in vutrisiran exposure in mild hepatic impairment (Child-Pugh A). For moderate (Child-Pugh B) or severe (Child-Pugh C) hepatic impairment, AMVUTTRA has not been formally studied — use with caution and consider specialist consultation. Importantly, reduced hepatic function may also reduce TTR production independently, potentially affecting the magnitude of TTR suppression achievable.",
    close: "For Child-Pugh A: no dose adjustment required. For Child-Pugh B/C: specialist consultation recommended before initiating.",
    dataPoint: "Child-Pugh A: no dose adjustment · Child-Pugh B/C: not studied, use with caution",
    citation: "AMVUTTRA® Prescribing Information. NDA 215515. 2025.",
    tags: ["hepatic impairment", "liver disease", "Child-Pugh", "dose adjustment", "safety", "pharmacokinetics"],
  },
];

const CATEGORIES = ["All", "Efficacy", "Safety", "Access & Cost", "Competitive", "Diagnosis", "Patient Population"];
const DIFFICULTIES = ["All", "Easy", "Moderate", "Challenging"] as const;

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#27AE60",
  Moderate: "#E67E22",
  Challenging: "#C0392B",
};

// Build a sorted tag list with frequency counts from all objections
function buildTagFrequency(): { tag: string; count: number }[] {
  const freq: Record<string, number> = {};
  OBJECTIONS.forEach((o) => o.tags.forEach((t) => { freq[t] = (freq[t] ?? 0) + 1; }));
  return Object.entries(freq)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

const ALL_TAGS = buildTagFrequency();

function buildScript(obj: Objection): string {
  return `OBJECTION: "${obj.objection}"\n\nACKNOWLEDGE:\n${obj.acknowledge}\n\nBRIDGE:\n${obj.bridge}\n\nEVIDENCE:\n${obj.evidence}\n\nCLOSE:\n${obj.close}\n\nKEY DATA POINT: ${obj.dataPoint}\n\nCITATION: ${obj.citation}`;
}

// ─── Objection Card ───────────────────────────────────────────────────────────
function ObjectionCard({
  obj, isOpen, onToggle, isFav, onFav, activeTags, onTagClick,
}: {
  obj: Objection; isOpen: boolean; onToggle: () => void;
  isFav: boolean; onFav: () => void;
  activeTags: Set<string>; onTagClick: (tag: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(buildScript(obj)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      background: "white", borderRadius: "14px",
      border: `1px solid ${isOpen ? obj.categoryColor : "#E8ECF0"}`,
      boxShadow: isOpen ? `0 6px 24px ${obj.categoryColor}20` : "0 2px 8px rgba(26,58,107,0.04)",
      overflow: "hidden", transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    }}>
      <div onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onToggle()} style={{
        width: "100%", display: "flex", alignItems: "flex-start", gap: "12px",
        padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: obj.categoryColor, flexShrink: 0, marginTop: "5px" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.6px", color: obj.categoryColor, fontFamily: "'DM Sans', sans-serif", background: `${obj.categoryColor}12`, padding: "2px 7px", borderRadius: "4px" }}>{obj.category}</span>
            <span style={{ fontSize: "9px", fontWeight: 700, color: DIFFICULTY_COLORS[obj.difficulty], fontFamily: "'DM Sans', sans-serif", background: `${DIFFICULTY_COLORS[obj.difficulty]}12`, padding: "2px 7px", borderRadius: "4px" }}>{obj.difficulty}</span>
          </div>
          <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#1A3A6B", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4, fontStyle: "italic" }}>"{obj.objection}"</div>
          <div style={{ marginTop: "6px", fontSize: "11px", color: "#566573", fontFamily: "'JetBrains Mono', monospace" }}>{obj.dataPoint}</div>
          {/* Inline tag chips on card */}
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" as const, marginTop: "8px" }}>
            {obj.tags.map((tag) => (
              <button key={tag} onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                style={{
                  background: activeTags.has(tag) ? "#1A3A6B" : "#F0F4F8",
                  color: activeTags.has(tag) ? "white" : "#566573",
                  border: activeTags.has(tag) ? "1px solid #1A3A6B" : "1px solid #E8ECF0",
                  padding: "2px 8px", borderRadius: "4px", fontSize: "10px",
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  transition: "all 0.15s ease", fontWeight: activeTags.has(tag) ? 700 : 400,
                }}>#{tag}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px", flexShrink: 0, alignItems: "flex-end" }}>
          <button onClick={(e) => { e.stopPropagation(); onFav(); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", lineHeight: 1, opacity: isFav ? 1 : 0.3, transition: "opacity 0.15s ease" }} title={isFav ? "Remove from favourites" : "Add to favourites"}>★</button>
          <span style={{ fontSize: "16px", color: obj.categoryColor, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", display: "block" }}>▾</span>
        </div>
      </div>

      {isOpen && (
        <div style={{ borderTop: `1px solid ${obj.categoryColor}30`, padding: "20px 18px", background: "#FAFBFC" }}>
          {[
            { label: "Acknowledge", color: "#566573", icon: "🤝", text: obj.acknowledge },
            { label: "Bridge", color: "#0093C4", icon: "🌉", text: obj.bridge },
            { label: "Evidence", color: "#27AE60", icon: "📊", text: obj.evidence },
            { label: "Close", color: obj.categoryColor, icon: "🎯", text: obj.close },
          ].map((step) => (
            <div key={step.label} style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #F0F4F8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <span style={{ fontSize: "14px" }}>{step.icon}</span>
                <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.8px", color: step.color, fontFamily: "'DM Sans', sans-serif" }}>{step.label}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#2C3E50", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{step.text}</p>
            </div>
          ))}
          <div style={{ fontSize: "10.5px", color: "#95A5A6", fontFamily: "'JetBrains Mono', monospace", marginBottom: "14px", lineHeight: 1.5 }}>📚 {obj.citation}</div>
          <button onClick={handleCopy} style={{ background: copied ? "#27AE60" : obj.categoryColor, color: "white", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "background 0.2s ease", display: "flex", alignItems: "center", gap: "6px" }}>
            {copied ? "✓ Copied to clipboard!" : "📋 Copy full script"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ObjectionHandlerSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState<"All" | "Easy" | "Moderate" | "Challenging">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
    setOpenId(null);
  };

  const clearAllFilters = () => {
    setActiveCategory("All");
    setActiveDifficulty("All");
    setSearchQuery("");
    setActiveTags(new Set());
    setShowFavsOnly(false);
    setOpenId(null);
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return OBJECTIONS.filter((obj) => {
      const matchCat = activeCategory === "All" || obj.category === activeCategory;
      const matchDiff = activeDifficulty === "All" || obj.difficulty === activeDifficulty;
      const matchFav = !showFavsOnly || favourites.has(obj.id);
      const matchTags = activeTags.size === 0 || Array.from(activeTags).every((t) => obj.tags.includes(t));
      const matchSearch = !q || obj.objection.toLowerCase().includes(q) || obj.tags.some((t) => t.toLowerCase().includes(q)) || obj.category.toLowerCase().includes(q) || obj.dataPoint.toLowerCase().includes(q) || obj.acknowledge.toLowerCase().includes(q) || obj.bridge.toLowerCase().includes(q) || obj.evidence.toLowerCase().includes(q) || obj.close.toLowerCase().includes(q);
      return matchCat && matchDiff && matchFav && matchTags && matchSearch;
    });
  }, [activeCategory, activeDifficulty, searchQuery, activeTags, showFavsOnly, favourites]);

  const hasActiveFilters = activeCategory !== "All" || activeDifficulty !== "All" || searchQuery !== "" || activeTags.size > 0 || showFavsOnly;

  const visibleTags = showAllTags ? ALL_TAGS : ALL_TAGS.slice(0, 20);

  return (
    <section id="objection-handler" style={{ padding: "80px 0", background: "#F8F9FA" }} aria-label="HCP objection handler">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div className="section-accent" />
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#1A3A6B", marginBottom: "8px" }}>HCP Objection Handler</h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "640px" }}>
            20 scripted responses — Acknowledge · Bridge · Evidence · Close. Search by text, filter by category, difficulty, or keyword tags.
          </p>
        </div>

        {/* Category stat tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px", marginBottom: "24px" }}>
          {CATEGORIES.slice(1).map((cat) => {
            const count = OBJECTIONS.filter((o) => o.category === cat).length;
            const color = OBJECTIONS.find((o) => o.category === cat)?.categoryColor ?? "#566573";
            const isActive = activeCategory === cat;
            return (
              <button key={cat} onClick={() => { setActiveCategory(isActive ? "All" : cat); setOpenId(null); }}
                style={{ background: isActive ? color : "white", border: `1px solid ${isActive ? color : "#E8ECF0"}`, borderTop: `3px solid ${color}`, borderRadius: "10px", padding: "10px 8px", cursor: "pointer", textAlign: "center" as const, transition: "all 0.15s ease" }}>
                <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.4rem", color: isActive ? "white" : "#1A3A6B", lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.4px", color: isActive ? "rgba(255,255,255,0.85)" : "#566573", fontFamily: "'DM Sans', sans-serif", marginTop: "4px", lineHeight: 1.3 }}>{cat}</div>
              </button>
            );
          })}
        </div>

        {/* Search + difficulty + favourites row */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap" as const }}>
          <div style={{ position: "relative" as const, flex: 1, minWidth: "200px" }}>
            <span style={{ position: "absolute" as const, left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "#95A5A6" }}>🔍</span>
            <input type="text" placeholder="Search objections, keywords, evidence..." value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setOpenId(null); }}
              style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: "10px", border: "1px solid #E8ECF0", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", color: "#1A3A6B", outline: "none", background: "white", boxSizing: "border-box" as const }} />
          </div>

          {/* Difficulty filter */}
          <div style={{ display: "flex", gap: "6px" }}>
            {DIFFICULTIES.map((d) => (
              <button key={d} onClick={() => { setActiveDifficulty(d); setOpenId(null); }}
                style={{ background: activeDifficulty === d ? (d === "All" ? "#1A3A6B" : DIFFICULTY_COLORS[d]) : "white", color: activeDifficulty === d ? "white" : "#566573", border: `1px solid ${activeDifficulty === d ? (d === "All" ? "#1A3A6B" : DIFFICULTY_COLORS[d]) : "#E8ECF0"}`, padding: "8px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap" as const }}>
                {d === "All" ? `All (${OBJECTIONS.length})` : d}
              </button>
            ))}
          </div>

          {/* Favourites */}
          <button onClick={() => setShowFavsOnly((v) => !v)}
            style={{ background: showFavsOnly ? "#F0C040" : "white", color: showFavsOnly ? "#7D6608" : "#566573", border: `1px solid ${showFavsOnly ? "#F0C040" : "#E8ECF0"}`, padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap" as const }}>
            ★ {favourites.size > 0 ? `Favs (${favourites.size})` : "Favourites"}
          </button>
        </div>

        {/* ── KEYWORD TAG CLOUD ─────────────────────────────────────────── */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #E8ECF0", padding: "16px 18px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A3A6B", fontFamily: "'DM Sans', sans-serif" }}>🏷 Filter by keyword</span>
              {activeTags.size > 0 && (
                <span style={{ background: "#1A3A6B", color: "white", borderRadius: "10px", padding: "1px 8px", fontSize: "10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{activeTags.size} active</span>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {activeTags.size > 0 && (
                <button onClick={() => setActiveTags(new Set())}
                  style={{ background: "none", border: "none", color: "#C0392B", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 700 }}>
                  Clear tags ✕
                </button>
              )}
              <button onClick={() => setShowAllTags((v) => !v)}
                style={{ background: "none", border: "none", color: "#0093C4", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 700 }}>
                {showAllTags ? "Show less ▲" : `Show all ${ALL_TAGS.length} ▼`}
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" as const }}>
            {visibleTags.map(({ tag, count }) => {
              const isActive = activeTags.has(tag);
              return (
                <button key={tag} onClick={() => toggleTag(tag)}
                  style={{
                    background: isActive ? "#1A3A6B" : "#F0F4F8",
                    color: isActive ? "white" : "#445566",
                    border: `1px solid ${isActive ? "#1A3A6B" : "#DDE3EA"}`,
                    padding: "4px 10px", borderRadius: "20px", fontSize: "11.5px",
                    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                    transition: "all 0.15s ease", fontWeight: isActive ? 700 : 400,
                    display: "flex", alignItems: "center", gap: "5px",
                  }}>
                  #{tag}
                  <span style={{ background: isActive ? "rgba(255,255,255,0.25)" : "#DDE3EA", color: isActive ? "white" : "#778899", borderRadius: "8px", padding: "0 5px", fontSize: "9px", fontWeight: 700, lineHeight: "16px" }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active filter summary bar */}
        {hasActiveFilters && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" as const, background: "#EEF2FF", borderRadius: "10px", padding: "10px 14px", border: "1px solid #C7D2FE" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#4338CA", fontFamily: "'DM Sans', sans-serif" }}>Active filters:</span>
            {activeCategory !== "All" && (
              <span onClick={() => setActiveCategory("All")} style={{ background: "#4338CA", color: "white", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                {activeCategory} ✕
              </span>
            )}
            {activeDifficulty !== "All" && (
              <span onClick={() => setActiveDifficulty("All")} style={{ background: DIFFICULTY_COLORS[activeDifficulty], color: "white", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                {activeDifficulty} ✕
              </span>
            )}
            {searchQuery && (
              <span onClick={() => setSearchQuery("")} style={{ background: "#0093C4", color: "white", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                "{searchQuery}" ✕
              </span>
            )}
            {Array.from(activeTags).map((tag) => (
              <span key={tag} onClick={() => toggleTag(tag)} style={{ background: "#1A3A6B", color: "white", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                #{tag} ✕
              </span>
            ))}
            {showFavsOnly && (
              <span onClick={() => setShowFavsOnly(false)} style={{ background: "#F0C040", color: "#7D6608", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                ★ Favourites ✕
              </span>
            )}
            <button onClick={clearAllFilters} style={{ marginLeft: "auto", background: "none", border: "none", color: "#4338CA", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 700 }}>
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <div style={{ fontSize: "12px", color: "#95A5A6", fontFamily: "'DM Sans', sans-serif", marginBottom: "14px" }}>
          Showing <strong style={{ color: "#1A3A6B" }}>{filtered.length}</strong> of {OBJECTIONS.length} objections
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center" as const, padding: "48px", color: "#95A5A6", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", background: "white", borderRadius: "14px", border: "1px solid #E8ECF0" }}>
            No objections match your current filters.
            <button onClick={clearAllFilters} style={{ display: "block", margin: "12px auto 0", background: "#1A3A6B", color: "white", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 700 }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
            {filtered.map((obj) => (
              <ObjectionCard key={obj.id} obj={obj}
                isOpen={openId === obj.id}
                onToggle={() => setOpenId(openId === obj.id ? null : obj.id)}
                isFav={favourites.has(obj.id)}
                onFav={() => setFavourites((prev) => { const n = new Set(prev); n.has(obj.id) ? n.delete(obj.id) : n.add(obj.id); return n; })}
                activeTags={activeTags}
                onTagClick={toggleTag}
              />
            ))}
          </div>
        )}

        {/* Footer tip */}
        <div style={{ marginTop: "28px", background: "white", borderRadius: "12px", padding: "16px 20px", display: "flex", gap: "10px", alignItems: "flex-start", border: "1px solid #E8ECF0" }}>
          <span style={{ fontSize: "18px", flexShrink: 0 }}>💡</span>
          <div style={{ fontSize: "12.5px", color: "#445566", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
            <strong>Pro tip:</strong> Use the <strong>ABEC framework</strong> — Acknowledge the concern genuinely, Bridge to the clinical context, present the Evidence concisely, and Close with a clear next step. Click any <strong>#tag</strong> on a card to instantly filter for related objections. Multi-select tags to narrow to a specific topic cluster. Star your most-used objections for quick access in the field.
          </div>
        </div>
      </div>
    </section>
  );
}
