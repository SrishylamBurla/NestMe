import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
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
          password: "google",
          isVerified: true,
          loginProvider: "google",
        });
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };