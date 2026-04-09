/* FAQ Section — AMVUTTRA Product Website
   Design: Accordion with category tabs
   Features: Categorized FAQs with expand/collapse */

import { useState } from "react";

const FAQ_CATEGORIES = ["All", "Clinical", "Safety", "Dosing", "Access", "Competitive"];

const FAQS = [
  {
    category: "Clinical",
    q: "Can AMVUTTRA be used in patients already on tafamidis?",
    a: "Yes. HELIOS-B enrolled ~40% of patients on background tafamidis. The overall HR was 0.72, and even in the background tafamidis subgroup, the HR was 0.79 (though not statistically significant in that subgroup alone). AMVUTTRA demonstrated benefit on top of tafamidis in the overall population. This is a key differentiator — it is the only therapy shown to add benefit in patients already on a TTR stabilizer.",
  },
  {
    category: "Clinical",
    q: "What is the difference between ATTR-CM and hATTR-PN?",
    a: "ATTR-CM (cardiomyopathy): TTR amyloid deposits in the heart → restrictive cardiomyopathy, HFpEF, conduction abnormalities. Predominantly wild-type (age-related) in older men. hATTR-PN (hereditary polyneuropathy): TTR gene mutation → amyloid deposits in peripheral nerves → progressive sensorimotor and autonomic neuropathy. Both can coexist (mixed phenotype). AMVUTTRA is approved for both.",
  },
  {
    category: "Clinical",
    q: "What does the HELIOS-B OLE data show?",
    a: "The Open-Label Extension (OLE) data presented at ESC 2025 (48 months) showed: 37% reduction in ACM + first CV event (overall), 42% in monotherapy subgroup. Importantly, patients who crossed over from placebo to vutrisiran showed attenuated benefit vs. those on vutrisiran from day 1 — supporting early initiation. LV wall thickness progression was attenuated in the vutrisiran arm.",
  },
  {
    category: "Safety",
    q: "How do I manage vitamin A reduction in my patients?",
    a: "Supplement ALL patients with vitamin A at the Recommended Daily Allowance (RDA): 700 mcg/day RAE for women, 900 mcg/day RAE for men. Do NOT use high-dose vitamin A supplements (risk of toxicity). Routine serum vitamin A monitoring is NOT recommended by the FDA PI. Refer to ophthalmology if patients develop ocular symptoms (night blindness, dry eyes, blurred vision).",
  },
  {
    category: "Safety",
    q: "Does AMVUTTRA require REMS or premedication?",
    a: "No. AMVUTTRA does not require a Risk Evaluation and Mitigation Strategy (REMS) program. No premedication is required before injection. This is in contrast to patisiran (ONPATTRO), which requires premedication with corticosteroids, antihistamines, and acetaminophen before each IV infusion. This simplifies the administration process significantly.",
  },
  {
    category: "Safety",
    q: "What are the contraindications for AMVUTTRA?",
    a: "There are no formal contraindications listed in the FDA Prescribing Information for AMVUTTRA. The key precaution is embryo-fetal toxicity (Boxed Warning) — effective contraception is required during treatment and for 7 months after the last dose. Use with caution in pregnancy (avoid if possible). No data in severe hepatic impairment.",
  },
  {
    category: "Dosing",
    q: "What happens if a patient misses a dose?",
    a: "Administer the missed dose as soon as possible. Then resume the regular Q3M (every 3 months) dosing schedule from the date of the missed dose administration. Do not double-dose. Since AMVUTTRA is HCP-administered, missed doses are less common than with self-administered therapies.",
  },
  {
    category: "Dosing",
    q: "Are dose adjustments needed for elderly patients or those with renal/hepatic impairment?",
    a: "No dose adjustments are required for: age (92% of HELIOS-B patients were ≥65 y, 62% ≥75 y), mild-to-moderate renal impairment, mild-to-moderate hepatic impairment. AMVUTTRA has not been studied in severe renal or hepatic impairment — use with caution in those populations.",
  },
  {
    category: "Access",
    q: "What is Alnylam Assist® and how does it help patients?",
    a: "Alnylam Assist® is the comprehensive patient support program. It provides: prior authorization support and appeals assistance, co-pay assistance for eligible commercially insured patients (reducing out-of-pocket costs), free drug program for uninsured/underinsured patients, specialty pharmacy coordination, nurse educator support for patient education, and adherence monitoring. Enroll patients at the time of prescribing.",
  },
  {
    category: "Access",
    q: "What is the approximate cost of AMVUTTRA?",
    a: "The approximate annual Wholesale Acquisition Cost (WAC) is ~$477,000. However, actual patient cost depends on insurance coverage, prior authorization status, and eligibility for Alnylam Assist® programs. Most commercially insured patients with prior authorization have manageable out-of-pocket costs through the co-pay assistance program. Medicare/Medicaid coverage varies by plan.",
  },
  {
    category: "Competitive",
    q: "How does AMVUTTRA compare to patisiran (ONPATTRO)?",
    a: "Both are RNAi siRNA therapies targeting TTR mRNA. Key differences: (1) Route: AMVUTTRA SC Q3M vs. patisiran IV Q3W — 4 vs. ~17 doses/year. (2) Premedication: AMVUTTRA none vs. patisiran required. (3) Indications: AMVUTTRA approved for both ATTR-CM and hATTR-PN; patisiran only for hATTR-PN. (4) TTR reduction: comparable (~88% vs ~87%). AMVUTTRA is strictly superior in convenience and indication coverage.",
  },
  {
    category: "Competitive",
    q: "Can AMVUTTRA be used in patients progressing on tafamidis or acoramidis?",
    a: "Yes. Patients progressing on TTR stabilizers (tafamidis, acoramidis) are candidates for AMVUTTRA. HELIOS-B demonstrated benefit even in patients on background tafamidis. The mechanism is complementary: stabilizers prevent tetramer dissociation, while AMVUTTRA silences TTR production entirely (>80% reduction). Discuss with the treating cardiologist about switching or adding AMVUTTRA.",
  },
];

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = FAQS.filter((faq) => activeCategory === "All" || faq.category === activeCategory);

  return (
    <section
      id="faq"
      style={{ padding: "80px 0", background: "#F8F9FA" }}
      aria-label="Frequently asked questions"
    >
      <div className="container">
        <div style={{ marginBottom: "48px" }}>
          <div className="section-accent" />
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              color: "#1A3A6B",
              marginBottom: "8px",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "15px", color: "#566573", fontFamily: "'DM Sans', sans-serif", maxWidth: "600px" }}>
            Common HCP objections, clinical questions, and access inquiries — answered
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              style={{
                background: activeCategory === cat ? "#1A3A6B" : "white",
                color: activeCategory === cat ? "white" : "#566573",
                border: `1px solid ${activeCategory === cat ? "#1A3A6B" : "#E8ECF0"}`,
                padding: "7px 16px",
                borderRadius: "30px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((faq, i) => (
            <div
              key={faq.q}
              style={{
                background: "white",
                borderRadius: "12px",
                border: `1px solid ${openIndex === i ? "#00C2A8" : "#E8ECF0"}`,
                overflow: "hidden",
                boxShadow: openIndex === i ? "0 4px 16px rgba(0,194,168,0.12)" : "0 2px 8px rgba(26,58,107,0.04)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "12px",
                }}
                aria-expanded={openIndex === i}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      background: "#F0F4F8",
                      color: "#566573",
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontFamily: "'DM Sans', sans-serif",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {faq.category}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "13.5px",
                      color: "#1A3A6B",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.q}
                  </span>
                </div>
                <span
                  style={{
                    color: "#00C2A8",
                    fontSize: "18px",
                    fontWeight: 300,
                    flexShrink: 0,
                    transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <div
                  style={{
                    padding: "0 20px 16px 20px",
                    fontSize: "13px",
                    color: "#445566",
                    lineHeight: 1.7,
                    fontFamily: "'DM Sans', sans-serif",
                    borderTop: "1px solid #F0F4F8",
                    paddingTop: "14px",
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
