import { useState } from "react";

import { formatCurrency } from "../../lib/formatter.js";

const BAR_COLORS = [
  "from-blue-500 to-cyan-400",
  "from-rose-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-violet-500 to-indigo-400",
];

export default function BarChart({ data }) {
  const [hoveredCampaign, setHoveredCampaign] = useState(null);
  const maxBudget = Math.max(
    ...data.map((campaign) => Number(campaign.budget)),
    1
  );

  const yAxisValues = [
    maxBudget,
    Math.round(maxBudget * 0.75),
    Math.round(maxBudget * 0.5),
    Math.round(maxBudget * 0.25),
    0,
  ];

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg bg-slate-50 p-3 dark:bg-slate-950 sm:p-4">
      <div className="mb-5 flex shrink-0 items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
            Budget Performance
          </p>
        </div>    
      </div>

      <div className="flex min-h-0 flex-1 gap-2 overflow-hidden sm:gap-3">
        <div className="flex h-full min-h-56 shrink-0 flex-col justify-between pr-1 text-right text-[10px] font-medium text-gray-500 dark:text-slate-400 sm:min-h-48 sm:text-xs">
          {yAxisValues.map((value) => (
            <span key={value}>{formatCurrency(value)}</span>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative min-h-56 flex-1 sm:min-h-48">
            <div className="absolute inset-0 flex flex-col justify-between">
              {yAxisValues.map((value) => (
                <span key={value} className="border-t border-dashed border-gray-200 dark:border-slate-800" />
              ))}
            </div>

            <div className="relative flex h-full items-end justify-around gap-2 border-b border-l border-gray-300 px-2 dark:border-slate-700 sm:gap-4 sm:px-3">
              {data.map((campaign, index) => {
                const budget = Number(campaign.budget);
                const height = Math.max((budget / maxBudget) * 100, 6);
                const color = BAR_COLORS[index % BAR_COLORS.length];

                return (
                  <div
                    key={campaign.id}
                    className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    onMouseEnter={() => setHoveredCampaign(campaign)}
                    onMouseLeave={() => setHoveredCampaign(null)}
                  >
                    <p className="mb-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-gray-700 opacity-0 shadow-sm transition group-hover:opacity-100 dark:bg-slate-900 dark:text-slate-200">
                      {formatCurrency(budget)}
                    </p>

                    <div
                      className={`w-full max-w-14 rounded-t-lg bg-gradient-to-t ${color} shadow-lg shadow-blue-100 transition-all duration-300 group-hover:scale-x-105 group-hover:brightness-110 dark:shadow-none`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="grid shrink-0 gap-2 px-2 pt-3 sm:gap-4 sm:px-3"
            style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
          >
            {data.map((campaign) => (
              <p
                key={campaign.id}
                title={campaign.name}
                className="line-clamp-2 min-w-0 text-center text-[11px] font-semibold leading-tight text-gray-700 dark:text-slate-200 sm:text-xs"
              >
                {campaign.name}
              </p>
            ))}
          </div>
        </div>
      </div>

      {hoveredCampaign && (
        <div className="absolute right-4 top-20 z-10 w-56 rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <p className="font-bold text-violet-600">
            {hoveredCampaign.name}
          </p>
          <p className="mt-1 font-semibold text-emerald-600">
            Budget: {formatCurrency(hoveredCampaign.budget)}
          </p>
          <p className="text-sky-600">
            Platform: {hoveredCampaign.platform}
          </p>
          <p className="text-rose-600">
            Age: {hoveredCampaign.ageGroup}
          </p>
        </div>
      )}
    </div>
  );
}
