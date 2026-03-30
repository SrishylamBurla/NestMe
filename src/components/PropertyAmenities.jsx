export default function PropertyAmenities({ amenities = [] }) {
  if (!amenities.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5 text-slate-900">
        Amenities
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {amenities.map((a) => (
          <div
            key={a}
            className="
              rounded-2xl
              bg-white
              border border-slate-200
              p-4
              flex flex-col items-center justify-center
              gap-2
              hover:shadow-md hover:-translate-y-1
              transition
            "
          >
            <span className="material-symbols-outlined text-indigo-600 text-[22px]">
              {a}
            </span>

            <span className="text-xs text-slate-600 text-center capitalize">
              {a.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}