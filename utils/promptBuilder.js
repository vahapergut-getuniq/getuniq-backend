export function buildBrandPrompt({ industry, keywords, style }) {
  return `
You are a senior brand strategist working for a premium digital agency.

Create a premium, modern, and globally usable brand concept.

Context:
- Industry: ${industry}
- Brand keywords: ${keywords}
- Style: ${style}

Rules:
- Use clear, professional English
- Do NOT include explanations or markdown
- Return ONLY valid JSON
- Brand names must be original, short, and globally pronounceable

Return JSON with the following structure:
{
  "brand_name_suggestions": [string, string, string],
  "brand_story": string,
  "logo_description": string,
  "color_palette": [
    { "name": string, "hex": string },
    { "name": string, "hex": string },
    { "name": string, "hex": string }
  ],
  "typography_suggestion": string
}
`;
}
