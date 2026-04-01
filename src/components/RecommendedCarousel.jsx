"use client";

import Link from "next/link";
import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";
import Image from "next/image";

export default function RecommendedCarousel({
  title,
  sortType,
  minPrice,
}) {
  const { data, isLoading } = useGetPropertiesQuery({
    page: 1,
    limit: 10,
    sort: sortType === "views" ? "views" : "latest",
    minPrice,
  });

  if (!data?.properties?.length && !isLoading) return null;

  return (
    <section className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-sans font-bold text-slate-800">
          {title}
        </h2>

        <Link
          href="/properties"
          className="text-sm font-semibold text-black border border-black rounded-md p-1 bg-white hover:underline"
        >
          View All
        </Link>
      </div>

      {/* ================= UNIFIED CAROUSEL (ALL SCREENS) ================= */}
    <div className="relative">

    {/* ================= RESPONSIVE CAROUSEL ================= */}

{/* MOBILE → SCROLL */}
<div className="sm:hidden">
  <div className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 no-scrollbar">

    {isLoading &&
      [...Array(4)].map((_, i) => (
        <div
          key={i}
          className="snap-start min-w-[260px] h-[280px] bg-white rounded-3xl animate-pulse shadow-sm"
        />
      ))}

    {data?.properties?.map((property) => (
      <Link
        key={property._id}
        href={`/properties/${property._id}`}
        className="snap-start min-w-[260px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <PropertyCard property={property} />
      </Link>
    ))}
  </div>
</div>

{/* TABLET + DESKTOP → GRID */}
<div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-5">

  {isLoading &&
    [...Array(4)].map((_, i) => (
      <div
        key={i}
        className="h-[280px] bg-white rounded-3xl animate-pulse shadow-sm"
      />
    ))}

  {data?.properties?.map((property) => (
    <Link
      key={property._id}
      href={`/properties/${property._id}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      <PropertyCard property={property} />
    </Link>
  ))}
</div>

  {/* <div className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 no-scrollbar">

    {isLoading &&
      [...Array(4)].map((_, i) => (
        <div
          key={i}
          className="snap-start min-w-[260px] sm:min-w-[320px] lg:min-w-[360px] h-[280px] bg-white rounded-3xl animate-pulse shadow-sm"
        />
      ))}

    {data?.properties?.map((property) => (
      <Link
        key={property._id}
        href={`/properties/${property._id}`}
        className="snap-start min-w-[260px] sm:min-w-[320px] lg:min-w-[360px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
      >
        <PropertyCard property={property} />
      </Link>
    ))}
  </div> */}

</div>

    </section>
  );
}
function PropertyCard({ property }) {
  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">

      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
        <Image
          src={property.images?.[0]?.url || "/propertyImg/placeholder-property.jpg"}
          fill
          alt={property.title}
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Price Badge */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1 rounded-full font-medium">
          ₹ {property.priceLabel?.toLocaleString()}
        </div>

        {/* Listing Type */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow">
          {property.listingType === "sale" ? "For Sale" : "For Rent"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5 space-y-1.5">
        <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 line-clamp-1">
          {property.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
          {property.city}, {property.state}
        </p>
      </div>
    </div>
  );
}