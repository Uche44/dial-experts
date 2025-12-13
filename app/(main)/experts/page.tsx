"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Filter, SlidersHorizontal, Loader2 } from "lucide-react"
import { mockCategories } from "@/lib/mock-data"
import type { Expert } from "@/lib/types"
import { useExperts } from "@/context/experts-context"

export default function ExpertsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedField, setSelectedField] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("rating")
  const {experts, setExperts} = useExperts()
  // const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch experts from API
  useEffect(() => {
    async function fetchExperts() {
      try {
        setLoading(true)
        const response = await fetch("/api/experts")
        if (!response.ok) {
          throw new Error("Failed to fetch experts")
        }
        const data = await response.json()
        setExperts(data)
        console.log('Experts:', data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchExperts()
  }, [])

  const filteredExperts = experts
    .filter((expert) => {
      const matchesSearch =
        expert.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.bio.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesField = selectedField === "all" || expert.field === selectedField
      return matchesSearch && matchesField && expert.status === "pending"
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "price-low":
          return a.ratePerMin - b.ratePerMin
        case "price-high":
          return b.ratePerMin - a.ratePerMin
        case "reviews":
          return (b.totalReviews || 0) - (a.totalReviews || 0)
        default:
          return 0  
      }
    })

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Find Your <span className="gradient-text">Expert</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our network of verified Web3 experts. Filter by specialization and book a consultation today.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search experts by name, field, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger className="w-48 bg-card border-border">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-card border-border">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading experts...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Results count */}
        {!loading && !error && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredExperts.length} expert{filteredExperts.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Experts Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <Link key={expert.id} href={`/experts/${expert.id}`} className="group">
              <div className="h-full p-6 rounded-xl glass border border-border/50 hover:border-primary/50 transition-all duration-300">
                {/* Expert Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-primary/30">
                    <AvatarImage src={expert.user.avatar || "/placeholder.svg"} alt={expert.user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {expert.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                      {expert.user.name}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      {expert.field}
                    </Badge>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{expert.rating}</span>
                      <span className="text-xs text-muted-foreground">({expert.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{expert.bio}</p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Completed:</span>{" "}
                    <span className="font-medium">{expert.completedCalls} calls</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">₦{expert.ratePerMin}</span>
                    <span className="text-sm text-muted-foreground">/min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
        )}

        {!loading && !error && filteredExperts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No experts found matching your criteria.</p>
            <Button
              variant="link"
              className="text-primary mt-2"
              onClick={() => {
                setSearchQuery("")
                setSelectedField("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
