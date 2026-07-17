import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
    try {
        await connectDB();

        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json(
                { message: "Google ID Token is required." },
                { status: 400 }
            );
        }


        const decoded = jwt.decode(idToken);

        console.log("TOKEN AUD:", decoded.aud);
        console.log("TOKEN AZP:", decoded.azp);
        console.log("BACKEND CLIENT:", process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return NextResponse.json(
                { message: "Invalid Google token." },
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
                { message: "Google email is not verified." },
                { status: 401 }
            );
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar: picture,
                googleId,
                loginProvider: "google",
                password: null,
            });
        } else {
            user.googleId = googleId;
            user.loginProvider = "google";

            if (!user.avatar) {
                user.avatar = picture;
            }

            await user.save();
        }

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

        const response = NextResponse.json({
            success: true,
            token,
            user,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        return response;
    } catch (error) {
        console.error("GOOGLE LOGIN ERROR");
        console.error(error);

        return NextResponse.json(
            {
                message: error.message,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}