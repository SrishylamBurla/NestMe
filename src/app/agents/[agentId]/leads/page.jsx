import LeadsClient from "./LeadsClient";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function AgentLeadsPage(context) {
  const { agentId } = await context.params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-gray-600 to-purple-200">
      <div className="max-w-7xl mx-auto px-4 py-4 font-sans">

        <div className="mb-4 flex justify-between pb-2 items-center">
          <Link
            href="/"
            className="text cursor-pointer bg-gray-50 rounded-full p-2 hover:bg-gray-300 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-800 via-yellow-800 to-pink-800 bg-clip-text text-transparent">
            My Leads
          </h1>

          <div className="w-[80px]" />
        </div>

        <LeadsClient agentId={agentId} />
      </div>
    </div>
  );
}
