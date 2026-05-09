"use client";

import Image from "next/image";
import toast from "react-hot-toast";

import {
  CheckCircle2,
  XCircle,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Building2,
  IndianRupee,
  User,
  Mail,
} from "lucide-react";

import { useGetPendingPropertiesQuery } from "@/store/services/adminApi";

import { useAdminUpdatePropertyStatusMutation } from "@/store/services/PropertiesApi";

export default function PendingPropertiesPage() {
  const { data, isLoading } =
    useGetPendingPropertiesQuery();

  const [updateStatus] =
    useAdminUpdatePropertyStatusMutation();

  const properties =
    data?.properties || [];

  if (isLoading) {
    return (
      <div className="p-6">
        Loading properties...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f7] p-4 sm:p-6">
      <div className="space-y-6">

        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Pending Property Approvals
          </h1>

          <p className="text-gray-500 mt-1">
            Review and approve submitted properties
          </p>
        </div>

        {/* ================= EMPTY ================= */}
        {properties.length === 0 && (
          <div
            className="
              bg-white rounded-2xl
              border border-gray-100
              shadow-sm p-10
              text-center
            "
          >
            <Building2
              size={40}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-lg font-semibold mt-4">
              No Pending Properties
            </h2>

            <p className="text-gray-500 mt-1">
              All properties are reviewed
            </p>
          </div>
        )}

        {/* ================= PROPERTY LIST ================= */}
        {properties.map((p) => (
          <div
            key={p._id}
            className="
              bg-white rounded-3xl
              shadow-sm border border-gray-100
              overflow-hidden
            "
          >

            {/* ================= IMAGES ================= */}
            <div
              className="
                grid grid-cols-2
                md:grid-cols-4
                gap-2 p-3
                bg-gray-50
              "
            >
              {p.images
                ?.slice(0, 4)
                .map((img, i) => (
                  <div
                    key={i}
                    className="
                      relative overflow-hidden
                      rounded-xl aspect-[4/3]
                    "
                  >
                    <Image
                      src={img.url}
                      alt="Property Image"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>

            {/* ================= CONTENT ================= */}
            <div
              className="
                grid lg:grid-cols-2
                gap-8 p-5 sm:p-6
              "
            >

              {/* ================= LEFT ================= */}
              <div className="space-y-5">

                {/* TITLE */}
                <div>
                  <h2
                    className="
                      text-2xl font-bold
                      text-gray-900
                    "
                  >
                    {p.title}
                  </h2>

                  <div
                    className="
                      flex items-center gap-2
                      text-gray-500 mt-2
                    "
                  >
                    <MapPin size={16} />

                    <span>
                      {p.city},{" "}
                      {p.state}
                    </span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 leading-relaxed">
                  {p.description}
                </p>

                {/* QUICK INFO */}
                <div
                  className="
                    grid grid-cols-2
                    sm:grid-cols-4 gap-4
                  "
                >
                  <InfoCard
                    icon={
                      <Building2 size={18} />
                    }
                    label="Type"
                    value={
                      p.propertyType
                    }
                  />

                  <InfoCard
                    icon={
                      <BedDouble size={18} />
                    }
                    label="Beds"
                    value={p.beds}
                  />

                  <InfoCard
                    icon={
                      <Bath size={18} />
                    }
                    label="Baths"
                    value={p.baths}
                  />

                  <InfoCard
                    icon={
                      <Square size={18} />
                    }
                    label="Area"
                    value={`${p.areaSqFt} sq.ft`}
                  />
                </div>

                {/* AMENITIES */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Amenities
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {p.amenities?.map(
                      (a) => (
                        <span
                          key={a}
                          className="
                            text-sm px-3 py-1.5
                            bg-gray-100
                            rounded-full
                            text-gray-700
                          "
                        >
                          {a}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* ================= RIGHT ================= */}
              <div className="space-y-5">

                {/* PRICE */}
                <div
                  className="
                    bg-yellow-50
                    border border-yellow-100
                    rounded-2xl p-5
                  "
                >
                  <div className="flex items-center gap-2 text-yellow-700">
                    <IndianRupee size={20} />

                    <span className="font-semibold">
                      Price Details
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold mt-3">
                    {p.priceLabel}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    ₹{" "}
                    {p.priceValue?.toLocaleString()}
                  </p>
                </div>

                {/* PROPERTY DETAILS */}
                <div
                  className="
                    bg-gray-50 rounded-2xl
                    p-5 space-y-3
                  "
                >
                  <h3 className="font-semibold text-gray-900">
                    Property Details
                  </h3>

                  <DetailRow
                    label="Listing Type"
                    value={
                      p.listingType
                    }
                  />

                  <DetailRow
                    label="Facing"
                    value={p.facing}
                  />

                  <DetailRow
                    label="Address"
                    value={p.address}
                  />
                </div>

                {/* OWNER */}
                <div
                  className="
                    bg-gray-50 rounded-2xl
                    p-5 space-y-3
                  "
                >
                  <h3 className="font-semibold text-gray-900">
                    Owner Details
                  </h3>

                  <div className="flex items-center gap-3">
                    <User
                      size={18}
                      className="text-gray-500"
                    />

                    <span>
                      {p.owner?.name || p.agent?.name || p.user?.name || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail
                      size={18}
                      className="text-gray-500"
                    />

                    <span>
                      {p.owner?.email || p.agent?.email || p.user?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <div
              className="
                flex flex-col sm:flex-row
                justify-end gap-3
                p-5 border-t bg-gray-50
              "
            >

              {/* APPROVE */}
              <button
                onClick={async () => {
                  const loadingToast =
                    toast.loading(
                      "Approving property..."
                    );

                  try {
                    await updateStatus({
                      id: p._id,
                      approvalStatus:
                        "approved",
                    }).unwrap();

                    toast.success(
                      "Property approved successfully 🎉",
                      {
                        id: loadingToast,
                      }
                    );
                  } catch (error) {
                    toast.error(
                      "Approval failed ❌",
                      {
                        id: loadingToast,
                      }
                    );
                  }
                }}
                className="
                  flex items-center justify-center
                  gap-2
                  bg-green-600 hover:bg-green-700
                  text-white
                  px-5 py-3 rounded-xl
                  transition font-medium
                "
              >
                <CheckCircle2 size={18} />
                Approve
              </button>

              {/* REJECT */}
              <button
                onClick={async () => {
                  const reason =
                    prompt(
                      "Enter reason for rejection:"
                    );

                  if (!reason) return;

                  const loadingToast =
                    toast.loading(
                      "Rejecting property..."
                    );

                  try {
                    await updateStatus({
                      id: p._id,
                      approvalStatus:
                        "rejected",
                      rejectionReason:
                        reason,
                    }).unwrap();

                    toast.success(
                      "Property rejected ❌",
                      {
                        id: loadingToast,
                      }
                    );
                  } catch (error) {
                    toast.error(
                      "Rejection failed",
                      {
                        id: loadingToast,
                      }
                    );
                  }
                }}
                className="
                  flex items-center justify-center
                  gap-2
                  bg-red-600 hover:bg-red-700
                  text-white
                  px-5 py-3 rounded-xl
                  transition font-medium
                "
              >
                <XCircle size={18} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        bg-gray-50 rounded-2xl
        p-4 text-center
      "
    >
      <div
        className="
          flex justify-center
          text-gray-600 mb-2
        "
      >
        {icon}
      </div>

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <h3 className="font-semibold mt-1">
        {value}
      </h3>
    </div>
  );
}

/* ================= DETAIL ROW ================= */

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium text-right">
        {value}
      </span>
    </div>
  );
}