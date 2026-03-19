import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/getAuthUser";

export async function PUT(req) {
  await connectDB();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { oldPassword, newPassword } = await req.json();

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return NextResponse.json(
      { message: "Incorrect current password" },
      { status: 400 }
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return NextResponse.json({ message: "Password updated" });
}