// "use client";

// import {
//   useGetSavedPropertiesQuery,
//   useToggleSavePropertyMutation,
// } from "@/store/services/savedApi";

// import { useGetMeQuery } from "@/store/services/authApi";

// import { useRouter } from "next/navigation";

// import { useMemo } from "react";

// import Link from "next/link";

// export default function PropertyCard({ property }) {

//   const router = useRouter();

//   // =========================
//   // USER
//   // =========================

//   const { data } = useGetMeQuery();

//   const user = data?.user;

//   // =========================
//   // SAVED PROPERTIES
//   // =========================

//   const { data: savedData } =
//     useGetSavedPropertiesQuery(
//       undefined,
//       {
//         skip: !user,
//       }
//     );

//   const [toggleSave] =
//     useToggleSavePropertyMutation();

//   const isSaved = useMemo(() => {

//     return savedData?.saved?.some(
//       (item) =>
//         item.property?._id ===
//         property._id
//     );

//   }, [savedData, property._id]);

//   // =========================
//   // SAVE PROPERTY
//   // =========================

//   const handleSave = async (e) => {

//     e.preventDefault();

//     e.stopPropagation();

//     if (!user) {
//       router.push("/login");
//       return;
//     }

//     try {

//       await toggleSave(
//         property._id
//       ).unwrap();

//     } catch (err) {

//       console.error(
//         "Save failed:",
//         err
//       );
//     }
//   };

//   // =========================
//   // LISTING TYPE
//   // =========================

//   const listingLabel =
//     property.listingType === "rent"
//       ? "For Rent"
//       : property.listingType ===
//         "lease"
//         ? "For Lease"
//         : "For Sale";

//   const listingStyle =
//     property.listingType === "rent"
//       ? "bg-indigo-500 text-white"
//       : property.listingType ===
//         "lease"
//         ? "bg-orange-500 text-white"
//         : "bg-emerald-500 text-white";
//   // =========================
//   // IMAGE
//   // =========================

//   const propertyImage =
//     property.images?.[0]?.url ||
//     "/propertyImg/placeholder-property.jpg";

//   return (

//     <Link
//       href={`/properties/${property._id}`}
//       className="
//       group
//       block
//       h-full
//       "
//     >

//       <div
//         className="
//         bg-white
//         rounded-[20px]
//         overflow-hidden
//         shadow-sm
//         hover:shadow-2xl
//         transition-all
//         duration-500
//         flex
//         flex-col
//         h-full
//         hover:-translate-y-1
//         "
//       >

//         {/* ================= IMAGE ================= */}

//         <div
//           className="
//           relative
//           h-56
//           sm:h-60
//           overflow-hidden
//           "
//           style={{
//             backgroundImage: `url(${propertyImage})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >

//           {/* OVERLAY */}
//           <div
//             className="
//             absolute
//             inset-0
//             bg-gradient-to-t
//             from-black/70
//             via-black/10
//             to-transparent
//             "
//           />

//           {/* IMAGE ZOOM */}
//           <div
//             className="
//             absolute
//             inset-0
//             bg-cover
//             bg-center
//             scale-100
//             group-hover:scale-110
//             transition-transform
//             duration-700
//             "
//             style={{
//               backgroundImage: `url(${propertyImage})`,
//             }}
//           />

//           {/* VERIFIED */}
//           {property.agent?.verified && (
//             <div
//               className="
//               absolute
//               top-4
//               left-4
//               z-20
//               px-3
//               py-1.5
//               rounded-full
//               bg-white/90
//               backdrop-blur-md
//               text-emerald-600
//               text-xs
//               font-bold
//               shadow-lg
//               "
//             >
//               ✔ Verified
//             </div>
//           )}

//           {/* LISTING TYPE */}
//           <div
//             className={`
//             absolute
//             bottom-4
//             left-4
//             z-20
//             px-4
//             py-1.5
//             rounded-full
//             text-xs
//             font-bold
//             shadow-lg
//             backdrop-blur-md
//             ${listingStyle}
//             `}
//           >
//             {listingLabel}
//           </div>

//           {/* SAVE BUTTON */}
//           <button
//             onClick={handleSave}
//             className="
//             absolute
//             top-4
//             right-4
//             z-20
//             w-11
//             h-11
//             rounded-full
//             bg-white/90
//             backdrop-blur-md
//             shadow-lg
//             flex
//             items-center
//             justify-center
//             hover:scale-110
//             transition-all
//             duration-300
//             "
//           >
//             <span
//               className={`
//               material-symbols-outlined
//               text-[22px]
//               transition-all
//               duration-300

