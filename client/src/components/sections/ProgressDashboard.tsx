/**
 * ProgressDashboard.tsx
 * Design: Clinical Precision / Swiss Medical Modernism
 * — Tracks scores from Quiz, Case Simulator, and Role-Play sessions via localStorage
 * — Domain-based performance breakdown (MOA, Safety, Evidence, Competitive, Access, Dosing)
 * — Activity history timeline, strengths/weaknesses radar, overall readiness score
 * — Reset capability with confirmation
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Trophy,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Shield,
  FlaskConical,
  DollarSign,
  Zap,
  BookOpen,
  Star,
  AlertTriangle,
  Trash2,
  Activity,
  Target,
  Award,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizAttempt {
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timed: boolean;
}

interface CaseAttempt {
  date: string;
  caseId: string;
  caseTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
}

interface RolePlayAttempt {
  date: string;
  archetypeId: string;
  archetypeName: string;
  scenarioId: string;
  scenarioTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
}

interface DomainScore {
  correct: number;
  total: number;
}

interface ProgressData {
  quizHistory: QuizAttempt[];
  caseHistory: CaseAttempt[];
  rolePlayHistory: RolePlayAttempt[];
  domainScores: Record<string, DomainScore>;
  lastUpdated: string;
}

// ─── Domain Config ────────────────────────────────────────────────────────────

const DOMAIN_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  MOA: { color: "#3498DB", icon: <FlaskConical size={14} />, label: "Mechanism of Action" },
  Evidence: { color: "#27AE60", icon: <TrendingUp size={14} />, label: "Clinical Evidence" },
  Safety: { color: "#C0392B", icon: <Shield size={14} />, label: "Safety Profile" },
  Competitive: { color: "#8E44AD", icon: <Zap size={14} />, label: "Competitive Landscape" },
  Access: { color: "#E67E22", icon: <DollarSign size={14} />, label: "Access & Reimbursement" },
  Dosing: { color: "#00C2A8", icon: <BookOpen size={14} />, label: "Dosing & Administration" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY_PROGRESS: ProgressData = { quizHistory: [], caseHistory: [], rolePlayHistory: [], domainScores: {}, lastUpdated: "" };

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem("amvuttra_progress");
    if (!raw) return { ...EMPTY_PROGRESS };
    const parsed = JSON.parse(raw);
    // Safe merge: fill any missing keys with empty defaults to prevent .length crashes
    return {
      quizHistory: Array.isArray(parsed?.quizHistory) ? parsed.quizHistory : [],
      caseHistory: Array.isArray(parsed?.caseHistory) ? parsed.caseHistory : [],
      rolePlayHistory: Array.isArray(parsed?.rolePlayHistory) ? parsed.rolePlayHistory : [],
      domainScores: (parsed?.domainScores && typeof parsed.domainScores === "object" && !Array.isArray(parsed.domainScores)) ? parsed.domainScores : {},
      lastUpdated: typeof parsed?.lastUpdated === "string" ? parsed.lastUpdated : "",
    };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function gradeColor(grade: string): string {
  if (grade === "Expert" || grade === "PASS") return "#27AE60";
  if (grade === "Proficient") return "#00C2A8";
  if (grade === "Developing") return "#F0A500";
  return "#C0392B";
}

function readinessLabel(pct: number): { label: string; color: string; description: string } {
  if (pct >= 85) return { label: "Expert Ready", color: "#27AE60", description: "You have demonstrated mastery across all domains. You are ready for senior-level HCP interactions." };
  if (pct >= 70) return { label: "Field Ready", color: "#00C2A8", description: "You have solid product knowledge. Focus on the domains below 70% to reach expert level." };
  if (pct >= 50) return { label: "Developing", color: "#F0A500", description: "You are building your knowledge base. Complete more quiz and case simulator sessions to improve." };
  return { label: "Needs Practice", color: "#C0392B", description: "Significant knowledge gaps remain. Review the MOA, Evidence, and Safety sections and retake the quiz." };
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5 border border-white/10" style={{ background: "#0D1B3E" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + "22", color }}>
          {icon}
        </div>
        <span className="text-white/40 text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color, fontFamily: "'DM Serif Display', serif" }}>
        {value}
      </div>
      {sub && <div className="text-white/30 text-xs">{sub}</div>}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
        <Activity size={28} className="text-white/20" />
      </div>
      <h3 className="text-white/40 font-bold text-lg mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
        No Activity Yet
      </h3>
      <p className="text-white/25 text-sm max-w-md mx-auto leading-relaxed">
        Complete the Knowledge Quiz, Patient Case Simulator, or Role-Play Mode to start tracking your performance here.
      </p>
      <div className="flex items-center justify-center gap-6 mt-6">
        {[
          { label: "Knowledge Quiz", icon: <BookOpen size={14} />, color: "#00C2A8", href: "#quiz" },
          { label: "Case Simulator", icon: <Target size={14} />, color: "#F0A500", href: "#case-simulator" },
          { label: "Role-Play Mode", icon: <Star size={14} />, color: "#8E44AD", href: "#pitch" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ color: item.color }}
          >
            {item.icon} {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProgressDashboard() {
  const [data, setData] = useState<ProgressData>(loadProgress);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "quiz" | "cases" | "roleplay">("overview");

  // Refresh data when tab becomes active
  useEffect(() => {
    const refresh = () => setData(loadProgress());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const handleReset = () => {
    try {
      localStorage.removeItem("amvuttra_progress");
    } catch {
      // Storage unavailable — data may already be cleared
    }
    setData({ quizHistory: [], caseHistory: [], rolePlayHistory: [], domainScores: {}, lastUpdated: "" });
    setShowResetConfirm(false);
  };

  // ── Compute overall stats ──
  const totalActivities = data.quizHistory.length + data.caseHistory.length + data.rolePlayHistory.length;
  const hasData = totalActivities > 0;

  const overallDomainPct = (() => {
    const totals = { correct: 0, total: 0 };
    Object.values(data.domainScores).forEach(({ correct, total }) => {
      totals.correct += correct;
      totals.total += total;
    });
    return totals.total > 0 ? Math.round((totals.correct / totals.total) * 100) : 0;
  })();

  const bestQuizScore = data.quizHistory.length > 0
    ? Math.max(...data.quizHistory.map((q) => q.percentage))
    : null;

  const avgCaseScore = data.caseHistory.length > 0
    ? Math.round(data.caseHistory.reduce((s, c) => s + c.percentage, 0) / data.caseHistory.length)
    : null;

  const avgRolePlayScore = data.rolePlayHistory.length > 0
    ? Math.round(data.rolePlayHistory.reduce((s, r) => s + r.percentage, 0) / data.rolePlayHistory.length)
    : null;

  // Readiness score = weighted average of all activities
  const readinessScore = (() => {
    const scores: number[] = [];
    if (bestQuizScore !== null) scores.push(bestQuizScore);
    if (avgCaseScore !== null) scores.push(avgCaseScore);
    if (avgRolePlayScore !== null) scores.push(avgRolePlayScore);
    if (overallDomainPct > 0) scores.push(overallDomainPct);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  })();

  const readiness = readinessLabel(readinessScore);

  // Radar data
  const radarData = Object.entries(DOMAIN_CONFIG).map(([domain, config]) => {
    const ds = data.domainScores[domain];
    const pct = ds && ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : 0;
    return { domain, pct, fullMark: 100 };
  });

  // Quiz trend data
  const quizTrend = data.quizHistory.slice(-8).map((q, i) => ({
    attempt: `#${i + 1}`,
    score: q.percentage,
    pass: 70,
  }));

  // All activity feed (merged + sorted)
  const activityFeed = [
    ...data.quizHistory.map((q) => ({
      date: q.date,
      type: "Quiz" as const,
      label: `Knowledge Quiz${q.timed ? " (Timed)" : ""}`,
      score: q.percentage,
      passed: q.passed,
      grade: q.passed ? "PASS" : "FAIL",
    })),
    ...data.caseHistory.map((c) => ({
      date: c.date,
      type: "Case" as const,
      label: c.caseTitle,
      score: c.percentage,
      passed: c.percentage >= 70,
      grade: c.grade,
    })),
    ...data.rolePlayHistory.map((r) => ({
      date: r.date,
      type: "RolePlay" as const,
      label: `${r.archetypeName} — ${r.scenarioTitle}`,
      score: r.percentage,
      passed: r.percentage >= 70,
      grade: r.grade,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  const typeColor = { Quiz: "#00C2A8", Case: "#F0A500", RolePlay: "#8E44AD" };
  const typeIcon = {
    Quiz: <BookOpen size={12} />,
    Case: <Target size={12} />,
    RolePlay: <Star size={12} />,
  };

  // Strengths and weaknesses
  const domainRanked = Object.entries(DOMAIN_CONFIG)
    .map(([domain]) => {
      const ds = data.domainScores[domain];
      const pct = ds && ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : null;
      return { domain, pct };
    })
    .filter((d) => d.pct !== null)
    .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));

  const strengths = domainRanked.filter((d) => (d.pct ?? 0) >= 70).slice(0, 3);
  const weaknesses = domainRanked.filter((d) => (d.pct ?? 0) < 70).slice(0, 3);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "quiz", label: `Quiz (${data.quizHistory.length})` },
    { id: "cases", label: `Cases (${data.caseHistory.length})` },
    { id: "roleplay", label: `Role-Play (${data.rolePlayHistory.length})` },
  ] as const;

  return (
    <section id="dashboard" className="py-20" style={{ background: "#060E24" }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-10">
          <div>
            <div className="w-12 h-0.5 bg-[#00C2A8] mb-4" />
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Progress Dashboard
            </h2>
            <p className="text-white/50 text-lg">
              Your personal performance tracker — quiz, cases, and role-play sessions
            </p>
            {data.lastUpdated && (
              <p className="text-white/25 text-xs mt-1">
                Last updated: {formatDate(data.lastUpdated)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setData(loadProgress())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/40 hover:bg-white/10 transition-all"
            >
              <RefreshCw size={12} /> Refresh
            </button>
            {hasData && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#C0392B]/10 text-[#C0392B] hover:bg-[#C0392B]/20 transition-all"
              >
                <Trash2 size={12} /> Reset
              </button>
            )}
          </div>
        </div>

        {!hasData ? (
          <EmptyState />
        ) : (
          <>
            {/* Readiness Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6 mb-8 border"
              style={{ background: readiness.color + "10", borderColor: readiness.color + "33" }}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
                  style={{ background: readiness.color + "20", color: readiness.color, fontFamily: "'DM Serif Display', serif" }}
                >
                  {readinessScore}%
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={16} style={{ color: readiness.color }} />
                    <span className="font-bold text-white text-lg" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {readiness.label}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{readiness.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center">
                    <div className="text-xs text-white/30 mb-0.5">Activities</div>
                    <div className="text-xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>{totalActivities}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Best Quiz"
                value={bestQuizScore !== null ? `${bestQuizScore}%` : "—"}
                sub={`${data.quizHistory.length} attempt${data.quizHistory.length !== 1 ? "s" : ""}`}
                color="#00C2A8"
                icon={<BookOpen size={14} />}
              />
              <StatCard
                label="Avg Case Score"
                value={avgCaseScore !== null ? `${avgCaseScore}%` : "—"}
                sub={`${data.caseHistory.length} case${data.caseHistory.length !== 1 ? "s" : ""}`}
                color="#F0A500"
                icon={<Target size={14} />}
              />
              <StatCard
                label="Avg Role-Play"
                value={avgRolePlayScore !== null ? `${avgRolePlayScore}%` : "—"}
                sub={`${data.rolePlayHistory.length} session${data.rolePlayHistory.length !== 1 ? "s" : ""}`}
                color="#8E44AD"
                icon={<Star size={14} />}
              />
              <StatCard
                label="Domain Accuracy"
                value={overallDomainPct > 0 ? `${overallDomainPct}%` : "—"}
                sub="across all quiz domains"
                color="#3498DB"
                icon={<BarChart2 size={14} />}
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 border-b border-white/10 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px"
                  style={{
                    color: activeTab === tab.id ? "#00C2A8" : "rgba(255,255,255,0.4)",
                    borderBottomColor: activeTab === tab.id ? "#00C2A8" : "transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ── Overview Tab ── */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {/* Radar Chart */}
                  {Object.keys(data.domainScores).length > 0 && (
                    <div className="rounded-xl p-5 border border-white/10" style={{ background: "#0D1B3E" }}>
                      <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <BarChart2 size={12} /> Domain Performance
                      </h4>
                      <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="domain" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                          <Radar name="Score" dataKey="pct" stroke="#00C2A8" fill="#00C2A8" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Quiz Trend */}
                  {quizTrend.length > 1 && (
                    <div className="rounded-xl p-5 border border-white/10" style={{ background: "#0D1B3E" }}>
                      <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <TrendingUp size={12} /> Quiz Score Trend
                      </h4>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={quizTrend}>
                          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="attempt" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{ background: "#0D1B3E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                            labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                            itemStyle={{ color: "#00C2A8" }}
                          />
                          <Line type="monotone" dataKey="score" stroke="#00C2A8" strokeWidth={2} dot={{ fill: "#00C2A8", r: 4 }} />
                          <Line type="monotone" dataKey="pass" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" strokeWidth={1} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Strengths */}
                  {strengths.length > 0 && (
                    <div className="rounded-xl p-5 border border-[#27AE60]/20" style={{ background: "#27AE6008" }}>
                      <h4 className="text-[#27AE60] text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <CheckCircle size={12} /> Strengths
                      </h4>
                      <div className="space-y-2">
                        {strengths.map(({ domain, pct }) => {
                          const config = DOMAIN_CONFIG[domain];
                          return (
                            <div key={domain} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: config.color + "22", color: config.color }}>
                                {config.icon}
                              </div>
                              <span className="text-white/70 text-sm flex-1">{config.label}</span>
                              <span className="font-bold text-sm" style={{ color: config.color }}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {weaknesses.length > 0 && (
                    <div className="rounded-xl p-5 border border-[#C0392B]/20" style={{ background: "#C0392B08" }}>
                      <h4 className="text-[#C0392B] text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Areas to Improve
                      </h4>
                      <div className="space-y-2">
                        {weaknesses.map(({ domain, pct }) => {
                          const config = DOMAIN_CONFIG[domain];
                          return (
                            <div key={domain} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: config.color + "22", color: config.color }}>
                                {config.icon}
                              </div>
                              <span className="text-white/70 text-sm flex-1">{config.label}</span>
                              <span className="font-bold text-sm" style={{ color: "#C0392B" }}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  {activityFeed.length > 0 && (
                    <div className="md:col-span-2 rounded-xl p-5 border border-white/10" style={{ background: "#0D1B3E" }}>
                      <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Clock size={12} /> Recent Activity
                      </h4>
                      <div className="space-y-2">
                        {activityFeed.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                              style={{ background: typeColor[item.type] + "22", color: typeColor[item.type] }}
                            >
                              {typeIcon[item.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white/70 text-sm truncate">{item.label}</div>
                              <div className="text-white/30 text-xs">{formatDate(item.date)}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-bold" style={{ color: gradeColor(item.grade) }}>
                                {item.score}%
                              </span>
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded"
                                style={{ color: gradeColor(item.grade), background: gradeColor(item.grade) + "20" }}
                              >
                                {item.grade}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Quiz Tab ── */}
              {activeTab === "quiz" && (
                <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {data.quizHistory.length === 0 ? (
                    <div className="text-center py-12 text-white/30 text-sm">No quiz attempts yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {[...data.quizHistory].reverse().map((q, i) => (
                        <div key={i} className="rounded-xl p-4 border border-white/10 flex items-center gap-4" style={{ background: "#0D1B3E" }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                            style={{ background: (q.passed ? "#27AE60" : "#C0392B") + "20", color: q.passed ? "#27AE60" : "#C0392B" }}>
                            {q.passed ? <CheckCircle size={18} /> : <XCircle size={18} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white/80 text-sm font-medium">
                              Knowledge Quiz{q.timed ? " — Timed Mode" : " — Standard Mode"}
                            </div>
                            <div className="text-white/30 text-xs">{formatDate(q.date)} · {q.score}/{q.total} correct</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xl font-bold" style={{ color: q.passed ? "#27AE60" : "#C0392B", fontFamily: "'DM Serif Display', serif" }}>
                              {q.percentage}%
                            </div>
                            <div className="text-xs font-bold" style={{ color: q.passed ? "#27AE60" : "#C0392B" }}>
                              {q.passed ? "PASS" : "FAIL"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Cases Tab ── */}
              {activeTab === "cases" && (
                <motion.div key="cases" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {data.caseHistory.length === 0 ? (
                    <div className="text-center py-12 text-white/30 text-sm">No case simulator attempts yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {[...data.caseHistory].reverse().map((c, i) => (
                        <div key={i} className="rounded-xl p-4 border border-white/10 flex items-center gap-4" style={{ background: "#0D1B3E" }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                            style={{ background: "#F0A50020", color: "#F0A500" }}>
                            <Target size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white/80 text-sm font-medium truncate">{c.caseTitle}</div>
                            <div className="text-white/30 text-xs">{formatDate(c.date)} · {c.score}/{c.maxScore} pts</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xl font-bold" style={{ color: gradeColor(c.grade), fontFamily: "'DM Serif Display', serif" }}>
                              {c.percentage}%
                            </div>
                            <div className="text-xs font-bold" style={{ color: gradeColor(c.grade) }}>{c.grade}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Role-Play Tab ── */}
              {activeTab === "roleplay" && (
                <motion.div key="roleplay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {data.rolePlayHistory.length === 0 ? (
                    <div className="text-center py-12 text-white/30 text-sm">No role-play sessions yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {[...data.rolePlayHistory].reverse().map((r, i) => (
                        <div key={i} className="rounded-xl p-4 border border-white/10 flex items-center gap-4" style={{ background: "#0D1B3E" }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                            style={{ background: "#8E44AD20", color: "#8E44AD" }}>
                            <Star size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white/80 text-sm font-medium truncate">{r.archetypeName}</div>
                            <div className="text-white/30 text-xs">{formatDate(r.date)} · {r.scenarioTitle} · {r.score}/{r.maxScore} pts</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xl font-bold" style={{ color: gradeColor(r.grade), fontFamily: "'DM Serif Display', serif" }}>
                              {r.percentage}%
                            </div>
                            <div className="text-xs font-bold" style={{ color: gradeColor(r.grade) }}>{r.grade}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Reset Confirm Dialog */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="rounded-2xl p-8 max-w-sm w-full border border-[#C0392B]/30"
                style={{ background: "#0D1B3E" }}
              >
                <div className="w-12 h-12 rounded-full bg-[#C0392B]/15 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={22} className="text-[#C0392B]" />
                </div>
                <h3 className="text-white font-bold text-lg text-center mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Reset All Progress?
                </h3>
                <p className="text-white/50 text-sm text-center mb-6 leading-relaxed">
                  This will permanently delete all quiz scores, case simulator results, and role-play session history. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#C0392B] text-white hover:bg-[#a93226] transition-all"
                  >
                    Reset All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
