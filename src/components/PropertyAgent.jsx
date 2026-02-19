import AgentContactForm from "./agent/AgentContactForm";
import Link from "next/link";

export default function PropertyAgent({ property }) {
  
  const agent = property.agent;
  const owner = property.owner;

  const isAgentListing = !!agent;

  const personName = isAgentListing
    ? agent.user?.name
    : owner?.name;

  const personInitial = personName?.[0];

  const roleLabel = isAgentListing ? "Listing Agent" : "Property Owner";

  const profileLink = isAgentListing
    ? `/agents/${agent._id}`
    : "#"; // you can later add /users/[id]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{roleLabel}</h2>

      {/* Profile Card */}
      <Link
        href={profileLink}
        className="flex items-center gap-4 p-5 bg-gradient-to-r from-white to-indigo-50 rounded-3xl shadow-md hover:shadow-xl transition"

      >
        <div className="size-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 text-white flex items-center justify-center font-bold text-lg shadow-md"
          >
          {personInitial}
        </div>

        <div>
          <p className="font-bold capitalize">{personName}</p>
          <p className="text-xs text-gray-500">
            {isAgentListing ? agent.designation : "Owner"}
          </p>
        </div>
      </Link>

      {/* Contact Form */}
      <AgentContactForm propertyId={property._id} />
    </div>
  );
}
