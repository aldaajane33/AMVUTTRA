/* PatientSupportSection.tsx
   Design: Clinical Precision / Swiss Medical Modernism
   Alnylam Assist® Patient Support Programme Guide for AMVUTTRA® (vutrisiran)
   Covers: programme overview, enrolment, benefits pillars, co-pay, PAP, nurse educator, reimbursement, HCP talking points */

import { useState } from "react";

type TabId = "overview" | "enrolment" | "financial" | "education" | "reimbursement" | "hcp-talking";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "overview",       label: "Programme Overview",   icon: "🏥" },
  { id: "enrolment",      label: "Enrolment Process",    icon: "📋" },
  { id: "financial",      label: "Financial Assistance", icon: "💊" },
  { id: "education",      label: "Patient Education",    icon: "📚" },
  { id: "reimbursement",  label: "Reimbursement",        icon: "🔄" },
  { id: "hcp-talking",    label: "HCP Talking Points",   icon: "💬" },
];

const ACCENT = "#00C2A8";
const DARK   = "#060D18";

export default function PatientSupportSection() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <section
      id="patient-support"
      style={{
        background: "#F8F9FA",
        padding: "80px 0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="container">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ width: "48px", height: "3px", background: ACCENT, marginBottom: "16px" }} />
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: DARK, margin: 0 }}>
                  Patient Support Programme Guide
                </h2>
              </div>
              <p style={{ color: "#5A6A7A", fontSize: "1rem", margin: 0 }}>
                Alnylam Assist® — Comprehensive support for patients prescribed AMVUTTRA® (vutrisiran)
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
              <div style={{ background: "#E6F7F5", border: "1px solid #14b8a6", borderRadius: "8px", padding: "8px 16px", textAlign: "center" as const }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#0d9488" }}>Helpline</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: DARK }}>1-833-256-2748</div>
                <div style={{ fontSize: "10px", color: "#5A6A7A" }}>Mon–Fri 8AM–6PM ET</div>
              </div>
              <div style={{ background: "#EEF2FF", border: "1px solid #6366F1", borderRadius: "8px", padding: "8px 16px", textAlign: "center" as const }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#4F46E5" }}>Website</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: DARK }}>AlnylamAssist.com</div>
                <div style={{ fontSize: "10px", color: "#5A6A7A" }}>/amvuttra</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── HERO STAT STRIP ────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { value: "$0", sub: "out-of-pocket for most patients†", color: "#10B981", icon: "💰" },
            { value: "2 days", sub: "Case Manager contacts patient after Start Form", color: ACCENT, icon: "⚡" },
            { value: "3 steps", sub: "Simple enrolment process to access all services", color: "#3B82F6", icon: "📋" },
            { value: "24/7", sub: "Online resources at AlnylamAssist.com", color: "#8B5CF6", icon: "🌐" },
          ].map((s) => (
            <div key={s.value} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", padding: "20px", position: "relative" as const, overflow: "hidden" as const }}>
              <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, height: "3px", background: s.color }} />
              <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: s.color, fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1, marginBottom: "4px" }}>{s.value}</div>
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
                  color: activeTab === tab.id ? ACCENT : "#9CA3AF",
                  borderBottom: activeTab === tab.id ? `2px solid ${ACCENT}` : "2px solid transparent",
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
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" }}>
                  {/* What is Alnylam Assist */}
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                      What is Alnylam Assist®?
                    </h3>
                    <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "0 0 16px" }}>
                      Alnylam Assist® is Alnylam's comprehensive patient support programme, providing personalised services to help patients access and stay on AMVUTTRA® (vutrisiran) throughout their treatment journey. The programme is available at no cost to all patients prescribed AMVUTTRA.
                    </p>
                    <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "0 0 20px" }}>
                      The programme is staffed by a dedicated team including Case Managers, Patient Education Liaisons (PELs), and Field Reimbursement Directors — each specialised to address different aspects of the patient journey from diagnosis through ongoing treatment.
                    </p>
                    <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "16px 18px", borderLeft: "4px solid #14b8a6" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#0d9488", marginBottom: "6px" }}>Key Programme Principle</div>
                      <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>
                        Most patients treated with AMVUTTRA pay <strong>$0 out-of-pocket</strong> through the Alnylam Assist® Copay Program or Patient Assistance Program.
                      </div>
                    </div>
                  </div>

                  {/* Support pillars */}
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                      Four Pillars of Support
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
                      {[
                        { icon: "👤", title: "Case Management", desc: "Dedicated one-on-one Case Manager assigned to each patient. Handles benefit verification, financial assistance enrolment, and continuity of care.", color: ACCENT },
                        { icon: "💰", title: "Financial Assistance", desc: "Copay Program for commercially insured patients. Patient Assistance Program (PAP) for uninsured or underinsured patients. Bridge programmes for coverage gaps.", color: "#10B981" },
                        { icon: "📚", title: "Patient Education", desc: "Patient Education Liaisons (PELs) with nursing backgrounds provide disease and treatment education, answer questions, and connect patients to resources.", color: "#3B82F6" },
                        { icon: "🔄", title: "Reimbursement Support", desc: "Field Reimbursement Team assists HCPs with billing, coding, prior authorisation, appeals, and payer coverage education.", color: "#8B5CF6" },
                      ].map((p) => (
                        <div key={p.title} style={{ display: "flex", gap: "12px", padding: "12px 14px", background: "#F8F9FA", borderRadius: "10px", alignItems: "flex-start" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{p.icon}</div>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "3px" }}>{p.title}</div>
                            <div style={{ fontSize: "11px", color: "#5A6A7A", lineHeight: 1.5 }}>{p.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Who qualifies */}
                <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "12px", padding: "24px" }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", color: DARK, margin: "0 0 16px" }}>
                    Who Qualifies for Alnylam Assist®?
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    {[
                      { title: "Commercially Insured", items: ["Eligible for Copay Program", "Case Manager verifies benefits", "Financial assistance assessment", "Ongoing treatment support"], color: "#10B981" },
                      { title: "Government Insured (Medicare/Medicaid)", items: ["Case Manager reviews options", "PAP eligibility assessment", "Bridge programme if coverage gap", "Reimbursement navigation support"], color: "#3B82F6" },
                      { title: "Uninsured / Underinsured", items: ["Patient Assistance Program (PAP)", "AMVUTTRA may be provided at no cost", "Eligibility criteria apply", "Case Manager guides through process"], color: "#F59E0B" },
                    ].map((g) => (
                      <div key={g.title} style={{ borderRadius: "10px", border: `1px solid ${g.color}30`, overflow: "hidden" }}>
                        <div style={{ background: `${g.color}12`, padding: "10px 14px", borderBottom: `1px solid ${g.color}20` }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: g.color, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{g.title}</div>
                        </div>
                        <div style={{ padding: "12px 14px" }}>
                          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                            {g.items.map((item) => (
                              <li key={item} style={{ display: "flex", gap: "6px", marginBottom: "6px", alignItems: "flex-start" }}>
                                <span style={{ color: g.color, fontSize: "12px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                                <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ENROLMENT TAB */}
            {activeTab === "enrolment" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                  {/* 3-step process */}
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 20px" }}>
                      3-Step Enrolment Process
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "0" }}>
                      {[
                        {
                          step: 1,
                          title: "Complete the Start Form with Your Doctor",
                          desc: "The physician and patient complete the Alnylam Assist® Start Form together. The form captures patient demographics, insurance information, diagnosis, and consent for support services.",
                          detail: "Available at AlnylamAssist.com/hcp/amvuttra/resources or via your Alnylam sales representative.",
                          color: ACCENT,
                        },
                        {
                          step: 2,
                          title: "Doctor Submits the Start Form",
                          desc: "The prescribing physician submits the completed Start Form to Alnylam Assist® via fax, online portal, or through the Alnylam sales representative.",
                          detail: "Fax: Available on the Start Form. Online submission preferred for fastest processing.",
                          color: "#3B82F6",
                        },
                        {
                          step: 3,
                          title: "Alnylam Case Manager Contacts Patient",
                          desc: "Within 2 business days of receiving the Start Form, a dedicated Alnylam Case Manager contacts both the patient and the physician's office to share a Summary of Benefits and initiate all applicable support services.",
                          detail: "The Case Manager remains the patient's single point of contact throughout the treatment journey.",
                          color: "#10B981",
                        },
                      ].map((s, idx) => (
                        <div key={s.step} style={{ display: "flex", gap: "0" }}>
                          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", marginRight: "16px" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: s.color, color: "#fff", fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                            {idx < 2 && <div style={{ width: "2px", flex: 1, background: "#E5E7EB", margin: "4px 0" }} />}
                          </div>
                          <div style={{ paddingBottom: idx < 2 ? "24px" : "0" }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: DARK, marginBottom: "6px" }}>{s.title}</div>
                            <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, marginBottom: "6px" }}>{s.desc}</div>
                            <div style={{ fontSize: "11px", color: "#5A6A7A", fontStyle: "italic" as const }}>{s.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What happens after enrolment */}
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 20px" }}>
                      What Happens After Enrolment?
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px", marginBottom: "24px" }}>
                      {[
                        { time: "Within 2 business days", action: "Case Manager contacts patient and physician with Summary of Benefits", icon: "📞" },
                        { time: "Week 1", action: "Financial assistance eligibility assessed and enrolment initiated if appropriate", icon: "💰" },
                        { time: "Before first dose", action: "Benefit verification complete; prior authorisation support if needed; treatment site confirmed", icon: "✅" },
                        { time: "Ongoing", action: "Patient outreach before and after each quarterly treatment; continuity of care through coverage changes or travel", icon: "🔄" },
                        { time: "Any time", action: "Patient can call 1-833-256-2748 to speak with their Case Manager or request a Patient Education Liaison", icon: "📱" },
                      ].map((item) => (
                        <div key={item.time} style={{ display: "flex", gap: "12px", padding: "12px 14px", background: "#F8F9FA", borderRadius: "10px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                          <div>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: ACCENT, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "3px" }}>{item.time}</div>
                            <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.5 }}>{item.action}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Start Form info box */}
                    <div style={{ background: "#EEF2FF", borderRadius: "12px", padding: "18px 20px", border: "1px solid #C7D2FE" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#4F46E5", marginBottom: "8px" }}>📋 Start Form — Key Information</div>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {[
                          "Available from your Alnylam sales representative or at AlnylamAssist.com",
                          "One form covers all Alnylam Assist® services — no separate forms needed",
                          "Patient signature required for consent to support services",
                          "Physician signature required for prescribing information",
                          "Can be submitted via fax or online portal",
                          "New patients only — separate form required for each new Alnylam product",
                        ].map((item) => (
                          <li key={item} style={{ display: "flex", gap: "6px", marginBottom: "5px", alignItems: "flex-start" }}>
                            <span style={{ color: "#4F46E5", fontSize: "12px", marginTop: "1px", flexShrink: 0 }}>▸</span>
                            <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FINANCIAL ASSISTANCE TAB */}
            {activeTab === "financial" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "28px" }}>
                  {/* Copay Program */}
                  <div style={{ borderRadius: "12px", border: "2px solid #10B981", overflow: "hidden" }}>
                    <div style={{ background: "#10B981", padding: "16px 18px" }}>
                      <div style={{ fontSize: "20px", marginBottom: "4px" }}>💊</div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff", marginBottom: "2px" }}>Copay Program</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)" }}>For commercially insured patients</div>
                    </div>
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10B981", fontFamily: "'DM Serif Display', Georgia, serif", marginBottom: "4px" }}>$0 goal</div>
                      <div style={{ fontSize: "11px", color: "#5A6A7A", marginBottom: "14px" }}>Most patients pay $0 out-of-pocket†</div>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {[
                          "Covers eligible out-of-pocket costs for commercially insured patients",
                          "Case Manager proactively assesses eligibility and enrols patient",
                          "Patient can also self-enrol at alnylamassistcopay.com",
                          "Covers AMVUTTRA product cost and applicable administration costs",
                          "Reimbursement form submitted with claim documentation",
                        ].map((item) => (
                          <li key={item} style={{ display: "flex", gap: "6px", marginBottom: "6px", alignItems: "flex-start" }}>
                            <span style={{ color: "#10B981", fontSize: "12px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                            <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* PAP */}
                  <div style={{ borderRadius: "12px", border: "2px solid #3B82F6", overflow: "hidden" }}>
                    <div style={{ background: "#3B82F6", padding: "16px 18px" }}>
                      <div style={{ fontSize: "20px", marginBottom: "4px" }}>🤝</div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff", marginBottom: "2px" }}>Patient Assistance Program</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)" }}>For uninsured / underinsured patients</div>
                    </div>
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#3B82F6", fontFamily: "'DM Serif Display', Georgia, serif", marginBottom: "4px" }}>No cost</div>
                      <div style={{ fontSize: "11px", color: "#5A6A7A", marginBottom: "14px" }}>AMVUTTRA provided at no cost to eligible patients*</div>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {[
                          "Primarily for uninsured patients who meet eligibility criteria",
                          "AMVUTTRA may be provided at no cost",
                          "Case Manager determines eligibility after Start Form submission",
                          "Eligibility criteria apply — income and insurance status reviewed",
                          "Alnylam reserves the right to modify or discontinue the programme",
                        ].map((item) => (
                          <li key={item} style={{ display: "flex", gap: "6px", marginBottom: "6px", alignItems: "flex-start" }}>
                            <span style={{ color: "#3B82F6", fontSize: "12px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                            <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bridge Programme */}
                  <div style={{ borderRadius: "12px", border: "2px solid #F59E0B", overflow: "hidden" }}>
                    <div style={{ background: "#F59E0B", padding: "16px 18px" }}>
                      <div style={{ fontSize: "20px", marginBottom: "4px" }}>🌉</div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff", marginBottom: "2px" }}>Bridge Programme</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)" }}>For coverage delays or gaps</div>
                    </div>
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F59E0B", fontFamily: "'DM Serif Display', Georgia, serif", marginBottom: "4px" }}>Gap cover</div>
                      <div style={{ fontSize: "11px", color: "#5A6A7A", marginBottom: "14px" }}>Ensures treatment continuity during coverage transitions</div>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {[
                          "Available when patient experiences a delay or gap in insurance coverage",
                          "Prevents treatment interruption during payer transitions",
                          "Case Manager proactively identifies coverage gaps",
                          "Supports continuity through job changes, plan changes, or appeals",
                          "Eligibility criteria apply",
                        ].map((item) => (
                          <li key={item} style={{ display: "flex", gap: "6px", marginBottom: "6px", alignItems: "flex-start" }}>
                            <span style={{ color: "#F59E0B", fontSize: "12px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                            <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footnotes */}
                <div style={{ background: "#F8F9FA", borderRadius: "10px", padding: "16px 18px", fontSize: "10px", color: "#9CA3AF", lineHeight: 1.6 }}>
                  <strong style={{ color: "#5A6A7A" }}>Important Notes:</strong>
                  <br />† Most patients treated with AMVUTTRA pay $0 out-of-pocket. Individual results may vary based on insurance coverage and eligibility criteria.
                  <br />* Patients must meet specified eligibility criteria to qualify for the Patient Assistance Program. Alnylam reserves the right to make determinations and to modify or discontinue any programme at any time.
                  <br />‡ The Copay Program is only available for new AMVUTTRA® (vutrisiran) patients in the US. Not valid for patients whose prescription is paid in whole or in part by any state or federally funded programme.
                </div>
              </div>
            )}

            {/* PATIENT EDUCATION TAB */}
            {activeTab === "education" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                  {/* PEL section */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>👩‍⚕️</div>
                      <div>
                        <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.2rem", color: DARK, margin: 0 }}>Patient Education Liaisons (PELs)</h3>
                        <div style={{ fontSize: "11px", color: "#5A6A7A" }}>Alnylam employees with nursing backgrounds</div>
                      </div>
                    </div>

                    <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.7, margin: "0 0 16px" }}>
                      PELs are Alnylam employees with nursing backgrounds who provide personalised education to patients and their families throughout the treatment journey. They are not acting as healthcare providers and do not provide medical care or advice.
                    </p>

                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "10px" }}>Services Provided by PELs</div>
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
                        {[
                          { icon: "🧬", text: "Pre- and post-treatment disease education (ATTR-CM and hATTR-PN)" },
                          { icon: "💉", text: "Answering questions about AMVUTTRA treatment and administration" },
                          { icon: "👨‍👩‍👧", text: "Hosting individual, family, or group educational meetings" },
                          { icon: "🔗", text: "Connecting patients to community resources and support organisations" },
                          { icon: "📋", text: "Vitamin A supplementation guidance and monitoring education" },
                          { icon: "❓", text: "Addressing patient concerns about side effects and what to expect" },
                        ].map((item) => (
                          <div key={item.text} style={{ display: "flex", gap: "10px", padding: "10px 12px", background: "#F8F9FA", borderRadius: "8px", alignItems: "center" }}>
                            <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                            <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.4 }}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "16px 18px", border: "1px solid #14b8a6" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#0d9488", marginBottom: "10px" }}>3 Ways to Connect with a PEL</div>
                      {[
                        { method: "Submit PEL Consent Form", detail: "Available at amvuttra.com/patient-educator", icon: "📝" },
                        { method: "Via Case Manager", detail: "After Start Form submission, Case Manager can connect patient with a PEL", icon: "👤" },
                        { method: "Call Alnylam Assist", detail: "1-833-256-2748 — request a PEL directly", icon: "📞" },
                      ].map((c) => (
                        <div key={c.method} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "16px", flexShrink: 0 }}>{c.icon}</span>
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: DARK }}>{c.method}</div>
                            <div style={{ fontSize: "10px", color: "#5A6A7A" }}>{c.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case Manager + Resources */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#E6F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🗂️</div>
                      <div>
                        <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.2rem", color: DARK, margin: 0 }}>Case Manager Support</h3>
                        <div style={{ fontSize: "11px", color: "#5A6A7A" }}>One-on-one dedicated support throughout treatment</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px", marginBottom: "24px" }}>
                      {[
                        { title: "Benefits Verification", desc: "Verifies insurance coverage and provides a Summary of Benefits specific to the patient" },
                        { title: "Financial Assistance Enrolment", desc: "Assesses eligibility for Copay Program, PAP, or Bridge Programme and handles enrolment" },
                        { title: "Continuity of Care", desc: "Supports patients through coverage changes, travel plans, and treatment site changes" },
                        { title: "Treatment Outreach", desc: "Contacts patient before and after each quarterly AMVUTTRA dose" },
                        { title: "Team Coordination", desc: "Coordinates with PELs and Field Reimbursement Team to ensure comprehensive support" },
                      ].map((item) => (
                        <div key={item.title} style={{ padding: "12px 14px", background: "#F8F9FA", borderRadius: "8px", borderLeft: `3px solid ${ACCENT}` }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: DARK, marginBottom: "3px" }}>{item.title}</div>
                          <div style={{ fontSize: "11px", color: "#5A6A7A", lineHeight: 1.4 }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "#FFF8E1", borderRadius: "10px", padding: "16px 18px", border: "1px solid #F59E0B" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#B45309", marginBottom: "10px" }}>📚 Patient Resources Available</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                        {[
                          "Alnylam Assist® Patient Brochure",
                          "AMVUTTRA Treatment Guide",
                          "Vitamin A Supplement Information",
                          "ATTR Disease Education Materials",
                          "Community Support Connections",
                          "Treatment Journey Tracker",
                        ].map((r) => (
                          <div key={r} style={{ display: "flex", gap: "5px", alignItems: "flex-start" }}>
                            <span style={{ color: "#F59E0B", fontSize: "11px", marginTop: "1px", flexShrink: 0 }}>▸</span>
                            <span style={{ fontSize: "10px", color: "#374151", lineHeight: 1.4 }}>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REIMBURSEMENT TAB */}
            {activeTab === "reimbursement" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "28px" }}>
                  {/* Field Reimbursement Team */}
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                      Field Reimbursement Team
                    </h3>
                    <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.7, margin: "0 0 16px" }}>
                      Field Reimbursement Directors (FRDs) and Field Reimbursement Managers (FRMs) are dedicated points of contact for HCPs on all insurance coverage, coding, and reimbursement questions. They are activated after a Start Form is submitted or can be connected through an Alnylam sales representative.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
                      {[
                        { icon: "📊", title: "Billing & Coding Education", desc: "Product billing and coding education specific to AMVUTTRA (vutrisiran)" },
                        { icon: "🏥", title: "Payer Coverage Education", desc: "Education on payer-specific coverage requirements and formulary status" },
                        { icon: "📝", title: "Prior Authorisation Support", desc: "Assistance with prior authorisation submissions and appeals processes" },
                        { icon: "🏢", title: "Treatment Site Identification", desc: "Support identifying appropriate treatment sites for AMVUTTRA administration" },
                      ].map((item) => (
                        <div key={item.title} style={{ display: "flex", gap: "12px", padding: "12px 14px", background: "#F8F9FA", borderRadius: "10px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "3px" }}>{item.title}</div>
                            <div style={{ fontSize: "11px", color: "#5A6A7A", lineHeight: 1.4 }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reimbursement pathway */}
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.3rem", color: DARK, margin: "0 0 16px" }}>
                      Reimbursement Pathway
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "0" }}>
                      {[
                        { step: 1, title: "Start Form Submitted", desc: "Field Reimbursement Team is automatically notified upon Start Form receipt", color: ACCENT },
                        { step: 2, title: "Benefits Verification", desc: "Alnylam Assist® verifies patient insurance benefits and identifies coverage for AMVUTTRA", color: "#3B82F6" },
                        { step: 3, title: "Prior Authorisation", desc: "If required by payer, FRD/FRM provides PA support documentation and submission assistance", color: "#8B5CF6" },
                        { step: 4, title: "Treatment Initiation", desc: "Treatment site confirmed; product ordered through specialty pharmacy or hospital pharmacy", color: "#F59E0B" },
                        { step: 5, title: "Claims & Reimbursement", desc: "Ongoing support for claims submission, coding questions, and appeals if coverage is denied", color: "#10B981" },
                      ].map((s, idx) => (
                        <div key={s.step} style={{ display: "flex", gap: "0" }}>
                          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", marginRight: "14px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: s.color, color: "#fff", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                            {idx < 4 && <div style={{ width: "2px", flex: 1, background: "#E5E7EB", margin: "4px 0" }} />}
                          </div>
                          <div style={{ paddingBottom: idx < 4 ? "16px" : "0" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: DARK, marginBottom: "3px" }}>{s.title}</div>
                            <div style={{ fontSize: "11px", color: "#5A6A7A", lineHeight: 1.4 }}>{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "14px 16px", marginTop: "20px", border: "1px solid #14b8a6" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#0d9488", marginBottom: "6px" }}>🔑 Key Coding Information</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {[
                          { label: "HCPCS Code", value: "J0222 (vutrisiran)" },
                          { label: "ICD-10 (ATTR-CM)", value: "E85.82 / E85.89" },
                          { label: "ICD-10 (hATTR-PN)", value: "E85.1" },
                          { label: "Administration", value: "Subcutaneous injection" },
                        ].map((c) => (
                          <div key={c.label} style={{ background: "#fff", borderRadius: "6px", padding: "8px 10px" }}>
                            <div style={{ fontSize: "9px", fontWeight: 700, color: "#5A6A7A", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "2px" }}>{c.label}</div>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: DARK }}>{c.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HCP TALKING POINTS TAB */}
            {activeTab === "hcp-talking" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ background: "#E6F7F5", borderRadius: "10px", padding: "14px 18px", border: "1px solid #14b8a6", marginBottom: "24px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#0d9488", marginBottom: "4px" }}>💡 How to Use This Section</div>
                    <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>
                      These talking points are designed to help you address common HCP concerns about patient access, cost, and support when discussing AMVUTTRA. Use them to proactively introduce Alnylam Assist® during calls and remove access barriers.
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {[
                    {
                      scenario: "HCP concerned about patient cost / affordability",
                      color: "#10B981",
                      icon: "💰",
                      objection: "\"I'm worried my patient won't be able to afford AMVUTTRA.\"",
                      response: "\"That's a very valid concern, and it's exactly why Alnylam Assist® exists. Most patients treated with AMVUTTRA pay $0 out-of-pocket. For commercially insured patients, the Copay Program covers eligible out-of-pocket costs. For uninsured patients, the Patient Assistance Program may provide AMVUTTRA at no cost. Once you submit the Start Form, a Case Manager will contact your patient within 2 business days to assess eligibility and handle enrolment — you don't need to manage this yourself.\"",
                    },
                    {
                      scenario: "HCP concerned about administrative burden",
                      color: "#3B82F6",
                      icon: "📋",
                      objection: "\"I don't have time to manage all the paperwork for a rare disease drug.\"",
                      response: "\"I completely understand — that's why the process is designed to be as simple as possible for your team. There's one Start Form that activates all Alnylam Assist® services. Once submitted, a dedicated Case Manager handles benefit verification, financial assistance enrolment, prior authorisation support, and patient outreach. Your Field Reimbursement Manager is also available to assist your billing team with coding and claims. Your office's role ends at submitting the Start Form.\"",
                    },
                    {
                      scenario: "HCP asks about prior authorisation",
                      color: "#8B5CF6",
                      icon: "📝",
                      objection: "\"Prior authorisation for a drug like this will take too long.\"",
                      response: "\"Our Field Reimbursement Team has extensive experience navigating PA requirements for AMVUTTRA. They'll work directly with your office to prepare the PA submission, provide supporting clinical documentation, and follow up with the payer. If the initial PA is denied, they'll support the appeals process. In the meantime, if there's a coverage gap, the Bridge Programme can ensure your patient doesn't miss a dose while the PA is being processed.\"",
                    },
                    {
                      scenario: "HCP asks how to get started",
                      color: ACCENT,
                      icon: "🚀",
                      objection: "\"This sounds good, but how do we actually get started?\"",
                      response: "\"It's a simple 3-step process. First, you and your patient complete the Alnylam Assist® Start Form together — I can provide you with copies today, or it's available at AlnylamAssist.com. Second, your office submits the form. Third, a Case Manager contacts your patient within 2 business days. That's it. I can also connect you directly with your Field Reimbursement Manager who can walk your billing team through the coding and claims process before you even write the first prescription.\"",
                    },
                    {
                      scenario: "HCP asks about patient education support",
                      color: "#F59E0B",
                      icon: "📚",
                      objection: "\"My patients are going to have a lot of questions about this disease and treatment.\"",
                      response: "\"Alnylam Assist® includes Patient Education Liaisons — nurses employed by Alnylam who provide one-on-one education to patients and their families. They can explain the disease, answer treatment questions, discuss what to expect, and connect patients to community support resources. They can meet with patients individually, with family members, or in group settings. Your patient can request a PEL through their Case Manager, or call 1-833-256-2748 directly.\"",
                    },
                    {
                      scenario: "HCP asks about continuity during coverage changes",
                      color: "#EF4444",
                      icon: "🔄",
                      objection: "\"What happens if my patient changes jobs or loses insurance?\"",
                      response: "\"This is one of the most important aspects of Alnylam Assist®. The Case Manager proactively monitors for coverage changes and contacts the patient before each quarterly dose to ensure continued access. If there's a gap in coverage, the Bridge Programme can provide AMVUTTRA during the transition period. The goal is zero treatment interruptions — AMVUTTRA is dosed every 3 months, so maintaining that schedule is critical for sustained TTR suppression.\"",
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
            { title: "Enrol a Patient", items: ["Submit Start Form to Alnylam Assist®", "Available at AlnylamAssist.com or via rep", "Case Manager contacts patient in 2 days"], color: ACCENT, icon: "📋" },
            { title: "Patient Contacts Alnylam Assist®", items: ["Call: 1-833-256-2748", "Mon–Fri, 8AM–6PM ET", "Website: AlnylamAssist.com/amvuttra"], color: "#3B82F6", icon: "📞" },
            { title: "HCP Reimbursement Support", items: ["Contact your Alnylam sales representative", "Field Reimbursement Team available post-Start Form", "Coding: J0222 | ICD-10: E85.82 / E85.1"], color: "#8B5CF6", icon: "🔄" },
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
