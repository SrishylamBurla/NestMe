"use client";

import { useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  useGetUserByIdQuery,
  useGetUserPropertiesQuery,
} from "@/store/services/userApi";

import UserHero from "@/components/user/UserHero";
import UserStats from "@/components/user/UserStats";
import UserProperties from "@/components/user/UserProperties";
import UserAbout from "@/components/user/UserAbout";

export default function UserPublicProfilePage() {
  const { userId } = useParams();

  const { data: user, isLoading } = useGetUserByIdQuery(userId);

  const { data: properties } = useGetUserPropertiesQuery(
    user?._id ?? skipToken
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        User not found
      </div>
    );
  }

  return (
    <div className="bg-[#F2F4F3] min-h-screen pb-24">
      <UserHero user={user} />

      <div className="max-w-6xl mx-auto px-4 space-y-10 mt-6">
        <UserStats user={user} properties={properties?.properties || []} />
        <UserAbout user={user} />
        <UserProperties properties={properties?.properties || []} />
      </div>
    </div>
  );
}
