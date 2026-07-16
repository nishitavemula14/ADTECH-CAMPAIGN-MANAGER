import { useState } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  Rectangle,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "../../lib/formatter.js";

const BAR_COLORS = [
  ["#3b82f6", "#22d3ee"],
  ["#f43f5e", "#f472b6"],
  ["#10b981", "#2dd4bf"],
  ["#f59e0b", "#fb923c"],
  ["#8b5cf6", "#6366f1"],
];

export default function BarChart({ data }) {
  const [hoveredCampaign, setHoveredCampaign] = useState(null);
  const chartData = data.map((campaign) => ({
    ...campaign,
    budgetValue: Number(campaign.budget),
  }));
  const maxBudget = Math.max(
    ...chartData.map((campaign) => campaign.budgetValue),
    1
  );

  const yAxisValues = [
    maxBudget,
    Math.round(maxBudget * 0.75),
    Math.round(maxBudget * 0.5),
    Math.round(maxBudget * 0.25),
    0,
  ];

  function renderBarShape(props) {
    const { fill, height, payload, width, x, y } = props;
    const isHovered = hoveredCampaign?.id === payload.id;
    const barWidth = Math.min(width, 56);
    const barX = x + (width - barWidth) / 2;

    return (
      <g>
        {isHovered && (
          <g>
            <rect
              x={barX + barWidth / 2 - 38}
              y={Math.max(y - 32, 0)}
              width="76"
              height="24"
              rx="12"
              fill="currentColor"
              className="text-white drop-shadow-sm dark:text-slate-900"
            />
            <text
              x={barX + barWidth / 2}
              y={Math.max(y - 16, 16)}
              textAnchor="middle"
              className="fill-gray-700 text-xs font-bold dark:fill-slate-200"
            >
              {formatCurrency(payload.budgetValue)}
            </text>
          </g>
        )}
        <Rectangle
          x={barX}
          y={y}
          width={barWidth}
          height={height}
          fill={fill}
          radius={[8, 8, 0, 0]}
          className="drop-shadow-lg transition-all duration-300"
          style={{
            filter: isHovered ? "brightness(1.1)" : undefined,
            transform: isHovered ? "scaleX(1.05)" : undefined,
            transformBox: "fill-box",
            transformOrigin: "center bottom",
          }}
        />
        <rect
          x={x}
          y="0"
          width={width}
          height="100%"
          fill="transparent"
          onMouseEnter={() => setHoveredCampaign(payload)}
          onMouseLeave={() => setHoveredCampaign(null)}
        />
      </g>
    );
  }

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
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  margin={{ top: 32, right: 0, bottom: 0, left: 0 }}
                  barCategoryGap="28%"
                >
                  <defs>
                    {BAR_COLORS.map((color, index) => (
                      <linearGradient
                        key={color.join("-")}
                        id={`bar-gradient-${index}`}
                        x1="0"
                        x2="0"
                        y1="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor={color[0]} />
                        <stop offset="100%" stopColor={color[1]} />
                      </linearGradient>
                    ))}
                  </defs>

                  <Bar
                    dataKey="budgetValue"
                    isAnimationActive={false}
                    maxBarSize={56}
                    minPointSize={6}
                    shape={renderBarShape}
                  >
                    {chartData.map((campaign, index) => (
                      <Cell
                        key={campaign.id}
                        fill={`url(#bar-gradient-${index % BAR_COLORS.length})`}
                      />
                    ))}
                  </Bar>
                  <XAxis dataKey="id" hide />
                  <YAxis domain={[0, maxBudget]} hide />
                </RechartsBarChart>
              </ResponsiveContainer>
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
