import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export async function POST(req) {
  try {
    await connectDB();

    const { email, name, image } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    // 👉 create if new user
    if (!user) {
      user = await User.create({
        email,
        name,
        image,
        role: "user",
      });
    }

    const token = generateToken(user._id);

    cookies().set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

    return NextResponse.json({
      id: user._id,
    });
  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}