//               ${isSaved
//                   ? "text-red-500 scale-110"
//                   : "text-slate-700"
//                 }
//               `}
//               style={{
//                 fontVariationSettings:
//                   isSaved
//                     ? "'FILL' 1"
//                     : "'FILL' 0",
//               }}
//             >
//               favorite
//             </span>
//           </button>

//         </div>

//         {/* ================= CONTENT ================= */}

//         <div
//           className="
//           flex
//           flex-col
//           flex-1
//           p-3
//           "
//         >

//           {/* PRICE */}
//           <div className="mb-3">

//             <div className="flex items-end gap-2 flex-wrap">

//               <h3
//                 className="
//                 text-2xl
//                 font-black
//                 text-slate-900
//                 leading-none
//                 "
//               >
//                 ₹
//                 {property.priceLabel}
//               </h3>

//               {(property.listingType ===
//                 "rent" ||
//                 property.listingType ===
//                 "lease") && (
//                   <span
//                     className="
//                   text-sm
//                   text-slate-500
//                   mb-0.5
//                   "
//                   >
//                     {property.listingType ===
//                       "rent"
//                       ? "/ month"
//                       : "/ lease"}
//                   </span>
//                 )}

//             </div>

//           </div>

//           {/* TITLE */}
//           <h2
//             className="
//             text-lg
//             font-bold
//             text-slate-900
//             leading-snug
//             group-hover:text-indigo-600
//             transition-colors
//             line-clamp-1
//             duration-300
//             min-h-[56px]
//             "
//           >
//             {property.title}
//           </h2>

//           {/* LOCATION */}
//           <div
//             className="
//             flex
//             items-center
//             gap-2
//             text-sm
//             text-slate-500
//             mb-2
//             "
//           >

//             <span className="material-symbols-outlined text-[18px] text-indigo-500">
//               location_on
//             </span>

//             <span className="truncate">
//               {property.city},{" "}
//               {property.state}
//             </span>

//           </div>

//           {/* DIVIDER */}
//           <div className="h-px bg-slate-200 my-2" />

//           {/* META */}
//           <div
//             className="
//             flex
//             items-center
//             justify-between
//             gap-3
//             text-sm
//             "
//           >

//             {/* BEDS */}
//             <div
//               className="
//               flex
//               items-center
//               gap-1.5
//               text-slate-600
//               "
//             >
//               <span className="material-symbols-outlined text-[18px]">
//                 bed
//               </span>

//               <span className="font-medium">
//                 {property.beds}
//               </span>
//             </div>

//             {/* BATHS */}
//             <div
//               className="
//               flex
//               items-center
//               gap-1.5
//               text-slate-600
//               "
//             >
//               <span className="material-symbols-outlined text-[18px]">
//                 bathtub
//               </span>

//               <span className="font-medium">
//                 {property.baths}
//               </span>
//             </div>

//             {/* AREA */}
//             {property.areaSqFt && (
//               <div
//                 className="
//                 flex
//                 items-center
//                 gap-1.5
//                 text-slate-600
//                 "
//               >
//                 <span className="material-symbols-outlined text-[18px]">
//                   square_foot
//                 </span>

//                 <span className="font-medium">
//                   {property.areaSqFt}
//                 </span>
//               </div>
//             )}

//           </div>

//         </div>

//       </div>

//     </Link>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  useGetSavedPropertiesQuery,
  useToggleSavePropertyMutation,
} from "@/store/services/savedApi";

import { useGetMeQuery } from "@/store/services/authApi";

