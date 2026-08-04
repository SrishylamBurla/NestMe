import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("========== CREATE ORDER ==========");

    console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log(
      "KEY_SECRET EXISTS:",
      !!process.env.RAZORPAY_KEY_SECRET
    );

    const body = await req.json();

    console.log("REQUEST BODY:", body);

    const { plan } = body;

    if (!plan) {
      return NextResponse.json(
        {
          message: "Plan is required",
        },
        {
          status: 400,
        }
      );
    }

    const prices = {
      basic: 999,
    };

    const amount = prices[plan];

    console.log("PLAN:", plan);
    console.log("AMOUNT:", amount);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log("ORDER CREATED:", order.id);

    return NextResponse.json(order);
  } catch (err) {
    console.log("========== CREATE ORDER ERROR ==========");
    console.log(err);

    if (err.error) {
      console.log("RAZORPAY ERROR:", err.error);
    }

    return NextResponse.json(
      {
        message: err.message,
        error: err.error || null,
      },
      {
        status: 500,
      }
    );
  }
}