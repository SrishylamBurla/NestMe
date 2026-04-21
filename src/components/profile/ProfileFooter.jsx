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

  const handleDeleteAccount = () => {
    router.push("http://localhost:3000/delete-account || https://www.nestme.in/delete-account");
  };

  return (
    <div className="px-4 pt-8 pb-10 space-y-4">

      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg"
      >
        Log Out
      </button>

      <button
        onClick={handleDeleteAccount}
        className="w-full py-3 rounded-full bg-slate-800 text-red-400 font-semibold border border-red-500/30"
      >
        Delete Account
      </button>

      <p className="text-center text-xs text-slate-500">
        NestMe v2.4.1
      </p>
    </div>
  );
}