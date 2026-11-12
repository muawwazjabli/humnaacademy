"use client";

import React from "react";

export interface ChartPoint {
  label: string;
  value: number;
}

interface BarChartCardProps {
  title: string;
  subtitle: string;
  data: ChartPoint[];
  accentColor?: string;
}

export const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  subtitle,
  data,
  accentColor = "from-brand-deep to-brand-emerald",
}) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 p-5 shadow-sm flex flex-col justify-between space-y-4">
      <div>
        <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>

      {data.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-emerald-900/40 rounded-xl">
          No records available yet
        </div>
      ) : (
        <div className="h-44 flex items-end gap-3 pt-4 pb-1 px-1">
          {data.map((point) => {
            const pct = Math.max(Math.round((point.value / max) * 100), 8);
            return (
              <div key={point.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[11px] font-bold text-gray-700 dark:text-brand-gold opacity-90">
                  {point.value}
                </span>
                <div className="w-full max-w-[42px] bg-gray-100 dark:bg-emerald-950/60 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg bg-gradient-to-t ${accentColor} transition-all duration-500`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate max-w-full">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface HorizontalBreakdownCardProps {
  title: string;
  subtitle: string;
  data: ChartPoint[];
}

export const HorizontalBreakdownCard: React.FC<HorizontalBreakdownCardProps> = ({
  title,
  subtitle,
  data,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>

      {data.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-emerald-900/40 rounded-xl">
          No records available yet
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const widthPct = Math.max(Math.round((item.value / max) * 100), 6);
            const sharePct = Math.round((item.value / total) * 100);
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate pr-2">
                    {item.label}
                  </span>
                  <span className="font-bold text-brand-emerald dark:text-brand-gold shrink-0">
                    {item.value} ({sharePct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-emerald-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-emerald to-brand-gold rounded-full transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
