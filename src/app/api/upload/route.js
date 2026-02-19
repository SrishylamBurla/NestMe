import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "NestMe", // ✅ THIS CREATES FOLDER
    });

    return NextResponse.json({
      url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    });

  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
