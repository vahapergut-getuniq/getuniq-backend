import mongoose from "mongoose";

const CreditLedgerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["earn", "spend", "adjust"],
      required: true,
    },

    source: {
      type: String,
      enum: ["stripe", "system", "admin"],
      required: true,
    },

    refId: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CreditLedger = mongoose.model("CreditLedger", CreditLedgerSchema);
export default CreditLedger;
