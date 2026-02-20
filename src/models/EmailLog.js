import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    openedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.EmailLog ||
  mongoose.model("EmailLog", emailLogSchema);
