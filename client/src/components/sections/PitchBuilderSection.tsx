/**
 * PitchBuilderSection.tsx
 * Design: Clinical Precision / Swiss Medical Modernism
 * — Deep navy (#0D1B3E) base, teal (#00C2A8) accent, gold (#F0A500) highlight
 * — DM Serif Display headings, DM Sans body
 * — 3-step wizard: Physician Archetype → Clinical Scenario → Key Message
 * — Script generation engine assembles tailored 2-min call script
 * — Copy to clipboard, print view, and script history (localStorage)
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Stethoscope,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  RefreshCw,
  Printer,
  Lightbulb,
  AlertCircle,
  TrendingUp,
  Shield,
  DollarSign,
  Zap,
  PlayCircle,
} from "lucide-react";
import RolePlayMode from "./RolePlayMode";

// ─── Data Types ───────────────────────────────────────────────────────────────

interface PhysicianArchetype {
  id: string;
  name: string;
  specialty: string;
  profile: string;
  painPoints: string[];
  tone: string;
  icon: string;
  color: string;
}

interface ClinicalScenario {
  id: string;
  title: string;
  description: string;
  patientProfile: string;
  indication: "ATTR-CM" | "hATTR-PN" | "Both";
  indicationColor: string;
}

interface KeyMessage {
  id: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  dataPoint: string;
}

interface GeneratedScript {
  opening: string;
  bridge: string;
  evidence: string;
  objectionHandle: string;
  close: string;
  talkingPoints: string[];
  avoidSaying: string[];
  followUp: string;
}

// ─── Physician Archetypes ─────────────────────────────────────────────────────

const ARCHETYPES: PhysicianArchetype[] = [
  {
    id: "skeptical-cardiologist",
    name: "The Sceptical Cardiologist",
    specialty: "Cardiology",
    profile:
      "High-volume cardiologist, 20+ years experience. Tafamidis prescriber. Cautious about new therapies. Wants robust long-term data before changing practice. Responds to head-to-head comparisons and mortality data.",
    painPoints: [
      "Patients progressing on tafamidis",
      "Concerns about long-term RNAi safety",
      "Unfamiliar with injection logistics",
    ],
    tone: "Evidence-first, peer-to-peer, no hype",
    icon: "🫀",
    color: "#C0392B",
  },
  {
    id: "early-adopter-neurologist",
    name: "The Early Adopter Neurologist",
    specialty: "Neurology",
    profile:
      "Academic neurologist, hATTR-PN specialist. Already prescribing patisiran. Open to innovation. Wants to understand the clinical differentiation vs. existing RNAi therapy. Interested in patient convenience and QoL.",
    painPoints: [
      "Patisiran infusion burden for patients",
      "Patients missing doses due to travel",
      "Wants simpler administration",
    ],
    tone: "Collegial, innovation-focused, convenience-led",
    icon: "🧠",
    color: "#8E44AD",
  },
  {
    id: "busy-internist",
    name: "The Busy Internist",
    specialty: "Internal Medicine",
    profile:
      "Community internist managing complex multi-morbid patients. Limited time per visit. Unfamiliar with ATTR diagnosis. Needs simple, actionable guidance. Responds to red flag checklists and referral pathways.",
    painPoints: [
      "Doesn't know how to screen for ATTR",
      "Overwhelmed by rare disease complexity",
      "Needs a simple referral trigger",
    ],
    tone: "Simple, practical, action-oriented",
    icon: "🩺",
    color: "#27AE60",
  },
  {
    id: "cost-conscious-hematologist",
    name: "The Cost-Conscious Haematologist",
    specialty: "Haematology",
    profile:
      "Haematologist managing hereditary ATTR patients. Focused on value-based care. Concerned about drug costs and formulary access. Wants to understand the economic argument and patient support programs.",
    painPoints: [
      "High drug acquisition cost",
      "Prior authorisation burden",
      "Formulary tier restrictions",
    ],
    tone: "Value-focused, pragmatic, access-aware",
    icon: "💊",
    color: "#E67E22",
  },
  {
    id: "rare-disease-specialist",
    name: "The Rare Disease Champion",
    specialty: "Rare Disease / Genetics",
    profile:
      "Geneticist or rare disease specialist managing hereditary ATTR families. Highly knowledgeable about the disease. Interested in genetic counselling, family screening, and the full treatment landscape. Wants the deepest clinical detail.",
    painPoints: [
      "Managing asymptomatic V30M family members",
      "Navigating genetic testing logistics",
      "Comparing all available TTR therapies",
    ],
    tone: "Deep science, comprehensive, peer-level",
    icon: "🔬",
    color: "#1A3A6B",
  },
];

// ─── Clinical Scenarios ───────────────────────────────────────────────────────

const SCENARIOS: ClinicalScenario[] = [
  {
    id: "new-diagnosis-attr-cm",
    title: "Newly Diagnosed wt-ATTR-CM",
    description:
      "Patient just confirmed wt-ATTR-CM via Tc-PYP scan. No prior ATTR therapy. NYHA Class II. Physician deciding on first-line treatment.",
    patientProfile: "68M, wt-ATTR-CM, NYHA II, treatment-naive",
    indication: "ATTR-CM",
    indicationColor: "#E67E22",
  },
  {
    id: "progressing-on-tafamidis",
    title: "Progressing on Tafamidis",
    description:
      "Patient on tafamidis 12+ months. NT-proBNP improving but LVEF declining and 6MWT dropping. Physician considering escalation.",
    patientProfile: "62M, wt-ATTR-CM, on tafamidis 12 months, partial response",
    indication: "ATTR-CM",
    indicationColor: "#E67E22",
  },
  {
    id: "hattr-pn-patisiran",
    title: "hATTR-PN on Patisiran — Considering Switch",
    description:
      "Patient with hATTR-PN (V30M) on patisiran. Stable but finds 3-weekly IV infusions burdensome. Physician exploring simpler alternatives.",
    patientProfile: "55F, hATTR-PN V30M, Stage 1, on patisiran 18 months",
    indication: "hATTR-PN",
    indicationColor: "#8E44AD",
  },
  {
    id: "new-diagnosis-hattr-pn",
    title: "Newly Diagnosed hATTR-PN",
    description:
      "Patient with confirmed hATTR-PN, Stage 1 neuropathy. Treatment-naive. Physician choosing between available RNAi and ASO therapies.",
    patientProfile: "58M, hATTR-PN V122I, Stage 1, treatment-naive",
    indication: "hATTR-PN",
    indicationColor: "#8E44AD",
  },
  {
    id: "dual-indication",
    title: "Dual Indication — CM + PN Overlap",
    description:
      "Patient with both ATTR-CM and hATTR-PN features. Physician needs a single therapy covering both indications.",
    patientProfile: "70M, hATTR with CM + PN overlap, treatment-naive",
    indication: "Both",
    indicationColor: "#00C2A8",
  },
  {
    id: "screening-referral",
    title: "Undiagnosed — Referral Trigger",
    description:
      "Patient with HFpEF + bilateral CTS + low-voltage ECG. Physician hasn't considered ATTR. Needs to be guided to order Tc-PYP scan.",
    patientProfile: "75M, HFpEF, bilateral CTS, low-voltage ECG — undiagnosed",
    indication: "ATTR-CM",
    indicationColor: "#E67E22",
  },
];

// ─── Key Messages ─────────────────────────────────────────────────────────────

const KEY_MESSAGES: KeyMessage[] = [
  {
    id: "mortality",
    title: "Mortality Reduction",
    tagline: "35% reduction in all-cause mortality",
    icon: <TrendingUp size={18} />,
    color: "#C0392B",
    dataPoint: "HR 0.65, P=0.01 — HELIOS-B, 42 months, N=655",
  },
  {
    id: "cv-outcomes",
    title: "CV Composite Benefit",
    tagline: "28% reduction in CV death + urgent hospitalisation",
    icon: <Shield size={18} />,
    color: "#E67E22",
    dataPoint: "HR 0.72, P=0.01 — HELIOS-B primary endpoint",
  },
  {
    id: "convenience",
    title: "Unmatched Convenience",
    tagline: "4 injections/year vs. 26 infusions/year",
    icon: <Zap size={18} />,
    color: "#00C2A8",
    dataPoint: "25 mg SC Q3M — no premedication, no REMS, no infusion centre",
  },
  {
    id: "dual-approval",
    title: "Dual FDA Approval",
    tagline: "Only therapy approved for both ATTR-CM and hATTR-PN",
    icon: <Lightbulb size={18} />,
    color: "#F0A500",
    dataPoint: "ATTR-CM: FDA March 2025 | hATTR-PN: FDA June 2022",
  },
  {
    id: "ttr-suppression",
    title: "Source Silencing",
    tagline: "88% TTR suppression — silence the source, not just stabilise",
    icon: <Zap size={18} />,
    color: "#1A3A6B",
    dataPoint: "Steady-state serum TTR reduction vs. tafamidis stabilisation",
  },
  {
    id: "access",
    title: "Access & Support",
    tagline: "Alnylam Assist® — co-pay support, PA navigation, nurse support",
    icon: <DollarSign size={18} />,
    color: "#27AE60",
    dataPoint: "$0 co-pay for eligible commercially insured patients",
  },
];

// ─── Script Generation Engine ─────────────────────────────────────────────────

function generateScript(
  archetype: PhysicianArchetype,
  scenario: ClinicalScenario,
  message: KeyMessage
): GeneratedScript {
  // Opening — tailored by archetype tone
  const openings: Record<string, string> = {
    "skeptical-cardiologist": `Dr. [Name], I know you're seeing a lot of ATTR-CM patients on tafamidis — and I wanted to share something from HELIOS-B that directly addresses the question of what to do when patients are partially responding. The trial enrolled ${scenario.indication === "ATTR-CM" ? "655 patients with ATTR-CM" : "patients with hATTR-PN"}, and about 50% were already on tafamidis at baseline. The results were consistent across both groups.`,
    "early-adopter-neurologist": `Dr. [Name], you're already familiar with the RNAi mechanism from patisiran — so I'll get straight to the differentiation. AMVUTTRA uses the same GalNAc-siRNA platform but delivers it subcutaneously, once every 3 months. No infusion centre, no premedication, no REMS. For your hATTR-PN patients who are travelling or struggling with the infusion schedule, this changes the conversation.`,
    "busy-internist": `Dr. [Name], I'll keep this brief — I know you're busy. Three findings in one patient should make you think ATTR: HFpEF that doesn't respond to diuretics, bilateral carpal tunnel syndrome, and low-voltage on ECG. If you see that combination, a single Tc-PYP scan can confirm ATTR-CM without a biopsy. I can help you set up the referral pathway.`,
    "cost-conscious-hematologist": `Dr. [Name], I understand cost and access are top of mind for your patients. AMVUTTRA has a dedicated patient support program — Alnylam Assist® — that includes $0 co-pay for eligible commercially insured patients, prior authorisation support, and a nurse navigator. I also want to share the value argument: 4 injections per year versus 26 infusions per year — the administration cost difference is significant.`,
    "rare-disease-specialist": `Dr. [Name], I want to walk you through the full AMVUTTRA data package — HELIOS-A for hATTR-PN and HELIOS-B for ATTR-CM — because I think the story across both indications is compelling, and it's the only therapy with FDA approval for both. I also want to discuss the tafamidis subgroup data from HELIOS-B, which is directly relevant to your patients who are already on stabiliser therapy.`,
  };

  // Bridge — connects opening to the scenario
  const bridges: Record<string, string> = {
    "new-diagnosis-attr-cm": `For a newly diagnosed wt-ATTR-CM patient like the one you're describing — NYHA Class II, no prior therapy — AMVUTTRA is now a first-line option following the FDA approval in March 2025. The HELIOS-B data gives you a clear picture of what to expect.`,
    "progressing-on-tafamidis": `For a patient who's been on tafamidis for over a year and you're seeing the NT-proBNP improve but the LVEF and 6MWT declining — that's the partial response pattern. The HELIOS-B tafamidis subgroup data is exactly what you need here.`,
    "hattr-pn-patisiran": `For a patient on patisiran who's stable but finding the 3-weekly infusions burdensome — AMVUTTRA offers the same RNAi mechanism, the same TTR silencing, but delivered as a subcutaneous injection once every 3 months. The HELIOS-A data shows comparable efficacy.`,
    "new-diagnosis-hattr-pn": `For a newly diagnosed hATTR-PN patient at Stage 1 — this is the window where early intervention has the greatest impact. The HELIOS-A data showed that patients who started vutrisiran earlier had better NIS+7 outcomes at 9 months.`,
    "dual-indication": `For a patient with both CM and PN features — AMVUTTRA is the only FDA-approved therapy covering both indications. You don't need to choose between treating the heart and treating the nerves.`,
    "screening-referral": `The combination you're describing — HFpEF, bilateral CTS, low-voltage ECG — is the classic ATTR triad. A Tc-PYP scan is non-invasive, widely available, and can confirm ATTR-CM without a biopsy in most cases. I'd recommend referring to a specialist who can order the scan and interpret the results.`,
  };

  // Evidence block — tailored by key message
  const evidenceBlocks: Record<string, string> = {
    mortality: `The headline number from HELIOS-B is a 35% reduction in all-cause mortality — HR 0.65, P=0.01, over 42 months in 655 patients. That's a mortality benefit that tafamidis, in ATTR-ACT, did not achieve as a primary endpoint. For your patients who are asking 'will this drug help me live longer?' — AMVUTTRA is the first ATTR-CM therapy where you can say yes with Level 1 evidence.`,
    "cv-outcomes": `The primary endpoint of HELIOS-B was the CV composite — CV death plus urgent CV hospitalisation. AMVUTTRA reduced that by 28%, HR 0.72, P=0.01. That's a clinically meaningful reduction in the events that drive hospitalisation costs and patient deterioration. And the benefit was consistent whether or not patients were already on tafamidis.`,
    convenience: `The administration story is simple: 4 subcutaneous injections per year. No infusion centre, no premedication, no REMS program. Compare that to patisiran — 26 IV infusions per year with 3-hour infusion time and mandatory premedication. For patients who are working, travelling, or simply want to minimise their medical footprint, this is a meaningful quality-of-life difference.`,
    "dual-approval": `AMVUTTRA is the only therapy with FDA approval for both ATTR-CM (March 2025) and hATTR-PN (June 2022). For patients with overlap features — or for a practice that sees both phenotypes — you have a single agent that covers the full ATTR spectrum. No other therapy in the class has this breadth of approval.`,
    "ttr-suppression": `The mechanism matters here. Tafamidis stabilises existing TTR tetramers — it slows the rate of amyloid formation but doesn't reduce TTR production. AMVUTTRA silences TTR at the mRNA level, achieving ~88% suppression of serum TTR at steady state. That's not stabilisation — that's elimination of the raw material for amyloid. The clinical consequence: HELIOS-B OLE data shows functional improvement over time, not just stabilisation.`,
    access: `I want to make sure access isn't a barrier. Alnylam Assist® provides $0 co-pay for eligible commercially insured patients, a dedicated PA navigator who handles the prior authorisation process, and a nurse coordinator who supports the patient through the first injection and ongoing monitoring. The programme also includes vitamin A supplementation guidance and ophthalmology referral coordination.`,
  };

  // Objection handle — archetype-specific
  const objectionHandles: Record<string, string> = {
    "skeptical-cardiologist": `I understand the hesitation — tafamidis has been your go-to for years and the ATTR-ACT data is solid. The key question is: what do you do when a patient is partially responding? The HELIOS-B tafamidis subgroup gives you the answer — consistent benefit on top of tafamidis, or as a replacement. The mortality data is what changes the calculus for me.`,
    "early-adopter-neurologist": `The transition from patisiran is seamless — same mechanism, no washout needed. You can switch on the day of the next scheduled patisiran infusion. The NIS+7 data from HELIOS-A is comparable to HELIOS-B, and the convenience improvement is immediate. Your patients will notice the difference within the first quarter.`,
    "busy-internist": `I know ATTR feels complex, but the screening step is simple: if you see the triad — HFpEF, bilateral CTS, low-voltage ECG — order a Tc-PYP scan and refer. You don't need to manage the diagnosis yourself. I can provide you with a one-page referral guide and connect you with the nearest ATTR specialist.`,
    "cost-conscious-hematologist": `The co-pay support through Alnylam Assist® covers most commercially insured patients at $0 out-of-pocket. For Medicare patients, there's a separate support pathway. The PA navigator handles the prior authorisation — your office doesn't need to manage that process. And the administration cost argument is real: 4 SC injections per year versus 26 IV infusions has a measurable impact on total cost of care.`,
    "rare-disease-specialist": `For the asymptomatic V30M family members — AMVUTTRA is not currently approved for pre-symptomatic use, but the HELIOS-A data on early-stage patients is compelling. The NIS+7 benefit at Stage 1 is greater than at Stage 2, which supports early initiation once symptoms appear. For genetic counselling, I can provide the Alnylam hereditary ATTR family screening programme materials.`,
  };

  // Close — action-oriented
  const closes: Record<string, string> = {
    "skeptical-cardiologist": `Would it be useful to review the HELIOS-B tafamidis subgroup forest plot together? I have the full supplementary data. And I can arrange a peer-to-peer call with a cardiologist who's been prescribing AMVUTTRA since the ATTR-CM approval — sometimes it's easier to hear it from a colleague.`,
    "early-adopter-neurologist": `Can we identify one or two of your patisiran patients who might benefit from the switch? I can support the transition with the Alnylam Assist® team and make sure the first injection is coordinated smoothly. What does your schedule look like for a follow-up visit next week?`,
    "busy-internist": `Let me leave you with a one-page ATTR screening checklist — three questions, one referral trigger. If you see the triad, you order the scan. I'll also send you the contact for the nearest ATTR specialist who can take the referral. Can I follow up with you in two weeks to see if any patients have come to mind?`,
    "cost-conscious-hematologist": `I'd like to connect you with our Alnylam Assist® access specialist — they can walk through the specific formulary status and PA requirements for your payer mix. Can I arrange a 15-minute call this week? I'll also send you the health economics brief from HELIOS-B.`,
    "rare-disease-specialist": `I'd like to schedule a deeper scientific exchange — I can bring the full HELIOS-A and HELIOS-B data packages, including the OLE data presented at ESC 2025. Would a lunch meeting work, or would you prefer a virtual session? I can also arrange a call with the Alnylam medical affairs team if you have specific mechanistic questions.`,
  };

  // Talking points — scenario + message specific
  const talkingPointsMap: Record<string, string[]> = {
    "new-diagnosis-attr-cm": [
      "HELIOS-B: 28% CV composite reduction, 35% all-cause mortality reduction",
      "FDA approved March 2025 for ATTR-CM — first RNAi approval in this indication",
      "25 mg SC Q3M — 4 injections/year, no premedication, no REMS",
      "~88% TTR suppression at steady state vs. tafamidis stabilisation",
      "Alnylam Assist® — $0 co-pay for eligible commercially insured patients",
    ],
    "progressing-on-tafamidis": [
      "HELIOS-B tafamidis subgroup: consistent CV and mortality benefit regardless of baseline tafamidis use",
      "Partial response pattern: NT-proBNP improving but LVEF/6MWT declining = ongoing amyloid deposition",
      "Switch: discontinue tafamidis on day of first AMVUTTRA injection — no taper, no washout",
      "Switch multivitamin to RDA-level vitamin A (≤900 mcg/day men) before starting",
      "HELIOS-B OLE: functional improvement over 42+ months — not just stabilisation",
    ],
    "hattr-pn-patisiran": [
      "HELIOS-A: NIS+7 improvement of −2.2 points vs. +14.8 placebo at 9 months",
      "Switch from patisiran: seamless — no washout, switch on day of next scheduled infusion",
      "4 SC injections/year vs. 26 IV infusions/year — no infusion centre, no premedication",
      "Same GalNAc-siRNA mechanism as patisiran — no new safety signals expected",
      "HELIOS-A OLE: sustained NIS+7 benefit at 24 months",
    ],
    "new-diagnosis-hattr-pn": [
      "HELIOS-A: NIS+7 −2.2 vs. +14.8 placebo — 17-point difference at 9 months",
      "Early initiation (Stage 1) associated with better outcomes than Stage 2",
      "FDA approved June 2022 for hATTR-PN — established 4-year safety record",
      "25 mg SC Q3M — no REMS, no premedication, no infusion centre",
      "Supplement vitamin A at RDA — ophthalmology referral at baseline",
    ],
    "dual-indication": [
      "Only FDA-approved therapy for both ATTR-CM (March 2025) and hATTR-PN (June 2022)",
      "Single agent covers both phenotypes — no need to choose between cardiac and neurological treatment",
      "HELIOS-B (ATTR-CM): HR 0.72 CV composite, HR 0.65 all-cause mortality",
      "HELIOS-A (hATTR-PN): NIS+7 −2.2 vs. +14.8 placebo",
      "25 mg SC Q3M — same dose, same schedule for both indications",
    ],
    "screening-referral": [
      "ATTR triad: HFpEF + bilateral CTS + low-voltage ECG = order Tc-PYP scan",
      "Tc-PYP Grade 2–3 + negative haematologic workup = non-biopsy diagnosis of wt-ATTR-CM",
      "ATTR-CM prevalence: 1 in 20 HFpEF patients over age 60 — significantly underdiagnosed",
      "Early diagnosis = better treatment outcomes — HELIOS-B OLE shows early-start benefit",
      "Referral pathway: Tc-PYP → haematologic workup → ATTR specialist → AMVUTTRA initiation",
    ],
  };

  // Avoid saying — archetype-specific
  const avoidSayingMap: Record<string, string[]> = {
    "skeptical-cardiologist": [
      "\"This is a game-changer\" — let the data speak",
      "\"Tafamidis is inferior\" — it's complementary, not inferior",
      "\"You should switch all your patients\" — be specific about the partial response population",
    ],
    "early-adopter-neurologist": [
      "\"Patisiran doesn't work\" — it works well; this is about convenience",
      "\"AMVUTTRA is better\" — say \"more convenient\" and let them draw conclusions",
      "\"The switch is complicated\" — it's seamless; don't create doubt",
    ],
    "busy-internist": [
      "\"TTR amyloidosis\" without explaining it simply",
      "\"GalNAc-siRNA\" — too technical for this audience",
      "\"You need to manage this yourself\" — offer the referral pathway",
    ],
    "cost-conscious-hematologist": [
      "\"Cost shouldn't be a concern\" — acknowledge it directly",
      "\"The drug pays for itself\" — use health economics data, not platitudes",
      "\"It's covered\" without knowing their specific formulary status",
    ],
    "rare-disease-specialist": [
      "\"As you probably know...\" — they do know; be peer-level",
      "\"Simple mechanism\" — they want depth",
      "\"Just 4 injections\" — they care about mechanism, not just convenience",
    ],
  };

  // Follow-up action
  const followUps: Record<string, string> = {
    "skeptical-cardiologist":
      "Send HELIOS-B tafamidis subgroup forest plot + ATTR-CM prescribing information. Arrange peer-to-peer call within 2 weeks.",
    "early-adopter-neurologist":
      "Identify 1–2 patisiran patients for switch. Send HELIOS-A vs. HELIOS-A OLE comparison. Schedule follow-up in 1 week.",
    "busy-internist":
      "Leave ATTR screening checklist (1 page). Send referral pathway document. Follow up in 2 weeks.",
    "cost-conscious-hematologist":
      "Connect with Alnylam Assist® access specialist. Send health economics brief. Schedule 15-min access call.",
    "rare-disease-specialist":
      "Schedule scientific exchange lunch/virtual. Send full HELIOS-A + HELIOS-B data packages including OLE. Offer medical affairs call.",
  };

  return {
    opening: openings[archetype.id] || openings["skeptical-cardiologist"],
    bridge: bridges[scenario.id] || bridges["new-diagnosis-attr-cm"],
    evidence: evidenceBlocks[message.id] || evidenceBlocks["mortality"],
    objectionHandle:
      objectionHandles[archetype.id] || objectionHandles["skeptical-cardiologist"],
    close: closes[archetype.id] || closes["skeptical-cardiologist"],
    talkingPoints:
      talkingPointsMap[scenario.id] || talkingPointsMap["new-diagnosis-attr-cm"],
    avoidSaying: avoidSayingMap[archetype.id] || avoidSayingMap["skeptical-cardiologist"],
    followUp: followUps[archetype.id] || followUps["skeptical-cardiologist"],
  };
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({
  step,
  currentStep,
  label,
  icon,
}: {
  step: number;
  currentStep: number;
  label: string;
  icon: React.ReactNode;
}) {
  const isComplete = currentStep > step;
  const isActive = currentStep === step;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          isComplete
            ? "bg-[#00C2A8] text-white"
            : isActive
            ? "bg-[#1A3A6B] border-2 border-[#00C2A8] text-[#00C2A8]"
            : "bg-[#0D1B3E] border border-white/20 text-white/40"
        }`}
      >
        {isComplete ? <Check size={16} /> : icon}
      </div>
      <span
        className={`text-xs font-medium transition-colors duration-300 ${
          isActive ? "text-[#00C2A8]" : isComplete ? "text-white/70" : "text-white/30"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Script Display ───────────────────────────────────────────────────────────

function ScriptDisplay({
  script,
  archetype,
  scenario,
  message,
  onReset,
}: {
  script: GeneratedScript;
  archetype: PhysicianArchetype;
  scenario: ClinicalScenario;
  message: KeyMessage;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const fullScript = `AMVUTTRA CALL SCRIPT
Physician: ${archetype.name} (${archetype.specialty})
Scenario: ${scenario.title}
Key Message: ${message.title}
Generated: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPENING (0:00–0:30)
${script.opening}

BRIDGE (0:30–1:00)
${script.bridge}

EVIDENCE (1:00–1:30)
${script.evidence}

OBJECTION HANDLE (if needed)
${script.objectionHandle}

CLOSE (1:30–2:00)
${script.close}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY TALKING POINTS
${script.talkingPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

AVOID SAYING
${script.avoidSaying.map((a) => `• ${a}`).join("\n")}

FOLLOW-UP ACTION
${script.followUp}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>AMVUTTRA Call Script</title>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #1a1a2e; line-height: 1.6; }
        h1 { color: #1A3A6B; font-size: 20px; border-bottom: 2px solid #00C2A8; padding-bottom: 8px; }
        h2 { color: #1A3A6B; font-size: 14px; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .meta { background: #f5f7fa; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; }
        .section { margin-bottom: 16px; padding: 12px; border-left: 3px solid #00C2A8; background: #f9fafb; }
        .avoid { border-left-color: #C0392B; background: #fff5f5; }
        .followup { border-left-color: #F0A500; background: #fffbf0; }
        ul { margin: 8px 0; padding-left: 20px; }
        li { margin-bottom: 4px; font-size: 13px; }
        p { font-size: 13px; margin: 0; }
        @media print { body { margin: 20px; } }
      </style></head><body>
      <h1>AMVUTTRA® Call Script</h1>
      <div class="meta">
        <strong>Physician:</strong> ${archetype.name} (${archetype.specialty})<br>
        <strong>Scenario:</strong> ${scenario.title}<br>
        <strong>Key Message:</strong> ${message.title}<br>
        <strong>Generated:</strong> ${new Date().toLocaleDateString()}
      </div>
      <h2>Opening (0:00–0:30)</h2>
      <div class="section"><p>${script.opening}</p></div>
      <h2>Bridge (0:30–1:00)</h2>
      <div class="section"><p>${script.bridge}</p></div>
      <h2>Evidence (1:00–1:30)</h2>
      <div class="section"><p>${script.evidence}</p></div>
      <h2>Objection Handle</h2>
      <div class="section"><p>${script.objectionHandle}</p></div>
      <h2>Close (1:30–2:00)</h2>
      <div class="section"><p>${script.close}</p></div>
      <h2>Key Talking Points</h2>
      <ul>${script.talkingPoints.map((p) => `<li>${p}</li>`).join("")}</ul>
      <h2>Avoid Saying</h2>
      <div class="section avoid"><ul>${script.avoidSaying.map((a) => `<li>${a}</li>`).join("")}</ul></div>
      <h2>Follow-Up Action</h2>
      <div class="section followup"><p>${script.followUp}</p></div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const sections = [
    { label: "Opening", time: "0:00–0:30", content: script.opening, color: "#1A3A6B" },
    { label: "Bridge", time: "0:30–1:00", content: script.bridge, color: "#27AE60" },
    { label: "Evidence", time: "1:00–1:30", content: script.evidence, color: "#E67E22" },
    { label: "Objection Handle", time: "if needed", content: script.objectionHandle, color: "#8E44AD" },
    { label: "Close", time: "1:30–2:00", content: script.close, color: "#00C2A8" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{archetype.icon}</span>
            <h3 className="text-lg font-bold text-white">{archetype.name}</h3>
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: scenario.indicationColor + "33", color: scenario.indicationColor }}
            >
              {scenario.indication}
            </span>
          </div>
          <p className="text-white/50 text-sm">{scenario.title} · {message.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: copied ? "#00C2A833" : "#1A3A6B", color: copied ? "#00C2A8" : "white" }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy Script"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#1A3A6B] text-white hover:bg-[#243d6e] transition-all"
          >
            <Printer size={14} />
            Print
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all"
          >
            <RefreshCw size={14} />
            New Script
          </button>
        </div>
      </div>

      {/* Script sections */}
      <div className="grid gap-3">
        {sections.map((section, idx) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="rounded-xl p-4 border border-white/10"
            style={{ background: section.color + "11", borderLeftColor: section.color, borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: section.color }}>
                {section.label}
              </span>
              <span className="text-xs text-white/30 font-mono">{section.time}</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>

      {/* Talking points + Avoid saying */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 bg-[#00C2A8]/10 border border-[#00C2A8]/20">
          <h4 className="text-[#00C2A8] text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Check size={12} /> Key Talking Points
          </h4>
          <ul className="space-y-2">
            {script.talkingPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <span className="text-[#00C2A8] font-bold mt-0.5 shrink-0">{i + 1}.</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl p-4 bg-[#C0392B]/10 border border-[#C0392B]/20">
          <h4 className="text-[#C0392B] text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertCircle size={12} /> Avoid Saying
          </h4>
          <ul className="space-y-2">
            {script.avoidSaying.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <span className="text-[#C0392B] shrink-0 mt-0.5">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Follow-up */}
      <div className="rounded-xl p-4 bg-[#F0A500]/10 border border-[#F0A500]/20">
        <h4 className="text-[#F0A500] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ChevronRight size={12} /> Follow-Up Action
        </h4>
        <p className="text-white/70 text-sm">{script.followUp}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PitchBuilderSection() {
  const [step, setStep] = useState(1);
  const [selectedArchetype, setSelectedArchetype] = useState<PhysicianArchetype | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ClinicalScenario | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<KeyMessage | null>(null);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [rolePlayActive, setRolePlayActive] = useState(false);

  const handleGenerateScript = useCallback(() => {
    if (!selectedArchetype || !selectedScenario || !selectedMessage) return;
    const script = generateScript(selectedArchetype, selectedScenario, selectedMessage);
    setGeneratedScript(script);
    setStep(4);
  }, [selectedArchetype, selectedScenario, selectedMessage]);

  const handleReset = () => {
    setStep(1);
    setSelectedArchetype(null);
    setSelectedScenario(null);
    setSelectedMessage(null);
    setGeneratedScript(null);
    setRolePlayActive(false);
  };

  return (
    <section id="pitch" className="py-20 bg-[#060E24]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-12">
          <div className="w-12 h-0.5 bg-[#00C2A8] mb-4" />
          <h2
            className="text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Role-Play
          </h2>
          <p className="text-white/50 text-lg">
            3-step wizard to generate a tailored 2-minute HCP call script, then practice it in live role-play
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0A500]/15 border border-[#F0A500]/30">
            <Lightbulb size={13} className="text-[#F0A500]" />
            <span className="text-[#F0A500] text-xs font-medium">
              Select physician type → clinical scenario → key message → get your script
            </span>
          </div>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-4 mb-10">
            <StepIndicator step={1} currentStep={step} label="Physician" icon={<User size={16} />} />
            <div className={`h-0.5 w-16 transition-colors duration-300 ${step > 1 ? "bg-[#00C2A8]" : "bg-white/10"}`} />
            <StepIndicator step={2} currentStep={step} label="Scenario" icon={<Stethoscope size={16} />} />
            <div className={`h-0.5 w-16 transition-colors duration-300 ${step > 2 ? "bg-[#00C2A8]" : "bg-white/10"}`} />
            <StepIndicator step={3} currentStep={step} label="Message" icon={<MessageSquare size={16} />} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Step 1: Physician Archetype ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">
                Step 1 — Who are you calling on?
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ARCHETYPES.map((archetype) => (
                  <motion.button
                    key={archetype.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedArchetype(archetype);
                      setStep(2);
                    }}
                    className="text-left p-5 rounded-xl border transition-all duration-200 hover:border-[#00C2A8]/50 group"
                    style={{
                      background: archetype.color + "11",
                      borderColor: archetype.color + "33",
                    }}
                  >
                    <div className="text-3xl mb-3">{archetype.icon}</div>
                    <div className="font-bold text-white text-sm mb-0.5">{archetype.name}</div>
                    <div
                      className="text-xs font-medium mb-2"
                      style={{ color: archetype.color }}
                    >
                      {archetype.specialty}
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
                      {archetype.profile}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-[#00C2A8] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Select <ChevronRight size={12} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Clinical Scenario ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  <ChevronLeft size={14} /> Back
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="text-lg">{selectedArchetype?.icon}</span>
                  <span className="text-white/60 text-xs">{selectedArchetype?.name}</span>
                </div>
              </div>
              <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">
                Step 2 — What is the clinical scenario?
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {SCENARIOS.map((scenario) => (
                  <motion.button
                    key={scenario.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setSelectedScenario(scenario);
                      setStep(3);
                    }}
                    className="text-left p-5 rounded-xl border border-white/10 hover:border-[#00C2A8]/40 bg-white/5 hover:bg-white/8 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-white text-sm">{scenario.title}</span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded shrink-0"
                        style={{
                          background: scenario.indicationColor + "22",
                          color: scenario.indicationColor,
                        }}
                      >
                        {scenario.indication}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed mb-2">
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C2A8]" />
                      <span className="text-white/40 text-xs font-mono">{scenario.patientProfile}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[#00C2A8] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Select <ChevronRight size={12} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Key Message ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  <ChevronLeft size={14} /> Back
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="text-lg">{selectedArchetype?.icon}</span>
                    <span className="text-white/60 text-xs">{selectedArchetype?.name}</span>
                  </div>
                  <ChevronRight size={12} className="text-white/30" />
                  <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="text-white/60 text-xs">{selectedScenario?.title}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">
                Step 3 — What is your primary key message?
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {KEY_MESSAGES.map((msg) => (
                  <motion.button
                    key={msg.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedMessage(msg);
                      handleGenerateScript();
                    }}
                    className="text-left p-5 rounded-xl border transition-all duration-200 group"
                    style={{
                      background: msg.color + "11",
                      borderColor: msg.color + "33",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: msg.color + "22", color: msg.color }}
                    >
                      {msg.icon}
                    </div>
                    <div className="font-bold text-white text-sm mb-1">{msg.title}</div>
                    <p className="text-white/60 text-xs mb-2 leading-relaxed">{msg.tagline}</p>
                    <p className="text-white/30 text-xs font-mono leading-relaxed">{msg.dataPoint}</p>
                    <div className="mt-3 flex items-center gap-1 text-[#00C2A8] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Generate Script <ChevronRight size={12} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Generated Script ── */}
          {step === 4 && generatedScript && selectedArchetype && selectedScenario && selectedMessage && !rolePlayActive && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00C2A8] animate-pulse" />
                  <span className="text-[#00C2A8] text-sm font-medium">Script Generated</span>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-white/40 text-xs">Tailored for {selectedArchetype.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 40px #00C2A855" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRolePlayActive(true)}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #00C2A8 0%, #0093C4 100%)",
                    border: "2px solid #00C2A8",
                    color: "#ffffff",
                    boxShadow: "0 0 32px #00C2A844",
                    letterSpacing: "0.02em",
                  }}
                >
                  <PlayCircle size={22} />
                  Practice This Script — Role-Play Mode
                </motion.button>
              </div>
              <ScriptDisplay
                script={generatedScript}
                archetype={selectedArchetype}
                scenario={selectedScenario}
                message={selectedMessage}
                onReset={handleReset}
              />
            </motion.div>
          )}

          {/* ── Step 5: Role-Play Mode ── */}
          {step === 4 && rolePlayActive && selectedArchetype && selectedScenario && (
            <motion.div
              key="step5-roleplay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Role-play header */}
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRolePlayActive(false)}
                    className="flex items-center gap-1 text-white/40 hover:text-white/70 text-sm transition-colors"
                  >
                    <ChevronLeft size={14} /> Back to Script
                  </button>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F0A500] animate-pulse" />
                    <span className="text-[#F0A500] text-sm font-bold">Role-Play Mode</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0A500]/10 border border-[#F0A500]/20">
                  <PlayCircle size={12} className="text-[#F0A500]" />
                  <span className="text-[#F0A500] text-xs font-medium">5 exchanges · Scored simulation</span>
                </div>
              </div>

              {/* Intro card */}
              <div className="rounded-xl p-5 mb-6 border border-[#00C2A8]/20" style={{ background: "#00C2A811" }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00C2A8]/20 flex items-center justify-center shrink-0">
                    <PlayCircle size={18} className="text-[#00C2A8]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">How Role-Play Mode Works</h4>
                    <p className="text-white/50 text-xs leading-relaxed">
                      The physician will deliver <strong className="text-white/70">5 realistic statements or objections</strong> based on your selected archetype and scenario.
                      For each one, choose the best response from 4 options. You'll receive immediate coaching feedback and a final performance score.
                      Use this to practise before your next call.
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <span className="w-2 h-2 rounded-full bg-[#27AE60]" /> Excellent = 3 pts
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <span className="w-2 h-2 rounded-full bg-[#3498DB]" /> Good = 1 pt
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <span className="w-2 h-2 rounded-full bg-[#E67E22]" /> Poor = 0 pts
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <span className="w-2 h-2 rounded-full bg-[#C0392B]" /> Incorrect = −1 pt
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <RolePlayMode
                archetype={{
                  id: selectedArchetype.id,
                  name: selectedArchetype.name,
                  specialty: selectedArchetype.specialty,
                  icon: selectedArchetype.icon,
                  color: selectedArchetype.color,
                }}
                scenario={{
                  id: selectedScenario.id,
                  title: selectedScenario.title,
                  indication: selectedScenario.indication,
                  indicationColor: selectedScenario.indicationColor,
                }}
                onExit={() => setRolePlayActive(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
