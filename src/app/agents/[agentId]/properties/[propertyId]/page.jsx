"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetPropertyByIdQuery } from "@/store/services/PropertiesApi";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function AgentPropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.propertyId;

  const { data, isLoading, isFetching, isError } =
    useGetPropertyByIdQuery(propertyId, { skip: !propertyId });

  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading property...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load property
      </div>
    );
  }

  const property = data;
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Property not found
      </div>
    );
  }

  const images =
    property.images?.length > 0
      ? property.images
      : [{ url: "/propertyImg/placeholder-property.jpg" }];

  const isPending = property.approvalStatus === "pending";
  const isRejected = property.approvalStatus === "rejected";
  const isApproved = property.approvalStatus === "approved";

  const status = isPending
    ? { text: "Pending", color: "bg-yellow-500" }
    : isRejected
    ? { text: "Rejected", color: "bg-red-500" }
    : { text: "Live", color: "bg-green-500" };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">

      {/* HEADER (GLASS) */}
      <div className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.back()}
          className="px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className={`text-white text-xs px-3 py-1 rounded-full ${status.color}`}>
          {status.text}
        </span>
      </div>

      {/* IMAGE CAROUSEL */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="w-full h-[260px] flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${img.url})` }}
              />
            ))}
          </div>
        </div>

        {/* DOTS */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full ${
                i === activeIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* PRICE FLOAT */}
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-2xl font-bold">
            ₹{property.priceValue?.toLocaleString()}
          </p>
          <p className="text-sm opacity-80">
            {property.city}, {property.state}
          </p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-t-3xl mt-8 p-5 shadow-xl space-y-6">

        {/* TITLE */}
        <h1 className="text-xl font-bold">{property.title}</h1>

        {/* STATUS CARD */}
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            isPending
              ? "bg-yellow-100 text-yellow-800"
              : isRejected
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {isPending && "⏳ Waiting for admin approval"}
          {isRejected && "❌ Rejected. Please update and resubmit"}
          {isApproved && "✅ Live and receiving traffic"}
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-slate-100 rounded-xl py-3">
            <p className="font-bold">{property.beds}</p>
            <p className="text-xs">Beds</p>
          </div>
          <div className="bg-slate-100 rounded-xl py-3">
            <p className="font-bold">{property.baths}</p>
            <p className="text-xs">Baths</p>
          </div>
          <div className="bg-slate-100 rounded-xl py-3">
            <p className="font-bold">{property.areaSqFt}</p>
            <p className="text-xs">Sqft</p>
          </div>
          <div className="bg-slate-100 rounded-xl py-3">
            <p className="font-bold">{property.views || 0}</p>
            <p className="text-xs">Views</p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {property.description || "No description provided"}
          </p>
        </div>

        {/* EXTRA SECTION (AMENITIES) */}
        {property.amenities?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((a, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-100 px-3 py-1 rounded-full"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}