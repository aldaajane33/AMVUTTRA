/* AccountProfileSection.tsx
   Design: Clinical Precision / Swiss Medical Modernism
   Saudi Arabia HCP Account Profile Builder — one-page profile per physician */

import { useState } from "react";

interface HCPProfile {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospital: string;
  region: string;
  prescribingBehaviour: "early-adopter" | "evidence-seeker" | "guideline-follower" | "cost-conscious" | "sceptic";
  knownObjections: string[];
  preferredEvidenceType: string[];
  relationshipStage: "uncontacted" | "aware" | "interested" | "evaluating" | "prescribing" | "champion";
  attrExperience: string;
  keyMessage: string;
  nextAction: string;
  lastContact: string;
  notes: string;
}

const PRESET_PROFILES: HCPProfile[] = [
  // ── Tier 1: KOL / Research Leaders ──────────────────────────────────────
  {
    id: "p1",
    name: "Dr. Dania Mohty",
    title: "Consultant Cardiologist — Head of Echocardiography Lab",
    specialty: "Cardiology — Echocardiography, Cardiac Amyloidosis",
    hospital: "Heart Center, King Faisal Specialist Hospital & Research Centre (KFSHRC)",
    region: "Riyadh",
    prescribingBehaviour: "early-adopter",
    knownObjections: ["Wants longer-term ATTR-CM OLE data beyond 42 months", "Concerned about SC injection training for community cardiologists"],
    preferredEvidenceType: ["Echo/strain imaging data", "Head-to-head comparisons", "Real-world evidence"],
    relationshipStage: "champion",
    attrExperience: "Very High — lead author Mohty 2023 Frontiers ATTR-CA Saudi Arabia paper; facilitator 1st Saudi Multidisciplinary Day on Amyloidosis (KFSHRC, April 2025); established ATTR screening programme at KFSHRC",
    keyMessage: "HELIOS-B: 28% RRR in all-cause mortality — first ATTR-CM therapy to show mortality benefit in a dedicated RCT",
    nextAction: "Invite as faculty for regional ATTR educational symposium; co-author Saudi ATTR registry proposal",
    lastContact: "April 2026",
    notes: "National KOL and most published Saudi physician on ATTR amyloidosis. Organised the inaugural Saudi Multidisciplinary Amyloidosis Day at KFSHRC (April 2025). Alfaisal University faculty. Key relationship for national guideline influence and speaker bureau. Responds to cutting-edge echo/imaging data.",
  },
  {
    id: "p2",
    name: "Dr. Ahmed Aljizeeri",
    title: "Consultant Cardiologist — Cardiac Imaging",
    specialty: "Cardiology — CMR, Nuclear Imaging, Cardiac Amyloidosis",
    hospital: "King Abdulaziz Cardiac Center, Ministry of National Guard Health Affairs (NGHA)",
    region: "Riyadh",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["Wants CMR-based subgroup data from HELIOS-B", "Questions optimal imaging surveillance interval on therapy"],
    preferredEvidenceType: ["CMR data", "Nuclear imaging outcomes", "Biomarker response data"],
    relationshipStage: "champion",
    attrExperience: "Very High — co-author Alqarni 2024 KSA nuclear imaging best practices paper; co-author Al Badarin 2024 EHJ Imaging amyloidosis practices Middle East; book chapter author (Wiley 2023); KSAU-HS and KAIMRC faculty",
    keyMessage: "AMVUTTRA reduces NT-proBNP by 22% vs +77% placebo — imaging and biomarker response confirms disease modification",
    nextAction: "Share HELIOS-B cardiac imaging sub-study data; invite to ATTR imaging masterclass",
    lastContact: "March 2026",
    notes: "Leading cardiac imaging expert at NGHA. Dual appointment at KSAU-HS and KAIMRC. Highly influential in establishing nuclear imaging protocols for ATTR-CM across Saudi Arabia. Responds to imaging biomarker data and mechanistic evidence.",
  },
  {
    id: "p3",
    name: "Dr. Abdullah Alqarni",
    title: "Consultant Nuclear Medicine Physician",
    specialty: "Nuclear Medicine — ATTR-CM Scintigraphy, PYP Imaging",
    hospital: "Prince Sultan Military Medical City (PSMMC)",
    region: "Riyadh",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["Wants standardised PYP protocol across KSA centres", "Concerned about DPD/HMDP tracer availability outside Riyadh"],
    preferredEvidenceType: ["Nuclear imaging protocols", "Diagnostic accuracy data", "Tracer comparison studies"],
    relationshipStage: "champion",
    attrExperience: "Very High — first author landmark KSA nuclear imaging best practices paper (Diagnostics 2024); convened 10-expert KSA nuclear medicine panel; established ATTR-CM scintigraphy pathway at PSMMC",
    keyMessage: "Early PYP Grade 2-3 diagnosis enables earlier AMVUTTRA initiation — HELIOS-B shows greater benefit in Stage 1 vs Stage 3 (HR 0.57 vs 0.85)",
    nextAction: "Collaborate on national PYP standardisation initiative; provide AMVUTTRA post-diagnosis pathway materials",
    lastContact: "February 2026",
    notes: "Definitive KSA authority on PYP scintigraphy for ATTR-CM. His 2024 paper is the reference standard for nuclear imaging protocols in Saudi Arabia. Key relationship for ensuring PYP-diagnosed patients are channelled to treatment. Military medical system covers large patient population.",
  },
  {
    id: "p4",
    name: "Dr. Mouaz H. Al-Mallah",
    title: "Director, Cardiac PET — Consultant Cardiologist",
    specialty: "Cardiology — Cardiac PET/Nuclear Imaging, Cardiac Amyloidosis",
    hospital: "King Abdulaziz Cardiac Center, NGHA (Riyadh) / Houston Methodist (USA)",
    region: "Riyadh",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["Primarily US-based; Saudi engagement is part-time", "Wants PET-based ATTR imaging data"],
    preferredEvidenceType: ["PET imaging data", "Nuclear cardiology outcomes", "International RCT data"],
    relationshipStage: "evaluating",
    attrExperience: "Very High — corresponding author Alqarni 2024 KSA nuclear imaging paper; published nuclear imaging techniques for cardiac amyloidosis review (Curr Opin Cardiol 2024); dual US-Saudi appointment",
    keyMessage: "AMVUTTRA is the only dual-indication RNAi therapy approved for both ATTR-CM and hATTR-PN — single agent, single mechanism",
    nextAction: "Engage during Saudi visits; invite to international ATTR symposium; provide PET imaging data package",
    lastContact: "January 2026",
    notes: "International KOL with strong Saudi ties. Part-time at KACC-NGHA. Best approached at SHA or international cardiology meetings. High influence on Saudi nuclear cardiology community through his NGHA role.",
  },
  {
    id: "p5",
    name: "Dr. Faisal Al Badarin",
    title: "Consultant Nuclear Cardiologist",
    specialty: "Nuclear Cardiology — Cardiac Imaging, Amyloidosis Imaging Practices",
    hospital: "King Abdulaziz Cardiac Center, NGHA (Riyadh) / Houston Methodist (USA)",
    region: "Riyadh",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["Wants Middle East-specific imaging utilisation data", "Concerned about tracer standardisation across GCC"],
    preferredEvidenceType: ["Regional imaging data", "Multicentre imaging studies", "Diagnostic pathway outcomes"],
    relationshipStage: "interested",
    attrExperience: "High — first author Al Badarin 2024 EHJ Imaging paper on amyloidosis imaging practices in Middle East; dual NGHA/Houston Methodist appointment",
    keyMessage: "Accurate PYP-based diagnosis is the gateway to treatment — AMVUTTRA HELIOS-B enrolled patients based on Grade 2-3 PYP or biopsy-confirmed ATTR",
    nextAction: "Share HELIOS-B imaging eligibility criteria; invite to GCC amyloidosis imaging working group",
    lastContact: "February 2026",
    notes: "Rising KOL in cardiac amyloidosis imaging in the Middle East. His 2024 EHJ Imaging paper is the first regional survey of amyloidosis imaging practices. Strong GCC network. Best engaged through imaging-focused meetings.",
  },
  // ── Tier 2: Active Clinicians / Co-Investigators ─────────────────────────
  {
    id: "p6",
    name: "Dr. Hani Alsergani",
    title: "Consultant Cardiologist",
    specialty: "Cardiology — Restrictive Cardiomyopathy, Cardiac Amyloidosis",
    hospital: "Heart Center, King Faisal Specialist Hospital & Research Centre (KFSHRC)",
    region: "Riyadh",
    prescribingBehaviour: "guideline-follower",
    knownObjections: ["Wants Saudi/regional guideline endorsement", "Prefers to see 5-year OLE data before switching stable tafamidis patients"],
    preferredEvidenceType: ["Clinical practice guidelines", "Long-term OLE data", "Comparative effectiveness data"],
    relationshipStage: "evaluating",
    attrExperience: "High — co-author Ahmad 2024 (first Saudi CA report, ESC Heart Fail); co-author Omer 2024 concomitant CA+AS paper; active ATTR clinic at KFSHRC Heart Center",
    keyMessage: "HELIOS-B OLE: 42-month data shows sustained 28% mortality reduction — durable benefit beyond the 36-month primary endpoint",
    nextAction: "Share HELIOS-B 42-month OLE data; discuss KFSHRC formulary inclusion pathway",
    lastContact: "March 2026",
    notes: "Senior cardiologist at KFSHRC Heart Center with active ATTR patient panel. Co-investigator on the landmark first Saudi CA study. Cautious but data-driven. Key account for KFSHRC formulary committee. Will prescribe once OLE data matures and Saudi guidelines are updated.",
  },
  {
    id: "p7",
    name: "Dr. Ahmed Fathala",
    title: "Consultant Radiologist — Nuclear Medicine",
    specialty: "Radiology / Nuclear Medicine — Cardiac Scintigraphy, PYP Imaging",
    hospital: "Department of Radiology, King Faisal Specialist Hospital & Research Centre (KFSHRC)",
    region: "Riyadh",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["Focused on diagnostic imaging, not prescribing — needs pathway to cardiology handoff", "Wants standardised reporting criteria for PYP scans"],
    preferredEvidenceType: ["Nuclear imaging protocols", "Diagnostic accuracy studies", "Case series"],
    relationshipStage: "interested",
    attrExperience: "High — published incidental CA detection on 99mTc-MDP bone scintigraphy (PMC 2020); co-author Ahmad 2024 ESC Heart Fail; established PYP imaging pathway at KFSHRC Radiology",
    keyMessage: "Incidental PYP uptake is an opportunity — every Grade 2-3 scan should trigger cardiology referral for AMVUTTRA evaluation",
    nextAction: "Provide KFSHRC radiology-to-cardiology ATTR referral pathway template; share PYP reporting standardisation materials",
    lastContact: "February 2026",
    notes: "Critical gatekeeper — performs PYP scans that diagnose ATTR-CM. Not a prescriber but controls the diagnostic funnel. Key objective is to ensure every positive PYP scan generates a cardiology referral. Published the first Saudi case of incidentally detected CA on bone scintigraphy.",
  },
  {
    id: "p8",
    name: "Dr. Omar Ahmad",
    title: "Cardiology Registrar / Research Fellow",
    specialty: "Cardiology — Cardiac Amyloidosis, Echocardiography",
    hospital: "Alfaisal University / King Faisal Specialist Hospital & Research Centre (KFSHRC)",
    region: "Riyadh",
    prescribingBehaviour: "early-adopter",
    knownObjections: ["Early career — needs senior consultant support for prescribing decisions", "Wants access to AMVUTTRA patient registry data"],
    preferredEvidenceType: ["Echo/strain imaging data", "Biomarker studies", "Real-world registry data"],
    relationshipStage: "interested",
    attrExperience: "High — first author landmark first Saudi CA report (ESC Heart Fail 2024); first author apical sparing paper (Int J Cardiol 2026); established KFSHRC CA screening programme",
    keyMessage: "AMVUTTRA HELIOS-B enrolled patients with PYP Grade 2-3 or biopsy-confirmed ATTR — your screening programme identifies exactly these patients",
    nextAction: "Invite to Alnylam medical education programme; support KFSHRC ATTR registry development",
    lastContact: "April 2026",
    notes: "Rising star in Saudi cardiac amyloidosis research. Established the first CA screening programme at KFSHRC. Highly motivated, research-oriented. Future KOL — invest in relationship now. Responds to data and career development opportunities.",
  },
  {
    id: "p9",
    name: "Dr. Mohamed H. Omer",
    title: "Cardiology Research Fellow",
    specialty: "Cardiology — Cardiac Amyloidosis, CMR",
    hospital: "Alfaisal University / KFSHRC (Riyadh) / Cardiff University (UK)",
    region: "Riyadh",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["Dual Saudi-UK appointment limits Saudi engagement time", "Wants CMR-specific AMVUTTRA response data"],
    preferredEvidenceType: ["CMR data", "Multimodality imaging studies", "International RCT subgroup analyses"],
    relationshipStage: "interested",
    attrExperience: "High — co-author Ahmad 2024 ESC Heart Fail; first author Omer 2024 concomitant CA+AS paper (Sage Journals); co-author Mohty 2023 Frontiers ATTR-CA Saudi Arabia paper",
    keyMessage: "Concomitant ATTR-CM and aortic stenosis is common (8-15%) — AMVUTTRA treats the ATTR component regardless of AS severity",
    nextAction: "Share HELIOS-B CMR sub-study data; invite to international ATTR imaging conference",
    lastContact: "January 2026",
    notes: "Productive researcher with Saudi-UK dual affiliation. Published on concomitant CA+AS — a clinically important and under-recognised presentation. Responds to imaging data. Best engaged at international cardiology meetings or during Saudi visits.",
  },
  {
    id: "p10",
    name: "Dr. Hatem Murad",
    title: "Consultant Neurologist — Senior FAAN",
    specialty: "Neurology — Neuromuscular Diseases, EMG, hATTR-PN",
    hospital: "King Faisal Specialist Hospital & Research Centre (KFSHRC)",
    region: "Riyadh",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["Limited hATTR-PN patient volume in Saudi Arabia", "Wants NCS/EMG monitoring protocol for AMVUTTRA", "Concerned about genetic testing access for at-risk family members"],
    preferredEvidenceType: ["NIS+7 data", "Nerve conduction studies", "Quality of life outcomes", "Genetic testing data"],
    relationshipStage: "interested",
    attrExperience: "High — primary neuromuscular disease specialist at KFSHRC; Senior FAAN; neuromuscular EMG fellowship; key hATTR-PN specialist in Saudi Arabia",
    keyMessage: "HELIOS-A: 88% of AMVUTTRA patients achieved disease stabilisation vs 51% placebo — NIS+7 +0.1 vs +14.8 (P<0.001)",
    nextAction: "Provide hATTR-PN monitoring protocol (NIS+7, autonomic testing schedule); share Alnylam Act genetic testing materials for family cascade screening",
    lastContact: "March 2026",
    notes: "The primary hATTR-PN specialist in Saudi Arabia. FAAN-credentialed with neuromuscular EMG fellowship. Key relationship for hATTR-PN indication. Alnylam Act genetic testing programme is a strong engagement tool given his interest in family cascade screening. Responds to NCS/EMG data and quality of life outcomes.",
  },
  {
    id: "p11",
    name: "Dr. Bahaa M. Fadel",
    title: "Consultant Cardiologist",
    specialty: "Cardiology — Restrictive Cardiomyopathy, Cardiac Amyloidosis, Heart Transplant",
    hospital: "King Faisal Specialist Hospital & Research Centre (KFSHRC)",
    region: "Riyadh",
    prescribingBehaviour: "guideline-follower",
    knownObjections: ["Prefers heart transplant pathway for advanced ATTR-CM", "Wants AMVUTTRA data in post-transplant patients", "Concerned about drug interactions in transplant recipients"],
    preferredEvidenceType: ["Advanced HF data", "Post-transplant outcomes", "Drug interaction studies"],
    relationshipStage: "aware",
    attrExperience: "High — MediFind Experienced expert in cardiac amyloidosis; expertise in RCM, cardiac tamponade, aortic regurgitation, and heart transplant; active ATTR patient panel at KFSHRC",
    keyMessage: "AMVUTTRA in Stage 1-2 ATTR-CM may delay or prevent progression to transplant eligibility — early treatment is the key message",
    nextAction: "Discuss AMVUTTRA as bridge-to-transplant or transplant-avoidance strategy; share HELIOS-B Stage 1-2 subgroup data",
    lastContact: "January 2026",
    notes: "Transplant cardiologist with ATTR expertise. Key account for advanced ATTR-CM patients who may be transplant candidates. Positioning AMVUTTRA as disease-modifying therapy that delays transplant need is the most compelling message for this profile.",
  },
  // ── Tier 3: Nuclear Medicine Experts / Regional Specialists ──────────────
  {
    id: "p12",
    name: "Dr. Hussein R. Farghaly",
    title: "Consultant Nuclear Medicine Physician",
    specialty: "Nuclear Medicine — Cardiac Scintigraphy",
    hospital: "Prince Sultan Military Medical City (PSMMC)",
    region: "Riyadh",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["Focused on diagnostics, not treatment decisions", "Wants standardised PYP reporting templates"],
    preferredEvidenceType: ["Nuclear imaging protocols", "Diagnostic pathway data"],
    relationshipStage: "aware",
    attrExperience: "Moderate-High — co-author Alqarni 2024 KSA nuclear imaging best practices paper; PSMMC nuclear medicine department",
    keyMessage: "Every Grade 2-3 PYP scan is a potential AMVUTTRA patient — standardised reporting drives referral rates",
    nextAction: "Provide PSMMC PYP reporting template and cardiology referral pathway; co-develop ATTR diagnostic pathway with Dr. Alqarni",
    lastContact: "February 2026",
    notes: "Key nuclear medicine colleague of Dr. Alqarni at PSMMC. Engage as part of PSMMC ATTR diagnostic pathway initiative. Military medical system covers large patient population including military personnel and families.",
  },
  {
    id: "p13",
    name: "Dr. Aquib Mohammadidrees Bakhsh",
    title: "Consultant Nuclear Medicine Physician",
    specialty: "Nuclear Medicine — Cardiac Scintigraphy",
    hospital: "King Abdullah Medical City",
    region: "Makkah",
    prescribingBehaviour: "guideline-follower",
    knownObjections: ["Limited ATTR specialist cardiologists in Makkah for referral", "Wants regional referral pathway to Riyadh Tier 1 centres"],
    preferredEvidenceType: ["Nuclear imaging protocols", "Referral pathway guidelines"],
    relationshipStage: "aware",
    attrExperience: "Moderate — co-author Alqarni 2024 KSA nuclear imaging paper; KAMC nuclear medicine department, Makkah",
    keyMessage: "KAMC Makkah PYP-positive patients should be referred to KFSHRC or KAUH Jeddah for AMVUTTRA initiation — provide referral pathway",
    nextAction: "Establish Makkah-to-Jeddah ATTR referral pathway; provide AMVUTTRA patient referral letter template",
    lastContact: "January 2026",
    notes: "Key regional contact for Makkah. KAMC serves a large population including Hajj/Umrah medical services. Establishing a clear referral pathway from KAMC to Jeddah Tier 1 centres is the primary objective.",
  },
  {
    id: "p14",
    name: "Dr. Hossam Ahmed Maher El-Zeftawy",
    title: "Consultant Nuclear Medicine Physician",
    specialty: "Nuclear Medicine — Cardiac Scintigraphy",
    hospital: "King Faisal Specialist Hospital & Research Centre (KFSHRC) — Jeddah Branch",
    region: "Makkah (Jeddah)",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["Wants Jeddah-specific ATTR patient data", "Limited ATTR cardiologist colleagues at KFSHRC Jeddah"],
    preferredEvidenceType: ["Nuclear imaging protocols", "Local patient data"],
    relationshipStage: "aware",
    attrExperience: "Moderate — co-author Alqarni 2024 KSA nuclear imaging paper; KFSHRC Jeddah nuclear medicine department",
    keyMessage: "KFSHRC Jeddah PYP-positive patients can be managed locally — connect with Dr. Mohty (KFSHRC Riyadh) for teleconsultation pathway",
    nextAction: "Establish KFSHRC Jeddah-Riyadh ATTR teleconsultation pathway; provide PYP reporting template",
    lastContact: "December 2025",
    notes: "KFSHRC Jeddah nuclear medicine contact. Jeddah branch of KFSHRC has nuclear imaging capability but limited ATTR cardiology expertise. Establishing a teleconsultation pathway with Dr. Mohty in Riyadh would accelerate diagnosis-to-treatment.",
  },
  {
    id: "p15",
    name: "Dr. Mukhtar Ahmed M. Alqadhi",
    title: "Consultant Nuclear Medicine Physician",
    specialty: "Nuclear Medicine — Cardiac Scintigraphy",
    hospital: "King Fahad Hospital, Al-Ahsa Healthcare Cluster",
    region: "Eastern Province",
    prescribingBehaviour: "guideline-follower",
    knownObjections: ["Al-Ahsa is remote — limited ATTR specialist access", "Wants referral pathway to Eastern Province Tier 1 centre"],
    preferredEvidenceType: ["Nuclear imaging protocols", "Referral pathway guidelines"],
    relationshipStage: "uncontacted",
    attrExperience: "Low-Moderate — co-author Alqarni 2024 KSA nuclear imaging paper; King Fahad Hospital Al-Ahsa",
    keyMessage: "Al-Ahsa PYP-positive patients should be referred to King Fahd Hospital University (Al-Khobar) or KFSHRC Riyadh for AMVUTTRA evaluation",
    nextAction: "First contact — introduce AMVUTTRA and provide Eastern Province ATTR referral pathway; invite to regional ATTR educational event",
    lastContact: "Not yet contacted",
    notes: "First contact needed. Al-Ahsa is an underserved region with limited ATTR specialist access. Al-Ahsa has a large population with potential for significant undiagnosed ATTR burden.",
  },
  {
    id: "p16",
    name: "Dr. Mushref Algarni",
    title: "Consultant Nuclear Medicine Physician",
    specialty: "Nuclear Medicine — Cardiac Scintigraphy",
    hospital: "King Fahad Military Medical Complex",
    region: "Eastern Province (Dhahran)",
    prescribingBehaviour: "guideline-follower",
    knownObjections: ["Military system procurement process", "Wants ATTR-CM guideline update from Saudi Heart Association"],
    preferredEvidenceType: ["Nuclear imaging protocols", "Clinical guidelines", "Military formulary data"],
    relationshipStage: "uncontacted",
    attrExperience: "Low-Moderate — co-author Alqarni 2024 KSA nuclear imaging paper; King Fahad Military Medical Complex, Dhahran",
    keyMessage: "Military personnel and retirees are at risk for wtATTR-CM — KFMMC PYP programme can identify these patients for AMVUTTRA treatment",
    nextAction: "First contact — introduce AMVUTTRA; provide military formulary dossier; connect with Dr. Alqarni (PSMMC) as peer reference",
    lastContact: "Not yet contacted",
    notes: "First contact needed. Military medical system in Dhahran/Eastern Province. Military retirees are a high-risk wtATTR-CM population. Peer connection with Dr. Alqarni at PSMMC (same military system) is a strong engagement strategy.",
  },
  {
    id: "p17",
    name: "Dr. Zain Mohammed Asiri",
    title: "Consultant Nuclear Medicine Physician",
    specialty: "Nuclear Medicine — Cardiac Scintigraphy",
    hospital: "King Saud Medical City",
    region: "Riyadh",
    prescribingBehaviour: "evidence-seeker",
    knownObjections: ["KSMC is a MOH hospital — formulary process differs from KFSHRC/NGHA", "Wants MOH formulary listing for AMVUTTRA"],
    preferredEvidenceType: ["Nuclear imaging protocols", "MOH formulary data", "Cost-effectiveness analyses"],
    relationshipStage: "aware",
    attrExperience: "Moderate — co-author Alqarni 2024 KSA nuclear imaging paper; King Saud Medical City nuclear medicine department",
    keyMessage: "KSMC PYP-positive patients can be referred to KFSHRC or NGHA for AMVUTTRA initiation while MOH formulary listing is pursued",
    nextAction: "Provide KSMC-to-KFSHRC ATTR referral pathway; support MOH formulary submission with HELIOS-B data package",
    lastContact: "February 2026",
    notes: "KSMC is the largest MOH hospital in Riyadh. MOH formulary listing is a key strategic objective — KSMC nuclear medicine can be an advocate. Referral pathway to KFSHRC or NGHA is the near-term solution while MOH listing is pursued.",
  },
];

