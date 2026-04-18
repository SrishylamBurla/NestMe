"use client";


import ProfileHeader from "@/components/profile/ProfileHeader";
// import ProfileStats from "@/components/profile/ProfileStats";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfileFooter from "@/components/profile/ProfileFooter";
import { useAuth } from "@/hooks/useAuth";

export default function AccountCenterPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading account...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-28">
      <ProfileHeader user={user} />
      <ProfileSection user={user} />
      <ProfileFooter />
    </div>
  );
}