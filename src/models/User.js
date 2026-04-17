import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* ===== BASIC INFO ===== */

    name: { type: String, required: true },

    email: {
      type: String,
      required: false,
      sparse: true,
      unique: true,
    },

    password: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },

    avatar: String,

    /* ===== ROLE SYSTEM ===== */

    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },

    agentProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentProfile",
      default: null,
    },

    /* ===== VERIFICATION ===== */

    isVerified: { type: Boolean, default: false },

    emailVerificationOTP: String,
    emailVerificationExpiry: Date,

    phoneOTP: String,
    phoneOTPExpiry: Date,


    /* ===== PASSWORD RESET ===== */

    resetOTP: String,
    resetOTPExpiry: Date,

    /* ===== ACTIVITY ===== */

    propertiesPosted: { type: Number, default: 0 },

    /* ===== PREFERENCES ===== */

    emailSubscribed: { type: Boolean, default: true },

    /* ===== SECURITY ===== */

    lastLogin: Date,

    loginProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    pushTokens: [String],
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
