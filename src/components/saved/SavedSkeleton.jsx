export default function SavedSkeleton() {
  return (
    <div className="animate-pulse flex gap-4 p-3 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5">
      <div className="w-28 h-28 bg-gray-200 dark:bg-white/10 rounded-xl" />
      <div className="flex-1 space-y-3 py-2">
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
      </div>
    </div>
  );
}
