"use client";

import { useState, useEffect } from "react";
import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    listingType: searchParams.get("listingType") || "",
    propertyType: searchParams.get("propertyType") || "",
    beds: [],
    maxPrice: Number(searchParams.get("maxPrice")) || 50000000,
  });

  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [showTitle, setShowTitle] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { data, isLoading } = useGetPropertiesQuery(filters);

  /* ================= SCROLL BEHAVIOR ================= */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 80) {
        setShowTitle(false);
      } else {
        setShowTitle(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= SEARCH DEBOUNCE ================= */
  useEffect(() => {
    const delay = setTimeout(() => {
      setFilters((prev) => ({ ...prev, q: searchInput }));
    }, 400);

    return () => clearTimeout(delay);
  }, [searchInput]);

  const toggleBed = (b) => {
    setFilters((prev) => ({
      ...prev,
      beds: prev.beds.includes(b)
        ? prev.beds.filter((x) => x !== b)
        : [...prev.beds, b],
    }));
  };

  const resetFilters = () => {
    setSearchInput("");
    setFilters({
      q: "",
      listingType: "",
      propertyType: "",
      beds: [],
      maxPrice: 50000000,
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.listingType) params.set("listingType", filters.listingType);
    if (filters.propertyType) params.set("propertyType", filters.propertyType);
    if (filters.beds.length === 1) params.set("beds", filters.beds[0]);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 pb-32">
        {/* ================= HEADER ================= */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-white/10 transition-all duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* COLLAPSIBLE TITLE */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showTitle
                  ? "max-h-[120px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-6"
              }`}
            >
              <div className="pt-6 pb-2">
                <h2 className="text-2xl font-bold text-white">
                  Search Properties
                </h2>
                {data && (
                  <p className="text-sm text-slate-400 mt-1">
                    {data.properties.length} results found
                  </p>
                )}
              </div>
            </div>

            {/* SEARCH + TOGGLE */}
            <div className="pb-6 pt-4">
              {/* SEARCH BAR */}
              <div className="relative group">
                <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-100 blur-md transition duration-300" />

                <div className="relative flex items-center bg-slate-800 rounded-full h-11 sm:h-14 px-4 sm:px-5 shadow-lg">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">
                    search
                  </span>

                  <input
                    className="flex-1 bg-transparent focus:outline-none px-2 sm:px-3 text-sm text-white placeholder:text-slate-500"
                    placeholder="Search city, area..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />

                  {/* Mobile Icon Button */}
                  <button
                    onClick={applyFilters}
                    className="sm:hidden h-9 w-9 flex items-center justify-center rounded-full bg-indigo-600 text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>

                  {/* Desktop Button */}
                  <button
                    onClick={applyFilters}
                    className="hidden sm:block h-9 px-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 overflow-x-auto mt-4 no-scrollbar">
                {["sale", "rent"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        listingType: type,
                      }))
                    }
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      filters.listingType === type
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {type === "sale" ? "Buy" : "Rent"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN LAYOUT ================= */}
        <div className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="hidden lg:block bg-slate-800 rounded-2xl p-6 space-y-8 h-fit sticky top-32">
            <SidebarSection title="Property Type">
              <div className="space-y-2">
                {["apartment", "villa", "plot", "commercial"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, propertyType: type }))
                    }
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                      filters.propertyType === type
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </SidebarSection>

            <SidebarSection title="Bedrooms">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((b) => (
                  <button
                    key={b}
                    onClick={() => toggleBed(b)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      filters.beds.includes(b)
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-700"
                    }`}
                  >
                    {b} BHK
                  </button>
                ))}
              </div>
            </SidebarSection>

            <SidebarSection title="Budget">
              <input
                type="range"
                min={100000}
                max={50000000}
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
              <p className="text-sm mt-2 text-slate-400">
                Up to ₹{" "}
                {new Intl.NumberFormat("en-IN").format(filters.maxPrice)}
              </p>
            </SidebarSection>
          </aside>

          {/* ================= RESULTS ================= */}
          <section>
            {isLoading && (
              <p className="text-slate-400">Loading properties...</p>
            )}

            {!isLoading && data?.properties?.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                No properties match your filters.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {data?.properties?.map((p) => (
                <PropertyCard property={p} key={p._id} />
              ))}
            </div>
          </section>
        </div>

        {/* ================= BOTTOM ACTION BAR ================= */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/10 p-4">
          <div className="flex gap-3 max-w-5xl mx-auto px-2 sm:px-0">
            <button
              onClick={resetFilters}
              className="flex-1 border border-white/20 h-12 rounded-full"
            >
              Reset
            </button>

            <button
              onClick={applyFilters}
              className="flex-1 bg-indigo-600 text-white font-bold h-12 rounded-full"
            >
              Show {data?.properties?.length || 0} Properties
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= SIDEBAR SECTION ================= */
function SidebarSection({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 text-slate-300 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}
