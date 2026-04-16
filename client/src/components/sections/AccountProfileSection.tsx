import React, { useState } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Priority = "VERY HIGH" | "HIGH" | "MEDIUM";
type FormularyStatus = "Listed" | "Pending" | "Restricted" | "Not Listed";
type CallFrequency = "Weekly" | "Bi-weekly" | "Monthly" | "Quarterly";
type Influence = "National" | "Regional" | "Local";
type Relationship = "Champion" | "Advocate" | "Neutral" | "Skeptic" | "Unknown";
type DetailTab = "overview" | "kols" | "strategy";

interface KOL {
  name: string;
  title: string;
  specialty: string;
  influence: Influence;
  relationship: Relationship;
  notes: string;
}

interface Account {
  id: string;
  name: string;
  shortName: string;
  region: string;
  city: string;
  priority: Priority;
  beds: number;
  attrCandidates: number;
  specialists: { neurology: number; cardiology: number; internal: number };
  formulary: FormularyStatus;
  callFreq: CallFrequency;
  overview: {
    patientOpportunity: string;
    specialistBreakdown: string;
    notes: string;
  };
  kols: KOL[];
  strategy: {
    openingLine: string;
    primaryMessage: string;
    evidenceAnchors: string[];
    avoidTopics: string[];
    nextStep: string;
  };
}

// ─── REGION DEFINITIONS ────────────────────────────────────────────────────────
const REGIONS = [
  { id: "all",           label: "All Accounts",          color: "#00C2A8", count: 17 },
  { id: "riyadh",        label: "Riyadh",                color: "#ef4444", priority: "VERY HIGH" as Priority },
  { id: "jeddah-makkah", label: "Jeddah / Makkah",       color: "#f97316", priority: "VERY HIGH" as Priority },
  { id: "eastern",       label: "Eastern Province",       color: "#F59E0B", priority: "HIGH" as Priority },
  { id: "madinah-qassim-asir", label: "Madinah · Qassim · Asir", color: "#22C55E", priority: "MEDIUM" as Priority },
];

const PRIORITY_COLOR: Record<Priority, string> = {
  "VERY HIGH": "#ef4444",
  HIGH: "#F59E0B",
  MEDIUM: "#22C55E",
};

const FORMULARY_COLOR: Record<FormularyStatus, string> = {
  Listed: "#22C55E",
  Pending: "#F59E0B",
  Restricted: "#f97316",
  "Not Listed": "#6b7280",
};

const RELATIONSHIP_COLOR: Record<Relationship, string> = {
  Champion: "#00C2A8",
  Advocate: "#22C55E",
  Neutral: "#60A5FA",
  Skeptic: "#F59E0B",
  Unknown: "#6b7280",
};

const INFLUENCE_COLOR: Record<Influence, string> = {
  National: "#a855f7",
  Regional: "#F59E0B",
  Local: "#60A5FA",
};

