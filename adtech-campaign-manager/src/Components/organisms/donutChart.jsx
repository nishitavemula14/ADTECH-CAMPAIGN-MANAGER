import { useState } from "react";

const GROUP_COLORS = {
  "Google Search": "royalblue",
  "Google Ads": "royalblue",
  Facebook: "forestgreen",
  Instagram: "mediumvioletred",
  LinkedIn: "blueviolet",
  YouTube: "darkorange",
  Twitter: "darkcyan",
  X: "teal",
  All: "slategray",
  "18-24": "darkturquoise",
  "25-34": "limegreen",
  "35-44": "orange",
  "35+": "tomato",
  "45+": "blueviolet",
};

const FALLBACK_COLORS = [
  "royalblue",
  "forestgreen",
  "mediumvioletred",
  "darkorange",
  "blueviolet",
  "darkcyan",
  "firebrick",
  "yellowgreen",
];

const DONUT_GRADIENTS = [
  ["dodgerblue", "mediumturquoise"],
  ["crimson", "hotpink"],
  ["mediumseagreen", "lightseagreen"],
  ["orange", "sandybrown"],
  ["mediumslateblue", "royalblue"],
  ["darkturquoise", "deepskyblue"],
  ["tomato", "firebrick"],
  ["yellowgreen", "olivedrab"],
];

function formatCurrency(value) {
  return `\u20B9${Number(value).toLocaleString()}`;
}

