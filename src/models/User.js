import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    phone: String,

    isVerified: { type: Boolean, default: false },

    propertiesPosted: { type: Number, default: 0 },

    avatar: String,
    
    agentProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentProfile",
      default: null,
    },
    emailSubscribed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
