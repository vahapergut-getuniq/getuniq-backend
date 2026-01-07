export const CREDIT_COSTS = {
  branding: {
    generate: 20,
    brandkit_mini: 40,
    redesign: 30,
    feedback: 50,
    designer_logo: 200,
    identity: 200,
  },

  web: {
    // $1000 product (One Page)
    onepage_layout: 200,    // Design (AI structure + layout)
    onepage_content: 200,   // Content (AI copy)
    onepage_build: 225,     // Build (AI + system)
    // toplam: 625 credit ✅

    // $2000 product (Landing Page)
    landing_layout: 300,    // Design
    landing_content: 300,   // Conversion copy
    landing_build: 400,     // Build
    landing_revision: 125,  // AI revision
    // toplam: 1125 credit ✅

    // AJANS – CREDIT YOK
    web_office: 0,
  },

  content: {
    post: 0,               // Güncellenmiş: 15'ten 0'a düştü
    ai_video: 0,           // Güncellenmiş: 40'tan 0'a düştü
    real_production: 0,    // Teklif olarak kalacak
    methodSelection: {
      ai_generate: 30,      // AI Generate yöntemi için 30 kredi
      designer_assisted: 50, // Designer Assisted yöntemi için 50 kredi
      ai_agents: 0,         // AI Agents kilitli ve daha sonra açılacak
    },
  },

  marketing: {
    dna: 50,
    growth: 150,
    full: 300,
  },

  videoEngines: {
    runway: 100,   // RUNWAY motoru için kredi
    kling: 150,    // Kling motoru için kredi
    leonardo: 70,  // Leonardo motoru için kredi
    pika: 50,      // Pika motoru için kredi
  },
};
