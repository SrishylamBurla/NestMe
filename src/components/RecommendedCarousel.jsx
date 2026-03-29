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

  <div className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 no-scrollbar">

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
  </div>
</div>

    </section>
  );
}

function PropertyCard({ property }) {
  return (
    <div className="flex flex-col">

      {/* IMAGE */}
      <div className="relative h-48 sm:h-52 lg:h-56 w-full overflow-hidden">
        <Image
          src={property.images?.[0]?.url || "/placeholder.jpg"}
          width={400}
          height={300}
          alt={property.title}
          className="object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
           ₹ {property.priceValue?.toLocaleString()}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-2">
        <h3 className="font-semibold font-sans tracking-tight text-base text-slate-800">
          {property.title}
        </h3>

        <p className="text-sm text-slate-500 font-sans tracking-tight">
          {property.city}, {property.state}
        </p>
      </div>
    </div>
  );
}