import Link from "next/link";

export default function PropertiesTable({ data, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Property</th>
            <th className="px-4 py-3 text-center font-medium">City</th>
            <th className="px-4 py-3 text-center font-medium">BHK</th>
            <th className="px-4 py-3 text-center font-medium">Price</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr key={p._id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <Link href={`/admin/properties/${p._id}`} className="text-blue-600 hover:underline" >
                  <span className="font-medium truncate">{p.title}</span>
                  </Link>
                  <span className="text-xs text-gray-500">
                    {p.location?.lat && p.location?.lng
                      ? `${p.location.lat}, ${p.location.lng}`
                      : "No coordinates"}
                  </span>
                </div>
              </td>

              <td className="px-4 py-4 text-center">{p.city}</td>

              <td className="px-4 py-4 text-center">{p.beds}</td>

              <td className="px-4 py-4 text-center">{p.priceLabel}</td>

              <td className="px-4 py-4 flex justify-end gap-4">
                <Link
                  href={`/admin/properties/edit/${p._id}`}
                  className="text-sm underline"
                >
                  Edit
                </Link>

                <button
                  onClick={() => onDelete(p)}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
