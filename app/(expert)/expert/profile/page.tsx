"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { mockExperts, mockCategories } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { User, Camera, Save, Loader2 } from "lucide-react"

export default function ExpertProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const expert = mockExperts[0]

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    field: expert.field,
    bio: expert.bio,
    ratePerMin: expert.ratePerMin.toString(),
    walletAddress: user?.walletAddress || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved successfully.",
    })
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your public profile and settings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>This will be displayed on your public profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-primary/30">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
                <div>
                  <Button type="button" variant="outline" size="sm">
                    Upload New Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet">Solana Wallet Address</Label>
                <Input
                  id="wallet"
                  value={formData.walletAddress}
                  onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                  className="bg-input border-border font-mono"
                />
                <p className="text-xs text-muted-foreground">Payouts will be sent to this address</p>
              </div>
            </CardContent>
          </Card>

          {/* Expert Profile */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Expert Profile</CardTitle>
              <CardDescription>Information visible to clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field">Specialization</Label>
                  <Select value={formData.field} onValueChange={(value) => setFormData({ ...formData, field: value })}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate per Minute (₦)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={formData.ratePerMin}
                    onChange={(e) => setFormData({ ...formData, ratePerMin: e.target.value })}
                    className="bg-input border-border"
                  />
                  <p className="text-xs text-muted-foreground">20-min call = ₦{Number(formData.ratePerMin) * 20}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-input border-border min-h-32"
                  placeholder="Tell clients about your expertise, experience, and what makes you unique..."
                />
                <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 glow-primary">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
