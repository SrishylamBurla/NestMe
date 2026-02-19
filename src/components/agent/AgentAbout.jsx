export default function AgentAbout({ agent }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-3">About Agent</h2>

      <p className="text-sm text-gray-600 leading-relaxed">
        {agent.bio ||
          "Experienced real estate professional specializing in residential and commercial properties. Known for transparent dealings and strong local expertise."}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {(agent.specializations || ["Apartments", "Villas"]).map((s) => (
          <span
            key={s}
            className="px-3 py-1 text-xs rounded-full bg-[#36e27b]/20 text-[#2ec269] font-semibold"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
