"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";
import { LoadingGrid, EmptyState, ErrorState } from "@/components/LoadingGrid";
import PropertiesGrid from "@/components/PropertiesGrid";
import Link from "next/link";

export default function PropertiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const q = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const sort = searchParams.get("sort") || "latest";

  const queryParams = {
    page,
    limit: 12,
    q,
    city,
    listingType: searchParams.get("listingType") || "",
    propertyType: searchParams.get("propertyType") || "",
    beds: searchParams.get("beds") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort,
  };

  const { data, isFetching, isError } = useGetPropertiesQuery(queryParams);

  const totalPages = data?.totalPages || 1;

  const updateQuery = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", 1); // reset page when filter changes
    router.push(`/properties?${params.toString()}`);
  };

  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-10">
        {/* HEADER */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center shadow-sm"
            >
              <span className="material-symbols-outlined text-slate-700">
                arrow_back
              </span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Explore Properties
              </h1>
              <p className="text-slate-500">
                {data?.properties?.length || 0} properties found
              </p>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search title..."
              defaultValue={q}
              onChange={(e) => updateQuery("q", e.target.value)}
              className="h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              type="text"
              placeholder="Filter by city"
              defaultValue={city}
              onChange={(e) => updateQuery("city", e.target.value)}
              className="h-11 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <select
              value={sort}
              onChange={(e) => updateQuery("sort", e.target.value)}
              className="h-11 px-4 rounded-xl border border-slate-300 bg-white"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="priceHigh">Price: High → Low</option>
              <option value="priceLow">Price: Low → High</option>
            </select>

            <button
              onClick={() => router.push("/properties")}
              className="h-11 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {isFetching && <LoadingGrid />}
        {isError && <ErrorState />}

        {!isFetching && data?.properties?.length > 0 && (
          <>
            <PropertiesGrid properties={data.properties} />

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-4 pt-10">
              <button
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
                className="px-5 py-2.5 rounded-full border bg-white disabled:opacity-50"
              >
                ← Previous
              </button>

              <div className="text-sm font-medium text-slate-600">
                {page} / {totalPages}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => changePage(page + 1)}
                className="px-5 py-2.5 rounded-full border bg-white disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {!isFetching && data?.properties?.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}
