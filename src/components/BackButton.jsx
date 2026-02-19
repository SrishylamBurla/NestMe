"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center p-1 gap-2 bg-gray-700 hover:bg-gray-900 text-white rounded-full font-medium transition"
    >
      <span className="material-symbols-outlined">
        arrow_back
      </span>
    </button>
  );
}
