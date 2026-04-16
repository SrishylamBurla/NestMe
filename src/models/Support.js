import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["user", "admin"] },
    text: String,
    file: String, // for future file attachments
  },
  { timestamps: true },
);

const supportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subject: String,
    messages: [messageSchema],
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    state: {
      intent: String,
      step: String,
      budget: String,
      city: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Support ||
  mongoose.model("Support", supportSchema);
