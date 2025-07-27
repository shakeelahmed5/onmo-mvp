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

        const prompt = `Suggest the best target audience and a single recommended budget (as a number in USD) for a digital ad campaign.
Campaign Details:
- Objective: ${objective}
- Name: ${name}
- Initial Budget: $${budget}

Return a JSON object with two fields:
1. audienceSuggestion: string
2. budgetSuggestion: number`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const suggestion = JSON.parse(response.choices[0].message?.content || "{}");

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ suggestion })
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
