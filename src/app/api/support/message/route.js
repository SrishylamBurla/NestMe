import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import { getAuthUser } from "@/lib/getAuthUser";
import { sendMessageToUser } from "@/lib/socket";

// 🧠 AI LOGIC
const getReply = (text, state = {}) => {
  const msg = text.toLowerCase();

  if (msg.includes("buy")) {
    return {
      reply: "🏡 Great! What is your budget range?",
      nextState: { intent: "buy", step: "budget" },
    };
  }

  if (msg.includes("rent")) {
    return {
      reply: "🏢 Nice! Which city are you looking to rent in?",
      nextState: { intent: "rent", step: "city" },
    };
  }

  if (msg.includes("post") || msg.includes("list")) {
    return {
      reply: "📢 Please share property type (Flat / Villa / Plot).",
      nextState: { intent: "post", step: "type" },
    };
  }

  // 🔁 FLOW CONTINUE
  if (state.intent === "buy") {
    if (state.step === "budget") {
      return {
        reply: "📍 Which location are you interested in?",
        nextState: { ...state, step: "location", budget: text },
      };
    }

    if (state.step === "location") {
      return {
        reply: "✅ Perfect! I’ll show you matching properties.",
        nextState: {},
      };
    }
  }

  if (state.intent === "rent") {
    if (state.step === "city") {
      return {
        reply: "💰 What’s your monthly budget?",
        nextState: { ...state, step: "budget", city: text },
      };
    }

    if (state.step === "budget") {
      return {
        reply: "✅ Great! I’ll find rental options.",
        nextState: {},
      };
    }
  }

  if (state.intent === "post") {
    if (state.step === "type") {
      return {
        reply: "📝 Go to 'Post Property' page to continue.",
        nextState: {},
      };
    }
  }

  return {
    reply: "🤖 I can help with buying, renting, or listing.",
    nextState: {},
  };
};

export async function POST(req) {
  await connectDB();

  const user = await getAuthUser();
  const { text, file } = await req.json();

  let ticket = await Support.findOne({ user: user._id }).sort({
    createdAt: -1,
  });

  if (!ticket) {
    ticket = await Support.create({
      user: user._id,
      subject: "Support Chat",
      messages: [],
      state: {},
    });
  }

  const currentState = ticket.state || {};
  const { reply, nextState } = getReply(text, currentState);

  // ✅ USER MESSAGE
  const userMsg = {
    sender: "user",
    text,
    file,
    userId: user._id.toString(), // 🔥 IMPORTANT
  };

  // ✅ AI MESSAGE
  const adminMsg = {
    sender: "admin",
    text: reply,
    userId: user._id.toString(), // 🔥 IMPORTANT
  };

  ticket.messages.push(userMsg);

  if (reply) {
    const adminMsg = {
      sender: "admin",
      text: reply,
      userId: user._id.toString(),
    };

    ticket.messages.push(adminMsg);

    // ⚡ send AI message
    sendMessageToUser(user._id.toString(), adminMsg);
  }

  ticket.state = nextState;

  await ticket.save();

  // ⚡ SOCKET (CLEAN)
  sendMessageToUser(user._id.toString(), userMsg);
  sendMessageToUser(user._id.toString(), adminMsg);

  return NextResponse.json({ success: true });
}
