// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   useGetPropertyByIdQuery,
//   useUpdatePropertyMutation,
// } from "@/store/services/PropertiesApi";
// import dynamic from "next/dynamic";
// import NextImage from "next/image";

// const AMENITIES = ["pool", "gym", "parking", "security", "garden", "lift"];
// const FACING_OPTIONS = ["East", "West", "North", "South"];

// const MapPicker = dynamic(
//   () => import("@/components/MapPicker"),
//   {
//     ssr: false,
//   }
// );

// export default function UserEditPropertyPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const { data, isLoading } = useGetPropertyByIdQuery(id);
//   const [updateProperty, { isLoading: saving }] = useUpdatePropertyMutation();

//   // const [listingType, setListingType] = useState("sale");
//   const [form, setForm] = useState(null);
//   const [imageFiles, setImageFiles] = useState([]);

//   const listingType = form?.listingType || "sale";

//   useEffect(() => {
//     if (!data) return;
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setForm((prev) => {
//       // ✅ prevent repeated updates
//       if (prev && prev.title === data.title) return prev;

//       const p = data;

//       return {
//         title: p.title || "",
//         description: p.description || "",
//         propertyType: p.propertyType || "apartment",
//         priceLabel: p.priceLabel || "",
//         priceValue: p.priceValue || "",
//         pricePerSqFt: p.pricePerSqFt || "",
//         beds: p.beds || 2,
//         baths: p.baths || 2,
//         areaSqFt: p.areaSqFt || "",
//         furnishing: p.furnishing || "semi",
//         facing: p.facing || "",
//         address: p.address || "",
//         city: p.city || "",
//         state: p.state || "",
//         lat: p.location?.lat || "",
//         lng: p.location?.lng || "",
//         amenities: p.amenities || [],
//         images:
//           p.images?.length
//             ? p.images.map((img) =>
//               typeof img === "string"
//                 ? img
//                 : img.url
//             )
//             : [""],
//         listingType: p.listingType || "sale",
//       };
//     });
//   }, [data]);

//   if (isLoading || !form) return <p className="p-4">Loading property...</p>;

//   const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

//   const toggleAmenity = (amenity) => {
//     setForm((prev) => ({
//       ...prev,
//       amenities: prev.amenities.includes(amenity)
//         ? prev.amenities.filter((a) => a !== amenity)
//         : [...prev.amenities, amenity],
//     }));
//   };

//   const submitHandler = async () => {
//     const payload = {
//       ...form,
//       listingType: form.listingType,
//       priceValue: Number(form.priceValue),
//       approvalStatus: "pending",      // 🔥 back to review
//       listingStatus: "sold",         // not live yet
//       rejectionReason: "",            // clear old reason
//       location: {
//         lat: form.lat ? Number(form.lat) : null,
//         lng: form.lng ? Number(form.lng) : null,
//       },
//       images: form.images
//         .filter(Boolean)
//         .map((img) =>
//           typeof img === "string"
//             ? { url: img }
//             : img
//         ),
//     };

//     await updateProperty({ id, ...payload }).unwrap();
//     alert("Property updated and sent for admin approval");
//     router.push("/my-properties");
//   };

//   return (
//     <div className="min-h-screen bg-[#f6f8f7] flex justify-center">
//       <div className="w-full max-w-[1100px] flex flex-col">

//         {/* HEADER */}
//         <div className="sticky top-0 z-50 bg-white border-b">
//           <div className="h-16 px-4 flex items-center justify-between">
//             <button onClick={() => router.back()}>✕</button>
//             <h2 className="font-bold">Edit Property</h2>
//             <button onClick={submitHandler} disabled={saving}>
//               {saving ? "Saving..." : "Update"}
//             </button>
//           </div>
//         </div>

//         <div className="flex flex-1">
//           <div className="flex-1 overflow-y-auto">
//             <div className="max-w-[720px] mx-auto pb-24">

//               {/* LISTING TYPE */}
//               <div className="p-4">
//                 <div className="flex bg-gray-200 rounded-xl p-1">
//                   {["sale", "rent", "lease"].map((t) => (
//                     <button
//                       key={t}
//                       onClick={() => update("listingType", t)}
//                       className={`flex-1 py-2 rounded-lg font-bold ${listingType === t ? "bg-white shadow" : "text-gray-500"
//                         }`}
//                     >
//                       {t === "sale" ? "For Sale" : t === "rent" ? "For Rent" : "For Lease"}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* BASIC INFO */}
//               <Section title="Basic Information">
//                 <Input label="Title *" value={form.title} onChange={(e) => update("title", e.target.value)} />
//                 <Input label="Price Label" value={form.priceLabel} onChange={(e) => update("priceLabel", e.target.value)} />
//                 <Input label="Price Value *" type="number" value={form.priceValue} onChange={(e) => update("priceValue", e.target.value)} />
//                 <Input label="Price / Sq.ft" value={form.pricePerSqFt} onChange={(e) => update("pricePerSqFt", e.target.value)} />
//                 <Select label="Property Type" value={form.propertyType} options={["apartment", "villa", "plot", "office"]} onChange={(e) => update("propertyType", e.target.value)} />
//               </Section>

//               {/* DETAILS */}
//               <Section title="Property Details">
//                 <Counter label="Bedrooms" value={form.beds} onChange={(v) => update("beds", v)} />
//                 <Counter label="Bathrooms" value={form.baths} onChange={(v) => update("baths", v)} />
//                 <Input label="Area (sq.ft)" type="number" value={form.areaSqFt} onChange={(e) => update("areaSqFt", e.target.value)} />
//                 <Select label="Furnishing" value={form.furnishing} options={["none", "semi", "full"]} onChange={(e) => update("furnishing", e.target.value)} />
//                 <Select label="Facing" value={form.facing} options={["", ...FACING_OPTIONS]} onChange={(e) => update("facing", e.target.value)} />
//               </Section>

//               {/* LOCATION */}
//               <Section title="Location">
//                 <Input label="Address" value={form.address} onChange={(e) => update("address", e.target.value)} />
//                 <Input label="City *" value={form.city} onChange={(e) => update("city", e.target.value)} />
//                 <Input label="State *" value={form.state} onChange={(e) => update("state", e.target.value)} />
//                 <div
//                   className="
//   mt-4
//   rounded-[28px]
//   border
//   border-slate-200
//   bg-white
//   p-5
//   shadow-sm
//   space-y-5
//   "
//                 >

//                   <div>
//                     <p className="text-xs uppercase tracking-[3px] text-slate-400 font-semibold">
//                       Property Location
//                     </p>

//                     <h3 className="text-2xl font-black text-slate-900 mt-1">
//                       Update Property Location
//                     </h3>

//                     <p className="text-sm text-slate-500 mt-2">
//                       Tap on map to update exact property location.
//                     </p>
//                   </div>

//                   <MapPicker
//                     initialPosition={{
//                       lat: Number(form.lat) || 17.385,
//                       lng: Number(form.lng) || 78.4867,
//                     }}
//                     onSelect={({ lat, lng }) => {
//                       update("lat", lat);
//                       update("lng", lng);
//                     }}
//                   />

//                   <div className="grid grid-cols-2 gap-4">

//                     <div className="bg-slate-100 rounded-2xl p-4">
//                       <p className="text-xs text-slate-500">
//                         Latitude
//                       </p>

//                       <p className="font-bold mt-1">
//                         {form.lat || "--"}
//                       </p>
//                     </div>

//                     <div className="bg-slate-100 rounded-2xl p-4">
//                       <p className="text-xs text-slate-500">
//                         Longitude
//                       </p>

//                       <p className="font-bold mt-1">
//                         {form.lng || "--"}
//                       </p>
//                     </div>

//                   </div>

//                 </div>
//               </Section>

//               {/* AMENITIES */}
//               <Section title="Amenities">
//                 <div className="flex flex-wrap gap-2">
//                   {AMENITIES.map((a) => (
//                     <button key={a} onClick={() => toggleAmenity(a)}
//                       className={`px-4 py-2 rounded-full border font-bold ${form.amenities.includes(a) ? "bg-black text-white" : "bg-white"
//                         }`}>
//                       {a}
//                     </button>
//                   ))}
//                 </div>
//               </Section>

//               {/* DESCRIPTION */}
//               <Section title="Description">
//                 <textarea className="w-full border rounded-xl p-4 min-h-[120px]"
//                   value={form.description}
//                   onChange={(e) => update("description", e.target.value)}
//                 />
//               </Section>

//               {/* IMAGES */}
//               {/* <Section title="Property Images">
//                 {form.images.map((img, i) => (
//                   <Input key={i} label={`Image URL ${i + 1}`} value={img}
//                     onChange={(e) => {
//                       const arr = [...form.images];
//                       arr[i] = e.target.value;
//                       update("images", arr);
//                     }}
//                   />
//                 ))}
//                 <button type="button" onClick={() => update("images", [...form.images, ""])}
//                   className="text-sm text-blue-600 font-semibold">
//                   + Add Another Image
//                 </button>
//               </Section> */}

//               <Section title="Property Images">

//                 {/* HEADER */}
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <p className="text-lg font-black text-slate-900">
//                       Property Gallery
//                     </p>

//                     <p className="text-sm text-slate-500">
//                       Upload high quality property images
//                     </p>
//                   </div>

//                   <label className="cursor-pointer">
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       hidden
//                       onChange={(e) => {
//                         const files = Array.from(e.target.files);

//                         setImageFiles((prev) => [
//                           ...prev,
//                           ...files,
//                         ]);
//                       }}
//                     />

//                     <div
//                       className="
//         h-11
//         px-5
//         rounded-2xl
//         bg-black
//         text-white
//         flex
//         items-center
//         justify-center
//         text-sm
//         font-bold
//         shadow-lg
//         hover:scale-105
//         transition
//         "
//                     >
//                       + Add Images
//                     </div>
//                   </label>
//                 </div>

//                 {/* EMPTY STATE */}
//                 {imageFiles.length === 0 && (
//                   <label
//                     className="
//       border-2
//       border-dashed
//       border-slate-300
//       rounded-[30px]
//       h-[240px]
//       flex
//       flex-col
//       items-center
//       justify-center
//       text-center
//       cursor-pointer
//       hover:bg-slate-50
//       transition
//       "
//                   >
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       hidden
//                       onChange={(e) => {
//                         const files = Array.from(e.target.files);

//                         setImageFiles(files);
//                       }}
//                     />

//                     <div className="space-y-4">
//                       <div
//                         className="
//           w-20
//           h-20
//           rounded-full
//           bg-slate-100
//           flex
//           items-center
//           justify-center
//           mx-auto
//           "
//                       >
//                         <span className="material-symbols-outlined text-5xl text-slate-400">
//                           imagesmode
//                         </span>
//                       </div>

//                       <div>
//                         <p className="font-bold text-slate-900 text-lg">
//                           Upload Property Images
//                         </p>

//                         <p className="text-sm text-slate-500 mt-1">
//                           JPG, PNG, WEBP supported
//                         </p>
//                       </div>
//                     </div>
//                   </label>
//                 )}

//                 {/* IMAGE GRID */}

//                 {imageFiles.length > 0 && (
//                   <div
//                     className="
//       grid
//       grid-cols-2
//       sm:grid-cols-3
//       lg:grid-cols-4
//       gap-4
//       "
//                   >
//                     {imageFiles.map((file, index) => (
//                       <div
//                         key={index}
//                         className="
//           relative
//           group
//           rounded-[28px]
//           overflow-hidden
//           bg-slate-100
//           aspect-square
//           shadow-sm
//           "
//                       >

//                         {/* IMAGE */}
//                         <NextImage
//                           src={
//                             file instanceof File
//                               ? URL.createObjectURL(file)
//                               : typeof file === "string"
//                                 ? file
//                                 : file?.url
//                           }
//                           alt="property"
//                           fill
//                           unoptimized
//                           className="
//     object-cover
//     group-hover:scale-110
//     transition-all
//     duration-500
//   "
//                         />

//                         {/* OVERLAY */}
//                         <div
//                           className="
//             absolute
//             inset-0
//             bg-black/10
//             opacity-0
//             group-hover:opacity-100
//             transition
//             "
//                         />

//                         {/* PRIMARY BADGE */}
//                         {index === 0 && (
//                           <div
//                             className="
//               absolute
//               top-3
//               left-3
//               px-3
//               py-1
//               rounded-full
//               bg-white
//               text-black
//               text-[11px]
//               font-bold
//               shadow
//               "
//                           >
//                             Cover
//                           </div>
//                         )}

//                         {/* ACTIONS */}
//                         <div
//                           className="
//             absolute
//             top-3
//             right-3
//             flex
//             gap-2
//             "
//                         >

//                           {/* REPLACE */}
//                           <label
//                             className="
//               w-9
//               h-9
//               rounded-full
//               bg-white/95
//               flex
//               items-center
//               justify-center
//               cursor-pointer
//               shadow
//               "
//                           >
//                             <input
//                               type="file"
//                               accept="image/*"
//                               hidden
//                               onChange={(e) => {
//                                 const newFile =
//                                   e.target.files?.[0];

//                                 if (!newFile) return;

//                                 setImageFiles((prev) =>
//                                   prev.map((img, i) =>
//                                     i === index
//                                       ? newFile
//                                       : img
//                                   )
//                                 );
//                               }}
//                             />

//                             <span className="material-symbols-outlined text-[18px]">
//                               edit
//                             </span>
//                           </label>

//                           {/* DELETE */}
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setImageFiles((prev) =>
//                                 prev.filter(
//                                   (_, i) => i !== index
//                                 )
//                               );
//                             }}
//                             className="
//               w-9
//               h-9
//               rounded-full
//               bg-red-500
//               text-white
//               flex
//               items-center
//               justify-center
//               shadow
//               "
//                           >
//                             <span className="material-symbols-outlined text-[18px]">
//                               delete
//                             </span>
//                           </button>
//                         </div>

//                       </div>
//                     ))}
//                   </div>
//                 )}

//               </Section>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// function Section({ title, children }) {
//   return (
//     <div className="px-4 py-4 space-y-4">
//       <h3 className="font-bold text-lg">{title}</h3>
//       {children}
//     </div>
//   );
// }

// function Input({ label, ...props }) {
//   return (
//     <div className="space-y-1">
//       <label className="text-sm font-semibold">{label}</label>
//       <input {...props} className="w-full h-12 border rounded-lg px-4" />
//     </div>
//   );
// }

// function Select({ label, options, ...props }) {
//   return (
//     <div className="space-y-1">
//       <label className="text-sm font-semibold">{label}</label>
//       <select {...props} className="w-full h-12 border rounded-lg px-4">
//         {options.map((o) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// function Counter({ label, value, onChange }) {
//   return (
//     <div className="flex justify-between items-center border-b py-2">
//       <span className="font-semibold">{label}</span>
//       <div className="flex gap-4">
//         <button type="button" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
//         <span className="font-bold">{value}</span>
//         <button type="button" onClick={() => onChange(value + 1)}>+</button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import dynamic from "next/dynamic";

import NextImage from "next/image";

import {
  useGetPropertyByIdQuery,
  useUpdatePropertyMutation,
} from "@/store/services/PropertiesApi";

const MapPicker = dynamic(
  () => import("@/components/MapPicker"),
  {
    ssr: false,
  }
);

const PROPERTY_TYPES = [
  "apartment",
  "villa",
  "plot",
  "independent_house",
  "commercial",
];

const LISTING_TYPES = [
  "sale",
  "rent",
  "lease",
];

const FURNISHING_OPTIONS = [
  "full",
  "semi",
  "unfurnished",
];

const FACING_OPTIONS = [
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];

const AMENITIES = [
  "wifi",
  "parking",
  "gym",
  "pool",
  "lift",
  "power_backup",
  "security",
  "garden",
  "ac",
  "furnished",
];

function Section({
  title,
  subtitle,
  children,
}) {
  return (
    <div
      className="
      bg-white
      rounded-[32px]
      border
      border-slate-200
      shadow-sm
      p-5
      md:p-7
      space-y-5
      "
    >
      <div>
        <h2 className="text-2xl font-black text-slate-900">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-slate-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

export default function EditPropertyPage() {
  const { id } = useParams();

  const router = useRouter();

  const { data, isLoading } =
    useGetPropertyByIdQuery(id);

  const [updateProperty, { isLoading: updating }] =
    useUpdatePropertyMutation();

  const [imageFiles, setImageFiles] =
    useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",

    propertyType: "apartment",
    listingType: "sale",

    priceLabel: "",
    priceValue: "",
    pricePerSqFt: "",

    beds: 2,
    baths: 2,
    areaSqFt: "",

    furnishing: "semi",
    facing: "",

    address: "",
    city: "",
    state: "",

    lat: "",
    lng: "",

    amenities: [],
  });

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    if (!data) return;

    const p = data;

    setForm({
      title: p.title || "",
      description: p.description || "",

      propertyType:
        p.propertyType || "apartment",

      listingType:
        p.listingType || "sale",

      priceLabel: p.priceLabel || "",
      priceValue: p.priceValue || "",
      pricePerSqFt:
        p.pricePerSqFt || "",

      beds: p.beds || 2,
      baths: p.baths || 2,

      areaSqFt: p.areaSqFt || "",

      furnishing:
        p.furnishing || "semi",

      facing: p.facing || "",

      address: p.address || "",
      city: p.city || "",
      state: p.state || "",

      lat: p.location?.lat || "",
      lng: p.location?.lng || "",

      amenities: p.amenities || [],
    });

    // ✅ EXISTING IMAGES
    setImageFiles(p.images || []);

  }, [data]);

  // =========================
  // UPDATE FORM
  // =========================

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================
  // TOGGLE AMENITY
  // =========================

  const toggleAmenity = (
    amenity
  ) => {
    setForm((prev) => ({
      ...prev,

      amenities:
        prev.amenities.includes(
          amenity
        )
          ? prev.amenities.filter(
            (a) =>
              a !== amenity
          )
          : [
            ...prev.amenities,
            amenity,
          ],
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      const formData = new FormData();

      // =========================
      // BASIC FIELDS
      // =========================

      Object.entries(form).forEach(
        ([key, value]) => {

          if (key === "amenities") {
            value.forEach((a) => {
              formData.append(
                "amenities[]",
                a
              );
            });

            return;
          }

          formData.append(
            key,
            value
          );
        }
      );

      // =========================
      // LOCATION
      // =========================

      formData.append(
        "lat",
        form.lat
      );

      formData.append(
        "lng",
        form.lng
      );

      // =========================
      // IMAGES
      // =========================

      imageFiles.forEach((img) => {

        // ✅ NEW IMAGE
        if (img instanceof File) {

          formData.append(
            "images",
            img
          );

        } else {

          // ✅ OLD IMAGE
          formData.append(
            "images",
            JSON.stringify(img)
          );
        }
      });

      // =========================
      // API
      // =========================

      await updateProperty({
        id,
        data: formData,
      }).unwrap();

      alert(
        "Property updated successfully"
      );

      router.push(
        "/my-properties"
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to update property"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] py-8 px-4">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <p className="text-xs uppercase tracking-[4px] text-slate-400 font-semibold">
            NestMe Property Editor
          </p>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">
            Edit Property
          </h1>
        </div>

        <form
          onSubmit={submitHandler}
          className="space-y-6"
        >

          {/* BASIC INFO */}
          <Section
            title="Basic Information"
            subtitle="Update your property details"
          >

            <div className="grid md:grid-cols-2 gap-5">

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Property Title
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    update(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Luxury Villa in Hyderabad"
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Property Type
                </label>

                <select
                  value={
                    form.propertyType
                  }
                  onChange={(e) =>
                    update(
                      "propertyType",
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none"
                >
                  {PROPERTY_TYPES.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type.replace(
                          "_",
                          " "
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Description
              </label>

              <textarea
                rows={6}
                value={
                  form.description
                }
                onChange={(e) =>
                  update(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Describe your property..."
                className="w-full rounded-2xl border border-slate-200 p-5 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

          </Section>

          {/* IMAGES */}
          <Section
            title="Property Images"
            subtitle="Manage your gallery"
          >

            {/* HEADER */}
            <div className="flex items-center justify-between">

              <div>
                <p className="font-black text-xl">
                  Property Gallery
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Upload high quality images
                </p>
              </div>

              <label className="cursor-pointer">

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={(e) => {

                    const files =
                      Array.from(
                        e.target.files
                      );

                    setImageFiles(
                      (prev) => [
                        ...prev,
                        ...files,
                      ]
                    );
                  }}
                />

                <div
                  className="
                  h-11
                  px-5
                  rounded-2xl
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                  text-sm
                  font-bold
                  hover:scale-105
                  transition
                  "
                >
                  + Add Images
                </div>

              </label>

            </div>

            {/* EMPTY */}
            {imageFiles.length ===
              0 && (
                <div
                  className="
                border-2
                border-dashed
                border-slate-300
                rounded-[30px]
                h-[220px]
                flex
                items-center
                justify-center
                "
                >
                  <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300">
                      imagesmode
                    </span>

                    <p className="font-bold text-slate-900 mt-3">
                      No Images Added
                    </p>
                  </div>
                </div>
              )}

            {/* GRID */}
            {imageFiles.length >
              0 && (
                <div
                  className="
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                gap-4
                "
                >
                  {imageFiles.map(
                    (
                      file,
                      index
                    ) => {

                      const imageSrc =
                        file instanceof
                          File
                          ? URL.createObjectURL(
                            file
                          )
                          : typeof file ===
                            "string"
                            ? file
                            : file?.url;

                      return (
                        <div
                          key={
                            index
                          }
                          className="
                        relative
                        group
                        rounded-[28px]
                        overflow-hidden
                        bg-slate-100
                        aspect-square
                        shadow-sm
                        "
                        >

                          {/* IMAGE */}
                          <NextImage
                            src={
                              imageSrc
                            }
                            alt="property"
                            fill
                            unoptimized
                            className="
                          object-cover
                          group-hover:scale-110
                          transition-all
                          duration-500
                          "
                          />

                          {/* OVERLAY */}
                          <div
                            className="
                          absolute
                          inset-0
                          bg-black/10
                          opacity-0
                          group-hover:opacity-100
                          transition
                          "
                          />

                          {/* COVER */}
                          {index ===
                            0 && (
                              <div
                                className="
                            absolute
                            top-3
                            left-3
                            px-3
                            py-1
                            rounded-full
                            bg-white
                            text-black
                            text-[11px]
                            font-bold
                            "
                              >
                                Cover
                              </div>
                            )}

                          {/* ACTIONS */}
                          <div
                            className="
                          absolute
                          top-3
                          right-3
                          flex
                          gap-2
                          "
                          >

                            {/* REPLACE */}
                            <label
                              className="
                            w-9
                            h-9
                            rounded-full
                            bg-white
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                            "
                            >

                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(
                                  e
                                ) => {

                                  const newFile =
                                    e
                                      .target
                                      .files?.[0];

                                  if (
                                    !newFile
                                  )
                                    return;

                                  setImageFiles(
                                    (
                                      prev
                                    ) =>
                                      prev.map(
                                        (
                                          img,
                                          i
                                        ) =>
                                          i ===
                                            index
                                            ? newFile
                                            : img
                                      )
                                  );
                                }}
                              />

                              <span className="material-symbols-outlined text-[18px]">
                                edit
                              </span>

                            </label>

                            {/* DELETE */}
                            <button
                              type="button"
                              onClick={() => {
                                setImageFiles(
                                  (
                                    prev
                                  ) =>
                                    prev.filter(
                                      (
                                        _,
                                        i
                                      ) =>
                                        i !==
                                        index
                                    )
                                );
                              }}
                              className="
                            w-9
                            h-9
                            rounded-full
                            bg-red-500
                            text-white
                            flex
                            items-center
                            justify-center
                            "
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}
                </div>
              )}

          </Section>

          {/* PRICING */}
          <Section
            title="Pricing & Specs"
            subtitle="Property pricing and dimensions"
          >

            <div className="grid md:grid-cols-3 gap-5">

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Price Label
                </label>

                <input
                  value={
                    form.priceLabel
                  }
                  onChange={(e) =>
                    update(
                      "priceLabel",
                      e.target.value
                    )
                  }
                  placeholder="1.5 Cr"
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Price Value
                </label>

                <input
                  type="number"
                  value={
                    form.priceValue
                  }
                  onChange={(e) =>
                    update(
                      "priceValue",
                      e.target.value
                    )
                  }
                  placeholder="15000000"
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Price/SqFt
                </label>

                <input
                  value={
                    form.pricePerSqFt
                  }
                  onChange={(e) =>
                    update(
                      "pricePerSqFt",
                      e.target.value
                    )
                  }
                  placeholder="8400"
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

            </div>

            <div className="grid md:grid-cols-4 gap-5">

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Beds
                </label>

                <input
                  type="number"
                  value={form.beds}
                  onChange={(e) =>
                    update(
                      "beds",
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Baths
                </label>

                <input
                  type="number"
                  value={
                    form.baths
                  }
                  onChange={(e) =>
                    update(
                      "baths",
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Area SqFt
                </label>

                <input
                  type="number"
                  value={
                    form.areaSqFt
                  }
                  onChange={(e) =>
                    update(
                      "areaSqFt",
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Listing Type
                </label>

                <select
                  value={
                    form.listingType
                  }
                  onChange={(e) =>
                    update(
                      "listingType",
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                >
                  {LISTING_TYPES.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type === "sale"
                          ? "For Sale"
                          : type === "rent"
                            ? "For Rent"
                            : "For Lease"}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

          </Section>

          {/* LOCATION */}
          <Section
            title="Property Location"
            subtitle="Pin exact property location"
          >

            <MapPicker
              initialPosition={{
                lat:
                  Number(
                    form.lat
                  ) || 17.385,

                lng:
                  Number(
                    form.lng
                  ) || 78.4867,
              }}
              onSelect={({
                lat,
                lng,
              }) => {
                update(
                  "lat",
                  lat
                );

                update(
                  "lng",
                  lng
                );
              }}
            />

            <div className="grid md:grid-cols-3 gap-5">

              <input
                value={
                  form.address
                }
                onChange={(e) =>
                  update(
                    "address",
                    e.target.value
                  )
                }
                placeholder="Address"
                className="w-full h-14 rounded-2xl border border-slate-200 px-5"
              />

              <input
                value={form.city}
                onChange={(e) =>
                  update(
                    "city",
                    e.target.value
                  )
                }
                placeholder="City"
                className="w-full h-14 rounded-2xl border border-slate-200 px-5"
              />

              <input
                value={form.state}
                onChange={(e) =>
                  update(
                    "state",
                    e.target.value
                  )
                }
                placeholder="State"
                className="w-full h-14 rounded-2xl border border-slate-200 px-5"
              />

            </div>

          </Section>

          {/* EXTRA */}
          <Section
            title="Additional Details"
            subtitle="Property preferences and amenities"
          >

            <div className="grid md:grid-cols-2 gap-5">

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Furnishing
                </label>

                <select
                  value={
                    form.furnishing
                  }
                  onChange={(e) =>
                    update(
                      "furnishing",
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                >
                  {FURNISHING_OPTIONS.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Facing
                </label>

                <select
                  value={
                    form.facing
                  }
                  onChange={(e) =>
                    update(
                      "facing",
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                >
                  {FACING_OPTIONS.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

            {/* AMENITIES */}
            <div className="space-y-3">

              <p className="font-semibold">
                Amenities
              </p>

              <div className="flex flex-wrap gap-3">

                {AMENITIES.map(
                  (amenity) => {

                    const active =
                      form.amenities.includes(
                        amenity
                      );

                    return (
                      <button
                        key={
                          amenity
                        }
                        type="button"
                        onClick={() =>
                          toggleAmenity(
                            amenity
                          )
                        }
                        className={`
                        px-4
                        py-2
                        rounded-2xl
                        text-sm
                        font-semibold
                        transition

                        ${active
                            ? "bg-black text-white"
                            : "bg-slate-100 text-slate-700"
                          }
                        `}
                      >
                        {amenity.replace(
                          "_",
                          " "
                        )}
                      </button>
                    );
                  }
                )}

              </div>

            </div>

          </Section>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pb-10">

            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="
              h-12
              px-6
              rounded-2xl
              border
              border-slate-300
              font-semibold
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="
              h-12
              px-8
              rounded-2xl
              bg-black
              text-white
              font-bold
              shadow-lg
              hover:scale-105
              transition
              "
            >
              {updating
                ? "Updating..."
                : "Update Property"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}