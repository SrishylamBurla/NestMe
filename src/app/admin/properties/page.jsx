"use client";

import { useState, useMemo } from "react";
import { useGetAdminPropertiesQuery } from "@/store/services/AdminPropertiesApi";
import { useDeletePropertyMutation } from "@/store/services/PropertiesApi";

import AdminLayout from "@/components/admin/AdminLayout";
// import PropertiesTable from "@/components/admin/PropertiesTable";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock3,
  Plus,
  Search,
  User,
} from "lucide-react";
// import {
//   Eye,
//   Pencil,
//   Trash2,
// } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";

import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminPropertiesPage() {
  const { data, isLoading } =
    useGetAdminPropertiesQuery();

  const [deleteProperty] =
    useDeletePropertyMutation();

  const [filter, setFilter] =
    useState("all");

  const [search, setSearch] =
  useState("");

  const [propertyToDelete, setPropertyToDelete] =
    useState(null);

  const properties =
    data?.properties || [];

  // ================= FILTER =================
  // const filteredProperties = useMemo(() => {
  //   if (!properties.length) return [];

  //   if (filter === "approved") {
  //     return properties.filter(
  //       (p) =>
  //         p.approvalStatus ===
  //         "approved"
  //     );
  //   }

  //   if (filter === "rejected") {
  //     return properties.filter(
  //       (p) =>
  //         p.approvalStatus ===
  //         "rejected"
  //     );
  //   }

  //   if (filter === "unapproved") {
  //     return properties.filter(
  //       (p) =>
  //         p.approvalStatus !==
  //           "approved" &&
  //         p.approvalStatus !==
  //           "rejected"
  //     );
  //   }

  //   return properties;
  // }, [properties, filter]);

  const filteredProperties = useMemo(() => {
  let filtered = properties;

  if (filter === "approved") {
    filtered = filtered.filter(
      (p) =>
        p.approvalStatus ===
        "approved"
    );
  }

  if (filter === "rejected") {
    filtered = filtered.filter(
      (p) =>
        p.approvalStatus ===
        "rejected"
    );
  }

  if (filter === "unapproved") {
    filtered = filtered.filter(
      (p) =>
        p.approvalStatus !==
          "approved" &&
        p.approvalStatus !==
          "rejected"
    );
  }

  if (search.trim()) {
    filtered = filtered.filter(
      (p) =>
        p.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        p.city
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        p.owner?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );
  }

  return filtered;
}, [
  properties,
  filter,
  search,
]);

  // ================= STATS =================
  const stats = {
    total: properties.length,

    approved: properties.filter(
      (p) =>
        p.approvalStatus ===
        "approved"
    ).length,

    rejected: properties.filter(
      (p) =>
        p.approvalStatus ===
        "rejected"
    ).length,

    unapproved: properties.filter(
      (p) =>
        p.approvalStatus !==
          "approved" &&
        p.approvalStatus !==
          "rejected"
    ).length,
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!propertyToDelete) return;

    const loadingToast =
      toast.loading(
        "Deleting property..."
      );

    try {
      await deleteProperty(
        propertyToDelete._id
      ).unwrap();

      toast.success(
        "Property deleted successfully",
        {
          id: loadingToast,
        }
      );

      setPropertyToDelete(null);
    } catch (err) {
      toast.error(
        "Failed to delete property",
        {
          id: loadingToast,
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        Loading properties...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminLayout>
        <div className="space-y-6">

          {/* HEADER */}
          {/* <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Properties Management
              </h1>

              <p className="text-gray-500 mt-1">
                Manage all platform properties
              </p>
            </div>

            <Link href="/add-property">
              <PrimaryButton>
                <span className="flex items-center gap-2">
                  <Plus size={18} />
                  Add Property
                </span>
              </PrimaryButton>
            </Link>
          </div> */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

  <div>
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
      Properties Management
    </h1>

    <p className="text-gray-500 mt-1">
      Manage all platform properties
    </p>
  </div>

  <div className="flex flex-col sm:flex-row gap-3">

    <div className="relative w-full lg:w-80">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search properties..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>

    <Link href="/add-property">
      <PrimaryButton>
        <span className="flex items-center gap-2">
          <Plus size={18} />
          Add Property
        </span>
      </PrimaryButton>
    </Link>

  </div>

</div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatsCard
              title="Total Properties"
              value={stats.total}
              icon={<Building2 size={22} />}
            />

            <StatsCard
              title="Approved"
              value={stats.approved}
              icon={<CheckCircle2 size={22} />}
            />

            <StatsCard
              title="Rejected"
              value={stats.rejected}
              icon={<XCircle size={22} />}
            />

            <StatsCard
              title="Unapproved"
              value={stats.unapproved}
              icon={<Clock3 size={22} />}
            />
          </div>

          {/* FILTERS */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              "all",
              "approved",
              "unapproved",
              "rejected",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setFilter(tab)
                }
                className={`
                  px-4 py-2.5 rounded-xl
                  whitespace-nowrap
                  text-sm font-medium
                  transition
                  ${
                    filter === tab
                      ? "bg-black text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-100"
                  }
                `}
              >
                {tab
                  .charAt(0)
                  .toUpperCase() +
                  tab.slice(1)}
              </button>
            ))}
          </div>

          {/* TABLE */}

          {/* DESKTOP TABLE */}

<div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
  <div className="overflow-x-auto">

    <table className="w-full min-w-[1200px]">

      <thead className="bg-gray-50 border-b">
        <tr className="text-sm text-gray-600">
          <th className="p-4 text-left">
            Property
          </th>

          <th className="p-4 text-left">
            Owner
          </th>

          <th className="p-4 text-left">
            City
          </th>

          <th className="p-4 text-left">
            Price
          </th>

          <th className="p-4 text-center">
            Status
          </th>

          <th className="p-4 text-center">
            Action
          </th>
        </tr>
      </thead>

      <tbody>

        {filteredProperties.map(
          (property) => (
            <tr
              key={property._id}
              className="border-b hover:bg-gray-50 transition"
            >

              <td className="p-4">
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center">
                    <Building2 size={18} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {property.title}
                    </h3>
                  </div>

                </div>
              </td>

              <td className="p-4">
                {property.owner?.name}
              </td>

              <td className="p-4">
                {property.city}
              </td>

              <td className="p-4">
                ₹
                {property.priceValue?.toLocaleString()}
              </td>

              <td className="p-4 text-center">
                <PropertyStatusBadge
                  status={
                    property.approvalStatus
                  }
                />
              </td>

              {/* <td className="p-4 text-center">

                <button
                  onClick={() =>
                    setPropertyToDelete(
                      property
                    )
                  }
                  className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>

              </td> */}
              <td className="p-4">
  <div className="flex items-center justify-center gap-2">

    <Link
      href={`/properties/${property._id}`}
      className="
        px-3 py-2
        rounded-lg
        bg-blue-50
        text-blue-600
        hover:bg-blue-100
        transition
      "
    >
      View
    </Link>

    <Link
      href={`/admin/properties/edit/${property._id}`}
      className="
        px-3 py-2
        rounded-lg
        bg-yellow-50
        text-yellow-700
        hover:bg-yellow-100
        transition
      "
    >
      Edit
    </Link>

    <button
      onClick={() =>
        setPropertyToDelete(property)
      }
      className="
        px-3 py-2
        rounded-lg
        bg-red-50
        text-red-600
        hover:bg-red-100
        transition
      "
    >
      Delete
    </button>

  </div>
</td>

            </tr>
          )
        )}

      </tbody>

    </table>

  </div>
</div>

{/* MOBILE CARDS */}

<div className="lg:hidden space-y-4">

  {filteredProperties.map(
    (property) => (
      <div
        key={property._id}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
      >

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center">
            <Building2 size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              {property.title}
            </h2>

            <p className="text-sm text-gray-500">
              {property.city}
            </p>
          </div>

        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Owner
          </p>

          <p className="font-medium">
            {property.owner?.name}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Price
          </p>

          <p className="font-bold">
            ₹
            {property.priceValue?.toLocaleString()}
          </p>
        </div>

        <div className="mt-4">
          <PropertyStatusBadge
            status={
              property.approvalStatus
            }
          />
        </div>

        {/* <button
          onClick={() =>
            setPropertyToDelete(
              property
            )
          }
          className="mt-4 w-full bg-red-50 text-red-600 py-3 rounded-xl"
        >
          Delete Property
        </button> */}

        <div className="grid grid-cols-3 gap-2 mt-5">

  <Link
    href={`/properties/${property._id}`}
    className="
      text-center
      py-3
      rounded-xl
      bg-blue-50
      text-blue-600
      font-medium
    "
  >
    View
  </Link>

  <Link
    href={`/admin/properties/edit/${property._id}`}
    className="
      text-center
      py-3
      rounded-xl
      bg-yellow-50
      text-yellow-700
      font-medium
    "
  >
    Edit
  </Link>

  <button
    onClick={() =>
      setPropertyToDelete(property)
    }
    className="
      py-3
      rounded-xl
      bg-red-50
      text-red-600
      font-medium
    "
  >
    Delete
  </button>

</div>
      </div>
    )
  )}

</div>
          {/* <PropertiesTable
            data={filteredProperties}
            onDelete={(property) =>
              setPropertyToDelete(
                property
              )
            }
          /> */}
        </div>
      </AdminLayout>

      {/* DELETE MODAL */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold">
                Delete Property?
              </h2>

              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Are you sure you want
                to delete{" "}
                <span className="font-semibold">
                  {
                    propertyToDelete.title
                  }
                </span>
                ?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() =>
                  setPropertyToDelete(
                    null
                  )
                }
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="bg-yellow-100 text-yellow-700 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function PropertyStatusBadge({
  status,
}) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
        <CheckCircle2 size={15} />
        Approved
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
        <XCircle size={15} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
      <Clock3 size={15} />
      Pending
    </span>
  );
}