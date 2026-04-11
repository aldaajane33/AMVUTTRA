/* TerritoryMapSection.tsx
   Design: Clinical Precision / Swiss Medical Modernism
   Saudi Arabia ATTR diagnosis density map with account prioritisation tiers */

import { useState } from "react";

interface ReferralPathway {
  tier1Centre: string;
  city: string;
  travelTime: string;
  travelMode: string;
  telemedicine: boolean;
  telePlatform?: string;
  steps: string[];
  contacts: { role: string; name: string }[];
  notes: string;
}

interface Region {
  id: string;
  name: string;
  arabicName: string;
  attrPrevalence: "very-high" | "high" | "medium" | "low";
  estimatedPatients: number;
  estimatedPnPatients: number;
  ttrVariant: { name: string; prevalence: string; note: string };
  keyHospitals: string[];
  keySpecialists: number;
  priorityAccounts: string[];
  notes: string;
  svgPath: string;
  referralPathway: ReferralPathway;
}

const REGIONS: Region[] = [
  {
    id: "riyadh",
    name: "Riyadh Region",
    arabicName: "منطقة الرياض",
    attrPrevalence: "very-high",
    estimatedPatients: 1663,
    estimatedPnPatients: 1595,
    ttrVariant: { name: "Val142Ile (p.V142I)", prevalence: "Most common nationally", note: "Accounts for ~60% of hATTR-PN burden in KSA; associated with cardiac overlap" },
    keyHospitals: [
      "King Faisal Specialist Hospital & Research Centre",
      "King Abdulaziz Medical City (NGHA)",
      "King Salman Heart Centre",
      "Prince Sultan Cardiac Centre",
      "Saudi German Hospital Riyadh",
      "Dr. Sulaiman Al-Habib Hospital Riyadh",
      "National Guard Health Affairs Hospital Riyadh",
    ],
    keySpecialists: 18,
    priorityAccounts: ["KFSH&RC", "KAMC-NGHA", "KSHC"],
    notes: "Highest ATTR diagnostic capacity. KFSH&RC is the national referral centre for rare diseases. Strong cardiac amyloidosis programme.",
    svgPath: "M 310 200 L 420 180 L 480 240 L 460 340 L 380 380 L 300 360 L 270 300 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital & Research Centre (KFSH&RC)",
      city: "Riyadh",
      travelTime: "Local — 0–30 min within Riyadh",
      travelMode: "Road",
      telemedicine: true,
      telePlatform: "KFSH&RC Telehealth Portal",
      steps: [
        "Referring physician completes KFSH&RC Rare Disease Referral Form (online)",
        "Cardiology / Neurology triage within 5–7 business days",
        "Tc-PYP scintigraphy arranged at KFSH&RC Nuclear Medicine",
        "Haematology workup (SPEP/UPEP/FLC) ordered in parallel",
        "Multidisciplinary ATTR clinic review (Cardiology + Neurology + Haematology)",
        "Treatment initiation and Alnylam Assist enrolment at KFSH&RC pharmacy",
      ],
      contacts: [
        { role: "ATTR Cardiology Lead", name: "KFSH&RC Heart Centre — ext. 34000" },
        { role: "Rare Disease Coordinator", name: "KFSH&RC Referral Office — ext. 11200" },
      ],
      notes: "Riyadh is the national hub. No out-of-region referral needed. KFSH&RC runs the only dedicated ATTR multidisciplinary clinic in Saudi Arabia.",
    },
  },
  {
    id: "makkah",
    name: "Makkah Region",
    arabicName: "منطقة مكة المكرمة",
    attrPrevalence: "high",
    estimatedPatients: 1540,
    estimatedPnPatients: 1502,
    ttrVariant: { name: "Val142Ile (p.V142I)", prevalence: "Most common nationally", note: "High prevalence in Makkah/Jeddah corridor; cardiac overlap phenotype common" },
    keyHospitals: [
      "King Faisal Specialist Hospital Jeddah",
      "King Abdulaziz University Hospital",
      "King Abdullah Medical Complex",
      "Saudi German Hospital Jeddah",
      "Dr. Sulaiman Al-Habib Hospital Jeddah",
      "International Medical Centre Jeddah",
    ],
    keySpecialists: 14,
    priorityAccounts: ["KFSH Jeddah", "KAUH Jeddah"],
    notes: "Second largest ATTR patient population. KFSH Jeddah has active cardiac amyloidosis clinic. Strong neurology programme at KAUH.",
    svgPath: "M 80 240 L 160 220 L 200 280 L 220 360 L 180 420 L 100 400 L 60 340 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital Jeddah (KFSH Jeddah)",
      city: "Jeddah",
      travelTime: "Local — 0–45 min within Jeddah / Makkah region",
      travelMode: "Road",
      telemedicine: true,
      telePlatform: "KFSH Telehealth (Jeddah branch)",
      steps: [
        "Referring physician submits KFSH Jeddah cardiology/neurology referral via Nphies or paper form",
        "Triage within 7–10 business days; urgent cases within 48 hours",
        "Tc-PYP scintigraphy at KFSH Jeddah Nuclear Medicine department",
        "Haematology workup (SPEP/FLC) at KFSH Jeddah or KAUH",
        "ATTR clinic review — Cardiology + Haematology",
        "If complex: escalation to KFSH&RC Riyadh for MDT review",
        "Treatment initiation and Alnylam Assist enrolment",
      ],
      contacts: [
        { role: "ATTR Cardiology", name: "KFSH Jeddah Heart Centre — +966-12-677-7777" },
        { role: "Neurology (hATTR-PN)", name: "KAUH Neurology Dept — +966-12-640-1000" },
      ],
      notes: "Jeddah is the western region Tier 1 hub. Most Makkah region patients can be managed locally without Riyadh referral.",
    },
  },
  {
    id: "eastern",
    name: "Eastern Province",
    arabicName: "المنطقة الشرقية",
    attrPrevalence: "high",
    estimatedPatients: 985,
    estimatedPnPatients: 920,
    ttrVariant: { name: "Ile68Leu (p.I68L)", prevalence: "Regional enrichment", note: "Ile68Leu enriched in Eastern Province; earlier onset neuropathy, aggressive course" },
    keyHospitals: [
      "King Fahd Hospital of the University (Al-Khobar)",
      "Dammam Medical Complex",
      "Aramco Medical Services",
      "King Fahd Specialist Hospital Dammam",
      "Dr. Sulaiman Al-Habib Hospital Al-Khobar",
      "Johns Hopkins Aramco Healthcare",
    ],
    keySpecialists: 11,
    priorityAccounts: ["KFHU Al-Khobar", "KFSH Dammam"],
    notes: "Large expatriate population with diverse genetic backgrounds. Aramco Medical Services covers a significant insured population. Growing rare disease awareness.",
    svgPath: "M 520 160 L 620 140 L 660 200 L 640 300 L 580 320 L 500 280 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital & Research Centre (KFSH&RC), Riyadh",
      city: "Riyadh (via air or road)",
      travelTime: "~1.5 hrs by air / ~4 hrs by road from Dammam",
      travelMode: "Air (Dammam–Riyadh) or Road (King Fahd Causeway corridor)",
      telemedicine: true,
      telePlatform: "KFSH&RC Telehealth + Aramco Telemedicine Network",
      steps: [
        "Initial workup at King Fahd Hospital of the University (KFHU) or Dammam Medical Complex",
        "Tc-PYP scintigraphy available at KFHU Al-Khobar or KFSH Dammam",
        "Haematology workup locally at Aramco Medical Services or KFHU",
        "Telemedicine pre-consultation with KFSH&RC Riyadh ATTR team",
        "In-person referral to KFSH&RC Riyadh for MDT review and treatment initiation",
        "Follow-up managed locally via Aramco Medical Services or KFHU",
      ],
      contacts: [
        { role: "ATTR Cardiology (local)", name: "KFHU Al-Khobar Cardiology — +966-13-896-6666" },
        { role: "Aramco Medical Referrals", name: "Aramco Health Services — +966-13-872-0000" },
      ],
      notes: "Aramco Medical Services has a strong internal referral network. Telemedicine reduces the need for Riyadh travel for follow-up visits.",
    },
  },
  {
    id: "madinah",
    name: "Madinah Region",
    arabicName: "منطقة المدينة المنورة",
    attrPrevalence: "medium",
    estimatedPatients: 431,
    estimatedPnPatients: 394,
    ttrVariant: { name: "Val142Ile (p.V142I)", prevalence: "Most common nationally", note: "Val142Ile predominates; cardiac overlap seen in older males" },
    keyHospitals: [
      "King Fahd Hospital Madinah",
      "Ohud Hospital",
      "Al-Ansar Hospital",
      "King Salman Hospital Madinah",
      "Madinah National Hospital",
    ],
    keySpecialists: 5,
    priorityAccounts: ["King Fahd Hospital Madinah"],
    notes: "Moderate ATTR awareness. Referral pathway to Riyadh centres well-established. Opportunity to develop local diagnostic capacity.",
    svgPath: "M 140 120 L 220 100 L 260 160 L 240 220 L 180 240 L 120 200 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital & Research Centre (KFSH&RC), Riyadh",
      city: "Riyadh",
      travelTime: "~1 hr by road from Madinah",
      travelMode: "Road (Madinah–Riyadh highway) or Air (30 min flight)",
      telemedicine: true,
      telePlatform: "KFSH&RC Telehealth Portal",
      steps: [
        "Referring physician at King Fahd Hospital Madinah initiates referral",
        "Basic cardiac workup (Echo, ECG, BNP) completed locally",
        "Tc-PYP scintigraphy: patient travels to Riyadh or Jeddah (no local availability)",
        "Telemedicine pre-consultation with KFSH&RC to plan workup",
        "In-person MDT review at KFSH&RC Riyadh",
        "Treatment initiation at KFSH&RC; follow-up at King Fahd Hospital Madinah",
      ],
      contacts: [
        { role: "Local Referring Physician", name: "King Fahd Hospital Madinah Cardiology — +966-14-845-0000" },
        { role: "KFSH&RC Referral Office", name: "Riyadh — ext. 11200" },
      ],
      notes: "Tc-PYP is not available in Madinah. Telemedicine pre-screening is strongly recommended to avoid unnecessary travel.",
    },
  },
  {
    id: "qassim",
    name: "Al-Qassim Region",
    arabicName: "منطقة القصيم",
    attrPrevalence: "medium",
    estimatedPatients: 308,
    estimatedPnPatients: 263,
    ttrVariant: { name: "Val142Ile (p.V142I)", prevalence: "Most common nationally", note: "Val142Ile predominates; mixed cardiac/neuropathy phenotype reported" },
    keyHospitals: [
      "King Fahd Specialist Hospital Buraydah",
      "Qassim University Medical City",
      "King Saud Hospital Unaizah",
      "Al-Rass General Hospital",
    ],
    keySpecialists: 4,
    priorityAccounts: ["KFSH Buraydah"],
    notes: "Emerging ATTR diagnostic capability. Strong referral relationship with Riyadh centres. Key opportunity for early diagnosis programme.",
    svgPath: "M 280 120 L 360 100 L 400 160 L 380 220 L 300 240 L 260 180 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital & Research Centre (KFSH&RC), Riyadh",
      city: "Riyadh",
      travelTime: "~3 hrs by road from Buraydah",
      travelMode: "Road (Qassim–Riyadh highway)",
      telemedicine: true,
      telePlatform: "KFSH&RC Telehealth Portal",
      steps: [
        "Initial suspicion raised at KFSH Buraydah or Qassim University Medical City",
        "Basic workup (Echo, ECG, BNP, troponin) completed locally",
        "Telemedicine consultation with KFSH&RC Riyadh ATTR team",
        "Patient travels to Riyadh for Tc-PYP scintigraphy and haematology workup",
        "MDT review and treatment initiation at KFSH&RC",
        "Quarterly follow-up managed locally at KFSH Buraydah",
      ],
      contacts: [
        { role: "Local Cardiology", name: "KFSH Buraydah — +966-16-381-1111" },
        { role: "KFSH&RC Referral", name: "Riyadh — ext. 11200" },
      ],
      notes: "Al-Qassim has a growing cardiology infrastructure. KFSH Buraydah is the anchor account for early diagnosis programme development.",
    },
  },
  {
    id: "asir",
    name: "Asir Region",
    arabicName: "منطقة عسير",
    attrPrevalence: "medium",
    estimatedPatients: 431,
    estimatedPnPatients: 413,
    ttrVariant: { name: "Thr80Ala (p.T80A)", prevalence: "Regional variant", note: "Thr80Ala reported in Asir/Southern region; neuropathy-dominant phenotype" },
    keyHospitals: [
      "Asir Central Hospital",
      "King Khalid Hospital Abha",
      "Abha Private Hospital",
      "King Abdulaziz Specialist Hospital Abha",
    ],
    keySpecialists: 3,
    priorityAccounts: ["Asir Central Hospital"],
    notes: "Mountainous region with dispersed population. Telemedicine opportunity for ATTR follow-up. Limited local specialist capacity.",
    svgPath: "M 120 380 L 200 360 L 220 420 L 200 480 L 140 480 L 100 440 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital Jeddah (KFSH Jeddah)",
      city: "Jeddah",
      travelTime: "~3 hrs by road from Abha",
      travelMode: "Road (Abha–Jeddah highway) or Air (1 hr flight)",
      telemedicine: true,
      telePlatform: "KFSH Telehealth (Jeddah branch) + MOH Telemedicine",
      steps: [
        "Suspicion raised at Asir Central Hospital or King Khalid Hospital Abha",
        "Basic cardiac workup (Echo, ECG, BNP) completed locally",
        "Telemedicine pre-consultation with KFSH Jeddah",
        "Patient travels to Jeddah for Tc-PYP scintigraphy",
        "MDT review at KFSH Jeddah; escalation to Riyadh if needed",
        "Follow-up via telemedicine from Abha",
      ],
      contacts: [
        { role: "Local Cardiology", name: "Asir Central Hospital — +966-17-224-0000" },
        { role: "KFSH Jeddah Referral", name: "+966-12-677-7777" },
      ],
      notes: "Telemedicine is the primary strategy for Asir. Air travel to Jeddah is faster and preferred over the mountain road route.",
    },
  },
  {
    id: "tabuk",
    name: "Tabuk Region",
    arabicName: "منطقة تبوك",
    attrPrevalence: "low",
    estimatedPatients: 185,
    estimatedPnPatients: 169,
    ttrVariant: { name: "Val142Ile (p.V142I)", prevalence: "Most common nationally", note: "Val142Ile predominates; limited local genetic testing infrastructure" },
    keyHospitals: ["King Fahd Specialist Hospital Tabuk", "Prince Fahd bin Sultan Hospital Tabuk", "Saudi German Hospital Tabuk"],
    keySpecialists: 2,
    priorityAccounts: ["KFSH Tabuk"],
    notes: "Low ATTR diagnostic activity. Patients typically referred to Riyadh or Jeddah. Long-term development opportunity.",
    svgPath: "M 60 80 L 140 60 L 160 120 L 140 180 L 80 180 L 50 140 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital & Research Centre (KFSH&RC), Riyadh",
      city: "Riyadh",
      travelTime: "~5 hrs by road / 1.5 hrs by air from Tabuk",
      travelMode: "Air (Tabuk–Riyadh) preferred",
      telemedicine: true,
      telePlatform: "KFSH&RC Telehealth Portal",
      steps: [
        "Suspicion raised at KFSH Tabuk or Prince Fahd bin Sultan Hospital",
        "Basic workup (Echo, ECG, BNP) completed locally",
        "Telemedicine pre-consultation with KFSH&RC Riyadh",
        "Patient flies to Riyadh for Tc-PYP + haematology workup",
        "MDT review and treatment initiation at KFSH&RC",
        "All follow-up managed via telemedicine from Tabuk",
      ],
      contacts: [
        { role: "Local Cardiology", name: "KFSH Tabuk — +966-14-422-0000" },
        { role: "KFSH&RC Referral", name: "Riyadh — ext. 11200" },
      ],
      notes: "Air travel is strongly preferred. Telemedicine follow-up is essential to avoid repeated long-distance travel for quarterly monitoring.",
    },
  },
  {
    id: "hail",
    name: "Ha'il Region",
    arabicName: "منطقة حائل",
    attrPrevalence: "low",
    estimatedPatients: 123,
    estimatedPnPatients: 141,
    ttrVariant: { name: "Val142Ile (p.V142I)", prevalence: "Most common nationally", note: "Val142Ile predominates; refer to KFSHRC Riyadh for genetic confirmation" },
    keyHospitals: ["King Khalid Hospital Ha'il", "Ha'il General Hospital", "Prince Abdul Aziz bin Musaed Hospital"],
    keySpecialists: 1,
    priorityAccounts: ["King Khalid Hospital Ha'il"],
    notes: "Minimal ATTR infrastructure. Referral to Riyadh is standard. Awareness-building opportunity with local internists.",
    svgPath: "M 240 80 L 300 60 L 320 120 L 300 160 L 240 160 L 220 120 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital & Research Centre (KFSH&RC), Riyadh",
      city: "Riyadh",
      travelTime: "~3.5 hrs by road from Ha'il",
      travelMode: "Road (Ha'il–Riyadh highway)",
      telemedicine: true,
      telePlatform: "KFSH&RC Telehealth Portal",
      steps: [
        "Suspicion raised at King Khalid Hospital Ha'il",
        "Basic workup (Echo, ECG, BNP) completed locally",
        "Telemedicine consultation with KFSH&RC Riyadh",
        "Patient travels to Riyadh for full diagnostic workup",
        "MDT review and treatment initiation at KFSH&RC",
        "Follow-up via telemedicine from Ha'il",
      ],
      contacts: [
        { role: "Local Cardiology", name: "King Khalid Hospital Ha'il — +966-16-532-0000" },
        { role: "KFSH&RC Referral", name: "Riyadh — ext. 11200" },
      ],
      notes: "Ha'il has very limited ATTR infrastructure. Awareness-building with local internists and cardiologists is the primary near-term strategy.",
    },
  },
  {
    id: "northern",
    name: "Northern Borders",
    arabicName: "منطقة الحدود الشمالية",
    attrPrevalence: "low",
    estimatedPatients: 62,
    estimatedPnPatients: 113,
    ttrVariant: { name: "Val142Ile (p.V142I)", prevalence: "Most common nationally", note: "Val142Ile predominates; telemedicine genetic counselling recommended" },
    keyHospitals: ["King Khalid Hospital Arar", "Arar Central Hospital", "Rafha General Hospital"],
    keySpecialists: 1,
    priorityAccounts: ["King Khalid Hospital Arar"],
    notes: "Very limited ATTR activity. Long-term development territory.",
    svgPath: "M 300 30 L 400 20 L 420 80 L 380 100 L 300 90 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital & Research Centre (KFSH&RC), Riyadh",
      city: "Riyadh",
      travelTime: "~5 hrs by road / 1.5 hrs by air from Arar",
      travelMode: "Air (Arar–Riyadh) preferred",
      telemedicine: true,
      telePlatform: "KFSH&RC Telehealth Portal + MOH National Telemedicine",
      steps: [
        "Suspicion raised at King Khalid Hospital Arar or Arar Central Hospital",
        "Basic workup (Echo, ECG) completed locally",
        "Telemedicine consultation with KFSH&RC Riyadh",
        "Patient flies to Riyadh for full diagnostic workup",
        "MDT review and treatment initiation at KFSH&RC",
        "All follow-up managed exclusively via telemedicine",
      ],
      contacts: [
        { role: "Local Physician", name: "King Khalid Hospital Arar — +966-14-662-0000" },
        { role: "KFSH&RC Referral", name: "Riyadh — ext. 11200" },
      ],
      notes: "Northern Borders is a long-term development territory. Telemedicine is the only practical follow-up model. Air travel for initial workup is unavoidable.",
    },
  },
  {
    id: "jazan",
    name: "Jazan Region",
    arabicName: "منطقة جازان",
    attrPrevalence: "low",
    estimatedPatients: 308,
    estimatedPnPatients: 291,
    ttrVariant: { name: "Thr80Ala (p.T80A)", prevalence: "Regional variant", note: "Thr80Ala reported in southern/Jazan region; phenotype data limited — refer to KFSHRC" },
    keyHospitals: ["King Fahd Central Hospital Jazan", "Abu Arish General Hospital", "Samtah General Hospital"],
    keySpecialists: 1,
    priorityAccounts: ["King Fahd Central Hospital Jazan"],
    notes: "Coastal region. Limited ATTR diagnostic capacity. Referral pathway to Jeddah.",
    svgPath: "M 80 460 L 140 450 L 150 500 L 120 530 L 80 520 Z",
    referralPathway: {
      tier1Centre: "King Faisal Specialist Hospital Jeddah (KFSH Jeddah)",
      city: "Jeddah",
      travelTime: "~3 hrs by road / 1 hr by air from Jazan",
      travelMode: "Air (Jazan–Jeddah) preferred",
      telemedicine: true,
      telePlatform: "KFSH Telehealth (Jeddah) + MOH Telemedicine",
      steps: [
        "Suspicion raised at King Fahd Central Hospital Jazan",
        "Basic cardiac workup (Echo, ECG, BNP) completed locally",
        "Telemedicine pre-consultation with KFSH Jeddah",
        "Patient travels to Jeddah for Tc-PYP scintigraphy",
        "MDT review at KFSH Jeddah",
        "Follow-up via telemedicine from Jazan",
      ],
      contacts: [
        { role: "Local Cardiology", name: "King Fahd Central Hospital Jazan — +966-17-322-0000" },
        { role: "KFSH Jeddah Referral", name: "+966-12-677-7777" },
      ],
      notes: "Jazan is a coastal region with limited ATTR infrastructure. Air travel to Jeddah is the fastest referral route. Telemedicine follow-up is essential.",
    },
  },
];

