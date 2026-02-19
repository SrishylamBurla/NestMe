"use client";

import { useState, useMemo } from "react";
import { useGetAdminPropertiesQuery } from "@/store/services/AdminPropertiesApi";
import { useDeletePropertyMutation } from "@/store/services/PropertiesApi";

import AdminLayout from "@/components/admin/AdminLayout";
import PropertiesTable from "@/components/admin/PropertiesTable";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminPropertiesPage() {
  const { data, isLoading } = useGetAdminPropertiesQuery();
  const [deleteProperty] = useDeletePropertyMutation();

  const [filter, setFilter] = useState("all");

  // 🔥 Modal State
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const filteredProperties = useMemo(() => {
    if (!data?.properties) return [];

    if (filter === "approved")
      return data.properties.filter((p) => p.approvalStatus === "approved");

    if (filter === "rejected")
      return data.properties.filter((p) => p.approvalStatus === "rejected");

    return data.properties;
  }, [data, filter]);

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    const loadingToast = toast.loading("Deleting property...");

    try {
      await deleteProperty(propertyToDelete._id).unwrap();

      toast.success("Property deleted successfully", {
        id: loadingToast,
      });

      setPropertyToDelete(null);
    } catch (err) {
      toast.error("Failed to delete property", {
        id: loadingToast,
      });
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminLayout
        title="Properties"
        action={
          <Link href="/add-property">
            <PrimaryButton>+ Add Property</PrimaryButton>
          </Link>
        }
      >
        {/* FILTER TABS */}
        <div className="flex gap-3 mb-6">
          {["all", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === tab
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <PropertiesTable
          data={filteredProperties}
          onDelete={(property) => setPropertyToDelete(property)}
        />
      </AdminLayout>

      {/* 🔥 CONFIRMATION MODAL */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              Delete Property?
            </h2>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {propertyToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
