"use client";

import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import RecommendedCarousel from "@/components/RecommendedCarousel";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PremiumSplash from "@/components/PremiumSplash";
import ListingOptionsSection from "@/components/subscription/ListingOptionsSection";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("nestme_intro_seen");

    if (!seen) {
      setShowSplash(true);

      setTimeout(() => {
        sessionStorage.setItem("nestme_intro_seen", "true");
        setShowSplash(false);
      }, 3000);
    }

    setChecking(false);
  }, []);

  // 🚨 Prevent hydration mismatch
  if (checking) return null;

  // Splash
  if (showSplash) return <PremiumSplash />;

  return (
    <>
      <Header />

      <main className="bg-[#f9fafb] overflow-x-hidden">

        {/* HERO */}
        <section className="bg-gradient-to-br from-[#33c9b5] via-[#010101] to-[#26a9e1] text-white px-5 pt-14 pb-12 rounded-b-[36px]">
          <div className="max-w-full mx-auto text-center space-y-5">
            <h1 className="text-3xl md:text-5xl font-bold">
              Find Your Perfect Property
            </h1>

            <p className="text-md text-white/90">
              Buy, Rent or Lease verified homes across India
            </p>

            <div className="max-w-md mx-auto">
              <SearchBar />
            </div>

            <div className="flex justify-center gap-3 pt-3 flex-wrap">
              <PurposeChip label="Buy" type="sale" />
              <PurposeChip label="Rent" type="rent" />
              <PurposeChip label="Lease" type="lease" />
            </div>
          </div>
        </section>

        {/* PROPERTY TYPES */}
        <section className="px-5 pt-8 pb-6 bg-indigo-50">
          <h2 className="text-xl md:text-2xl font-bold mb-12 text-slate-800 text-center md:text-left">
            Browse by Property Type
          </h2>

          <div className="grid grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
            <PropertyType icon="apartment" label="Apartment" type="apartment" />
            <PropertyType icon="holiday_village" label="Villa" type="villa" />
            <PropertyType icon="terrain" label="Plot" type="plot" />
            <PropertyType icon="storefront" label="Commercial" type="commercial" />
          </div>
        </section>

        {/* CAROUSELS */}
        <section className="px-4 pt-4 pb-4 bg-gray-50">
          <RecommendedCarousel title="Newly Added" sortType="latest" />
        </section>

        <section className="px-4 pt-4 pb-4 bg-indigo-100">
          <RecommendedCarousel title="Trending This Week" sortType="views" />
        </section>

        <section className="px-4 pt-4 pb-4 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
          <RecommendedCarousel title="Premium Picks" minPrice={20000000} />
        </section>

        {/* CTA */}
        <ListingOptionsSection />
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}

/* ================= HELPERS ================= */

function PurposeChip({ label, type }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/search?listingType=${type}`)}
      className="px-3 py-1 bg-white text-black rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition"
    >
      {label}
    </button>
  );
}

function PropertyType({ icon, label, type }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/search?propertyType=${type}`)}
      className="cursor-pointer space-y-2"
    >
      <div className="w-14 h-14 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center">
        <span className="material-symbols-outlined text-black text-2xl">
          {icon}
        </span>
      </div>

      <p className="text-xs font-bold text-slate-700">{label}</p>
    </div>
  );
}