// "use client";

// import { useRef } from "react";
// import Link from "next/link";
// import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function RecommendedCarousel({ title, sortType, minPrice }) {
//   const { data, isLoading } = useGetPropertiesQuery({
//     page: 1,
//     limit: 10,
//     sort: sortType === "views" ? "views" : "latest",
//     minPrice,
//   });

//   const carouselRef = useRef();
//   if (!data?.properties?.length && !isLoading) return null;

//   return (
//     <section className="space-y-4">
//       {/* HEADER */}
//       <div className="flex justify-between items-center px-1">
//         <h2 className="text-lg font-bold text-slate-800">{title}</h2>

//         <Link
//           href="/properties"
//           className="text-sm font-semibold text-black border border-black rounded-md p-1 bg-white hover:underline"
//         >
//           View All
//         </Link>
//       </div>

//       {/* ================= UNIFIED CAROUSEL (ALL SCREENS) ================= */}
//       <div className="relative">
//         {/* ================= RESPONSIVE CAROUSEL ================= */}

//         {/* MOBILE → SCROLL */}
//         <div className="sm:hidden">
//           <div className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 no-scrollbar">
//             {isLoading &&
//               [...Array(4)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="snap-start min-w-[260px] h-[280px] bg-white rounded-3xl animate-pulse shadow-sm"
//                 />
//               ))}

//             {data?.properties?.map((property) => (
//               <Link
//                 key={property._id}
//                 href={`/properties/${property._id}`}
//                 className="snap-start min-w-[260px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
//               >
//                 <PropertyCard property={property} />
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* TABLET + DESKTOP → GRID */}

//         {/* ================= UNIFIED CAROUSEL (ALL SCREENS) ================= */}
//         <div className="relative">
//           {/* NAV BUTTONS */}
//           <button
//             onClick={() => {
//               carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
//             }}
//             className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-10 h-10 items-center justify-center hover:bg-gray-100"
//           >
//             <ChevronLeft size={20} strokeWidth={1.5} />
//           </button>

//           <button
//             onClick={() => {
//               carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
//             }}
//             className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-10 h-10 items-center justify-center hover:bg-gray-100"
//           >
//             <ChevronRight size={20} strokeWidth={1.5} />
//           </button>

//           {/* CAROUSEL */}
//           <div
//             ref={carouselRef}
//             className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 no-scrollbar"
//           >
//             {isLoading &&
//               [...Array(4)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="snap-start min-w-[260px] sm:min-w-[300px] md:min-w-[320px] lg:min-w-[360px] h-[280px] bg-white rounded-3xl animate-pulse shadow-sm"
//                 />
//               ))}

//             {data?.properties?.map((property) => (
//               <Link
//                 key={property._id}
//                 href={`/properties/${property._id}`}
//                 className="snap-start min-w-[260px] sm:min-w-[300px] md:min-w-[320px] lg:min-w-[360px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
//               >
//                 <PropertyCard property={property} />
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* <div className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 no-scrollbar">

//     {isLoading &&
//       [...Array(4)].map((_, i) => (
//         <div
//           key={i}
//           className="snap-start min-w-[260px] sm:min-w-[320px] lg:min-w-[360px] h-[280px] bg-white rounded-3xl animate-pulse shadow-sm"
//         />
//       ))}

//     {data?.properties?.map((property) => (
//       <Link
//         key={property._id}
//         href={`/properties/${property._id}`}
//         className="snap-start min-w-[260px] sm:min-w-[320px] lg:min-w-[360px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
//       >
//         <PropertyCard property={property} />
//       </Link>
//     ))}
//   </div> */}
//       </div>
//     </section>
//   );
// }
// function PropertyCard({ property }) {
//   return (
//     <div className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
//       {/* IMAGE */}
//       <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
//         <Image
//           src={
//             property.images?.[0]?.url || "/propertyImg/placeholder-property.jpg"
//           }
//           fill
//           alt={property.title}
//           className="object-cover transition duration-700 group-hover:scale-105"
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//         />

//         {/* Gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

//         {/* Price Badge */}
//         <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1 rounded-full font-medium">
//           ₹ {property.priceLabel?.toLocaleString()}
//         </div>

//         {/* Listing Type */}
//         <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow">
//           {property.listingType === "sale" ? "For Sale" : "For Rent"}
//         </span>
//       </div>

//       {/* CONTENT */}
//       <div className="p-4 sm:p-5 space-y-1.5">
//         <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 line-clamp-1">
//           {property.title}
//         </h3>

//         <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
//           {property.city}, {property.state}
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RecommendedCarousel({ title, sortType, minPrice }) {
  const { data, isLoading } = useGetPropertiesQuery({
    page: 1,
    limit: 10,
    sort: sortType === "views" ? "views" : "latest",
    minPrice,
  });

  const carouselRef = useRef(null);

  if (!data?.properties?.length && !isLoading) return null;

  return (
    <section className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>

        <Link
          href="/properties"
          className="text-sm font-semibold text-black border border-black rounded-md p-1 bg-white hover:underline"
        >
          View All
        </Link>
      </div>

      {/* CAROUSEL */}
      <div className="relative">
        {/* NAV BUTTONS */}
        <button
          onClick={() =>
            carouselRef.current.scrollBy({ left: -300, behavior: "smooth" })
          }
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md shadow-md rounded-full w-10 h-10 items-center justify-center hover:bg-white transition"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <button
          onClick={() =>
            carouselRef.current.scrollBy({ left: 300, behavior: "smooth" })
          }
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md shadow-md rounded-full w-10 h-10 items-center justify-center hover:bg-white transition"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={carouselRef}
          className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 no-scrollbar"
        >
          {isLoading &&
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="snap-start flex-shrink-0 w-[260px] sm:w-[320px] lg:w-[360px] h-[280px] bg-white rounded-3xl animate-pulse shadow-sm"
              />
            ))}

          {data?.properties?.map((property) => (
            <Link
              key={property._id}
              href={`/properties/${property._id}`}
              className="snap-start flex-shrink-0 w-[260px] sm:w-[320px] lg:w-[360px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1 rounded-full font-medium">
          ₹ {property.priceLabel?.toLocaleString()}
        </div>

        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow">
          {property.listingType === "sale" ? "For Sale" : "For Rent"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="px-5 py-2 space-y-1">
        <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 line-clamp-1">
          {property.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
          {property.city}, {property.state}
        </p>
      </div>

      <div className="flex gap-4 text-xs justify-between text-slate-500 px-5 py-2 border-t border-slate-200">
      <span className="flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px] font-sans">
          bed
        </span>
        {property.beds} Beds
      </span>

      <span className="flex items-center gap-1 font-sans">
        <span className="material-symbols-outlined text-[14px] font-sans">
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
    </div>
  );
}

// function PropertyCard({ property }) {
//   return (
//     <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

//       {/* IMAGE */}
//       <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
//         <Image
//           src={property.images?.[0]?.url || "/propertyImg/placeholder-property.jpg"}
//           fill
//           alt={property.title}
//           className="object-cover transition duration-700 group-hover:scale-105"
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//         />

//         {/* Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

//         {/* Price */}
//         <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
//           ₹ {property.priceLabel?.toLocaleString()}
//         </div>

//         {/* Listing Type */}
//         <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow">
//           {property.listingType === "sale" ? "For Sale" : "For Rent"}
//         </span>
//       </div>

//       {/* CONTENT */}
//       <div className="p-4 sm:p-5 space-y-2">

//         {/* Title */}
//         <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-slate-800 line-clamp-1 group-hover:text-black transition">
//           {property.title}
//         </h3>

//         {/* Location */}
//         <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
//           📍 {property.city}, {property.state}
//         </p>

//         {/* EXTRA INFO (optional fields) */}
//         <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600 pt-1">
//           {property.beds && <span>🛏 {property.beds} Beds</span>}
//           {property.baths && <span>🛁 {property.baths} Baths</span>}
//           {property.areaSqFt && <span>📐 {property.areaSqFt} sqft</span>}
//         </div>
//       </div>
//     </div>
//   );
// }