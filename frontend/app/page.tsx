"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, DollarSign, Users, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useCampaigns } from "@/hooks/use-campaigns"

export default function CampaignListPage() {
  const { data: campaigns, isLoading, error, refetch, isFetching } = useCampaigns()

  // Ensure campaigns is always an array
  const campaignList = Array.isArray(campaigns) ? campaigns : []

  console.log("Component render - campaigns:", campaigns, "isLoading:", isLoading, "error:", error)

  const getObjectiveColor = (objective: string) => {
    return objective.toLowerCase() === "traffic" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  const handleRefresh = () => {
    console.log("Manual refresh triggered")
    refetch()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your AI-powered advertising campaigns</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isFetching}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <Link href="/create-campaign/">
              <Button className="flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">
                Error: {error instanceof Error ? error.message : "Failed to load campaigns"}
              </p>
              <Button onClick={handleRefresh} className="mt-3 bg-transparent" variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Campaigns Grid */}
        {campaignList.length === 0 && !isLoading ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-6">Create your first AI-powered campaign to get started</p>
              <Link href="/create-campaign/">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignList.map((campaign) => (
              <Card
                key={campaign.campaignId}
                className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg hover:text-blue-600 transition-colors">{campaign.name}</CardTitle>
                    <Badge className={getObjectiveColor(campaign.objective)}>{campaign.objective}</Badge>
                  </div>
                  <CardDescription>Created {new Date(campaign.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Budget: ${campaign.budget}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium mb-1">Target Audience:</p>
                        <p className="text-sm text-gray-600 break-words">
                          {campaign.audience || "No target audience specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
