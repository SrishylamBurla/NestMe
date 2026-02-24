"use client";

import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import RecommendedCarousel from "@/components/RecommendedCarousel";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="bg-[#f9fafb] overflow-x-hidden">

        {/* ================= HERO ================= */}
        <section className="bg-gradient-to-br from-[#33c9b5] via-[#010101] to-[#26a9e1] text-white px-5 pt-14 pb-12 rounded-b-[36px]">

          <div className="max-w-xl mx-auto text-center space-y-5">

            <h1 className="text-3xl font-bold leading-tight">
              Find Your Perfect Property
            </h1>

            <p className="text-sm text-white/90">
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

        {/* ================= PROPERTY TYPES ================= */}
        <section className="px-5 pt-8 pb-6 bg-indigo-50">
          <h2 className="text-xl font-sans font-bold mb-5 text-slate-800">
            Browse by Property Type
          </h2>

          <div className="grid grid-cols-4 gap-4 text-center">
            <PropertyType icon="apartment" label="Apartment" type="apartment" />
            <PropertyType icon="holiday_village" label="Villa" type="villa" />
            <PropertyType icon="terrain" label="Plot" type="plot" />
            <PropertyType icon="storefront" label="Commercial" type="commercial" />
          </div>
        </section>

        {/* ================= NEWLY ADDED ================= */}
        <section className="px-4 pt-4 pb-4 bg-gray-50">
          <RecommendedCarousel
            title="Newly Added"
            sortType="latest"
          />
        </section>

        {/* ================= TRENDING ================= */}
        <section className="px-4 pt-4 pb-4 bg-purple-50">
          <RecommendedCarousel
            title="Trending This Week"
            sortType="views"
          />
        </section>

        {/* ================= PREMIUM ================= */}
        <section className="px-4 pt-4 pb-4 bg-pink-50">
          <RecommendedCarousel
            title="Premium Picks"
            minPrice={20000000}
          />
        </section>

        {/* ================= CTA ================= */}
        <section className="px-6 py-10 text-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
          <h2 className="text-xl font-bold font-sans mb-3 text-slate-800">
            Ready to list your property?
          </h2>

          <p className="text-sm text-slate-600 mb-6">
            Reach thousands of verified buyers instantly.
          </p>

          <Link
            href="/add-property"
            className="inline-block px-8 py-3 bg-black text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition"
          >
            Post Property Free
          </Link>
        </section>

      </main>

      <Footer />
      <BottomNav />
    </>
  );
}

/* ================= SMALL COMPONENTS ================= */

function PurposeChip({ label, type }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/search?listingType=${type}`)}
      className="px-5 py-2 bg-white text-black rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition"
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

      <p className="text-xs font-bold text-slate-700">
        {label}
      </p>
    </div>
  );
}
