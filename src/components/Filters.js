"use client";

export default function Filters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3">

      {/* City */}
      <select
        className="border border-gray-800 rounded-lg px-3 py-2 text-sm"
        value={filters.city}
        onChange={(e) =>
          setFilters({ ...filters, city: e.target.value })
        }
      >
        <option value="">All Cities</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Pune">Pune</option>
        <option value="Gurgaon">Gurgaon</option>
      </select>

      {/* BHK */}
      <select
        className="border border-gray-800 rounded-lg px-3 py-2 text-sm"
        value={filters.beds}
        onChange={(e) =>
          setFilters({ ...filters, beds: e.target.value })
        }
      >
        <option value="">Any BHK</option>
        <option value="1">1 BHK</option>
        <option value="2">2 BHK</option>
        <option value="3">3 BHK</option>
      </select>

      {/* Price */}
      <select
        className="border border-gray-800 rounded-lg px-3 py-2 text-sm"
        value={filters.maxPrice}
        onChange={(e) =>
          setFilters({ ...filters, maxPrice: e.target.value })
        }
      >
        <option value="">Any Price</option>
        <option value="2000000">Under 20L</option>
        <option value="5000000">Under 50L</option>
        <option value="10000000">Under 1Cr</option>
        <option value="30000000">Under 3Cr</option>
      </select>

    </div>
  );
}
