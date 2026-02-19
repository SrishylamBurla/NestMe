// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Property from "@/models/Property";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await connectDB();

//     // 🔐 AUTH
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.role !== "admin") {
//       return NextResponse.json(
//         { message: "Forbidden" },
//         { status: 403 }
//       );
//     }

//     const body = await req.json();

//     // ✅ REQUIRED FIELDS SAFETY
//     if (!body.title || !body.listingType) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const property = await Property.create({
//       ...body,
//       owner: decoded.id, // admin as owner
//       status: "pending", // admin listings need approval
//     });

//     return NextResponse.json(property, { status: 201 });
//   } catch (error) {
//     console.error("ADMIN CREATE PROPERTY ERROR:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const properties = await Property.find().populate("owner agent");
  return NextResponse.json({ properties });
}
