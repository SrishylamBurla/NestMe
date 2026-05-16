

// "use client";

// import { useState } from "react";
// import SupportChat from "./SupportChat";
// import Image from "next/image";

// export default function HelpWidget() {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* ================= FLOATING SUPPORT BUTTON ================= */}

//       <div className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-[999]">

//         {/* ONLINE BADGE */}
//         <div className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white animate-pulse" />

//         {/* SUPPORT BUTTON */}
//         <button
//           onClick={() => setOpen(true)}
//           className="
//           group
//           relative
//           w-16 h-16
//           rounded-3xl
//           overflow-hidden
//           bg-gradient-to-br
//           from-indigo-600
//           via-violet-600
//           to-fuchsia-600
//           shadow-[0_20px_60px_rgba(79,70,229,0.45)]
//           hover:scale-110
//           active:scale-95
//           transition-all
//           duration-300
//           flex
//           items-center
//           justify-center
//           border
//           border-white/20
//           backdrop-blur-xl
//           "
//         >
//           {/* GLOW */}
//           <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />

//           {/* ICON */}
//           <Image
//             src="/icons/messages.png"
//             alt="Support"
//             width={34}
//             height={34}
//             className="object-contain relative z-10"
//           />
//         </button>

//         {/* SUPPORT LABEL */}
//         <div
//           className="
//           absolute
//           right-20
//           top-1/2
//           -translate-y-1/2
//           hidden
//           md:flex
//           flex-col
//           bg-white
//           px-4
//           py-3
//           rounded-2xl
//           shadow-2xl
//           border
//           border-slate-200
//           min-w-[220px]
//           "
//         >
//           <p className="text-sm font-bold text-slate-900">
//             NestMe Support
//           </p>

//           <p className="text-xs text-emerald-600 font-medium mt-1">
//             Usually replies within 30 mins
//           </p>
//         </div>
//       </div>

//       {/* ================= CHAT ================= */}

//       {open && (
//         <SupportChat
//           onClose={() => setOpen(false)}
//         />
//       )}
//     </>
//   );
// }

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

        {/* DESKTOP LABEL */}
        {/* <div
          className="
          absolute
          right-18
          top-1/2
          -translate-y-1/2
          hidden
          md:flex
          flex-col
          bg-gray-800
          px-3
          py-2
          rounded-2xl
          shadow-2xl
          border
          border-slate-200
          min-w-[220px]
          "
        >
          <p className="text-sm font-bold text-slate-200">
            NestMe Support
          </p>

          <p className="text-xs text-emerald-400 font-medium mt-1">
            Usually replies within 30 mins
          </p>
        </div> */}
      </div>
    </>
  );
}