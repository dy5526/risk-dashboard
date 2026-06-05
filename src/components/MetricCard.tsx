/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subText: string;
  icon: React.ReactNode;
  colorType: "rose" | "amber" | "emerald" | "cyan" | "indigo" | "teal";
}

export default function MetricCard({
  id,
  title,
  value,
  subText,
  icon,
  colorType
}: MetricCardProps) {
  const colorMap = {
    rose: {
      border: "border-rose-500/20",
      bg: "bg-[#14181F]",
      glow: "shadow-[0_0_20px_rgba(244,63,94,0.03)]",
      text: "text-rose-400",
      iconBg: "bg-rose-500/10 text-rose-400",
      accent: "bg-rose-500"
    },
    amber: {
      border: "border-amber-500/20",
      bg: "bg-[#14181F]",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.03)]",
      text: "text-amber-400",
      iconBg: "bg-amber-500/10 text-amber-400",
      accent: "bg-amber-500"
    },
    emerald: {
      border: "border-emerald-500/20",
      bg: "bg-[#14181F]",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.03)]",
      text: "text-emerald-400",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      accent: "bg-emerald-500"
    },
    cyan: {
      border: "border-cyan-500/20",
      bg: "bg-[#14181F]",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.03)]",
      text: "text-cyan-400",
      iconBg: "bg-cyan-500/10 text-cyan-400",
      accent: "bg-cyan-400"
    },
    indigo: {
      border: "border-indigo-500/20",
      bg: "bg-[#14181F]",
      glow: "shadow-[0_0_20px_rgba(99,102,241,0.03)]",
      text: "text-indigo-400",
      iconBg: "bg-indigo-500/10 text-indigo-400",
      accent: "bg-indigo-500"
    },
    teal: {
      border: "border-teal-500/25",
      bg: "bg-[#14181F]",
      glow: "shadow-[0_0_22px_rgba(20,184,166,0.04)]",
      text: "text-teal-400",
      iconBg: "bg-teal-500/10 text-teal-400",
      accent: "bg-teal-400"
    }
  };

  const scheme = colorMap[colorType];

  return (
    <div
      id={id || `metric-card-${title.replace(/\s+/g, "-").toLowerCase()}`}
      className={`relative overflow-hidden rounded-xl border ${scheme.border} ${scheme.bg} ${scheme.glow} p-6 transition-all duration-300 hover:border-slate-700/60 hover:translate-y-[-2px]`}
    >
      {/* Accent corner line */}
      <div className={`absolute top-0 left-0 h-[3px] w-12 ${scheme.accent}`} />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white lg:text-3xl font-mono">
            {value}
          </h3>
        </div>
        <div className={`rounded-lg p-3 ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>
      
      <p className="mt-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
        {subText}
      </p>
    </div>
  );
}
