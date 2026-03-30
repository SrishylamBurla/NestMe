import Link from "next/link";
import AgentContactForm from "./agent/AgentContactForm";

export default function PropertyAgent({ property }) {
  const agent = property?.agent;
  const owner = property?.owner;

  const isAgentListing = !!agent;

  const personName =
    agent?.user?.name || owner?.name || "Unknown";

  const profileLink = agent?._id
    ? `/agents/${agent._id}`
    : owner?._id
    ? `/users/${owner._id}`
    : "#";

  return (
    <div className="space-y-5">

      <h2 className="text-xl font-semibold">Contact</h2>

      <Link
        href={profileLink}
        className="
          flex items-center gap-4
          p-4 rounded-2xl
          border border-slate-200
          hover:shadow-md transition
        "
      >
        <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
          {personName[0]}
        </div>

        <div>
          <p className="font-semibold">{personName}</p>
          <p className="text-xs text-slate-500">
            {isAgentListing ? "Agent" : "Owner"}
          </p>
        </div>
      </Link>

      <AgentContactForm propertyId={property._id} />

    </div>
  );
}