import { listUserCampaigns } from "../services/campaignService";
import { CORS_HEADERS } from "../utils/cors";

export const listCampaigns = async (event: any) => {
    try {
        const userId = event.queryStringParameters?.userId;
        if (!userId) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({ error: "Missing userId query param" })
            };
        }

        const campaigns = await listUserCampaigns(userId);

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ campaigns })
        };
    } catch (err: any) {
        console.error("List campaigns error:", err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Internal server error", details: err.message })
        };
    }
};
