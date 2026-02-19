import mongoose from "mongoose";
// models/Agent.js
const agentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  designation: { type: String, default: "Property Agent" },
  city: { type: String, default: "Not specified" },

  phone: String,
  bio: String,
  specializations: [String],

  experienceYears: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  dealsClosed: { type: Number, default: 0 },

  verified: { type: Boolean, default: false },
  totalListings: { type: Number, default: 0 },
}, { timestamps: true });


export default mongoose.models.AgentProfile ||
  mongoose.model("AgentProfile", agentProfileSchema);
