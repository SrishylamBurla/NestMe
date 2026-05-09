"use client";

import Link from "next/link";

import {
  Trash2,
  Eye,
  MapPin,
  Pencil,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

export default function PropertiesTable({
  data,
  onDelete,
}) {
  return (
    <div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">

            <thead className="bg-gray-50 border-b">
              <tr className="text-sm text-gray-600">
                <th className="p-4 text-left">
                  Property
                </th>

                <th className="p-4 text-left">
                  City
                </th>

                <th className="p-4 text-center">
                  Price
                </th>

                <th className="p-4 text-center">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.map((property) => (
                <tr
                  key={property._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* PROPERTY */}
                  <td className="p-4">
                    <div>
                      <Link href={`/admin/properties/${property._id}`} className="text-blue-600 hover:underline" >
                <span className="font-medium truncate">{property.title}</span>
              </Link>

                      <p className="text-sm text-gray-500 mt-1">
                        {
                          property.location
                            ?.lat
                        }
                        ,{" "}
                        {
                          property.location
                            ?.lng
                        }
                      </p>
                    </div>
                  </td>

                  {/* CITY */}
                  <td className="p-4">
                    {property.city}
                  </td>

                  {/* PRICE */}
                  <td className="p-4 text-center font-semibold">
                    ₹
                    {
                      property.priceLabel
                    }
                  </td>

                  {/* STATUS */}
                  <td className="p-4 text-center">
                    <StatusBadge
                      status={
                        property.approvalStatus
                      }
                    />
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">

                      {/* VIEW */}
                      <Link
                        href={`/properties/${property._id}`}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* EDIT */}
                      <Link
                        href={`/admin/properties/edit/${property._id}`}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      >
                        <Pencil size={18} />
                      </Link>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          onDelete(
                            property
                          )
                        }
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden space-y-4">
        {data?.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
          >

            {/* TITLE */}
            <div>
              <Link href={`/admin/properties/${property._id}`} className="text-blue-600 hover:underline" >
                <span className="font-medium truncate">{property.title}</span>
              </Link>
              

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <MapPin size={15} />

                <span>
                  {property.city}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {
                  property.location
                    ?.lat
                }
                ,{" "}
                {
                  property.location
                    ?.lng
                }
              </p>
            </div>

            {/* PRICE */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Price
              </p>

              <h3 className="text-2xl font-bold">
                ₹
                {
                  property.priceLabel
                }
              </h3>
            </div>

            {/* STATUS */}
            <div className="mt-4">
              <StatusBadge
                status={
                  property.approvalStatus
                }
              />
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-3 gap-3 mt-5">

              {/* VIEW */}
              <Link
                href={`/properties/${property._id}`}
                className="flex items-center justify-center py-3 rounded-xl bg-black text-white"
              >
                <Eye size={18} />
              </Link>

              {/* EDIT */}
              <Link
                href={`/admin/properties/edit/${property._id}`}
                className="flex items-center justify-center py-3 rounded-xl bg-blue-100 text-blue-600"
              >
                <Pencil size={18} />
              </Link>

              {/* DELETE */}
              <button
                onClick={() =>
                  onDelete(
                    property
                  )
                }
                className="flex items-center justify-center py-3 rounded-xl bg-red-100 text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({
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
      Unapproved
    </span>
  );
}