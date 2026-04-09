/* Hero Section — AMVUTTRA Product Website
   Design: Full-bleed dark navy with molecular background image
   Features: Animated KPI counters, glassmorphism stat cards, 5-second clarity
   Text: White on dark background (verified contrast) */

import { useEffect, useRef, useState } from "react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663157530477/SD6zCgt629P7QNrjfpq6Wp/amvuttra-hero-bg-SwKVf8u2sPhCWY7Dak65kZ.webp";

interface StatCard {
  id: string;
  value: string;
  numericValue?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel: string;
  color: string;
}

const STATS: StatCard[] = [
  {
    id: "s1",
    value: "28",
    numericValue: 28,
    suffix: "%",
    label: "CV Composite Reduction",
    sublabel: "HR 0.72 · HELIOS-B overall (P=0.01)",
    color: "#00C2A8",
  },
  {
    id: "s2",
    value: "35",
    numericValue: 35,
    suffix: "%",
    label: "All-Cause Mortality Reduction",
    sublabel: "HR 0.65 · 42 months (P=0.01)",
    color: "#27AE60",
  },
  {
    id: "s3",
    value: "88",
    numericValue: 88,
    suffix: "%",
    label: "Peak TTR Suppression",
    sublabel: "Steady-state serum levels",
    color: "#0093C4",
  },
  {
    id: "s4",
    value: "Q3M",
    label: "SC Injection Frequency",
    sublabel: "4 doses/year · No premedication",
    color: "#F1C40F",
  },
  {
    id: "s5",
    value: "DUAL",
    label: "ATTR-CM + hATTR-PN",
    sublabel: "Only therapy approved for both",
    color: "#E67E22",
  },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatCardItem({ stat, active }: { stat: StatCard; active: boolean }) {
  const count = useCountUp(stat.numericValue ?? 0, 1800, active && !!stat.numericValue);
  const displayValue = stat.numericValue
    ? `${stat.prefix ?? ""}${count}${stat.suffix ?? ""}`
    : stat.value;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "16px",
        padding: "20px 22px",
        minWidth: "160px",
        textAlign: "center",
        transition: "transform 0.3s ease, background 0.3s ease",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.13)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
        }}
      />
      <div
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "clamp(2rem, 4vw, 2.8rem)",
          fontWeight: 400,
          color: stat.color,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.9)",
          marginTop: "8px",
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.3,
        }}
      >
        {stat.label}
      </div>
      <div
        style={{
          fontSize: "10.5px",
          color: "rgba(255,255,255,0.55)",
          marginTop: "4px",
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.4,
        }}
      >
        {stat.sublabel}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setActive(true), 300);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="overview"
      ref={ref}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #060D18 0%, #0D2047 40%, #0D2A50 70%, #0A3A5C 100%)",
        color: "white",
        padding: "80px 0 70px",
        overflow: "hidden",
        minHeight: "520px",
      }}
      aria-label="Product overview"
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          opacity: 0.35,
          mixBlendMode: "luminosity",
        }}
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(6,13,24,0.9) 0%, rgba(6,13,24,0.6) 50%, rgba(6,13,24,0.2) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative glow */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,194,168,0.12) 0%, transparent 70%)",
          animation: "pulse-glow 5s ease-in-out infinite",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #00C2A8, #00E5C7)",
            color: "white",
            fontSize: "15px",
            fontWeight: 800,
            padding: "10px 24px",
            borderRadius: "30px",
            letterSpacing: "1.8px",
            marginBottom: "24px",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 6px 22px rgba(0,194,168,0.45)",
          }}
        >
          Mohammed N Alotaibi · NewBridge Pharmaceuticals · 2026
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            marginBottom: "8px",
            letterSpacing: "-0.03em",
            color: "white",
          }}
        >
          AMVUTTRA
          <span style={{ color: "#00C2A8", textShadow: "0 0 30px rgba(0,194,168,0.4)" }}>®</span>
          <span
            style={{
              display: "block",
              fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
              color: "rgba(255,255,255,0.7)",
              fontStyle: "italic",
              marginTop: "4px",
              letterSpacing: "-0.01em",
            }}
          >
            vutrisiran
          </span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "40px",
            maxWidth: "600px",
            lineHeight: 1.65,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          The first and only FDA-approved RNAi therapy for both{" "}
          <strong style={{ color: "#00C2A8" }}>ATTR-CM</strong> and{" "}
          <strong style={{ color: "#0093C4" }}>hATTR-PN</strong> · GalNAc-siRNA · Once every 3 months
        </p>

        {/* Approval badges */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "36px" }}>
          {[
            { label: "ATTR-CM", date: "FDA: March 2025", color: "#00C2A8" },
            { label: "hATTR-PN", date: "FDA: June 2022", color: "#0093C4" },
            { label: "EMA Approved", date: "Both indications", color: "#27AE60" },
          ].map((badge) => (
            <div
              key={badge.label}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: `1px solid ${badge.color}40`,
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "11px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ color: badge.color, fontWeight: 700 }}>{badge.label}</span>
              <span style={{ color: "rgba(255,255,255,0.5)", marginLeft: "6px" }}>{badge.date}</span>
            </div>
          ))}
        </div>

        {/* KPI Stats */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          {STATS.map((stat) => (
            <StatCardItem key={stat.id} stat={stat} active={active} />
          ))}
        </div>

        {/* Fair balance note */}
        <p
          style={{
            marginTop: "28px",
            fontSize: "10.5px",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'DM Sans', sans-serif",
            maxWidth: "700px",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "rgba(255,255,255,0.6)" }}>Important Safety Information:</strong>{" "}
          AMVUTTRA may cause fetal harm. Vitamin A levels are reduced (~65%); supplement at RDA.
          Refer patients with ocular symptoms to ophthalmology. See full Safety section and Prescribing Information.
        </p>
      </div>
    </section>
  );
}
