/**
 * RolePlayMode.tsx
 * Design: Clinical Precision / Swiss Medical Modernism
 * Turn-based HCP role-play simulation embedded in the Pitch Builder.
 * — HCP delivers realistic objections (archetype + scenario specific)
 * — User selects best counter-response from 4 choices
 * — Immediate coaching feedback (correct/partial/incorrect)
 * — Running score + performance summary at end
 * — 5 exchanges per session, each with escalating difficulty
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  User,
  ChevronRight,
  Star,
  Trophy,
  RefreshCw,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Volume2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RolePlayArchetype {
  id: string;
  name: string;
  specialty: string;
  icon: string;
  color: string;
}

export interface RolePlayScenario {
  id: string;
  title: string;
  indication: string;
  indicationColor: string;
}

interface ResponseChoice {
  id: string;
  text: string;
  quality: "excellent" | "good" | "poor" | "wrong";
  points: number;
  coaching: string;
  coachingDetail: string;
}

interface DialogueTurn {
  id: string;
  hcpStatement: string;
  hcpMood: "neutral" | "skeptical" | "curious" | "resistant" | "interested";
  context: string;
  choices: ResponseChoice[];
  bestResponseId: string;
  difficultyLabel: string;
}

interface SessionResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: "Expert" | "Proficient" | "Developing" | "Needs Practice";
  gradeColor: string;
  turnResults: { turnId: string; choiceId: string; points: number; quality: string }[];
  strengths: string[];
  improvements: string[];
}

// ─── Dialogue Data ────────────────────────────────────────────────────────────

const DIALOGUES: Record<string, Record<string, DialogueTurn[]>> = {
  "skeptical-cardiologist": {
    "progressing-on-tafamidis": [
      {
        id: "sc-pt-1",
        hcpStatement:
          "Look, my patient has been on tafamidis for 14 months and his NT-proBNP has come down 30%. I'm not going to change something that's working.",
        hcpMood: "resistant",
        context: "Opening — physician defending current therapy",
        difficultyLabel: "Moderate",
        bestResponseId: "sc-pt-1b",
        choices: [
          {
            id: "sc-pt-1a",
            text: "I completely understand — tafamidis is a great drug and the NT-proBNP improvement is encouraging.",
            quality: "poor",
            points: 0,
            coaching: "Too passive — you've conceded without bridging to the key issue.",
            coachingDetail:
              "Acknowledging the benefit is correct, but stopping there misses the opportunity to introduce the partial response concept. You need to bridge to the LVEF and 6MWT data to show that NT-proBNP improvement alone doesn't tell the full story.",
          },
          {
            id: "sc-pt-1b",
            text: "That NT-proBNP reduction is meaningful — and it tells us tafamidis is doing its job stabilising TTR tetramers. But I'd want to look at the full picture: if his LVEF or 6MWT are declining, that's a sign amyloid deposition is still ongoing despite the biomarker improvement. That's the partial response pattern.",
            quality: "excellent",
            points: 3,
            coaching: "Excellent — you acknowledged the benefit, then pivoted to the clinical gap.",
            coachingDetail:
              "This is the ABEC framework executed perfectly: Acknowledge (NT-proBNP benefit) → Bridge (but the full picture matters) → Evidence (LVEF + 6MWT as indicators of ongoing deposition) → Close (partial response pattern). You've planted the seed for the HELIOS-B tafamidis subgroup conversation without being confrontational.",
          },
          {
            id: "sc-pt-1c",
            text: "Actually, NT-proBNP isn't the most reliable marker for ATTR-CM progression — you should be looking at LVEF and 6MWT instead.",
            quality: "poor",
            points: 0,
            coaching: "Too dismissive — you've invalidated the physician's clinical judgment.",
            coachingDetail:
              "Telling a cardiologist that NT-proBNP 'isn't reliable' will immediately put them on the defensive. NT-proBNP is a validated biomarker in ATTR-CM — the issue is that it's one piece of the picture, not the whole story. Lead with agreement, then expand.",
          },
          {
            id: "sc-pt-1d",
            text: "The HELIOS-B data shows that even patients on tafamidis benefit from adding AMVUTTRA — the tafamidis subgroup had consistent CV and mortality outcomes.",
            quality: "good",
            points: 1,
            coaching: "Good data point, but you jumped to evidence without acknowledging the physician's perspective first.",
            coachingDetail:
              "Leading with data before acknowledging the physician's clinical observation feels like you're not listening. The HELIOS-B tafamidis subgroup is exactly the right evidence — but it lands better after you've validated their observation and introduced the partial response concept.",
          },
        ],
      },
      {
        id: "sc-pt-2",
        hcpStatement:
          "Fine, let's say I accept the partial response concept. But AMVUTTRA is an injection every 3 months. My patients don't want injections — they're already on multiple oral medications.",
        hcpMood: "skeptical",
        context: "Convenience objection — physician raising administration barrier",
        difficultyLabel: "Easy",
        bestResponseId: "sc-pt-2b",
        choices: [
          {
            id: "sc-pt-2a",
            text: "Most patients actually prefer injections to daily pills once they understand the benefits.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect claim — don't generalise patient preferences.",
            coachingDetail:
              "Claiming 'most patients prefer injections' is an unsupported generalisation that will damage your credibility with a sceptical cardiologist. Patient preferences vary widely. The correct approach is to reframe the burden comparison: 4 injections/year vs. adding another daily pill, and let the physician draw their own conclusion.",
          },
          {
            id: "sc-pt-2b",
            text: "I hear you — and that's actually one of AMVUTTRA's strongest points in this context. Instead of adding another daily pill to an already complex regimen, you're replacing tafamidis with 4 subcutaneous injections per year. No daily pill, no infusion centre, no premedication. For a patient who's already managing multiple medications, removing the daily tafamidis and replacing it with a quarterly injection often simplifies the regimen rather than complicating it.",
            quality: "excellent",
            points: 3,
            coaching: "Perfect reframe — you turned the objection into a benefit.",
            coachingDetail:
              "This is the 'judo move' of objection handling: use the physician's own concern (pill burden) to make your argument (switching removes a daily pill). The key insight — replacing tafamidis with AMVUTTRA is a net simplification, not an addition — is the most powerful response to this objection. You also addressed the infusion centre concern proactively.",
          },
          {
            id: "sc-pt-2c",
            text: "The injection is subcutaneous and takes less than a minute — it's very well tolerated.",
            quality: "good",
            points: 1,
            coaching: "Technically correct but misses the strategic reframe opportunity.",
            coachingDetail:
              "Describing the injection as quick and well-tolerated addresses the fear of the injection itself, but doesn't address the physician's real concern — adding complexity to an already complex regimen. The stronger response reframes the switch as a simplification (remove daily tafamidis, replace with 4 annual injections).",
          },
          {
            id: "sc-pt-2d",
            text: "We can discuss the injection logistics with the patient together — I can arrange a nurse educator visit.",
            quality: "poor",
            points: 0,
            coaching: "Premature close — you haven't addressed the objection yet.",
            coachingDetail:
              "Jumping to logistics before addressing the physician's concern signals that you're not listening. The physician is raising a conceptual objection (injection burden), not asking for logistical support. Address the concept first, then offer the practical support.",
          },
        ],
      },
      {
        id: "sc-pt-3",
        hcpStatement:
          "The HELIOS-B trial — I've read the paper. The placebo group had worse baseline characteristics. Isn't there a selection bias issue that inflates the treatment effect?",
        hcpMood: "skeptical",
        context: "Trial methodology challenge — sophisticated statistical objection",
        difficultyLabel: "Challenging",
        bestResponseId: "sc-pt-3b",
        choices: [
          {
            id: "sc-pt-3a",
            text: "The trial was randomised, so baseline imbalances are expected to be minimal by design.",
            quality: "poor",
            points: 0,
            coaching: "Technically correct but dismissive of a legitimate concern.",
            coachingDetail:
              "Randomisation reduces but does not eliminate baseline imbalances, especially in smaller trials. A cardiologist who has read the paper will know this. Dismissing the concern with 'it was randomised' will feel like you haven't engaged with their point. Acknowledge the observation, then address it with the specific data.",
          },
          {
            id: "sc-pt-3b",
            text: "That's a fair read of the data — and the HELIOS-B investigators addressed it directly. The pre-specified sensitivity analyses adjusting for baseline NT-proBNP and NYHA class showed consistent results. The tafamidis subgroup analysis — which is inherently more balanced since both arms had similar background therapy — also showed consistent benefit. The FDA reviewed the full dataset and approved on the basis of the primary analysis.",
            quality: "excellent",
            points: 3,
            coaching: "Outstanding — you engaged at a peer level and cited the right evidence.",
            coachingDetail:
              "This response demonstrates genuine clinical knowledge: you acknowledged the concern, cited the pre-specified sensitivity analyses, used the tafamidis subgroup as a natural control, and invoked the FDA review as the ultimate arbiter of data quality. This is peer-level scientific dialogue — exactly the right tone for a sceptical cardiologist who has read the paper.",
          },
          {
            id: "sc-pt-3c",
            text: "I'd need to check the specific baseline data — can I follow up with you on that?",
            quality: "good",
            points: 1,
            coaching: "Honest, but a missed opportunity to demonstrate clinical knowledge.",
            coachingDetail:
              "Offering to follow up is better than guessing or deflecting, and honesty is valued. However, a Senior Product Specialist should know the HELIOS-B sensitivity analysis data. This response signals a knowledge gap that a sceptical cardiologist will notice. Use this as a prompt to review the supplementary data.",
          },
          {
            id: "sc-pt-3d",
            text: "The trial was published in the New England Journal of Medicine — the peer review process would have caught any major methodological issues.",
            quality: "poor",
            points: 0,
            coaching: "Appeal to authority — doesn't address the specific concern.",
            coachingDetail:
              "Citing NEJM peer review as a defence against a specific methodological question is a logical fallacy. A cardiologist who has read the paper will not be satisfied with 'NEJM reviewed it.' You need to engage with the specific concern about baseline imbalances and the sensitivity analyses.",
          },
        ],
      },
      {
        id: "sc-pt-4",
        hcpStatement:
          "What about long-term safety? RNAi is still relatively new. I don't know what happens to these patients after 5, 10 years on this drug.",
        hcpMood: "curious",
        context: "Long-term safety concern — legitimate scientific uncertainty",
        difficultyLabel: "Moderate",
        bestResponseId: "sc-pt-4b",
        choices: [
          {
            id: "sc-pt-4a",
            text: "The safety profile is excellent — in HELIOS-B, the adverse event rates were comparable between vutrisiran and placebo.",
            quality: "good",
            points: 1,
            coaching: "Good start, but doesn't fully address the long-term concern.",
            coachingDetail:
              "Citing the HELIOS-B safety data is correct and important, but a 42-month trial doesn't answer the 5-10 year question. You need to also reference the hATTR-PN experience (4 years of post-approval data since June 2022) and the broader RNAi safety record from inclisiran and patisiran to provide the fuller picture.",
          },
          {
            id: "sc-pt-4b",
            text: "That's a legitimate question, and I want to be transparent: we have 42 months of HELIOS-B data plus 4 years of post-approval experience in hATTR-PN since June 2022. The broader RNAi class — inclisiran for hypercholesterolaemia, patisiran — has an accumulating safety record now spanning 6+ years with no unexpected late-emerging signals. The mechanism is also reassuring: GalNAc-siRNA degrades after silencing the target — it doesn't integrate into the genome. But you're right that 10-year data doesn't exist yet, and I won't pretend otherwise.",
            quality: "excellent",
            points: 3,
            coaching: "Excellent — transparent, evidence-based, and appropriately honest about uncertainty.",
            coachingDetail:
              "This response earns trust by acknowledging the genuine uncertainty (10-year data doesn't exist) while providing the best available evidence: 42-month RCT + 4-year post-approval + class safety record + mechanistic reassurance. The honesty about what we don't know is as important as the data we do have — it builds credibility with a sceptical cardiologist.",
          },
          {
            id: "sc-pt-4c",
            text: "RNAi has been studied for over 20 years — the safety profile is very well established.",
            quality: "poor",
            points: 0,
            coaching: "Misleading — RNAi research history ≠ clinical safety data for vutrisiran.",
            coachingDetail:
              "RNAi as a technology has been studied since the late 1990s, but vutrisiran specifically has only been in clinical use since 2022. Conflating research history with clinical safety data is misleading and a cardiologist will see through it. Be specific about what data exists and what doesn't.",
          },
          {
            id: "sc-pt-4d",
            text: "ATTR-CM is a fatal disease — the risk of not treating outweighs any theoretical long-term safety concern.",
            quality: "poor",
            points: 0,
            coaching: "Dismissive of a legitimate scientific concern.",
            coachingDetail:
              "While the risk-benefit argument is valid, dismissing the physician's safety concern with 'the disease is fatal anyway' is condescending and doesn't engage with the question. A cardiologist asking about long-term safety deserves a substantive answer, not a deflection.",
          },
        ],
      },
      {
        id: "sc-pt-5",
        hcpStatement:
          "Alright. I have one patient in mind — 68-year-old, wt-ATTR-CM, been on tafamidis 18 months, LVEF has dropped from 58% to 53%, 6MWT down 45 metres. What's the next step?",
        hcpMood: "interested",
        context: "Closing — physician identifies a candidate patient",
        difficultyLabel: "Easy",
        bestResponseId: "sc-pt-5b",
        choices: [
          {
            id: "sc-pt-5a",
            text: "Great — I'll send you the prescribing information and you can start him on AMVUTTRA.",
            quality: "poor",
            points: 0,
            coaching: "Too transactional — you've skipped the clinical workup steps.",
            coachingDetail:
              "Jumping straight to 'start him on AMVUTTRA' skips the important pre-treatment steps: vitamin A baseline, ophthalmology referral, and the vitamin A supplementation counselling. A cardiologist who starts a patient without this workup will encounter problems, and that reflects poorly on your support.",
          },
          {
            id: "sc-pt-5b",
            text: "This patient fits the partial response profile exactly — LVEF decline and 6MWT drop despite tafamidis. Before initiating, I'd recommend: check baseline vitamin A level, arrange an ophthalmology referral (AMVUTTRA reduces serum vitamin A by ~65%), and switch his multivitamin to RDA-level vitamin A — 900 mcg/day for men. Then discontinue tafamidis on the day of the first injection — no taper needed. I can connect you with the Alnylam Assist® team to handle the prior authorisation and nurse support.",
            quality: "excellent",
            points: 3,
            coaching: "Perfect close — clinical, practical, and supportive.",
            coachingDetail:
              "This is the ideal closing response: you confirmed the clinical rationale, provided the complete pre-treatment checklist (vitamin A baseline, ophthalmology, RDA supplementation), clarified the transition protocol (no taper, discontinue on day 1), and offered concrete next-step support (Alnylam Assist®). This is what a trusted clinical partner looks like.",
          },
          {
            id: "sc-pt-5c",
            text: "I'd suggest referring him to a rare disease specialist before starting — they'll have more experience with AMVUTTRA initiation.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect — you've undermined the physician's confidence unnecessarily.",
            coachingDetail:
              "Suggesting a referral to a rare disease specialist implies that a cardiologist can't manage AMVUTTRA initiation — which is both incorrect and insulting. Cardiologists are the primary prescribers of AMVUTTRA for ATTR-CM. Your role is to support them in initiating, not to redirect them to a specialist.",
          },
          {
            id: "sc-pt-5d",
            text: "Before we start, I'd want to confirm his haematologic workup is negative — we need to rule out AL amyloidosis if that hasn't been done.",
            quality: "good",
            points: 1,
            coaching: "Clinically important point, but incomplete as a closing response.",
            coachingDetail:
              "Checking for AL amyloidosis is important at diagnosis, but this patient has already been on tafamidis for 18 months — the diagnosis of wt-ATTR-CM is established. The haematologic workup should have been done at diagnosis. The more relevant pre-treatment steps at this stage are vitamin A baseline, ophthalmology referral, and RDA supplementation counselling.",
          },
        ],
      },
    ],
    "new-diagnosis-attr-cm": [
      {
        id: "sc-nd-1",
        hcpStatement:
          "I just confirmed wt-ATTR-CM in a 70-year-old. NYHA Class II, no prior therapy. Why would I choose AMVUTTRA over tafamidis as first-line? Tafamidis has 6 years of real-world data.",
        hcpMood: "skeptical",
        context: "First-line treatment choice — tafamidis vs. AMVUTTRA",
        difficultyLabel: "Challenging",
        bestResponseId: "sc-nd-1b",
        choices: [
          {
            id: "sc-nd-1a",
            text: "Tafamidis is a good option, but AMVUTTRA is newer and more advanced.",
            quality: "wrong",
            points: -1,
            coaching: "Vague and dismissive — 'newer and more advanced' is not a clinical argument.",
            coachingDetail:
              "Saying a drug is 'newer and more advanced' without clinical evidence is a red flag for a cardiologist. It sounds like marketing, not medicine. You need to make the mechanistic and outcomes argument: AMVUTTRA silences TTR production (vs. stabilisation), achieves 88% TTR suppression, and has HELIOS-B mortality data that tafamidis's ATTR-ACT trial did not achieve as a primary endpoint.",
          },
          {
            id: "sc-nd-1b",
            text: "The real-world tafamidis experience is valuable — and ATTR-ACT was a landmark trial. The distinction I'd draw is mechanistic: tafamidis stabilises existing TTR tetramers but doesn't reduce TTR production. AMVUTTRA silences TTR at the mRNA level — 88% suppression. The clinical consequence: HELIOS-B showed a 35% reduction in all-cause mortality, which ATTR-ACT did not achieve as a primary endpoint. For a newly diagnosed patient at NYHA Class II, starting with the agent that has the mortality signal is a defensible first-line choice.",
            quality: "excellent",
            points: 3,
            coaching: "Strong — mechanistic differentiation backed by outcomes data.",
            coachingDetail:
              "This response respects tafamidis's track record while making a clear mechanistic and outcomes-based argument for AMVUTTRA. The key differentiator — HELIOS-B mortality data vs. ATTR-ACT's functional endpoints — is the right clinical argument. You've also framed the choice as 'defensible' rather than 'obvious,' which is appropriately humble.",
          },
          {
            id: "sc-nd-1c",
            text: "Tafamidis requires a daily pill — AMVUTTRA is only 4 injections per year, which is much more convenient.",
            quality: "poor",
            points: 0,
            coaching: "Convenience alone is insufficient for a first-line treatment decision.",
            coachingDetail:
              "Convenience is a valid consideration but not the primary argument for choosing a first-line therapy in a serious disease like ATTR-CM. A cardiologist will want to hear the clinical outcomes argument first. Lead with mortality data and mechanism, then mention convenience as a secondary benefit.",
          },
          {
            id: "sc-nd-1d",
            text: "AMVUTTRA is the only therapy approved for both ATTR-CM and hATTR-PN — so if this patient has any neuropathy features, you're covered.",
            quality: "good",
            points: 1,
            coaching: "Relevant for overlap patients, but not the primary argument here.",
            coachingDetail:
              "The dual indication is a strong differentiator, but this patient has confirmed wt-ATTR-CM without mention of neuropathy features. Defaulting to the dual indication argument when it's not clinically relevant to this specific patient can feel like a scripted response rather than a tailored one.",
          },
        ],
      },
      {
        id: "sc-nd-2",
        hcpStatement:
          "What about the vitamin A issue? I don't want to be managing vitamin A deficiency on top of everything else.",
        hcpMood: "skeptical",
        context: "Safety concern — vitamin A management burden",
        difficultyLabel: "Easy",
        bestResponseId: "sc-nd-2b",
        choices: [
          {
            id: "sc-nd-2a",
            text: "Vitamin A deficiency is very rare with AMVUTTRA — most patients don't experience any symptoms.",
            quality: "poor",
            points: 0,
            coaching: "Downplaying a real safety consideration — not credible.",
            coachingDetail:
              "AMVUTTRA reduces serum vitamin A by ~65% in all patients — this is a class effect of TTR suppression, not a rare adverse event. Downplaying it will damage your credibility. The correct approach is to acknowledge it directly and explain the simple management protocol.",
          },
          {
            id: "sc-nd-2b",
            text: "It's a real consideration — AMVUTTRA reduces serum vitamin A by about 65% because TTR is the primary vitamin A transport protein. The management is straightforward: supplement at the RDA — 900 mcg/day for men — starting at the first injection, and arrange a baseline ophthalmology referral. In practice, most patients are already taking a multivitamin — you just need to confirm it contains RDA-level vitamin A, not a high-dose supplement. The Alnylam Assist® nurse coordinator handles this counselling as part of the onboarding process.",
            quality: "excellent",
            points: 3,
            coaching: "Excellent — transparent, practical, and reassuring.",
            coachingDetail:
              "This response earns trust by acknowledging the mechanism (TTR as vitamin A transporter), explaining the management protocol clearly (RDA supplementation + ophthalmology), and reducing the physician's workload by pointing to the nurse coordinator support. The practical insight about multivitamins is the kind of real-world detail that builds credibility.",
          },
          {
            id: "sc-nd-2c",
            text: "You just need to check a vitamin A level at baseline and annually — it's a simple blood test.",
            quality: "good",
            points: 1,
            coaching: "Partially correct but incomplete.",
            coachingDetail:
              "Annual vitamin A monitoring is part of the protocol, but the response is incomplete: it doesn't mention the RDA supplementation requirement (which is mandatory, not optional), the ophthalmology referral, or the multivitamin counselling. A physician who only monitors without supplementing will have patients develop deficiency.",
          },
          {
            id: "sc-nd-2d",
            text: "The ophthalmology team manages the vitamin A monitoring — you just need to make the referral.",
            quality: "poor",
            points: 0,
            coaching: "Incorrect delegation — the prescribing physician retains responsibility.",
            coachingDetail:
              "While an ophthalmology referral is recommended, the prescribing physician is responsible for the overall vitamin A management protocol, including supplementation counselling. Delegating the entire responsibility to ophthalmology is clinically incorrect and may result in the supplementation step being missed.",
          },
        ],
      },
      {
        id: "sc-nd-3",
        hcpStatement:
          "My patient is 70 years old and has mild cognitive impairment. He struggles to remember his tafamidis daily. Would AMVUTTRA actually help with adherence in this population?",
        hcpMood: "curious",
        context: "Special population — cognitive impairment and adherence",
        difficultyLabel: "Moderate",
        bestResponseId: "sc-nd-3b",
        choices: [
          {
            id: "sc-nd-3a",
            text: "AMVUTTRA hasn't been specifically studied in patients with cognitive impairment.",
            quality: "poor",
            points: 0,
            coaching: "True but unhelpful — you've answered a different question.",
            coachingDetail:
              "The physician isn't asking whether AMVUTTRA was studied in cognitive impairment — they're asking whether the Q3M dosing schedule would help with adherence in a patient who forgets daily pills. The answer is clearly yes: 4 HCP-administered injections per year eliminates the daily adherence challenge entirely.",
          },
          {
            id: "sc-nd-3b",
            text: "This is actually one of AMVUTTRA's most compelling advantages for this patient. Because it's HCP-administered — 4 injections per year in your office or infusion centre — adherence is essentially guaranteed. There's no daily pill for him to forget. The administration responsibility shifts from the patient to the healthcare system. For a patient with mild cognitive impairment who's already struggling with daily tafamidis, this is a meaningful quality-of-life and adherence improvement.",
            quality: "excellent",
            points: 3,
            coaching: "Perfect — you identified the clinical insight and made it patient-specific.",
            coachingDetail:
              "The key insight — HCP-administered dosing transfers the adherence responsibility from the patient to the healthcare system — is the most powerful argument for AMVUTTRA in cognitively impaired patients. You've connected the drug's administration feature directly to this specific patient's clinical challenge. This is personalised selling at its best.",
          },
          {
            id: "sc-nd-3c",
            text: "We can set up a reminder system for the quarterly injection appointments.",
            quality: "good",
            points: 1,
            coaching: "Practical but misses the strategic insight.",
            coachingDetail:
              "Offering a reminder system is helpful, but it doesn't capture the fundamental advantage: the patient doesn't need to remember anything because the injection is HCP-administered. The stronger response highlights that adherence is guaranteed by design, not by reminders.",
          },
          {
            id: "sc-nd-3d",
            text: "You could involve a family member as a caregiver to manage the daily tafamidis — that might be easier than switching.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect — you're solving the problem for the competitor drug.",
            coachingDetail:
              "Suggesting a caregiver to manage tafamidis adherence is helping the physician keep the patient on tafamidis — the opposite of your goal. This response also adds burden to the family rather than simplifying care. The correct response highlights AMVUTTRA's inherent adherence advantage.",
          },
        ],
      },
      {
        id: "sc-nd-4",
        hcpStatement:
          "I'm worried about the injection site reactions. My elderly patients have thin skin and I've had issues with other SC injectables.",
        hcpMood: "skeptical",
        context: "Safety concern — injection site reactions in elderly",
        difficultyLabel: "Easy",
        bestResponseId: "sc-nd-4b",
        choices: [
          {
            id: "sc-nd-4a",
            text: "Injection site reactions are listed in the prescribing information but are generally mild.",
            quality: "good",
            points: 1,
            coaching: "Accurate but could be more specific and reassuring.",
            coachingDetail:
              "Citing the PI is correct, but 'generally mild' is vague. Provide the specific incidence data from HELIOS-B: injection site reactions occurred in approximately 8% of patients vs. 6% placebo — a small difference, mostly Grade 1 (redness, mild discomfort). Also mention the practical technique: 25-gauge needle, abdominal injection, rotate sites.",
          },
          {
            id: "sc-nd-4b",
            text: "In HELIOS-B, injection site reactions occurred in about 8% of patients versus 6% on placebo — a small difference, and most were Grade 1: mild redness or transient discomfort. The injection uses a 25-gauge needle into the abdomen, and rotating sites helps minimise local reactions. In practice, I haven't seen this be a significant barrier in elderly patients. If there's a specific concern, the Alnylam nurse educator can demonstrate technique at the first injection.",
            quality: "excellent",
            points: 3,
            coaching: "Specific, data-driven, and practically reassuring.",
            coachingDetail:
              "This response provides the specific incidence data (8% vs. 6%), contextualises the severity (Grade 1), explains the technique (25G needle, abdominal, rotate sites), and offers practical support (nurse educator). The combination of clinical data and practical guidance is exactly what a physician with a specific safety concern needs.",
          },
          {
            id: "sc-nd-4c",
            text: "We can apply a topical anaesthetic before the injection to minimise discomfort.",
            quality: "poor",
            points: 0,
            coaching: "Premature practical solution before addressing the clinical concern.",
            coachingDetail:
              "Jumping to topical anaesthetic before providing the incidence data and severity context suggests the problem is more significant than it is. Lead with the data (8% vs. 6%, Grade 1), then offer the practical technique guidance. Topical anaesthetic is not standard practice for AMVUTTRA injections.",
          },
          {
            id: "sc-nd-4d",
            text: "Injection site reactions are not a common reason for discontinuation in clinical trials.",
            quality: "good",
            points: 1,
            coaching: "Relevant point but lacks the specific data.",
            coachingDetail:
              "The discontinuation argument is valid and reassuring, but it's more compelling when paired with the specific incidence data (8% vs. 6%) and severity context (Grade 1). The physician wants to know how common and how severe, not just whether patients stopped the drug.",
          },
        ],
      },
      {
        id: "sc-nd-5",
        hcpStatement:
          "OK, I'm interested. What do I need to do to get my first patient started?",
        hcpMood: "interested",
        context: "Closing — physician ready to initiate first patient",
        difficultyLabel: "Easy",
        bestResponseId: "sc-nd-5b",
        choices: [
          {
            id: "sc-nd-5a",
            text: "I'll send you the prescribing information — just write the prescription and the pharmacy will handle the rest.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect — AMVUTTRA requires HCP administration, not pharmacy dispensing.",
            coachingDetail:
              "AMVUTTRA is not a pharmacy-dispensed self-injectable. It's HCP-administered. A physician who writes a prescription expecting the pharmacy to handle it will have a frustrated patient and a failed first experience. You must clarify the administration pathway: specialty pharmacy → patient receives drug → HCP administers in office or infusion centre.",
          },
          {
            id: "sc-nd-5b",
            text: "Excellent — here's the initiation checklist: First, baseline vitamin A level and ophthalmology referral. Second, switch any high-dose vitamin A supplements to RDA level. Third, I'll connect you with Alnylam Assist® — they handle the prior authorisation, specialty pharmacy coordination, and nurse educator support for the first injection. AMVUTTRA is HCP-administered, so the drug comes through a specialty pharmacy to your office or infusion centre. The first injection is typically scheduled 2–3 weeks after PA approval. I'll follow up with you next week to confirm the PA is moving.",
            quality: "excellent",
            points: 3,
            coaching: "Complete, practical, and sets clear expectations.",
            coachingDetail:
              "This is the ideal initiation response: pre-treatment checklist (vitamin A + ophthalmology), supplementation counselling, PA support pathway, administration logistics (specialty pharmacy → HCP-administered), timeline expectation (2–3 weeks), and a concrete follow-up commitment. The physician knows exactly what happens next and feels supported.",
          },
          {
            id: "sc-nd-5c",
            text: "I'll arrange a meeting with the Alnylam Assist® team — they'll walk you through everything.",
            quality: "good",
            points: 1,
            coaching: "Good support offer, but you should lead with the clinical initiation steps.",
            coachingDetail:
              "Connecting the physician with Alnylam Assist® is important and correct, but the physician is asking what they need to do — they want clinical guidance first, then support resources. Lead with the pre-treatment checklist (vitamin A, ophthalmology, supplementation), then offer the Alnylam Assist® support.",
          },
          {
            id: "sc-nd-5d",
            text: "The first step is the prior authorisation — I'll handle that for you.",
            quality: "poor",
            points: 0,
            coaching: "Incomplete — PA is one step, but the clinical pre-treatment workup comes first.",
            coachingDetail:
              "Prior authorisation is important but it's not the first clinical step. The pre-treatment workup (vitamin A baseline, ophthalmology referral, supplementation counselling) should happen before or concurrently with the PA process. Leading with PA suggests the administrative process is more important than the clinical preparation.",
          },
        ],
      },
    ],
  },
  "early-adopter-neurologist": {
    "hattr-pn-patisiran": [
      {
        id: "ean-hp-1",
        hcpStatement:
          "My patient has been stable on patisiran for 18 months. Her NIS+7 hasn't changed. Why would I switch her to something new when she's doing well?",
        hcpMood: "skeptical",
        context: "Stability on patisiran — why switch?",
        difficultyLabel: "Moderate",
        bestResponseId: "ean-hp-1b",
        choices: [
          {
            id: "ean-hp-1a",
            text: "AMVUTTRA is clinically superior to patisiran based on the HELIOS-A data.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect claim — no head-to-head trial exists.",
            coachingDetail:
              "There is no head-to-head trial between vutrisiran and patisiran. Claiming clinical superiority without a comparative trial is a compliance violation and will immediately destroy your credibility with an academic neurologist. The correct framing is equivalent efficacy with superior convenience.",
          },
          {
            id: "ean-hp-1b",
            text: "If she's stable and tolerating patisiran well, there's no urgent clinical reason to switch — and I wouldn't push you to. The conversation I'd have is about her quality of life: 26 IV infusions per year, each taking 3 hours with premedication. If she's working, travelling, or simply wants fewer medical appointments, AMVUTTRA offers the same TTR silencing mechanism with 4 SC injections per year. The switch is seamless — no washout, switch on the day of her next scheduled infusion.",
            quality: "excellent",
            points: 3,
            coaching: "Excellent — honest, patient-centred, and non-coercive.",
            coachingDetail:
              "This response builds enormous trust by acknowledging that there's no urgent clinical reason to switch a stable patient. It then pivots to the patient's quality of life — which is a legitimate clinical consideration — and makes the convenience argument without overclaiming efficacy. The honesty about 'no urgent reason' is counterintuitive but highly effective with a physician who values scientific integrity.",
          },
          {
            id: "ean-hp-1c",
            text: "The HELIOS-A data showed that vutrisiran has a better NIS+7 outcome than patisiran's APOLLO trial.",
            quality: "poor",
            points: 0,
            coaching: "Cross-trial comparison — methodologically invalid.",
            coachingDetail:
              "Comparing NIS+7 outcomes across HELIOS-A and APOLLO is a cross-trial comparison with different patient populations, baseline characteristics, and follow-up periods. An academic neurologist will immediately challenge this as methodologically invalid. Avoid cross-trial efficacy comparisons without a head-to-head trial.",
          },
          {
            id: "ean-hp-1d",
            text: "Patisiran requires premedication with corticosteroids — that's an additional safety consideration for long-term use.",
            quality: "good",
            points: 1,
            coaching: "Valid point, but not the primary argument for a stable patient.",
            coachingDetail:
              "The premedication burden (corticosteroids + antihistamines + paracetamol before each infusion) is a legitimate long-term safety consideration, especially for elderly patients. However, for a stable patient doing well, the primary argument should be quality of life and convenience, not a safety concern about a drug that's working.",
          },
        ],
      },
      {
        id: "ean-hp-2",
        hcpStatement:
          "She travels internationally for work. She's missed two patisiran infusions in the last 6 months because she was abroad. Is that a problem?",
        hcpMood: "curious",
        context: "Adherence gap due to travel — clinical consequence question",
        difficultyLabel: "Moderate",
        bestResponseId: "ean-hp-2b",
        choices: [
          {
            id: "ean-hp-2a",
            text: "Missing two infusions is not ideal but probably won't have a significant clinical impact.",
            quality: "poor",
            points: 0,
            coaching: "Vague reassurance without clinical basis.",
            coachingDetail:
              "Saying 'probably won't have a significant impact' is speculative and doesn't engage with the pharmacology. The correct response explains what happens to TTR levels when patisiran doses are missed (TTR rebounds toward baseline within weeks) and connects this to the clinical risk of disease progression during the gap.",
          },
          {
            id: "ean-hp-2b",
            text: "It's clinically relevant. Patisiran's TTR suppression is sustained only when doses are given on schedule — when a dose is missed, TTR levels begin to rebound toward baseline within 2–3 weeks. Two missed doses in 6 months means she's had periods of reduced TTR suppression and potentially resumed amyloid deposition. This is exactly the scenario where AMVUTTRA's Q3M schedule becomes clinically important — a 3-month window is much more forgiving of travel schedules, and the injection can be administered by any trained HCP wherever she is in the world.",
            quality: "excellent",
            points: 3,
            coaching: "Outstanding — clinical pharmacology + patient-specific application.",
            coachingDetail:
              "This response demonstrates deep clinical knowledge (TTR rebound kinetics after missed patisiran doses), connects it to the clinical risk (resumed amyloid deposition), and then makes the AMVUTTRA argument directly relevant to this patient's specific challenge (travel). The insight that AMVUTTRA can be administered by any HCP globally is a practical detail that will resonate with a neurologist managing an internationally mobile patient.",
          },
          {
            id: "ean-hp-2c",
            text: "We can arrange for patisiran infusions at international infusion centres — Alnylam has a global network.",
            quality: "good",
            points: 1,
            coaching: "Practical solution, but misses the opportunity to make the AMVUTTRA argument.",
            coachingDetail:
              "International infusion coordination is possible but logistically complex and not always reliable. This response solves the problem for patisiran rather than making the AMVUTTRA argument. The stronger response explains the clinical consequence of missed doses and then positions AMVUTTRA's Q3M schedule as the structural solution.",
          },
          {
            id: "ean-hp-2d",
            text: "I'd recommend checking her NIS+7 at the next visit to assess whether the missed doses have had any impact.",
            quality: "good",
            points: 1,
            coaching: "Clinically appropriate monitoring, but doesn't address the root cause.",
            coachingDetail:
              "NIS+7 monitoring is appropriate, but it's a reactive measure — it tells you after the fact whether there's been progression. The more important conversation is about preventing future gaps, which is where AMVUTTRA's Q3M schedule is the structural solution.",
          },
        ],
      },
      {
        id: "ean-hp-3",
        hcpStatement:
          "If I switch her, what happens on the day of the switch? Do I need to wait for patisiran to clear before starting vutrisiran?",
        hcpMood: "curious",
        context: "Transition logistics — washout question",
        difficultyLabel: "Easy",
        bestResponseId: "ean-hp-3b",
        choices: [
          {
            id: "ean-hp-3a",
            text: "I'd recommend waiting 2–4 weeks after the last patisiran infusion before starting vutrisiran.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect — a washout gap is not recommended and risks disease progression.",
            coachingDetail:
              "There is no pharmacological basis for a washout period between patisiran and vutrisiran. Both are siRNA agents targeting TTR mRNA — there is no drug interaction or pharmacological conflict. A 2–4 week gap would leave the patient without TTR suppression, allowing TTR to rebound and potentially accelerating amyloid deposition. The correct protocol is seamless transition on the day of the next scheduled patisiran infusion.",
          },
          {
            id: "ean-hp-3b",
            text: "No washout needed — the switch is seamless. On the day of her next scheduled patisiran infusion, administer AMVUTTRA instead. Both are siRNA agents targeting the same TTR mRNA — there's no pharmacological conflict and no interaction concern. Patisiran's half-life is short enough that it clears within days, and AMVUTTRA begins achieving TTR suppression within the first week. The patient experiences continuous TTR silencing with no gap.",
            quality: "excellent",
            points: 3,
            coaching: "Correct, mechanistically grounded, and practically clear.",
            coachingDetail:
              "This response provides the correct protocol (no washout, switch on day of next infusion), explains the pharmacological rationale (same mechanism, no interaction, short patisiran half-life), and reassures the physician that TTR suppression is continuous. The mechanistic explanation is appropriate for an academic neurologist who wants to understand the 'why,' not just the 'what.'",
          },
          {
            id: "ean-hp-3c",
            text: "The prescribing information doesn't specify a washout period, so you can switch at any time.",
            quality: "good",
            points: 1,
            coaching: "Correct but lacks the mechanistic explanation.",
            coachingDetail:
              "Citing the PI is accurate, but an academic neurologist will want to understand the pharmacological rationale, not just the regulatory guidance. The stronger response explains why no washout is needed (same mechanism, no interaction, short patisiran half-life) rather than just citing the absence of a PI requirement.",
          },
          {
            id: "ean-hp-3d",
            text: "I'd suggest consulting with the Alnylam medical affairs team to confirm the transition protocol.",
            quality: "poor",
            points: 0,
            coaching: "Unnecessary escalation — you should know this protocol.",
            coachingDetail:
              "Referring a straightforward transition question to medical affairs signals a knowledge gap. The transition protocol (no washout, switch on day of next scheduled infusion) is standard knowledge for a Senior Product Specialist. Escalating this question undermines your credibility as a clinical resource.",
          },
        ],
      },
      {
        id: "ean-hp-4",
        hcpStatement:
          "She's 55 and still wants to have children — she mentioned she might try for a second pregnancy in the next 2 years. Is AMVUTTRA safe in pregnancy?",
        hcpMood: "skeptical",
        context: "Reproductive safety — pregnancy and contraception",
        difficultyLabel: "Challenging",
        bestResponseId: "ean-hp-4b",
        choices: [
          {
            id: "ean-hp-4a",
            text: "AMVUTTRA is safe in pregnancy — there are no contraindications listed in the prescribing information.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect and dangerous — AMVUTTRA is contraindicated in pregnancy.",
            coachingDetail:
              "AMVUTTRA carries a BLACK BOX WARNING for embryo-fetal toxicity. It is contraindicated in pregnancy. Animal studies showed embryo-fetal lethality and teratogenicity. Female patients of reproductive potential must use effective contraception during treatment and for 7 months after the last dose. This is a critical safety fact — providing incorrect information here is a serious compliance and patient safety issue.",
          },
          {
            id: "ean-hp-4b",
            text: "This is a critical safety point — AMVUTTRA has a black box warning for embryo-fetal toxicity. It is contraindicated in pregnancy. Female patients of reproductive potential must use effective contraception during treatment and for 7 months after the last dose. If she's planning a pregnancy in the next 2 years, we need to have a serious conversation about timing: she would need to discontinue AMVUTTRA at least 7 months before attempting conception. I'd strongly recommend a reproductive endocrinology consultation and a discussion with you about whether patisiran — which has a different reproductive safety profile — might be more appropriate given her family planning goals.",
            quality: "excellent",
            points: 3,
            coaching: "Correct, safety-first, and appropriately comprehensive.",
            coachingDetail:
              "This response demonstrates mastery of a critical safety issue: black box warning, contraindication in pregnancy, 7-month post-dose contraception requirement, and the clinical implication for a patient planning pregnancy. Crucially, you also acknowledged that patisiran might be more appropriate given her family planning goals — this is the kind of patient-centred, honest guidance that builds long-term trust with a physician.",
          },
          {
            id: "ean-hp-4c",
            text: "AMVUTTRA should be used with caution in women of reproductive age — I'd recommend discussing contraception.",
            quality: "poor",
            points: 0,
            coaching: "Significant understatement of a black box warning.",
            coachingDetail:
              "AMVUTTRA is not just 'use with caution' — it has a BLACK BOX WARNING for embryo-fetal toxicity and is contraindicated in pregnancy. Describing this as 'use with caution' significantly understates the severity and could lead to a patient harm event. This is one of the most important safety facts for AMVUTTRA and must be communicated accurately.",
          },
          {
            id: "ean-hp-4d",
            text: "The reproductive safety data for AMVUTTRA is limited — I'd recommend checking the latest prescribing information.",
            quality: "poor",
            points: 0,
            coaching: "Evasive — this is a known, critical safety issue you must know.",
            coachingDetail:
              "Saying the data is 'limited' and suggesting the physician check the PI is evasive and signals a knowledge gap on a critical safety issue. The black box warning for embryo-fetal toxicity is a core safety fact for AMVUTTRA that every product specialist must know and communicate accurately.",
          },
        ],
      },
      {
        id: "ean-hp-5",
        hcpStatement:
          "Alright — let's say I have a different patient, a 60-year-old male with V30M, Stage 1, who's just been diagnosed and is treatment-naive. What would you recommend?",
        hcpMood: "interested",
        context: "New patient scenario — treatment-naive hATTR-PN Stage 1",
        difficultyLabel: "Easy",
        bestResponseId: "ean-hp-5b",
        choices: [
          {
            id: "ean-hp-5a",
            text: "AMVUTTRA is the best option — it's the most convenient RNAi therapy available.",
            quality: "poor",
            points: 0,
            coaching: "Convenience-first argument misses the clinical urgency of Stage 1.",
            coachingDetail:
              "For a treatment-naive Stage 1 patient, the primary argument is clinical: early initiation at Stage 1 is associated with better NIS+7 outcomes than waiting until Stage 2. The HELIOS-A data supports this. Lead with the clinical urgency of early treatment, then mention the convenience advantage.",
          },
          {
            id: "ean-hp-5b",
            text: "For a treatment-naive Stage 1 patient, the most important message is timing: the HELIOS-A data shows that patients who start vutrisiran at Stage 1 have better NIS+7 outcomes than those who start at Stage 2. The window of maximum benefit is early. AMVUTTRA 25 mg SC Q3M is my recommendation: no REMS, no premedication, no infusion centre — he can receive his injection at your office quarterly. Pre-treatment: baseline vitamin A, ophthalmology referral, RDA supplementation. Alnylam Assist® handles the PA and nurse support.",
            quality: "excellent",
            points: 3,
            coaching: "Clinical urgency + practical protocol + support pathway — complete answer.",
            coachingDetail:
              "This response leads with the most important clinical message (early initiation at Stage 1), cites the HELIOS-A evidence, provides the complete pre-treatment checklist, and offers the support pathway. The framing of 'the window of maximum benefit is early' creates appropriate urgency without being alarmist.",
          },
          {
            id: "ean-hp-5c",
            text: "He could also consider inotersen or eplontersen — both are ASO therapies with strong hATTR-PN data.",
            quality: "good",
            points: 1,
            coaching: "Balanced, but you're recommending competitor products.",
            coachingDetail:
              "Mentioning competitor therapies shows scientific balance and builds trust, but in a sales context, you should lead with AMVUTTRA's advantages before acknowledging alternatives. The response also doesn't make the case for why AMVUTTRA is the preferred choice for this specific patient (convenience, no REMS, no premedication).",
          },
          {
            id: "ean-hp-5d",
            text: "I'd wait until Stage 2 to start treatment — the data is stronger at that stage.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect — early initiation at Stage 1 is associated with better outcomes.",
            coachingDetail:
              "Recommending to wait until Stage 2 is clinically incorrect. The HELIOS-A data and the broader hATTR-PN literature support early initiation at Stage 1. Waiting allows further amyloid deposition and nerve damage that may be irreversible. This recommendation could directly harm a patient.",
          },
        ],
      },
    ],
  },

  // ─── Busy Internist ─────────────────────────────────────────────────────────
  "busy-internist": {
    "diagnostic-delay": [
      {
        id: "bi-dd-1",
        hcpStatement:
          "Look, I see 30 patients a day. I don't have time to screen everyone for ATTR. How do I know which patients are actually worth investigating?",
        hcpMood: "resistant",
        context: "Time pressure — needs a fast, practical screening filter",
        difficultyLabel: "Moderate",
        bestResponseId: "bi-dd-1b",
        choices: [
          {
            id: "bi-dd-1a",
            text: "ATTR is actually more common than you might think — the prevalence in HFpEF is up to 13%.",
            quality: "good",
            points: 1,
            coaching: "Relevant data point, but doesn't solve the time problem.",
            coachingDetail:
              "Quoting prevalence data is useful, but a busy internist needs a practical filter, not a statistic. The response doesn't answer the core question: which specific patients in my panel should I screen? Follow up with the 3-red-flag rule.",
          },
          {
            id: "bi-dd-1b",
            text: "I understand — you need a fast filter, not a screening programme. The 3-red-flag rule: if a patient has HFpEF plus any two of these three — bilateral carpal tunnel syndrome, low-voltage ECG, or unexplained peripheral neuropathy — the pre-test probability of ATTR is high enough to justify a Tc-PYP scan. That's it. You don't need to screen everyone — just flag the patients who already have two of the three. In a 30-patient day, that might be 1–2 patients per week.",
            quality: "excellent",
            points: 3,
            coaching: "Perfect — practical, fast, and immediately actionable.",
            coachingDetail:
              "The 3-red-flag rule (HFpEF + 2 of 3: bilateral CTS, low-voltage ECG, unexplained PN) is the most efficient screening tool for a busy generalist. By quantifying the expected volume (1–2 patients per week), you've made the ask feel manageable rather than overwhelming. This is the kind of practical clinical tool that a busy internist will actually use.",
          },
          {
            id: "bi-dd-1c",
            text: "You could refer all your HFpEF patients to cardiology for ATTR screening.",
            quality: "poor",
            points: 0,
            coaching: "Adds workload rather than reducing it.",
            coachingDetail:
              "Referring all HFpEF patients to cardiology for ATTR screening creates a significant referral burden and doesn't solve the physician's time problem — it just transfers it. The internist needs a filter they can apply themselves in the office, not a blanket referral strategy.",
          },
          {
            id: "bi-dd-1d",
            text: "There's a validated ATTR screening app — I can send you the link.",
            quality: "poor",
            points: 0,
            coaching: "Technology-first misses the clinical conversation.",
            coachingDetail:
              "Offering an app without explaining the clinical rationale doesn't build the physician's understanding of who to screen. The 3-red-flag rule is simple enough to remember without an app, and leading with the clinical logic builds more durable behaviour change.",
          },
        ],
      },
      {
        id: "bi-dd-2",
        hcpStatement:
          "I ordered a Tc-PYP scan for a patient last month and the result came back Grade 2. What does that mean and what do I do next?",
        hcpMood: "curious",
        context: "Tc-PYP interpretation — Grade 2 result",
        difficultyLabel: "Challenging",
        bestResponseId: "bi-dd-2b",
        choices: [
          {
            id: "bi-dd-2a",
            text: "Grade 2 is positive — you can diagnose ATTR-CM and start treatment.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect — Grade 2 requires haematologic workup first.",
            coachingDetail:
              "A Grade 2 Tc-PYP result is consistent with ATTR-CM but is NOT diagnostic on its own. The Gillmore criteria require a mandatory haematologic workup (serum and urine protein electrophoresis + free light chains) to exclude AL amyloidosis before a non-biopsy diagnosis can be made. Starting treatment without this workup could result in treating AL amyloidosis with an ATTR-targeted therapy — a serious clinical error.",
          },
          {
            id: "bi-dd-2b",
            text: "Grade 2 is a positive scan — it's consistent with ATTR-CM. But before you can make a non-biopsy diagnosis, you must complete a haematologic workup: serum and urine protein electrophoresis plus free light chains. This is mandatory to exclude AL amyloidosis, which can also cause a positive Tc-PYP. If the haematologic workup is negative and the scan is Grade 2 or 3, you have a non-biopsy diagnosis of ATTR-CM per the Gillmore criteria. Also order TTR genetic testing to distinguish wild-type from hereditary ATTR.",
            quality: "excellent",
            points: 3,
            coaching: "Complete and clinically precise — exactly what a busy internist needs.",
            coachingDetail:
              "This response correctly explains the Gillmore criteria for non-biopsy ATTR-CM diagnosis, emphasises the mandatory haematologic workup to exclude AL amyloidosis, and adds the important step of TTR genetic testing. This is the kind of clinical guidance that positions you as a trusted resource rather than just a sales representative.",
          },
          {
            id: "bi-dd-2c",
            text: "Grade 2 means moderate cardiac uptake — you should refer to a cardiologist or amyloid specialist for interpretation.",
            quality: "good",
            points: 1,
            coaching: "Appropriate referral, but misses the critical haematologic workup step.",
            coachingDetail:
              "Referring to a specialist is appropriate, but the most important immediate action — the haematologic workup to exclude AL amyloidosis — should be communicated to the internist so they can order it before or alongside the referral. Waiting for the specialist to order it delays diagnosis.",
          },
          {
            id: "bi-dd-2d",
            text: "Grade 2 is borderline — you might want to repeat the scan in 6 months to confirm.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect — Grade 2 is a positive result, not borderline.",
            coachingDetail:
              "In the Gillmore criteria, Grades 2 and 3 are both positive results consistent with ATTR-CM. Grade 1 is equivocal. Recommending a repeat scan delays diagnosis and treatment in a patient who likely has ATTR-CM. The correct next step is the haematologic workup, not watchful waiting.",
          },
        ],
      },
      {
        id: "bi-dd-3",
        hcpStatement:
          "My patient has a confirmed ATTR-CM diagnosis. He's 82 years old and his family is asking whether treatment is appropriate at his age. What's the evidence in older patients?",
        hcpMood: "curious",
        context: "Age-related treatment decision — elderly patient",
        difficultyLabel: "Moderate",
        bestResponseId: "bi-dd-3b",
        choices: [
          {
            id: "bi-dd-3a",
            text: "AMVUTTRA hasn't been specifically studied in patients over 80.",
            quality: "poor",
            points: 0,
            coaching: "True but unhelpful — doesn't address the clinical question.",
            coachingDetail:
              "While the HELIOS-B trial had an upper age limit, the mean age was 76 and a substantial proportion of patients were over 75. Saying the drug hasn't been studied in patients over 80 without providing context leaves the physician without guidance. The correct response addresses the available evidence and the clinical rationale for treatment in elderly patients.",
          },
          {
            id: "bi-dd-3b",
            text: "The HELIOS-B trial mean age was 76 — so the evidence base is directly relevant to an 82-year-old. The key question isn't age per se, but functional status and goals of care. ATTR-CM is a progressive, fatal disease — without treatment, median survival from diagnosis is 2–5 years. The HELIOS-B mortality benefit (HR 0.65) was consistent across age subgroups. For an 82-year-old with preserved functional status and a goal of maintaining independence, treatment is clinically appropriate. The Q3M SC dosing is also particularly well-suited to elderly patients — no infusion centre visits, no premedication burden.",
            quality: "excellent",
            points: 3,
            coaching: "Evidence-based, patient-centred, and addresses the family's concern.",
            coachingDetail:
              "This response reframes the question from 'is he too old?' to 'what are his functional status and goals of care?' — which is the clinically correct framing. It provides the relevant evidence (HELIOS-B mean age 76, consistent mortality benefit across age subgroups), contextualises the prognosis (2–5 year median survival without treatment), and connects the Q3M SC dosing to the practical needs of an elderly patient.",
          },
          {
            id: "bi-dd-3c",
            text: "At 82, the family should consider whether the patient's quality of life would benefit from treatment — it's a personal decision.",
            quality: "good",
            points: 1,
            coaching: "Appropriate acknowledgment of patient autonomy, but lacks clinical guidance.",
            coachingDetail:
              "Acknowledging the family's role in decision-making is appropriate, but the physician is asking for clinical evidence to inform that conversation. Without providing the HELIOS-B data and the prognosis context, you're not giving the physician the tools they need to have a meaningful goals-of-care discussion.",
          },
          {
            id: "bi-dd-3d",
            text: "Tafamidis might be a better option for an elderly patient — it's a simpler oral therapy.",
            quality: "poor",
            points: 0,
            coaching: "Recommending a competitor without clinical justification.",
            coachingDetail:
              "Recommending tafamidis over AMVUTTRA for an elderly patient without clinical justification is not appropriate. AMVUTTRA's Q3M SC dosing is actually better suited to elderly patients than daily oral tafamidis (which requires daily adherence). The mortality benefit in HELIOS-B (HR 0.65) also exceeds the ATTR-ACT tafamidis data.",
          },
        ],
      },
      {
        id: "bi-dd-4",
        hcpStatement:
          "What's the referral pathway? If I diagnose ATTR-CM, do I need to refer to a specialist to prescribe AMVUTTRA, or can I prescribe it myself?",
        hcpMood: "curious",
        context: "Prescribing pathway — generalist vs. specialist",
        difficultyLabel: "Easy",
        bestResponseId: "bi-dd-4b",
        choices: [
          {
            id: "bi-dd-4a",
            text: "AMVUTTRA requires a specialist to prescribe — you'll need to refer to cardiology or an amyloid centre.",
            quality: "poor",
            points: 0,
            coaching: "Incorrect — there is no specialist-only prescribing restriction.",
            coachingDetail:
              "AMVUTTRA does not have a REMS programme and is not restricted to specialist prescribers. Any licensed physician can prescribe it. While referral to a specialist for complex cases is appropriate, telling a physician they cannot prescribe it themselves creates an unnecessary barrier to treatment initiation.",
          },
          {
            id: "bi-dd-4b",
            text: "There's no REMS and no specialist-only prescribing restriction — you can prescribe AMVUTTRA yourself if you're comfortable with the diagnosis and monitoring protocol. The Alnylam Assist® programme provides a dedicated access specialist who handles the PA, specialty pharmacy coordination, and nurse educator support for the first injection. For complex cases or patients with advanced disease, a referral to a cardiologist or amyloid centre is appropriate, but it's not required for prescribing.",
            quality: "excellent",
            points: 3,
            coaching: "Empowering and accurate — removes the prescribing barrier.",
            coachingDetail:
              "This response empowers the internist to prescribe without creating unnecessary referral barriers, while appropriately noting when specialist referral is clinically appropriate. Mentioning Alnylam Assist® reduces the physician's administrative burden, which is a key concern for a busy internist.",
          },
          {
            id: "bi-dd-4c",
            text: "I'd recommend referring to cardiology for the initial prescription — they'll be more familiar with the monitoring protocol.",
            quality: "good",
            points: 1,
            coaching: "Appropriate for complex cases, but creates an unnecessary barrier for straightforward cases.",
            coachingDetail:
              "Referral to cardiology is appropriate for complex cases, but for a straightforward ATTR-CM diagnosis in a patient with no complicating factors, an internist who is comfortable with the diagnosis can prescribe AMVUTTRA directly. Creating a mandatory referral step delays treatment initiation.",
          },
          {
            id: "bi-dd-4d",
            text: "AMVUTTRA is a specialty drug — it has to be dispensed through a specialty pharmacy, which your practice may not have access to.",
            quality: "poor",
            points: 0,
            coaching: "Creates a barrier without providing the solution.",
            coachingDetail:
              "While AMVUTTRA is dispensed through specialty pharmacies, the Alnylam Assist® programme coordinates the specialty pharmacy relationship on behalf of the prescriber. The correct response acknowledges the specialty pharmacy requirement but immediately explains that Alnylam Assist® handles this coordination, removing the barrier.",
          },
        ],
      },
      {
        id: "bi-dd-5",
        hcpStatement:
          "I'm worried about the prior authorisation process. My last rare disease PA took 3 months. Is there support for that?",
        hcpMood: "resistant",
        context: "Access barrier — prior authorisation experience",
        difficultyLabel: "Easy",
        bestResponseId: "bi-dd-5b",
        choices: [
          {
            id: "bi-dd-5a",
            text: "PA timelines vary by payer — some are faster than others. I can't guarantee a specific timeline.",
            quality: "poor",
            points: 0,
            coaching: "Honest but unhelpful — doesn't address the physician's concern.",
            coachingDetail:
              "Acknowledging variability without offering a solution leaves the physician with their concern unresolved. The correct response explains the Alnylam Assist® PA navigation service, which actively manages the PA process and can significantly reduce timelines compared to unassisted PA submissions.",
          },
          {
            id: "bi-dd-5b",
            text: "That's a legitimate concern — and it's exactly what Alnylam Assist® is designed to address. They have a dedicated PA navigation team that manages the entire prior authorisation process on your behalf: they know the specific criteria for each major payer, prepare the clinical documentation, and follow up proactively. For commercially insured patients, they also offer a $0 co-pay programme. If the PA is denied, they manage the appeals process. In practice, the Alnylam Assist® team significantly reduces the administrative burden compared to an unassisted PA submission.",
            quality: "excellent",
            points: 3,
            coaching: "Directly addresses the concern with a concrete solution.",
            coachingDetail:
              "This response validates the physician's concern (a 3-month PA experience is a real barrier), explains the specific Alnylam Assist® PA navigation service, and provides the concrete benefits: payer-specific expertise, documentation preparation, proactive follow-up, appeals management, and co-pay support. This is the kind of response that converts a hesitant prescriber into a confident one.",
          },
          {
            id: "bi-dd-5c",
            text: "I can connect you with the Alnylam Assist® team — they handle the PA process.",
            quality: "good",
            points: 1,
            coaching: "Correct direction, but lacks the detail that builds confidence.",
            coachingDetail:
              "Connecting the physician with Alnylam Assist® is the right action, but the response doesn't explain what Alnylam Assist® actually does, which leaves the physician uncertain about whether it will actually solve their PA problem. The stronger response explains the specific services provided.",
          },
          {
            id: "bi-dd-5d",
            text: "AMVUTTRA has strong clinical data — most payers approve it quickly because the evidence is compelling.",
            quality: "poor",
            points: 0,
            coaching: "Overpromising — PA timelines depend on payer policies, not just clinical data.",
            coachingDetail:
              "Claiming that strong clinical data leads to fast PA approvals is an overpromise. PA timelines are determined by payer-specific policies, formulary status, and administrative processes — not clinical evidence quality. This claim will damage your credibility if the physician's next PA takes 3 months.",
          },
        ],
      },
    ],
  },

  // ─── Cost-Conscious Haematologist ────────────────────────────────────────────
  "cost-conscious-hematologist": {
    "access-formulary": [
      {
        id: "cch-af-1",
        hcpStatement:
          "AMVUTTRA's list price is over $400,000 per year. How do you justify that cost to a patient or a payer?",
        hcpMood: "skeptical",
        context: "Cost challenge — list price vs. value",
        difficultyLabel: "Challenging",
        bestResponseId: "cch-af-1b",
        choices: [
          {
            id: "cch-af-1a",
            text: "The list price reflects the cost of developing a novel RNAi therapy for a rare disease — it's consistent with the rare disease market.",
            quality: "poor",
            points: 0,
            coaching: "Justifying price with development costs is not a clinical or economic argument.",
            coachingDetail:
              "Explaining price with development costs is a pharmaceutical industry argument, not a clinical or health economic argument. A haematologist or payer cares about value — what outcomes does the drug deliver per dollar spent? The correct response frames the cost in terms of the clinical benefit and the cost of the disease without treatment.",
          },
          {
            id: "cch-af-1b",
            text: "The cost needs to be framed against the alternative. ATTR-CM without treatment carries a median survival of 2–5 years and a trajectory of progressive heart failure hospitalisations — each HF hospitalisation costs $15,000–$30,000. The HELIOS-B data showed a 35% reduction in all-cause mortality and a 28% reduction in CV events over 42 months. Health economic modelling suggests AMVUTTRA is cost-effective at a threshold of $150,000/QALY in ATTR-CM. For commercially insured patients, the net cost after Alnylam Assist® co-pay support is often significantly lower than the list price.",
            quality: "excellent",
            points: 3,
            coaching: "Value-based framing with health economic context — the right approach.",
            coachingDetail:
              "This response reframes the cost question as a value question: what does the disease cost without treatment (hospitalisations, mortality), and what does AMVUTTRA deliver (35% mortality reduction, 28% CV event reduction)? The health economic modelling reference ($150K/QALY threshold) provides a payer-relevant framework. Mentioning the co-pay support addresses the patient-level cost concern.",
          },
          {
            id: "cch-af-1c",
            text: "Most major payers have AMVUTTRA on formulary now — the access situation has improved significantly.",
            quality: "good",
            points: 1,
            coaching: "Relevant access update, but doesn't address the value question.",
            coachingDetail:
              "Formulary status is relevant but doesn't answer the cost justification question. A haematologist asking about cost justification wants a value argument, not a formulary update. Provide the health economic context first, then mention formulary status as supporting evidence.",
          },
          {
            id: "cch-af-1d",
            text: "Alnylam offers a patient assistance programme for uninsured patients.",
            quality: "poor",
            points: 0,
            coaching: "Patient assistance is for uninsured patients — not the payer justification question.",
            coachingDetail:
              "The physician is asking how to justify the cost to a payer, not asking about uninsured patient support. Mentioning patient assistance programmes is a non-sequitur that suggests you've misunderstood the question.",
          },
        ],
      },
      {
        id: "cch-af-2",
        hcpStatement:
          "My hospital formulary committee is meeting next month. What data should I present to get AMVUTTRA approved?",
        hcpMood: "interested",
        context: "Formulary submission — P&T committee support",
        difficultyLabel: "Moderate",
        bestResponseId: "cch-af-2b",
        choices: [
          {
            id: "cch-af-2a",
            text: "I can send you the full prescribing information and the HELIOS-B publication.",
            quality: "good",
            points: 1,
            coaching: "Useful resources, but a P&T committee needs a structured value dossier.",
            coachingDetail:
              "The PI and a single publication are a starting point, but a P&T committee needs a structured formulary dossier covering: disease burden, unmet need, clinical evidence (efficacy + safety), comparative effectiveness, health economics, and access/support services. Offering to connect the physician with the Alnylam medical affairs team for a formal formulary support package is the stronger response.",
          },
          {
            id: "cch-af-2b",
            text: "A P&T submission for AMVUTTRA should cover five areas: (1) Disease burden — ATTR-CM prevalence 300,000+ in the US, median survival 2–5 years without treatment; (2) Clinical evidence — HELIOS-B: 28% CV composite reduction, 35% all-cause mortality reduction, 42-month follow-up; (3) Comparative effectiveness — only therapy approved for both ATTR-CM and hATTR-PN, vs. tafamidis (ATTR-CM only, no mortality primary endpoint); (4) Health economics — cost per QALY modelling; (5) Access — Alnylam Assist® PA navigation, co-pay support. I can connect you with the Alnylam medical affairs team who can provide a formal formulary support dossier tailored to your committee's format.",
            quality: "excellent",
            points: 3,
            coaching: "Structured, comprehensive, and immediately actionable.",
            coachingDetail:
              "This response provides a complete P&T submission framework in a memorable 5-point structure, demonstrates deep product knowledge, and offers a concrete next step (medical affairs formulary dossier). The comparative effectiveness point (only therapy approved for both indications) is a strong differentiator for a formulary committee evaluating the ATTR treatment landscape.",
          },
          {
            id: "cch-af-2c",
            text: "Focus on the mortality data — 35% reduction in all-cause mortality is the most compelling number for a formulary committee.",
            quality: "good",
            points: 1,
            coaching: "Strong headline, but a P&T committee needs more than one data point.",
            coachingDetail:
              "The 35% mortality reduction is indeed the most compelling headline, but a P&T committee will also evaluate safety, comparative effectiveness, health economics, and access. Leading with mortality is correct, but the response should indicate that a full dossier is available.",
          },
          {
            id: "cch-af-2d",
            text: "I'll email you our standard formulary kit — it has everything you need.",
            quality: "poor",
            points: 0,
            coaching: "Passive response — misses the opportunity to engage and guide.",
            coachingDetail:
              "Sending a generic formulary kit without explaining what it contains or how to use it for the specific committee format is a missed opportunity. The physician is asking for guidance on how to present the data — they need a conversation, not just a document.",
          },
        ],
      },
      {
        id: "cch-af-3",
        hcpStatement:
          "We have a patient on patisiran who has good insurance. Is there any clinical reason to switch to AMVUTTRA, or is it purely a convenience argument?",
        hcpMood: "skeptical",
        context: "Switch decision — stable patient on patisiran with good insurance",
        difficultyLabel: "Challenging",
        bestResponseId: "cch-af-3b",
        choices: [
          {
            id: "cch-af-3a",
            text: "AMVUTTRA has superior efficacy data compared to patisiran.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect — no head-to-head trial exists.",
            coachingDetail:
              "There is no head-to-head trial between vutrisiran and patisiran. Claiming superior efficacy without comparative data is a compliance violation and will immediately destroy your credibility with a scientifically rigorous haematologist. The correct framing is equivalent mechanism with meaningful practical differences.",
          },
          {
            id: "cch-af-3b",
            text: "Honestly, for a stable patient with good insurance and no adherence issues, the clinical urgency to switch is low. The convenience argument is real — 4 SC injections vs. 17 IV infusions per year, no premedication — but if the patient is doing well and values the relationship with their infusion centre team, that's a legitimate reason to stay. Where the clinical argument becomes stronger is if the patient has any adherence gaps, travel constraints, or if they're developing vitamin A deficiency symptoms — nyctalopia, dry eyes — which can occur with patisiran too. In those cases, AMVUTTRA's Q3M schedule and equivalent TTR suppression make it the better choice.",
            quality: "excellent",
            points: 3,
            coaching: "Honest, nuanced, and builds long-term trust.",
            coachingDetail:
              "This response builds enormous credibility by acknowledging that there's no urgent clinical reason to switch a stable, well-insured patient — and then identifying the specific clinical scenarios where a switch is genuinely warranted (adherence gaps, travel, vitamin A symptoms). The honesty about the convenience-first argument is counterintuitive but highly effective with a scientifically rigorous physician.",
          },
          {
            id: "cch-af-3c",
            text: "The Q3M dosing is a significant quality-of-life improvement — 4 injections vs. 17 infusions per year is a meaningful difference for most patients.",
            quality: "good",
            points: 1,
            coaching: "Valid convenience argument, but doesn't address the 'purely convenience?' question.",
            coachingDetail:
              "The physician specifically asked whether there's a clinical reason beyond convenience. The convenience argument alone doesn't fully answer the question. The stronger response acknowledges the convenience argument, but also identifies the specific clinical scenarios where a switch is warranted.",
          },
          {
            id: "cch-af-3d",
            text: "AMVUTTRA doesn't require premedication — that reduces the cumulative corticosteroid exposure over time, which is a clinical benefit.",
            quality: "good",
            points: 1,
            coaching: "Valid clinical point, but overstated for a stable patient.",
            coachingDetail:
              "The premedication burden (corticosteroids + antihistamines + paracetamol before each patisiran infusion) is a legitimate long-term safety consideration, especially for elderly patients with diabetes or osteoporosis. However, for a stable patient with good insurance and no complicating factors, this is a secondary consideration.",
          },
        ],
      },
      {
        id: "cch-af-4",
        hcpStatement:
          "What's the co-pay situation for Medicare patients? ATTR-CM is primarily a disease of the elderly.",
        hcpMood: "curious",
        context: "Medicare coverage — elderly patient population",
        difficultyLabel: "Moderate",
        bestResponseId: "cch-af-4b",
        choices: [
          {
            id: "cch-af-4a",
            text: "Medicare Part D covers AMVUTTRA — patients just need to check their specific plan formulary.",
            quality: "good",
            points: 1,
            coaching: "Correct but incomplete — doesn't address the co-pay concern.",
            coachingDetail:
              "Medicare Part D coverage is correct, but the physician is asking about the co-pay situation — which is the key financial concern for elderly patients on fixed incomes. The response should address the Medicare co-pay structure and the available assistance options.",
          },
          {
            id: "cch-af-4b",
            text: "For Medicare patients, AMVUTTRA is covered under Part D. The co-pay situation improved significantly with the Inflation Reduction Act — Medicare Part D out-of-pocket costs are now capped at $2,000 per year for 2025 onwards. For patients who still face a coverage gap, Alnylam has a Medicare patient assistance programme. The Alnylam Assist® team can run a benefits investigation for any specific patient to determine their exact out-of-pocket cost before the prescription is written — which removes the financial surprise for both the patient and the physician.",
            quality: "excellent",
            points: 3,
            coaching: "Current, accurate, and patient-centred — demonstrates policy awareness.",
            coachingDetail:
              "This response demonstrates awareness of the Inflation Reduction Act's impact on Medicare Part D out-of-pocket costs (the $2,000 annual cap from 2025), which is directly relevant to the ATTR-CM population. The offer of a benefits investigation before prescribing is a practical service that reduces financial risk for both the patient and the physician.",
          },
          {
            id: "cch-af-4c",
            text: "The $0 co-pay programme covers Medicare patients too.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect — the $0 co-pay programme is for commercially insured patients only.",
            coachingDetail:
              "The Alnylam Assist® $0 co-pay programme is available to commercially insured patients only — it cannot be used for Medicare or Medicaid patients due to federal anti-kickback regulations. Telling a physician that Medicare patients qualify for $0 co-pay is a compliance violation and will damage your credibility when the patient's pharmacy benefit is processed.",
          },
          {
            id: "cch-af-4d",
            text: "Medicare coverage for specialty drugs can be complex — I'd recommend the patient speak with a pharmacist.",
            quality: "poor",
            points: 0,
            coaching: "Deflection — the physician needs guidance, not a referral to a pharmacist.",
            coachingDetail:
              "Referring the physician to a pharmacist for Medicare coverage questions signals that you don't know the answer. A Senior Product Specialist should be able to explain the Medicare Part D coverage structure, the IRA out-of-pocket cap, and the Alnylam Assist® benefits investigation service.",
          },
        ],
      },
      {
        id: "cch-af-5",
        hcpStatement:
          "I have a patient who was denied PA for AMVUTTRA. The payer said the patient needs to try tafamidis first. What do I do?",
        hcpMood: "resistant",
        context: "PA denial — step therapy requirement",
        difficultyLabel: "Challenging",
        bestResponseId: "cch-af-5b",
        choices: [
          {
            id: "cch-af-5a",
            text: "Step therapy for ATTR-CM is inappropriate — tafamidis and AMVUTTRA have different mechanisms and indications.",
            quality: "good",
            points: 1,
            coaching: "Correct clinical argument, but doesn't provide the practical next steps.",
            coachingDetail:
              "The clinical argument against step therapy is valid — tafamidis is a tetramer stabiliser with different mechanism, different evidence base, and no hATTR-PN indication. However, the physician needs to know the specific steps to appeal the denial, not just the clinical rationale.",
          },
          {
            id: "cch-af-5b",
            text: "First, contact Alnylam Assist® immediately — they have a dedicated appeals team that handles step therapy denials. The appeal should include: (1) the clinical distinction between AMVUTTRA (RNAi, 88% TTR suppression, dual indication) and tafamidis (tetramer stabiliser, ATTR-CM only); (2) the HELIOS-B mortality data (HR 0.65) vs. ATTR-ACT; (3) a letter of medical necessity from you explaining why AMVUTTRA is clinically appropriate for this specific patient. Many step therapy denials for AMVUTTRA are overturned on first appeal when the clinical distinction is clearly documented. Alnylam Assist® will prepare the appeal documentation — you just need to sign the letter of medical necessity.",
            quality: "excellent",
            points: 3,
            coaching: "Actionable, specific, and empowering — exactly what the physician needs.",
            coachingDetail:
              "This response provides a clear action plan: contact Alnylam Assist® immediately, explains the three components of a successful appeal (clinical distinction, comparative evidence, letter of medical necessity), and sets realistic expectations (many step therapy denials are overturned on first appeal). The offer to have Alnylam Assist® prepare the documentation reduces the physician's workload to a single signature.",
          },
          {
            id: "cch-af-5c",
            text: "You could start the patient on tafamidis to satisfy the step therapy requirement, then switch to AMVUTTRA after 90 days.",
            quality: "poor",
            points: 0,
            coaching: "Delays optimal treatment — appeal is the correct first step.",
            coachingDetail:
              "Starting a patient on tafamidis to satisfy a step therapy requirement delays initiation of the clinically appropriate therapy by at least 90 days. During this period, the patient continues to have suboptimal TTR suppression. The correct first step is to appeal the denial, not to comply with an inappropriate step therapy requirement.",
          },
          {
            id: "cch-af-5d",
            text: "Step therapy requirements are common for specialty drugs — unfortunately there's not much we can do.",
            quality: "wrong",
            points: -1,
            coaching: "Incorrect and defeatist — most step therapy denials can be appealed successfully.",
            coachingDetail:
              "Telling a physician that nothing can be done about a step therapy denial is clinically and professionally incorrect. Step therapy denials for AMVUTTRA can be appealed, and many are overturned when the clinical distinction from tafamidis is clearly documented. This response abandons the patient and the physician.",
          },
        ],
      },
    ],
  },
};

// ─── Fallback Dialogues (for archetype/scenario combos without specific data) ─

const FALLBACK_DIALOGUES: DialogueTurn[] = [
  {
    id: "fb-1",
    hcpStatement:
      "I've heard about AMVUTTRA but I'm not familiar with the clinical data. Can you give me the headline numbers?",
    hcpMood: "curious",
    context: "Opening — physician requesting overview",
    difficultyLabel: "Easy",
    bestResponseId: "fb-1b",
    choices: [
      {
        id: "fb-1a",
        text: "AMVUTTRA is a once-quarterly injection that's very convenient for patients.",
        quality: "poor",
        points: 0,
        coaching: "Convenience-first misses the clinical data request.",
        coachingDetail: "The physician asked for clinical data, not administration details. Lead with the headline outcomes: HELIOS-B 28% CV composite reduction and 35% all-cause mortality reduction for ATTR-CM, and HELIOS-A NIS+7 improvement for hATTR-PN.",
      },
      {
        id: "fb-1b",
        text: "The two pivotal trials are HELIOS-B for ATTR-CM and HELIOS-A for hATTR-PN. HELIOS-B: 655 patients, 42 months — 28% reduction in CV composite (HR 0.72, P=0.01) and 35% reduction in all-cause mortality (HR 0.65, P=0.01). HELIOS-A: NIS+7 improved by −2.2 points vs. +14.8 on placebo at 9 months. Both trials used 25 mg SC Q3M — no premedication, no REMS.",
        quality: "excellent",
        points: 3,
        coaching: "Complete, data-driven, and well-structured.",
        coachingDetail: "This response provides the key data points from both pivotal trials in a structured, memorable format. The specific HR values and P-values demonstrate clinical depth, and ending with the administration details connects efficacy to convenience.",
      },
      {
        id: "fb-1c",
        text: "AMVUTTRA was approved by the FDA in 2022 for hATTR-PN and 2025 for ATTR-CM.",
        quality: "good",
        points: 1,
        coaching: "Regulatory history is relevant but doesn't answer the clinical data question.",
        coachingDetail: "Approval dates establish regulatory credibility but don't provide the clinical outcomes data the physician requested. Follow up immediately with the HELIOS-B and HELIOS-A headline numbers.",
      },
      {
        id: "fb-1d",
        text: "I can send you the full prescribing information — it has all the clinical data.",
        quality: "poor",
        points: 0,
        coaching: "Deflection — the physician wants a verbal summary, not a document.",
        coachingDetail: "Offering to send the PI instead of providing a verbal summary signals that you don't know the data well enough to discuss it. A Senior Product Specialist should be able to deliver the headline numbers in 30 seconds without referencing documents.",
      },
    ],
  },
  {
    id: "fb-2",
    hcpStatement: "What's the mechanism? How is this different from tafamidis?",
    hcpMood: "curious",
    context: "Mechanism question — MOA differentiation",
    difficultyLabel: "Easy",
    bestResponseId: "fb-2b",
    choices: [
      {
        id: "fb-2a",
        text: "AMVUTTRA works differently from tafamidis — it's a newer type of therapy.",
        quality: "poor",
        points: 0,
        coaching: "Too vague — 'newer type of therapy' is not a mechanistic explanation.",
        coachingDetail: "The physician asked for the mechanism. Provide it: GalNAc-siRNA → ASGPR-mediated hepatocyte uptake → RISC loading → TTR mRNA cleavage → ~88% TTR suppression. Then contrast with tafamidis: stabilises existing TTR tetramers but doesn't reduce TTR production. Silence the source vs. stabilise the protein.",
      },
      {
        id: "fb-2b",
        text: "AMVUTTRA is a GalNAc-conjugated siRNA. After SC injection, the GalNAc ligand binds ASGPR receptors on hepatocytes — the liver is where TTR is produced. Inside the cell, the siRNA loads into the RISC complex and cleaves TTR mRNA, preventing TTR protein synthesis. The result is ~88% suppression of serum TTR at steady state. Tafamidis works downstream — it stabilises existing TTR tetramers to prevent them from misfolding into amyloid. AMVUTTRA works upstream — it silences the source. The tagline: silence the source, not just stabilise it.",
        quality: "excellent",
        points: 3,
        coaching: "Mechanistically precise, well-structured, and memorable.",
        coachingDetail: "This response walks through the full MOA pathway (GalNAc → ASGPR → RISC → TTR mRNA cleavage) and then makes the key contrast with tafamidis (upstream silencing vs. downstream stabilisation). The tagline 'silence the source, not just stabilise it' is memorable and encapsulates the differentiation in one phrase.",
      },
      {
        id: "fb-2c",
        text: "Tafamidis stabilises TTR tetramers, while AMVUTTRA reduces TTR production by about 88%.",
        quality: "good",
        points: 1,
        coaching: "Correct differentiation, but lacks the mechanistic detail.",
        coachingDetail: "The differentiation is correct and concise, but a physician asking about mechanism will want to understand how AMVUTTRA achieves 88% TTR reduction. The GalNAc-ASGPR-RISC pathway is the 'how' that makes the mechanism credible and memorable.",
      },
      {
        id: "fb-2d",
        text: "Both work on TTR, but AMVUTTRA is an RNAi therapy and tafamidis is a small molecule stabiliser.",
        quality: "good",
        points: 1,
        coaching: "Correct classification but insufficient mechanistic depth.",
        coachingDetail: "Classifying both drugs correctly is a good start, but the physician wants to understand the mechanism, not just the drug class. Expand on how RNAi achieves TTR suppression (GalNAc → ASGPR → RISC → mRNA cleavage) and what that means clinically (~88% suppression vs. stabilisation).",
      },
    ],
  },
  {
    id: "fb-3",
    hcpStatement: "What's the safety profile like? Any major concerns I should know about?",
    hcpMood: "neutral",
    context: "Safety overview request",
    difficultyLabel: "Moderate",
    bestResponseId: "fb-3b",
    choices: [
      {
        id: "fb-3a",
        text: "The safety profile is excellent — AMVUTTRA was very well tolerated in clinical trials.",
        quality: "poor",
        points: 0,
        coaching: "Vague promotional language — not credible to a clinician.",
        coachingDetail: "Saying a drug is 'excellent' and 'very well tolerated' without specifics sounds like marketing. Provide the actual safety data: overall AE rates comparable to placebo in HELIOS-B, the three key safety considerations (vitamin A, fetal harm, injection site reactions), and the management protocol for each.",
      },
      {
        id: "fb-3b",
        text: "Three key safety considerations. First: embryo-fetal toxicity — black box warning, contraindicated in pregnancy, effective contraception required during treatment and 7 months post-dose. Second: vitamin A reduction — AMVUTTRA reduces serum vitamin A by ~65% because TTR is the primary vitamin A transport protein. Supplement at RDA, baseline vitamin A level, ophthalmology referral. Third: injection site reactions — 8% vs. 6% placebo in HELIOS-B, mostly Grade 1. Overall, the adverse event profile in HELIOS-B was comparable to placebo.",
        quality: "excellent",
        points: 3,
        coaching: "Structured, complete, and appropriately balanced.",
        coachingDetail: "This response leads with the most serious safety concern (black box warning for fetal harm), then covers the two class-specific considerations (vitamin A, injection site reactions), and ends with the overall reassurance (comparable to placebo). The structure — most serious first, then class-specific, then overall — is the correct clinical communication approach.",
      },
      {
        id: "fb-3c",
        text: "The main thing to watch is vitamin A levels — AMVUTTRA reduces them because TTR carries vitamin A in the blood.",
        quality: "good",
        points: 1,
        coaching: "Important point, but you've omitted the black box warning.",
        coachingDetail: "Vitamin A management is important, but the black box warning for embryo-fetal toxicity is the most serious safety concern and must be mentioned first. Omitting it in a safety overview is a significant gap that could lead to patient harm.",
      },
      {
        id: "fb-3d",
        text: "There are no major safety concerns — the drug is well tolerated.",
        quality: "wrong",
        points: -1,
        coaching: "Incorrect — AMVUTTRA has a black box warning.",
        coachingDetail: "AMVUTTRA has a BLACK BOX WARNING for embryo-fetal toxicity. Stating there are 'no major safety concerns' is factually incorrect and a serious compliance violation. Always lead with the black box warning when discussing safety.",
      },
    ],
  },
  {
    id: "fb-4",
    hcpStatement: "How does the access and reimbursement work? My patients are always worried about cost.",
    hcpMood: "neutral",
    context: "Access and reimbursement question",
    difficultyLabel: "Easy",
    bestResponseId: "fb-4b",
    choices: [
      {
        id: "fb-4a",
        text: "AMVUTTRA is covered by most insurance plans — cost shouldn't be a barrier.",
        quality: "poor",
        points: 0,
        coaching: "Overconfident claim without specifics.",
        coachingDetail: "Saying 'covered by most insurance plans' without specifics is an unsupported claim. Formulary status varies by payer and is constantly changing. The correct response describes the support infrastructure (Alnylam Assist®) and the specific co-pay support for commercially insured patients, without making blanket coverage claims.",
      },
      {
        id: "fb-4b",
        text: "Alnylam Assist® is the dedicated patient support programme. For eligible commercially insured patients, there's a $0 co-pay programme. For Medicare patients, there's a separate support pathway. The programme also includes a prior authorisation navigator — they handle the PA process so your office doesn't have to. The specialty pharmacy coordinates directly with your office for drug delivery. I'd recommend connecting your office manager with the Alnylam Assist® team — they can assess each patient's specific coverage situation.",
        quality: "excellent",
        points: 3,
        coaching: "Specific, practical, and appropriately qualified.",
        coachingDetail: "This response provides specific information ($0 co-pay for eligible commercially insured patients, separate Medicare pathway), reduces the physician's administrative burden (PA navigator), and offers a concrete next step (connect office manager with Alnylam Assist®). The qualifier 'eligible commercially insured patients' is appropriately precise without overpromising.",
      },
      {
        id: "fb-4c",
        text: "I can connect you with our access specialist who can review the specific coverage for your patients.",
        quality: "good",
        points: 1,
        coaching: "Good support offer, but lead with the key programme details first.",
        coachingDetail: "Connecting the physician with an access specialist is the right next step, but the physician asked about access and cost — they want a summary answer first, then the referral. Lead with the $0 co-pay programme and PA support, then offer the specialist connection.",
      },
      {
        id: "fb-4d",
        text: "The drug is expensive but the clinical benefit justifies the cost.",
        quality: "poor",
        points: 0,
        coaching: "Dismissive of a legitimate patient concern.",
        coachingDetail: "Acknowledging the cost and then saying 'the benefit justifies it' doesn't help a patient who can't afford the drug. The physician is asking about practical access solutions, not a philosophical cost-benefit discussion. Provide the specific support programme information.",
      },
    ],
  },
  {
    id: "fb-5",
    hcpStatement: "OK, I think I have a patient in mind. What are the next steps to get them started?",
    hcpMood: "interested",
    context: "Closing — physician ready to initiate",
    difficultyLabel: "Easy",
    bestResponseId: "fb-5b",
    choices: [
      {
        id: "fb-5a",
        text: "Write the prescription and I'll handle the rest.",
        quality: "wrong",
        points: -1,
        coaching: "Incorrect — AMVUTTRA is HCP-administered, not a standard prescription.",
        coachingDetail: "AMVUTTRA is not a standard pharmacy-dispensed prescription. It's HCP-administered through a specialty pharmacy. A physician who writes a standard prescription will have a confused patient and a failed first experience. Clarify the administration pathway and the pre-treatment checklist.",
      },
      {
        id: "fb-5b",
        text: "Here's the initiation checklist: baseline vitamin A level, ophthalmology referral, and switch any high-dose vitamin A supplements to RDA level before the first injection. AMVUTTRA is HCP-administered — the drug comes through a specialty pharmacy to your office or infusion centre. I'll connect you with Alnylam Assist® for the prior authorisation and nurse support. The first injection is typically scheduled 2–3 weeks after PA approval. I'll follow up with you next week to confirm everything is moving.",
        quality: "excellent",
        points: 3,
        coaching: "Complete initiation protocol with clear next steps.",
        coachingDetail: "This response provides the complete pre-treatment checklist, clarifies the HCP-administration pathway, offers the support infrastructure, sets timeline expectations, and commits to a follow-up. The physician knows exactly what happens next and feels supported through the initiation process.",
      },
      {
        id: "fb-5c",
        text: "I'll send you the initiation guide — it has everything you need.",
        quality: "good",
        points: 1,
        coaching: "Good resource offer, but provide the key steps verbally first.",
        coachingDetail: "Sending the initiation guide is helpful, but the physician is asking for a verbal summary of next steps. Provide the key points (vitamin A baseline, ophthalmology, RDA supplementation, HCP-administered pathway, Alnylam Assist®) verbally, then offer the written guide as a follow-up resource.",
      },
      {
        id: "fb-5d",
        text: "The first step is the prior authorisation — that can take 2–4 weeks.",
        quality: "poor",
        points: 0,
        coaching: "Incomplete — the clinical pre-treatment workup comes before or alongside the PA.",
        coachingDetail: "The prior authorisation is important, but the clinical pre-treatment steps (vitamin A baseline, ophthalmology referral, supplementation counselling) should happen concurrently or before the PA process. Leading with PA timing alone may cause the physician to delay the clinical workup.",
      },
    ],
  },
];

// ─── Get Dialogues for Session ────────────────────────────────────────────────

function getDialogues(archetypeId: string, scenarioId: string): DialogueTurn[] {
  const archetypeDialogues = DIALOGUES[archetypeId];
  if (archetypeDialogues) {
    const scenarioDialogues = archetypeDialogues[scenarioId];
    if (scenarioDialogues && scenarioDialogues.length >= 5) {
      return scenarioDialogues;
    }
  }
  return FALLBACK_DIALOGUES;
}

// ─── Mood Indicator ───────────────────────────────────────────────────────────

function MoodIndicator({ mood }: { mood: DialogueTurn["hcpMood"] }) {
  const moodConfig = {
    neutral: { label: "Neutral", color: "#6B7280", bg: "#6B728022" },
    skeptical: { label: "Sceptical", color: "#E67E22", bg: "#E67E2222" },
    curious: { label: "Curious", color: "#3498DB", bg: "#3498DB22" },
    resistant: { label: "Resistant", color: "#C0392B", bg: "#C0392B22" },
    interested: { label: "Interested", color: "#27AE60", bg: "#27AE6022" },
  };
  const config = moodConfig[mood];
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: config.color, background: config.bg }}
    >
      {config.label}
    </span>
  );
}

// ─── Quality Badge ────────────────────────────────────────────────────────────

function QualityBadge({ quality, points }: { quality: ResponseChoice["quality"]; points: number }) {
  const config = {
    excellent: { label: "Excellent", color: "#27AE60", icon: <CheckCircle size={13} /> },
    good: { label: "Good", color: "#3498DB", icon: <CheckCircle size={13} /> },
    poor: { label: "Poor", color: "#E67E22", icon: <AlertCircle size={13} /> },
    wrong: { label: "Incorrect", color: "#C0392B", icon: <XCircle size={13} /> },
  };
  const c = config[quality];
  return (
    <div className="flex items-center gap-1.5" style={{ color: c.color }}>
      {c.icon}
      <span className="text-xs font-bold">{c.label}</span>
      <span className="text-xs opacity-70">
        {points > 0 ? `+${points}` : points === 0 ? "±0" : points} pts
      </span>
    </div>
  );
}

// ─── Main RolePlayMode Component ──────────────────────────────────────────────

interface RolePlayModeProps {
  archetype: RolePlayArchetype;
  scenario: RolePlayScenario;
  onExit: () => void;
}

export default function RolePlayMode({ archetype, scenario, onExit }: RolePlayModeProps) {
  const dialogues = getDialogues(archetype.id, scenario.id);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [turnResults, setTurnResults] = useState<SessionResult["turnResults"]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentTurn = dialogues[currentTurnIndex];
  const maxScore = dialogues.length * 3;

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 1200);
    return () => clearTimeout(timer);
  }, [currentTurnIndex]);

  // Scroll intentionally disabled — page-level scroll should not jump on exchange updates

  const handleChoiceSelect = (choice: ResponseChoice) => {
    if (selectedChoiceId) return;
    setSelectedChoiceId(choice.id);
    setShowFeedback(true);
    const newScore = Math.max(0, totalScore + choice.points);
    setTotalScore(newScore);
    setTurnResults((prev) => [
      ...prev,
      { turnId: currentTurn.id, choiceId: choice.id, points: choice.points, quality: choice.quality },
    ]);
  };

  const handleNext = () => {
    if (currentTurnIndex >= dialogues.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentTurnIndex((i) => i + 1);
      setSelectedChoiceId(null);
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentTurnIndex(0);
    setSelectedChoiceId(null);
    setShowFeedback(false);
    setTurnResults([]);
    setTotalScore(0);
    setIsComplete(false);
  };

  // Calculate final result
  const getSessionResult = (): SessionResult => {
    const percentage = Math.round((totalScore / maxScore) * 100);
    let grade: SessionResult["grade"];
    let gradeColor: string;
    if (percentage >= 85) { grade = "Expert"; gradeColor = "#F0A500"; }
    else if (percentage >= 65) { grade = "Proficient"; gradeColor = "#27AE60"; }
    else if (percentage >= 45) { grade = "Developing"; gradeColor = "#3498DB"; }
    else { grade = "Needs Practice"; gradeColor = "#C0392B"; }

    const excellentCount = turnResults.filter((r) => r.quality === "excellent").length;
    const poorCount = turnResults.filter((r) => r.quality === "poor" || r.quality === "wrong").length;

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (excellentCount >= 3) strengths.push("Strong evidence-based responses — you cited specific data points effectively");
    if (excellentCount >= 4) strengths.push("Excellent objection handling — you acknowledged concerns before pivoting to evidence");
    if (poorCount === 0) strengths.push("No incorrect responses — consistent clinical accuracy throughout");
    if (turnResults.some((r) => r.quality === "excellent" && r.turnId.includes("5"))) {
      strengths.push("Strong closing technique — you provided a complete initiation protocol");
    }

    if (poorCount >= 2) improvements.push("Review the ABEC framework: Acknowledge → Bridge → Evidence → Close before responding");
    if (turnResults.some((r) => r.quality === "wrong")) {
      improvements.push("Review critical safety facts: black box warning (fetal harm), vitamin A protocol, HCP-only administration");
    }
    if (excellentCount < 2) improvements.push("Practise citing specific data points: HR values, P-values, and trial names from memory");
    if (turnResults.some((r) => r.quality === "poor" && r.turnId.includes("1"))) {
      improvements.push("Opening responses: lead with acknowledgment of the physician's perspective before introducing new data");
    }

    if (strengths.length === 0) strengths.push("You completed the simulation — review the coaching feedback to identify key improvement areas");
    if (improvements.length === 0) improvements.push("Continue practising with different archetype/scenario combinations to build versatility");

    return { totalScore, maxScore, percentage, grade, gradeColor, turnResults, strengths, improvements };
  };

  // ── Completion Screen ──
  if (isComplete) {
    const result = getSessionResult();
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Score header */}
        <div className="rounded-2xl p-8 text-center" style={{ background: result.gradeColor + "15", border: `1px solid ${result.gradeColor}33` }}>
          <Trophy size={40} className="mx-auto mb-3" style={{ color: result.gradeColor }} />
          <div className="text-5xl font-bold mb-1" style={{ color: result.gradeColor, fontFamily: "'DM Serif Display', serif" }}>
            {result.percentage}%
          </div>
          <div className="text-white/60 text-sm mb-2">{result.totalScore} / {result.maxScore} points</div>
          <div className="text-xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {result.grade}
          </div>
          <div className="text-white/40 text-sm mt-1">
            {archetype.icon} {archetype.name} · {scenario.title}
          </div>
        </div>

        {/* Turn-by-turn summary */}
        <div className="rounded-xl p-4 bg-white/5 border border-white/10">
          <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Exchange Summary</h4>
          <div className="space-y-2">
            {result.turnResults.map((r, i) => {
              const turn = dialogues[i];
              const choice = turn.choices.find((c) => c.id === r.choiceId);
              return (
                <div key={r.turnId} className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-white/30 text-xs font-mono shrink-0">#{i + 1}</span>
                    <span className="text-white/60 text-xs truncate">{turn.context}</span>
                  </div>
                  <QualityBadge quality={r.quality as ResponseChoice["quality"]} points={r.points} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths + Improvements */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 bg-[#27AE60]/10 border border-[#27AE60]/20">
            <h4 className="text-[#27AE60] text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Star size={12} /> Strengths
            </h4>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="text-[#27AE60] shrink-0 mt-0.5">✓</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-4 bg-[#E67E22]/10 border border-[#E67E22]/20">
            <h4 className="text-[#E67E22] text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lightbulb size={12} /> Areas to Improve
            </h4>
            <ul className="space-y-2">
              {result.improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="text-[#E67E22] shrink-0 mt-0.5">→</span>{imp}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A3A6B] text-white text-sm font-medium hover:bg-[#243d6e] transition-all"
          >
            <RefreshCw size={14} /> Replay This Scenario
          </button>
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm font-medium hover:bg-white/20 transition-all"
          >
            <ArrowRight size={14} /> Try Different Setup
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Active Turn ──
  const selectedChoice = currentTurn.choices.find((c) => c.id === selectedChoiceId);

  return (
    <div className="space-y-5">
      {/* Session header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-base">{archetype.icon}</span>
            <span className="text-white/60 text-xs">{archetype.name}</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-white/60 text-xs">{scenario.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {dialogues.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background:
                    i < currentTurnIndex
                      ? "#00C2A8"
                      : i === currentTurnIndex
                      ? "#F0A500"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
          <span className="text-white/40 text-xs font-mono">
            {currentTurnIndex + 1}/{dialogues.length}
          </span>
          <span className="text-[#00C2A8] text-xs font-bold">{totalScore} pts</span>
        </div>
      </div>

      {/* HCP Statement */}
      <motion.div
        key={currentTurn.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-5 border border-white/10"
        style={{ background: archetype.color + "11" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
            style={{ background: archetype.color + "22" }}
          >
            {archetype.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/80 text-xs font-bold">{archetype.name}</span>
              <MoodIndicator mood={currentTurn.hcpMood} />
              <span className="text-white/30 text-xs">{currentTurn.difficultyLabel}</span>
            </div>
            {isTyping ? (
              <div className="flex items-center gap-1.5 py-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white/40"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-white/80 text-sm leading-relaxed italic">
                "{currentTurn.hcpStatement}"
              </p>
            )}
            {!isTyping && (
              <div className="mt-2 text-white/30 text-xs">{currentTurn.context}</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Response Choices */}
      {!isTyping && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User size={13} className="text-[#00C2A8]" />
            <span className="text-[#00C2A8] text-xs font-bold uppercase tracking-wider">Your Response</span>
          </div>
          <div className="grid gap-3">
            <AnimatePresence>
              {currentTurn.choices.map((choice, idx) => {
                const isSelected = selectedChoiceId === choice.id;
                const isBest = choice.id === currentTurn.bestResponseId;
                const isRevealed = showFeedback;

                let borderColor = "rgba(255,255,255,0.1)";
                let bgColor = "rgba(255,255,255,0.03)";
                if (isRevealed) {
                  if (choice.quality === "excellent") { borderColor = "#27AE60"; bgColor = "#27AE6011"; }
                  else if (choice.quality === "good") { borderColor = "#3498DB55"; bgColor = "#3498DB08"; }
                  else if (choice.quality === "poor") { borderColor = "#E67E2255"; bgColor = "#E67E2208"; }
                  else if (choice.quality === "wrong") { borderColor = "#C0392B55"; bgColor = "#C0392B08"; }
                } else if (isSelected) {
                  borderColor = "#00C2A8";
                  bgColor = "#00C2A811";
                }

                return (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    onClick={() => !selectedChoiceId && handleChoiceSelect(choice)}
                    disabled={!!selectedChoiceId}
                    className="text-left p-4 rounded-xl border transition-all duration-200 group"
                    style={{ borderColor, background: bgColor, cursor: selectedChoiceId ? "default" : "pointer" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{
                          borderColor: isRevealed
                            ? choice.quality === "excellent" ? "#27AE60"
                            : choice.quality === "good" ? "#3498DB"
                            : choice.quality === "poor" ? "#E67E22"
                            : "#C0392B"
                            : isSelected ? "#00C2A8" : "rgba(255,255,255,0.2)",
                          color: isRevealed
                            ? choice.quality === "excellent" ? "#27AE60"
                            : choice.quality === "good" ? "#3498DB"
                            : choice.quality === "poor" ? "#E67E22"
                            : "#C0392B"
                            : isSelected ? "#00C2A8" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-sm leading-relaxed">{choice.text}</p>
                        {isRevealed && isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 pt-3 border-t border-white/10 space-y-2"
                          >
                            <QualityBadge quality={choice.quality} points={choice.points} />
                            <p className="text-white/60 text-xs font-medium">{choice.coaching}</p>
                            <p className="text-white/40 text-xs leading-relaxed">{choice.coachingDetail}</p>
                          </motion.div>
                        )}
                        {isRevealed && !isSelected && choice.quality === "excellent" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2"
                          >
                            <span className="text-[#27AE60] text-xs font-medium flex items-center gap-1">
                              <CheckCircle size={11} /> Best response
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Next button */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Lightbulb size={12} className="text-[#F0A500]" />
            <span>Review all options to see coaching notes</span>
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{ background: "#00C2A8", color: "#060E24" }}
          >
            {currentTurnIndex >= dialogues.length - 1 ? (
              <>See Results <Trophy size={14} /></>
            ) : (
              <>Next Exchange <ChevronRight size={14} /></>
            )}
          </button>
        </motion.div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
}
