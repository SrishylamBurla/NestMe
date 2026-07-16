import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import cloudinary from "@/lib/cloudinary";
import streamifier from "streamifier";

export async function PUT(req) {
  try {
    await connectDB();

    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("avatar");

    if (!file) {
      return NextResponse.json(
        { message: "Avatar is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const upload = () =>
      new Promise((resolve, reject) => {
        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder: "NestMe/avatars",
              transformation: [
                {
                  width: 500,
                  height: 500,
                  crop: "fill",
                  gravity: "face",
                },
                {
                  quality: "auto",
                },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

        streamifier
          .createReadStream(buffer)
          .pipe(stream);
      });

    const result = await upload();

    user.avatar = result.secure_url;

    await user.save();

    return NextResponse.json({
      message: "Avatar updated",
      avatar: result.secure_url,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: "Failed to upload avatar",
      },
      {
        status: 500,
      }
    );
  }
}