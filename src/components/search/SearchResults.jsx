"use client";

import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";
import PropertyCard from "@/components/PropertyCard";

export default function SearchResults({ filters }) {
  const { data, isLoading } = useGetPropertiesQuery({
    page: 1,
    limit: 12,
    ...filters,
    beds: filters.beds.join(","),
    propertyType: filters.propertyType.join(","),
    furnishing: filters.furnishing.join(","),
  });

  if (isLoading)
    return <p className="text-gray-500">Searching properties…</p>;

  if (!data?.properties?.length)
    return <p>No properties found</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
