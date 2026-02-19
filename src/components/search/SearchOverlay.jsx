"use client";

import SearchResultsHeader from "./SearchResultsHeader";
import PropertyResultCard from "./PropertyResultCard";

export default function SearchOverlay({ onClose, properties = [] }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#f6f7f8] overflow-y-auto">
      {/* HEADER */}
      <SearchResultsHeader onClose={onClose} />

      {/* RESULTS */}
      <main className="p-4 space-y-6">
        {properties.map((property) => (
          <PropertyResultCard
            key={property._id}
            property={property}
          />
        ))}
      </main>

      {/* MAP BUTTON */}
      <button className="fixed bottom-6 right-6 flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl active:scale-95">
        <span className="material-symbols-outlined">map</span>
        <span className="text-sm font-bold">View Map</span>
      </button>
    </div>
  );
}
