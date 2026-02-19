import Link from "next/link";

const transactionCategories = [
  {
    label: "Buy",
    icon: "real_estate_agent",
    listingType: "sale",
  },
  {
    label: "Rent",
    icon: "key",
    listingType: "rent",
  },
  {
    label: "Lease",
    icon: "contract",
    listingType: "lease",
  },
];

const propertyCategories = [
  { label: "Apartments", icon: "apartment", propertyType: "apartment" },
  { label: "Villas", icon: "villa", propertyType: "villa" },
  { label: "Plots", icon: "landscape", propertyType: "plot" },
  { label: "Commercial", icon: "storefront", propertyType: "commercial" },
];

export default function Categories() {
  return (
    <section className="space-y-8">

      {/* TRANSACTION TYPE */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Browse by Purpose</h3>

        <div className="grid grid-cols-3 gap-4">
          {transactionCategories.map((c) => (
            <Link
              key={c.label}
              href={`/properties?listingType=${c.listingType}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#2a7777] group-hover:bg-[#1a5555] transition shadow-md">
                <span className="material-symbols-outlined text-white">
                  {c.icon}
                </span>
              </div>
              <span className="text-sm font-medium">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* PROPERTY TYPE */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Browse by Property Type</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {propertyCategories.map((c) => (
            <Link
              key={c.label}
              href={`/properties?propertyType=${c.propertyType}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-500 group-hover:bg-indigo-600 transition shadow-md">
                <span className="material-symbols-outlined text-white">
                  {c.icon}
                </span>
              </div>
              <span className="text-sm text-center">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
