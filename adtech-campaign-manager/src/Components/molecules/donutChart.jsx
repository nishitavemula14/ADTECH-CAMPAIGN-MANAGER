const DONUT_COLORS = [
  "#2563EB", // Blue
  "#EF4444", // Red
  "#F59E0B", // Orange
  "#10B981", // Green
  "#8B5CF6", // Purple
];

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString()}`;
}

export default function BudgetDonutChart({ data, totalBudget }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col items-center">

      {/* Donut Chart */}
      <div className="w-52 h-52">

        <svg
          viewBox="0 0 120 120"
          className="-rotate-90"
        >

          {/* Background */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="18"
          />

          {/* Donut Segments */}
          {data.map((item, index) => {

            const percentage =
              totalBudget === 0
                ? 0
                : item.budget / totalBudget;

            const length =
              percentage * circumference;

            const dashOffset =
              -offset * circumference;

            offset += percentage;

            return (
              <circle
                key={item.name}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={
                  DONUT_COLORS[index % DONUT_COLORS.length]
                }
                strokeWidth="18"
                strokeDasharray={`${length} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            );

          })}

        </svg>

      </div>

      {/* Platform Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 w-full">

        {data.map((item, index) => {

          const percentage =
            ((item.budget / totalBudget) * 100).toFixed(0);

          return (

            <div
              key={item.name}
              className="border rounded-xl p-3 shadow-sm bg-white"
            >

              <div className="flex items-center gap-2">

                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      DONUT_COLORS[index % DONUT_COLORS.length],
                  }}
                />

                <p className="font-semibold text-sm">
                  {item.name}
                </p>

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

    </div>
  );
}