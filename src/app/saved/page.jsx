"use client";

import { useGetSavedPropertiesQuery } from "@/store/services/savedApi";
import SavedPropertyCard from "@/components/saved/SavedPropertyCard";
import SavedSkeleton from "@/components/saved/SavedSkeleton";
import BottomNav from "@/components/BottomNav";

export default function SavedPropertiesPage() {
  const { data, isLoading } = useGetSavedPropertiesQuery();

  const savedProperties = data?.saved || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200">

  <div className="flex items-center gap-4 px-5 py-4">

    {/* Back Button */}
    <button
      onClick={() => window.location.href = "/"}
      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center shadow-sm"
    >
      <span className="material-symbols-outlined text-slate-700">
        arrow_back
      </span>
    </button>

    {/* Title */}
    <div>
      <h1 className="text-xl font-bold text-slate-900">
        Saved Properties
      </h1>
      <p className="text-xs text-slate-500">
        Your favorite listings
      </p>
    </div>

  </div>
</header>


      {/* CONTENT */}
      <main className="px-4 py-6 space-y-4 max-w-4xl mx-auto">

        {/* LOADING */}
        {isLoading && <SavedSkeleton />}

        {/* EMPTY STATE */}
        {!isLoading && savedProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-3 text-slate-300">
              favorite
            </span>
            <p className="text-lg font-medium">
              No saved properties yet
            </p>
            <p className="text-sm mt-1">
              Tap the ❤️ icon to save a property
            </p>
          </div>
        )}

        {/* LIST */}
        {!isLoading &&
          savedProperties.map((item) => (
            
            <SavedPropertyCard
              key={item._id}
              property={item.property}
            />
          ))}

      </main>

      <BottomNav active="saved" />
    </div>
  );
}
