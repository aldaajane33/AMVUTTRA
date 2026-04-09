/* Home.tsx
   Section order (user-specified, v2):
   1-Overview 2-MOA 3-Evidence 4-PatientFlow 5-Dosing 6-Safety
   7-Comparison(Competitive) 8-Territory 9-Accounts
   10-Congress(Evidence) 11-DxAlgorithm 12-ActTesting 13-PSPGuide
   14-CaseSim 15-Objections 16-RolePlay 17-Quiz
   18-Dashboard 19-Knowledge 20-References */

import { useEffect } from "react";
import Navigation from "@/components/Navigation";
// Clinical content
import HeroSection from "@/components/sections/HeroSection";
import MoaSection from "@/components/sections/MoaSection";
import EvidenceSection from "@/components/sections/EvidenceSection";
import PatientFlowSection from "@/components/sections/PatientFlowSection";
import DosingSection from "@/components/sections/DosingSection";
import SafetySection from "@/components/sections/SafetySection";
// Competitive & field intelligence
import CompetitiveSuiteSection from "@/components/sections/CompetitiveSuiteSection";
import TerritoryMapSection from "@/components/sections/TerritoryMapSection";
import AccountProfileSection from "@/components/sections/AccountProfileSection";
import PatientSupportSection from "@/components/sections/PatientSupportSection";
import AlnylamActSection from "@/components/sections/AlnylamActSection";
import DiagnosticAlgorithmSection from "@/components/sections/DiagnosticAlgorithmSection";
import CongressUpdateSection from "@/components/sections/CongressUpdateSection";
// Interactive learning & tools
import CaseSimulatorSection from "@/components/sections/CaseSimulatorSection";
import ObjectionHandlerSection from "@/components/sections/ObjectionHandlerSection";
import PitchBuilderSection from "@/components/sections/PitchBuilderSection";
import KnowledgeQuizSection from "@/components/sections/KnowledgeQuizSection";
import CertificationModeSection from "@/components/sections/CertificationModeSection";
import FlashcardsSection from "@/components/sections/FlashcardsSection";
import ProgressDashboard from "@/components/sections/ProgressDashboard";
// Reference
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import CheatSheetSection from "@/components/sections/CheatSheetSection";
import ReferencesSection from "@/components/sections/ReferencesSection";

export default function Home() {
  // Scroll-reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>
      <Navigation />
      <main id="main-content">
        {/* 1 — Overview */}
        <HeroSection />
        {/* 2 — MOA */}
        <MoaSection />
        {/* 3 — Evidence */}
        <EvidenceSection />
        {/* 4 — Patient Flow */}
        <PatientFlowSection />
        {/* 5 — Dosing */}
        <DosingSection />
        {/* 6 — Safety */}
        <SafetySection />
        {/* 7 — Comparison (Competitive Intelligence Suite) */}
        <CompetitiveSuiteSection />
        {/* 8 — Territory */}
        <TerritoryMapSection />
        {/* 9 — Accounts */}
        <AccountProfileSection />
        {/* 10 — Congress & RWE Evidence */}
        <CongressUpdateSection />
        {/* 11 — Dx Algorithm */}
        <DiagnosticAlgorithmSection />
        {/* 12 — Act® Testing */}
        <AlnylamActSection />
        {/* 13 — Patient Support Programme Guide */}
        <PatientSupportSection />
        {/* 14 — Case Simulator */}
        <CaseSimulatorSection />
        {/* 15 — Objections */}
        <ObjectionHandlerSection />
        {/* 16 — Role-Play */}
        <PitchBuilderSection />
        {/* 17 — Quiz */}
        <KnowledgeQuizSection />
        {/* Certification Mode */}
        <CertificationModeSection />
        {/* Flashcards (bonus) */}
        <FlashcardsSection />
        {/* 18 — Dashboard */}
        <ProgressDashboard />
        {/* 19 — Knowledge */}
        <KnowledgeSection />
        {/* Cheat Sheet */}
        <CheatSheetSection />
        {/* 20 — References */}
        <ReferencesSection />
      </main>
      {/* Footer */}
      <footer
        style={{
          background: "#060D18",
          color: "rgba(255,255,255,0.5)",
          padding: "32px 0",
          textAlign: "center",
          fontSize: "11.5px",
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.7,
        }}
      >
        <div className="container">
          <div
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "1.2rem",
              color: "#00C2A8",
              marginBottom: "8px",
            }}
          >
            AMVUTTRA<span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>® (vutrisiran)</span>
          </div>
          <p style={{ margin: "0 0 8px" }}>
            Mohammed N Alotaibi · NewBridge Pharmaceuticals · Senior Product Specialist, Rare Diseases · 2026
          </p>
          <p style={{ margin: "0 0 8px", fontSize: "10.5px" }}>
            AMVUTTRA® is a registered trademark of Alnylam Pharmaceuticals, Inc. · For internal training use only.
          </p>
          <p style={{ margin: 0, fontSize: "10px", opacity: 0.5 }}>
            Data as of Q1 2026 · Sources: FDA PI NDA 215515 (2025), NEJM 2024, Amyloid 2022, ESC 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
