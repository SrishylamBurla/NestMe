// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import User from "@/models/User";
// import connectDB from "@/lib/db";
// import { OAuth2Client } from "google-auth-library";

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export async function POST(req) {
//     try {
//         await connectDB();

//         const { idToken } = await req.json();

//         if (!idToken) {
//             return NextResponse.json(
//                 { message: "Google ID Token is required." },
//                 { status: 400 }
//             );
//         }


//         const decoded = jwt.decode(idToken);

//         console.log("TOKEN AUD:", decoded.aud);
//         console.log("TOKEN AZP:", decoded.azp);
//         console.log("BACKEND CLIENT:", process.env.GOOGLE_CLIENT_ID);

//         const ticket = await client.verifyIdToken({
//             idToken,
//             audience: process.env.GOOGLE_CLIENT_ID,
//         });

//         const payload = ticket.getPayload();

//         if (!payload) {
//             return NextResponse.json(
//                 { message: "Invalid Google token." },
//                 { status: 401 }
//             );
//         }

//         const {
//             email,
//             name,
//             picture,
//             sub: googleId,
//             email_verified,
//         } = payload;

//         if (!email_verified) {
//             return NextResponse.json(
//                 { message: "Google email is not verified." },
//                 { status: 401 }
//             );
//         }

//         let user = await User.findOne({ email });

//         if (!user) {
//             user = await User.create({
//                 name,
//                 email,
//                 avatar: picture,
//                 googleId,
//                 loginProvider: "google",
//                 password: null,
//             });
//         } else {
//             user.googleId = googleId;
//             user.loginProvider = "google";

//             if (!user.avatar) {
//                 user.avatar = picture;
//             }

//             await user.save();
//         }

//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 role: user.role,
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "30d",
//             }
//         );

//         const response = NextResponse.json({
//             success: true,
//             token,
//             user,
//         });

//         response.cookies.set("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "lax",
//             path: "/",
//             maxAge: 60 * 60 * 24 * 30,
//         });

//         return response;
//     } catch (error) {
//         console.error("GOOGLE LOGIN ERROR");
//         console.error(error);

//         return NextResponse.json(
//             {
//                 message: error.message,
//                 stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//             },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import connectDB from "@/lib/db";
import User from "@/models/User";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
    try {
        await connectDB();

        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Google ID Token is required.",
                },
                { status: 400 }
            );
        }

        // Verify Google ID Token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Google token.",
                },
                { status: 401 }
            );
        }

        const {
            email,
            name,
            picture,
            sub: googleId,
            email_verified,
        } = payload;

        if (!email_verified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Google email is not verified.",
                },
                { status: 401 }
            );
        }

        // Find Existing User
        let user = await User.findOne({ email });

        // New User
        if (!user) {
            user = await User.create({
                name,
                email,
                avatar: picture,
                googleId,
                loginProvider: "google",
                password: null,
                role: "user",
            });
        } else {
            // Update existing user
            user.name = name || user.name;
            user.avatar = picture || user.avatar;

            if (!user.googleId) {
                user.googleId = googleId;
            }

            if (!user.loginProvider) {
                user.loginProvider = "google";
            }

            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        );

        // Response
        const response = NextResponse.json({
            success: true,
            message: "Google login successful.",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                loginProvider: user.loginProvider,
                hasPassword: !!user.password,
            },
        });

        // Cookie (for web)
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 Days
        });

        return response;
    } catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Google login failed.",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}