const BEHAVIOUR_LABELS: Record<string, { label: string; color: string; description: string }> = {
  "early-adopter": { label: "Early Adopter", color: "#00C2A8", description: "Embraces new therapies quickly; motivated by innovation" },
  "evidence-seeker": { label: "Evidence Seeker", color: "#3B82F6", description: "Requires robust RCT data; responds to head-to-head comparisons" },
  "guideline-follower": { label: "Guideline Follower", color: "#F0A500", description: "Waits for guideline endorsement; responds to consensus statements" },
  "cost-conscious": { label: "Cost-Conscious", color: "#8E44AD", description: "Prioritises cost-effectiveness; needs budget impact data" },
  "sceptic": { label: "Sceptic", color: "#E74C3C", description: "Questions new therapies; requires extensive evidence and relationship-building" },
};

const RELATIONSHIP_STAGES: Record<string, { label: string; color: string; step: number }> = {
  "uncontacted": { label: "Uncontacted", color: "#9AA5B4", step: 0 },
  "aware": { label: "Aware", color: "#F0A500", step: 1 },
  "interested": { label: "Interested", color: "#3B82F6", step: 2 },
  "evaluating": { label: "Evaluating", color: "#8E44AD", step: 3 },
  "prescribing": { label: "Prescribing", color: "#00C2A8", step: 4 },
  "champion": { label: "Champion / KOL", color: "#F0A500", step: 5 },
};

