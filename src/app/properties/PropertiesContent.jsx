"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";
import { LoadingGrid, EmptyState, ErrorState } from "@/components/LoadingGrid";
import PropertiesGrid from "@/components/PropertiesGrid";

export default function PropertiesContent() {
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

  const { data, isFetching, isError } =
    useGetPropertiesQuery(queryParams);

  const totalPages = data?.totalPages || 1;

  const updateQuery = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) params.delete(key);
    else params.set(key, value);

    params.set("page", 1);
    router.push(`/properties?${params.toString()}`);
  };

  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* your entire UI stays same */}
    </div>
  );
}
