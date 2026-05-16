
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
import { ChevronLeft, Share } from "lucide-react";


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
  <div className="min-h-screen bg-[#f6f8fc] overflow-x-hidden">

    {/* ================= HERO SECTION ================= */}

    <section className="relative">

      {/* HERO */}
      <PropertyHero
        property={property}
        images={property.images}
      />

      {/* DARK TOP OVERLAY */}
      <div
        className="
        absolute
        inset-0
        bg-gradient-to-b
        from-black/30
        via-transparent
        to-transparent
        z-20
        pointer-events-none
        "
      />

      {/* ================= TOP NAV ================= */}

      <div
        className="
        fixed
        top-0
        left-0
        w-full
        z-[100]
        "
      >
        <div
          className="
          flex
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-10
          pt-4
          "
        >
          {/* LEFT */}
          <button
            onClick={() => router.back()}
            className="
            w-11 h-11
            rounded-full
            bg-white/80
            backdrop-blur-2xl
            shadow-[0_10px_30px_rgba(0,0,0,0.15)]
            border border-white/40
            flex items-center justify-center
            hover:scale-105
            active:scale-95
            transition-all
            duration-300
            "
          >
            <ChevronLeft className="w-5 h-5 text-slate-900" />
          </button>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* SHARE */}
            <button
              onClick={handleShare}
              className="
              w-11 h-11
              rounded-full
              bg-white/80
              backdrop-blur-2xl
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
              border border-white/40
              flex items-center justify-center
              hover:scale-105
              active:scale-95
              transition-all
              duration-300
              "
            >
              <Share className="w-5 h-5 text-slate-900" />
            </button>

            {/* FAVORITE */}
            <button
              onClick={handleFavorite}
              className="
              w-11 h-11
              rounded-full
              bg-white/80
              backdrop-blur-2xl
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
              border border-white/40
              flex items-center justify-center
              hover:scale-105
              active:scale-95
              transition-all
              duration-300
              "
            >
              <span
                className={`
                material-symbols-outlined
                transition-all
                duration-300
                ${
                  isSaved
                    ? "text-red-500 scale-110"
                    : "text-slate-900"
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

          </div>
        </div>
      </div>
    </section>

    {/* ================= MAIN CONTENT ================= */}

    <main
      className="
      relative
      z-40
      -mt-20
      sm:-mt-24
      lg:-mt-28
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        xl:px-10
        "
      >
        {/* ================= GRID ================= */}

        <div
          className="
          grid
          grid-cols-1
          xl:grid-cols-[1fr_360px]
          gap-6
          lg:gap-8
          "
        >
          {/* ================= LEFT CONTENT ================= */}

          <div className="space-y-6 lg:space-y-8">

            {/* OVERVIEW */}
            <section
              className="
              rounded-[32px]
              overflow-hidden
              "
            >
              <PropertyOverview
                property={property}
              />
            </section>

            {/* AMENITIES */}
            <section
              className="
              bg-white
              rounded-[32px]
              border border-slate-200
              shadow-sm
              p-5
              sm:p-6
              lg:p-8
              "
            >
              <PropertyAmenities
                amenities={
                  property.amenities
                }
              />
            </section>

            {/* LOCATION */}
            <section
              className="
              bg-white
              rounded-[32px]
              border border-slate-200
              shadow-sm
              overflow-hidden
              "
            >
              <PropertyLocation
                location={
                  property.location
                }
              />
            </section>

            {/* SIMILAR */}
            {similar?.properties
              ?.length > 0 && (
              <section
                className="
                bg-white
                rounded-[32px]
                border border-slate-200
                shadow-sm
                p-5
                sm:p-6
                "
              >
                <SimilarProperties
                  properties={
                    similar.properties
                  }
                />
              </section>
            )}
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}

          <aside
            className="
            xl:sticky
            xl:top-24
            h-fit
            "
          >
            <div
              className="
              bg-white
              rounded-[32px]
              border border-slate-200
              shadow-sm
              p-5
              sm:p-6
              "
            >
              <PropertyAgent
                property={property}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>

    {/* ================= BOTTOM SPACING ================= */}

    <div className="h-20" />
  </div>
);
}