// utils/useCredits.js

import User from "../models/User.js";
import CreditLedger from "../models/CreditLedger.js";

/**
 * useCredits
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {number} params.amount
 * @param {string} params.source        // branding_generate | web_onepage_generate
 * @param {string|null} params.refId     // projectId (opsiyonel)
 * @param {string|null} params.studio    // branding | web | marketing (opsiyonel)
 * @param {string|null} params.step      // generate | dna | onepage_generate (opsiyonel)
 */
export const useCredits = async ({
  userId,
  amount,
  source,
  refId = null,
  studio = null,
  step = null,
}) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.credits < amount) {
    throw new Error("INSUFFICIENT_CREDITS");
  }

  /* ================= UPDATE USER BALANCE ================= */

  user.credits -= amount;
  await user.save();

  /* ================= LEDGER LOG ================= */

  await CreditLedger.create({
    userId: user._id,
    type: "spend",
    source,                 // human + system readable
    refId,                  // projectId
    studio,                 // NEW
    step,                   // NEW
    amount: -amount,        // spend = negative
    balanceAfter: user.credits,
  });

  return user.credits;
};
