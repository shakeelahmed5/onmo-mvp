import OpenAI from "openai";
import { CORS_HEADERS } from "../utils/cors";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const aiSuggest = async (event: any) => {
    try {
        const body = JSON.parse(event.body);
        const { name, objective, budget } = body;

        if (!name || !objective || !budget) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({ error: "Missing required fields" })
            };
        }

        const prompt = `Suggest the best target audience and budget for a digital ad campaign with
objective: {objective}, name: {name}, and initial budget: {budget}.

Respond ONLY in strict JSON format like this:
{
  "audienceSuggestion": "Your short audience description",
  "budgetSuggestion": 123
}

"budgetSuggestion" must be a number only — no currency symbols, words, or formatting.`;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
        });

        const suggestion = response.choices[0].message?.content;

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ suggestion: JSON.parse(suggestion ?? "{}") })
        };
    } catch (err: any) {
        console.error("AI suggest error:", err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Internal server error", details: err.message })
        };
    }
};
