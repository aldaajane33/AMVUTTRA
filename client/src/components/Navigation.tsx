/* Navigation — AMVUTTRA Product Website
   Design: Clinical Precision / Swiss Medical Modernism
   Sticky top nav with scroll progress bar and active section tracking
   Nav order matches user-specified section sequence
   WCAG 2.1 AA: role="navigation", aria-label, aria-current, aria-label on buttons */

import { useState, useEffect, useRef } from "react";
import { Printer } from "lucide-react";

const NAV_ITEMS = [
  { id: "overview",             label: "Overview" },       // 1
  { id: "moa",                  label: "MOA" },             // 2
  { id: "evidence",             label: "Evidence" },        // 3
  { id: "patient-flow",         label: "Patient Flow" },    // 4
  { id: "dosing",               label: "Dosing" },          // 5
  { id: "safety",               label: "Safety" },          // 6
  { id: "competitive-suite",    label: "Comparison" },      // 7
  { id: "territory-map",        label: "Territory" },       // 8
  { id: "account-profiles",     label: "Accounts" },        // 9
  { id: "congress-updates",     label: "Congress" },        // 10
  { id: "diagnostic-algorithm", label: "Dx Algorithm" },    // 11
  { id: "alnylam-act",          label: "Act® Testing" },    // 12
  { id: "patient-support",      label: "PSP Guide" },       // 13
  { id: "case-simulator",       label: "Case Sim" },        // 14
  { id: "objection-handler",    label: "Objections" },      // 15
  { id: "pitch",                label: "Role-Play" },       // 16
  { id: "quiz",                 label: "Quiz" },            // 17
  { id: "certification",        label: "Certification" },   // 17b
  { id: "dashboard",            label: "Dashboard" },       // 18
  { id: "knowledge",            label: "Knowledge" },       // 19
  { id: "references",           label: "References" },      // 20
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setIsScrolled(scrollTop > 20);

      // Active section detection
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
      let current = "overview";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 80) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="AMVUTTRA product dossier sections"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled
          ? "rgba(6,13,24,0.97)"
          : "rgba(6,13,24,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Scroll progress bar */}
      <div
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #00C2A8, #0093C4)",
          transition: "width 0.1s linear",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          height: "52px",
          gap: "0",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("overview")}
          aria-label="Go to Overview section"
          style={{
            flexShrink: 0,
            marginRight: "20px",
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#00C2A8",
            background: "none",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}
        >
          AMVUTTRA
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", marginLeft: "4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
            · Dossier
          </span>
        </button>

        {/* Nav items */}
        <div
          role="list"
          aria-label="Section navigation"
          style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, overflowX: "auto", scrollbarWidth: "none" }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                role="listitem"
                onClick={() => scrollTo(item.id)}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={isActive ? "location" : undefined}
                style={{
                  flexShrink: 0,
                  padding: "6px 10px",
                  fontSize: "11px",
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: isActive ? "#00C2A8" : "rgba(255,255,255,0.55)",
                  background: isActive ? "rgba(0,194,168,0.1)" : "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  borderBottom: isActive ? "2px solid #00C2A8" : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.85)";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Print button */}
        <button
          onClick={() => window.print()}
          aria-label="Print this dossier"
          style={{
            flexShrink: 0,
            marginLeft: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#fff",
            background: "linear-gradient(135deg, #00C2A8, #0093C4)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 12px rgba(0,194,168,0.3)",
          }}
        >
          <Printer size={13} aria-hidden="true" />
          Print
        </button>
      </div>
    </nav>
  );
}
