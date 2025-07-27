import { saveCampaign } from "../services/campaignService";
import { v4 as uuid } from "uuid";
import { CORS_HEADERS } from "../utils/cors";

export const createCampaign = async (event: any) => {
    try {
        const body = JSON.parse(event.body);
        const { userId, name, objective, budget, audience } = body;

        if (!userId || !name || !objective || !budget || !audience) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({ error: "Missing required fields" })
            };
        }

        const campaignId = uuid();

        await saveCampaign({
            campaignId,
            userId,
            name,
            objective,
            budget,
            audience,
            createdAt: new Date().toISOString()
        });

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: "Campaign created", campaignId })
        };
    } catch (err: any) {
        console.error("Create campaign error:", err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Internal server error", details: err.message })
        };
    }
};
