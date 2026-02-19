export default function FilterSidebar({ filters, setFilters }) {
  const toggleArray = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  return (
    <div className="bg-white rounded-xl border p-4 space-y-6 sticky top-20">
      <FilterSection title="Listing Type">
        {["sale", "rent"].map((t) => (
          <FilterChip
            key={t}
            active={filters.listingType === t}
            onClick={() => setFilters({ ...filters, listingType: t })}
          >
            {t === "sale" ? "Buy" : "Rent"}
          </FilterChip>
        ))}
      </FilterSection>

      <FilterSection title="Property Type">
        {["apartment", "villa", "plot", "office"].map((t) => (
          <FilterChip
            key={t}
            active={filters.propertyType.includes(t)}
            onClick={() => toggleArray("propertyType", t)}
          >
            {t}
          </FilterChip>
        ))}
      </FilterSection>

      <FilterSection title="Bedrooms">
        {[1, 2, 3, 4].map((b) => (
          <FilterChip
            key={b}
            active={filters.beds.includes(b)}
            onClick={() => toggleArray("beds", b)}
          >
            {b}+ BHK
          </FilterChip>
        ))}
      </FilterSection>

      <FilterSection title="Furnishing">
        {["none", "semi", "full"].map((f) => (
          <FilterChip
            key={f}
            active={filters.furnishing.includes(f)}
            onClick={() => toggleArray("furnishing", f)}
          >
            {f}
          </FilterChip>
        ))}
      </FilterSection>

      <FilterSection title="Budget">
        <input
          type="number"
          placeholder="Min"
          className="w-full h-10 border rounded px-3 text-sm"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Max"
          className="w-full h-10 border rounded px-3 text-sm mt-2"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value })
          }
        />
      </FilterSection>
    </div>
  );
}

/* UI Helpers */
function FilterSection({ title, children }) {
  return (
    <div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-sm ${
        active
          ? "bg-black text-white border-black"
          : "border-gray-300 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
