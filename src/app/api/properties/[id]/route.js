import { NextResponse } from "next/server";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Notification from "@/models/Notification";
import AgentProfile from "@/models/AgentProfile";
import User from "@/models/User";
import mongoose from "mongoose";
import SavedProperty from "@/models/SavedProperty";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";
import streamifier from "streamifier";


export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid property ID" },
        { status: 400 }
      );
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
      .populate({
        path: "agent",
        populate: {
          path: "user",
          select: "name email avatar",
        },
      })
      .populate("owner", "name email avatar");
    // .populate("agent")
    // .populate("owner", "name email");

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    /* ---------------- CHECK IF SAVED ---------------- */
    let isSaved = false;

    const cookieStore = await cookies(); // ✅ FIXED
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const saved = await SavedProperty.findOne({
          user: decoded.id,
          property: property._id,
        });

        isSaved = !!saved;
      } catch (err) {
        // ignore invalid token
      }
    }

    const propertyData = property.toObject();
    propertyData.isSaved = isSaved;

    return NextResponse.json(propertyData);

  } catch (error) {
    console.error("PROPERTY FETCH ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


export async function PUT(req, context) {
  try {

    await connectDB();

    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      );
    }

    // ==============================
    // 📦 FORM DATA
    // ==============================

    const formData =
      await req.formData();

    // ==============================
    // 🖼 HANDLE IMAGES
    // ==============================

    const imageFiles =
      formData.getAll("images");

    let uploadedImages = [];

    for (const item of imageFiles) {

      // ============================
      // ✅ EXISTING IMAGE
      // ============================

      if (
        typeof item === "string"
      ) {
        try {

          const parsed =
            JSON.parse(item);

          if (parsed?.url) {
            uploadedImages.push(parsed);
          }

          continue;

        } catch {
          continue;
        }
      }

      // ============================
      // ✅ NEW FILE
      // ============================

      if (!item?.name)
        continue;

      const bytes =
        await item.arrayBuffer();

      const buffer =
        Buffer.from(bytes);

      const uploadFromBuffer =
        () =>
          new Promise(
            (
              resolve,
              reject
            ) => {

              const stream =
                cloudinary.uploader.upload_stream(
                  {
                    folder:
                      "NestMe",
                  },
                  (
                    error,
                    result
                  ) => {

                    if (result) {
                      resolve(
                        result
                      );

                    } else {
                      reject(
                        error
                      );
                    }
                  }
                );

              streamifier
                .createReadStream(
                  buffer
                )
                .pipe(stream);
            }
          );

      const result =
        await uploadFromBuffer();

      uploadedImages.push({
        url:
          result.secure_url,

        public_id:
          result.public_id,
      });
    }

    // ==============================
    // 🧾 BODY
    // ==============================

    const body = {
      title:
        formData.get("title"),

      description:
        formData.get(
          "description"
        ),

      propertyType:
        formData.get(
          "propertyType"
        ),

      listingType:
        formData.get(
          "listingType"
        ),

      listingStatus:
        (
          formData.get(
            'listingStatus'
          )
          ||
          'available'
        )
          .toLowerCase(),

      priceLabel:
        formData.get(
          "priceLabel"
        ),

      priceValue: Number(
        formData.get(
          "priceValue"
        )
      ),

      pricePerSqFt:
        formData.get(
          "pricePerSqFt"
        ),

      beds: Number(
        formData.get(
          "beds"
        )
      ),

      baths: Number(
        formData.get(
          "baths"
        )
      ),

      areaSqFt: Number(
        formData.get(
          "areaSqFt"
        )
      ),

      furnishing:
        formData.get(
          "furnishing"
        ),

      facing:
        formData.get(
          "facing"
        ),

      address:
        formData.get(
          "address"
        ),

      city:
        formData.get(
          "city"
        ),

      state:
        formData.get(
          "state"
        ),

      amenities:
        formData.getAll(
          "amenities[]"
        ),

      location: {
        lat: Number(
          formData.get(
            "lat"
          )
        ),

        lng: Number(
          formData.get(
            "lng"
          )
        ),
      },

      // ✅ IMPORTANT
      images:
        uploadedImages,
    };

    // ==============================
    // 🔐 FIND PROPERTY
    // ==============================

    let property;

    // ADMIN
    if (user.role === "admin") {

      property =
        await Property.findById(
          id
        );

    }

    // AGENT
    else if (
      user.role === "agent"
    ) {

      property =
        await Property.findOne({
          _id: id,

          $or: [
            {
              agent:
                user.agentProfileId,
            },

            {
              owner:
                user._id,
            },
          ],
        });

      body.approvalStatus =
        "pending";

      body.rejectionReason =
        "";
    }

    // USER
    else {

      property =
        await Property.findOne({
          _id: id,

          owner:
            user._id,
        });

      body.approvalStatus =
        "pending";

      body.rejectionReason =
        "";
    }

    if (!property) {
      return NextResponse.json(
        {
          message:
            "Property not found",
        },
        { status: 404 }
      );
    }

    // ==============================
    // 💾 SAVE
    // ==============================

    Object.assign(
      property,
      body
    );

    await property.save();

    return NextResponse.json({
      success: true,
      property,
    });

  } catch (error) {

    console.error(
      "UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    let property;

    if (user.role === "admin") {
      property = await Property.findById(id);
    } else if (user.role === "agent") {
      property = await Property.findOne({
        _id: id,
        agent: user.agentProfileId,
      });
    } else {
      property = await Property.findOne({ _id: id, owner: user._id });
    }

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 },
      );
    }

    await property.deleteOne();

    return NextResponse.json({ message: "Property deleted" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
