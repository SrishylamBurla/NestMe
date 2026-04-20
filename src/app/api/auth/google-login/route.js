import { NextResponse } from "next/server";

export async function GET() {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=" + process.env.GOOGLE_CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent("https://www.nestme.in/api/auth/google-callback") +
    "&response_type=code" +
    "&scope=" + encodeURIComponent("email profile") +
    "&access_type=offline" +
    "&prompt=consent";

  return NextResponse.redirect(url);
}



// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     const email = searchParams.get("email");
//     const name = searchParams.get("name");
//     const image = searchParams.get("image");

//     if (!email) {
//       return NextResponse.json(
//         { message: "Email required" },
//         { status: 400 }
//       );
//     }

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         email,
//         name: name || "User",
//         avatar: image,
//         loginProvider: "google",
//         role: "user",
//       });
//     }
// const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//   expiresIn: "30d",
// });

// // ✅ create response FIRST
// let res;

// // 📱 MOBILE
// if (req.headers.get("user-agent")?.includes("wv")) {
//   res = NextResponse.redirect("nestme://");
// } else {
//   // 🌐 WEB
//   res = NextResponse.redirect(new URL("/", req.url));
// }

// // ✅ SET COOKIE ON RESPONSE (NOT cookies())
// res.cookies.set("token", token, {
//   httpOnly: true,
//   secure: false,       // 🔥 IMPORTANT for localhost
//   path: "/",
//   sameSite: "lax",     // 🔥 FIX THIS
// });

// return res;

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }
