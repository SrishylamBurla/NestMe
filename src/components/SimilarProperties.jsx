// "use client";

// import Link from "next/link";

// export default function SimilarProperties({ properties = [] }) {
//   if (!properties.length) return null;

//   return (
//     <section>
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-bold">Similar Properties</h2>
//         <Link
//           href="/properties"
//           className="text-sm text-black border border-2 px-2 py-1 rounded-full cursor-pointer"
//         >
//           View all
//         </Link>
//       </div>

//       <div className="flex gap-4 py-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory">
//         {properties.map((p) => (
//           <Link
//             key={p._id}
//             href={`/properties/${p._id}`}
//             className="snap-start"
//           >
//             <div
//               className="
//   w-64
//   bg-gradient-to-br from-white to-purple-50
//   rounded-3xl
//   shadow-md
//   hover:shadow-2xl
//   hover:-translate-y-1
//   transition-all
//   duration-300
//   overflow-hidden
// "
//             >
//               {/* Image */}
//               <div
//                 className="h-36 w-full bg-gray-100 bg-cover bg-center relative"
//                 style={{
//                   backgroundImage: `url(${
//                     p.images?.[0]?.url || "/propertyImg/placeholder-property.jpg"
//                   })`,
//                 }}
//               >
//                 <span className="absolute top-3 left-3 text-[10px] px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
//                   {p.listingType === "rent" ? "For Rent" : "For Sale"}
//                 </span>
//               </div>

//               {/* Content */}
//               <div className="p-3 space-y-1">
//                 <p className="font-semibold truncate">{p.title}</p>

//                 <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 font-bold">
//                   ₹ {p.priceLabel?.toLocaleString()}
//                 </p>

//                 <p className="text-xs text-gray-500 truncate">
//                   {p.city}, {p.state}
//                 </p>

//                 <div className="flex gap-3 text-[11px] text-gray-600 pt-2 border-t">
//                   <span className="flex items-center gap-1">
//                     <span className="material-symbols-outlined text-[14px]">
//                       bed
//                     </span>
//                     {p.beds}
//                   </span>

//                   <span className="flex items-center gap-1">
//                     <span className="material-symbols-outlined text-[14px]">
//                       bathtub
//                     </span>
//                     {p.baths}
//                   </span>

//                   {p.areaSqFt && (
//                     <span className="flex items-center gap-1">
//                       <span className="material-symbols-outlined text-[14px]">
//                         square_foot
//                       </span>
//                       {p.areaSqFt}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function SimilarProperties({
  properties = [],
}) {
  const scrollRef = useRef(null);

  const [progress, setProgress] = useState(0);

  // 🔥 SMART PROGRESS BAR
  const updateProgress = () => {
    const el = scrollRef.current;

    if (!el) return;

    const scrollWidth =
      el.scrollWidth - el.clientWidth;

    const current = el.scrollLeft;

    const percent =
      (current / scrollWidth) * 100;

    setProgress(percent || 0);
  };

  useEffect(() => {
    updateProgress();
  }, []);

  if (!properties.length) return null;

  return (
    <section className="relative">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div>
          <p className="text-xs uppercase tracking-[4px] text-slate-400 font-semibold">
            Discover More
          </p>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
            Similar Properties
          </h2>
        </div>

        <Link
          href="/properties"
          className="
          px-5
          py-2.5
          rounded-full
          border
          border-slate-300
          bg-white
          hover:bg-slate-100
          transition
          text-sm
          font-semibold
          shadow-sm
          "
        >
          View All
        </Link>
      </div>

      {/* SMART PROGRESS */}
      <div className="mb-5">

        <div className="w-full h-[4px] bg-slate-200 rounded-full overflow-hidden">

          <div
            className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-indigo-500
            via-violet-500
            to-fuchsia-500
            transition-all
            duration-300
            "
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

      </div>

      {/* CARDS */}
      <div
        ref={scrollRef}
        onScroll={updateProgress}
        className="
        flex
        gap-5
        overflow-x-auto
        scrollbar-hide
        snap-x
        snap-mandatory
        pb-3 pt-3
        "
      >
        {properties.map((p) => (
          <Link
            key={p._id}
            href={`/properties/${p._id}`}
            className="
            snap-start
            min-w-[280px]
            sm:min-w-[320px]
            md:min-w-[360px]
            group
            "
          >
            <div
              className="
              relative
              overflow-hidden
              rounded-[32px]
              bg-white
              border
              border-slate-200
              shadow-[0_10px_40px_rgba(15,23,42,0.08)]
              hover:shadow-[0_25px_70px_rgba(15,23,42,0.18)]
              transition-all
              duration-500
              hover:-translate-y-2
              "
            >

              {/* IMAGE */}
              <div className="relative h-[240px] overflow-hidden">

                <Image
                  src={
                    p.images?.[0]?.url ||
                    "/propertyImg/placeholder-property.jpg"
                  }
                  alt={p.title}
                  fill
                  className="
                  object-cover
                  group-hover:scale-110
                  transition-transform
                  duration-700
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-black/70
                  via-black/10
                  to-transparent
                  "
                />

                {/* TYPE */}
                <div
                  className="
                  absolute
                  top-4
                  left-4
                  px-4
                  py-2
                  rounded-full
                  bg-white/15
                  backdrop-blur-xl
                  border
                  border-white/20
                  text-white
                  text-xs
                  font-bold
                  "
                >
                  {p.listingType === "rent"
                    ? "For Rent"
                    : "For Sale"}
                </div>

                {/* PRICE */}
                <div className="absolute bottom-5 left-5 text-white">

                  <p className="text-white/70 text-xs uppercase tracking-[3px]">
                    Starting Price
                  </p>

                  <h3 className="text-3xl font-black mt-1">
                    ₹ {p.priceLabel}
                  </h3>
                </div>

              </div>

              {/* CONTENT */}
              <div className="p-5">

                {/* TITLE */}
                <h3
                  className="
                  text-xl
                  font-black
                  text-slate-900
                  line-clamp-1
                  "
                >
                  {p.title}
                </h3>

                {/* LOCATION */}
                <div className="flex items-center gap-2 mt-2 text-slate-500">

                  <span className="text-sm">
                    📍
                  </span>

                  <p className="text-sm truncate">
                    {p.city}, {p.state}
                  </p>
                </div>

                {/* FEATURES */}
                <div
                  className="
                  grid
                  grid-cols-3
                  gap-3
                  mt-5
                  "
                >

                  <div
                    className="
                    rounded-2xl
                    bg-slate-50
                    border
                    border-slate-100
                    p-3
                    text-center
                    "
                  >
                    <span className="material-symbols-outlined text-[20px] text-slate-700">
                      bed
                    </span>

                    <p className="text-lg font-black text-slate-900">
                      {p.beds || 0}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Beds
                    </p>
                  </div>

                  <div
                    className="
                    rounded-2xl
                    bg-slate-50
                    border
                    border-slate-100
                    p-3
                    text-center
                    "
                  >
                    <span className="material-symbols-outlined text-[20px] text-slate-700">
                      bathtub
                    </span>

                    <p className="text-lg font-black text-slate-900">
                      {p.baths || 0}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Baths
                    </p>
                  </div>

                  <div
                    className="
                    rounded-2xl
                    bg-slate-50
                    border
                    border-slate-100
                    p-3
                    text-center
                    "
                  >
                    <span className="material-symbols-outlined text-[20px] text-slate-700">
                      square_foot
                    </span>

                    <p className="text-lg font-black text-slate-900">
                      {p.areaSqFt || 0}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Sq.ft
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}