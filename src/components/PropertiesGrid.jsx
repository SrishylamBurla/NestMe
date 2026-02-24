import Link from "next/link";
import PropertyCard from "./PropertyCard";

export default function PropertiesGrid({ properties }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2">
      {properties.map((property) => (
        <div
          // href={`/properties/${property._id}`}
          key={property._id}
          className="group"
        >
            <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
}
