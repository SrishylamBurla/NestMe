"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDeletePropertyMutation } from "@/store/services/PropertiesApi";

export default function UserPropertyCard({ property }) {
  const router = useRouter();
  const [deleteProperty] = useDeletePropertyMutation();

  const [previewProperty, setPreviewProperty] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);

  /* ---------------- CARD CLICK ---------------- */
  const handleCardClick = () => {
    if (property.approvalStatus === "approved") {
      router.push(`/properties/${property._id}`);
    } else {
      setShowBlocked(true);
      setTimeout(() => setShowBlocked(false), 1200);
    }
  };

  const goToEdit = (e) => {
    e.stopPropagation();
    if (property.agent) {
      router.push(`/agents/${property.agent}/properties/edit/${property._id}`);
    } else {
      router.push(`/my-properties/edit/${property._id}`);
    }
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <div
        onClick={handleCardClick}
        className={`relative bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
          showBlocked ? "animate-shake border-red-400" : ""
        }`}
      >
        {/* Blocked Overlay */}
        {showBlocked && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
            {property.approvalStatus === "pending" && (
              <p className="text-yellow-600 font-semibold animate-pulse">
                Under Review ⏳
              </p>
            )}
            {property.approvalStatus === "rejected" && (
              <p className="text-red-600 font-semibold animate-pulse">
                Rejected — Fix & Resubmit ❌
              </p>
            )}
          </div>
        )}

        {/* IMAGE */}
        {/* <div className="relative">
          <img
            src={
              property.images?.[0] || "/propertyImg/placeholder-property.jpg"
            }
            className="h-44 w-full object-cover"
          />

          <div className="absolute top-3 left-3">
            <span
              className={`text-xs px-3 py-1 rounded-full text-white shadow-md ${
                property.approvalStatus === "approved"
                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                  : property.approvalStatus === "pending"
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                    : "bg-gradient-to-r from-red-400 to-pink-500"
              }`}
            >
              {property.approvalStatus}
            </span>
          </div>
        </div> */}

        <div className="relative">
          {/* Property Image */}
          <img
            src={
              property.images?.[0].url || "/propertyImg/placeholder-property.jpg"
            }
            alt="property"
            className={`w-full h-48 object-cover transition duration-300 ${
              property.approvalStatus === "rejected" ? "brightness-75" : ""
            }`}
          />

          {/* Rejection Overlay */}
          {property.approvalStatus === "rejected" &&
            property.rejectionReason && (
              <div className="absolute top-3 left-3 right-3">
                <div className="bg-red-600/90 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg shadow-lg line-clamp-2">
                  ❌ {property.rejectionReason}
                </div>
              </div>
            )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                property.approvalStatus === "approved"
                  ? "bg-green-500 text-white"
                  : property.approvalStatus === "pending"
                    ? "bg-yellow-400 text-black"
                    : "bg-red-500 text-white"
              }`}
            >
              {property.approvalStatus}
            </span>
          </div>
        </div>
        {/* CONTENT */}
        <div className="p-5 space-y-3">
          <h3 className="font-semibold text-base text-slate-800 line-clamp-1">
            {property.title}
          </h3>
          {/* {property.approvalStatus === "rejected" &&
            property.rejectionReason && (
              <div className="mt-2 bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">
                <b>Rejection Reason:</b> {property.rejectionReason}
              </div>
            )} */}

          <p className="text-sm text-slate-500">
            {property.city} • {property.beds} BHK
          </p>

          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            ₹{property.priceValue?.toLocaleString()}
          </p>

          {/* PERFORMANCE */}
          <div className="flex justify-between text-xs text-slate-500 bg-slate-50 rounded-xl p-2">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                visibility
              </span>
              {property.viewsCount || 0} Views
            </div>

            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                groups
              </span>
              {property.leadsCount || 0} Leads
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={goToEdit}
              className="flex-1 text-xs px-3 py-2 rounded-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition"
            >
              Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewProperty(property);
              }}
              className="flex-1 text-xs px-3 py-2 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
            >
              Preview
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(property._id);
              }}
              className="flex-1 text-xs px-3 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ================= PREVIEW MODAL ================= */}
      {previewProperty && (
        <div
          onClick={() => setPreviewProperty(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-[95%] max-w-3xl shadow-2xl overflow-hidden"
          >
            <img
              src={
                previewProperty.images?.[0] ||
                "/propertyImg/placeholder-property.jpg"
              }
              className="h-64 w-full object-cover"
            />

            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">{previewProperty.title}</h2>

              <p className="text-slate-500">
                {previewProperty.city}, {previewProperty.state}
              </p>

              <p className="text-3xl font-bold text-indigo-600">
                ₹{previewProperty.priceValue?.toLocaleString()}
              </p>

              <div className="flex gap-6 text-sm text-slate-600">
                <span>{previewProperty.beds} Beds</span>
                <span>{previewProperty.baths} Baths</span>
                {previewProperty.areaSqFt && (
                  <span>{previewProperty.areaSqFt} ft²</span>
                )}
              </div>

              <button
                onClick={() => setPreviewProperty(null)}
                className="mt-4 px-6 py-2 bg-slate-200 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {deleteId && (
        <div
          onClick={() => setDeleteId(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl"
          >
            <h3 className="text-lg font-bold">Delete Property?</h3>

            <p className="text-sm text-slate-500 mt-2">
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 h-11 rounded-full border border-slate-300"
              >
                Cancel
              </button>

              <button
                disabled={isDeleting}
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await deleteProperty(deleteId).unwrap();
                    setDeleteId(null);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="flex-1 h-11 rounded-full bg-red-500 text-white"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
