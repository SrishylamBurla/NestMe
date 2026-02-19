export default function PropertyResultCard({ property }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* IMAGE */}
      <div className="relative aspect-[16/10]">
        <img
          src={property.images?.[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* TAGS */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isVerified && (
            <Tag color="green">Verified</Tag>
          )}
          {property.isRera && <Tag>RERA</Tag>}
        </div>

        {/* HEART */}
        <button className="absolute top-3 right-3 h-8 w-8 bg-black/30 rounded-full flex items-center justify-center text-white">
          <span className="material-symbols-outlined">
            favorite
          </span>
        </button>
      </div>

      {/* BODY */}
      <div className="p-4">
        <div className="flex justify-between mb-1">
          <h3 className="text-lg font-bold">
            {property.priceLabel}
          </h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            ₹ {property.pricePerSqFt}/sq.ft
          </span>
        </div>

        <h4 className="text-sm font-semibold mb-1">
          {property.title}
        </h4>

        <p className="text-xs text-gray-500 flex gap-1 mb-4">
          <span className="material-symbols-outlined text-sm">
            location_on
          </span>
          {property.address}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button className="flex-1 h-10 border border-blue-600 text-blue-600 font-bold rounded-xl">
            Contact
          </button>
          <button className="flex-1 h-10 bg-blue-600 text-white font-bold rounded-xl">
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function Tag({ children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
  };

  return (
    <span
      className={`${colors[color]} text-white text-[10px] font-bold px-2 py-1 rounded`}
    >
      {children}
    </span>
  );
}
