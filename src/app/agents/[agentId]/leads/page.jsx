import LeadsClient from "./LeadsClient";
import BackButton from "@/components/BackButton";

export default async function AgentLeadsPage(context) {
  const { agentId } = await context.params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="mb-8 flex justify-between items-center">
          <BackButton />

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
