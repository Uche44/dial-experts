"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { CATEGORIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { User, Camera, Save, Loader2 } from "lucide-react";
import type { Expert } from "@/lib/types";

export default function ExpertProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    field: "",
    bio: "",
    ratePerMin: "",
    walletAddress: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true);
        const response = await fetch("/api/expert/profile");

        if (!response.ok) {
          toast({
            title: "Error",
            description: "Failed to load profile",
            variant: "destructive",
          });
          return;
        }

        const data = await response.json();
        setExpert(data);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          field: data.field,
          bio: data.bio,
          ratePerMin: data.ratePerMin.toString(),
          walletAddress: data.user.walletAddress || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/expert/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          field: formData.field,
          bio: formData.bio,
          ratePerMin: formData.ratePerMin,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedExpert = await response.json();
      setExpert(updatedExpert);

      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your public profile and settings
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                This will be displayed on your public profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-primary/30">
                    <AvatarImage
                      src={user?.avatar || "/placeholder.svg"}
                      alt={user?.name}
                    />
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
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-input border-border"
                    placeholder={expert?.user.email}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet">Solana Wallet Address</Label>
                <Input
                  id="wallet"
                  value={formData.walletAddress}
                  readOnly
                  disabled
                  className="bg-muted/50 border-border font-mono cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Wallet address cannot be changed
                </p>
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
                  <Select
                    value={formData.field}
                    onValueChange={(value) =>
                      setFormData({ ...formData, field: value })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat: { id: string; name: string }) => (
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
                    onChange={(e) =>
                      setFormData({ ...formData, ratePerMin: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    20-min call = ₦{Number(formData.ratePerMin) * 20}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="bg-input border-border min-h-32"
                  placeholder="Tell clients about your expertise, experience, and what makes you unique..."
                />
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 glow-primary"
            >
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
  );
}
