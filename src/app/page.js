"use client";

import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import RecommendedCarousel from "@/components/RecommendedCarousel";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PremiumSplash from "@/components/PremiumSplash";

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
      }, 4000); // premium duration
    }

    setChecking(false);
  }, []);

  if (checking) return null;
  if (showSplash) return <PremiumSplash />;

  // const [showSplash, setShowSplash] = useState(false);
  // const [checking, setChecking] = useState(true);

  // useEffect(() => {
  //   const seen = sessionStorage.getItem("nestme_intro_seen");

  //   if (!seen) {
  //     setShowSplash(true);

  //     setTimeout(() => {
  //       sessionStorage.setItem("nestme_intro_seen", "true");
  //       setShowSplash(false);
  //     }, 3500); // duration
  //   }

  //   setChecking(false);
  // }, []);

  // if (checking) return null;
  // if (showSplash) return <SplashScreen />;

  return (
    <>
      <Header />

      <main className="bg-[#f9fafb] overflow-x-hidden">
        {/* ================= HERO ================= */}

        {/* ================= HERO ================= */}
        <section className="bg-gradient-to-br from-[#33c9b5] via-[#010101] to-[#26a9e1] text-white px-5 pt-14 pb-12 rounded-b-[36px]">
          <div className="max-w-full mx-auto text-center space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight">
              Find Your Perfect Property
            </h1>

            <p className="font-sans text-md text-white/90">
              Buy, Rent or Lease verified homes across India
            </p>

            <div className="max-w-md mx-auto">
              <SearchBar />
            </div>

            <div className="flex justify-center gap-3 pt-3 flex-wrap font-sans">
              <PurposeChip label="Buy" type="sale" />
              <PurposeChip label="Rent" type="rent" />
              <PurposeChip label="Lease" type="lease" />
            </div>
          </div>
        </section>
        {/* <section className="bg-gradient-to-br from-[#33c9b5] via-[#010101] to-[#26a9e1] text-white px-5 pt-14 pb-12 rounded-b-[36px]">

          <div className="max-w-full mx-auto text-center space-y-5">

            <h1 className="text-3xl md:text-5x font-sans font-bold">
              Find Your Perfect Property
            </h1>

            <p className="text-md font-sans text-white/90">
              Buy, Rent or Lease verified homes across India
            </p>

            <div className="max-w-md mx-auto">
              <SearchBar />
            </div>

            <div className="flex justify-center gap-3 pt-3 flex-wrap font-sans">
              <PurposeChip label="Buy" type="sale" />
              <PurposeChip label="Rent" type="rent" />
              <PurposeChip label="Lease" type="lease" />
            </div>

          </div>
        </section> */}

        {/* ================= PROPERTY TYPES ================= */}
        <section className="px-5 pt-8 pb-6 bg-indigo-50">
          <h2 className="text-lg font-sans font-bold mb-5 text-slate-800">
            Browse by Property Type
          </h2>

          <div className="grid grid-cols-4 gap-4 text-center">
            <PropertyType icon="apartment" label="Apartment" type="apartment" />
            <PropertyType icon="holiday_village" label="Villa" type="villa" />
            <PropertyType icon="terrain" label="Plot" type="plot" />
            <PropertyType
              icon="storefront"
              label="Commercial"
              type="commercial"
            />
          </div>
        </section>

        {/* ================= NEWLY ADDED ================= */}
        <section className="px-4 pt-4 pb-4 bg-gray-50">
          <RecommendedCarousel title="Newly Added" sortType="latest" />
        </section>

        {/* ================= TRENDING ================= */}
        <section className="px-4 pt-4 pb-4 bg-purple-50">
          <RecommendedCarousel title="Trending This Week" sortType="views" />
        </section>

        {/* ================= PREMIUM ================= */}
        <section className="px-4 pt-4 pb-4 bg-pink-50">
          <RecommendedCarousel title="Premium Picks" minPrice={20000000} />
        </section>

        {/* ================= CTA ================= */}

        {/* ================= SELLER CTA — PREMIUM ================= */}
        <section className="px-6 py-14 bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e293b] text-white">
          <div className="max-w-full">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* ===== LEFT: TEXT ===== */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold font-sans leading-tight">
                  Sell or Rent your property
                  <span className="text-indigo-400"> faster</span> on NestMe
                </h2>

                <p className="text-white/80 text-lg">
                  List your property for free and reach thousands of verified
                  buyers and tenants across India.
                </p>

                {/* Feature bullets */}
                <ul className="space-y-3 text-white/80 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-400">
                      check_circle
                    </span>
                    Free listing — no hidden charges
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-400">
                      visibility
                    </span>
                    Maximum exposure to serious buyers
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-400">
                      verified_user
                    </span>
                    Verified leads & enquiries
                  </li>
                </ul>

                {/* CTA Button */}
                <Link
                  href="/add-property"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-xl font-semibold shadow-2xl hover:shadow-indigo-500/30 transition text-white"
                >
                  Post Property for Free
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* ===== RIGHT: VISUAL CARD ===== */}
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-5">
                  <h3 className="text-xl font-semibold">
                    Why sellers choose NestMe
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <Stat label="Active Buyers" value="10K+" />
                    <Stat label="Cities Covered" value="120+" />
                    <Stat label="Verified Users" value="95%" />
                    <Stat label="Avg. Response" value="< 24 hrs" />
                  </div>
                </div>

                {/* Glow behind card */}
                <div className="absolute -z-10 inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
              </div>
            </div>
          </div>
        </section>
        {/* <section className="px-6 py-10 text-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
          <h2 className="text-xl font-bold font-sans mb-3 text-slate-800">
            Ready to list your property?
          </h2>

          <p className="text-[15px] font-sans text-slate-600 mb-6">
            Reach thousands of verified buyers instantly.
          </p>

          <Link
            href="/add-property"
            className="inline-block px-8 py-3 bg-black text-white font-sans rounded-full font-semibold shadow-lg hover:shadow-xl transition"
          >
            Post a Property for Free
          </Link>
        </section> */}
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}

/* ================= SMALL COMPONENTS ================= */


function Stat({ label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
      <p className="text-lg font-bold text-indigo-400">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  );
}

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

      <p className="text-xs font-bold font-sans text-slate-700">{label}</p>
    </div>
  );
}
