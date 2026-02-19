import mongoose from "mongoose";

const savedPropertySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  { timestamps: true }
);

// prevent duplicates (same user + same property)
savedPropertySchema.index(
  { user: 1, property: 1 },
  { unique: true }
);

export default mongoose.models.SavedProperty ||
  mongoose.model("SavedProperty", savedPropertySchema);
