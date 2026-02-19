"use client";

import { useRouter } from "next/navigation";
import { useGetAgentPropertiesQuery } from "@/store/services/agentApi";
import { useGetMeQuery } from "@/store/services/authApi";

const PropertyCard = ({ property }) => {
  const router = useRouter();

  const statusColor =
    property.approvalStatus === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : property.approvalStatus === "rejected"
      ? "bg-red-100 text-red-700"
      : property.listingStatus === "sold" ||
        property.listingStatus === "rented"
      ? "bg-gray-300 text-gray-800"
      : "bg-green-100 text-green-700";

  const statusText =
    property.approvalStatus === "pending"
      ? "Pending"
      : property.approvalStatus === "rejected"
      ? "Rejected"
      : property.listingStatus === "sold"
      ? "Sold"
      : property.listingStatus === "rented"
      ? "Rented"
      : "Available";

  return (
    <div
      onClick={() =>
        router.push(`/agents/${property.agent}/properties/${property._id}`)
      }
      className="min-w-[240px] bg-white rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
    >
      <div
        className="h-32 bg-gray-300 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${
            property.images?.[0]?.url ||
            "/propertyImg/placeholder-property.jpg"
          })`,
        }}
      >
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${statusColor}`}
        >
          {statusText}
        </span>
      </div>

      <div className="p-3 space-y-1">
        <p className="font-bold text-lg">
          ₹{property.priceValue?.toLocaleString()}
        </p>
        <p className="text-sm truncate">{property.title}</p>
        <p className="text-xs text-gray-500">
          {property.city}, {property.state}
        </p>
      </div>
    </div>
  );
};

export default function PropertiesPreview() {
  const { data: user } = useGetMeQuery();
  const agentId = user?.agentProfileId;

  const { data, isLoading } = useGetAgentPropertiesQuery(agentId, {
    skip: !agentId,
  });

  const properties = data?.properties?.slice(0, 5) || [];

  return (
    <div className="px-4 py-4">
      <h3 className="text-lg font-bold mb-3">Your Properties</h3>

      {isLoading && (
        <p className="text-sm text-gray-500">
          Loading properties...
        </p>
      )}

      {!isLoading && properties.length === 0 && (
        <p className="text-sm text-gray-400">
          No listings yet
        </p>
      )}

      <div className="flex gap-4 overflow-x-auto no-scrollbar p-2">
        {properties.map((p) => (
          <PropertyCard key={p._id} property={p} />
        ))}
      </div>
    </div>
  );
}
