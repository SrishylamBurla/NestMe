import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { plan } = await req.json();

    if (!plan) {
      return NextResponse.json(
        { message: "Plan is required" },
        { status: 400 }
      );
    }

    const prices = {
      basic: 999,
    };

    const amount = prices[plan];

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // console.log(process.env.RAZORPAY_KEY_ID);
    

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("RAZORPAY ERROR:", err);

    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}