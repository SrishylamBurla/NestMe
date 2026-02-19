"use client";

import Link from "next/link";
import { useRemoveSavedPropertyMutation } from "@/store/services/savedApi";
import { useState } from "react";

export default function SavedPropertyCard({ property }) {

  if (!property) return null;

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
    } catch (err) {
      console.error("Remove failed:", err);
      setOptimisticRemove(false);
    }
  };

  if (optimisticRemove) return null;

  return (
    <div className="group bg-white p-4 rounded-3xl flex gap-4 shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1">

      {/* ================= IMAGE ================= */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-200 shrink-0">

        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url(${
              property.images?.[0]?.url ||
              "/propertyImg/placeholder-property.jpg"
            })`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {property.listingType && (
          <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full shadow">
            {property.listingType === "rent" ? "For Rent" : "For Sale"}
          </span>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 flex flex-col justify-between">

        <div>
          {/* Price + Remove */}
          <div className="flex justify-between items-start">
            <p className="text-xl font-bold text-slate-900">
              ₹{property.priceValue?.toLocaleString()}
              {property.listingType === "rent" && (
                <span className="text-sm font-medium text-slate-500 ml-1">
                  / month
                </span>
              )}
            </p>

            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
            >
              <span
                className="material-symbols-outlined text-red-500"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isLoading ? "hourglass_top" : "favorite"}
              </span>
            </button>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-800 mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
            <span className="material-symbols-outlined text-[16px]">
              location_on
            </span>
            <span className="truncate">
              {property.city}, {property.state}
            </span>
          </div>

          {/* Meta */}
          <div className="flex gap-4 text-xs text-slate-500 mt-3">
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

        {/* CTA */}
        <div className="flex justify-end mt-4">
          <Link href={`/properties/${property._id}`}>
            <button className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition flex items-center justify-center shadow-sm hover:shadow-md">
              <span className="material-symbols-outlined">
                arrow_forward
              </span>
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
