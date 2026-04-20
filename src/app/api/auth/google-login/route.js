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

    // 🔥 STEP 1: Find by email
    let user = await User.findOne({ email });

    // 🔥 STEP 2: If NOT found → check if phone user exists (merge case)
    if (!user) {
      user = await User.findOne({
        phone: { $exists: true },
        email: { $exists: false },
      });
    }

    // 🔥 STEP 3: If user exists → UPDATE (merge)
    if (user) {
      user.email = email;
      user.name = user.name || name;
      user.avatar = image;
      user.loginProvider = "google";

      await user.save();
    } else {
      // 🔥 STEP 4: Create new user
      user = await User.create({
        email,
        name: name || "User",
        avatar: image,
        loginProvider: "google",
        role: "user",
      });
    }

    // 🔥 STEP 5: Token
    const token = generateToken(user._id);

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return NextResponse.redirect("nestme://home");
    // return NextResponse.json({
    //   id: user._id,
    //   token,
    // });

  } catch (err) {
    console.error("GOOGLE MERGE ERROR:", err);

    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}