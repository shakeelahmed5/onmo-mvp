import { z } from "zod"

export const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(100, "Campaign name must be less than 100 characters"),
  objective: z.enum(["Traffic", "Conversions"], {
    required_error: "Please select a campaign objective",
  }),
  budget: z
    .string()
    .min(1, "Budget is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Budget must be a positive number"),
  audience: z // Changed from targetAudience to audience
    .string()
    .min(10, "Target audience description must be at least 10 characters")
    .max(500, "Target audience description must be less than 500 characters"),
})

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>
