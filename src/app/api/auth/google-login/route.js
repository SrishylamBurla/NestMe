import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
// };
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const image = searchParams.get("image");

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name: name || "User",
        avatar: image,
        loginProvider: "google",
        role: "user",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // 📱 MOBILE
    if (req.headers.get("user-agent")?.includes("wv")) {
      return NextResponse.redirect(new URL("nestme://"));
    }

    // 🌐 WEB
    return NextResponse.redirect(new URL("/"));

  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}