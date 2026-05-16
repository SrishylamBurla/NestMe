

"use client";

import Image from "next/image";

export default function PropertyOverview({
  property,
}) {

  return (
    <div className="space-y-8 mt-10">

      {/* ================= HEADER ================= */}

      <div
        className="bg-white rounded-t-2xl shadow-lg border border-slate-200 p-4 sm:p-6"
      >
        {/* TOP */}
        <div className="
flex
flex-col
lg:flex-row
lg:items-start
lg:justify-between
gap-6
">

          {/* LEFT */}
          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-3 mb-4">

              <span
                className="
                px-3 py-1
                rounded-full
                bg-emerald-50
                text-emerald-700
                border border-emerald-100
                text-sm font-semibold
                "
              >
                {property.listingType ===
                  "sale"
                  ? "For Sale"
                  : "For Rent"}
              </span>

              <span
                className="
                px-3 py-1
                rounded-full
                bg-indigo-50
                text-indigo-700
                border border-indigo-100
                text-sm font-semibold
                "
              >
                Verified Property
              </span>

            </div>

            {/* TITLE */}
            <h1
              className="
              text-2xl
              md:text-4xl
              font-black
              text-slate-900
              leading-tight
              "
            >
              {property.title}
            </h1>

            {/* LOCATION */}
            <div className="flex items-center gap-3 mt-5">

              <div
                className="
                w-12 h-12
                rounded-2xl
                bg-slate-100
                flex items-center justify-center
                "
              >
                <Image
                  src="/amenities/location.png"
                  alt="location"
                  width={24}
                  height={24}
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[3px] text-slate-400">
                  Location
                </p>

                <p className="text-lg font-semibold text-slate-700">
                  {property.city},{" "}
                  {property.state}
                </p>
              </div>

            </div>
          </div>

          {/* PRICE */}
          <div
            className="
            min-w-[180px]
            rounded-[28px]
            bg-gradient-to-br
            from-slate-900
            to-slate-800
            text-white
            p-4
            shadow-2xl
            "
          >
            <p className="text-xs uppercase tracking-[3px] text-white/60">
              Starting Price
            </p>

            <h2
              className="
              text-4xl
              md:text-5xl
              font-black
              mt-3
              "
            >
              ₹ {property.priceLabel}
            </h2>

            <div className="mt-5 flex items-center gap-2 text-sm text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />

              Available Now
            </div>
          </div>
        </div>

        {/* ================= PROPERTY FACTS ================= */}

        <div
          className="
          grid
          grid-cols-2
          sm:grid-cols-4
          gap-4
          mt-8
          "
        >
          {/* BEDS */}
          <div
            className="
            rounded-[28px]
            bg-gradient-to-br
            from-slate-50
            to-white
            border border-slate-200
            p-5
            hover:shadow-lg
            transition-all
            duration-300
            "
          >
            <div
              className="
              w-14 h-14
              rounded-2xl
              bg-indigo-100
              flex items-center justify-center
              mb-4
              "
            >
              <span className="material-symbols-outlined text-indigo-700 text-[28px]">
                bed
              </span>
            </div>

            <h3 className="text-3xl font-black text-slate-900">
              {property.beds || 0}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Bedrooms
            </p>
          </div>

          {/* BATHS */}
          <div
            className="
            rounded-[28px]
            bg-gradient-to-br
            from-slate-50
            to-white
            border border-slate-200
            p-5
            hover:shadow-lg
            transition-all
            duration-300
            "
          >
            <div
              className="
              w-14 h-14
              rounded-2xl
              bg-cyan-100
              flex items-center justify-center
              mb-4
              "
            >
              <span className="material-symbols-outlined text-cyan-700 text-[28px]">
                bathtub
              </span>
            </div>

            <h3 className="text-3xl font-black text-slate-900">
              {property.baths || 0}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Bathrooms
            </p>
          </div>

          {/* AREA */}
          <div
            className="
            rounded-[28px]
            bg-gradient-to-br
            from-slate-50
            to-white
            border border-slate-200
            p-5
            hover:shadow-lg
            transition-all
            duration-300
            "
          >
            <div
              className="
              w-14 h-14
              rounded-2xl
              bg-violet-100
              flex items-center justify-center
              mb-4
              "
            >
              <span className="material-symbols-outlined text-violet-700 text-[28px]">
                square_foot
              </span>
            </div>

            <h3 className="text-3xl font-black text-slate-900">
              {property.areaSqFt || 0}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Sq.ft Area
            </p>
          </div>

          {/* PROPERTY TYPE */}
          <div
            className="
            rounded-[28px]
            bg-gradient-to-br
            from-slate-50
            to-white
            border border-slate-200
            p-5
            hover:shadow-lg
            transition-all
            duration-300
            "
          >
            <div
              className="
              w-14 h-14
              rounded-2xl
              bg-emerald-100
              flex items-center justify-center
              mb-4
              "
            >
              <span className="material-symbols-outlined text-emerald-700 text-[28px]">
                apartment
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 capitalize">
              {property.propertyType ||
                "Property"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Property Type
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}