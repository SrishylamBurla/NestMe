// "use client";

// import { useLogoutMutation } from "@/store/services/authApi";
// import { useRouter } from "next/navigation";

// export default function ProfileFooter() {
//   const [logout] = useLogoutMutation();
//   const router = useRouter();

//   const handleLogout = async () => {
//     await logout();
//     router.push("/login");
//   };

//   return (
//     <div className="px-4 pt-8 pb-10">
//       <button
//         onClick={handleLogout}
//         className="w-full py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
//       >
//         Log Out
//       </button>

//       <p className="text-center text-xs text-slate-500 mt-4">
//         App Version 2.4.1
//       </p>
//     </div>
//   );
// }


"use client";

import { useLogoutMutation } from "@/store/services/authApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfileFooter() {
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <div className="px-4 pt-8 pb-10 space-y-4">

      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-600 font-semibold shadow-lg"
      >
        Log Out
      </button>

      <button className="w-full py-3 rounded-full bg-slate-700 text-red-400">
        Delete Account
      </button>

      <p className="text-center text-xs text-slate-500">
        NestMe v2.4.1
      </p>
    </div>
  );
}