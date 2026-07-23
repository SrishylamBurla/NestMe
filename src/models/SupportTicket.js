import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "property",
        "lead",
        "payment",
        "verification",
        "technical",
        "account",
        "other",
      ],
      default: "other",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: [
        "open",
        "waiting",
        "resolved",
        "closed",
      ],
      default: "open",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: Date,

    unreadUser: {
      type: Number,
      default: 0,
    },

    unreadAdmin: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

supportTicketSchema.pre("save", function (next) {
  if (!this.ticketNumber) {
    this.ticketNumber =
      "NM-" +
      Date.now().toString().slice(-6);
  }

  next();
});

export default mongoose.models.SupportTicket ||
mongoose.model(
  "SupportTicket",
  supportTicketSchema
);