import mongoose from "mongoose";

/* ================= OUTPUT SUB-SCHEMA ================= */
const OutputSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "pdf", "video", "zip", "other"],
      required: true,
    },
    name: String,
    url: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

/* ================= PROJECT SCHEMA ================= */
const ProjectSchema = new mongoose.Schema(
  {
    /* ================= CORE ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String, // branding | web | content | marketing
      required: true,
    },

    /* ================= PIPELINE STATE ================= */
    pipeline: {
      type: String, // fast | pro | elite | onepage | landing | weboffice ...
      default: "",
    },

    currentStep: {
      type: String,
      default: "",
    },

    /* ================= 🚀 WEBOFFICE STATUS ================= */
    webOfficeStatus: {
      type: String,
      enum: ["proposal", "approved", "paid", "production"],
      default: "proposal",
    },

    /* ================= RESUME ================= */
    lastLocation: {
      type: String,
      default: "",
    },

    /* ================= STEP PROGRESS ================= */
    completedSteps: {
      type: [String],
      default: [],
    },

    progress: {
      type: Number,
      default: 0,
    },

    /* ================= PROJECT DATA STORE ================= */
    data: {
      type: Object,
      default: {},
    },

    /* ================= PROJECT DETAIL ================= */
    thumbnail: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    /* ================= ACTIVITY TIMELINE ================= */
    activities: [
      {
        type: {
          type: String,
          enum: [
            "create",
            "rename",
            "step",
            "resume",
            "output",
            "notes",
            "web_status",  // ⭐ eklendi
          ],
          required: true,
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ================= OUTPUT FILES ================= */
    outputs: {
      type: [OutputSchema],
      default: [],
    },
  },
  { timestamps: true }
);

/* ================= JSON TRANSFORM ================= */
ProjectSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id?.toString();
    return ret;
  },
});

export default mongoose.model("Project", ProjectSchema);
