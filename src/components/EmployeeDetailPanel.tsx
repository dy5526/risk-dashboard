/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { EmployeeAnalysis } from "../types";
import { 
  X, 
  Briefcase, 
  ArrowRight,
  Sparkles,
  Users,
  AlertTriangle,
  History,
  Edit3,
  Save
} from "lucide-react";

interface EmployeeDetailPanelProps {
  employee: EmployeeAnalysis | null;
  onClose: () => void;
  employees?: EmployeeAnalysis[];
  onSelectEmployee?: (id: string) => void;
  onUpdateEmployeeRisk?: (id: string, newScore: number, reason: string, updaterName: string) => void;
  lang?: "ko" | "en";
}

export default function EmployeeDetailPanel({
  employee,
  onClose,
  employees = [],
  onSelectEmployee,
  onUpdateEmployeeRisk,
  lang = "ko"
}: EmployeeDetailPanelProps) {
  const [adjustedScore, setAdjustedScore] = React.useState<number>(employee ? employee.riskScore : 0);
  const [adjustmentReason, setAdjustmentReason] = React.useState<string>("");
  const [updaterName, setUpdaterName] = React.useState<string>("dykim@reversemountain.co.kr");
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (employee) {
      setAdjustedScore(employee.riskScore);
      setAdjustmentReason("");
      setIsEditing(false);
    }
  }, [employee?.id, employee?.riskScore]);
  if (!employee) {
    return (
      <div 
        id="employee-detail-placeholder"
        className="flex h-full flex-col rounded-xl border border-slate-800 bg-[#14181F]/90 p-5 shadow-2xl overflow-hidden animate-fade-in"
      >
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <Users className="h-4 w-4 text-teal-400" />
          <h3 className="font-display text-sm font-bold text-slate-200">
            {lang === "en" ? "Diagnostic Roster" : "정밀 진단 대상자 목록"}
          </h3>
        </div>
        
        <p className="text-xs leading-relaxed text-slate-400 mb-4 font-sans">
          {lang === "en"
            ? "Select a member below to view their detailed retention risk report and C-Level mitigation roadmap."
            : "아래 구성원 리스트 중 정밀 분석 보고서 및 C-Level 보존 대응안을 열람하고 싶은 대상을 선택하십시오."}
        </p>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-sans">
          {employees.filter((emp) => emp.riskScore >= 20).map((emp) => {
            const score = emp.riskScore;
            const tier = score >= 70 
              ? (lang === "en" ? "High Risk" : "고위험") 
              : score >= 40 
              ? (lang === "en" ? "Risk" : "위험") 
              : (lang === "en" ? "Monitor" : "확인 필요");
            const badgeColor = 
              score >= 70 ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : 
              score >= 40 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
              "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            
            return (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee?.(emp.id)}
                className="group flex items-center justify-between p-3 bg-slate-900/35 hover:bg-slate-800/40 border border-slate-800/80 hover:border-teal-500/40 rounded-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-teal-400 transition-colors">
                    {emp.employeeName}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {emp.department} · {emp.role}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                      {tier} ({score}{lang === "en" ? " pts" : "점"})
                    </span>
                    <span className="text-[8px] text-slate-500 mt-1 font-mono">{emp.timeline}</span>
                  </div>
                  <ArrowRight className="h-3 w-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Get color schemes based on risk score
  const getRiskBadgeStyles = (score: number) => {
    if (score >= 70) {
      return {
        bg: "bg-rose-500/10 border-rose-500/30",
        text: "text-rose-400",
        label: lang === "en" ? "High Risk" : "고위험",
        bar: "bg-rose-500",
        shadow: "shadow-rose-950/20"
      };
    } else if (score >= 40) {
      return {
        bg: "bg-amber-500/10 border-amber-500/30",
        text: "text-amber-400",
        label: lang === "en" ? "Risk" : "위험",
        bar: "bg-amber-500",
        shadow: "shadow-amber-950/25"
      };
    } else if (score >= 20) {
      return {
        bg: "bg-emerald-500/10 border-emerald-500/30",
        text: "text-emerald-400",
        label: lang === "en" ? "Monitor" : "확인 필요",
        bar: "bg-emerald-500",
        shadow: "shadow-emerald-950/25"
      };
    } else {
      return {
        bg: "bg-blue-500/10 border-blue-500/30",
        text: "text-blue-400",
        label: lang === "en" ? "Optimal" : "양호",
        bar: "bg-blue-500",
        shadow: "shadow-blue-950/25"
      };
    }
  };

  const badgeStyles = getRiskBadgeStyles(employee.riskScore);

  return (
    <div 
      id={`detail-panel-${employee.id}`}
      className="flex h-full flex-col rounded-xl border border-slate-800 bg-[#14181F]/95 shadow-2xl overflow-hidden backdrop-blur-md"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#12161D] p-5">
        <div className="flex items-center space-x-3">
          <div className="rounded-md bg-slate-900 p-2">
            <Sparkles className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-100">
              {lang === "en" ? "Diagnostic Report" : "정밀 진단 리포트"}
            </h3>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          aria-label={lang === "en" ? "Close" : "보고서 닫기"}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Core Profile Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
          <div>
            <span className="inline-block text-xs text-teal-400 font-semibold mb-1 uppercase tracking-wider">
              {employee.department}
            </span>
            <h1 className="text-2xl font-bold font-display text-white">{employee.employeeName}</h1>
            <p className="text-xs text-slate-404 mt-1 font-sans">{employee.role}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`rounded-lg border px-4 py-2 ${badgeStyles.bg} flex flex-col items-center justify-center`}>
              <span className={`text-base font-bold font-sans ${badgeStyles.text}`}>
                {badgeStyles.label}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {lang === "en" ? "Attrition Grade" : "이탈 진단 등급"}
              </span>
            </div>
          </div>
        </div>

        {/* 1. 핵심 위험 요인 (Key Risk Factors inside standard card) */}
        <div className="rounded-xl bg-slate-900/40 p-3.5">
          <div className="border-b border-slate-800/50 pb-2 mb-2 font-sans">
            <span className="text-xs font-bold text-slate-300">
              {lang === "en" ? "Key Risk Factors" : "핵심 위험 요인"}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-1 font-sans">
            {[
              { label: lang === "en" ? "Job Burnout & Overload" : "업무 번아웃 과부하", value: employee.keyDrivers.burnout },
              { label: lang === "en" ? "Compensation Discontent" : "처우 및 보상 불만", value: employee.keyDrivers.compensation },
              { label: lang === "en" ? "Career Growth Block" : "커리어 비전 단절", value: employee.keyDrivers.careerGrowth },
              { label: lang === "en" ? "Supervisor Friction" : "상급 리더십 마찰", value: employee.keyDrivers.leadershipConflict },
              { label: lang === "en" ? "Job Role Mismatch" : "직무 R&R 불일치", value: employee.keyDrivers.roleMismatch }
            ]
              .sort((a, b) => b.value - a.value)
              .map((driver, idx) => {
                const isSevere = driver.value >= 7;
                const isModerate = driver.value >= 4 && driver.value < 7;

                const badgeStyle = isSevere
                  ? "bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold"
                  : isModerate
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold"
                  : "bg-slate-800/40 text-slate-500 border-slate-800/80 opacity-60";

                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-all ${badgeStyle}`}
                  >
                    <span>{driver.label}</span>
                    <span className="font-mono text-[10px] px-1 rounded bg-black/40 text-slate-200">
                      {driver.value}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 2. 종합 소견: AI Executive Summary Paragraph inside card style */}
        <div className="rounded-xl bg-[#1D1418]/60 p-3.5 shadow-[0_0_15px_rgba(244,63,94,0.02)]">
          <div className="border-b border-rose-500/15 pb-2 mb-2 font-sans">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              {lang === "en" ? "Diagnostic Insights" : "정밀 소통 진단 소견"}
            </span>
          </div>
          <div className="bg-[#14181F]/55 rounded-lg p-2.5">
            <p className="text-xs text-slate-200 leading-relaxed font-semibold font-sans">
              {employee.executiveSummary}
            </p>
          </div>
        </div>

        {/* 3. 치료책: Humanistic Mitigation Approach (개인화 맞춤형 이탈 방지 완화 치료책) */}
        {employee.mitigationApproach && (
          <div className="rounded-xl bg-[#121B1C]/70 p-3.5">
            <div className="flex items-center justify-between border-b border-teal-500/15 pb-2 mb-2">
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5 font-sans">
                <Sparkles className="h-4 w-4 text-teal-400" />
                {lang === "en" ? "Personalized Retention Plan" : "개인 맞춤 이탈 방지책"}
              </span>
              <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[9px] text-teal-400 border border-teal-500/25 font-bold font-sans">
                {lang === "en" ? "Recommended" : "실행 권장"}
              </span>
            </div>
            <div className="bg-[#14181F]/55 rounded-lg p-2.5">
              <p className="text-xs text-slate-200 leading-relaxed font-semibold font-sans">
                {employee.mitigationApproach}
              </p>
            </div>
          </div>
        )}

        {/* 4. 위험 프로젝트: Affected Projects (이탈 시 프로젝트 타격 범위) */}
        {employee.affectedProjects && employee.affectedProjects.length > 0 && (
          <div className="space-y-2.5">
            <div className="border-b border-slate-800/50 pb-2 mb-2 font-sans">
              <span className="text-xs font-bold text-slate-300">
                {lang === "en" ? "Projects at Risk If Resigned" : "이탈 시 영향을 받는 프로젝트/업무"}
              </span>
            </div>
            <div className="space-y-1.5">
              {employee.affectedProjects.map((proj, idx) => {
                const cleanProj = proj.split(" (")[0].trim();
                return (
                  <div key={idx} className="flex items-start gap-2 bg-[#14181F]/40 p-2 rounded border border-slate-800/80">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <p className="text-xs font-medium text-slate-200 leading-normal font-sans">{cleanProj}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. 위험 등급 인적 조정 및 변경 이력 */}
        <div className="rounded-xl bg-slate-900/40 p-3.5 space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800/50 pb-2 mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <History className="h-4 w-4 text-teal-400" />
              {lang === "en" ? "Override Grade & Change History" : "위험 등급 조정 및 변경 이력"}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[10px] text-teal-400 font-bold hover:underline bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/25 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Edit3 className="h-3 w-3" />
              {isEditing 
                ? (lang === "en" ? "Cancel" : "조정 취소") 
                : (lang === "en" ? "Override" : "등급 조정하기")}
            </button>
          </div>

          {/* Edit form */}
          {isEditing && (
            <div className="bg-[#12161D] p-3 rounded-xl border border-slate-800/80 space-y-3.5 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">
                  {lang === "en" ? "Select New Grade" : "조정 등급 선택"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 85, label: lang === "en" ? "High Risk" : "고위험", desc: lang === "en" ? "Extremely high attrition likelihood" : "이탈 가능성 매우 높음", activeColor: "border-rose-500 text-rose-400 bg-rose-500/10 ring-1 ring-rose-500/30", inactiveColor: "border-slate-800 hover:border-rose-500/40 text-slate-400 bg-slate-900/30" },
                    { value: 55, label: lang === "en" ? "Risk" : "위험", desc: lang === "en" ? "Requires close attention" : "주의 깊은 관찰 필요", activeColor: "border-amber-500 text-amber-400 bg-amber-500/10 ring-1 ring-amber-500/30", inactiveColor: "border-slate-800 hover:border-amber-500/40 text-slate-400 bg-slate-900/30" },
                    { value: 30, label: lang === "en" ? "Monitor" : "확인 필요", desc: lang === "en" ? "Encourage routine dialogue" : "지속적인 면담 유도", activeColor: "border-emerald-500 text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/30", inactiveColor: "border-slate-800 hover:border-emerald-500/40 text-slate-400 bg-slate-900/30" },
                    { value: 10, label: lang === "en" ? "Optimal" : "양호", desc: lang === "en" ? "Excellent mental stability" : "심리적 안정 우상향", activeColor: "border-blue-500 text-blue-400 bg-blue-500/10 ring-1 ring-blue-500/30", inactiveColor: "border-slate-800 hover:border-blue-500/40 text-slate-400 bg-slate-900/30" }
                  ].map((lvl) => {
                    const isSelected = (lvl.value === 85 && adjustedScore >= 70) ||
                                       (lvl.value === 55 && adjustedScore >= 40 && adjustedScore < 70) ||
                                       (lvl.value === 30 && adjustedScore >= 20 && adjustedScore < 40) ||
                                       (lvl.value === 10 && adjustedScore < 20);
                    
                    return (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => setAdjustedScore(lvl.value)}
                        className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                          isSelected ? lvl.activeColor : lvl.inactiveColor
                        }`}
                      >
                        <span className="text-xs font-bold">{lvl.label}</span>
                        <span className="text-[9px] opacity-70 mt-0.5 leading-snug">{lvl.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[11px] font-bold text-slate-300">
                  {lang === "en" ? "Author Info (Name/Dept)" : "작성자 정보 (이름/소속)"}
                </label>
                <input
                  type="text"
                  value={updaterName}
                  onChange={(e) => setUpdaterName(e.target.value)}
                  placeholder={lang === "en" ? "e.g. Dongyoung Kim (HR)" : "예: 김동영 (인사혁신팀)"}
                  className="w-full bg-[#14181F] text-xs text-white border border-slate-750 rounded p-2 focus:border-teal-400 focus:outline-none placeholder-slate-600 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  {lang === "en" ? "Override Reason" : "변경 사유"}
                </label>
                <textarea
                  rows={2}
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder={lang === "en" ? "e.g. Reduced attrition risk due to in-depth 1on1 and salary alignment" : "예: 1대1 심층 피드백 및 연봉 조정으로 이탈 가능성 감소 반영"}
                  className="w-full bg-[#14181F] text-xs text-slate-200 border border-slate-700/80 rounded p-2 focus:border-teal-400 focus:outline-none placeholder-slate-600 leading-normal"
                />
              </div>

              <button
                onClick={() => {
                  if (onUpdateEmployeeRisk) {
                    onUpdateEmployeeRisk(
                      employee.id, 
                      adjustedScore, 
                      adjustmentReason || (lang === "en" ? "Manual administrator adjustment applied" : "관리자 수동 조정 반영"), 
                      updaterName || (lang === "en" ? "Administrator" : "관리자")
                    );
                    setIsEditing(false);
                    setAdjustmentReason("");
                  }
                }}
                className="w-full bg-teal-500 hover:bg-teal-600 active:translate-y-px text-xs text-slate-950 font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-950/20 transition-all font-sans"
              >
                <Save className="h-4 w-4" />
                {lang === "en" ? "Apply Changes & Save History" : "조정 등급 및 히스토리 반영"}
              </button>
            </div>
          )}

          {/* History list */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5 font-sans">
            {employee.history && employee.history.length > 0 ? (
              employee.history.map((hist, idx) => {
                const getLabelAndColor = (score: number) => {
                  if (score >= 70) return { label: lang === "en" ? "High Risk" : "고위험", color: "text-rose-450 text-rose-400 bg-rose-500/10 border-rose-500/20" };
                  if (score >= 40) return { label: lang === "en" ? "Risk" : "위험", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
                  if (score >= 20) return { label: lang === "en" ? "Monitor" : "확인 필요", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
                  return { label: lang === "en" ? "Optimal" : "양호", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
                };
                const prev = getLabelAndColor(hist.previousScore);
                const next = getLabelAndColor(hist.newScore);

                return (
                  <div key={hist.id || idx} className="p-2.5 bg-[#14181F]/70 border border-slate-800/50 rounded-lg space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        {hist.previousScore === 0 ? (
                          <span className={`text-[9px] font-bold px-1 py-0.5 rounded border ${next.color}`}>
                            {next.label}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 text-[9px] text-slate-400">
                            <span className={`font-bold px-1 py-0.5 rounded border ${prev.color}`}>{prev.label}</span>
                            <ArrowRight className="h-2 w-3 text-slate-600" />
                            <span className={`font-bold px-1 py-0.5 rounded border ${next.color}`}>{next.label}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono shrink-0">{hist.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-350 leading-relaxed font-sans pl-0.5">
                      {hist.reason}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/40 pt-1.5 mt-1 font-sans px-0.5">
                      <span className="text-[9px] text-slate-500">
                        {lang === "en" ? "Author: " : "작성자: "}
                        <span className="text-teal-400 font-semibold">{hist.updaterName || (lang === "en" ? "AI Analysis System" : "AI 분석 시스템")}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-[10px] text-slate-500 italic py-1.5">
                {lang === "en" ? "No history logs." : "변경 이력이 없습니다."}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
