import LeadsClient from "./LeadsClient";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function AgentLeadsPage(context) {
  const { agentId } = await context.params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-4 font-sans">

        <div className="mb-4 flex justify-between border-b border-slate-300 pb-2 items-center">
          <Link
            href="/"
            className="text cursor-pointer bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Leads Dashboard
          </h1>

          <div className="w-[80px]" />
        </div>

        <LeadsClient agentId={agentId} />
      </div>
    </div>
  );
}
