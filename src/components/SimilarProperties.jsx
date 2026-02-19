"use client";

import Link from "next/link";

export default function SimilarProperties({ properties = [] }) {
  if (!properties.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Similar Properties</h2>
        <Link
          href="/properties"
          className="text-sm font-semibold text-[#36e27b]"
        >
          View all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory">
        {properties.map((p) => (
          <Link
            key={p._id}
            href={`/properties/${p._id}`}
            className="snap-start"
          >
            <div
              className="
  w-64
  bg-gradient-to-br from-white to-purple-50
  rounded-3xl
  shadow-md
  hover:shadow-2xl
  hover:-translate-y-1
  transition-all
  duration-300
  overflow-hidden
"
            >
              {/* Image */}
              <div
                className="h-36 w-full bg-gray-100 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${
                    p.images?.[0]?.url || "/placeholder-property.jpg"
                  })`,
                }}
              >
                <span className="absolute top-3 left-3 text-[10px] px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                  {p.listingType === "rent" ? "For Rent" : "For Sale"}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 space-y-1">
                <p className="font-semibold truncate">{p.title}</p>

                <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 font-bold">
                  ₹ {p.priceValue?.toLocaleString()}
                </p>

                <p className="text-xs text-gray-500 truncate">
                  {p.city}, {p.state}
                </p>

                <div className="flex gap-3 text-[11px] text-gray-600 pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      bed
                    </span>
                    {p.beds}
                  </span>

                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      bathtub
                    </span>
                    {p.baths}
                  </span>

                  {p.areaSqFt && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        square_foot
                      </span>
                      {p.areaSqFt}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