function formatCompactCurrency(value) {
  const amount = Number(value);

  if (amount >= 10000000) {
    return `\u20B9${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `\u20B9${(amount / 100000).toFixed(2)} L`;
  }

  return formatCurrency(amount);
}

function getColor(name, index) {
  return GROUP_COLORS[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

function getGradient(index) {
  return DONUT_GRADIENTS[index % DONUT_GRADIENTS.length];
}

function polarToCartesian(center, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(angleInRadians),
    y: center + radius * Math.sin(angleInRadians),
  };
}

function describeDonutSegment(startAngle, endAngle, outerRadius, innerRadius) {
  const center = 60;
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  const outerStart = polarToCartesian(center, outerRadius, startAngle);
  const outerEnd = polarToCartesian(center, outerRadius, endAngle);
  const innerStart = polarToCartesian(center, innerRadius, startAngle);
  const innerEnd = polarToCartesian(center, innerRadius, endAngle);

  if (endAngle - startAngle >= 359.99) {
    return [
      `M ${center} ${center - outerRadius}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${center} ${center + outerRadius}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${center} ${center - outerRadius}`,
      `M ${center} ${center - innerRadius}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${center} ${center + innerRadius}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${center} ${center - innerRadius}`,
      "Z",
    ].join(" ");
  }

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export default function BudgetDonutChart({
  data,
  totalBudget,
  selectedStatus,
  statusOptions,
  onStatusChange,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const outerRadius = 51;
  const innerRadius = 33;
  const selectedStatusLabel =
    selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1);

  const segments = data.reduce((items, item, index) => {
    const previousOffset =
      items.length === 0
        ? 0
        : items[items.length - 1].offset + items[items.length - 1].percentage;
    const percentage = totalBudget === 0 ? 0 : item.budget / totalBudget;

    return [
      ...items,
      {
        ...item,
        color: getColor(item.name, index),
        gradient: getGradient(index),
        offset: previousOffset,
        percentage,
      },
    ];
  }, []);
  const focusedItem = hoveredItem || null;
  const centerValue = focusedItem
    ? formatCompactCurrency(focusedItem.budget)
    : formatCompactCurrency(totalBudget);
  const centerLabel = focusedItem ? focusedItem.name : selectedStatusLabel;
  const centerSubLabel = focusedItem
    ? `${(focusedItem.percentage * 100).toFixed(1)}% of total`
    : "total budget";
  const tooltipCampaign = hoveredItem?.campaigns?.[0];

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg bg-slate-50 p-3 dark:bg-slate-950 sm:p-4">
      <div className="mb-4 flex w-full shrink-0 justify-center">
        <div className="grid w-full grid-cols-3 rounded-lg bg-gray-100 p-1 dark:bg-slate-800 sm:inline-flex sm:w-auto">
          {statusOptions.map((status) => {
            const isActive = selectedStatus === status.value;

            return (
              <button
                key={status.value}
                type="button"
                onClick={() => onStatusChange(status.value)}
                className={`h-9 rounded-md px-2 text-xs font-semibold transition sm:min-w-24 sm:px-3 sm:text-sm ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-white hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid min-h-0 w-full flex-1 grid-cols-1 gap-4 overflow-visible lg:grid-cols-[minmax(230px,0.78fr)_minmax(0,1fr)]">
        <div className="relative flex min-h-0 items-center justify-center">
          <div className="relative h-44 w-44 shrink-0 sm:h-52 sm:w-52">
            {data.length > 0 ? (
              <>
                <svg
                  viewBox="0 0 120 120"
                  className="h-full w-full"
                >
                  <defs>
                    {segments.map((item, index) => (
                      <linearGradient
                        key={item.name}
                        id={`donut-gradient-${index}`}
                        x1="24"
                        x2="96"
                        y1="24"
                        y2="96"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor={item.gradient[0]} />
                        <stop offset="100%" stopColor={item.gradient[1]} />
                      </linearGradient>
                    ))}
                  </defs>

                  <circle
                    cx="60"
                    cy="60"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="18"
                    className="text-gray-200 dark:text-slate-800"
                  />

                  {segments.map((item, index) => {
                    const startAngle = item.offset * 360;
                    const endAngle = startAngle + item.percentage * 360;
                    const isFocused = focusedItem?.name === item.name;

                    return (
                      <path
                        key={item.name}
                        d={describeDonutSegment(
                          startAngle,
                          endAngle,
                          outerRadius,
                          innerRadius
                        )}
                        fill={`url(#donut-gradient-${index})`}
                        fillRule="evenodd"
                        className={`cursor-pointer drop-shadow-sm transition-all duration-300 dark:drop-shadow-none ${
                          focusedItem && !isFocused
                            ? "opacity-35"
                            : "opacity-100 hover:brightness-110"
                        }`}
                        onMouseEnter={() => setHoveredItem(item)}
                        onMouseLeave={() => setHoveredItem(null)}
                      />
                    );
                  })}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  <p className="max-w-24 truncate text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    {centerLabel}
                  </p>
                  <h2
                    className="mt-1 max-w-28 whitespace-nowrap text-center text-lg font-bold leading-tight sm:text-xl"
                    title={focusedItem ? formatCurrency(focusedItem.budget) : formatCurrency(totalBudget)}
                  >
                    {centerValue}
                  </h2>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-slate-400">
                    {centerSubLabel}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border-[18px] border-gray-200 dark:border-slate-800">
                <div className="px-4 text-center">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                    {selectedStatusLabel}
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-400 dark:text-slate-500">
                    No {selectedStatus} data
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="min-h-0 overflow-hidden">
          {segments.length > 0 ? (
            <div className="flex h-full flex-col justify-center gap-3">
              {segments.map((item) => {
                const percentage =
                  totalBudget === 0
                    ? 0
                    : ((item.budget / totalBudget) * 100).toFixed(1);

                return (
                  <div
                    key={item.name}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                          }}
                        />
                        <p className="truncate text-sm font-semibold text-gray-800 dark:text-slate-200">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-slate-100">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm font-semibold text-gray-400 dark:border-slate-800 dark:text-slate-500">
              No {selectedStatus} campaign values
            </div>
          )}
        </div>
      </div>

      {hoveredItem && tooltipCampaign && (
        <div className="pointer-events-none absolute left-1/2 top-24 z-20 w-56 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:left-[210px] sm:top-28 sm:translate-x-0">
          <p className="truncate font-bold text-violet-600">
            {tooltipCampaign.name}
          </p>
          <p className="mt-1 font-semibold text-emerald-600">
            Budget: {formatCurrency(tooltipCampaign.budget)}
          </p>
          <p className="text-sky-600">
            Platform: {tooltipCampaign.platform}
          </p>
          <p className="text-rose-600">
            Age: {tooltipCampaign.ageGroup}
          </p>

          {hoveredItem.campaigns.length > 1 && (
            <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-slate-400">
              +{hoveredItem.campaigns.length - 1} more campaign
              {hoveredItem.campaigns.length - 1 === 1 ? "" : "s"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
