import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateBrandText = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a luxury brand strategist." },
      { role: "user", content: prompt }
    ],
    temperature: 0.8,
  });

  const content = response.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("JSON PARSE ERROR:", content);
    throw new Error("INVALID_AI_JSON");
  }
};