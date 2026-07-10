import { useState } from "react";

const GROUP_COLORS = {
  "Google Search": "#2563EB",
  "Google Ads": "#2563EB",
  Facebook: "#16A34A",
  Instagram: "#DB2777",
  LinkedIn: "#7C3AED",
  YouTube: "#F97316",
  Twitter: "#0891B2",
  X: "#0F766E",
  All: "#64748B",
  "18-24": "#06B6D4",
  "25-34": "#22C55E",
  "35-44": "#F59E0B",
  "35+": "#EF4444",
  "45+": "#7C3AED",
};

const FALLBACK_COLORS = [
  "#2563EB",
  "#16A34A",
  "#DB2777",
  "#F97316",
  "#7C3AED",
  "#0891B2",
  "#DC2626",
  "#65A30D",
];

function formatCurrency(value) {
  return `\u20B9${Number(value).toLocaleString()}`;
}

function getColor(name, index) {
  return GROUP_COLORS[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export default function BudgetDonutChart({
  data,
  totalBudget,
  groupBy,
  selectedStatus,
  statusOptions,
  onStatusChange,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const groupLabel = groupBy === "ageGroup" ? "Age" : "Platform";
  const detailLabel = groupBy === "ageGroup" ? "Platform" : "Age";

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
        offset: previousOffset,
        percentage,
      },
    ];
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-5 flex w-full justify-center">
        <div className="grid w-full max-w-md grid-cols-3 rounded-lg bg-gray-100 p-1">
          {statusOptions.map((status) => {
            const isActive = selectedStatus === status.value;

            return (
              <button
                key={status.value}
                type="button"
                onClick={() => onStatusChange(status.value)}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative h-56 w-56">
        {data.length > 0 ? (
          <>
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="18"
              />

              {segments.map((item) => {
                const length = item.percentage * circumference;
                const dashOffset = -item.offset * circumference;
                return (
                  <circle
                    key={item.name}
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="18"
                    strokeDasharray={`${length} ${circumference}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onMouseEnter={() =>
                      setHoveredItem({
                        ...item,
                        percentage: item.percentage * 100,
                      })
                    }
                    onMouseLeave={() => setHoveredItem(null)}
                  />
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500">
                {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              </p>
              <h2 className="text-lg font-bold">
                {formatCurrency(totalBudget)}
              </h2>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full border-[18px] border-gray-200">
            <div className="px-4 text-center">
              <p className="text-xs font-medium text-gray-500">
                {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              </p>
              <p className="mt-1 text-sm font-bold text-gray-400">
                No {selectedStatus} data
              </p>
            </div>
          </div>
        )}

        {hoveredItem && (
          <div className="absolute left-1/2 top-1/2 z-10 w-64 -translate-x-1/2 translate-y-6 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg">
            <div className="mb-2 flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: hoveredItem.color }}
              />
              <p
                className="text-sm font-bold"
                style={{ color: hoveredItem.color }}
              >
                {groupLabel}: {hoveredItem.name}
              </p>
            </div>

            <p className="text-sm font-semibold text-emerald-600">
              Budget: {formatCurrency(hoveredItem.budget)}
            </p>
            <p className="text-xs font-medium text-sky-600">
              {hoveredItem.percentage.toFixed(1)}% of total
            </p>

            <div className="mt-2 max-h-28 space-y-1 overflow-auto border-t border-gray-100 pt-2">
              {hoveredItem.campaigns.map((campaign) => (
                <div key={campaign.id} className="text-xs leading-5">
                  <p className="font-semibold text-violet-600">
                    {campaign.name}
                  </p>
                  <p className="text-rose-600">
                    {detailLabel}:{" "}
                    {groupBy === "ageGroup"
                      ? campaign.platform
                      : campaign.ageGroup}
                  </p>
                  <p className="text-emerald-600">
                    Budget: {formatCurrency(campaign.budget)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {segments.length > 0 && (
      <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {segments.map((item) => {
          const percentage =
            totalBudget === 0
              ? 0
              : ((item.budget / totalBudget) * 100).toFixed(0);

          return (
            <div
              key={item.name}
              className="rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-sm font-semibold">{item.name}</p>
              </div>

              <div className="mt-2">
                <p className="text-sm font-bold text-gray-800">
                  {formatCurrency(item.budget)}
                </p>
                <p className="text-xs text-gray-500">
                  {percentage}% of total
                </p>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
