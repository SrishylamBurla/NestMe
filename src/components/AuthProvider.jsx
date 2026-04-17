"use client";

import { useGetMeQuery } from "@/store/services/authApi";

export default function AuthProvider({ children }) {
  const { data: user, isLoading } = useGetMeQuery();

  // optional: avoid flicker
  if (isLoading) return null;

  return children;
}