"use client";

import { useGetPendingPropertiesQuery } from "@/store/services/adminApi";
import { useAdminUpdatePropertyStatusMutation } from "@/store/services/PropertiesApi";
import toast from "react-hot-toast";

export default function PendingPropertiesPage() {
  const { data, isLoading } = useGetPendingPropertiesQuery();
  const [updateStatus] = useAdminUpdatePropertyStatusMutation();

  if (isLoading) return <p className="p-6">Loading properties...</p>;

  return (
    <div className="p-6 space-y-6 bg-[#f6f8f7] min-h-screen">
      <h1 className="text-2xl font-bold">Pending Property Approvals</h1>

      {data?.properties?.length === 0 && (
        <p>No pending properties for approval.</p>
      )}

      {data?.properties?.map((p) => (
        <div
          key={p._id}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* IMAGE PREVIEW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-gray-50">
            {p.images?.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img.url}
                className="h-32 w-full object-cover rounded-lg"
              />
            ))}
          </div>

          {/* DETAILS */}
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{p.title}</h2>
              <p className="text-gray-600">{p.description}</p>

              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <p>
                  <b>Type:</b> {p.propertyType}
                </p>
                <p>
                  <b>Listing:</b> {p.listingType}
                </p>
                <p>
                  <b>Beds:</b> {p.beds}
                </p>
                <p>
                  <b>Baths:</b> {p.baths}
                </p>
                <p>
                  <b>Area:</b> {p.areaSqFt} sq.ft
                </p>
                <p>
                  <b>Facing:</b> {p.facing}
                </p>
              </div>

              <div className="mt-3">
                <p className="font-semibold">Amenities</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {p.amenities?.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-2 py-1 bg-gray-200 rounded-full"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <b>Price Label:</b> {p.priceLabel}
              </p>
              <p>
                <b>Price Value:</b> ₹ {p.priceValue?.toLocaleString()}
              </p>
              <p>
                <b>City:</b> {p.city}
              </p>
              <p>
                <b>State:</b> {p.state}
              </p>
              <p>
                <b>Address:</b> {p.address}
              </p>

              <div className="pt-3 border-t mt-3">
                <p className="font-semibold">Owner Details</p>
                <p>{p.owner?.name}</p>
                <p>{p.owner?.email}</p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
            
            <button
              onClick={async () => {
                const loadingToast = toast.loading("Approving property...");

                try {
                  await updateStatus({
                    id: p._id,
                    approvalStatus: "approved",
                  }).unwrap();

                  toast.success("Property approved successfully 🎉", {
                    id: loadingToast,
                  });
                } catch (error) {
                  toast.error("Approval failed ❌", {
                    id: loadingToast,
                  });
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              Approve
            </button>

            <button
              onClick={async () => {
                const reason = prompt("Enter reason for rejection:");
                if (!reason) return;

                const loadingToast = toast.loading("Rejecting property...");

                try {
                  await updateStatus({
                    id: p._id,
                    approvalStatus: "rejected",
                    rejectionReason: reason,
                  }).unwrap();

                  toast.success("Property rejected ❌", {
                    id: loadingToast,
                  });
                } catch (error) {
                  toast.error("Rejection failed", {
                    id: loadingToast,
                  });
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
            >
              Reject
            </button>

          </div>
          </div>
      ))}
    </div>
  );
}

