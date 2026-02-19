"use client";

import { useRouter } from "next/navigation";

export default function PropertyHero({ images = [] }) {
  const router = useRouter();

  const heroImage = images.length > 0 ? images[0]?.url : "/placeholder-property.jpg";

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Top Overlay */}
      {/* <div className="fixed top-0 left-0 w-full z-50 p-4 pt-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={() => router.back()}
          className="size-11 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white hover:bg-white/20 active:scale-95 transition"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="flex gap-3">
          <button className="size-11 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button className="size-11 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </div> */}

      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[4000ms] hover:scale-110"
        style={{ backgroundImage: `url('${heroImage}')` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    </div>
  );
}
