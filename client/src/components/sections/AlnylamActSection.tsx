/* AlnylamActSection.tsx
   Design: Clinical Precision / Swiss Medical Modernism
   Alnylam Act® Genetic Testing & Counselling Programme Module
   Covers: programme overview, eligibility criteria, testing process,
   genetic counselling, cascade screening, privacy, HCP talking points */

import { useState } from "react";

type TabId = "overview" | "eligibility" | "process" | "counselling" | "cascade" | "hcp-talking";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "overview",     label: "Programme Overview",    icon: "🧬" },
  { id: "eligibility",  label: "Eligibility Criteria",  icon: "✅" },
  { id: "process",      label: "Testing Process",       icon: "🔬" },
  { id: "counselling",  label: "Genetic Counselling",   icon: "💬" },
  { id: "cascade",      label: "Cascade Screening",     icon: "👨‍👩‍👧‍👦" },
  { id: "hcp-talking",  label: "HCP Talking Points",    icon: "🗣️" },
];

const ACCENT  = "#00C2A8";
const DARK    = "#060D18";
const DNA_GRN = "#10B981";

export default function AlnylamActSection() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <section
      id="alnylam-act"
      style={{
        background: "linear-gradient(180deg, #F0FDF9 0%, #F8F9FA 100%)",
        padding: "80px 0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="container">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ width: "48px", height: "3px", background: DNA_GRN }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: DNA_GRN, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
              Genetic Testing Programme
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "16px" }}>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: DARK, margin: "0 0 6px" }}>
                Alnylam Act® Genetic Testing &amp; Counselling
              </h2>
              <p style={{ color: "#5A6A7A", fontSize: "1rem", margin: 0 }}>
                No-charge TTR gene testing and genetic counselling for at-risk individuals and family members
              </p>
            </div>
            {/* Programme badges */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
              <div style={{ background: "#E6F7F5", border: "1px solid #14b8a6", borderRadius: "8px", padding: "8px 16px", textAlign: "center" as const }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#0d9488" }}>Lab Partner</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: DARK }}>Prevention Genetics</div>
                <div style={{ fontSize: "10px", color: "#5A6A7A" }}>CLIA &amp; CAP Certified</div>
              </div>
              <div style={{ background: "#EEF2FF", border: "1px solid #6366F1", borderRadius: "8px", padding: "8px 16px", textAlign: "center" as const }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#4F46E5" }}>Counselling Partner</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: DARK }}>Genome Medical</div>
                <div style={{ fontSize: "10px", color: "#5A6A7A" }}>Independent third party</div>
              </div>
              <div style={{ background: "#FFF8E1", border: "1px solid #F59E0B", borderRadius: "8px", padding: "8px 16px", textAlign: "center" as const }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#B45309" }}>Coverage</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: DARK }}>US &amp; Canada</div>
                <div style={{ fontSize: "10px", color: "#5A6A7A" }}>No charge to patient/payer</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── HERO STAT STRIP ────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { value: "$0",      sub: "Cost to patient, provider, or payer for testing and counselling", color: DNA_GRN,  icon: "💰" },
            { value: "~3 wks",  sub: "Typical turnaround time from sample receipt to results",           color: ACCENT,   icon: "⏱️" },
            { value: "50%",     sub: "Probability first-degree relatives carry a pathogenic TTR variant", color: "#8B5CF6", icon: "🧬" },
            { value: "TTR",     sub: "Gene evaluated — all known pathogenic variants associated with hATTR", color: "#3B82F6", icon: "🔬" },
          ].map((s) => (
            <div key={s.value} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", padding: "20px", position: "relative" as const, overflow: "hidden" as const }}>
              <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, height: "3px", background: s.color }} />
              <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: s.color, fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1, marginBottom: "6px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#5A6A7A", lineHeight: 1.4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── TAB BAR ────────────────────────────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", borderBottom: "2px solid #F3F4F6", overflowX: "auto" as const, scrollbarWidth: "none" as const }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "16px 20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: activeTab === tab.id ? DNA_GRN : "#9CA3AF",
                  borderBottom: activeTab === tab.id ? `2px solid ${DNA_GRN}` : "2px solid transparent",
                  marginBottom: "-2px",
                  whiteSpace: "nowrap" as const,
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ──────────────────────────────────────── */}
          <div style={{ padding: "32px 28px" }}>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                    What is Alnylam Act®?
                  </h3>
                  <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "0 0 14px" }}>
                    Alnylam Act® is a sponsored, no-charge, third-party genetic testing and counselling programme designed to reduce barriers to genetic testing and help individuals make more informed decisions about their health. The programme covers testing for hereditary ATTR (hATTR) amyloidosis, acute hepatic porphyria (AHP), and primary hyperoxaluria type 1 (PH1).
                  </p>
                  <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "0 0 20px" }}>
                    For ATTR amyloidosis, the programme evaluates the <strong>TTR gene</strong> for all known pathogenic variants. Testing is performed by <strong>Prevention Genetics</strong> (CLIA and CAP certified), and genetic counselling is provided by <strong>Genome Medical</strong> — both independent third parties operating separately from Alnylam Pharmaceuticals.
                  </p>
                  <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "16px 18px", borderLeft: "4px solid #14b8a6" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#0d9488", marginBottom: "6px" }}>Why This Matters for Your Practice</div>
                    <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>
                      hATTR amyloidosis is autosomal dominant. Each first-degree relative of a confirmed hATTR patient has a <strong>~50% probability</strong> of carrying the pathogenic variant. Early identification enables earlier treatment initiation — before irreversible organ damage occurs.
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                    Programme Key Features
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
                    {[
                      { icon: "💰", title: "Truly No Cost", desc: "No charge to the patient, the healthcare provider, or the payer. Alnylam sponsors the full cost of testing and counselling.", color: DNA_GRN },
                      { icon: "🔒", title: "Privacy Protected", desc: "Testing and counselling are performed by independent third parties. Only de-identified data may be shared with Alnylam. Patient identifiable information is never disclosed to the sponsor.", color: "#3B82F6" },
                      { icon: "🏥", title: "CLIA/CAP Certified Lab", desc: "Prevention Genetics is a CLIA-certified (52D2065132) and CAP-certified (7185561) laboratory, ensuring validated methods and quality controls.", color: "#8B5CF6" },
                      { icon: "🧬", title: "Comprehensive TTR Testing", desc: "Evaluates the TTR gene for all known pathogenic variants associated with hATTR amyloidosis — both cardiac (Val122Ile, etc.) and neurological (Val30Met, etc.) variants.", color: ACCENT },
                      { icon: "👩‍⚕️", title: "Independent Genetic Counselling", desc: "Pre- and post-test counselling available through Genome Medical, an independent third party. Counsellors do not provide medical care or treatment recommendations.", color: "#F59E0B" },
                      { icon: "🌍", title: "US & Canada Coverage", desc: "Available to eligible individuals aged 18+ in the United States and Canada.", color: "#EF4444" },
                    ].map((f) => (
                      <div key={f.title} style={{ display: "flex", gap: "12px", padding: "12px 14px", background: "#F8F9FA", borderRadius: "10px", alignItems: "flex-start" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{f.icon}</div>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "3px" }}>{f.title}</div>
                          <div style={{ fontSize: "11px", color: "#5A6A7A", lineHeight: 1.5 }}>{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ELIGIBILITY TAB */}
            {activeTab === "eligibility" && (
              <div>
                <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "14px 18px", border: "1px solid #14b8a6", marginBottom: "24px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#0d9488", marginBottom: "4px" }}>📋 General Eligibility Requirements</div>
                  <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>
                    Patients must be <strong>aged 18 or older</strong> and located in the <strong>United States or Canada</strong>. They must meet at least one of the criteria in Track A, OR at least two criteria in Track B.
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>
                  {/* Track A */}
                  <div style={{ borderRadius: "12px", border: `2px solid ${DNA_GRN}`, overflow: "hidden" }}>
                    <div style={{ background: DNA_GRN, padding: "14px 18px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#fff", marginBottom: "2px" }}>Track A — High Index of Suspicion</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)" }}>Requires at least ONE of the following</div>
                    </div>
                    <div style={{ padding: "16px 18px" }}>
                      {[
                        { icon: "👨‍👩‍👧", title: "Family History", desc: "Confirmed family history of hereditary ATTR (hATTR) amyloidosis in a first- or second-degree relative" },
                        { icon: "🫀", title: "Positive Amyloid Imaging", desc: "Positive imaging consistent with amyloid — technetium pyrophosphate (PYP) scan, cardiac MRI (CMR), or strain echocardiography" },
                        { icon: "🔬", title: "Positive Biopsy", desc: "Biopsy-confirmed TTR amyloid deposits in any tissue (Congo red staining with TTR immunohistochemistry or mass spectrometry)" },
                      ].map((c) => (
                        <div key={c.title} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "20px", flexShrink: 0 }}>{c.icon}</span>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "3px" }}>{c.title}</div>
                            <div style={{ fontSize: "11px", color: "#5A6A7A", lineHeight: 1.4 }}>{c.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Track B */}
                  <div style={{ borderRadius: "12px", border: "2px solid #3B82F6", overflow: "hidden" }}>
                    <div style={{ background: "#3B82F6", padding: "14px 18px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#fff", marginBottom: "2px" }}>Track B — Index of Suspicion</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)" }}>Requires at least TWO of the following</div>
                    </div>
                    <div style={{ padding: "16px 18px" }}>
                      {[
                        { icon: "🦶", title: "Neuropathy Symptoms", desc: "Sensory/motor neuropathy: neuropathic pain, altered sensation, numbness/tingling, muscle weakness, impaired balance, difficulty walking, carpal tunnel-associated neuropathy, EMG/NCS abnormalities" },
                        { icon: "🫁", title: "Autonomic Dysfunction", desc: "Nausea/vomiting, changes in GI motility, orthostatic hypotension, sexual dysfunction, bladder dysfunction" },
                        { icon: "🫀", title: "Cardiac Disease", desc: "Cardiomyopathy, restrictive physiology, hypertrophy, arrhythmias, conduction abnormalities, heart failure, abnormal cardiac imaging" },
                        { icon: "🦴", title: "Musculoskeletal Indicators", desc: "History of carpal tunnel syndrome, back pain/lumbar spinal stenosis, rotator cuff injury" },
                        { icon: "🫘", title: "Renal Abnormalities", desc: "Renal insufficiency and/or proteinuria not otherwise explained" },
                        { icon: "👁️", title: "Ocular Changes", desc: "Vitreous opacity, glaucoma, dry eyes, ocular amyloid angiopathy, retinal detachment" },
                      ].map((c) => (
                        <div key={c.title} style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "16px", flexShrink: 0 }}>{c.icon}</span>
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "2px" }}>{c.title}</div>
                            <div style={{ fontSize: "10px", color: "#5A6A7A", lineHeight: 1.4 }}>{c.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specimen types */}
                <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", padding: "20px 24px" }}>
                  <h4 style={{ fontSize: "12px", fontWeight: 700, color: DARK, textTransform: "uppercase" as const, letterSpacing: "0.06em", margin: "0 0 14px" }}>Accepted Specimen Types</h4>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" as const }}>
                    {[
                      { type: "Whole Blood", detail: "Standard blood draw — EDTA tube", icon: "🩸" },
                      { type: "Saliva", detail: "Non-invasive collection kit", icon: "💧" },
                      { type: "OCD-100 Buccal Swab", detail: "Cheek swab — ideal for remote collection", icon: "🧪" },
                    ].map((s) => (
                      <div key={s.type} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px 16px", background: "#F8F9FA", borderRadius: "10px", flex: "1 1 180px" }}>
                        <span style={{ fontSize: "24px" }}>{s.icon}</span>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: DARK }}>{s.type}</div>
                          <div style={{ fontSize: "10px", color: "#5A6A7A" }}>{s.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TESTING PROCESS TAB */}
            {activeTab === "process" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 20px" }}>
                    Step-by-Step Testing Process
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "0" }}>
                    {[
                      { step: 1, title: "Provider Reviews Eligibility", desc: "The HCP reviews the patient's symptoms, history, and family background against the Alnylam Act® eligibility criteria (Track A or Track B).", detail: "Eligibility tool available at preventiongenetics.com/alnylam-act", color: DNA_GRN },
                      { step: 2, title: "Test is Ordered Online", desc: "The provider places the test order through the Prevention Genetics online portal or completes the paper Test Request Form (TRF). No prior authorisation required.", detail: "Test Code: 15139 | TTR gene sequencing and deletion/duplication analysis", color: ACCENT },
                      { step: 3, title: "Sample Collection Kit Sent", desc: "Prevention Genetics ships a collection kit directly to the provider or patient (for buccal swab). The provider collects the specimen, labels it per instructions, and ships to the lab.", detail: "Whole blood, saliva, or OCD-100 buccal swab accepted", color: "#3B82F6" },
                      { step: 4, title: "Laboratory Analysis", desc: "Prevention Genetics performs TTR gene sequencing and deletion/duplication analysis using validated, quality-controlled methods in their CLIA/CAP-certified laboratory.", detail: "Turnaround time: approximately 3 weeks from sample receipt", color: "#8B5CF6" },
                      { step: 5, title: "Results Delivered to Provider", desc: "Results are sent directly to the ordering provider. The provider reviews results with the patient and discusses implications for diagnosis and family screening.", detail: "Post-test genetic counselling available through Genome Medical upon request", color: "#F59E0B" },
                    ].map((s, idx) => (
                      <div key={s.step} style={{ display: "flex", gap: "0" }}>
                        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", marginRight: "16px" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: s.color, color: "#fff", fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                          {idx < 4 && <div style={{ width: "2px", flex: 1, background: "#E5E7EB", margin: "4px 0" }} />}
                        </div>
                        <div style={{ paddingBottom: idx < 4 ? "24px" : "0" }}>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: DARK, marginBottom: "5px" }}>{s.title}</div>
                          <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, marginBottom: "5px" }}>{s.desc}</div>
                          <div style={{ fontSize: "10px", color: "#5A6A7A", fontStyle: "italic" as const }}>{s.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 20px" }}>
                    What the Test Evaluates
                  </h3>
                  <div style={{ background: "#F8F9FA", borderRadius: "12px", padding: "20px 22px", marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "12px" }}>TTR Gene Analysis</div>
                    <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.7, margin: "0 0 14px" }}>
                      The test evaluates the <strong>TTR (transthyretin) gene</strong> for all known pathogenic variants associated with hereditary ATTR amyloidosis. This includes both sequence variants and copy number variants (deletions/duplications).
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {[
                        { variant: "Val30Met (p.V30M)", type: "Neurological", prevalence: "Most common globally" },
                        { variant: "Val122Ile (p.V122I)", type: "Cardiac", prevalence: "Common in African ancestry" },
                        { variant: "Thr60Ala (p.T60A)", type: "Mixed", prevalence: "Common in Irish descent" },
                        { variant: "Ile68Leu (p.I68L)", type: "Cardiac", prevalence: "Saudi/Middle East variant" },
                        { variant: "Glu89Gln (p.E89Q)", type: "Cardiac", prevalence: "South Asian variant" },
                        { variant: "All other TTR variants", type: "Various", prevalence: "120+ known pathogenic variants" },
                      ].map((v) => (
                        <div key={v.variant} style={{ background: "#fff", borderRadius: "8px", padding: "10px 12px", border: "1px solid #E8ECF0" }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "2px" }}>{v.variant}</div>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <span style={{ fontSize: "9px", fontWeight: 700, padding: "1px 6px", borderRadius: "4px", background: v.type === "Cardiac" ? "#FEE2E2" : v.type === "Neurological" ? "#EEF2FF" : "#E6F7F5", color: v.type === "Cardiac" ? "#EF4444" : v.type === "Neurological" ? "#4F46E5" : DNA_GRN }}>{v.type}</span>
                            <span style={{ fontSize: "9px", color: "#9CA3AF" }}>{v.prevalence}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: "#EEF2FF", borderRadius: "12px", padding: "18px 20px", border: "1px solid #C7D2FE" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#4F46E5", marginBottom: "10px" }}>🔑 Ordering Resources</div>
                    {[
                      { label: "Test Code", value: "15139 (Prevention Genetics)" },
                      { label: "Gene", value: "TTR — full sequencing + del/dup" },
                      { label: "Turnaround Time", value: "~3 weeks from sample receipt" },
                      { label: "Order Portal", value: "preventiongenetics.com" },
                      { label: "Support Line", value: "Contact your Alnylam rep" },
                    ].map((r) => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E0E7FF" }}>
                        <span style={{ fontSize: "11px", color: "#5A6A7A" }}>{r.label}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* GENETIC COUNSELLING TAB */}
            {activeTab === "counselling" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                    Genetic Counselling Services
                  </h3>
                  <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "0 0 16px" }}>
                    Genetic counselling is provided by <strong>Genome Medical</strong>, an independent third-party organisation staffed by board-certified genetic counsellors. Counselling is available both before and after testing, at no charge to the patient.
                  </p>
                  <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "0 0 20px" }}>
                    Genome Medical counsellors are not employees of Alnylam Pharmaceuticals and do not provide medical care, treatment recommendations, or prescriptions. They focus exclusively on helping patients understand their genetic results and implications.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px", marginBottom: "20px" }}>
                    {[
                      { phase: "Pre-Test Counselling", items: ["Explain what the TTR gene test evaluates", "Discuss what a positive or negative result means", "Address patient concerns about privacy and insurance implications", "Obtain informed consent for testing", "Discuss implications for family members"], color: ACCENT },
                      { phase: "Post-Test Counselling", items: ["Explain the specific result in plain language", "Discuss penetrance and variable expressivity of TTR variants", "Guide patient on communicating results to family members", "Explain cascade testing options for at-risk relatives", "Connect patient to support resources and disease communities"], color: DNA_GRN },
                    ].map((p) => (
                      <div key={p.phase} style={{ borderRadius: "10px", border: `1px solid ${p.color}30`, overflow: "hidden" }}>
                        <div style={{ background: `${p.color}12`, padding: "10px 14px", borderBottom: `1px solid ${p.color}20` }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: p.color, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{p.phase}</div>
                        </div>
                        <div style={{ padding: "12px 14px" }}>
                          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                            {p.items.map((item) => (
                              <li key={item} style={{ display: "flex", gap: "6px", marginBottom: "5px", alignItems: "flex-start" }}>
                                <span style={{ color: p.color, fontSize: "12px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                                <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                    Understanding Results
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px", marginBottom: "24px" }}>
                    {[
                      {
                        result: "Pathogenic / Likely Pathogenic Variant Detected",
                        color: "#EF4444",
                        bg: "#FEF2F2",
                        border: "#FECACA",
                        implications: [
                          "Patient carries a TTR variant associated with hATTR amyloidosis",
                          "Does not mean the patient will definitely develop symptoms (variable penetrance)",
                          "Enables proactive monitoring and early treatment consideration",
                          "First-degree relatives have ~50% chance of carrying the same variant",
                          "Cascade testing strongly recommended for all first-degree relatives",
                        ],
                      },
                      {
                        result: "No Pathogenic Variant Detected (Negative)",
                        color: DNA_GRN,
                        bg: "#F0FDF4",
                        border: "#BBF7D0",
                        implications: [
                          "No known pathogenic TTR variant identified in this individual",
                          "Does not completely rule out wild-type ATTR-CM (wtATTR-CM)",
                          "If strong clinical suspicion remains, consider further evaluation",
                          "First-degree relatives of this individual do not need cascade testing for hATTR",
                          "Patient should be informed that wtATTR-CM can still occur without a TTR mutation",
                        ],
                      },
                      {
                        result: "Variant of Uncertain Significance (VUS)",
                        color: "#F59E0B",
                        bg: "#FFFBEB",
                        border: "#FDE68A",
                        implications: [
                          "A TTR variant was found, but its clinical significance is currently unknown",
                          "Genetic counselling strongly recommended to discuss implications",
                          "Variant reclassification may occur as more data becomes available",
                          "Clinical correlation with symptoms and family history is essential",
                          "Periodic re-evaluation of the variant's classification is recommended",
                        ],
                      },
                    ].map((r) => (
                      <div key={r.result} style={{ borderRadius: "10px", background: r.bg, border: `1px solid ${r.border}`, padding: "14px 16px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: r.color, marginBottom: "8px" }}>{r.result}</div>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                          {r.implications.map((imp) => (
                            <li key={imp} style={{ display: "flex", gap: "6px", marginBottom: "4px", alignItems: "flex-start" }}>
                              <span style={{ color: r.color, fontSize: "11px", marginTop: "1px", flexShrink: 0 }}>▸</span>
                              <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CASCADE SCREENING TAB */}
            {activeTab === "cascade" && (
              <div>
                <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "14px 18px", border: "1px solid #14b8a6", marginBottom: "24px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#0d9488", marginBottom: "4px" }}>🧬 Why Cascade Screening is Critical</div>
                  <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>
                    hATTR amyloidosis is an <strong>autosomal dominant</strong> condition. When a pathogenic TTR variant is identified in a patient, each of their first-degree relatives (parents, siblings, children) has a <strong>50% probability</strong> of carrying the same variant. Cascade screening identifies at-risk family members before they develop symptoms, enabling earlier intervention with AMVUTTRA.
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                      Cascade Screening Framework
                    </h3>

                    {/* Family tree visual */}
                    <div style={{ background: "#F8F9FA", borderRadius: "12px", padding: "20px", marginBottom: "20px", textAlign: "center" as const }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "16px" }}>Inheritance Pattern</div>
                      {/* Index patient */}
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                        <div style={{ background: "#EF4444", color: "#fff", borderRadius: "8px", padding: "8px 16px", fontSize: "11px", fontWeight: 700 }}>
                          Index Patient<br /><span style={{ fontWeight: 400, fontSize: "10px" }}>Confirmed hATTR variant</span>
                        </div>
                      </div>
                      {/* Connector */}
                      <div style={{ width: "2px", height: "20px", background: "#D1D5DB", margin: "0 auto" }} />
                      {/* 50% line */}
                      <div style={{ background: "#FEF2F2", border: "1px dashed #EF4444", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", color: "#EF4444", fontWeight: 700, display: "inline-block", marginBottom: "8px" }}>
                        50% inheritance probability per first-degree relative
                      </div>
                      <div style={{ width: "2px", height: "20px", background: "#D1D5DB", margin: "0 auto" }} />
                      {/* Family members */}
                      <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" as const }}>
                        {["Parents", "Siblings", "Children"].map((rel) => (
                          <div key={rel} style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: "8px", padding: "8px 14px", fontSize: "11px", fontWeight: 700, color: "#4F46E5" }}>
                            {rel}<br /><span style={{ fontWeight: 400, fontSize: "10px", color: "#5A6A7A" }}>Eligible for free testing</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
                      {[
                        { step: "1", title: "Confirm Index Case", desc: "Pathogenic TTR variant confirmed in the patient via Alnylam Act® or other genetic testing" },
                        { step: "2", title: "Counsel Index Patient", desc: "Post-test counselling discusses implications for family members and how to communicate results" },
                        { step: "3", title: "Identify At-Risk Relatives", desc: "Patient identifies first-degree relatives (parents, siblings, adult children) who may be at risk" },
                        { step: "4", title: "Refer Relatives for Testing", desc: "Relatives are referred to their own HCP or directly to Alnylam Act® — they qualify under Track A (family history)" },
                        { step: "5", title: "Ongoing Monitoring", desc: "Variant-positive relatives enter surveillance programmes; variant-negative relatives are reassured" },
                      ].map((s) => (
                        <div key={s.step} style={{ display: "flex", gap: "10px", padding: "10px 12px", background: "#F8F9FA", borderRadius: "8px", alignItems: "flex-start" }}>
                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: DNA_GRN, color: "#fff", fontSize: "11px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "2px" }}>{s.title}</div>
                            <div style={{ fontSize: "10px", color: "#5A6A7A", lineHeight: 1.4 }}>{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                      Clinical Value of Early Detection
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px", marginBottom: "24px" }}>
                      {[
                        { icon: "⏰", title: "Median Diagnostic Delay: 3–4 Years", desc: "Most hATTR patients experience a 3–4 year delay from first symptoms to diagnosis. Cascade screening in at-risk relatives can eliminate this delay entirely.", color: "#EF4444" },
                        { icon: "🫀", title: "Irreversible Organ Damage", desc: "By the time hATTR-CM is diagnosed, significant myocardial amyloid deposition has often already occurred. Earlier detection means earlier treatment and better outcomes.", color: "#F59E0B" },
                        { icon: "💊", title: "AMVUTTRA Efficacy is Stage-Dependent", desc: "HELIOS-B data showed greatest benefit in earlier-stage patients. Identifying family members before symptom onset maximises the therapeutic window for AMVUTTRA.", color: ACCENT },
                        { icon: "🧬", title: "Variable Penetrance", desc: "Not all TTR variant carriers develop disease. Genetic counselling helps variant-positive relatives understand their individual risk and the importance of regular monitoring.", color: "#8B5CF6" },
                        { icon: "👨‍👩‍👧", title: "Each Positive Cascade = Multiple New Patients", desc: "A single confirmed hATTR case may lead to testing of 3–10 family members, with ~50% expected to be variant-positive. This is a significant patient identification opportunity.", color: DNA_GRN },
                      ].map((v) => (
                        <div key={v.title} style={{ display: "flex", gap: "12px", padding: "12px 14px", background: "#F8F9FA", borderRadius: "10px", alignItems: "flex-start" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${v.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{v.icon}</div>
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "3px" }}>{v.title}</div>
                            <div style={{ fontSize: "11px", color: "#5A6A7A", lineHeight: 1.4 }}>{v.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "#FFF8E1", borderRadius: "10px", padding: "16px 18px", border: "1px solid #F59E0B" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#B45309", marginBottom: "8px" }}>⚠️ Privacy Note for Family Members</div>
                      <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
                        Family members who enrol in Alnylam Act® are treated as independent patients. Their results are sent only to their own ordering provider. The index patient's results are never shared with family members, and vice versa, without explicit consent.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HCP TALKING POINTS TAB */}
            {activeTab === "hcp-talking" && (
              <div>
                <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "14px 18px", border: "1px solid #14b8a6", marginBottom: "24px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#0d9488", marginBottom: "4px" }}>💡 How to Use This Section</div>
                  <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>
                    Use these talking points to introduce Alnylam Act® proactively during HCP calls — particularly with cardiologists, neurologists, and internists who manage ATTR patients. Cascade screening is a powerful differentiator that creates new patient identification opportunities.
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {[
                    {
                      scenario: "Introducing Alnylam Act® to a new HCP",
                      color: DNA_GRN,
                      icon: "🧬",
                      objection: "\"I wasn't aware there was a free genetic testing programme.\"",
                      response: "\"Yes — Alnylam Act® provides no-charge TTR gene testing and genetic counselling for patients with suspected hATTR amyloidosis and their at-risk family members. There's no cost to your patient, your practice, or their insurance. Testing is performed by Prevention Genetics, a CLIA/CAP-certified lab, and counselling is provided by Genome Medical — both independent of Alnylam. You simply order online using Test Code 15139, and results come back in about 3 weeks.\"",
                    },
                    {
                      scenario: "HCP asks about cascade testing for family members",
                      color: "#8B5CF6",
                      icon: "👨‍👩‍👧",
                      objection: "\"My patient was just diagnosed with hATTR. Should I be testing their family?\"",
                      response: "\"Absolutely — and Alnylam Act® makes it straightforward. hATTR is autosomal dominant, so each first-degree relative has a 50% chance of carrying the same variant. Family members with a known family history qualify immediately under Track A eligibility — no additional clinical criteria needed. The test is free for them too. Identifying variant-positive relatives before they develop symptoms means you can start AMVUTTRA earlier, when the evidence shows the greatest benefit.\"",
                    },
                    {
                      scenario: "HCP concerned about patient privacy",
                      color: "#3B82F6",
                      icon: "🔒",
                      objection: "\"Will Alnylam have access to my patient's genetic data?\"",
                      response: "\"That's an important question. Testing and counselling are performed entirely by independent third parties — Prevention Genetics and Genome Medical — not by Alnylam. Only de-identified data may be shared with Alnylam; your patient's identifiable information is never disclosed to the sponsor. The programme is structured this way specifically to protect patient privacy and maintain the independence of the testing and counselling services.\"",
                    },
                    {
                      scenario: "HCP asks about the clinical value of early detection",
                      color: ACCENT,
                      icon: "⏰",
                      objection: "\"Why does it matter if we identify carriers before they have symptoms?\"",
                      response: "\"The diagnostic delay for hATTR averages 3–4 years from first symptoms. By the time most patients are diagnosed with ATTR-CM, significant irreversible myocardial amyloid deposition has already occurred. HELIOS-B data showed the greatest benefit from AMVUTTRA in earlier-stage patients. Identifying variant-positive family members before symptom onset gives you the opportunity to monitor them proactively and initiate treatment at the optimal time — before the disease progresses.\"",
                    },
                    {
                      scenario: "HCP asks about the ordering process",
                      color: "#F59E0B",
                      icon: "📋",
                      objection: "\"How complicated is it to order the test?\"",
                      response: "\"It's very straightforward. You order online at preventiongenetics.com using Test Code 15139 — no prior authorisation required. Prevention Genetics ships a collection kit to your office. You collect a blood sample, saliva, or buccal swab, and ship it back. Results come back in about 3 weeks. I can also connect you with your Alnylam Field Reimbursement Manager who can walk your team through the ordering process and answer any questions.\"",
                    },
                    {
                      scenario: "HCP asks about the Saudi Arabia / Middle East context",
                      color: "#EF4444",
                      icon: "🌍",
                      objection: "\"Is this relevant for my patients in Saudi Arabia?\"",
                      response: "\"The Alnylam Act® programme currently covers the US and Canada. However, the clinical principle is directly applicable — the Ile68Leu (I68L) TTR variant has been reported in Saudi Arabia and the Middle East, and hATTR amyloidosis is likely significantly underdiagnosed in the region. For your patients in Saudi Arabia, I can connect you with the Alnylam regional medical team to discuss available genetic testing pathways and cascade screening options through local or regional genetics centres.\"",
                    },
                  ].map((tp) => (
                    <div key={tp.scenario} style={{ borderRadius: "12px", border: `1px solid ${tp.color}30`, overflow: "hidden" }}>
                      <div style={{ background: `${tp.color}10`, padding: "12px 16px", borderBottom: `1px solid ${tp.color}20`, display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "18px" }}>{tp.icon}</span>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: tp.color, textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>{tp.scenario}</div>
                      </div>
                      <div style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: "11px", fontStyle: "italic" as const, color: "#5A6A7A", marginBottom: "10px", padding: "8px 10px", background: "#F8F9FA", borderRadius: "6px", borderLeft: "3px solid #D1D5DB" }}>
                          {tp.objection}
                        </div>
                        <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
                          {tp.response}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── QUICK REFERENCE FOOTER ─────────────────────────────── */}
        <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { title: "Order a Test", items: ["Visit preventiongenetics.com", "Test Code: 15139 (TTR gene)", "No prior authorisation required", "Results in ~3 weeks"], color: DNA_GRN, icon: "🔬" },
            { title: "Eligibility Quick Check", items: ["Track A: Family history OR positive imaging/biopsy", "Track B: Any 2 of 6 symptom categories", "Age 18+ in US or Canada", "No cost to patient, provider, or payer"], color: ACCENT, icon: "✅" },
            { title: "Cascade Screening", items: ["First-degree relatives of confirmed hATTR patients", "Qualify under Track A (family history)", "~50% probability of carrying same variant", "Contact your Alnylam rep to facilitate"], color: "#8B5CF6", icon: "👨‍👩‍👧" },
          ].map((card) => (
            <div key={card.title} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", padding: "18px 20px", position: "relative" as const, overflow: "hidden" as const }}>
              <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, height: "3px", background: card.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>{card.icon}</span>
                <div style={{ fontSize: "12px", fontWeight: 700, color: DARK }}>{card.title}</div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {card.items.map((item) => (
                  <li key={item} style={{ display: "flex", gap: "6px", marginBottom: "5px", alignItems: "flex-start" }}>
                    <span style={{ color: card.color, fontSize: "11px", marginTop: "1px", flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
