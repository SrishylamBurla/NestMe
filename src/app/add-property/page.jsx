"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddPropertyMutation } from "@/store/services/PropertiesApi";
// import MapPicker from "@/components/MapPicker";

const AMENITIES = ["pool", "gym", "parking", "security", "garden", "lift"];
const FACING_OPTIONS = ["East", "West", "North", "South"];

export default function AddPropertyPage() {
  const router = useRouter();
  const [addProperty, { isLoading }] = useAddPropertyMutation();

  const [listingType, setListingType] = useState("sale");
  const [imageFiles, setImageFiles] = useState([])

  const [form, setForm] = useState({
    title: "",
    description: "",

    propertyType: "apartment",

    priceLabel: "",
    priceValue: "",
    pricePerSqFt: "",

    beds: 2,
    baths: 2,
    areaSqFt: "",

    furnishing: "semi",
    facing: "",

    address: "",
    city: "Bangalore",
    state: "Karnataka",

    lat: "",
    lng: "",

    listingStatus: "available",

    amenities: [],
    images: [""],
  });

  /* ------------------ */
  /* HELPERS */
  /* ------------------ */

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  /* ------------------ */
  /* SUBMIT */
  /* ------------------ */

  // const submitHandler = async () => {
  //   if (!form.title || !form.priceValue || !form.city) {
  //     alert("Title, Price and City are required");
  //     return;
  //   }

  //   const payload = {
  //     title: form.title.trim(),
  //     description: form.description.trim(),

  //     listingType,
  //     propertyType: form.propertyType,
  //     status: form.status, // ✅

  //     priceLabel: form.priceLabel || undefined,
  //     priceValue: Number(form.priceValue),
  //     pricePerSqFt: form.pricePerSqFt || undefined,

  //     city: form.city,
  //     state: form.state,
  //     address: form.address || undefined,

  //     location: {
  //       lat: form.lat ? Number(form.lat) : null,
  //       lng: form.lng ? Number(form.lng) : null,
  //     }, // ✅ PROPER FORMAT

  //     beds: Number(form.beds),
  //     baths: Number(form.baths),
  //     areaSqFt: Number(form.areaSqFt) || undefined,

  //     furnishing: form.furnishing,
  //     facing: form.facing || undefined,

  //     amenities: form.amenities,
  //     images: form.images.filter(Boolean), // remove empty inputs
  //   };

  //   try {
  //     await addProperty(payload).unwrap();
  //     router.push("/");
  //   } catch (err) {
  //     console.error("ADD PROPERTY FAILED", err);
  //     alert(err?.data?.message || "Failed to create property");
  //   }
  // };

  const submitHandler = async () => {
  if (!form.title || !form.priceValue || !form.city) {
    alert("Title, Price and City are required");
    return;
  }

  const formData = new FormData();

  // Text fields
  Object.keys(form).forEach((key) => {
    if (key === "amenities") {
      form.amenities.forEach((a) =>
        formData.append("amenities[]", a)
      );
    } else {
      formData.append(key, form[key]);
    }
  });

  formData.append("listingType", listingType);

  // Append Images
  imageFiles.forEach((file) => {
    formData.append("images", file);
  });

  try {
    await addProperty(formData).unwrap();
    router.push("/");
  } catch (err) {
    console.error("ADD PROPERTY FAILED", err);
    alert(err?.data?.message || "Failed to create property");
  }
};


  /* UI */

  return (
    <div className="min-h-screen bg-[#f6f8f7] flex justify-center">
      <div className="w-full max-w-[1100px] flex flex-col">
        {/* HEADER */}
        <div className="sticky top-0 z-50 bg-white border-b">
          <div className="h-16 px-4 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="size-10 rounded-full hover:bg-gray-200"
            >
              ✕
            </button>

            <h2 className="font-bold">Add Property</h2>

            <button
              onClick={submitHandler}
              disabled={isLoading}
              className="font-bold text-black disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="flex flex-1">
          {/* FORM */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[720px] mx-auto pb-24">
              {/* LISTING TYPE */}
              <div className="p-4">
                <div className="flex bg-gray-200 rounded-xl p-1">
                  {["sale", "rent"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setListingType(t)}
                      className={`flex-1 py-2 rounded-lg font-bold ${
                        listingType === t ? "bg-white shadow" : "text-gray-500"
                      }`}
                    >
                      {t === "sale" ? "For Sale" : "For Rent"}
                    </button>
                  ))}
                </div>
              </div>

              {/* BASIC INFO */}
              <Section title="Basic Information">
                <Input
                  label="Title *"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
                <Input
                  label="Price Label"
                  placeholder="₹ 1.5 Cr"
                  value={form.priceLabel}
                  onChange={(e) => update("priceLabel", e.target.value)}
                />
                <Input
                  label="Price Value *"
                  type="number"
                  value={form.priceValue}
                  onChange={(e) => update("priceValue", e.target.value)}
                />
                <Input
                  label="Price / Sq.ft"
                  placeholder="₹ 8,500 / sq.ft"
                  value={form.pricePerSqFt}
                  onChange={(e) => update("pricePerSqFt", e.target.value)}
                />

                <Select
                  label="Property Type"
                  value={form.propertyType}
                  options={["apartment", "villa", "plot", "commercial"]}
                  onChange={(e) => update("propertyType", e.target.value)}
                />
                <Select
                  label="Property Status"
                  value={form.status}
                  options={["active", "sold", "pending"]}
                  onChange={(e) => update("status", e.target.value)}
                />
              </Section>

              {/* DETAILS */}
              <Section title="Property Details">
                <Counter
                  label="Bedrooms"
                  value={form.beds}
                  onChange={(v) => update("beds", v)}
                />
                <Counter
                  label="Bathrooms"
                  value={form.baths}
                  onChange={(v) => update("baths", v)}
                />
                <Input
                  label="Area (sq.ft)"
                  type="number"
                  value={form.areaSqFt}
                  onChange={(e) => update("areaSqFt", e.target.value)}
                />

                <Select
                  label="Furnishing"
                  value={form.furnishing}
                  options={["none", "semi", "full"]}
                  onChange={(e) => update("furnishing", e.target.value)}
                />

                <Select
                  label="Facing"
                  value={form.facing}
                  options={["", ...FACING_OPTIONS]}
                  onChange={(e) => update("facing", e.target.value)}
                />
              </Section>

              {/* LOCATION */}
              <Section title="Location">
                <Input
                  label="Address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
                <Input
                  label="City *"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
                <Input
                  label="State *"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Latitude"
                    placeholder="17.3850"
                    value={form.lat}
                    onChange={(e) => update("lat", e.target.value)}
                  />
                  <Input
                    label="Longitude"
                    placeholder="78.4867"
                    value={form.lng}
                    onChange={(e) => update("lng", e.target.value)}
                  />
                </div>
              </Section>

              {/* <Section title="Pin Location">
                <MapPicker
                  onSelect={({ lat, lng }) => {
                    update("lat", lat);
                    update("lng", lng);
                  }}
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input label="Latitude" value={form.lat} readOnly />
                  <Input label="Longitude" value={form.lng} readOnly />
                </div>
              </Section> */}

              {/* AMENITIES */}
              <Section title="Amenities">
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((a) => (
                    <button
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      className={`px-4 py-2 rounded-full border font-bold ${
                        form.amenities.includes(a)
                          ? "bg-black text-white"
                          : "bg-white"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </Section>

              {/* DESCRIPTION */}
              <Section title="Description">
                <textarea
                  className="w-full border rounded-xl p-4 min-h-[120px]"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </Section>
              <Section title="Property Images">

  {/* Upload Button */}
  <label className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition">
    <div className="text-center">
      <span className="material-symbols-outlined text-4xl text-gray-400">
        add_photo_alternate
      </span>
      <p className="text-sm text-gray-500 mt-2">
        Click to upload images
      </p>
    </div>

    <input
      type="file"
      multiple
      accept="image/*"
      hidden
      onChange={(e) => {
        const files = Array.from(e.target.files);
        setImageFiles((prev) => [...prev, ...files]);
      }}
    />
  </label>

  {/* Preview Images */}
  {imageFiles.length > 0 && (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {imageFiles.map((file, index) => (
        <div key={index} className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="h-28 w-full object-cover rounded-lg"
          />

          <button
            type="button"
            onClick={() =>
              setImageFiles((prev) =>
                prev.filter((_, i) => i !== index)
              )
            }
            className="absolute top-1 right-1 bg-black text-white rounded-full px-2 text-xs"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}

</Section>

            </div>
          </div>

          {/* PREVIEW */}
          <div className="hidden lg:block w-[360px] border-l bg-white">
            <div className="sticky top-16 p-6 space-y-3">
              <h3 className="font-bold">Preview</h3>
              <div className="border rounded-xl p-4">
                <p className="font-semibold">
                  {form.title || "Property Title"}
                </p>
                <p className="text-sm text-gray-500">{form.city}</p>
                <p className="font-bold">{form.priceLabel || "₹0"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SAVE */}
        <div className="lg:hidden sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={submitHandler}
            className="w-full h-12 bg-black text-white rounded-xl font-bold"
          >
            Save Property
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------ */
/* UI HELPERS */
/* ------------------ */

function Section({ title, children }) {
  return (
    <div className="px-4 py-4 space-y-4">
      <h3 className="font-bold text-lg">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold">{label}</label>
      <input {...props} className="w-full h-12 border rounded-lg px-4" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold">{label}</label>
      <select {...props} className="w-full h-12 border rounded-lg px-4">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Counter({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <span className="font-semibold">{label}</span>
      <div className="flex gap-4">
        <button onClick={() => onChange(Math.max(0, value - 1))}>−</button>
        <span className="font-bold">{value}</span>
        <button onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAddPropertyMutation } from "@/store/services/PropertiesApi";

// const PROPERTY_TYPES = ["apartment", "villa", "plot", "office"];
// const AMENITIES = [
//   "Power Backup",
//   "24/7 Water",
//   "Lift",
//   "Gymnasium",
//   "Swimming Pool",
//   "Vastu Compliant",
//   "Security",
// ];

// export default function AddPropertyPage() {
//   const router = useRouter();
//   const [addProperty, { isLoading }] = useAddPropertyMutation();

//   const [form, setForm] = useState({
//     title: "",
//     priceValue: "",
//     propertyType: "apartment",
//     beds: 2,
//     baths: 2,
//     areaSqFt: "",
//     address: "",
//     city: "",
//     state: "",
//     lat: "",
//     lng: "",
//     description: "",
//     amenities: [],
//     images: [],
//     status: "active",
//   });

//   const update = (key, value) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   const toggleAmenity = (a) =>
//     setForm((prev) => ({
//       ...prev,
//       amenities: prev.amenities.includes(a)
//         ? prev.amenities.filter((x) => x !== a)
//         : [...prev.amenities, a],
//     }));

//   const submitHandler = async () => {
//     if (!form.title || !form.priceValue || !form.city) {
//       return alert("Title, Price & City required");
//     }

//     const payload = {
//       title: form.title,
//       propertyType: form.propertyType,
//       priceValue: Number(form.priceValue),
//       city: form.city,
//       state: form.state,
//       address: form.address,
//       beds: form.beds,
//       baths: form.baths,
//       areaSqFt: Number(form.areaSqFt),
//       description: form.description,
//       status: form.status,
//       amenities: form.amenities,
//       images: form.images,
//       location: {
//         lat: form.lat ? Number(form.lat) : null,
//         lng: form.lng ? Number(form.lng) : null,
//       },
//     };

//     await addProperty(payload).unwrap();
//     router.push("/");
//   };

//   return (
//     <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-32 font-display">

//       {/* HEADER */}
//       <div className="sticky top-0 bg-white/90 dark:bg-[#112117]/90 backdrop-blur border-b p-4 flex justify-between items-center">
//         <button onClick={() => router.back()}>✕</button>
//         <h2 className="font-bold">New Listing</h2>
//         <button onClick={submitHandler} className="text-primary font-bold">
//           Save
//         </button>
//       </div>

//       <div className="px-4 pt-6 max-w-lg mx-auto space-y-8">

//         {/* TITLE */}
//         <Input
//           label="Listing Title"
//           value={form.title}
//           onChange={(e) => update("title", e.target.value)}
//         />

//         {/* PRICE */}
//         <Input
//           label="Price"
//           type="number"
//           value={form.priceValue}
//           onChange={(e) => update("priceValue", e.target.value)}
//         />

//         {/* PROPERTY TYPE */}
//         <Section title="Property Type">
//           <div className="flex gap-3 overflow-x-auto">
//             {PROPERTY_TYPES.map((t) => (
//               <Pill
//                 key={t}
//                 active={form.propertyType === t}
//                 onClick={() => update("propertyType", t)}
//               >
//                 {t}
//               </Pill>
//             ))}
//           </div>
//         </Section>

//         {/* SPECS */}
//         <Section title="Specifications">
//           <Counter label="Bedrooms" value={form.beds} onChange={(v) => update("beds", v)} />
//           <Counter label="Bathrooms" value={form.baths} onChange={(v) => update("baths", v)} />
//           <Input label="Area (Sq.Ft)" type="number" value={form.areaSqFt} onChange={(e)=>update("areaSqFt",e.target.value)} />
//         </Section>

//         {/* LOCATION */}
//         <Section title="Location">
//           <Input label="Address" value={form.address} onChange={(e)=>update("address",e.target.value)} />
//           <Input label="City" value={form.city} onChange={(e)=>update("city",e.target.value)} />
//           <Input label="State" value={form.state} onChange={(e)=>update("state",e.target.value)} />
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Latitude" value={form.lat} onChange={(e)=>update("lat",e.target.value)} />
//             <Input label="Longitude" value={form.lng} onChange={(e)=>update("lng",e.target.value)} />
//           </div>
//         </Section>

//         {/* AMENITIES */}
//         <Section title="Amenities">
//           <div className="flex flex-wrap gap-2">
//             {AMENITIES.map((a) => (
//               <Pill key={a} active={form.amenities.includes(a)} onClick={()=>toggleAmenity(a)}>
//                 {a}
//               </Pill>
//             ))}
//           </div>
//         </Section>

//         {/* DESCRIPTION */}
//         <Section title="Description">
//           <textarea
//             className="w-full bg-white dark:bg-[#1a2c22] rounded-xl p-4"
//             rows={4}
//             value={form.description}
//             onChange={(e)=>update("description",e.target.value)}
//           />
//         </Section>
//       </div>

//       {/* FLOATING BUTTON */}
//       <div className="fixed bottom-6 left-0 right-0 px-4 max-w-lg mx-auto">
//         <button
//           onClick={submitHandler}
//           className="w-full bg-blue-600 text-white font-bold py-4 rounded-full"
//         >
//           {isLoading ? "Publishing..." : "Publish Listing"}
//         </button>
//       </div>
//     </div>
//   );
// }

// /* COMPONENTS */
// function Section({ title, children }) {
//   return (
//     <div>
//       <h3 className="font-bold text-lg mb-3">{title}</h3>
//       {children}
//     </div>
//   );
// }

// function Input({ label, ...props }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">{label}</label>
//       <input {...props} className="rounded-xl p-3 bg-white dark:bg-[#1a2c22]" />
//     </div>
//   );
// }

// function Pill({ active, children, ...props }) {
//   return (
//     <button
//       {...props}
//       className={`px-5 py-2 rounded-full font-semibold text-sm ${
//         active ? "bg-primary text-black" : "bg-white dark:bg-[#1a2c22]"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// function Counter({ label, value, onChange }) {
//   return (
//     <div className="flex justify-between items-center">
//       <span>{label}</span>
//       <div className="flex gap-3 items-center">
//         <button onClick={()=>onChange(value-1)}>-</button>
//         <span>{value}</span>
//         <button onClick={()=>onChange(value+1)}>+</button>
//       </div>
//     </div>
//   );
// }
