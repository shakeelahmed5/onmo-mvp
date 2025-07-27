import type { Campaign, CreateCampaignDto, AiSuggestRequest, AiSuggestResponse } from "@/types/campaign";

const BASE_URL = "https://o47ptmvflj.execute-api.us-east-1.amazonaws.com/dev";

function toJSON<T>(res: Response): Promise<T> {
    if (!res.ok) {
        return res.text().then(t => {
            throw new Error(t || `HTTP ${res.status}`);
        });
    }
    return res.json() as Promise<T>;
}

export async function getCampaigns(userId: string): Promise<Campaign[]> {
    try {
        const url = `${BASE_URL}/campaigns?userId=${encodeURIComponent(userId)}`;
        console.log("Fetching campaigns from:", url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Response status:", res.status);

        const data = await toJSON<{ campaigns: Campaign[] }>(res);
        console.log("API Response:", data);

        // Ensure we always return an array
        const campaigns = Array.isArray(data.campaigns) ? data.campaigns : [];
        console.log("Processed campaigns:", campaigns);

        return campaigns;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
    }
}

export async function createCampaign(dto: CreateCampaignDto): Promise<{ message: string; campaignId: string }> {
    try {
        console.log("Creating campaign with data:", dto);

        const res = await fetch(`${BASE_URL}/campaigns`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        console.log("Create campaign response status:", res.status);

        const result = await toJSON<{ message: string; campaignId: string }>(res);
        console.log("Create campaign result:", result);

        return result;
    } catch (error) {
        console.error("Error creating campaign:", error);
        throw error;
    }
}

export async function aiSuggest(payload: AiSuggestRequest): Promise<AiSuggestResponse> {
    try {
        console.log("AI suggest request:", payload);

        const res = await fetch(`${BASE_URL}/ai-suggest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        console.log("AI suggest response status:", res.status);

        const result = await toJSON<AiSuggestResponse>(res);
        console.log("AI suggest result:", result);

        return result;
    } catch (error) {
        console.error("Error with AI suggest:", error);
        throw error;
    }
}
