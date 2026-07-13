export default function EmptyState({ title, message, className = "" }) {
  return (
    <div
      className={`flex min-h-0 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-10 text-center dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {message && (
          <p className="mt-2 text-gray-500 dark:text-slate-400">{message}</p>
        )}
      </div>
    </div>
  );
}
