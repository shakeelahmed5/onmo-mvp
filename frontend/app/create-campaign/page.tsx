"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Sparkles, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateCampaign, useAiSuggest } from "@/hooks/use-campaigns"
import { createCampaignSchema, type CreateCampaignFormData } from "@/lib/form-schemas"
import type { CreateCampaignDto, AiSuggestRequest } from "@/types/campaign"
import { useState } from "react"

const DEMO_USER_ID = "demo-user-123"

export default function CreateCampaignPage() {
  const router = useRouter()
  const [aiSuggestionApplied, setAiSuggestionApplied] = useState(false)

  const createCampaignMutation = useCreateCampaign()
  const aiSuggestMutation = useAiSuggest()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      name: "",
      objective: undefined,
      budget: "",
      audience: "",
    },
    mode: "onChange",
  })

  const watchedName = watch("name")
  const watchedObjective = watch("objective")

  const handleAiSuggest = async () => {
    if (!watchedName || !watchedObjective) {
      return
    }

    const currentBudget = watch("budget")
    const aiRequest: AiSuggestRequest = {
      name: watchedName,
      objective: watchedObjective,
      budget: currentBudget ? Number.parseFloat(currentBudget) : undefined,
    }

    try {
      const response = await aiSuggestMutation.mutateAsync(aiRequest)

      // Apply AI suggestions to form
      if (response.suggestion.budgetSuggestion) {
        setValue("budget", response.suggestion.budgetSuggestion.toString(), { shouldValidate: true })
      }

      if (response.suggestion.audienceSuggestion) {
        setValue("audience", response.suggestion.audienceSuggestion, { shouldValidate: true })
      }

      setAiSuggestionApplied(true)

      // Reset the success indicator after 3 seconds
      setTimeout(() => setAiSuggestionApplied(false), 3000)
    } catch (error) {
      console.error("AI suggestion failed:", error)
    }
  }

  const onSubmit = async (data: CreateCampaignFormData) => {
    const campaignDto: CreateCampaignDto = {
      userId: DEMO_USER_ID,
      name: data.name,
      objective: data.objective,
      budget: Number.parseFloat(data.budget),
      audience: data.audience,
    }

    try {
      console.log("Submitting campaign:", campaignDto)
      const result = await createCampaignMutation.mutateAsync(campaignDto)
      console.log("Campaign created successfully:", result)

      // Add a small delay to ensure the backend has processed the request
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      console.error("Failed to create campaign:", error)
    }
  }

  const canGetAiSuggestions = watchedName && watchedObjective && !aiSuggestMutation.isPending

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">Set up your AI-powered advertising campaign</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Fill in the basic information for your campaign. Use AI suggestions to optimize your targeting and budget.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campaign Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter campaign name"
                      className={`hover:border-gray-400 focus:border-blue-500 transition-colors ${errors.name ? "border-red-500" : ""}`}
                    />
                  )}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Objective */}
              <div className="space-y-2">
                <Label htmlFor="objective">Campaign Objective *</Label>
                <Controller
                  name="objective"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`hover:border-gray-400 focus:border-blue-500 transition-colors ${errors.objective ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select campaign objective" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white shadow-md rounded-md border border-gray-200">
                        <SelectItem value="Traffic">Traffic</SelectItem>
                        <SelectItem value="Conversions">Conversions</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.objective && <p className="text-sm text-red-600">{errors.objective.message}</p>}
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD) *</Label>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="budget"
                      type="number"
                      placeholder="Enter budget amount"
                      min="1"
                      step="0.01"
                      className={`hover:border-gray-400 focus:border-blue-500 transition-colors ${errors.budget ? "border-red-500" : ""}`}
                    />
                  )}
                />
                {errors.budget && <p className="text-sm text-red-600">{errors.budget.message}</p>}
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="audience">Target Audience *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAiSuggest}
                    disabled={!canGetAiSuggestions}
                    className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-colors bg-transparent"
                  >
                    {aiSuggestMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : aiSuggestionApplied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {aiSuggestMutation.isPending
                      ? "Getting AI Suggestions..."
                      : aiSuggestionApplied
                        ? "Applied!"
                        : "AI Suggest"}
                  </Button>
                </div>
                <Controller
                  name="audience"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="audience"
                      placeholder="Describe your target audience..."
                      rows={4}
                      className={`hover:border-gray-400 focus:border-blue-500 transition-colors ${errors.audience ? "border-red-500" : ""}`}
                    />
                  )}
                />
                {errors.audience && <p className="text-sm text-red-600">{errors.audience.message}</p>}
              </div>

              {/* AI Suggestion Error */}
              {aiSuggestMutation.error && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    AI suggestion failed:{" "}
                    {aiSuggestMutation.error instanceof Error ? aiSuggestMutation.error.message : "Unknown error"}
                  </p>
                </div>
              )}

              {/* Create Campaign Error */}
              {createCampaignMutation.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">
                    Failed to create campaign:{" "}
                    {createCampaignMutation.error instanceof Error
                      ? createCampaignMutation.error.message
                      : "Unknown error"}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {createCampaignMutation.isSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">Campaign created successfully! Redirecting to dashboard...</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={!isValid || createCampaignMutation.isPending}
                  className="flex-1 hover:bg-blue-700 disabled:hover:bg-gray-400 transition-colors"
                >
                  {createCampaignMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Campaign...
                    </>
                  ) : (
                    "Create Campaign"
                  )}
                </Button>
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-gray-50 hover:border-gray-300 transition-colors bg-transparent"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