const EMPTY_PROFILE: HCPProfile = {
  id: "new",
  name: "",
  title: "",
  specialty: "",
  hospital: "",
  region: "",
  prescribingBehaviour: "evidence-seeker",
  knownObjections: [""],
  preferredEvidenceType: [""],
  relationshipStage: "uncontacted",
  attrExperience: "",
  keyMessage: "",
  nextAction: "",
  lastContact: "",
  notes: "",
};

export default function AccountProfileSection() {
  const [profiles, setProfiles] = useState<HCPProfile[]>(PRESET_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<HCPProfile>(PRESET_PROFILES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<HCPProfile>(PRESET_PROFILES[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  const handleEdit = () => {
    setEditForm({ ...selectedProfile });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    const newProfile = { ...EMPTY_PROFILE, id: `p${Date.now()}` };
    setEditForm(newProfile);
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (isCreating) {
      const updated = [...profiles, editForm];
      setProfiles(updated);
      setSelectedProfile(editForm);
    } else {
      const updated = profiles.map((p) => (p.id === editForm.id ? editForm : p));
      setProfiles(updated);
      setSelectedProfile(editForm);
    }
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    if (selectedProfile.id === id && updated.length > 0) {
      setSelectedProfile(updated[0]);
    }
  };

  const behaviour = BEHAVIOUR_LABELS[selectedProfile.prescribingBehaviour];
  const relationship = RELATIONSHIP_STAGES[selectedProfile.relationshipStage];

  return (
    <section
      id="account-profiles"
      style={{
        background: "#fff",
        padding: "80px 0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ width: "48px", height: "3px", background: "#00C2A8", marginBottom: "16px" }} />
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#060D18", margin: "0 0 8px" }}>
              Account Profile Builder
            </h2>
            <p style={{ color: "#5A6A7A", fontSize: "1rem", margin: 0 }}>
              One-page HCP profiles for Saudi Arabia — specialty, prescribing behaviour, objections, and relationship stage
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCreate}
              style={{
                background: "#060D18",
                color: "#00C2A8",
                border: "none",
                padding: "10px 18px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.06em",
              }}
            >
              + New Profile
            </button>
            <button
              onClick={() => setPrintMode(!printMode)}
              style={{
                background: "transparent",
                color: "#5A6A7A",
                border: "1px solid #E8ECF0",
                padding: "10px 18px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🖨 Print Profile
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", alignItems: "start" }}>
          {/* Profile List */}
          <div style={{ background: "#F8F9FA", borderRadius: "12px", padding: "16px", border: "1px solid #E8ECF0" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              {profiles.length} Profiles
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {profiles.map((profile) => {
                const rel = RELATIONSHIP_STAGES[profile.relationshipStage];
                const beh = BEHAVIOUR_LABELS[profile.prescribingBehaviour];
                const isSelected = selectedProfile.id === profile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => { setSelectedProfile(profile); setIsEditing(false); }}
                    style={{
                      background: isSelected ? "#fff" : "transparent",
                      border: isSelected ? `2px solid ${rel.color}` : "2px solid transparent",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#060D18", marginBottom: "2px" }}>{profile.name}</div>
                    <div style={{ fontSize: "10px", color: "#5A6A7A", marginBottom: "6px" }}>{profile.hospital.split(" ").slice(0, 3).join(" ")}</div>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      <span style={{ background: `${rel.color}20`, color: rel.color, padding: "2px 6px", borderRadius: "3px", fontSize: "9px", fontWeight: 700 }}>
                        {rel.label}
                      </span>
                      <span style={{ background: `${beh.color}15`, color: beh.color, padding: "2px 6px", borderRadius: "3px", fontSize: "9px", fontWeight: 700 }}>
                        {beh.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile Detail / Edit */}
          {isEditing ? (
            <div style={{ background: "#F8F9FA", borderRadius: "12px", padding: "28px", border: "1px solid #E8ECF0" }}>
              <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: "#060D18", margin: "0 0 20px" }}>
                {isCreating ? "Create New Profile" : "Edit Profile"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Full Name", key: "name" },
                  { label: "Title", key: "title" },
                  { label: "Specialty", key: "specialty" },
                  { label: "Hospital", key: "hospital" },
                  { label: "Region", key: "region" },
                  { label: "Last Contact", key: "lastContact" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
                      {label}
                    </label>
                    <input
                      value={(editForm as unknown as Record<string, string>)[key]}
                      onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid #E8ECF0", borderRadius: "6px", fontSize: "12px", background: "#fff", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
                    Prescribing Behaviour
                  </label>
                  <select
                    value={editForm.prescribingBehaviour}
                    onChange={(e) => setEditForm({ ...editForm, prescribingBehaviour: e.target.value as HCPProfile["prescribingBehaviour"] })}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #E8ECF0", borderRadius: "6px", fontSize: "12px", background: "#fff" }}
                  >
                    {Object.entries(BEHAVIOUR_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
                    Relationship Stage
                  </label>
                  <select
                    value={editForm.relationshipStage}
                    onChange={(e) => setEditForm({ ...editForm, relationshipStage: e.target.value as HCPProfile["relationshipStage"] })}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #E8ECF0", borderRadius: "6px", fontSize: "12px", background: "#fff" }}
                  >
                    {Object.entries(RELATIONSHIP_STAGES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {[
                { label: "ATTR Experience", key: "attrExperience" },
                { label: "Key Message for This HCP", key: "keyMessage" },
                { label: "Next Action", key: "nextAction" },
                { label: "Notes", key: "notes" },
              ].map(({ label, key }) => (
                <div key={key} style={{ marginTop: "16px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
                    {label}
                  </label>
                  <textarea
                    value={(editForm as unknown as Record<string, string>)[key]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    rows={2}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #E8ECF0", borderRadius: "6px", fontSize: "12px", background: "#fff", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
              ))}
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={handleSave} style={{ background: "#00C2A8", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                  Save Profile
                </button>
                <button onClick={() => { setIsEditing(false); setIsCreating(false); }} style={{ background: "transparent", color: "#5A6A7A", border: "1px solid #E8ECF0", padding: "10px 20px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Profile View */
            <div style={{ background: "#fff", borderRadius: "12px", border: `2px solid ${relationship.color}`, overflow: "hidden" }}>
              {/* Profile Header */}
              <div style={{ background: "#060D18", padding: "28px 32px", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#00C2A8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                      HCP Profile · NewBridge Pharmaceuticals
                    </div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.6rem", color: "#fff", margin: "0 0 4px" }}>
                      {selectedProfile.name}
                    </h3>
                    <div style={{ fontSize: "13px", color: "#9AA5B4", marginBottom: "4px" }}>{selectedProfile.title}</div>
                    <div style={{ fontSize: "12px", color: "#9AA5B4" }}>{selectedProfile.hospital} · {selectedProfile.region}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                    <span style={{ background: `${behaviour.color}25`, color: behaviour.color, padding: "5px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>
                      {behaviour.label}
                    </span>
                    <span style={{ background: `${relationship.color}25`, color: relationship.color, padding: "5px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>
                      {relationship.label}
                    </span>
                  </div>
                </div>

                {/* Relationship Progress Bar */}
                <div style={{ marginTop: "20px" }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Relationship Journey
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {Object.entries(RELATIONSHIP_STAGES).map(([key, val]) => (
                      <div
                        key={key}
                        style={{
                          flex: 1,
                          height: "4px",
                          borderRadius: "2px",
                          background: val.step <= relationship.step ? relationship.color : "rgba(255,255,255,0.15)",
                          transition: "background 0.3s",
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    {Object.entries(RELATIONSHIP_STAGES).map(([key, val]) => (
                      <span key={key} style={{ fontSize: "8px", color: val.step <= relationship.step ? relationship.color : "#5A6A7A", fontWeight: 600 }}>
                        {val.label.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile Body */}
              <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Specialty & Experience */}
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Specialty & ATTR Experience
                  </div>
                  <div style={{ fontSize: "12px", color: "#374151", marginBottom: "6px", fontWeight: 600 }}>{selectedProfile.specialty}</div>
                  <div style={{ fontSize: "12px", color: "#5A6A7A", lineHeight: 1.6 }}>{selectedProfile.attrExperience}</div>
                </div>

                {/* Prescribing Behaviour */}
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Prescribing Behaviour
                  </div>
                  <div
                    style={{
                      background: `${behaviour.color}10`,
                      border: `1px solid ${behaviour.color}40`,
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 700, color: behaviour.color, marginBottom: "4px" }}>{behaviour.label}</div>
                    <div style={{ fontSize: "11px", color: "#5A6A7A", lineHeight: 1.5 }}>{behaviour.description}</div>
                  </div>
                </div>

                {/* Known Objections */}
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Known Objections
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                    {selectedProfile.knownObjections.map((obj, i) => (
                      <li key={i} style={{ fontSize: "11px", color: "#374151", marginBottom: "5px", lineHeight: 1.5 }}>{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* Preferred Evidence */}
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Preferred Evidence Type
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {selectedProfile.preferredEvidenceType.map((ev, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#F0F4F8",
                          color: "#374151",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: 600,
                        }}
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Message */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Tailored Key Message
                  </div>
                  <div
                    style={{
                      background: "#060D18",
                      color: "#00C2A8",
                      padding: "14px 18px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: 1.6,
                      borderLeft: "4px solid #00C2A8",
                    }}
                  >
                    "{selectedProfile.keyMessage}"
                  </div>
                </div>

                {/* Next Action */}
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Next Action
                  </div>
                  <div
                    style={{
                      background: "#FFF8E7",
                      border: "1px solid #F0A500",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      fontSize: "12px",
                      color: "#374151",
                      lineHeight: 1.5,
                    }}
                  >
                    {selectedProfile.nextAction}
                  </div>
                </div>

                {/* Last Contact */}
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Last Contact
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#060D18" }}>{selectedProfile.lastContact || "Not yet contacted"}</div>
                </div>

                {/* Notes */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Field Notes
                  </div>
                  <div
                    style={{
                      background: "#F8F9FA",
                      borderRadius: "6px",
                      padding: "12px 14px",
                      fontSize: "12px",
                      color: "#374151",
                      lineHeight: 1.7,
                      borderLeft: "3px solid #E8ECF0",
                    }}
                  >
                    {selectedProfile.notes}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: "16px 32px", borderTop: "1px solid #E8ECF0", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  onClick={handleEdit}
                  style={{
                    background: "#060D18",
                    color: "#00C2A8",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => handleDelete(selectedProfile.id)}
                  style={{
                    background: "transparent",
                    color: "#E74C3C",
                    border: "1px solid #E74C3C",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
