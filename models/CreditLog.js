import mongoose from "mongoose";

const CreditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    studio: { type: String },          // branding | web | marketing
    step: { type: String },            // generate | dna | onepage_generate
    amount: { type: Number, required: true },
    source: { type: String },          // branding_generate vs
  },
  { timestamps: true }
);

export default mongoose.model("CreditLog", CreditLogSchema);
