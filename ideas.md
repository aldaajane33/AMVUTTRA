# AMVUTTRA Product Website — Design Brainstorm

## Design Philosophy Options

<response>
<text>
**Approach 1 — Clinical Precision / Swiss Medical Modernism**

- **Design Movement**: Swiss International Typographic Style meets clinical data visualization
- **Core Principles**: Grid-based asymmetry with deliberate tension; data as hero; restrained color amplification; typographic authority
- **Color Philosophy**: Deep navy (#0D1B2A) as the primary canvas — conveys authority and trust. Teal (#00C2A8) as the single accent — clinical, modern, life-affirming. White space is generous and intentional. Warm off-white (#F8F9FA) for section backgrounds. Red (#C0392B) reserved strictly for warnings.
- **Layout Paradigm**: Asymmetric split-column layouts where data/numbers occupy 40% and explanatory text 60%. Sections break the grid intentionally for visual rhythm. Floating sidebar navigation anchored left.
- **Signature Elements**: (1) Oversized stat numerals as section anchors — numbers at 120px+ dominate the visual field; (2) Horizontal rule dividers with colored accent dots marking section transitions; (3) Data bars with animated fill on scroll-entry
- **Interaction Philosophy**: Interactions are purposeful, never decorative. Hover states reveal clinical context. Scroll triggers data animations. Everything serves comprehension.
- **Animation**: IntersectionObserver-driven counter animations; horizontal bar fill animations; subtle fade-up reveals (translateY 20px → 0, 0.5s ease-out). No parallax. Reduced-motion respected.
- **Typography System**: Headings — DM Serif Display (authoritative, medical-editorial); Body — DM Sans (clean, readable); Data — JetBrains Mono (precision numerics). Scale: 72px hero / 40px section / 24px subsection / 16px body.
</text>
<probability>0.08</probability>
</response>

<response>
<text>
**Approach 2 — Deep-Space Scientific / Biopharma Premium**

- **Design Movement**: Dark-mode scientific visualization with glassmorphism and luminescent data
- **Core Principles**: Dark backgrounds create visual depth and focus; luminescent accents simulate molecular glow; glassmorphism cards float above the canvas; information hierarchy through light emission
- **Color Philosophy**: Near-black (#060D18) background creates depth. Electric teal (#00E5C7) and cobalt blue (#0093C4) as luminescent accents. White text with 90% opacity for readability. Subtle gradient overlays simulate scientific imaging.
- **Layout Paradigm**: Full-width dark canvas with centered content columns (max 1100px). Cards appear to float with glass-blur effects. Sections separated by gradient fade transitions rather than hard lines.
- **Signature Elements**: (1) Glowing KPI cards with radial gradient halos; (2) SVG molecular pathway diagrams with animated node pulses; (3) Glassmorphism comparison cards with frosted borders
- **Interaction Philosophy**: Hover states emit light — cards glow on focus. Tooltips appear as floating glass panels. Navigation highlights pulse softly.
- **Animation**: Pulsing glow animations on key stats (keyframe scale 1→1.05→1); particle-like background animation; staggered card entrances. Smooth 60fps transitions.
- **Typography System**: Headings — Space Grotesk (geometric, scientific); Body — Inter (neutral, readable); Numbers — Orbitron (futuristic precision). Scale: 64px hero / 36px section / 22px subsection / 15px body.
</text>
<probability>0.07</probability>
</response>

<response>
<text>
**Approach 3 — Editorial Medical / Premium Print-to-Digital**

- **Design Movement**: High-end medical journal meets premium pharmaceutical brand book
- **Core Principles**: Editorial asymmetry; generous white space as a luxury signal; typographic contrast between serif display and sans-serif body; color used sparingly for maximum impact
- **Color Philosophy**: Warm white (#FAFAF8) as the primary canvas — clean, premium, clinical. Deep navy (#1A3A6B) for authority. A single accent — vivid teal (#00C2A8) — used only for the most critical data points and CTAs. All other elements in grayscale.
- **Layout Paradigm**: Magazine-style asymmetric grid. Hero section uses a large typographic statement left-aligned with a data visualization panel right. Sections alternate between full-bleed and contained layouts. Floating quick-nav sidebar right-aligned.
- **Signature Elements**: (1) Pull-quote style stat callouts — large serif numerals with thin rule underlines; (2) Color-coded section tabs in the sidebar navigation; (3) Infographic-style MOA pathway with editorial illustration style
- **Interaction Philosophy**: Interactions feel like turning pages — smooth, deliberate. Flip-card knowledge panels. Accordion objection handlers. All interactions have satisfying tactile feedback.
- **Animation**: Page-turn transitions between sections; counter animations for KPIs; subtle parallax on hero background only. Reduced-motion: all animations disabled, content static.
- **Typography System**: Headings — Playfair Display (editorial authority); Body — Source Sans Pro (clinical readability); Data — IBM Plex Mono (precision). Scale: 68px hero / 38px section / 22px subsection / 16px body.
</text>
<probability>0.09</probability>
</response>

---

## Selected Approach: **Approach 1 — Clinical Precision / Swiss Medical Modernism**

**Rationale**: The Swiss Medical Modernism approach best serves a director-ready pharma presentation. It prioritizes data legibility, clinical credibility, and visual hierarchy — exactly what a Senior Product Specialist needs when presenting to HCPs or internal stakeholders. The asymmetric layouts prevent the "AI slop" centered-grid trap, while the DM Serif / DM Sans pairing delivers editorial authority without the overused Inter font. The restrained color palette (navy + teal + white) mirrors Alnylam's own brand language while feeling premium and modern.

**Design tokens committed**:
- Background: #F8F9FA (warm off-white)
- Primary: #1A3A6B (deep navy)
- Accent: #00C2A8 (teal)
- Secondary accent: #0093C4 (cobalt blue)
- Warning: #C0392B (red)
- Caution: #E67E22 (orange)
- Success: #27AE60 (green)
- Fonts: DM Serif Display (headings) + DM Sans (body) + JetBrains Mono (data)
