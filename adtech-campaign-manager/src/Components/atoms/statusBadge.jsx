const STATUS_STYLES = {
  active: "border-green-200 bg-green-100 text-green-700",
  paused: "border-yellow-200 bg-yellow-100 text-yellow-700",
  completed: "border-blue-200 bg-blue-100 text-blue-700",
};

function formatStatus(status) {
  const normalizedStatus = String(status).toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
}

export default function StatusBadge({ status, className = "" }) {
  const normalizedStatus = String(status).toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${
        STATUS_STYLES[normalizedStatus] || STATUS_STYLES.active
      } ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
}
