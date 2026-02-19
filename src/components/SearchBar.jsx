"use client";

import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  const handleOpenSearch = () => {
    router.push("/search");
  };

  return (
    <section className="relative w-full">
      <div
        onClick={handleOpenSearch}
        className="
          relative
          group
          cursor-text
          transition-all duration-300
        "
      >
        {/* Search Container */}
        <div className="
          relative
          bg-white
          rounded-2xl
          shadow-xl
          hover:shadow-2xl
          transition-all duration-300
          border border-gray-200
        ">

          {/* Icon */}
          <span className="
            material-symbols-outlined
            absolute left-5 top-1/2 -translate-y-1/2
            text-gray-400
            group-hover:text-indigo-600
            transition
          ">
            search
          </span>

          {/* Input */}
          <input
            readOnly
            placeholder="Search city, locality, project"
            className="
              w-full
              pl-14 pr-5
              py-4
              text-sm sm:text-base
              rounded-2xl
              bg-transparent
              focus:outline-none
              placeholder:text-gray-400
              cursor-pointer
            "
          />
        </div>

        {/* Subtle glow effect */}
        <div className="
          absolute inset-0
          rounded-2xl
          bg-indigo-500/5
          blur-xl
          opacity-0
          group-hover:opacity-100
          transition duration-300
          -z-10
        " />
      </div>
    </section>
  );
}
