import { CREDIT_COSTS } from "./creditCosts.js";

/*
  STEP ≠ CREDIT
  Credit sadece belirli EVENT'lerde harcanır.
*/

export const CREDIT_EVENTS = {

  /* =========================
     BRANDING STUDIO
  ========================= */

  branding: {
    fast: {
      generate: CREDIT_COSTS.branding.generate,
    },

    pro: {
      generate: CREDIT_COSTS.branding.generate,
      redesign: CREDIT_COSTS.branding.redesign,
    },

    elite: {
      generate: CREDIT_COSTS.branding.generate,
      redesign: CREDIT_COSTS.branding.redesign,
      designerlogo: CREDIT_COSTS.branding.designer_logo,
      identity: CREDIT_COSTS.branding.identity,
    },
  },

  /* =========================
     CONTENT STUDIO
     1) Post
     2) Video
     3) Real Production (NO CREDIT)
  ========================= */

  content: {
    post: {
      generate: CREDIT_COSTS.content.methodSelection.ai_generate, // AI Generate Method için 30 kredi
      edit: CREDIT_COSTS.content.methodSelection.designer_assisted, // Designer Assisted Method için 50 kredi
    },

    video: {
      generate: CREDIT_COSTS.content.methodSelection.ai_generate, // AI Generate Method için 30 kredi
      edit: CREDIT_COSTS.content.methodSelection.designer_assisted, // Designer Assisted Method için 50 kredi
      voice: CREDIT_COSTS.content.methodSelection.ai_generate, // AI Generate Method için 30 kredi
    },

    // ⚠️ SADECE TEKLİF – KREDİ YOK
    realproduction: {
      proposal: null,  // Kredilendirme yok
    },
  },

  /* =========================
   WEB STUDIO
  ========================= */

  web: {
    onepage: {
      layout_generate: CREDIT_COSTS.web.onepage_layout,   // Design
      copy_generate: CREDIT_COSTS.web.onepage_content,    // Content
      build: CREDIT_COSTS.web.onepage_build,               // Build
    },

    landing: {
      layout_generate: CREDIT_COSTS.web.landing_layout,   // Design
      copy_generate: CREDIT_COSTS.web.landing_content,    // Content
      build: CREDIT_COSTS.web.landing_build,               // Build
      revisions: CREDIT_COSTS.web.landing_revision,       // Optional AI revise
    },

    // ⚠️ AJANS AKIŞI – CREDIT YOK
    weboffice: {
      proposal: null,  // Kredilendirme yok
    },
  },

  /* =========================
     MARKETING STUDIO
  ========================= */

  marketing: {
    dna: {
      analysis: CREDIT_COSTS.marketing.dna,
      strategy: CREDIT_COSTS.marketing.dna,
      plan: CREDIT_COSTS.marketing.dna,
    },

    growth: {
      content_strategy: CREDIT_COSTS.marketing.growth,
      suggestion: CREDIT_COSTS.marketing.growth,
      plan: CREDIT_COSTS.marketing.growth,
    },

    full: {
      analysis: CREDIT_COSTS.marketing.full,
      strategy: CREDIT_COSTS.marketing.full,
      content: CREDIT_COSTS.marketing.full,
      content_strategy: CREDIT_COSTS.marketing.full,
      budget: CREDIT_COSTS.marketing.full,
      plan: CREDIT_COSTS.marketing.full,
      report: CREDIT_COSTS.marketing.full,
    },
  },
};
