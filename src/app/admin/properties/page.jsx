"use client";

import { useState, useMemo } from "react";
import { useGetAdminPropertiesQuery } from "@/store/services/AdminPropertiesApi";
import { useDeletePropertyMutation } from "@/store/services/PropertiesApi";

import AdminLayout from "@/components/admin/AdminLayout";
import PropertiesTable from "@/components/admin/PropertiesTable";
import PrimaryButton from "@/components/ui/PrimaryButton";

import Link from "next/link";
import toast from "react-hot-toast";

import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock3,
  Plus,
} from "lucide-react";

export default function AdminPropertiesPage() {
  const { data, isLoading } =
    useGetAdminPropertiesQuery();

  const [deleteProperty] =
    useDeletePropertyMutation();

  const [filter, setFilter] =
    useState("all");

  const [propertyToDelete, setPropertyToDelete] =
    useState(null);

  const properties =
    data?.properties || [];

  // ================= FILTER =================
  const filteredProperties = useMemo(() => {
    if (!properties.length) return [];

    if (filter === "approved") {
      return properties.filter(
        (p) =>
          p.approvalStatus ===
          "approved"
      );
    }

    if (filter === "rejected") {
      return properties.filter(
        (p) =>
          p.approvalStatus ===
          "rejected"
      );
    }

    if (filter === "unapproved") {
      return properties.filter(
        (p) =>
          p.approvalStatus !==
            "approved" &&
          p.approvalStatus !==
            "rejected"
      );
    }

    return properties;
  }, [properties, filter]);

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
    <div className="min-h-screen mobile-safe-top bg-gray-50">
      <AdminLayout>
        <div className="space-y-6">

          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
          <PropertiesTable
            data={filteredProperties}
            onDelete={(property) =>
              setPropertyToDelete(
                property
              )
            }
          />
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