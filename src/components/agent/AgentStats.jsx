export default function AgentStats({ agent }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Stat label="Active Listings" value={agent.totalListings ?? 0} />
      <Stat label="Deals Closed" value={agent.dealsClosed ?? 0} />
      <Stat label="Rating" value={agent.rating ?? 0} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 text-center shadow-md">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}