// ─── ACCOUNT DATA ─────────────────────────────────────────────────────────────
const ACCOUNTS: Account[] = [
  // ── RIYADH (VERY HIGH) ──────────────────────────────────────────────────────
  {
    id: "kfshrc",
    name: "King Faisal Specialist Hospital & Research Centre",
    shortName: "KFSH&RC",
    region: "riyadh",
    city: "Riyadh",
    priority: "VERY HIGH",
    beds: 1100,
    attrCandidates: 48,
    specialists: { neurology: 12, cardiology: 18, internal: 25 },
    formulary: "Listed",
    callFreq: "Weekly",
    overview: {
      patientOpportunity:
        "Highest-volume rare-disease referral centre in KSA. Strong hATTR pipeline via established amyloid clinic. Estimated 48 hATTR-eligible patients currently followed in neurology + cardiology.",
      specialistBreakdown:
        "12 neurologists (3 with dedicated neuromuscular interest), 18 cardiologists (5 with amyloid interest), 25 internal medicine consultants. Multidisciplinary amyloid clinic meets monthly.",
      notes: "National-level decision-making authority. SFDA joint advisory board member. Formulary approval here cascades to many MOH-affiliated facilities.",
    },
    kols: [
      { name: "Prof. Fahad Al-Semari", title: "Head, Neuromuscular Division", specialty: "Neurology", influence: "National", relationship: "Champion", notes: "Co-PI on regional hATTR registry. Authored local Gillmore criteria guidance. Key advocate — ensure quarterly deep-dive meeting." },
      { name: "Dr. Rania Al-Qahtani", title: "Consultant Cardiologist", specialty: "Cardiology", influence: "Regional", relationship: "Advocate", notes: "Leads the cardiac amyloid programme. Strong HELIOS-B data user. Requests updated survival curve data at each call." },
      { name: "Dr. Ibrahim Al-Harbi", title: "Senior Internal Medicine", specialty: "Internal Medicine", influence: "Local", relationship: "Neutral", notes: "Key referral gateway from IM clinic. Not yet familiar with Gillmore criteria — educational opportunity." },
    ],
    strategy: {
      openingLine: "Prof. Al-Semari, given your amyloid clinic's volume, I'd like to show you the 42-month HELIOS-B survival data we just received — it directly answers the durability question you raised last quarter.",
      primaryMessage: "AMVUTTRA delivers proven CV mortality benefit (36% reduction) with the simplest administration of any hATTR disease-modifying agent — 4 SC injections per year, no cold chain, no Vitamin A.",
      evidenceAnchors: ["HELIOS-B 42-month: HR 0.64 for all-cause mortality + CV events", "HELIOS-A: 49% mNIS+7 improvement; non-inferior to patisiran", ">80% TTR suppression sustained throughout 3-month dosing interval"],
      avoidTopics: ["Cost/reimbursement — handle separately with pharmacy director", "Comparison to patisiran head-to-head (different endpoints)"],
      nextStep: "Book bilateral meeting: Prof. Al-Semari (neuro) + Dr. Al-Qahtani (cardio) — joint amyloid grand round presentation Q3.",
    },
  },
  {
    id: "kamc-ngha",
    name: "King Abdulaziz Medical City – National Guard Health Affairs",
    shortName: "KAMC-NGHA",
    region: "riyadh",
    city: "Riyadh",
    priority: "VERY HIGH",
    beds: 800,
    attrCandidates: 32,
    specialists: { neurology: 8, cardiology: 14, internal: 20 },
    formulary: "Listed",
    callFreq: "Bi-weekly",
    overview: {
      patientOpportunity:
        "Large integrated health system covering SANG (Saudi Arabian National Guard) beneficiaries. Dedicated rare-disease pharmacy with national formulary authority for NGHA network.",
      specialistBreakdown:
        "8 neurologists, 14 cardiologists (2 amyloid sub-specialists), 20 internal medicine. Referral chain well established through a centralised rare-disease coordinator.",
      notes: "NGHA formulary listing allows automatic access across all NGHA facilities in KSA — a multiplier account.",
    },
    kols: [
      { name: "Dr. Khalid Al-Mansour", title: "Consultant Neurologist", specialty: "Neurology", influence: "Regional", relationship: "Advocate", notes: "Familiar with vutrisiran from medical conferences. Waiting for formulary approval confirmation to start first patient." },
      { name: "Dr. Amal Al-Shehri", title: "Head of Cardiology", specialty: "Cardiology", influence: "National", relationship: "Champion", notes: "Published on cardiac amyloidosis in KSA. NGHA formulary committee chair — instrumental in the Listed status." },
    ],
    strategy: {
      openingLine: "Dr. Al-Mansour, now that AMVUTTRA is listed on the NGHA formulary, I want to walk you through the practical initiation checklist so your first patient can start without delay.",
      primaryMessage: "NGHA formulary approval means zero access friction for your ATTR patients — AMVUTTRA is available now, Q3M dosing minimises patient burden across your distributed beneficiary population.",
      evidenceAnchors: ["Listed NGHA formulary — no prior auth required", "36% CV event reduction in HELIOS-B", "4 injections/year vs 17 IV (patisiran) — ideal for remote beneficiaries"],
      avoidTopics: ["Reimbursement delays — already resolved", "Comparing to inotersen safety profile unprompted"],
      nextStep: "Deliver initiation starter pack + Alnylam Assist enrolment forms to Dr. Al-Mansour's coordinator. Target first patient within 60 days.",
    },
  },
  {
    id: "ksmc",
    name: "King Saud Medical City",
    shortName: "KSMC",
    region: "riyadh",
    city: "Riyadh",
    priority: "VERY HIGH",
    beds: 1500,
    attrCandidates: 38,
    specialists: { neurology: 6, cardiology: 12, internal: 30 },
    formulary: "Pending",
    callFreq: "Weekly",
    overview: {
      patientOpportunity:
        "Largest public hospital in Riyadh by bed count. High IM patient throughput creates large undiagnosed hATTR pool. Formulary application submitted — approval expected within 2 months.",
      specialistBreakdown:
        "6 neurologists (1 with active hATTR caseload), 12 cardiologists, 30 internal medicine consultants who are the primary diagnostic gateway.",
      notes: "Formulary pending — bridge supply via compassionate access or private pharmacy during approval window. Pharmacy director is the key decision-maker.",
    },
    kols: [
      { name: "Dr. Majed Al-Otaibi", title: "Consultant Neurologist", specialty: "Neurology", influence: "Regional", relationship: "Neutral", notes: "Has 2 suspected hATTR-PN patients awaiting diagnosis. Not yet convinced of urgency for formulary approval." },
      { name: "Dr. Norah Al-Fawzan", title: "Head, Internal Medicine", specialty: "Internal Medicine", influence: "Regional", relationship: "Advocate", notes: "Sees high CTS + neuropathy burden in IM clinic. Receptive to Gillmore screening tool. Advocate for the formulary application." },
    ],
    strategy: {
      openingLine: "Dr. Al-Otaibi, for the 2 patients you mentioned last visit — the genetic results should be back soon. Once confirmed, I'd like to have the compassionate-use bridge ready so they don't wait for the formulary decision.",
      primaryMessage: "AMVUTTRA is the only SC Q3M option with proven CM + PN efficacy — worth fast-tracking the formulary regardless of indication focus.",
      evidenceAnchors: ["Dual CM + PN indication — covers all your ATTR subtypes", "HELIOS-A: superior convenience vs patisiran, no Vit A", "Compassionate use pathway available while formulary approval proceeds"],
      avoidTopics: ["Challenging the formulary timeline — pharmacy relations are sensitive"],
      nextStep: "Schedule pharmacy director meeting with MSL support to present the health-economic dossier. Target formulary approval within 8 weeks.",
    },
  },
  {
    id: "kkuh",
    name: "King Khalid University Hospital",
    shortName: "KKUH",
    region: "riyadh",
    city: "Riyadh",
    priority: "VERY HIGH",
    beds: 700,
    attrCandidates: 22,
    specialists: { neurology: 10, cardiology: 8, internal: 18 },
    formulary: "Listed",
    callFreq: "Bi-weekly",
    overview: {
      patientOpportunity:
        "Academic medical centre with strong neurology faculty. Primary training site for KSU medical graduates. High resident/fellow exposure makes this a key educational account.",
      specialistBreakdown:
        "10 neurologists with strong academic publication output, 8 cardiologists, 18 IM. Neurology grand round series is attended by 40+ trainees monthly.",
      notes: "Academic influence multiplier — faculty here train tomorrow's prescribers. Grand round sponsorship is highest-ROI activity.",
    },
    kols: [
      { name: "Prof. Mohammed Al-Daajani", title: "Chairman, Neurology Dept.", specialty: "Neurology", influence: "National", relationship: "Champion", notes: "Founding member of the Saudi Neurological Society hATTR working group. Has published 3 papers on rare neuropathies in KSA. Full champion." },
      { name: "Dr. Sara Al-Rashidi", title: "Consultant Neurologist", specialty: "Neurology", influence: "Regional", relationship: "Advocate", notes: "Young KOL with active social media presence. Ideal for satellite symposium speaker role." },
    ],
    strategy: {
      openingLine: "Prof. Al-Daajani, following your publication on diagnostic delays, I'd love to share the updated HELIOS-B 42-month data for your upcoming neuromuscular review.",
      primaryMessage: "AMVUTTRA's evidence base is now the strongest in the class — dual-indication, proven CV mortality, and a dosing regimen your patients actually maintain.",
      evidenceAnchors: ["HELIOS-B: 36% reduction composite endpoint — publishable-quality evidence", "Average 4–7 year diagnostic delay in KSA — Gillmore criteria can close this gap", "Academic citation: Fontana et al. NEJM 2023"],
      avoidTopics: ["Discussing unproven long-term data beyond 42 months"],
      nextStep: "Confirm Prof. Al-Daajani as speaker for Riyadh Neurology Symposium in Q3. Prepare slide deck aligned with ESMO/AAN content.",
    },
  },
  {
    id: "psmmc",
    name: "Prince Sultan Military Medical City",
    shortName: "PSMMC",
    region: "riyadh",
    city: "Riyadh",
    priority: "VERY HIGH",
    beds: 950,
    attrCandidates: 28,
    specialists: { neurology: 6, cardiology: 10, internal: 22 },
    formulary: "Restricted",
    callFreq: "Monthly",
    overview: {
      patientOpportunity:
        "Military hospital with SANG patient population. Formulary restricted to MOD-approved list. Access requires Military Medical Services approval alongside SFDA listing.",
      specialistBreakdown:
        "6 neurologists, 10 cardiologists, 22 internal medicine. Strong HFpEF clinic under cardiology — high undiagnosed wt-ATTR-CM opportunity.",
      notes: "Access route: MOD formulary committee meets quarterly. Chaplain-level HCP relationships critical. MSL engagement preferred over sales.",
    },
    kols: [
      { name: "Brig. Dr. Turki Al-Shammari", title: "Chief of Cardiology", specialty: "Cardiology", influence: "Regional", relationship: "Neutral", notes: "Sees high HFpEF load in older military retirees. Interested in Tc-PYP screening data. Prefers peer-reviewed evidence over detailing." },
      { name: "Col. Dr. Hessa Al-Zahrani", title: "Head, Neurology", specialty: "Neurology", influence: "Local", relationship: "Unknown", notes: "New appointment 6 months ago. No relationship established yet — priority to introduce in Q2." },
    ],
    strategy: {
      openingLine: "Brig. Dr. Al-Shammari, your HFpEF population likely contains undiagnosed wt-ATTR-CM — I'd like to share the Gillmore non-invasive diagnostic pathway that can identify these patients without biopsy.",
      primaryMessage: "Non-invasive diagnosis + SC Q3M dosing = low clinical burden for your military retiree population. AMVUTTRA is the right fit for patients who value convenience and proven survival benefit.",
      evidenceAnchors: ["Gillmore criteria: Tc-PYP Grade 2–3 + negative AL = diagnose without biopsy", "wt-ATTR-CM: HELIOS-B subgroup shows consistent 36% benefit", "No cold chain — ideal for military logistics contexts"],
      avoidTopics: ["MOD procurement cost — outside your scope; escalate to market access team"],
      nextStep: "Request MSL-led medical education session with cardiology team. Submit MOD formulary dossier via market access. Target restricted-to-listed upgrade by Q4.",
    },
  },
  {
    id: "hmg-riyadh",
    name: "Dr Sulaiman Al-Habib Medical Group – Riyadh Hospitals",
    shortName: "HMG Riyadh",
    region: "riyadh",
    city: "Riyadh",
    priority: "VERY HIGH",
    beds: 620,
    attrCandidates: 18,
    specialists: { neurology: 4, cardiology: 8, internal: 15 },
    formulary: "Not Listed",
    callFreq: "Monthly",
    overview: {
      patientOpportunity:
        "Fast-growing private hospital group with 4 Riyadh facilities. Premium insured patient population — high willingness-to-pay and early adoption potential for innovative therapies.",
      specialistBreakdown:
        "4 neurologists (2 with neuromuscular interest), 8 cardiologists, 15 IM. Private-pay environment reduces formulary friction once HCP champions are engaged.",
      notes: "No current formulary requirement for private-pay patients. Case-by-case approval via patient insurance. Key opportunity: convert first case to generate internal evidence.",
    },
    kols: [
      { name: "Dr. Adel Al-Juffali", title: "Consultant Neurologist", specialty: "Neurology", influence: "Regional", relationship: "Neutral", notes: "Sees upper-middle-class patients. High interest in novel therapies. Has not yet encountered a confirmed hATTR case but receptive to diagnostic education." },
      { name: "Dr. Lina Al-Zahrani", title: "Consultant Cardiologist", specialty: "Cardiology", influence: "Local", relationship: "Unknown", notes: "Recently joined from KKUH. Strong academic background. Introduction call scheduled for Q2." },
    ],
    strategy: {
      openingLine: "Dr. Al-Juffali, in your private neurology practice, the hATTR patients you're looking for are often labelled CIDP or idiopathic neuropathy — here's the red-flag checklist that changes the differential.",
      primaryMessage: "Your insured, motivated patients benefit most from AMVUTTRA's convenience — SC Q3M at home after training, no IV chair, no cold chain, no Vitamin A supplementation.",
      evidenceAnchors: ["SC self-injection after training — ideal for ambulatory private patients", "HELIOS-A: 49% neurological improvement — superior patient-reported outcomes", "Alnylam Assist: full access and injection support programme"],
      avoidTopics: ["Listing requirements — not applicable here"],
      nextStep: "Identify one suspected hATTR case together; offer Alnylam Act® genetic testing fast-track. Create first success story for HMG group reference.",
    },
  },

  // ── JEDDAH / MAKKAH (VERY HIGH) ─────────────────────────────────────────────
  {
    id: "kfh-jeddah",
    name: "King Faisal Hospital – Jeddah",
    shortName: "KFH Jeddah",
    region: "jeddah-makkah",
    city: "Jeddah",
    priority: "VERY HIGH",
    beds: 500,
    attrCandidates: 22,
    specialists: { neurology: 8, cardiology: 12, internal: 16 },
    formulary: "Listed",
    callFreq: "Weekly",
    overview: {
      patientOpportunity:
        "Premier referral centre for the Western Region. Established amyloid workup pathway in place. Strong neurology-cardiology collaboration.",
      specialistBreakdown:
        "8 neurologists (2 dedicated neuromuscular), 12 cardiologists, 16 IM. Amyloid MDT meets bi-monthly with imaging, genetics, and pharmacist representation.",
      notes: "Listed on formulary since SFDA approval. Western Region KOL hub — advocacy here cascades to smaller Jeddah private and government hospitals.",
    },
    kols: [
      { name: "Dr. Yazid Al-Ghamdi", title: "Head of Neuromuscular", specialty: "Neurology", influence: "National", relationship: "Champion", notes: "Western Region representative on the hATTR registry. Referred 6 confirmed hATTR patients for treatment in 2025. Highest-volume initiator in the Western Region." },
      { name: "Dr. Fatima Al-Malki", title: "Consultant Cardiologist", specialty: "Cardiology", influence: "Regional", relationship: "Advocate", notes: "Leading the cardiac amyloid Tc-PYP imaging programme at KFH. Requests updated echo data on vutrisiran patients." },
    ],
    strategy: {
      openingLine: "Dr. Al-Ghamdi, with 6 patients already initiated, your real-world experience is invaluable — would you be willing to present at the Western Region amyloid symposium in Q3?",
      primaryMessage: "Your patient outcomes are the best evidence for the Western Region. Let's systematically document them for a regional case series publication.",
      evidenceAnchors: ["Real-world initiation: 6 patients, zero discontinuations", "HELIOS-B 42-month: 36% reduction in composite primary — durable benefit", "Western Region genetic registry: V30M variant prevalence data"],
      avoidTopics: ["Reimbursement issues — all resolved for listed accounts"],
      nextStep: "Co-author regional case series. Schedule symposium speaker slot. Organise satellite dinner with KAUH and IMC neurologists.",
    },
  },
  {
    id: "kauh",
    name: "King Abdulaziz University Hospital",
    shortName: "KAUH",
    region: "jeddah-makkah",
    city: "Jeddah",
    priority: "VERY HIGH",
    beds: 850,
    attrCandidates: 28,
    specialists: { neurology: 10, cardiology: 9, internal: 22 },
    formulary: "Pending",
    callFreq: "Bi-weekly",
    overview: {
      patientOpportunity:
        "Academic hospital affiliated with King Abdulaziz University. High neurology residency output. Formulary application in progress — pharmacy committee meeting in 6 weeks.",
      specialistBreakdown:
        "10 neurologists including strong academic faculty, 9 cardiologists, 22 IM. Key publication output in rare neurological diseases.",
      notes: "Formulary approval will unlock KAUH + all affiliated polyclinics. Health-economic argument is the strongest lever here.",
    },
    kols: [
      { name: "Prof. Amira Al-Zahrani", title: "Chair, Neurology Dept.", specialty: "Neurology", influence: "National", relationship: "Advocate", notes: "Published on hATTR natural history in KSA. Co-investigator in HELIOS-A extension. Requesting QALY data for the formulary dossier." },
      { name: "Dr. Samir Bamashmoos", title: "Consultant Cardiologist", specialty: "Cardiology", influence: "Regional", relationship: "Neutral", notes: "Interested in cardiac screening protocol. Has not yet referred an ATTR patient for treatment — educational gap on treatment eligibility." },
    ],
    strategy: {
      openingLine: "Prof. Al-Zahrani, I have the health-economic dossier with the QALY data you requested — let me walk you through it before the pharmacy committee meeting.",
      primaryMessage: "The cost per QALY for vutrisiran compares favourably to other rare-disease therapies already listed. The formulary decision is a health economics case, not just a clinical one.",
      evidenceAnchors: ["Cost/QALY vs patisiran: comparable with superior convenience", "HELIOS-B: 36% CV event reduction = reduced hospitalisation burden", "Alnylam Assist: covers access coordination at no cost to institution"],
      avoidTopics: ["Discussing price vs generic alternatives — no generic exists"],
      nextStep: "Attend pharmacy committee meeting with Prof. Al-Zahrani. Provide patient registry enrolment as secondary value add. Target approval in 6 weeks.",
    },
  },
  {
    id: "imc-jeddah",
    name: "International Medical Center",
    shortName: "IMC",
    region: "jeddah-makkah",
    city: "Jeddah",
    priority: "VERY HIGH",
    beds: 260,
    attrCandidates: 12,
    specialists: { neurology: 4, cardiology: 6, internal: 10 },
    formulary: "Not Listed",
    callFreq: "Bi-weekly",
    overview: {
      patientOpportunity:
        "Premium private hospital serving high-net-worth patients. No formulary constraint — physician prescribes directly. Rapid adoption of innovative therapies historically.",
      specialistBreakdown:
        "4 neurologists, 6 cardiologists, 10 IM. Affluent patient population with strong engagement in rare-disease advocacy.",
      notes: "Private-pay removes formulary friction entirely. Focus on HCP education and first-case identification. Insurance liaison is key for reimbursement.",
    },
    kols: [
      { name: "Dr. Hani Al-Shamrani", title: "Consultant Neurologist", specialty: "Neurology", influence: "Regional", relationship: "Neutral", notes: "International training (Mayo Clinic). High interest in novel therapies. Sees expat and high-net-worth Jeddah population. Ready for educational deep dive." },
    ],
    strategy: {
      openingLine: "Dr. Al-Shamrani, in your private practice the undiagnosed hATTR patient often looks like refractory CIDP — I'd like to share 5 specific red flags your Mayo training would recognise.",
      primaryMessage: "Your patients want the newest, most convenient option. AMVUTTRA delivers both: proven survival benefit and only 4 SC doses per year, with full insurance reimbursement support.",
      evidenceAnchors: ["hATTR-PN: 71% of patients improved on mNIS+7 in HELIOS-A", "4 SC injections/year — no disruption to patient lifestyle", "Alnylam Assist insurance liaison service"],
      avoidTopics: ["Formulary committees — irrelevant for private practice"],
      nextStep: "Educational lunch in Q2. Introduce Alnylam Act® genetic testing option for 2 suspected hATTR cases in Dr Al-Shamrani's current caseload.",
    },
  },
  {
    id: "kamc-wr",
    name: "King Abdulaziz Medical City – Western Region",
    shortName: "KAMC-WR",
    region: "jeddah-makkah",
    city: "Jeddah",
    priority: "VERY HIGH",
    beds: 750,
    attrCandidates: 26,
    specialists: { neurology: 6, cardiology: 12, internal: 18 },
    formulary: "Listed",
    callFreq: "Weekly",
    overview: {
      patientOpportunity:
        "NGHA-affiliated hospital in the Western Region. Formulary Listed via NGHA network authority. Hajj season creates unique diagnostic opportunity for pilgrims with undiagnosed ATTR.",
      specialistBreakdown:
        "6 neurologists, 12 cardiologists (Hajj cardiac emergency unit), 18 IM. Unique population exposure including pilgrims from high-prevalence regions (West Africa, Portugal).",
      notes: "Listed via NGHA network. Hajj season (Q2) brings international patients — coordinate diagnostic awareness campaign with MOH for this window.",
    },
    kols: [
      { name: "Dr. Walid Al-Otaibi", title: "Consultant Neurologist", specialty: "Neurology", influence: "Regional", relationship: "Advocate", notes: "Manages pilgrims with acute neuropathic presentations during Hajj season. Aware of V30M prevalence in Portuguese pilgrims. Wants a rapid diagnostic pathway card." },
      { name: "Dr. Rawan Al-Malki", title: "Consultant Cardiologist", specialty: "Cardiology", influence: "Local", relationship: "Neutral", notes: "Handles cardiac emergencies including unexplained HFpEF in Hajj pilgrims. Educational opportunity on Tc-PYP screening." },
    ],
    strategy: {
      openingLine: "Dr. Al-Otaibi, ahead of Hajj season I'd like to leave you with a rapid hATTR diagnostic decision card — it's designed for the acute setting when you have minutes, not hours.",
      primaryMessage: "KAMC-WR's unique Hajj exposure makes it the most important diagnostic gateway in the Western Region. Early identification here leads to local treatment at a listed facility.",
      evidenceAnchors: ["V30M variant: high prevalence in pilgrims from Portugal, Brazil, West Africa", "Non-invasive Gillmore criteria — results in 48 hours", "Listed formulary: zero delay from diagnosis to treatment initiation"],
      avoidTopics: ["Long-term treatment discussions in the Hajj acute setting — focus on diagnosis first"],
      nextStep: "Produce Hajj rapid-identification card (A5 laminated). Deliver before Dhul-Qi'dah. Brief all 6 neurologists with 15-min slot at neuro morning meeting.",
    },
  },

  // ── EASTERN PROVINCE (HIGH) ─────────────────────────────────────────────────
  {
    id: "kfhu",
    name: "King Fahd Hospital of the University – Al-Khobar",
    shortName: "KFHU Al-Khobar",
    region: "eastern",
    city: "Al-Khobar",
    priority: "HIGH",
    beds: 650,
    attrCandidates: 20,
    specialists: { neurology: 8, cardiology: 10, internal: 16 },
    formulary: "Listed",
    callFreq: "Bi-weekly",
    overview: {
      patientOpportunity:
        "Academic referral centre for the Eastern Province. University affiliation drives teaching-level hATTR awareness. Formulary listed. Aramco employee families are a distinct high-prevalence subgroup.",
      specialistBreakdown:
        "8 neurologists, 10 cardiologists (strong echo capability), 16 IM. Active research programme with IUC collaboration.",
      notes: "Growing ATTR caseload due to proximity to Aramco population. Coordinate with JHAH for cross-referral protocol.",
    },
    kols: [
      { name: "Dr. Faisal Al-Jishi", title: "Consultant Neurologist", specialty: "Neurology", influence: "Regional", relationship: "Advocate", notes: "Eastern Province representative on the national hATTR working group. Refers complex cases to KFSH&RC Riyadh but initiates treatment locally." },
      { name: "Dr. Noura Al-Dossary", title: "Consultant Cardiologist", specialty: "Cardiology", influence: "Local", relationship: "Neutral", notes: "Recently trained in advanced heart failure. Sees HFpEF patients — educational gap on ATTR-CM screening." },
    ],
    strategy: {
      openingLine: "Dr. Al-Jishi, with the Aramco referrals you're seeing, let's set up a joint screening pathway between KFHU and JHAH so no ATTR patient falls through the cracks between facilities.",
      primaryMessage: "Eastern Province ATTR caseload is growing — being the regional treatment hub with AMVUTTRA listed puts KFHU ahead of the curve.",
      evidenceAnchors: ["Listed formulary: immediate access", "HELIOS-B: consistent benefit in wt-ATTR-CM (mean age 76) matching your Aramco retiree population", "Cross-referral: KFHU initiates, JHAH monitors — minimal patient travel"],
      avoidTopics: ["Discussing JHAH as a competing account — position as collaborative network"],
      nextStep: "Facilitate KFHU–JHAH cross-referral protocol meeting. Target: 2 new initiations per quarter in Eastern Province combined.",
    },
  },
  {
    id: "dmc",
    name: "Dammam Medical Complex",
    shortName: "DMC",
    region: "eastern",
    city: "Dammam",
    priority: "HIGH",
    beds: 900,
    attrCandidates: 24,
    specialists: { neurology: 5, cardiology: 9, internal: 20 },
    formulary: "Pending",
    callFreq: "Monthly",
    overview: {
      patientOpportunity:
        "Largest public hospital in Dammam. High throughput internal medicine creates a large undiagnosed pool. Formulary pending — pharmacy review next quarter.",
      specialistBreakdown:
        "5 neurologists, 9 cardiologists, 20 IM (primary diagnostic gateway). High volume referral from eastern rural areas.",
      notes: "Key to Eastern Province public-sector access. IM department head is the formulary committee champion.",
    },
    kols: [
      { name: "Dr. Abdullah Al-Mohanna", title: "Head, Internal Medicine", specialty: "Internal Medicine", influence: "Regional", relationship: "Advocate", notes: "Champion for rare-disease access in Dammam. Submitted the AMVUTTRA formulary application personally. Quarterly follow-up on approval status." },
      { name: "Dr. Saad Al-Qahtani", title: "Consultant Neurologist", specialty: "Neurology", influence: "Local", relationship: "Neutral", notes: "2 suspected hATTR patients awaiting genetic results. Has not initiated treatment before." },
    ],
    strategy: {
      openingLine: "Dr. Al-Mohanna, your formulary submission is in review — let me update you on the decision timeline and have the bridge programme ready so Dr. Al-Qahtani's patients aren't waiting.",
      primaryMessage: "The public-sector formulary approval unlocks ATTR treatment for the entire eastern rural referral population — this is a high-impact access moment.",
      evidenceAnchors: ["Formulary dossier: economic model shows reduced hospitalisation cost within 2 years", "HELIOS-B: 36% reduction in CV hospitalisation — directly relevant to public-sector budget holders", "Bridge programme: patients can start before formulary finalised via compassionate use"],
      avoidTopics: ["Competitive products — maintain focus on AMVUTTRA access argument"],
      nextStep: "File compassionate-use applications for Dr. Al-Qahtani's 2 suspected patients. Attend formulary committee as medical expert (coordinate with MSL).",
    },
  },
  {
    id: "jhah",
    name: "Johns Hopkins Aramco Healthcare",
    shortName: "JHAH",
    region: "eastern",
    city: "Dhahran",
    priority: "HIGH",
    beds: 450,
    attrCandidates: 16,
    specialists: { neurology: 6, cardiology: 8, internal: 14 },
    formulary: "Listed",
    callFreq: "Bi-weekly",
    overview: {
      patientOpportunity:
        "Premium healthcare system for Saudi Aramco employees and dependents. JHU-trained medical staff. Formulary listed. International travel patterns of Aramco expats increase diagnostic exposure.",
      specialistBreakdown:
        "6 neurologists (JHU-trained, guideline-adherent), 8 cardiologists, 14 IM. High-quality echo and genetic testing in-house.",
      notes: "JHU clinical protocols are the operational standard. Evidence-based conversations only — no anecdotal framing. Expat physicians respond to data from major US/EU centres.",
    },
    kols: [
      { name: "Dr. Michael Thornton", title: "Head, Neurology (Aramco)", specialty: "Neurology", influence: "Regional", relationship: "Champion", notes: "US-trained. Has followed AMVUTTRA PDUFA timeline. Initiated 3 patients. Requests journal reprints rather than marketing materials." },
      { name: "Dr. Layla Al-Saud", title: "Consultant Cardiologist", specialty: "Cardiology", influence: "Local", relationship: "Advocate", notes: "Saudi-American dual training. Leads ATTR-CM echo screening protocol. Wants updated NT-proBNP biomarker data from HELIOS-B." },
    ],
    strategy: {
      openingLine: "Dr. Thornton, the 42-month HELIOS-B survival analysis was published in NEJM Evidence last month — I brought the full reprint. The Kaplan-Meier separation at 12 months is particularly compelling.",
      primaryMessage: "For a JHU-standard practice, AMVUTTRA is the evidence-based choice: the only SC RNAi agent with Level I evidence for both PN and CM in a single randomised trial programme.",
      evidenceAnchors: ["HELIOS-B NEJM Evidence 2024: HR 0.64 (0.51–0.81), p<0.0001", "HELIOS-A NEJM 2022: mNIS+7 −17.2 vs +3.3, p<0.001", "NT-proBNP: −19% reduction vs +24% placebo in HELIOS-B"],
      avoidTopics: ["Marketing language — use only peer-reviewed language", "Unsubstantiated claims about real-world data"],
      nextStep: "Share NEJM Evidence reprint. Schedule biomarker data review session with Dr. Al-Saud. Target NT-proBNP protocol update to include AMVUTTRA monitoring guidance.",
    },
  },

  // ── MADINAH / QASSIM / ASIR (MEDIUM) ────────────────────────────────────────
  {
    id: "kfh-madinah",
    name: "King Fahd Hospital – Madinah",
    shortName: "KFH Madinah",
    region: "madinah-qassim-asir",
    city: "Madinah",
    priority: "MEDIUM",
    beds: 550,
    attrCandidates: 14,
    specialists: { neurology: 4, cardiology: 7, internal: 12 },
    formulary: "Not Listed",
    callFreq: "Monthly",
    overview: {
      patientOpportunity:
        "Principal referral hospital for Madinah Region. Similar to KAMC-WR, sees pilgrims from high-prevalence hATTR regions. Formulary not yet submitted — educational first phase.",
      specialistBreakdown:
        "4 neurologists, 7 cardiologists, 12 IM. Limited rare-disease infrastructure — most confirmed hATTR cases are referred to Riyadh.",
      notes: "Phase 1: Build awareness and diagnostic capability. Phase 2: Formulary submission. Phase 3: Local treatment initiation. Currently at Phase 1.",
    },
    kols: [
      { name: "Dr. Hatim Al-Anzi", title: "Consultant Neurologist", specialty: "Neurology", influence: "Local", relationship: "Unknown", notes: "No prior engagement. Introduction planned for Q2 medical education event. Neuromuscular interest noted from conference registration data." },
    ],
    strategy: {
      openingLine: "Dr. Al-Anzi, I'd like to introduce you to a diagnostic checklist that may change how you approach progressive neuropathy cases in your clinic — it's designed to be used in 5 minutes.",
      primaryMessage: "hATTR is under-diagnosed in Madinah — the patients are there, waiting for a clinician who knows what to look for. This checklist is the starting point.",
      evidenceAnchors: ["Saudi hATTR registry: estimated 50+ undiagnosed cases in the Madinah/Tabouk region", "Gillmore criteria: non-invasive diagnosis — no biopsy required", "Alnylam Act® genetic testing: free, 2-week turnaround"],
      avoidTopics: ["Formulary and treatment discussions — premature until diagnosis pathway is established"],
      nextStep: "Deliver Gillmore diagnostic card + Act® testing brochure. Schedule follow-up in 60 days. Target: 1 confirmed diagnosis referred to KFSH&RC Riyadh.",
    },
  },
  {
    id: "kfsh-buraydah",
    name: "King Fahd Specialist Hospital – Buraydah",
    shortName: "KFSH Buraydah",
    region: "madinah-qassim-asir",
    city: "Buraydah",
    priority: "MEDIUM",
    beds: 390,
    attrCandidates: 10,
    specialists: { neurology: 3, cardiology: 5, internal: 8 },
    formulary: "Not Listed",
    callFreq: "Quarterly",
    overview: {
      patientOpportunity:
        "Regional referral centre for Qassim Region. Limited hATTR awareness currently. Key opportunity: Qassim population has high rate of hereditary conditions due to endogamous marriage patterns.",
      specialistBreakdown:
        "3 neurologists, 5 cardiologists, 8 IM. Strong relationships with primary care in Al-Qassim — referral network is the priority investment.",
      notes: "Quarterly call plan reflects lower current density, but the genetic opportunity in the Qassim population justifies continued engagement.",
    },
    kols: [
      { name: "Dr. Saleh Al-Mutairi", title: "Consultant Neurologist", specialty: "Neurology", influence: "Local", relationship: "Neutral", notes: "Seen 1 confirmed TTR amyloidosis case in 5 years. Receptive to genetic awareness education. Suggested by KFSH&RC as a regional ambassador candidate." },
    ],
    strategy: {
      openingLine: "Dr. Al-Mutairi, given Qassim's hereditary disease prevalence, hATTR may be more common than your 1 confirmed case suggests — here's the data on how many cases remain undiagnosed per diagnosed case.",
      primaryMessage: "For every confirmed hATTR diagnosis, an estimated 8–10 first-degree relatives carry the variant. Qassim's family network makes this a high-yield diagnostic region.",
      evidenceAnchors: ["hATTR: autosomal dominant — 50% inheritance risk per child/sibling", "KSA registry: Val30Met and other variants documented in Qassim families", "Alnylam Act® genetic testing: extends cascade testing to first-degree relatives at no cost"],
      avoidTopics: ["Treatment and formulary — premature; build diagnostic confidence first"],
      nextStep: "Leave Act® cascade testing materials. Target: refer 1 family with suspected hereditary neuropathy to KFSH&RC genetic clinic within 6 months.",
    },
  },
  {
    id: "asir-central",
    name: "Asir Central Hospital",
    shortName: "Asir Central",
    region: "madinah-qassim-asir",
    city: "Abha",
    priority: "MEDIUM",
    beds: 510,
    attrCandidates: 12,
    specialists: { neurology: 3, cardiology: 6, internal: 10 },
    formulary: "Not Listed",
    callFreq: "Quarterly",
    overview: {
      patientOpportunity:
        "Main referral hospital for Asir Region. Mountainous geography creates diagnostic isolation — patients often present late with advanced neuropathy. MOH rare-disease programme extension here is strategic.",
      specialistBreakdown:
        "3 neurologists, 6 cardiologists, 10 IM. Long travel distances mean patients are reluctant to travel to Riyadh — strong argument for local diagnosis and treatment.",
      notes: "AMVUTTRA's SC Q3M dosing is particularly compelling here — 4 clinic visits per year vs 17 (patisiran) is a real access argument in this geography.",
    },
    kols: [
      { name: "Dr. Bandar Al-Qahtani", title: "Consultant Neurologist", specialty: "Neurology", influence: "Local", relationship: "Neutral", notes: "Strong community relationships in Asir. Interested in telemedicine diagnostic pathways. No hATTR cases diagnosed to date." },
    ],
    strategy: {
      openingLine: "Dr. Al-Qahtani, your patients can't easily travel to Riyadh — that's exactly why AMVUTTRA's 4 SC doses per year, given locally, matters. Let me show you how to diagnose and treat right here in Asir.",
      primaryMessage: "SC Q3M = 4 clinic visits per year, right here in Abha. For your rural patients, that's the difference between compliance and dropout.",
      evidenceAnchors: ["4 SC Q3M vs 17 IV patisiran — reduces patient travel burden by 77%", "Gillmore non-invasive diagnosis — no Riyadh biopsy referral required", "Alnylam Assist: home injection training reduces clinic dependency"],
      avoidTopics: ["Complex multicentre referral logistics — emphasise local capability"],
      nextStep: "Co-develop a telemedicine diagnostic protocol with Dr. Al-Qahtani for remote Asir patients. Target: 1 new diagnosis initiated locally by year-end.",
    },
  },
  {
    id: "kfh-jizan",
    name: "King Fahd Central Hospital – Jizan",
    shortName: "KFCH Jizan",
    region: "madinah-qassim-asir",
    city: "Jizan",
    priority: "MEDIUM",
    beds: 430,
    attrCandidates: 10,
    specialists: { neurology: 2, cardiology: 5, internal: 10 },
    formulary: "Not Listed",
    callFreq: "Quarterly",
    overview: {
      patientOpportunity:
        "Southern Region referral centre. High proportion of patients with African origin — Val142Ile variant (most common in Africans, ~3–4% prevalence) creates a distinct ATTR-CM opportunity not seen elsewhere in KSA.",
      specialistBreakdown:
        "2 neurologists, 5 cardiologists, 10 IM. Proximity to Yemen border creates cross-border patient flows with limited medical records.",
      notes: "Val142Ile is the African-American variant but also found in Jizan's African-origin population. This region-specific message is a differentiator.",
    },
    kols: [
      { name: "Dr. Mohammed Al-Amoudi", title: "Consultant Cardiologist", specialty: "Cardiology", influence: "Local", relationship: "Unknown", notes: "Has noted unexplained HFpEF in younger-than-expected patients. No awareness of Val142Ile ATTR-CM link. First engagement in Q2." },
    ],
    strategy: {
      openingLine: "Dr. Al-Amoudi, in your HFpEF patients with African origin, the Val142Ile ATTR variant is the most common cause of ATTR-CM globally in that population — have you ordered Tc-PYP in any of these patients?",
      primaryMessage: "Jizan's demographic profile makes it unique for Val142Ile ATTR-CM screening — a diagnosis that's actionable with AMVUTTRA and completely missed without awareness.",
      evidenceAnchors: ["Val142Ile: ~3.4% carrier frequency in individuals of African ancestry", "HELIOS-B: consistent benefit regardless of variant (wt or hereditary)", "Tc-PYP scintigraphy: available at King Fahd Jizan — no referral required for imaging"],
      avoidTopics: ["hATTR-PN discussion — ATTR-CM is the primary opportunity here"],
      nextStep: "Deliver Val142Ile screening awareness card. Identify 2 HFpEF patients for Tc-PYP. Facilitate genetic testing via Alnylam Act® programme.",
    },
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AccountProfileSection() {
  const [activeRegion, setActiveRegion] = useState<string>("all");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  const filtered =
    activeRegion === "all"
      ? ACCOUNTS
      : ACCOUNTS.filter((a) => a.region === activeRegion);

  const regionCounts = REGIONS.reduce<Record<string, number>>((acc, r) => {
    acc[r.id] =
      r.id === "all"
        ? ACCOUNTS.length
        : ACCOUNTS.filter((a) => a.region === r.id).length;
    return acc;
  }, {});

  const totalAttr = ACCOUNTS.reduce((s, a) => s + a.attrCandidates, 0);

  const cardStyle = (priority: Priority): React.CSSProperties => ({
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${PRIORITY_COLOR[priority]}33`,
    borderRadius: 16,
    padding: "0 0 16px 0",
    cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    overflow: "hidden",
    position: "relative",
  });

  return (
    <section
      id="account-profiles"
      style={{
        background: "linear-gradient(180deg, #060D18 0%, #0A1628 100%)",
        padding: "80px 24px 80px",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ width: 40, height: 3, background: "#00C2A8", borderRadius: 2, marginBottom: 16 }} />
        <h2 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#E8F4F8", marginBottom: 8 }}>
          Account Profiles
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 32 }}>
          17 strategic accounts across 4 regions · {totalAttr} estimated hATTR-eligible patients
        </p>

        {/* Territory summary KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 40 }}>
          {[
            { label: "Total Accounts", value: "17", color: "#00C2A8" },
            { label: "hATTR Candidates", value: `~${totalAttr}`, color: "#F59E0B" },
            { label: "Listed Formulary", value: `${ACCOUNTS.filter(a => a.formulary === "Listed").length}`, color: "#22C55E" },
            { label: "Very High Priority", value: `${ACCOUNTS.filter(a => a.priority === "VERY HIGH").length}`, color: "#ef4444" },
          ].map((k) => (
            <div key={k.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, color: k.color, fontWeight: 400 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Region filter tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {REGIONS.map((r) => (
            <button
              key={r.id}
              aria-pressed={activeRegion === r.id}
              onClick={() => setActiveRegion(r.id)}
              style={{
                padding: "8px 18px",
                borderRadius: 24,
                border: `1px solid ${activeRegion === r.id ? r.color : "rgba(255,255,255,0.12)"}`,
                background: activeRegion === r.id ? `${r.color}22` : "transparent",
                color: activeRegion === r.id ? r.color : "rgba(255,255,255,0.6)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {r.label}
              <span style={{ background: activeRegion === r.id ? r.color : "rgba(255,255,255,0.15)", color: activeRegion === r.id ? "#060D18" : "rgba(255,255,255,0.6)", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
                {regionCounts[r.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Account Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 20, marginBottom: 56 }}>
          {filtered.map((account) => (
            <div
              key={account.id}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${account.name}`}
              onClick={() => { setSelectedAccount(account); setActiveTab("overview"); }}
              onKeyDown={(e) => { if (e.key === "Enter") { setSelectedAccount(account); setActiveTab("overview"); } }}
              style={cardStyle(account.priority)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${PRIORITY_COLOR[account.priority]}30`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {/* Priority Ribbon */}
              <div style={{ background: PRIORITY_COLOR[account.priority], padding: "5px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  ◆ {account.priority} PRIORITY
                </span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                  {account.callFreq}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: "16px 18px 0" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  {account.city} · {account.shortName}
                </div>
                <div style={{ fontSize: 15, color: "#E8F4F8", fontWeight: 700, lineHeight: 1.35, marginBottom: 16 }}>
                  {account.name}
                </div>

                {/* Stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {[
                    { label: "Beds", value: account.beds.toLocaleString(), color: "#60A5FA" },
                    { label: "hATTR Est.", value: `~${account.attrCandidates}`, color: "#F59E0B" },
                    { label: "Specialists", value: account.specialists.neurology + account.specialists.cardiology, color: "#00C2A8" },
                  ].map((stat) => (
                    <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                      <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Specialist detail */}
                <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                  {[
                    { label: `Neuro ×${account.specialists.neurology}`, color: "#a855f7" },
                    { label: `Cardio ×${account.specialists.cardiology}`, color: "#ef4444" },
                    { label: `IM ×${account.specialists.internal}`, color: "#60A5FA" },
                  ].map((sp) => (
                    <span key={sp.label} style={{ fontSize: 10, fontWeight: 700, color: sp.color, background: `${sp.color}18`, border: `1px solid ${sp.color}33`, borderRadius: 6, padding: "2px 8px" }}>{sp.label}</span>
                  ))}
                </div>

                {/* Formulary status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Formulary</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: FORMULARY_COLOR[account.formulary], background: `${FORMULARY_COLOR[account.formulary]}18`, border: `1px solid ${FORMULARY_COLOR[account.formulary]}33`, borderRadius: 6, padding: "2px 10px" }}>
                    {account.formulary}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedAccount && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Account detail: ${selectedAccount.name}`}
            style={{ position: "fixed", inset: 0, background: "rgba(6,13,24,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedAccount(null); }}
          >
            <div style={{ background: "#0A1628", border: `1px solid ${PRIORITY_COLOR[selectedAccount.priority]}44`, borderRadius: 20, width: "100%", maxWidth: 780, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: `0 32px 80px ${PRIORITY_COLOR[selectedAccount.priority]}22` }}>
              {/* Panel header */}
              <div style={{ background: PRIORITY_COLOR[selectedAccount.priority], padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {selectedAccount.priority} PRIORITY · {selectedAccount.city} · {selectedAccount.callFreq} calls
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginTop: 2 }}>{selectedAccount.name}</div>
                </div>
                <button
                  aria-label="Close account detail"
                  onClick={() => setSelectedAccount(null)}
                  style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  ×
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
                {(["overview", "kols", "strategy"] as DetailTab[]).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: "12px 0",
                      background: "transparent",
                      border: "none",
                      borderBottom: `2px solid ${activeTab === tab ? PRIORITY_COLOR[selectedAccount.priority] : "transparent"}`,
                      color: activeTab === tab ? PRIORITY_COLOR[selectedAccount.priority] : "rgba(255,255,255,0.5)",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif",
                      textTransform: "capitalize",
                      transition: "color 0.15s",
                    }}
                  >
                    {tab === "overview" ? "📋 Overview" : tab === "kols" ? "👥 KOL Contacts" : "🎯 Call Strategy"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
                {activeTab === "overview" && (
                  <div>
                    {/* Stats row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
                      {[
                        { label: "Beds", value: selectedAccount.beds.toLocaleString(), color: "#60A5FA" },
                        { label: "hATTR Candidates", value: `~${selectedAccount.attrCandidates}`, color: "#F59E0B" },
                        { label: "Neurologists", value: selectedAccount.specialists.neurology, color: "#a855f7" },
                        { label: "Cardiologists", value: selectedAccount.specialists.cardiology, color: "#ef4444" },
                      ].map((s) => (
                        <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                          <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: "#00C2A8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Patient Opportunity</div>
                      <p style={{ color: "#E8F4F8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{selectedAccount.overview.patientOpportunity}</p>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: "#F59E0B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Specialist Breakdown</div>
                      <p style={{ color: "#E8F4F8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{selectedAccount.overview.specialistBreakdown}</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${PRIORITY_COLOR[selectedAccount.priority]}`, borderRadius: "0 8px 8px 0", padding: "12px 16px" }}>
                      <div style={{ fontSize: 11, color: PRIORITY_COLOR[selectedAccount.priority], fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Strategic Notes</div>
                      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{selectedAccount.overview.notes}</p>
                    </div>

                    {/* Formulary status */}
                    <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${FORMULARY_COLOR[selectedAccount.formulary]}15`, border: `1px solid ${FORMULARY_COLOR[selectedAccount.formulary]}40`, borderRadius: 8, padding: "8px 14px" }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Formulary:</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: FORMULARY_COLOR[selectedAccount.formulary] }}>{selectedAccount.formulary}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px" }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Call Frequency:</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#60A5FA" }}>{selectedAccount.callFreq}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "kols" && (
                  <div>
                    {selectedAccount.kols.map((kol, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#E8F4F8", marginBottom: 2 }}>{kol.name}</div>
                            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{kol.title}</div>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: INFLUENCE_COLOR[kol.influence], background: `${INFLUENCE_COLOR[kol.influence]}18`, border: `1px solid ${INFLUENCE_COLOR[kol.influence]}33`, borderRadius: 6, padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                              {kol.influence} influence
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: RELATIONSHIP_COLOR[kol.relationship], background: `${RELATIONSHIP_COLOR[kol.relationship]}18`, border: `1px solid ${RELATIONSHIP_COLOR[kol.relationship]}33`, borderRadius: 6, padding: "3px 10px" }}>
                              {kol.relationship}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                          <span style={{ fontSize: 11, color: "#60A5FA", background: "rgba(96,165,250,0.12)", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{kol.specialty}</span>
                        </div>
                        <div style={{ background: "rgba(0,194,168,0.06)", borderLeft: "3px solid #00C2A8", borderRadius: "0 8px 8px 0", padding: "10px 14px" }}>
                          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{kol.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "strategy" && (
                  <div>
                    <div style={{ background: `${PRIORITY_COLOR[selectedAccount.priority]}12`, border: `1px solid ${PRIORITY_COLOR[selectedAccount.priority]}33`, borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
                      <div style={{ fontSize: 11, color: PRIORITY_COLOR[selectedAccount.priority], fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>💬 Opening Line</div>
                      <p style={{ color: "#E8F4F8", fontSize: 14, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{selectedAccount.strategy.openingLine}"</p>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: "#00C2A8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>🎯 Primary Message</div>
                      <p style={{ color: "#E8F4F8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{selectedAccount.strategy.primaryMessage}</p>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: "#F59E0B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>📊 Evidence Anchors</div>
                      {selectedAccount.strategy.evidenceAnchors.map((e, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                          <span style={{ color: "#F59E0B", fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>▸</span>
                          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6 }}>{e}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>⚠️ Topics to Avoid</div>
                      {selectedAccount.strategy.avoidTopics.map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                          <span style={{ color: "#ef4444", fontSize: 14, lineHeight: 1, flexShrink: 0, marginTop: 3 }}>✕</span>
                          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>{t}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>✅ Next Step</div>
                      <p style={{ color: "#E8F4F8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{selectedAccount.strategy.nextStep}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Summary Table */}
        <div>
          <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#E8F4F8", marginBottom: 20, letterSpacing: "0.05em" }}>
            📋 Account Summary Table — All 17 Accounts
          </h3>
          <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
              <thead>
                <tr style={{ background: "rgba(0,194,168,0.12)" }}>
                  {["Account", "City", "Priority", "Beds", "hATTR Est.", "Neuro", "Cardio", "Formulary", "Call Freq"].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#00C2A8", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACCOUNTS.map((a, i) => (
                  <tr
                    key={a.id}
                    onClick={() => { setSelectedAccount(a); setActiveTab("overview"); }}
                    style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(0,194,168,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)"; }}
                  >
                    <td style={{ padding: "11px 14px", color: "#E8F4F8", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{a.shortName}</td>
                    <td style={{ padding: "11px 14px", color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{a.city}</td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLOR[a.priority], background: `${PRIORITY_COLOR[a.priority]}18`, border: `1px solid ${PRIORITY_COLOR[a.priority]}33`, borderRadius: 6, padding: "2px 8px", whiteSpace: "nowrap" }}>
                        {a.priority}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px", color: "#60A5FA", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{a.beds.toLocaleString()}</td>
                    <td style={{ padding: "11px 14px", color: "#F59E0B", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>~{a.attrCandidates}</td>
                    <td style={{ padding: "11px 14px", color: "#a855f7", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{a.specialists.neurology}</td>
                    <td style={{ padding: "11px 14px", color: "#ef4444", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{a.specialists.cardiology}</td>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: FORMULARY_COLOR[a.formulary], background: `${FORMULARY_COLOR[a.formulary]}18`, borderRadius: 6, padding: "2px 8px" }}>
                        {a.formulary}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px", color: "rgba(255,255,255,0.55)", borderBottom: "1px solid rgba(255,255,255,0.05)", whiteSpace: "nowrap" }}>{a.callFreq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
