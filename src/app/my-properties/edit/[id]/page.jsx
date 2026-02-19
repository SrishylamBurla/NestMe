"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetPropertyByIdQuery,
  useUpdatePropertyMutation,
} from "@/store/services/PropertiesApi";

const AMENITIES = ["pool", "gym", "parking", "security", "garden", "lift"];
const FACING_OPTIONS = ["East", "West", "North", "South"];

export default function UserEditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetPropertyByIdQuery(id);
  const [updateProperty, { isLoading: saving }] = useUpdatePropertyMutation();

  const [listingType, setListingType] = useState("sale");
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data) {
      const p = data;

      setListingType(p.listingType || "sale");

      setForm({
        title: p.title || "",
        description: p.description || "",
        propertyType: p.propertyType || "apartment",
        priceLabel: p.priceLabel || "",
        priceValue: p.priceValue || "",
        pricePerSqFt: p.pricePerSqFt || "",
        beds: p.beds || 2,
        baths: p.baths || 2,
        areaSqFt: p.areaSqFt || "",
        furnishing: p.furnishing || "semi",
        facing: p.facing || "",
        address: p.address || "",
        city: p.city || "",
        state: p.state || "",
        lat: p.location?.lat || "",
        lng: p.location?.lng || "",
        amenities: p.amenities || [],
        images: p.images?.length ? p.images : [""],
      });
    }
  }, [data]);

  if (isLoading || !form) return <p className="p-4">Loading property...</p>;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const submitHandler = async () => {
    const payload = {
      ...form,
      listingType,
      priceValue: Number(form.priceValue),
      approvalStatus: "pending",      // 🔥 back to review
      listingStatus: "sold",         // not live yet
      rejectionReason: "",            // clear old reason
      location: {
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
      },
      images: form.images.filter(Boolean),
    };

    await updateProperty({ id, ...payload }).unwrap();
    alert("Property updated and sent for admin approval");
    router.push("/my-properties");
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] flex justify-center">
      <div className="w-full max-w-[1100px] flex flex-col">

        {/* HEADER */}
        <div className="sticky top-0 z-50 bg-white border-b">
          <div className="h-16 px-4 flex items-center justify-between">
            <button onClick={() => router.back()}>✕</button>
            <h2 className="font-bold">Edit Property</h2>
            <button onClick={submitHandler} disabled={saving}>
              {saving ? "Saving..." : "Update"}
            </button>
          </div>
        </div>

        <div className="flex flex-1">
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
                <Input label="Title *" value={form.title} onChange={(e)=>update("title",e.target.value)} />
                <Input label="Price Label" value={form.priceLabel} onChange={(e)=>update("priceLabel",e.target.value)} />
                <Input label="Price Value *" type="number" value={form.priceValue} onChange={(e)=>update("priceValue",e.target.value)} />
                <Input label="Price / Sq.ft" value={form.pricePerSqFt} onChange={(e)=>update("pricePerSqFt",e.target.value)} />
                <Select label="Property Type" value={form.propertyType} options={["apartment","villa","plot","office"]} onChange={(e)=>update("propertyType",e.target.value)} />
              </Section>

              {/* DETAILS */}
              <Section title="Property Details">
                <Counter label="Bedrooms" value={form.beds} onChange={(v)=>update("beds",v)} />
                <Counter label="Bathrooms" value={form.baths} onChange={(v)=>update("baths",v)} />
                <Input label="Area (sq.ft)" type="number" value={form.areaSqFt} onChange={(e)=>update("areaSqFt",e.target.value)} />
                <Select label="Furnishing" value={form.furnishing} options={["none","semi","full"]} onChange={(e)=>update("furnishing",e.target.value)} />
                <Select label="Facing" value={form.facing} options={["",...FACING_OPTIONS]} onChange={(e)=>update("facing",e.target.value)} />
              </Section>

              {/* LOCATION */}
              <Section title="Location">
                <Input label="Address" value={form.address} onChange={(e)=>update("address",e.target.value)} />
                <Input label="City *" value={form.city} onChange={(e)=>update("city",e.target.value)} />
                <Input label="State *" value={form.state} onChange={(e)=>update("state",e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Latitude" value={form.lat} onChange={(e)=>update("lat",e.target.value)} />
                  <Input label="Longitude" value={form.lng} onChange={(e)=>update("lng",e.target.value)} />
                </div>
              </Section>

              {/* AMENITIES */}
              <Section title="Amenities">
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((a)=>(
                    <button key={a} onClick={()=>toggleAmenity(a)}
                      className={`px-4 py-2 rounded-full border font-bold ${
                        form.amenities.includes(a) ? "bg-black text-white" : "bg-white"
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </Section>

              {/* DESCRIPTION */}
              <Section title="Description">
                <textarea className="w-full border rounded-xl p-4 min-h-[120px]"
                  value={form.description}
                  onChange={(e)=>update("description",e.target.value)}
                />
              </Section>

              {/* IMAGES */}
              <Section title="Property Images">
                {form.images.map((img,i)=>(
                  <Input key={i} label={`Image URL ${i+1}`} value={img}
                    onChange={(e)=>{
                      const arr=[...form.images];
                      arr[i]=e.target.value;
                      update("images",arr);
                    }}
                  />
                ))}
                <button type="button" onClick={()=>update("images",[...form.images,""])}
                  className="text-sm text-blue-600 font-semibold">
                  + Add Another Image
                </button>
              </Section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


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
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
        <span className="font-bold">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}
