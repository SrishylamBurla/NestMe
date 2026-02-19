import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AgentProfile from "@/models/AgentProfile";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, role = "user" } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    let agentProfileId = null;

    // if (role === "agent") {
    //   const agent = await AgentProfile.create({
    //     user: user._id,
    //     designation: "New Agent",
    //     city: "Not specified",
    //     experienceYears: 0,
    //     phone: "",
    //     verified: false,
    //   });

    //   agentProfileId = agent._id;
    // }

    // 🔐 JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, agentProfileId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        agentProfileId,
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 },
    );
  }
}
