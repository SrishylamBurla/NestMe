// "use client";

// import Link from "next/link";
// import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";

// export default function RecommendedCarousel({
//   title,
//   sortType,
//   minPrice,
// }) {
//   const { data, isLoading } = useGetPropertiesQuery({
//     page: 1,
//     limit: 8,
//     sort: sortType === "views" ? "views" : "latest",
//     minPrice,
//   });

//   if (!data?.properties?.length && !isLoading) return null;

//   return (
//     <section className="space-y-3">

//       {/* HEADER */}
//       <div className="flex justify-between items-center px-1">
//         <h2 className="text-lg font-sans font-bold text-slate-800">
//           {title}
//         </h2>

//         <Link
//           href="/properties"
//           className="text-sm font-semibold text-indigo-600 hover:underline"
//         >
//           View All
//         </Link>
//       </div>

//       {/* ================= MOBILE CAROUSEL ================= */}
//       <div className="sm:hidden relative -mx-5 px-5">

//         {/* Gradient edges for premium feel */}
//         <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent z-10" />
//         <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent z-10" />

//         <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x-mandatory scroll-smooth pb-2">

//           {isLoading &&
//             [...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="min-w-[260px] h-[260px] bg-white rounded-2xl animate-pulse"
//               />
//             ))}

//           {data?.properties?.map((property) => (
//             <Link
//               key={property._id}
//               href={`/properties/${property._id}`}
//               className="snap-start min-w-[260px] bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
//             >
//               <PropertyCard property={property} />
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* ================= DESKTOP GRID ================= */}
//       <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {isLoading &&
//           [...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className="h-[280px] bg-white rounded-2xl animate-pulse"
//             />
//           ))}

//         {data?.properties?.map((property) => (
//           <Link
//             key={property._id}
//             href={`/properties/${property._id}`}
//             className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
//           >
//             <PropertyCard property={property} />
//           </Link>
//         ))}
//       </div>

//     </section>
//   );
// }

// /* ================= CARD ================= */

// function PropertyCard({ property }) {
//   return (
//     <div className="flex flex-col">

//       {/* IMAGE */}
//       <div className="relative h-44 w-full overflow-hidden">
//         <img
//           src={property.images?.[0]?.url || "/placeholder.jpg"}
//           alt={property.title}
//           className="h-full w-full object-cover hover:scale-105 transition duration-500"
//         />

//         {/* Price Badge */}
//         <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
//           ₹ {property.priceValue?.toLocaleString()}
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="p-4 space-y-2">
//         <h3 className="font-semibold text-sm line-clamp-2 text-slate-800">
//           {property.title}
//         </h3>

//         <p className="text-xs text-gray-500">
//           {property.city}
//         </p>
//       </div>

//     </div>
//   );
// }



"use client";

import Link from "next/link";
import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";

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
        <h2 className="text-lg font-sans font-bold text-slate-900">
          {title}
        </h2>

        <Link
          href="/properties"
          className="text-sm font-semibold text-indigo-600 hover:underline"
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
        className="snap-start min-w-[260px] sm:min-w-[320px] lg:min-w-[360px] bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
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
        <img
          src={property.images?.[0]?.url || "/placeholder.jpg"}
          alt={property.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
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