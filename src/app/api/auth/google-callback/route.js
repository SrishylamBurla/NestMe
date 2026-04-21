import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const redirectUri = "https://www.nestme.in/api/auth/google-callback";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    console.log("CODE:", code);

    if (!code) {
      return NextResponse.json({ message: "No code provided" }, { status: 400 });
    }

    // 🔥 STEP 1: exchange code
    const { tokens } = await client.getToken({
      code,
      redirect_uri: redirectUri,
    });

    console.log("TOKENS:", tokens);

    if (!tokens.id_token) {
      throw new Error("ID token missing");
    }

    // 🔥 STEP 2: verify user
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log("USER:", payload);

    const email = payload.email;
    const name = payload.name;
    const image = payload.picture;

    // 🔥 STEP 3: DB
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

    // 🔥 STEP 4: JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // 🔥 STEP 5: RESPONSE
    const isMobile = req.headers.get("user-agent")?.includes("wv");

    const res = isMobile
      ? NextResponse.redirect("nestme://")
      : NextResponse.redirect("https://www.nestme.in/");

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res;

  } catch (err) {
    console.error("❌ GOOGLE CALLBACK ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Google login failed" },
      { status: 500 }
    );
  }
}