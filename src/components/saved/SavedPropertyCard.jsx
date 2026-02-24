"use client";

import Link from "next/link";
import { useRemoveSavedPropertyMutation } from "@/store/services/savedApi";
import { useState } from "react";

export default function SavedPropertyCard({ property }) {
  if (!property) {
    return (
      <div className="bg-red-50 p-4 rounded-xl text-sm text-red-600">
        This property is no longer available.
      </div>
    );
  }

  const [removeSavedProperty, { isLoading }] =
    useRemoveSavedPropertyMutation();

  const [optimisticRemove, setOptimisticRemove] = useState(false);

  const handleRemove = async () => {
    try {
      setOptimisticRemove(true);
      await removeSavedProperty(property._id).unwrap();
    } catch {
      setOptimisticRemove(false);
    }
  };

  if (optimisticRemove) return null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 flex gap-3 sm:gap-4 shadow-sm hover:shadow-md transition">

      {/* ================= IMAGE ================= */}
      <Link
        href={`/properties/${property._id}`}
        className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0"
      >
        <img
          src={
            property.images?.[0]?.url ||
            "/propertyImg/placeholder-property.jpg"
          }
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {property.listingType && (
          <span className="absolute bottom-2 left-2 bg-white/90 text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow">
            {property.listingType === "rent" ? "Rent" : "Sale"}
          </span>
        )}
      </Link>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">

        {/* Top Section */}
        <div className="space-y-1">

          <div className="flex justify-between items-start gap-2">
            <p className="text-base sm:text-lg font-bold text-slate-900 truncate">
              ₹{property.priceValue?.toLocaleString()}
              {property.listingType === "rent" && (
                <span className="text-xs text-slate-500 ml-1">/mo</span>
              )}
            </p>

            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="p-1.5 rounded-full hover:bg-red-50 transition disabled:opacity-50"
            >
              <span
                className="material-symbols-outlined text-red-500 text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isLoading ? "hourglass_top" : "favorite"}
              </span>
            </button>
          </div>

          <Link href={`/properties/${property._id}`}>
            <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition">
              {property.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-slate-500 truncate">
            {property.city}, {property.state}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-500 mt-2">
          {property.beds && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                bed
              </span>
              {property.beds}
            </span>
          )}

          {property.baths && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                bathtub
              </span>
              {property.baths}
            </span>
          )}

          {property.areaSqFt && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                square_foot
              </span>
              {property.areaSqFt} ft²
            </span>
          )}
        </div>
      </div>
    </div>
  );
}