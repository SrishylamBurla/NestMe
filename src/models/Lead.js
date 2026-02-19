import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentProfile",
      default: null,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    name: String,
    email: String,
    phone: String,
    message: String,

    status: {
      type: String,
      enum: ["new", "contacted", "closed", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);


export default mongoose.models.Lead ||
  mongoose.model("Lead", leadSchema);



//   import mongoose from "mongoose";

// const leadSchema = new mongoose.Schema({
//   property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
//   agent: { type: mongoose.Schema.Types.ObjectId, ref: "AgentProfile", default: null },
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // sender
//   name: String,
//   email: String,
//   phone: String,
//   message: String,
//   status: { type: String, default: "new" }
// }, { timestamps: true });


// export default mongoose.models.Lead ||
//   mongoose.model("Lead", leadSchema);
