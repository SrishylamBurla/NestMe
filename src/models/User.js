// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },

//     role: {
//       type: String,
//       enum: ["user", "agent", "admin"],
//       default: "user",
//     },
//     phone: String,

//     isVerified: { type: Boolean, default: false },

//     propertiesPosted: { type: Number, default: 0 },

//     avatar: String,

//     agentProfileId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "AgentProfile",
//       default: null,
//     },
//     emailSubscribed: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.User || mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* ===== BASIC INFO ===== */

    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    phone: {
      type: String,
      trim: true,
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
    phone: String,

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
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
