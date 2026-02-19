"use client";

import { useLogoutMutation } from "@/store/services/authApi";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    logout().then(() => router.push("/login"));
  }, []);

  return null;
}
