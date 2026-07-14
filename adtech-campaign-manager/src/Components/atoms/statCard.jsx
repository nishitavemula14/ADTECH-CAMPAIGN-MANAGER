export default function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-slate-900 sm:p-5">
      <p className="text-sm text-gray-500 dark:text-slate-400 sm:text-base">
        {label}
      </p>
      <h2 className="mt-2 break-words text-2xl font-bold sm:text-3xl">
        {value}
      </h2>
    </div>
  );
}
