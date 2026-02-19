"use client";

export default function SearchHeader({ filters, setFilters, onOpenFilters }) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search city, locality, project"
          value={filters.q}
          onChange={(e) =>
            setFilters({ ...filters, q: e.target.value })
          }
          className="flex-1 h-11 rounded-full border px-4 text-sm focus:ring-2 focus:ring-black"
        />

        {/* MOBILE FILTER BUTTON */}
        <button
          onClick={onOpenFilters}
          className="lg:hidden h-11 px-4 rounded-full border flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          Filters
        </button>
      </div>
    </div>
  );
}
