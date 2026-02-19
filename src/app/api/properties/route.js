import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import Property from "@/models/Property";
import AgentProfile from "@/models/AgentProfile";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { propertyUnderReviewTemplate } from "@/lib/propertyUnderReviewTemplate";
import { sendEmail } from "@/lib/sendEmail";
import upload from "@/lib/multer";
import cloudinary from "@/lib/cloudinary";
import streamifier from "streamifier"


//GET – LIST PROPERTIES
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Number(searchParams.get("limit")) || 8, 20);
    const skip = (page - 1) * limit;

    /* ================= BASE QUERY ================= */
    const query = {
      approvalStatus: "approved",
    };

    /* ================= SEARCH ================= */
    const q = searchParams.get("q");
    if (q && q.trim().length > 1) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
      ];
    }

    /* ================= LISTING TYPE ================= */
    const listingType = searchParams.get("listingType");
    if (listingType) {
      query.listingType = listingType;
    }

    /* ================= PROPERTY TYPE ================= */
    const propertyType = searchParams.get("propertyType");
    if (propertyType) {
      query.propertyType = propertyType;
    }

    /* ================= CITY ================= */
    const city = searchParams.get("city");
    if (city && city.trim()) {
      query.city = { $regex: city, $options: "i" };
    }

    /* ================= BEDS ================= */
    const bedsParam = searchParams.get("beds");
    if (bedsParam) {
      const beds = Number(bedsParam);
      if (!Number.isNaN(beds) && beds > 0) {
        query.beds = beds;
      }
    }

    /* ================= PRICE FILTER ================= */
    const maxPriceParam = searchParams.get("maxPrice");
    if (maxPriceParam) {
      const maxPrice = Number(maxPriceParam);
      if (!Number.isNaN(maxPrice) && maxPrice > 0) {
        query.priceValue = { $lte: maxPrice };
      }
    }

    /* ================= SORTING ================= */
    const sortParam = searchParams.get("sort");

    let sortOption = { createdAt: -1 }; // default latest

    if (sortParam === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sortParam === "priceHigh") {
      sortOption = { priceValue: -1 };
    }

    if (sortParam === "priceLow") {
      sortOption = { priceValue: 1 };
    }

    /* ================= FETCH ================= */
    const properties = await Property.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit + 1)
      .populate({
        path: "agent",
        populate: { path: "user", select: "name avatar" },
      });

    const hasMore = properties.length > limit;
    if (hasMore) properties.pop();

    return NextResponse.json({
      properties,
      page,
      hasMore,
    });
  } catch (error) {
    console.error("GET PROPERTIES ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}

// POST – ADD PROPERTY



function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}


export async function POST(req) {
  try {
    await connectDB();

    /* ==============================
       🔐 AUTH CHECK
    ============================== */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    /* ==============================
       🛑 LIMIT NORMAL USERS TO 1
    ============================== */
    if (user.role === "user") {
      const existingCount = await Property.countDocuments({
        owner: user._id,
      });

      if (existingCount >= 1) {
        return NextResponse.json(
          { message: "Upgrade to agent to post multiple properties" },
          { status: 403 }
        );
      }
    }

    /* ==============================
       🔥 AGENT PROFILE
    ============================== */
    let agentProfileId = null;

    if (user.role === "agent") {
      const agentProfile = await AgentProfile.findOne({
        user: user._id,
      });

      if (!agentProfile) {
        return NextResponse.json(
          { message: "Agent profile not found" },
          { status: 400 }
        );
      }

      agentProfileId = agentProfile._id;
    }

    /* ==============================
       📦 READ FORM DATA
    ============================== */
    const formData = await req.formData();

    const imageFiles = formData.getAll("images");

    /* ==============================
       🛡 IMAGE VALIDATION
    ============================== */

    if (imageFiles.length > 6) {
      return NextResponse.json(
        { message: "Maximum 6 images allowed" },
        { status: 400 }
      );
    }

    let uploadedImages = [];

    /* ==============================
       ☁️ UPLOAD IMAGES TO CLOUDINARY
    ============================== */
    for (const file of imageFiles) {
      if (!file || !file.name) continue;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Only image files are allowed" },
          { status: 400 }
        );
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Each image must be less than 5MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `NestMe`,
              transformation: [
                { width: 1200, crop: "limit" }, // auto resize
                { quality: "auto" }, // auto compression
              ],
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(buffer).pipe(stream);
        });

      const result = await uploadFromBuffer();

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    /* ==============================
       🏠 CREATE PROPERTY
    ============================== */
    const property = await Property.create({
      title: formData.get("title"),
      description: formData.get("description"),
      listingType: formData.get("listingType"),
      propertyType: formData.get("propertyType"),
      priceLabel: formData.get("priceLabel"),
      priceValue: Number(formData.get("priceValue")),
      pricePerSqFt: formData.get("pricePerSqFt"),
      beds: Number(formData.get("beds")),
      baths: Number(formData.get("baths")),
      areaSqFt: Number(formData.get("areaSqFt")),
      furnishing: formData.get("furnishing"),
      facing: formData.get("facing"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      listingStatus: formData.get("listingStatus"),
      amenities: formData.getAll("amenities[]"),
      location: {
        lat: formData.get("lat")
          ? Number(formData.get("lat"))
          : null,
        lng: formData.get("lng")
          ? Number(formData.get("lng"))
          : null,
      },
      images: uploadedImages,
      owner: user._id,
      agent: agentProfileId,
      approvalStatus: "pending",
    });

    /* ==============================
       📈 INCREMENT AGENT LISTINGS
    ============================== */
    if (agentProfileId) {
      await AgentProfile.findByIdAndUpdate(agentProfileId, {
        $inc: { totalListings: 1 },
      });
    }

    /* ==============================
       🔔 USER NOTIFICATION
    ============================== */
    await Notification.create({
      user: user._id,
      title: "Property Under Review ⏳",
      message: `Your property "${property.title}" is under admin review.`,
      type: "property-created",
      link: "/my-properties",
    });

    /* ==============================
       🔔 ADMIN NOTIFICATIONS
    ============================== */
    const admins = await User.find({ role: "admin" }).select(
      "_id email name"
    );

    if (admins.length) {
      await Notification.insertMany(
        admins.map((admin) => ({
          user: admin._id,
          title: "New Property Pending Approval",
          message: `New property "${property.title}" submitted by ${user.name}`,
          type: "system",
          link: "/admin/properties",
        }))
      );
    }

    /* ==============================
       📧 EMAIL TO USER
    ============================== */
    if (user.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Your Property is Under Review ⏳",
          html: propertyUnderReviewTemplate({
            userName: user.name,
            propertyTitle: property.title,
          }),
        });
      } catch (err) {
        console.error("User email failed:", err.message);
      }
    }

    /* ==============================
       📧 EMAIL TO ADMINS
    ============================== */
    for (const admin of admins) {
      if (!admin.email) continue;

      try {
        await sendEmail({
          to: admin.email,
          subject: "New Property Awaiting Approval 🏠",
          html: `
            <div style="font-family: Arial; padding:20px;">
              <h2>New Property Submitted</h2>
              <p><b>${property.title}</b> submitted by ${user.name}</p>
              <p><b>City:</b> ${property.city}</p>
              <p><b>Price:</b> ₹${property.priceLabel || property.priceValue}</p>

              <a href="${process.env.CLIENT_URL}/admin/properties"
                style="padding:10px 16px; background:#4f46e5; color:white; text-decoration:none; border-radius:6px;">
                Review Property
              </a>

              <p style="margin-top:30px; font-size:12px; color:#888;">
                NestMe Admin Notification
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error("Admin email failed:", err.message);
      }
    }

    return NextResponse.json(property, { status: 201 });

  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);
    return NextResponse.json(
      { message: "Failed to create property" },
      { status: 500 }
    );
  }
}
