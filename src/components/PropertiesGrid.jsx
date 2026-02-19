import Link from "next/link";
import PropertyCard from "./PropertyCard";

export default function PropertiesGrid({ properties }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <div
          // href={`/properties/${property._id}`}
          key={property._id}
          className="group"
        >
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden border border-slate-100">
            <PropertyCard property={property} />
          </div>
        </div>
      ))}
    </div>
  );
}
