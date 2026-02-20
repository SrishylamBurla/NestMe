export default function UserStats({ properties }) {
  const totalProperties = properties.length;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-2xl text-center shadow">
        <p className="text-2xl font-bold text-indigo-600">
          {totalProperties}
        </p>
        <p className="text-xs text-gray-500 uppercase">
          Properties
        </p>
      </div>
    </div>
  );
}
