/**
 * FlashcardsSection — Spaced Repetition Flashcards
 * Design: Clinical Precision / Swiss Medical Modernism
 * 30 cards across 6 domains, Leitner-system scheduling (5 boxes),
 * 3D flip animation, daily session tracker, localStorage persistence.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Zap, Shield, TrendingUp, DollarSign, Syringe,
  RotateCcw, ChevronRight, BookOpen, CheckCircle2, XCircle,
  Minus, Trophy, Calendar, Flame, Target, ArrowLeft, RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Domain = "MOA" | "Evidence" | "Safety" | "Competitive" | "Access" | "Dosing";
type Difficulty = "Easy" | "Moderate" | "Challenging";
type LeitnerRating = "again" | "hard" | "good" | "easy";

interface Flashcard {
  id: string;
  domain: Domain;
  difficulty: Difficulty;
  front: string;       // Question / prompt
  back: string;        // Answer / key fact
  mnemonic?: string;   // Memory hook
}

interface CardState {
  box: number;         // Leitner box 1–5
  nextReview: string;  // ISO date string
  lastRating?: LeitnerRating;
  reviewCount: number;
}

interface FlashcardProgress {
  cards: Record<string, CardState>;
  streak: number;
  lastStudyDate: string;
  totalReviews: number;
  sessionHistory: { date: string; count: number; correct: number }[];
}

// ─── Domain Config ─────────────────────────────────────────────────────────────

const DOMAIN_CONFIG: Record<Domain, { color: string; icon: React.ReactNode; bg: string }> = {
  MOA:         { color: "#00C2A8", icon: <Brain size={14} />,      bg: "rgba(0,194,168,0.12)" },
  Evidence:    { color: "#3B82F6", icon: <TrendingUp size={14} />, bg: "rgba(59,130,246,0.12)" },
  Safety:      { color: "#EF4444", icon: <Shield size={14} />,     bg: "rgba(239,68,68,0.12)" },
  Competitive: { color: "#F59E0B", icon: <Zap size={14} />,        bg: "rgba(245,158,11,0.12)" },
  Access:      { color: "#8B5CF6", icon: <DollarSign size={14} />, bg: "rgba(139,92,246,0.12)" },
  Dosing:      { color: "#10B981", icon: <Syringe size={14} />,    bg: "rgba(16,185,129,0.12)" },
};

// ─── 30 Flashcards ────────────────────────────────────────────────────────────

const FLASHCARDS: Flashcard[] = [
  // MOA (6 cards)
  {
    id: "f01", domain: "MOA", difficulty: "Easy",
    front: "What does 'RNAi' stand for, and what is the basic mechanism?",
    back: "RNA interference — a natural cellular process where small double-stranded RNA molecules silence gene expression by guiding the RISC complex to cleave complementary mRNA, preventing protein translation.",
    mnemonic: "RNAi = RNA Interference = 'Intercept and destroy the message before the protein is made'",
  },
  {
    id: "f02", domain: "MOA", difficulty: "Moderate",
    front: "What is the role of GalNAc in vutrisiran's delivery system?",
    back: "N-acetylgalactosamine (GalNAc) is a carbohydrate ligand conjugated to the siRNA that binds with high affinity to the asialoglycoprotein receptor (ASGPR) on hepatocytes (~500,000 copies/cell), enabling targeted liver delivery without lipid nanoparticles.",
    mnemonic: "GalNAc = 'Guided Aim at Liver Nanoconjugate' → ASGPR receptor → hepatocyte entry",
  },
  {
    id: "f03", domain: "MOA", difficulty: "Moderate",
    front: "What is RISC and what does it do to TTR mRNA?",
    back: "RISC = RNA-Induced Silencing Complex. The antisense strand of vutrisiran's siRNA loads into RISC, which then seeks out complementary TTR mRNA and cleaves it at a specific site, preventing TTR protein synthesis. RISC is catalytic — one complex cleaves many mRNA molecules.",
    mnemonic: "RISC = 'Repeat Intercept Slice Catalytically' — one RISC, many mRNA targets",
  },
  {
    id: "f04", domain: "MOA", difficulty: "Easy",
    front: "By what percentage does AMVUTTRA reduce serum TTR at steady state?",
    back: "~88% peak TTR suppression at steady-state serum levels. This is achieved after the first dose and maintained with Q3M dosing. For comparison: patisiran ~80%, inotersen ~79%, eplontersen ~81%.",
    mnemonic: "88% = 'Eight-Eight, Nearly Complete' — the highest TTR suppression of any approved therapy",
  },
  {
    id: "f05", domain: "MOA", difficulty: "Challenging",
    front: "Why does AMVUTTRA reduce serum vitamin A by ~65%?",
    back: "TTR is the primary transport protein for retinol (vitamin A) in circulation, forming a complex with retinol-binding protein (RBP). When TTR is suppressed ~88%, the retinol-RBP complex loses its carrier, leading to increased renal clearance and ~65% reduction in serum vitamin A.",
    mnemonic: "TTR carries retinol-RBP → suppress TTR → retinol loses its ride → kidneys clear it",
  },
  {
    id: "f06", domain: "MOA", difficulty: "Challenging",
    front: "What is the difference between TTR silencing (RNAi/ASO) and TTR stabilisation (tafamidis)?",
    back: "Silencing (vutrisiran, patisiran, inotersen): reduces TTR production at the mRNA level → less TTR protein available to misfold. Stabilisation (tafamidis, acoramidis): binds the T4 binding sites on the TTR tetramer → prevents dissociation into monomers → prevents misfolding. Both reduce amyloid deposition but via different mechanisms.",
    mnemonic: "Silencing = 'Turn off the factory' | Stabilisation = 'Reinforce the product'",
  },
  // Evidence (6 cards)
  {
    id: "f07", domain: "Evidence", difficulty: "Easy",
    front: "What were the two primary endpoints of HELIOS-B?",
    back: "(1) CV composite: ACM + CV hospitalisations + urgent CV visits (HR 0.72, P<0.001). (2) All-cause mortality (key secondary): HR 0.65, 35% reduction, P=0.01 at 42 months.",
    mnemonic: "HELIOS-B = 'Heart Endpoints: 0.72 composite, 0.65 mortality'",
  },
  {
    id: "f08", domain: "Evidence", difficulty: "Moderate",
    front: "What was the HELIOS-B trial design? (n, duration, population, background therapy)",
    back: "n=655, randomised 1:1 (vutrisiran vs. placebo), 42 months, ATTR-CM (wt and hATTR). ~50% on background tafamidis at baseline. Stratified by NYHA class and tafamidis use.",
    mnemonic: "655 patients · 42 months · 50% on tafamidis · ATTR-CM",
  },
  {
    id: "f09", domain: "Evidence", difficulty: "Moderate",
    front: "What was the key finding of the HELIOS-B tafamidis subgroup analysis?",
    back: "In patients already on background tafamidis at baseline (~50% of HELIOS-B), the mortality and CV composite benefit of vutrisiran was consistent with the overall population — supporting AMVUTTRA's use even in patients already receiving tafamidis.",
    mnemonic: "Tafamidis subgroup = 'Add vutrisiran on top → benefit maintained'",
  },
  {
    id: "f10", domain: "Evidence", difficulty: "Easy",
    front: "What were the HELIOS-A primary results for hATTR-PN?",
    back: "mNIS+7 change at 9 months: vutrisiran −2.2 vs. external placebo +14.8 (difference −17.0, P<0.001). Norfolk QoL-DN: −21.1 vs. +5.5 (P<0.001). Both endpoints met with highly significant p-values.",
    mnemonic: "HELIOS-A: −2.2 vs. +14.8 = 17-point difference. 'Seventeen points of protection'",
  },
  {
    id: "f11", domain: "Evidence", difficulty: "Challenging",
    front: "What was the HELIOS-B OLE finding at 48 months in the monotherapy subgroup?",
    back: "In patients on vutrisiran monotherapy (no background tafamidis), the OLE at 48 months showed a 42% reduction in ACM + first CV event — the strongest efficacy signal in the AMVUTTRA evidence base. Crossover patients (placebo → vutrisiran) showed attenuated benefit, reinforcing early initiation.",
    mnemonic: "OLE monotherapy = 42% reduction. 'Forty-two: the answer to early treatment'",
  },
  {
    id: "f12", domain: "Evidence", difficulty: "Challenging",
    front: "Why can't you directly compare HELIOS-B HR 0.65 to ATTRibute-CM HR 0.64 (acoramidis)?",
    back: "Different endpoints: ATTRibute-CM used a composite of ACM + CV hospitalisations at 30 months. HELIOS-B HR 0.65 was for all-cause mortality alone at 42 months — a harder, more clinically meaningful endpoint with longer follow-up. Cross-trial HR comparisons are methodologically invalid.",
    mnemonic: "Different endpoints + different follow-up = apples vs. oranges. Never compare HRs across trials.",
  },
  // Safety (5 cards)
  {
    id: "f13", domain: "Safety", difficulty: "Easy",
    front: "What is the Black Box Warning for AMVUTTRA?",
    back: "Embryo-fetal toxicity. AMVUTTRA can cause fetal harm. Women of reproductive potential must use effective contraception during treatment and for 7 months after the last dose. Confirm negative pregnancy test before initiating.",
    mnemonic: "BBW = 'Baby Warning: 7-month contraception window after last dose'",
  },
  {
    id: "f14", domain: "Safety", difficulty: "Easy",
    front: "What vitamin A supplementation is required with AMVUTTRA?",
    back: "Supplement at the RDA: 900 mcg/day for men, 700 mcg/day for women, starting at the time of the first injection. High-dose supplementation (>10,000 IU/day) is NOT recommended — risk of hypervitaminosis A. Baseline serum vitamin A + ophthalmology referral recommended.",
    mnemonic: "RDA = 'Right Dose Always' · 900 men / 700 women · Not high-dose",
  },
  {
    id: "f15", domain: "Safety", difficulty: "Moderate",
    front: "What are the most common adverse events reported with AMVUTTRA in HELIOS-B?",
    back: "Injection site reactions (~5%), arthralgia (~7%), fatigue (~6%). Vitamin A deficiency-related: nyctalopia (night blindness). No significant hepatotoxicity, thrombocytopenia, or glomerulonephritis (unlike inotersen). No REMS required.",
    mnemonic: "ISR + arthralgia + fatigue = the 'mild triad'. No REMS = no serious monitoring burden.",
  },
  {
    id: "f16", domain: "Safety", difficulty: "Moderate",
    front: "Does AMVUTTRA require dose adjustment for renal or hepatic impairment?",
    back: "No dose adjustment for mild renal or hepatic impairment (Child-Pugh A). Not studied in moderate/severe hepatic impairment (Child-Pugh B/C) — use with caution. No dose adjustment for age or body weight.",
    mnemonic: "No adjustment for mild impairment. Child-Pugh B/C = caution, not studied.",
  },
  {
    id: "f17", domain: "Safety", difficulty: "Challenging",
    front: "A patient on AMVUTTRA reports nyctalopia at 6 months. What do you do?",
    back: "1. Check serum vitamin A level immediately. 2. Refer urgently to ophthalmology. 3. Verify RDA supplementation compliance. 4. Do NOT auto-discontinue AMVUTTRA — benefit-risk remains favourable unless deficiency is confirmed and severe. High-dose supplementation is not appropriate without specialist guidance.",
    mnemonic: "Nyctalopia protocol: Check → Refer → Verify → Don't stop. 'CRVD'",
  },
  // Competitive (5 cards)
  {
    id: "f18", domain: "Competitive", difficulty: "Easy",
    front: "Name the 5 approved TTR-targeting therapies and their mechanisms.",
    back: "1. Vutrisiran (AMVUTTRA) — GalNAc-siRNA. 2. Patisiran (ONPATTRO) — LNP-siRNA. 3. Inotersen (TEGSEDI) — ASO. 4. Eplontersen (WAINUA) — GalNAc-ASO. 5. Tafamidis (VYNDAMAX/VYNDAQEL) — TTR stabiliser. Acoramidis (ATTRibute) — TTR stabiliser (newer).",
    mnemonic: "Silencers: Vutrisiran, Patisiran, Inotersen, Eplontersen. Stabilisers: Tafamidis, Acoramidis.",
  },
  {
    id: "f19", domain: "Competitive", difficulty: "Moderate",
    front: "What are the 3 key differentiators of AMVUTTRA vs. patisiran (ONPATTRO)?",
    back: "1. Route: SC Q3M (4/year) vs. IV Q3W (17/year). 2. Premedication: None vs. corticosteroids + antihistamines + paracetamol. 3. Indication: ATTR-CM + hATTR-PN vs. hATTR-PN only. TTR suppression: ~88% vs. ~80%.",
    mnemonic: "SC vs. IV · No premed vs. premed · Dual vs. single indication",
  },
  {
    id: "f20", domain: "Competitive", difficulty: "Moderate",
    front: "What is the key safety difference between AMVUTTRA and inotersen (TEGSEDI)?",
    back: "Inotersen carries a REMS programme due to risks of thrombocytopenia (platelet count monitoring required) and glomerulonephritis. AMVUTTRA has NO REMS, no platelet monitoring, and no renal monitoring requirements. Inotersen is also dosed weekly (52 injections/year) vs. AMVUTTRA Q3M (4/year).",
    mnemonic: "Inotersen = REMS + weekly + platelet watch. AMVUTTRA = No REMS + Q3M + no monitoring.",
  },
  {
    id: "f21", domain: "Competitive", difficulty: "Challenging",
    front: "What is the current status of Intellia's NTLA-2001 (in vivo CRISPR) for ATTR?",
    back: "NTLA-2001 received a clinical hold from the FDA in 2024 due to safety concerns (off-target editing). Phase 1 data showed ~90% TTR reduction with a single dose, but the clinical hold paused further development. This is a key competitive intelligence point — AMVUTTRA remains the only approved Q3M RNAi therapy with no clinical hold.",
    mnemonic: "CRISPR = 'Clinical Hold Remains In Place Since 2024' — AMVUTTRA has no such barrier.",
  },
  {
    id: "f22", domain: "Competitive", difficulty: "Moderate",
    front: "Which TTR therapies are approved for ATTR-CM (cardiac indication)?",
    back: "Approved for ATTR-CM: 1. Vutrisiran (AMVUTTRA) — FDA March 2025. 2. Tafamidis (VYNDAMAX/VYNDAQEL) — FDA 2019. 3. Acoramidis (ATTRUBY) — FDA 2024. NOT approved for ATTR-CM: patisiran, inotersen, eplontersen (hATTR-PN only).",
    mnemonic: "ATTR-CM approved: Vutrisiran + Tafamidis + Acoramidis = 'VTA trio'",
  },
  // Access (4 cards)
  {
    id: "f23", domain: "Access", difficulty: "Easy",
    front: "What is Alnylam Assist® and what does it provide?",
    back: "Alnylam Assist® is the comprehensive patient support programme for AMVUTTRA. It provides: (1) Prior authorisation navigation. (2) Specialty pharmacy coordination. (3) Co-pay support ($0 co-pay for eligible commercially insured patients). (4) Nurse educator support for the first injection. (5) Ongoing adherence support.",
    mnemonic: "Alnylam Assist = 'PA + Pharmacy + $0 co-pay + Nurse + Adherence' = 5 pillars",
  },
  {
    id: "f24", domain: "Access", difficulty: "Moderate",
    front: "Under which Medicare benefit part is AMVUTTRA typically reimbursed, and why?",
    back: "Medicare Part B — because AMVUTTRA is administered by a healthcare professional (SC injection in office/clinic), qualifying as a physician-administered drug under 'incident to' billing. Part B covers 80% after deductible. This is an advantage over oral TTR stabilisers (Part D) which face formulary tier challenges.",
    mnemonic: "Part B = 'By the doctor' = physician-administered = 80% covered. Oral drugs = Part D = tier battles.",
  },
  {
    id: "f25", domain: "Access", difficulty: "Moderate",
    front: "Does AMVUTTRA have a REMS programme?",
    back: "NO. AMVUTTRA does not require a Risk Evaluation and Mitigation Strategy (REMS) programme. This is a significant differentiator from inotersen (TEGSEDI), which requires REMS due to thrombocytopenia and glomerulonephritis risks. No REMS means no mandatory monitoring programme, no special pharmacy certification, and simpler prescribing.",
    mnemonic: "No REMS = 'No Restrictions, Easy Management, Simple prescribing'",
  },
  {
    id: "f26", domain: "Access", difficulty: "Challenging",
    front: "What are the 5 key elements of a P&T committee submission for AMVUTTRA?",
    back: "1. Regulatory: FDA-approved (ATTR-CM 2025, hATTR-PN 2022). 2. Efficacy: HR 0.65 ACM, 35% mortality reduction (HELIOS-B). 3. Health economics: 26% CV hospitalisation reduction; avg 1.5 hospitalisations/year in ATTR-CM. 4. Unmet need: 300K–500K undiagnosed ATTR-CM patients. 5. Operational: No REMS, no premedication, SC Q3M — minimal pharmacy/nursing burden.",
    mnemonic: "P&T = 'Regulatory + Efficacy + Economics + Unmet need + Operational simplicity'",
  },
  // Dosing (4 cards)
  {
    id: "f27", domain: "Dosing", difficulty: "Easy",
    front: "What is the approved dose, route, and frequency of AMVUTTRA?",
    back: "25 mg subcutaneous injection every 3 months (Q3M). Administered by a healthcare professional. No premedication required. Results in only 4 injections per year. Same dose for both ATTR-CM and hATTR-PN indications.",
    mnemonic: "25 mg SC Q3M = '25 every quarter' = 4 times a year. No premed. HCP-administered.",
  },
  {
    id: "f28", domain: "Dosing", difficulty: "Moderate",
    front: "What pre-treatment assessments are required before initiating AMVUTTRA?",
    back: "1. Confirm ATTR diagnosis (Tc-PYP + haematologic workup, or biopsy). 2. Baseline serum vitamin A level. 3. Ophthalmology referral. 4. Pregnancy test (women of reproductive potential). 5. Confirm no moderate/severe hepatic impairment. 6. Enrol in Alnylam Assist®.",
    mnemonic: "Pre-treatment checklist: Diagnose → Vitamin A → Eyes → Pregnancy → Liver → Enrol",
  },
  {
    id: "f29", domain: "Dosing", difficulty: "Moderate",
    front: "How does AMVUTTRA's annual injection burden compare to other ATTR therapies?",
    back: "AMVUTTRA: 4 SC injections/year. Patisiran: 17 IV infusions/year (Q3W). Inotersen: 52 SC injections/year (weekly). Eplontersen: 12 SC injections/year (monthly). Tafamidis: 730 oral doses/year (2 tablets twice daily). Acoramidis: 730 oral doses/year.",
    mnemonic: "4 vs. 17 vs. 52 vs. 12 vs. 730. AMVUTTRA = fewest injections of any injectable.",
  },
  {
    id: "f30", domain: "Dosing", difficulty: "Challenging",
    front: "What is the washout period required when switching from patisiran to vutrisiran?",
    back: "No mandatory washout period is specified in the label. In clinical practice, the switch can be made at the time of the next scheduled patisiran infusion — the patient simply receives vutrisiran SC instead. The TTR suppression from patisiran will have waned by the next Q3W dose, and vutrisiran's effect begins within days of the first SC injection.",
    mnemonic: "Switch at next patisiran dose date. No washout. Vutrisiran effect starts within days.",
  },
];

// ─── Leitner Box Config ────────────────────────────────────────────────────────

const LEITNER_BOXES = [
  { box: 1, label: "Daily",     days: 1,  color: "#EF4444", description: "Review every day" },
  { box: 2, label: "2 Days",    days: 2,  color: "#F59E0B", description: "Review every 2 days" },
  { box: 3, label: "4 Days",    days: 4,  color: "#3B82F6", description: "Review every 4 days" },
  { box: 4, label: "Weekly",    days: 7,  color: "#8B5CF6", description: "Review weekly" },
  { box: 5, label: "Mastered",  days: 14, color: "#10B981", description: "Review every 2 weeks" },
];

const RATING_CONFIG: Record<LeitnerRating, { label: string; color: string; icon: React.ReactNode; boxChange: number }> = {
  again: { label: "Again",  color: "#EF4444", icon: <XCircle size={16} />,      boxChange: -2 },
  hard:  { label: "Hard",   color: "#F59E0B", icon: <Minus size={16} />,         boxChange: -1 },
  good:  { label: "Good",   color: "#3B82F6", icon: <CheckCircle2 size={16} />,  boxChange: 1  },
  easy:  { label: "Easy",   color: "#10B981", icon: <CheckCircle2 size={16} />,  boxChange: 2  },
};

// ─── Storage ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = "amvuttra_flashcards";

function loadProgress(): FlashcardProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw);
    return {
      cards: parsed.cards && typeof parsed.cards === "object" ? parsed.cards : {},
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
      lastStudyDate: typeof parsed.lastStudyDate === "string" ? parsed.lastStudyDate : "",
      totalReviews: typeof parsed.totalReviews === "number" ? parsed.totalReviews : 0,
      sessionHistory: Array.isArray(parsed.sessionHistory) ? parsed.sessionHistory : [],
    };
  } catch {
    return getDefaultProgress();
  }
}

function getDefaultProgress(): FlashcardProgress {
  const today = new Date().toISOString().split("T")[0];
  const cards: Record<string, CardState> = {};
  FLASHCARDS.forEach((c) => {
    cards[c.id] = { box: 1, nextReview: today, reviewCount: 0 };
  });
  return { cards, streak: 0, lastStudyDate: "", totalReviews: 0, sessionHistory: [] };
}

function saveProgress(progress: FlashcardProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private browsing / quota exceeded) — progress will not persist this session
  }
}

function getNextReviewDate(box: number): string {
  const days = LEITNER_BOXES[Math.min(box - 1, 4)].days;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function isDueToday(nextReview: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return nextReview <= today;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function DomainBadge({ domain }: { domain: Domain }) {
  const cfg = DOMAIN_CONFIG[domain];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.icon} {domain}
    </span>
  );
}

function DifficultyDot({ difficulty }: { difficulty: Difficulty }) {
  const colors = { Easy: "#10B981", Moderate: "#F59E0B", Challenging: "#EF4444" };
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: colors[difficulty] }}>
      <span className="w-2 h-2 rounded-full inline-block" style={{ background: colors[difficulty] }} />
      {difficulty}
    </span>
  );
}

function BoxDistribution({ progress }: { progress: FlashcardProgress }) {
  const counts = [0, 0, 0, 0, 0];
  FLASHCARDS.forEach((c) => {
    const state = progress.cards[c.id];
    if (state) counts[Math.min(state.box - 1, 4)]++;
  });
  return (
    <div className="flex gap-2 items-end h-12">
      {LEITNER_BOXES.map((b, i) => (
        <div key={b.box} className="flex flex-col items-center gap-1">
          <span className="text-xs font-bold" style={{ color: b.color }}>{counts[i]}</span>
          <div
            className="w-8 rounded-t transition-all duration-500"
            style={{
              background: b.color,
              height: `${Math.max(4, (counts[i] / FLASHCARDS.length) * 40)}px`,
              opacity: 0.8,
            }}
          />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{b.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function FlashcardsSection() {
  const [progress, setProgress] = useState<FlashcardProgress>(loadProgress);
  const [mode, setMode] = useState<"lobby" | "session" | "complete">("lobby");
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ id: string; rating: LeitnerRating }[]>([]);
  const [filterDomain, setFilterDomain] = useState<Domain | "All">("All");

  // Compute due cards
  const dueCards = FLASHCARDS.filter((c) => {
    const state = progress.cards[c.id];
    if (!state) return true;
    return isDueToday(state.nextReview);
  });

  const filteredDue = filterDomain === "All"
    ? dueCards
    : dueCards.filter((c) => c.domain === filterDomain);

  const masteredCount = FLASHCARDS.filter((c) => {
    const state = progress.cards[c.id];
    return state && state.box === 5;
  }).length;

  // Streak calculation
  const updateStreak = useCallback((prog: FlashcardProgress): FlashcardProgress => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    let streak = prog.streak;
    if (prog.lastStudyDate === today) {
      // already studied today, no change
    } else if (prog.lastStudyDate === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }
    return { ...prog, streak, lastStudyDate: today };
  }, []);

  const startSession = () => {
    const cards = filteredDue.length > 0
      ? [...filteredDue].sort(() => Math.random() - 0.5)
      : [...FLASHCARDS].sort(() => Math.random() - 0.5).slice(0, 10);
    setSessionCards(cards);
    setCurrentIdx(0);
    setIsFlipped(false);
    setSessionResults([]);
    setMode("session");
  };

  const handleRating = (rating: LeitnerRating) => {
    const card = sessionCards[currentIdx];
    const state = progress.cards[card.id] || { box: 1, nextReview: new Date().toISOString().split("T")[0], reviewCount: 0 };
    const boxChange = RATING_CONFIG[rating].boxChange;
    const newBox = Math.max(1, Math.min(5, state.box + boxChange));
    const newState: CardState = {
      box: newBox,
      nextReview: getNextReviewDate(newBox),
      lastRating: rating,
      reviewCount: state.reviewCount + 1,
    };

    const newResults = [...sessionResults, { id: card.id, rating }];
    setSessionResults(newResults);

    const newProgress = updateStreak({
      ...progress,
      cards: { ...progress.cards, [card.id]: newState },
      totalReviews: progress.totalReviews + 1,
    });

    if (currentIdx >= sessionCards.length - 1) {
      // Session complete — save session history
      const correct = newResults.filter((r) => r.rating === "good" || r.rating === "easy").length;
      const today = new Date().toISOString().split("T")[0];
      const sessionHistory = [...newProgress.sessionHistory, { date: today, count: newResults.length, correct }];
      const finalProgress = { ...newProgress, sessionHistory };
      setProgress(finalProgress);
      saveProgress(finalProgress);
      setMode("complete");
    } else {
      setProgress(newProgress);
      saveProgress(newProgress);
      setCurrentIdx((i) => i + 1);
      setIsFlipped(false);
    }
  };

  const resetAll = () => {
    const fresh = getDefaultProgress();
    setProgress(fresh);
    saveProgress(fresh);
    setMode("lobby");
  };

  const currentCard = sessionCards[currentIdx];

  // ── Lobby ──
  if (mode === "lobby") {
    return (
      <section id="flashcards" className="py-20 px-4" style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)" }}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-2">
            <div className="w-10 h-0.5 mb-4" style={{ background: "#00C2A8" }} />
            <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: "#fff" }}>
              Spaced Repetition Flashcards
            </h2>
            <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
              30 cards · Leitner system · Daily 5-minute review sessions
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Due Today", value: dueCards.length, color: "#EF4444", icon: <Calendar size={18} /> },
              { label: "Mastered", value: masteredCount, color: "#10B981", icon: <Trophy size={18} /> },
              { label: "Study Streak", value: `${progress.streak}d`, color: "#F59E0B", icon: <Flame size={18} /> },
              { label: "Total Reviews", value: progress.totalReviews, color: "#3B82F6", icon: <Target size={18} /> },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2 mb-1" style={{ color: s.color }}>{s.icon}<span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span></div>
                <div className="text-3xl font-bold" style={{ color: s.color, fontFamily: "'DM Serif Display', serif" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Box distribution */}
          <div className="rounded-xl p-5 border mb-8" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>Card Distribution by Leitner Box</h3>
              <button onClick={resetAll} className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-colors" style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)" }}>
                <RefreshCw size={12} /> Reset All
              </button>
            </div>
            <BoxDistribution progress={progress} />
          </div>

          {/* Domain filter */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Filter by Domain</p>
            <div className="flex flex-wrap gap-2">
              {(["All", ...Object.keys(DOMAIN_CONFIG)] as (Domain | "All")[]).map((d) => {
                const isActive = filterDomain === d;
                const cfg = d !== "All" ? DOMAIN_CONFIG[d] : null;
                const count = d === "All" ? dueCards.length : dueCards.filter((c) => c.domain === d).length;
                return (
                  <button
                    key={d}
                    onClick={() => setFilterDomain(d)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: isActive ? (cfg?.color ?? "#00C2A8") + "22" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${isActive ? (cfg?.color ?? "#00C2A8") : "rgba(255,255,255,0.1)"}`,
                      color: isActive ? (cfg?.color ?? "#00C2A8") : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {cfg?.icon}
                    {d}
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={startSession}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #00C2A8, #0093C4)", color: "#fff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 32px rgba(0,194,168,0.35)" }}
          >
            <BookOpen size={22} />
            {filteredDue.length > 0 ? `Study ${filteredDue.length} Due Card${filteredDue.length !== 1 ? "s" : ""}` : "Study All 30 Cards"}
          </button>

          {filteredDue.length === 0 && (
            <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              No cards due today in this domain — great work! Studying all cards instead.
            </p>
          )}
        </div>
      </section>
    );
  }

  // ── Session Complete ──
  if (mode === "complete") {
    const correct = sessionResults.filter((r) => r.rating === "good" || r.rating === "easy").length;
    const pct = Math.round((correct / sessionResults.length) * 100);
    const byRating = { again: 0, hard: 0, good: 0, easy: 0 };
    sessionResults.forEach((r) => byRating[r.rating]++);

    return (
      <section id="flashcards" className="py-20 px-4" style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "📈" : "💪"}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: "#fff" }}>Session Complete!</h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            {sessionResults.length} cards reviewed · {correct} correct · {pct}% accuracy
          </p>

          <div className="grid grid-cols-4 gap-3 mb-8">
            {(["again", "hard", "good", "easy"] as LeitnerRating[]).map((r) => {
              const cfg = RATING_CONFIG[r];
              return (
                <div key={r} className="rounded-xl p-3 border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-center gap-1 mb-1" style={{ color: cfg.color }}>{cfg.icon}</div>
                  <div className="text-2xl font-bold" style={{ color: cfg.color, fontFamily: "'DM Serif Display', serif" }}>{byRating[r]}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{cfg.label}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl p-4 border mb-8" style={{ background: "rgba(0,194,168,0.08)", borderColor: "rgba(0,194,168,0.2)" }}>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              🔥 Study streak: <strong style={{ color: "#F59E0B" }}>{progress.streak} day{progress.streak !== 1 ? "s" : ""}</strong> · Total reviews: <strong style={{ color: "#00C2A8" }}>{progress.totalReviews}</strong> · Mastered: <strong style={{ color: "#10B981" }}>{masteredCount}/30</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setMode("lobby")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #00C2A8, #0093C4)", color: "#fff" }}
            >
              <ArrowLeft size={18} /> Back to Lobby
            </button>
            <button
              onClick={startSession}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-all hover:scale-105"
              style={{ background: "transparent", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}
            >
              <RotateCcw size={18} /> Study Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Active Session ──
  if (!currentCard) return null;
  const cardState = progress.cards[currentCard.id];
  const box = cardState?.box ?? 1;
  const boxCfg = LEITNER_BOXES[Math.min(box - 1, 4)];

  return (
    <section id="flashcards" className="py-20 px-4" style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMode("lobby")} className="flex items-center gap-1 text-sm transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
            <ArrowLeft size={16} /> Exit
          </button>
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
            {currentIdx + 1} / {sessionCards.length}
          </span>
        </div>
        <div className="w-full h-1 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${((currentIdx) / sessionCards.length) * 100}%`, background: "linear-gradient(90deg, #00C2A8, #0093C4)" }}
          />
        </div>

        {/* Card metadata */}
        <div className="flex items-center gap-3 mb-4">
          <DomainBadge domain={currentCard.domain} />
          <DifficultyDot difficulty={currentCard.difficulty} />
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: boxCfg.color + "22", color: boxCfg.color }}>
            Box {box}: {boxCfg.label}
          </span>
        </div>

        {/* Flip Card */}
        <div
          className="relative cursor-pointer mb-6"
          style={{ perspective: "1200px", height: "280px" }}
          onClick={() => setIsFlipped((f) => !f)}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-2xl p-8 flex flex-col justify-center border"
              style={{
                backfaceVisibility: "hidden",
                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                Question — tap to reveal answer
              </p>
              <p className="text-xl font-medium leading-relaxed" style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
                {currentCard.front}
              </p>
              <div className="mt-auto pt-4 flex items-center gap-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                <RotateCcw size={14} />
                <span className="text-xs">Tap to flip</span>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-2xl p-8 flex flex-col justify-between border overflow-y-auto"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: "linear-gradient(135deg, rgba(0,194,168,0.08) 0%, rgba(0,147,196,0.06) 100%)",
                borderColor: "rgba(0,194,168,0.25)",
              }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(0,194,168,0.7)" }}>Answer</p>
                <p className="text-base leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'DM Sans', sans-serif" }}>
                  {currentCard.back}
                </p>
                {currentCard.mnemonic && (
                  <div className="rounded-lg px-4 py-3 border" style={{ background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#F59E0B" }}>💡 Memory Hook</p>
                    <p className="text-sm italic" style={{ color: "rgba(255,255,255,0.7)" }}>{currentCard.mnemonic}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rating buttons — only show after flip */}
        <AnimatePresence>
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs text-center mb-3 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                How well did you know this?
              </p>
              <div className="grid grid-cols-4 gap-3">
                {(["again", "hard", "good", "easy"] as LeitnerRating[]).map((r) => {
                  const cfg = RATING_CONFIG[r];
                  const nextBox = Math.max(1, Math.min(5, box + cfg.boxChange));
                  const nextBoxCfg = LEITNER_BOXES[Math.min(nextBox - 1, 4)];
                  return (
                    <button
                      key={r}
                      onClick={() => handleRating(r)}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border font-semibold text-sm transition-all hover:scale-105"
                      style={{
                        background: cfg.color + "15",
                        borderColor: cfg.color + "40",
                        color: cfg.color,
                      }}
                    >
                      {cfg.icon}
                      {cfg.label}
                      <span className="text-xs font-normal" style={{ color: "rgba(255,255,255,0.35)" }}>
                        → {nextBoxCfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setIsFlipped(false)}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  <ChevronRight size={12} /> Review question again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
