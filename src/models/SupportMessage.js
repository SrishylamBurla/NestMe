import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportTicket",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderRole: {
      type: String,
      enum: [
        "user",
        "admin",
      ],
      required: true,
    },

    message: {
      type: String,
      trim: true,
      required: true,
    },

    attachments: [
      {
        url: String,
        type: String,
      },
    ],

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SupportMessage ||
mongoose.model(
  "SupportMessage",
  supportMessageSchema
);