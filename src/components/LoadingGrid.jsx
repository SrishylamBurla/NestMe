export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow animate-pulse"
        >
          <div className="h-48 bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}


export function EmptyState() {
  return (
    <div className="bg-white rounded-3xl shadow p-16 text-center border border-slate-200">
      <div className="text-5xl mb-4">🏠</div>
      <h3 className="text-xl font-semibold text-slate-800">
        No Properties Found
      </h3>
      <p className="text-slate-500 mt-2">
        Try adjusting filters or check back later.
      </p>
    </div>
  );
}


export function ErrorState() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-3xl p-16 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-red-700">
        Failed to Load Properties
      </h3>
      <p className="text-red-500 mt-2">
        Please check your connection and try again.
      </p>
    </div>
  );
}

