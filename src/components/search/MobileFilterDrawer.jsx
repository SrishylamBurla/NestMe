export default function MobileFilterDrawer({
  open,
  onClose,
  filters,
  setFilters,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-[90%] max-w-sm bg-white h-full p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Filters</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <FilterSidebar filters={filters} setFilters={setFilters} />

        <button
          onClick={onClose}
          className="w-full h-12 mt-6 bg-black text-white rounded-xl font-bold"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
