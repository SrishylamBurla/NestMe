import { useGetMeQuery } from "@/store/services/authApi";
import Link from "next/link";

export default function ListingOptionsSection(){

  const { data: user } = useGetMeQuery();

  const isAgent = user?.role === "agent";

  return (
    <section className="px-6 py-16 bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e293b] text-white">

      <div className="max-w-6xl mx-auto text-center mb-12 font-sans">

        <h2 className="text-3xl md:text-4xl font-bold">
          List Your Property on NestMe
        </h2>

        <p className="text-white/80 mt-3 max-w-2xl mx-auto">
          Whether you're an individual owner or a professional agent,
          NestMe provides the right tools to sell or rent faster.
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* ===== OWNER CARD — ALWAYS SHOWN ===== */}
        <OwnerCard />

        {/* ===== RIGHT CARD — CONDITIONAL ===== */}
        {isAgent ? <AgentDashboardCard user={user} /> : <BecomeAgentCard />}

      </div>

    </section>
  );
}


function OwnerCard() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">

      <h3 className="text-xl font-bold font-sans">For Property Owners</h3>

      <p className="text-white/70 text-sm font-sans">
        Ideal for individuals who want to sell or rent their own property.
      </p>

      <ul className="space-y-3 text-sm text-white/80 font-sans">

        <li className="flex gap-3">
          <span className="material-symbols-outlined text-indigo-400">
            check_circle
          </span>
          Post up to <b>1 property</b> for free
        </li>

        <li className="flex gap-3">
          <span className="material-symbols-outlined text-indigo-400">
            visibility
          </span>
          Reach verified buyers & tenants
        </li>

      </ul>

      <Link
        href="/add-property"
        className="block text-center font-sans bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
      >
        Post Your Property
      </Link>

    </div>
  );
}

function BecomeAgentCard() {
  return (
    <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl space-y-6">

      <div className="absolute font-sans top-4 right-4 text-xs bg-white/20 px-3 py-1 rounded-full">
        Recommended
      </div>

      <h3 className="text-xl font-bold font-sans">For Real Estate Agents</h3>

      <ul className="space-y-3 text-sm text-white/95 font-sans">

        <li className="flex gap-3">
          <span className="material-symbols-outlined">
            check_circle
          </span>
          Post <b>unlimited properties</b>
        </li>

        <li className="flex gap-3">
          <span className="material-symbols-outlined">
            dashboard
          </span>
          Dedicated agent dashboard
        </li>

      </ul>

      <Link
        href="/subscribe"
        className="block text-center font-sans bg-white text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-50 transition"
      >
        Become an Agent
      </Link>

    </div>
  );
}

function AgentDashboardCard({ user }) {
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 shadow-2xl space-y-6 font-sans">

      <h3 className="text-xl font-bold">
        You are a Verified Agent
      </h3>

      <p className="text-white/90 text-sm font-sans">
        Manage listings, leads and enquiries from your dashboard.
      </p>

      <ul className="space-y-3 text-sm text-white/95 font-sans">

        <li className="flex gap-3">
          <span className="material-symbols-outlined">
            check_circle
          </span>
          Unlimited property listings
        </li>

        <li className="flex gap-3">
          <span className="material-symbols-outlined">
            groups
          </span>
          Receive verified leads
        </li>

        <li className="flex gap-3">
          <span className="material-symbols-outlined">
            analytics
          </span>
          Track performance & enquiries
        </li>

      </ul>

      <Link
        href={`/agents/${user?.agentProfileId}/dashboard`}
        className="block text-center bg-white font-sans text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-50 transition"
      >
        Go to Agent Dashboard
      </Link>

    </div>
  );
}