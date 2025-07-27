import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCampaigns, createCampaign, aiSuggest } from "@/lib/api-service"
import type { CreateCampaignDto, AiSuggestRequest, Campaign } from "@/types/campaign"

const DEMO_USER_ID = "demo-user-123"

export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns", DEMO_USER_ID],
    queryFn: () => {
      console.log("React Query: Fetching campaigns for user:", DEMO_USER_ID)
      return getCampaigns(DEMO_USER_ID)
    },
    initialData: [],
    staleTime: 0, // Always refetch to ensure fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateCampaignDto) => {
      console.log("React Query: Creating campaign:", dto)
      return createCampaign(dto)
    },
    onSuccess: (data) => {
      console.log("React Query: Campaign created successfully:", data)
      // Invalidate and refetch campaigns
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
      // Also refetch immediately
      queryClient.refetchQueries({ queryKey: ["campaigns"] })
    },
    onError: (error) => {
      console.error("React Query: Campaign creation failed:", error)
    },
  })
}

export function useAiSuggest() {
  return useMutation({
    mutationFn: (request: AiSuggestRequest) => {
      console.log("React Query: AI suggest request:", request)
      return aiSuggest(request)
    },
    onSuccess: (data) => {
      console.log("React Query: AI suggest success:", data)
    },
    onError: (error) => {
      console.error("React Query: AI suggest failed:", error)
    },
  })
}
