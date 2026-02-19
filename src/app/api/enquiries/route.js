import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req) {
  await connectDB();
const {user} = await getAuthUser(req);
  
  const { propertyId, message } = await req.json();

  const property = await Property.findById(propertyId);

  const enquiry = await Enquiry.create({
    property: property._id,
    fromUser: user._id,
    toOwner: property.createdBy,
    message,
  });

  return NextResponse.json(enquiry);
}
