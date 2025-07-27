export interface Campaign {
  campaignId: string
  userId: string
  name: string
  objective: "Traffic" | "Conversions"
  budget: number | string // Can be string or number from API
  audience?: string // Backend uses 'audience' not 'targetAudience'
  createdAt: string
  updatedAt?: string
}

export interface CreateCampaignDto {
  userId: string
  name: string
  objective: "Traffic" | "Conversions"
  budget: number
  audience: string // Backend expects 'audience' not 'targetAudience'
}

export interface AiSuggestRequest {
  name: string
  objective: string
  budget?: number
}

export interface AiSuggestResponse {
  suggestion: {
    audienceSuggestion: string
    budgetSuggestion: string | number
  }
}
