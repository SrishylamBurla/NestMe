"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HelpWidget() {

  const router = useRouter();

  return (
    <>
      {/* ================= FLOATING SUPPORT BUTTON ================= */}

      <div className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-[999]">

        {/* ONLINE BADGE */}
        {/* <div className="absolute -top-2 -right-1 w-5 h-5 z-[50] rounded-full bg-emerald-500 border-4 border-white animate-pulse" /> */}

        {/* BUTTON */}
        <button
          onClick={() => router.push("/support")}
          className="
          group
          relative
          w-16 h-16
          rounded-full
          overflow-hidden
          bg-gray-800
          shadow-inner
          hover:scale-110
          active:scale-95
          transition-all
          duration-300
          flex
          items-center
          justify-center
          border
          border-white/20
          backdrop-blur-xl
          "
        >
          {/* GLOW */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />

          {/* ICON */}
          <Image
            src="/icons/messages.png"
            alt="Support"
            width={34}
            height={34}
            className="object-contain relative z-10"
          />
        </button>

        
      </div>
    </>
  );
}