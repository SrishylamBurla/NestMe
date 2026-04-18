
"use client";

import { useParams, useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  useGetPropertyByIdQuery,
  useGetSimilarPropertiesQuery,
} from "@/store/services/PropertiesApi";

import { useToggleSavePropertyMutation } from "@/store/services/savedApi";

import PropertyHero from "@/components/PropertyHero";
import PropertyOverview from "@/components/PropertyOverview";
import PropertyAmenities from "@/components/PropertyAmenities";
import PropertyLocation from "@/components/PropertyLocation";
import PropertyAgent from "@/components/PropertyAgent";
import SimilarProperties from "@/components/SimilarProperties";
import { ChevronLeft } from "lucide-react";


export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [toggleSaved] = useToggleSavePropertyMutation();
  // const [isSaved, setIsSaved] = useState(false);

  const { data: property, isLoading, isError } = useGetPropertyByIdQuery(id);

  const { data: similar } = useGetSimilarPropertiesQuery(
    property ? { city: property.city, excludeId: property._id } : skipToken,
  );

  //   useEffect(() => {
  //   if (property?.isSaved !== undefined) {
  //     setIsSaved(property.isSaved);
  //   }
  // }, [property]);

  const isSaved = property?.isSaved;

  const handleFavorite = async () => {
    try {
      await toggleSaved(property._id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/properties/${property._id}`;

    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: "Check out this property",
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading property…
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Property not found
      </div>
    );
  }
return (
  <div className="relative min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#e0e7ff] text-slate-800">

    {/* HERO AT TOP */}
    <div className="relative w-full overflow-hidden">
      <PropertyHero images={property.images} />

      {/* Soft dark overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Top Glass Bar */}
      <div className="absolute fixed top-0 left-0 w-full z-40 bg-[rgba(255,255,255,0.2)] backdrop-blur border-slate-200">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full fixed top-4 left-4 z-50 shadow-lg bg-gray-200 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Actions */}
          <div className="flex items-center gap-3 fixed top-4 right-4 z-50">

            <button
              onClick={handleShare}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-lg flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-slate-900 text-[18px] sm:text-[20px]">
                share
              </span>
            </button>

            <button
              onClick={handleFavorite}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-lg border-slate-800 flex items-center justify-center"
            >
              <span
                className={`material-symbols-outlined transition-all duration-300 ${
                  isSaved ? "text-red-500 scale-110" : "text-slate-900"
                }`}
                style={{
                  fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                favorite
              </span>
            </button>

          </div>
        </div>
      </div>

    </div>

    {/* CONTENT */}
    <div className="relative -mt-10 sm:-mt-14 md:-mt-18 lg:-mt-22 z-30 px-4 sm:px-6 max-w-5xl mx-auto space-y-2 sm:space-y-6 pb-16">

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 p-4 sm:p-6">
        <PropertyOverview property={property} />
      </div>
 
      <div className="p-4 sm:p-6">
        <PropertyAmenities amenities={property.amenities} />
      </div>

      <div className="">
        <PropertyLocation location={property.location} />
      </div>

      <div className="py-4 sm:py-6">
        <PropertyAgent property={property} />
      </div>

      {similar?.properties?.length > 0 && (
        <div className="p-4 sm:p-6">
          <SimilarProperties properties={similar.properties} />
        </div>
      )}

    </div>

    {/* MOBILE STICKY CTA */}
    {/* <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t border-slate-200 p-3 sm:hidden z-50">
      <div className="flex gap-3">

        <button className="flex-1 h-11 rounded-full border border-slate-300 text-slate-700 text-sm font-medium">
          Book Visit
        </button>

        <button className="flex-1 h-11 rounded-full bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">
            call
          </span>
          Contact
        </button>

      </div>
    </div> */}

  </div>
);
}