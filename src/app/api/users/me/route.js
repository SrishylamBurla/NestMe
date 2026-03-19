
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/getAuthUser";

export async function PUT(req) {
  await connectDB();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { name, email, phone } = await req.json();

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.phone = phone ?? user.phone;

  await user.save();

  return NextResponse.json({ message: "Profile updated" });
}