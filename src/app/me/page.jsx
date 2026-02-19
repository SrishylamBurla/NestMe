"use client";

import { useGetMeQuery } from "@/store/services/authApi";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfileFooter from "@/components/profile/ProfileFooter";

export default function ProfilePage() {
  const { data: user, isLoading } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 pb-28">
      <ProfileHeader user={user} />
      <ProfileStats />
      <ProfileSection user={user} />
      <ProfileFooter />
    </div>
  );
}
