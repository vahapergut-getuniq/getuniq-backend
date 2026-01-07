// utils/creditGuard.js
import { CREDIT_COSTS } from "../config/creditCosts.js";

export function getCreditCost(studio, action) {
  return CREDIT_COSTS?.[studio]?.[action] ?? null;
}

export function canAfford(userCredits, cost) {
  if (cost === 0) return true; // teklif / manuel işler
  return userCredits >= cost;
}
