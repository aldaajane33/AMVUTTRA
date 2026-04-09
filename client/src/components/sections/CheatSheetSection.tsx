/* Cheat Sheet Section — AMVUTTRA Product Website
   Design: Print-optimized one-page reference card
   Features: All essential data in a compact grid layout
   Print: Optimized for A4/Letter paper */

export default function CheatSheetSection() {
  return (
    <section
      id="cheat-sheet"
      style={{ padding: "80px 0", background: "white" }}
      aria-label="Quick reference cheat sheet"
    >
      <div className="container">
        <div style={{ marginBottom: "32px" }}>
          <div className="section-accent" />
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              color: "#1A3A6B",
              marginBottom: "8px",
            }}
          >
            Quick Reference Cheat Sheet
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            Print-ready one-page reference — click the Print button in the navigation bar
          </p>
        </div>

        {/* Cheat sheet card */}
        <div
          style={{
            background: "white",
            border: "2px solid #1A3A6B",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(26,58,107,0.12)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #0D2047, #1A3A6B)",
              color: "white",
              padding: "20px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "1.6rem",
                  letterSpacing: "-0.02em",
                }}
              >
                AMVUTTRA<span style={{ color: "#00C2A8" }}>®</span>
                <span style={{ fontSize: "1rem", fontStyle: "italic", opacity: 0.8, marginLeft: "8px" }}>(vutrisiran)</span>
              </div>
              <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>
                Mohammed N Alotaibi · NewBridge Pharmaceuticals · 2026
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "11px", opacity: 0.7, fontFamily: "'DM Sans', sans-serif" }}>
              <div>GalNAc-siRNA · RNAi</div>
              <div>FDA Approved: CM (Mar 2025) · PN (Jun 2022)</div>
            </div>
          </div>

          {/* Content grid */}
          <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            {/* MOA */}
            <div style={{ borderTop: "3px solid #0093C4", paddingTop: "12px" }}>
              <div style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#0093C4", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                Mechanism of Action
              </div>
              {[
                "GalNAc-siRNA → SC injection",
                "GalNAc binds ASGPR on hepatocytes",
                "Receptor-mediated endocytosis",
                "RISC loading → TTR mRNA cleavage",
                "~88% peak / ~81% trough TTR ↓",
                "Both mutant + wild-type TTR silenced",
                "ESC chemistry → Q3M dosing",
              ].map((item) => (
                <div key={item} style={{ fontSize: "11.5px", color: "#445566", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", display: "flex", gap: "5px" }}>
                  <span style={{ color: "#0093C4", flexShrink: 0 }}>·</span>{item}
                </div>
              ))}
            </div>

            {/* Dosing */}
            <div style={{ borderTop: "3px solid #00C2A8", paddingTop: "12px" }}>
              <div style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#00C2A8", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                Dosing & Administration
              </div>
              {[
                "25 mg SC injection Q3M (4×/year)",
                "HCP-administered (not self-inject)",
                "Sites: abdomen, thigh, upper arm",
                "No premedication required",
                "No REMS required",
                "No dose adjustments (age, mild-mod RI/HI)",
                "Missed dose: give ASAP, resume Q3M",
              ].map((item) => (
                <div key={item} style={{ fontSize: "11.5px", color: "#445566", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", display: "flex", gap: "5px" }}>
                  <span style={{ color: "#00C2A8", flexShrink: 0 }}>·</span>{item}
                </div>
              ))}
            </div>

            {/* Safety */}
            <div style={{ borderTop: "3px solid #C0392B", paddingTop: "12px" }}>
              <div style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#C0392B", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                Safety Essentials
              </div>
              {[
                "⚠️ Embryo-fetal toxicity (Boxed Warning)",
                "Contraception during tx + 7 mo after",
                "Vitamin A ↓ ~65% → supplement at RDA",
                "Ophthalmology if ocular symptoms",
                "ISR ~4% (mild, transient)",
                "No formal contraindications",
                "No clinically significant drug interactions",
              ].map((item) => (
                <div key={item} style={{ fontSize: "11.5px", color: "#445566", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", display: "flex", gap: "5px" }}>
                  <span style={{ color: "#C0392B", flexShrink: 0 }}>·</span>{item}
                </div>
              ))}
            </div>

            {/* HELIOS-B */}
            <div style={{ borderTop: "3px solid #27AE60", paddingTop: "12px" }}>
              <div style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#27AE60", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                HELIOS-B (ATTR-CM)
              </div>
              {[
                "Phase 3 RCT, N=655, 42 months",
                "88% wt-ATTR, ~40% background tafamidis",
                "Primary: ACM + recurrent CV events",
                "Overall: HR 0.72 (0.56–0.93), P=0.01",
                "Monotherapy: HR 0.67 (0.48–0.93), P=0.02",
                "ACM at 42 mo: HR 0.65 (0.47–0.90), P=0.01",
                "OLE (48 mo): 37% ACM+CV (overall)",
              ].map((item) => (
                <div key={item} style={{ fontSize: "11.5px", color: "#445566", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", display: "flex", gap: "5px" }}>
                  <span style={{ color: "#27AE60", flexShrink: 0 }}>·</span>{item}
                </div>
              ))}
            </div>

            {/* HELIOS-A */}
            <div style={{ borderTop: "3px solid #E67E22", paddingTop: "12px" }}>
              <div style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#E67E22", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                HELIOS-A (hATTR-PN)
              </div>
              {[
                "Phase 3, N=164, 18 months",
                "hATTR-PN stage 1–2; external placebo",
                "Primary: mNIS+7 change at 18 mo",
                "Vutrisiran: −2.2 vs Placebo: +14.8",
                "Net diff: −17.0 (P=3.5×10⁻¹²)",
                "OLE: sustained benefit 36+ months",
                "Former patisiran pts improved on switch",
              ].map((item) => (
                <div key={item} style={{ fontSize: "11.5px", color: "#445566", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", display: "flex", gap: "5px" }}>
                  <span style={{ color: "#E67E22", flexShrink: 0 }}>·</span>{item}
                </div>
              ))}
            </div>

            {/* Competitive */}
            <div style={{ borderTop: "3px solid #1A3A6B", paddingTop: "12px" }}>
              <div style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#1A3A6B", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                Competitive Positioning
              </div>
              {[
                "ONLY dual-approved (CM + PN)",
                "vs Patisiran: SC Q3M vs IV Q3W; CM approval",
                "vs Tafamidis: silences vs stabilizes TTR",
                "vs Acoramidis: 4 vs 730 doses/year",
                "vs Eplontersen: Q3M vs monthly; CM approval",
                "Benefit ON TOP of tafamidis (HELIOS-B)",
                "Intellia nex-z: FDA clinical hold Oct 2025",
              ].map((item) => (
                <div key={item} style={{ fontSize: "11.5px", color: "#445566", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", display: "flex", gap: "5px" }}>
                  <span style={{ color: "#1A3A6B", flexShrink: 0 }}>·</span>{item}
                </div>
              ))}
            </div>
          </div>

          {/* Key messages footer */}
          <div
            style={{
              background: "#F8F9FA",
              borderTop: "1px solid #E8ECF0",
              padding: "16px 28px",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", color: "#1A3A6B", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
              5 Core Messages
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
              {[
                { num: "1", text: "Silence the source — not just stabilize it.", color: "#0093C4" },
                { num: "2", text: "35% mortality reduction at 42 months.", color: "#27AE60" },
                { num: "3", text: "The only dual-approved ATTR therapy.", color: "#1A3A6B" },
                { num: "4", text: "4 injections/year — maximum convenience.", color: "#00C2A8" },
                { num: "5", text: "Benefit on top of tafamidis.", color: "#E67E22" },
              ].map((msg) => (
                <div
                  key={msg.num}
                  style={{
                    background: "white",
                    border: `1px solid ${msg.color}`,
                    borderTop: `3px solid ${msg.color}`,
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "11.5px",
                    color: "#1A3A6B",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: msg.color, fontWeight: 800 }}>{msg.num}. </span>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            style={{
              background: "#F0F4F8",
              padding: "10px 28px",
              fontSize: "9.5px",
              color: "#95A5A6",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.5,
            }}
          >
            <strong>For internal training purposes only.</strong> Not for distribution to healthcare professionals or patients. Always refer to the current FDA-approved Prescribing Information for AMVUTTRA® (vutrisiran). © 2026 NewBridge Pharmaceuticals. Data sources: HELIOS-B (NEJM 2024), HELIOS-A (Amyloid 2022), HELIOS-B OLE (ESC 2025), FDA PI NDA 215515 (2025).
          </div>
        </div>
      </div>
    </section>
  );
}
