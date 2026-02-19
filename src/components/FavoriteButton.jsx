import { useGetSavedPropertiesQuery } from "@/store/services/savedApi";

function FavoriteButton() {
  const router = useRouter();
  const { data } = useGetSavedPropertiesQuery();

  const count = data?.saved?.length || 0;

  return (
    <button
      onClick={() => router.push("/saved-properties")}
      className="relative p-2 rounded-full hover:bg-gray-100 transition"
    >
      <span className="material-symbols-outlined text-gray-700">
        favorite
      </span>

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs px-1.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
