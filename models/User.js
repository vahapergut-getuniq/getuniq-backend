import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ================= BILLING ================= */

    plan: {
      type: String,
      enum: ["beginner", "advance", "master"],
      default: "beginner",
    },

    credits: {
      type: Number,
      default: 0,
      min: 0,
    },

    stripeCustomerId: {
      type: String,
      index: true,
    },

    /* ================= META ================= */

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
