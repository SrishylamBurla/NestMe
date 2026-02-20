export default function UserHero({ user }) {
  return (
    <div className="bg-white p-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center gap-6">
        <div className="size-16 p-2 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold">
          {user.name?.[0]}
        </div>

        <div>
          <h1 className="text-3xl font-bold capitalize">
            {user.name}
          </h1>
          <p className="text-gray-500 mt-1">
            Property Owner
          </p>
        </div>
      </div>
    </div>
  );
}