export default function PropertyCard({ property }) {
  const router = useRouter();

  const { data } = useGetMeQuery();
  const user = data?.user;

  const { data: savedData } =
    useGetSavedPropertiesQuery(undefined, {
      skip: !user,
    });

  const [toggleSave] =
    useToggleSavePropertyMutation();

  const isSaved = useMemo(() => {
    return savedData?.saved?.some(
      (item) =>
        item.property?._id === property._id
    );
  }, [savedData, property._id]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await toggleSave(
        property._id
      ).unwrap();
    } catch (err) {
      console.error(
        "Save failed:",
        err
      );
    }
  };

  const propertyImage =
    property.images?.[0]?.url ||
    "/propertyImg/placeholder-property.jpg";

  const listingLabel =
    property.listingType === "rent"
      ? "For Rent"
      : property.listingType === "lease"
        ? "For Lease"
        : "For Sale";

  const listingStyle =
    property.listingType === "rent"
      ? "bg-indigo-600"
      : property.listingType === "lease"
        ? "bg-orange-500"
        : "bg-emerald-600";

  const statusLabel =
    property.listingStatus === "sold"
      ? "Sold"
      : property.listingStatus === "rented"
        ? "Rented"
        : "available";

  const statusStyle =
    property.listingStatus === "sold"
      ? "bg-red-500"
      : property.listingStatus === "rented"
        ? "bg-yellow-500"
        : "bg-emerald-500";

  return (
    <Link
      href={`/properties/${property._id}`}
      className="group block h-full"
    >
      <div
        className="
        bg-white
        rounded-[28px]
        overflow-hidden
        h-full
        flex
        flex-col
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)]
        transition-all
        duration-500
        hover:-translate-y-1
      "
      >
        {/* IMAGE */}
        <div className="relative h-56 sm:h-60 overflow-hidden">
          <Image
            src={propertyImage}
            alt={property.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="
              object-cover
              transition-transform
              duration-700
              group-hover:scale-110
            "
          />

          {/* Overlay */}
          <div
            className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/80
            via-black/20
            to-transparent
          "
          />

          {/* Verified */}
          {property.agent?.verified && (
            <div
              className="
              absolute
              top-4
              left-4
              z-20
              bg-white/95
              backdrop-blur-lg
              px-3
              py-1.5
              rounded-full
              text-xs
              font-bold
              text-emerald-600
              shadow-lg
            "
            >
              ✔ Verified
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            className="
            absolute
            top-4
            right-4
            z-20
            w-11
            h-11
            rounded-full
            bg-white/95
            backdrop-blur-lg
            shadow-lg
            flex
            items-center
            justify-center
            hover:scale-110
            transition-all
          "
          >
            <span
              className={`
                material-symbols-outlined
                text-[22px]
                ${
                  isSaved
                    ? "text-red-500"
                    : "text-slate-700"
                }
              `}
              style={{
                fontVariationSettings:
                  isSaved
                    ? "'FILL' 1"
                    : "'FILL' 0",
              }}
            >
              favorite
            </span>
          </button>

          {/* Listing Badge */}
          <div
            className={`
            absolute
            bottom-4
            left-4
            z-20
            px-4
            py-1.5
            rounded-full
            text-white
            text-xs
            font-bold
            shadow-lg
            ${listingStyle}
          `}
          >
            {listingLabel}
          </div>

          {/* Status */}
          <div
            className={`
            absolute
            bottom-4
            right-4
            z-20
            px-3
            py-1.5
            rounded-full
            text-white
            text-xs
            font-bold
            shadow-lg
            ${statusStyle}
          `}
          >
            {statusLabel}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-4">
          {/* PRICE */}
          <div className="mb-3">
            <div className="flex items-end gap-2 flex-wrap">
              <h3
                className="
                text-2xl
                sm:text-3xl
                font-black
                text-slate-900
                leading-none
              "
              >
                ₹ {property.priceLabel}
              </h3>

              {(property.listingType ===
                "rent" ||
                property.listingType ===
                "lease") && (
                <span
                  className="
                  text-sm
                  text-slate-500
                  mb-1
                "
                >
                  {property.listingType ===
                  "rent"
                    ? "/ month"
                    : "/ lease"}
                </span>
              )}
            </div>

            {property.pricePerSqFt && (
              <p
                className="
                text-xs
                text-slate-500
                mt-1
              "
              >
                ₹{property.pricePerSqFt}/sqft
              </p>
            )}
          </div>

          {/* TITLE */}
          <h2
            className="
            text-lg
            font-bold
            text-slate-900
            line-clamp-1
            min-h-[46px]
            group-hover:text-indigo-600
            transition-colors
          "
          >
            {property.title}
          </h2>

          {/* Property Type */}
          <div className="flex gap-2 flex-wrap">
            <span
              className="
              px-2.5
              py-1
              rounded-full
              bg-slate-100
              text-slate-700
              text-xs
              font-medium
            "
            >
              {property.propertyType}
            </span>

            {property.furnishing && (
              <span
                className="
                px-2.5
                py-1
                rounded-full
                bg-indigo-50
                text-indigo-600
                text-xs
                font-medium
              "
              >
                {property.furnishing}
              </span>
            )}
          </div>

          {/* LOCATION */}
          <div
            className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
            mt-3
          "
          >
            <span
              className="
              material-symbols-outlined
              text-indigo-500
              text-[18px]
            "
            >
              location_on
            </span>

            <span className="truncate">
              {property.city},{" "}
              {property.state}
            </span>
          </div>

          <div className="h-px bg-slate-200 my-4" />

          {/* META */}
          <div
            className="
            flex
            justify-between
            items-center
            text-sm
            text-slate-600
          "
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">
                bed
              </span>
              {property.beds}
            </div>

            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">
                bathtub
              </span>
              {property.baths}
            </div>

            {property.areaSqFt && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">
                  square_foot
                </span>
                {property.areaSqFt} ft²
              </div>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}