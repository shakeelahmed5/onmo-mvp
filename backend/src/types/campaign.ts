export interface CampaignInput {
    userId: string;
    name: string;
    objective: string;
    budget: number;
    audience: string;
}

export interface Campaign extends CampaignInput {
    campaignId: string;
    createdAt: string;
}
