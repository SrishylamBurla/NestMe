// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";

// ✅ VERY IMPORTANT FIXES
export const runtime = "nodejs";          // 👈 Fix 1
export const dynamic = "force-dynamic";   // 👈 Fix 2

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await connectDB();

      let existing = await User.findOne({
        email: user.email,
      });

      if (!existing) {
        await User.create({
          name: user.name,
          email: user.email,
          password: null,
          isVerified: true,
          loginProvider: "google",
        });
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };