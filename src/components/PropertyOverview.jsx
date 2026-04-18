"use client";

import Image from "next/image";

export default function PropertyOverview({ property }) {
  const price = new Intl.NumberFormat("en-IN").format(
    property.priceValue || 0
  );

  return (
    <div className="space-y-5">

      {/* Title + Location */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          {property.title}
        </h1>

        <p className="text-sm text-slate-500 mt-1 flex items-center gap-3">
          <Image src={"/amenities/location.png"} alt="location" width={35} height={35} />
           {property.city}, {property.state}
        </p>
      </div>

      {/* Key Highlights */}
      <div className="flex flex-wrap gap-3">

        <div className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">
                      bed
                    </span> {property.beds || 0} Beds
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">
                      bathtub
                    </span> {property.baths || 0} Baths
        </div>

        {property.areaSqFt && (
          <div className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">
                        square_foot
                      </span> {property.areaSqFt} sqft
          </div>
        )}

      </div>

      {/* Price + Status */}
      <div className="flex items-end justify-between pt-3 border-t">

        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">
            Price
          </p>

          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            ₹ {property.priceLabel}
          </p>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow">
          {property.listingType === "sale" ? "For Sale" : "For Rent"}
        </span>

      </div>

    </div>
  );
}