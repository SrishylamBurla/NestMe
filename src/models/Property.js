import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    /* ---------------- BASIC INFO ---------------- */
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    description: {
      type: String,
      trim: true,
    },

    listingType: {
      type: String,
      enum: ["sale", "rent", "lease"],
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["apartment", "villa", "plot", "commercial"],
      required: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    listingStatus: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },

    rejectionReason: String,
    
    /* ---------------- PRICING ---------------- */
    priceLabel: String,
    priceValue: {
      type: Number,
      required: true,
    },
    pricePerSqFt: String,

    /* ---------------- LOCATION ---------------- */
    city: {
      type: String,
      required: true,
      index: true,
    },

    state: {
      type: String,
      required: true,
    },

    address: String,

    location: {
      lat: { type: Number },
      lng: { type: Number },
    },

    /* ---------------- PROPERTY DETAILS ---------------- */
    beds: { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    areaSqFt: Number,

    furnishing: {
      type: String,
      enum: ["none", "semi", "full"],
      default: "none",
    },

    facing: String,

    /* ---------------- MEDIA ---------------- */
    images: [
  {
    url: String,
    public_id: String,
  }
],


    /* ---------------- AMENITIES ---------------- */
    amenities: {
      type: [String],
      default: [],
    },

    /* ---------------- RELATIONS ---------------- */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentProfile",
    },

    /* ---------------- META ---------------- */
  
    viewsCount: { type: Number, default: 0 },
    leadsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

/* -------- INDEXES -------- */
propertySchema.index({ city: 1, priceValue: 1 });
propertySchema.index({ listingType: 1 });
propertySchema.index({ approvalStatus: 1 });
propertySchema.index({ propertyType: 1 });

export default mongoose.models.Property ||
  mongoose.model("Property", propertySchema);
