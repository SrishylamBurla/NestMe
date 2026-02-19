import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";



export async function PATCH(req, { params }) {
  await connectDB();
  const user = await getAuthUser();

  

  if (user.role !== "admin")
    return NextResponse.json({ message: "Admin only" }, { status: 403 });

  const { status } = await req.json(); // approved or rejected
  const property = await Property.findById(params.id);

  property.status = status;
  await property.save();

  return NextResponse.json({ property });
}
