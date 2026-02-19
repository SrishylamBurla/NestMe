"use client";

import {
  useGetSavedPropertiesQuery,
  useToggleSavePropertyMutation,
} from "@/store/services/savedApi";
import { useGetMeQuery } from "@/store/services/authApi";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";

export default function PropertyCard({ property }) {
  const router = useRouter();

  const { data: user } = useGetMeQuery();
  const { data: savedData } = useGetSavedPropertiesQuery(undefined, {
    skip: !user,
  });

  const [toggleSave] = useToggleSavePropertyMutation();

  const isSaved = useMemo(() => {
    return savedData?.saved?.some(
      (item) => item.property?._id === property._id,
    );
  }, [savedData, property._id]);

  const handleSave = async (e) => {
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await toggleSave(property._id).unwrap();

      // ✅ Redirect to saved properties page
      // router.push("/saved");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 relative">

  {/* Image Section */}
  <div
    className="h-44 w-full bg-slate-100 bg-cover bg-center relative"
    style={{
      backgroundImage: `url(${
        property.images?.[0]?.url || "/propertyImg/placeholder-property.jpg"
      })`,
    }}
  >
    {property.agent?.verified && (
      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-emerald-600 text-xs font-semibold px-3 py-1 rounded-full shadow">
        ✔ Verified
      </span>
    )}

    {/* Save Button (Now Safe) */}
    <button
      onClick={handleSave}
      className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur rounded-full shadow hover:scale-110 transition-all duration-200"
    >
      <span
        className={`material-symbols-outlined text-[18px] transition-all duration-200 ${
          isSaved ? "text-red-500 scale-110" : "text-slate-500"
        }`}
      >
        favorite
      </span>
    </button>
  </div>

  {/* Wrap clickable area in Link */}
  <Link 
  href={`/properties/${property._id}`}
  className="block p-5 flex flex-col gap-3 bg-white hover:bg-slate-50 transition"
  >
    {/* Price */}
    <p className="text-xl font-bold text-slate-900">
      ₹{property.priceValue?.toLocaleString()}
      {property.listingType === "rent" && (
        <span className="text-sm font-normal text-slate-500 ml-1">
          / month
        </span>
      )}
    </p>

    {/* Title */}
    <h4 className="font-semibold text-slate-800 truncate hover:text-indigo-600 transition-colors duration-200">
      {property.title}
    </h4>

    {/* Location */}
    <div className="flex items-center gap-1 text-sm text-slate-600">
      <span className="material-symbols-outlined text-[16px] text-slate-400">
        location_on
      </span>
      <span className="truncate">
        <span className="text-indigo-600 font-medium">
          {property.city}
        </span>
        , {property.state}
      </span>
    </div>

    {/* Meta */}
    <div className="flex gap-4 text-xs text-slate-500 pt-3 border-t border-slate-200">
      <span className="flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">
          bed
        </span>
        {property.beds} Beds
      </span>

      <span className="flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">
          bathtub
        </span>
        {property.baths} Baths
      </span>

      {property.areaSqFt && (
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">
            square_foot
          </span>
          {property.areaSqFt} ft²
        </span>
      )}
    </div>
  </Link>
</div>

  );
}
