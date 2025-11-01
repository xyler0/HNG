import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function evaluatePitch(pitch) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
You are an AI pitch evaluator. Analyze the following startup pitch and rate it
from 1–10 on these criteria:
- Clarity
- Problem Definition
- Solution & Innovation
- Market Potential
- Feasibility / Execution
- Team Strength
- Wow Factor / Creativity

Return JSON only with numeric scores, overall_score (0–100), and a short feedback summary.
Pitch:
${pitch}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = safeParse(text);
  return parsed;
}

function safeParse(txt) {
  try {
    return JSON.parse(txt);
  } catch {
    const match = txt.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : { error: "Invalid JSON", raw: txt };
  }
}
