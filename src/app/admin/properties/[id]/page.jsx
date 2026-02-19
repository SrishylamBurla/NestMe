"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useAdminUpdatePropertyStatusMutation,
  useGetPropertyByIdQuery,
} from "@/store/services/PropertiesApi";
import toast from "react-hot-toast";


export default function AdminPropertyDetails() {
  const { id } = useParams();
  const router = useRouter();

  const { data: property, isLoading } = useGetPropertyByIdQuery(id);
  const [updateStatus] = useAdminUpdatePropertyStatusMutation();

  if (isLoading) return <p className="p-6">Loading property...</p>;
  if (!property) return <p className="p-6">Property not found</p>;

const approve = async () => {
  const loadingToast = toast.loading("Approving property...");

  try {
    await updateStatus({
      id,
      approvalStatus: "approved",
    }).unwrap();

    toast.success("Property approved successfully", {
      id: loadingToast,
    });

    router.refresh();
  } catch (err) {
    toast.error("Failed to approve property", {
      id: loadingToast,
    });
  }
};


const reject = async () => {
  const reason = prompt("Reason for rejection?");
  if (!reason) return;

  const loadingToast = toast.loading("Rejecting property...");

  try {
    await updateStatus({
      id,
      approvalStatus: "rejected",
      rejectionReason: reason,
    }).unwrap();

    toast.success("Property rejected", {
      id: loadingToast,
    });

    router.refresh();
  } catch (err) {
    toast.error("Failed to reject property", {
      id: loadingToast,
    });
  }
};




  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <button
            onClick={() => router.back()}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-500 hover:bg-gray-600 transition"
          >
            <span className="material-symbols-outlined text-gray-100">
              arrow_back
            </span>
          </button>

      {/* ================= IMAGES ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {property.images?.map((img, i) => (
          <img
            key={i}
            src={img.url}
            alt="property"
            className="rounded-xl h-48 w-full object-cover shadow"
          />
        ))}
      </div>

      {/* ================= TITLE ================= */}
      <div>
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-gray-500">{property.city}, {property.state}</p>
      </div>

      {/* ================= STATUS ================= */}
      <div className="flex gap-3">
        <Badge label={property.approvalStatus} />
        <Badge label={property.listingType} />
        <Badge label={property.propertyType} />
      </div>

      {/* ================= BASIC INFO ================= */}
      <Section title="Property Details">
        <Info label="Price" value={`₹ ${property.priceValue?.toLocaleString()}`} />
        <Info label="Price Label" value={property.priceLabel} />
        <Info label="Area" value={`${property.areaSqFt} sq.ft`} />
        <Info label="Bedrooms" value={property.beds} />
        <Info label="Bathrooms" value={property.baths} />
        <Info label="Furnishing" value={property.furnishing} />
        <Info label="Facing" value={property.facing} />
      </Section>

      {/* ================= LOCATION ================= */}
      <Section title="Location">
        <Info label="Address" value={property.address} />
        <Info label="City" value={property.city} />
        <Info label="State" value={property.state} />
        <Info label="Latitude" value={property.location?.lat} />
        <Info label="Longitude" value={property.location?.lng} />
      </Section>

      {/* ================= AMENITIES ================= */}
      <Section title="Amenities">
        <div className="flex flex-wrap gap-2">
          {property.amenities?.length
            ? property.amenities.map((a) => (
                <span key={a} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                  {a}
                </span>
              ))
            : "No amenities"}
        </div>
      </Section>

      {/* ================= DESCRIPTION ================= */}
      <Section title="Description">
        <p className="text-gray-700 whitespace-pre-line">
          {property.description}
        </p>
      </Section>

      {/* ================= OWNER ================= */}
      <Section title="Owner Information">
        <Info label="Name" value={property.owner?.name} />
        <Info label="Email" value={property.owner?.email} />
      </Section>

      {/* ================= AGENT ================= */}
      {property.agent && (
        <Section title="Agent Information">
          <Info label="Agent ID" value={property.agent._id} />
          <Info label="Designation" value={property.agent.designation} />
          <Info label="Phone" value={property.agent.phone || "N/A"} />
        </Section>
      )}

      {/* ================= REJECTION REASON ================= */}
      {property.rejectionReason && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
          <b>Rejection Reason:</b> {property.rejectionReason}
        </div>
      )}

      {/* ================= ACTIONS ================= */}
      {/* ================= ACTIONS ================= */}
<div className="flex gap-4 pt-4 flex-wrap">

  {/* If Pending */}
  {property.approvalStatus === "pending" && (
    <>
      <button
        onClick={approve}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Approve
      </button>

      <button
        onClick={reject}
        className="bg-red-600 text-white px-6 py-2 rounded-lg"
      >
        Reject
      </button>
    </>
  )}

  {/* If Rejected */}
  {property.approvalStatus === "rejected" && (
    <>
      <button
        onClick={approve}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Approve Instead
      </button>

      <button
        onClick={async () => {
          await updateStatus({
            id,
            approvalStatus: "pending",
            rejectionReason: "",
          }).unwrap();

          toast.success("Property moved back to review");
          router.refresh();
        }}
        className="bg-yellow-600 text-white px-6 py-2 rounded-lg"
      >
        Move to Pending
      </button>
    </>
  )}

  {/* If Approved */}
  {property.approvalStatus === "approved" && (
    <button
      onClick={async () => {
        await updateStatus({
          id,
          approvalStatus: "pending",
        }).unwrap();

        toast.success("Property moved back to review");
        router.refresh();
      }}
      className="bg-gray-600 text-white px-6 py-2 rounded-lg"
    >
      Revoke Approval
    </button>
  )}

</div>

    </div>
  );
}

/* ---------- SMALL UI COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-3">
      <h2 className="font-semibold text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}

function Badge({ label }) {
  const colors = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    sale: "bg-blue-100 text-blue-700",
    rent: "bg-purple-100 text-purple-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[label] || "bg-gray-200"}`}>
      {label}
    </span>
  );
}
