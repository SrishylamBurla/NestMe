export default function UserAbout({ user }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-md">
      <h2 className="text-xl font-bold mb-6">
        About Owner
      </h2>

      <div className="space-y-6 text-gray-600">

        <p>
          {user.bio || 
            "This property owner prefers direct communication regarding listings."
          }
        </p>

        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-indigo-500">
            calendar_month
          </span>
          <span>
            Member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
            })}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-indigo-500">
            verified
          </span>
          <span>Verified User</span>
        </div>

      </div>
    </div>
  );
}