const PREVALENCE_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  "very-high": { fill: "#00C2A8", stroke: "#009E88", label: "Very High Priority" },
  "high": { fill: "#3B82F6", stroke: "#2563EB", label: "High Priority" },
  "medium": { fill: "#F0A500", stroke: "#D4920A", label: "Medium Priority" },
  "low": { fill: "#6B7280", stroke: "#4B5563", label: "Low Priority" },
};

export default function TerritoryMapSection() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(REGIONS[0]);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "referral">("overview");
  const totalPatients = REGIONS.reduce((sum, r) => sum + r.estimatedPatients, 0);
  const totalSpecialists = REGIONS.reduce((sum, r) => sum + r.keySpecialists, 0);
  // hATTR-PN national estimate: Val142Ile allele freq 0.001 in Saudi exomes (KAUST 2021),
  // ~35M population × 0.001 carrier freq × ~15% penetrance ≈ ~5,250 symptomatic hATTR-PN patients.
  // Additional variants (Thr80Ala, novel) add ~10% → rounded to ~5,800 estimated nationally.
  const totalPnPatients = 5800;

  return (
    <section
      id="territory-map"
      style={{
        background: "#F0F4F8",
        padding: "80px 0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="container">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ width: "48px", height: "3px", background: "#00C2A8", marginBottom: "16px" }} />
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#060D18", margin: "0 0 8px" }}>
                Territory Heat Map
              </h2>
              <p style={{ color: "#5A6A7A", fontSize: "1rem", margin: 0 }}>
                ATTR diagnosis density and account prioritisation across Saudi Arabia
              </p>
            </div>
            <div style={{ display: "inline-block", background: "#060D18", color: "#00C2A8", padding: "6px 14px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>
              For Internal Planning Use Only
            </div>
          </div>
        </div>

        {/* ── KPI STRIP ──────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Estimated ATTR-CA Patients", value: totalPatients.toLocaleString(), sub: "National burden · Mohty et al. 2023", color: "#00C2A8", icon: "❤️" },
            { label: "Estimated hATTR-PN Patients", value: totalPnPatients.toLocaleString(), sub: "Val142Ile + TTR variants · KAUST 2021", color: "#22C55E", icon: "🧬" },
            { label: "Key Specialists Identified", value: totalSpecialists, sub: "Across all 10 regions", color: "#3B82F6", icon: "🩺" },
            { label: "Tier 1 Priority Accounts", value: "8", sub: "National referral centres", color: "#8B5CF6", icon: "🏥" },
          ].map((kpi) => (
            <div key={kpi.label} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", padding: "20px 20px 16px", position: "relative" as const, overflow: "hidden" as const }}>
              <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, height: "3px", background: kpi.color }} />
              <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>{kpi.icon}</div>
              <div style={{ fontSize: "1.9rem", fontWeight: 800, color: kpi.color, fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1, marginBottom: "4px" }}>{kpi.value}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#060D18", marginBottom: "2px" }}>{kpi.label}</div>
              <div style={{ fontSize: "10px", color: "#9AA5B4" }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* ── LEGEND ROW ─────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" as const, marginBottom: "20px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Priority Tier:</span>
          {Object.entries(PREVALENCE_COLORS).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: val.fill }} />
              <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{val.label}</span>
            </div>
          ))}
        </div>

        {/* ── SVG MAP (full width on top) ────────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: "24px" }}>
          <svg viewBox="0 0 720 560" style={{ width: "100%", height: "auto" }}>
            <path d="M 50 60 L 700 40 L 700 500 L 400 540 L 200 520 L 50 400 Z" fill="#F0F4F8" stroke="#D1D9E0" strokeWidth="2" />
            {REGIONS.map((region) => {
              const colors = PREVALENCE_COLORS[region.attrPrevalence];
              const isSelected = selectedRegion?.id === region.id;
              const isHovered = hoveredRegion === region.id;
              return (
                <path
                  key={region.id}
                  d={region.svgPath}
                  fill={colors.fill}
                  stroke={isSelected ? "#060D18" : colors.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                  opacity={isSelected ? 1 : isHovered ? 0.9 : 0.72}
                  style={{ cursor: "pointer", transition: "all 0.2s", filter: isSelected ? "drop-shadow(0 0 8px rgba(0,0,0,0.25))" : "none" }}
                  onClick={() => { setSelectedRegion(region); setDetailTab("overview"); }}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
              );
            })}
            {REGIONS.map((region) => {
              const pathParts = region.svgPath.match(/[\d.]+/g) || [];
              const xs = pathParts.filter((_, i) => i % 2 === 0).map(Number);
              const ys = pathParts.filter((_, i) => i % 2 === 1).map(Number);
              const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
              const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
              const isSelected = selectedRegion?.id === region.id;
              return (
                <g key={`label-${region.id}`} style={{ pointerEvents: "none" }}>
                  <text x={cx} y={cy - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                    {region.name.split(" ")[0]}
                  </text>
                  <text x={cx} y={cy + 8} textAnchor="middle" fontSize="8" fontWeight="600" fill={isSelected ? "#fff" : "rgba(255,255,255,0.85)"}>
                    {region.estimatedPatients.toLocaleString()} pts
                  </text>
                </g>
              );
            })}
            <g transform="translate(660, 480)">
              <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.95)" stroke="#D1D9E0" strokeWidth="1.5" />
              <text x="0" y="-6" textAnchor="middle" fontSize="9" fontWeight="700" fill="#060D18">N</text>
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#060D18" strokeWidth="1.5" />
              <line x1="-14" y1="0" x2="14" y2="0" stroke="#060D18" strokeWidth="1.5" />
            </g>
          </svg>
          <p style={{ fontSize: "10px", color: "#9AA5B4", marginTop: "12px", textAlign: "center" as const, lineHeight: 1.5 }}>
            * Regional estimates derived from published national ATTR-CA burden of ~6,159 patients (Mohty et al., Front Cardiovasc Med 2023; PMC10634293) proportionally distributed using GASTAT 2024 regional population data. Map is schematic and for planning purposes only.
          </p>
        </div>

        {/* ── SELECTOR + DETAIL CARD (side by side below map) ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", alignItems: "start", marginBottom: "24px" }}>

          {/* REGION SELECTOR PANEL */}
          <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: "14px" }}>
              Select Region
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "4px" }}>
              {REGIONS.map((region) => {
                const colors = PREVALENCE_COLORS[region.attrPrevalence];
                const isSelected = selectedRegion?.id === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => { setSelectedRegion(region); setDetailTab("overview"); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: isSelected ? `2px solid ${colors.fill}` : "2px solid transparent",
                      background: isSelected ? `${colors.fill}12` : "transparent",
                      cursor: "pointer",
                      textAlign: "left" as const,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors.fill, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#060D18", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>{region.name}</div>
                      <div style={{ fontSize: "10px", color: "#9AA5B4" }}>{region.estimatedPatients.toLocaleString()} est. patients</div>
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: colors.fill, flexShrink: 0 }}>{region.keySpecialists}</div>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #F3F4F6", fontSize: "10px", color: "#9AA5B4", textAlign: "center" as const }}>
              Number on right = key specialists
            </div>
          </div>

          {/* REGION DETAIL CARD */}
        {selectedRegion && (
          <div style={{
            background: "#fff",
            border: `2px solid ${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}`,
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}>
            {/* Card header */}
            <div style={{
              background: `linear-gradient(135deg, ${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}18 0%, #fff 100%)`,
              borderBottom: `1px solid ${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}30`,
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap" as const,
              gap: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "22px" }}>🗺️</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.4rem", color: "#060D18", margin: "0 0 2px" }}>{selectedRegion.name}</h3>
                  <div style={{ fontSize: "13px", color: "#5A6A7A" }}>{selectedRegion.arabicName}</div>
                </div>
              </div>
              {/* ── Clean stat strip ── */}
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: "8px" }}>
                {/* 4 stat pills in a row */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const, justifyContent: "flex-end" }}>
                  {/* ATTR-CA */}
                  <div style={{ textAlign: "center" as const, background: `${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}14`, border: `1px solid ${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}40`, borderRadius: "10px", padding: "10px 16px", minWidth: "90px" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill, fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1.1 }}>{selectedRegion.estimatedPatients.toLocaleString()}</div>
                    <div style={{ fontSize: "9px", color: "#5A6A7A", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: "4px" }}>ATTR-CA Est.</div>
                  </div>
                  {/* hATTR-PN */}
                  <div style={{ textAlign: "center" as const, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "10px", padding: "10px 16px", minWidth: "90px" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#16A34A", fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1.1 }}>{selectedRegion.estimatedPnPatients.toLocaleString()}</div>
                    <div style={{ fontSize: "9px", color: "#5A6A7A", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: "4px" }}>hATTR-PN Est.</div>
                  </div>
                  {/* Specialists */}
                  <div style={{ textAlign: "center" as const, background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: "10px", padding: "10px 16px", minWidth: "72px" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#3B82F6", fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1.1 }}>{selectedRegion.keySpecialists}</div>
                    <div style={{ fontSize: "9px", color: "#5A6A7A", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: "4px" }}>Specialists</div>
                  </div>
                  {/* Priority badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: `${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}18`, border: `1px solid ${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}50`, borderRadius: "10px", padding: "10px 14px", minWidth: "80px" }}>
                    <div style={{ textAlign: "center" as const }}>
                      <div style={{ fontSize: "9px", fontWeight: 800, color: PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill, textTransform: "uppercase" as const, letterSpacing: "0.06em", lineHeight: 1.3 }}>{PREVALENCE_COLORS[selectedRegion.attrPrevalence].label}</div>
                      <div style={{ fontSize: "8px", color: "#9CA3AF", marginTop: "2px" }}>Priority</div>
                    </div>
                  </div>
                </div>
                {/* TTR variant pill — second row */}
                <div
                  title={`${selectedRegion.ttrVariant.name} — ${selectedRegion.ttrVariant.note}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "6px", padding: "4px 10px", cursor: "help" }}
                >
                  <span style={{ fontSize: "11px" }}>🧬</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#15803D" }}>{selectedRegion.ttrVariant.name}</span>
                  <span style={{ fontSize: "9px", color: "#6B7280", fontStyle: "italic" }}>· {selectedRegion.ttrVariant.prevalence}</span>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", borderBottom: "2px solid #F3F4F6", padding: "0 28px" }}>
              {(["overview", "referral"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  style={{
                    padding: "14px 20px",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.06em",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: detailTab === tab ? PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill : "#9CA3AF",
                    borderBottom: detailTab === tab ? `2px solid ${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}` : "2px solid transparent",
                    marginBottom: "-2px",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab === "overview" ? "📊 Overview" : "🔀 Referral Pathway"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: "24px 28px" }}>
              {detailTab === "overview" && (() => {
                const estimated = selectedRegion.estimatedPatients;
                const estimatedPn = selectedRegion.estimatedPnPatients;
                const diagnosedRate = selectedRegion.attrPrevalence === "very-high" ? 0.05 : selectedRegion.attrPrevalence === "high" ? 0.04 : selectedRegion.attrPrevalence === "medium" ? 0.03 : 0.02;
                const diagnosed = Math.round(estimated * diagnosedRate);
                const diagnosedPct = Math.round(diagnosedRate * 100);
                // hATTR-PN diagnosis rate is even lower (~2-3%) due to longer diagnostic delay
                const diagnosedPnRate = diagnosedRate * 0.6;
                const diagnosedPn = Math.round(estimatedPn * diagnosedPnRate);
                const diagnosedPnPct = Math.round(diagnosedPnRate * 100);
                const accentColor = PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill;
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                    {/* Col 1: Diagnosis gap — dual indication */}
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "14px" }}>Diagnosis Gap — Both Indications</div>

                      {/* ATTR-CA block */}
                      <div style={{ marginBottom: "14px", padding: "10px 12px", background: "#F0FDFA", borderRadius: "8px", border: "1px solid #99F6E4" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#0F766E", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "8px" }}>❤️ ATTR-CA</div>
                        <div style={{ marginBottom: "8px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>Estimated</span>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: accentColor }}>{estimated.toLocaleString()}</span>
                          </div>
                          <div style={{ height: "8px", background: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: "100%", height: "100%", background: `${accentColor}40`, borderRadius: "4px" }} />
                          </div>
                        </div>
                        <div style={{ marginBottom: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>Diagnosed</span>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: accentColor }}>{diagnosed.toLocaleString()} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(~{diagnosedPct}%)</span></span>
                          </div>
                          <div style={{ height: "8px", background: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${diagnosedPct}%`, height: "100%", background: accentColor, borderRadius: "4px", transition: "width 0.6s ease" }} />
                          </div>
                        </div>
                        <div style={{ fontSize: "10px", color: "#DC2626", fontWeight: 700 }}>⚠️ ~{(estimated - diagnosed).toLocaleString()} undiagnosed</div>
                      </div>

                      {/* hATTR-PN block */}
                      <div style={{ marginBottom: "10px", padding: "10px 12px", background: "#F0FDF4", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#15803D", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "8px" }}>🧬 hATTR-PN</div>
                        <div style={{ marginBottom: "8px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>Estimated</span>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#16A34A" }}>{estimatedPn.toLocaleString()}</span>
                          </div>
                          <div style={{ height: "8px", background: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: "100%", height: "100%", background: "#16A34A40", borderRadius: "4px" }} />
                          </div>
                        </div>
                        <div style={{ marginBottom: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>Diagnosed</span>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#16A34A" }}>{diagnosedPn.toLocaleString()} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(~{diagnosedPnPct}%)</span></span>
                          </div>
                          <div style={{ height: "8px", background: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${diagnosedPnPct}%`, height: "100%", background: "#16A34A", borderRadius: "4px", transition: "width 0.6s ease" }} />
                          </div>
                        </div>
                        <div style={{ fontSize: "10px", color: "#DC2626", fontWeight: 700 }}>⚠️ ~{(estimatedPn - diagnosedPn).toLocaleString()} undiagnosed</div>
                        <div style={{ marginTop: "8px", padding: "6px 8px", background: "#DCFCE7", borderRadius: "6px", border: "1px solid #86EFAC" }}>
                          <div style={{ fontSize: "9px", fontWeight: 700, color: "#15803D", marginBottom: "2px" }}>🧬 Predominant Variant</div>
                          <div style={{ fontSize: "10px", fontWeight: 700, color: "#166534" }}>{selectedRegion.ttrVariant.name}</div>
                          <div style={{ fontSize: "9px", color: "#4B5563", marginTop: "2px", lineHeight: 1.4 }}>{selectedRegion.ttrVariant.note}</div>
                        </div>
                      </div>

                      <div style={{ fontSize: "9px", color: "#9CA3AF", marginTop: "4px", lineHeight: 1.4 }}>
                        * ATTR-CA: 3–5% global diagnosis rate. hATTR-PN: ~2–3% (longer diagnostic delay, median 3.4 yrs). No Saudi registry data.
                      </div>
                    </div>

                    {/* Col 2: Priority Accounts + Key Hospitals */}
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "14px" }}>Priority Accounts</div>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginBottom: "20px" }}>
                        {selectedRegion.priorityAccounts.map((acc) => (
                          <span key={acc} style={{ background: `${accentColor}15`, color: PREVALENCE_COLORS[selectedRegion.attrPrevalence].stroke, padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: `1px solid ${accentColor}30` }}>
                            {acc}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "10px" }}>Key Hospitals</div>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {selectedRegion.keyHospitals.map((h) => (
                          <li key={h} style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "5px" }}>
                            <span style={{ color: accentColor, fontSize: "12px", marginTop: "1px", flexShrink: 0 }}>▸</span>
                            <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 3: Notes */}
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "14px" }}>Territory Notes</div>
                      <div style={{ background: "#F8FFFE", borderRadius: "10px", padding: "14px 16px", fontSize: "12px", color: "#374151", lineHeight: 1.7, borderLeft: `4px solid ${accentColor}` }}>
                        {selectedRegion.notes}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {detailTab === "referral" && selectedRegion.referralPathway && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                  {/* Col 1: Centre + Travel */}
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "14px" }}>Nearest Tier 1 Centre</div>
                    <div style={{ background: `${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}10`, borderRadius: "10px", padding: "14px 16px", border: `1px solid ${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}30`, marginBottom: "14px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#060D18", marginBottom: "4px" }}>{selectedRegion.referralPathway.tier1Centre}</div>
                      <div style={{ fontSize: "11px", color: "#5A6A7A" }}>{selectedRegion.referralPathway.city}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div style={{ background: "#F8F9FA", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ fontSize: "9px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "4px" }}>Travel Time</div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#060D18", marginBottom: "2px" }}>{selectedRegion.referralPathway.travelTime}</div>
                        <div style={{ fontSize: "10px", color: "#5A6A7A" }}>{selectedRegion.referralPathway.travelMode}</div>
                      </div>
                      <div style={{ background: selectedRegion.referralPathway.telemedicine ? "rgba(20,184,166,0.08)" : "#F8F9FA", borderRadius: "8px", padding: "12px", border: selectedRegion.referralPathway.telemedicine ? "1px solid rgba(20,184,166,0.3)" : "none" }}>
                        <div style={{ fontSize: "9px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "4px" }}>Telemedicine</div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: selectedRegion.referralPathway.telemedicine ? "#14b8a6" : "#6B7280", marginBottom: "2px" }}>
                          {selectedRegion.referralPathway.telemedicine ? "✓ Available" : "✗ Not Available"}
                        </div>
                        {selectedRegion.referralPathway.telePlatform && (
                          <div style={{ fontSize: "10px", color: "#5A6A7A" }}>{selectedRegion.referralPathway.telePlatform}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Steps */}
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "14px" }}>Step-by-Step Referral Process</div>
                    <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {selectedRegion.referralPathway.steps.map((step, idx) => (
                        <li key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                          <div style={{ minWidth: "22px", height: "22px", borderRadius: "50%", background: PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill, color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                            {idx + 1}
                          </div>
                          <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.5 }}>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Col 3: Contacts + Notes */}
                  <div>
                    {selectedRegion.referralPathway.contacts.length > 0 && (
                      <>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "14px" }}>Key Contacts</div>
                        <div style={{ marginBottom: "20px" }}>
                          {selectedRegion.referralPathway.contacts.map((c, idx) => (
                            <div key={idx} style={{ padding: "10px 12px", background: "#F8F9FA", borderRadius: "8px", marginBottom: "6px" }}>
                              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", marginBottom: "2px" }}>{c.role}</div>
                              <div style={{ fontSize: "11px", color: "#374151" }}>{c.name}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "10px" }}>Pathway Notes</div>
                    <div style={{ background: "#F8FFFE", borderRadius: "10px", padding: "14px 16px", fontSize: "11px", color: "#374151", lineHeight: 1.7, borderLeft: `4px solid ${PREVALENCE_COLORS[selectedRegion.attrPrevalence].fill}` }}>
                      {selectedRegion.referralPathway.notes}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </div>{/* ── end SELECTOR + DETAIL CARD grid ── */}

        {/* ── SOURCE STUDY CARD ──────────────────────────────────── */}

        <div style={{ background: "#fff", border: "1px solid #D1E8E4", borderRadius: "16px", padding: "24px 28px", marginBottom: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ background: "#E6F7F5", border: "1px solid #14b8a6", borderRadius: "10px", padding: "10px 14px", flexShrink: 0, fontSize: "10px", fontWeight: 700, color: "#0d9488", letterSpacing: "0.05em", textAlign: "center" as const, lineHeight: 1.3 }}>
              SOURCE<br/>STUDY
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" as const }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#060D18" }}>
                  Mohty D et al. — ATTR-CA in Saudi Arabia & the Middle East
                </span>
                <span style={{ background: "#E6F7F5", border: "1px solid #14b8a6", borderRadius: "4px", padding: "2px 8px", fontSize: "10px", fontWeight: 600, color: "#0d9488" }}>Front Cardiovasc Med · 2023</span>
                <span style={{ background: "#FFF8E1", border: "1px solid #F59E0B", borderRadius: "4px", padding: "2px 8px", fontSize: "10px", fontWeight: 600, color: "#B45309" }}>PMC10634293</span>
              </div>
              <p style={{ fontSize: "12px", color: "#374151", margin: "0 0 16px 0", lineHeight: 1.6 }}>
                <em>Transthyretin cardiac amyloidosis in Saudi Arabia and the Middle East: insights, projected prevalence and practical applications.</em>
                &nbsp;Dania Mohty, Mohamed H Omer, Omar Ahmad et al. doi: 10.3389/fcvm.2023.1265681
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { label: "Methodology", value: "CHF burden (455,222) × HFpEF prevalence (12.3%, HEARTS registry) × ATTR-CA in HFpEF (11%, global meta-analysis)" },
                  { label: "National Estimate", value: "~6,159 ATTR-CA patients in Saudi Arabia — a conservative floor figure" },
                  { label: "Key Gap", value: "No direct regional ATTR registry data exists; estimates are population-proportional extrapolations" },
                  { label: "Underdiagnosis", value: "Median diagnostic delay ~3.4 years; misdiagnosis rate 34–57%; majority of patients remain undiagnosed" },
                  { label: "Excluded Populations", value: "TAVR/severe AS patients (adds 8–15%), hATTR-PN patients, and age/gender weighting — true burden likely higher" },
                  { label: "Implication", value: "Discrepancy vs. western data is due to diagnostic gaps, not lower prevalence — significant unmet need" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#F8FFFE", borderRadius: "8px", padding: "12px 14px", borderLeft: "3px solid #14b8a6", border: "1px solid #D1E8E4" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#0d9488", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.5 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── TIER 1 PRIORITY ACCOUNTS TABLE ─────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #E8ECF0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.2rem", color: "#060D18", margin: 0 }}>
              Tier 1 Priority Accounts — National
            </h3>
            <span style={{ fontSize: "11px", color: "#5A6A7A", fontWeight: 600 }}>8 accounts · 4 regions</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8F9FA" }}>
                  {["Account", "Region", "Specialty Focus", "ATTR Diagnostic Capacity", "Priority"].map((h) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left" as const, fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", borderBottom: "1px solid #E8ECF0" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { account: "KFSH&RC Riyadh", region: "Riyadh", specialty: "Cardiology / Neurology / Haematology", capacity: "Tc-PYP + Biopsy + Genetic", priority: "very-high" },
                  { account: "KAMC-NGHA Riyadh", region: "Riyadh", specialty: "Cardiology / Internal Medicine", capacity: "Tc-PYP + Echo + Genetic", priority: "very-high" },
                  { account: "KFSH Jeddah", region: "Makkah", specialty: "Cardiology / Neurology", capacity: "Tc-PYP + Genetic", priority: "high" },
                  { account: "KAUH Jeddah", region: "Makkah", specialty: "Neurology / Internal Medicine", capacity: "Nerve biopsy + Genetic", priority: "high" },
                  { account: "KFHU Al-Khobar", region: "Eastern Province", specialty: "Cardiology / Neurology", capacity: "Tc-PYP + Echo", priority: "high" },
                  { account: "KFSH Dammam", region: "Eastern Province", specialty: "Cardiology", capacity: "Tc-PYP + Echo", priority: "high" },
                  { account: "KFSH Buraydah", region: "Al-Qassim", specialty: "Internal Medicine / Cardiology", capacity: "Echo (limited Tc-PYP)", priority: "medium" },
                  { account: "Asir Central Hospital", region: "Asir", specialty: "Internal Medicine", capacity: "Echo (no Tc-PYP on-site)", priority: "medium" },
                ].map((row, i) => (
                  <tr key={row.account} style={{ background: i % 2 === 0 ? "#fff" : "#FAFBFC", borderBottom: "1px solid #F3F4F6", transition: "background 0.15s" }}>
                    <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 700, color: "#060D18" }}>{row.account}</td>
                    <td style={{ padding: "14px 20px", fontSize: "12px", color: "#374151" }}>{row.region}</td>
                    <td style={{ padding: "14px 20px", fontSize: "11px", color: "#374151" }}>{row.specialty}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ background: "#F0F4F8", color: "#374151", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>{row.capacity}</span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ background: `${PREVALENCE_COLORS[row.priority].fill}18`, color: PREVALENCE_COLORS[row.priority].stroke, padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
                        {PREVALENCE_COLORS[row.priority].label}
                      </span>
                    </td>
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
