"use client";

import { useRouter } from "next/navigation";
import { useGetAgentPropertiesQuery } from "@/store/services/agentApi";
import { useAuth } from "@/hooks/useAuth";

const PropertyCard = ({ property, agentId }) => {
  const router = useRouter();

  const handleClick = () => {
    if (!agentId) return;
    router.push(`/agents/${agentId}/properties/${property._id}`);
  };

  const isPending = property.approvalStatus === "pending";
  const isRejected = property.approvalStatus === "rejected";

  const statusConfig = {
    pending: {
      text: "Pending Approval",
      color: "bg-yellow-100 text-yellow-700",
      overlay: "bg-yellow-500/20",
    },
    rejected: {
      text: "Rejected",
      color: "bg-red-100 text-red-700",
      overlay: "bg-red-500/20",
    },
    approved: {
      text:
        property.listingStatus === "sold"
          ? "Sold"
          : property.listingStatus === "rented"
          ? "Rented"
          : "Available",
      color:
        property.listingStatus === "sold" ||
        property.listingStatus === "rented"
          ? "bg-gray-300 text-gray-800"
          : "bg-green-100 text-green-700",
    },
  };

  const status =
    isPending
      ? statusConfig.pending
      : isRejected
      ? statusConfig.rejected
      : statusConfig.approved;

  return (
    <div
      onClick={handleClick}
      className="min-w-[260px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* IMAGE */}
      <div
        className={`h-36 bg-gray-300 bg-cover bg-center relative ${
          isPending || isRejected ? "grayscale" : ""
        }`}
        style={{
          backgroundImage: `url(${
            property.images?.[0]?.url ||
            "/propertyImg/placeholder-property.jpg"
          })`,
        }}
      >
        {/* STATUS BADGE */}
        <span
          className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold shadow ${status.color}`}
        >
          {status.text}
        </span>

        {/* OVERLAY (pending / rejected) */}
        {(isPending || isRejected) && (
          <div
            className={`absolute inset-0 ${status.overlay} flex items-center justify-center`}
          >
            <p className="text-sm font-semibold text-white bg-black/50 px-3 py-1 rounded">
              {status.text}
            </p>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-xl font-bold text-slate-900">
            ₹{property.priceValue?.toLocaleString()}
          </p>

          <h4 className="font-semibold text-slate-800 line-clamp-2 min-h-[44px]">
            {property.title}
          </h4>

          <p className="text-xs text-gray-500 mt-1">
            {property.city}, {property.state}
          </p>
        </div>

        {/* FOOTER ACTION HINT */}
        <div className="mt-3 text-xs text-gray-400">
          {isPending && "Waiting for admin approval"}
          {isRejected && "Tap to edit & resubmit"}
          {!isPending && !isRejected && "Tap to manage"}
        </div>
      </div>
    </div>
  );
};

export default function PropertiesPreview() {
  const { user, isLoading: userLoading } = useAuth()
 
  const agentId = user?.agentProfileId;

  const { data: propertiesData, isLoading } =
    useGetAgentPropertiesQuery(agentId, {
      skip: !agentId,
    });

  const properties = propertiesData?.properties?.slice(0, 5) || [];

  return (
    <div className="px-4 py-4">
      <h3 className="text-lg font-bold mb-3">Your Properties</h3>

      {(userLoading || isLoading) && (
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
          <PropertyCard
            key={p._id}
            property={p}
            agentId={agentId}
          />
        ))}
      </div>
    </div>
  );
}