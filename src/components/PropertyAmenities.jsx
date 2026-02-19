export default function PropertyAmenities({ amenities = [] }) {
  if (!amenities.length) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Amenities</h2>

      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {amenities.map((a) => (
          <div
            key={a}
            className="aspect-square rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <span className="material-symbols-outlined text-indigo-600"
              >
              {a}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {a.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
