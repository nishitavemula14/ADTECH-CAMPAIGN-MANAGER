import { useState } from "react";

const BAR_COLORS = [
  "from-blue-500 to-cyan-400",
  "from-rose-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-violet-500 to-indigo-400",
];

function formatCurrency(value) {
  return `\u20B9${Number(value).toLocaleString()}`;
}

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
    <div className="relative w-full rounded-lg bg-slate-50 p-4">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Budget Performance
          </p>
          <p className="text-xs text-gray-500">
            Highest active campaign: {formatCurrency(maxBudget)}
          </p>
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
          Top {data.length}
        </span>
      </div>

      <div className="flex gap-3">
        <div className="flex h-72 flex-col justify-between pr-1 text-right text-xs font-medium text-gray-500">
          {yAxisValues.map((value) => (
            <span key={value}>{formatCurrency(value)}</span>
          ))}
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-0 flex flex-col justify-between">
            {yAxisValues.map((value) => (
              <span key={value} className="border-t border-dashed border-gray-200" />
            ))}
          </div>

          <div className="relative flex h-72 items-end justify-around gap-4 border-b border-l border-gray-300 px-3">
            {data.map((campaign, index) => {
              const budget = Number(campaign.budget);
              const height = Math.max((budget / maxBudget) * 100, 6);
              const color = BAR_COLORS[index % BAR_COLORS.length];

              return (
                <div
                  key={campaign.id}
                  className="group flex h-full min-w-14 flex-1 flex-col items-center justify-end"
                  onMouseEnter={() => setHoveredCampaign(campaign)}
                  onMouseLeave={() => setHoveredCampaign(null)}
                >
                  <p className="mb-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-gray-700 opacity-0 shadow-sm transition group-hover:opacity-100">
                    {formatCurrency(budget)}
                  </p>

                  <div
                    className={`w-full max-w-14 rounded-t-lg bg-gradient-to-t ${color} shadow-lg shadow-blue-100 transition-all duration-300 group-hover:scale-x-110 group-hover:brightness-110`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex justify-around gap-4 px-3">
            {data.map((campaign) => (
              <div
                key={campaign.id}
                className="min-w-14 flex-1 text-center"
              >
                <p className="line-clamp-2 text-xs font-semibold text-gray-700">
                  {campaign.name}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  {campaign.platform}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hoveredCampaign && (
        <div className="absolute right-4 top-20 z-10 w-56 rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-xl">
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
