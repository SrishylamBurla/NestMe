import Link from "next/link";

export default function AgentProperties({ properties }) {
  if (!properties.length) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm text-center text-gray-500">
        No active listings from this agent
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Properties by this Agent
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <Link
            key={p._id}
            href={`/properties/${p._id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{
                backgroundImage: `url(${p.images?.[0]?.url || "/placeholder.jpg"})`,
              }}
            />

            <div className="p-4 space-y-1">
              <p className="font-bold truncate">{p.title}</p>
              <p className="text-sm text-gray-500">
                ₹ {p.priceValue}
              </p>

              <div className="flex gap-3 text-xs text-gray-600 pt-2">
                <span>{p.beds} Beds</span>
                <span>{p.baths} Baths</span>
                <span>{p.area} sq.ft</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
