export default function AgentHero({ agent }) {
  return (
    <div className="bg-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 items-center">
        {/* Avatar */}
        <div className="size-28 rounded-full bg-[#36e27b]/20 flex items-center justify-center text-3xl font-bold text-black">
          {agent.user?.name?.[0]}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
            {agent.user?.name}
            {agent.verified && (
              <span className="material-symbols-outlined text-blue-500">
                verified
              </span>
            )}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {agent.designation} • {agent.city}
          </p>

          <div className="flex justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
            <span>⭐ {agent.rating}</span>
            <span>{agent.experienceYears}+ yrs experience</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 shadow-sm rounded-xl p-4 w-full md:w-auto">
          <p className="text-xs text-gray-500 mb-1">Contact</p>
          <p className="text-sm font-semibold">{agent.phone}</p>
          <p className="text-sm text-gray-600">{agent.user?.email}</p>
        </div>
      </div>
    </div>
  );
}
