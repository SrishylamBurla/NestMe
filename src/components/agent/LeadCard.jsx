

export default function LeadCard({ lead, role }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-sm">{lead.name}</h3>
        <span className="text-xs text-gray-400">
          {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-gray-600">{lead.email}</p>
      <p className="text-sm text-gray-600">{lead.phone}</p>

      <p className="text-sm mt-2">{lead.message}</p>

      {role === "agent" && lead.property && (
        <div className="mt-2 text-xs text-gray-500">
          Property: {lead.property.title}
        </div>
      )}
    </div>
  );
}
