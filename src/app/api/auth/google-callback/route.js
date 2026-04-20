import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://nestme.in/api/auth/google-callback"
);

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ message: "No code provided" }, { status: 400 });
    }

    // 🔥 STEP 1: Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // 🔥 STEP 2: Get user info
    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name;
    const image = payload.picture;

    // 🔥 STEP 3: Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        avatar: image,
        loginProvider: "google",
        role: "user",
      });
    }

    // 🔥 STEP 4: Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // 🔥 STEP 5: Create response
    let res;

    const isMobile = req.headers.get("user-agent")?.includes("wv");

    if (isMobile) {
      res = NextResponse.redirect("nestme://home");
    } else {
      res = NextResponse.redirect(new URL("/", req.url));
    }

    // 🔥 STEP 6: Set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res;

  } catch (err) {
    console.error("GOOGLE CALLBACK ERROR:", err);

    return NextResponse.json(
      { message: "Google login failed" },
      { status: 500 }
    );
  }
}