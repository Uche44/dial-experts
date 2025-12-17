"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, Percent, Clock, Save, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    platformFee: 5,
    minCallDuration: 15,
    maxCallDuration: 60,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings({
            platformFee: data.platformFeePercentage,
            minCallDuration: data.minCallDuration,
            maxCallDuration: data.maxCallDuration,
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformFeePercentage: settings.platformFee,
          minCallDuration: settings.minCallDuration,
          maxCallDuration: settings.maxCallDuration,
        }),
      });

      if (response.ok) {
        toast({
          title: "Settings saved",
          description: "Platform settings have been updated.",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Platform Settings
            </h1>
            <p className="text-muted-foreground">
              Configure platform-wide settings
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Platform Fee */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-primary" />
                Platform Fee
              </CardTitle>
              <CardDescription>
                Set the percentage fee charged on each transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                  <Label htmlFor="platformFee">Fee Percentage</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="platformFee"
                      type="number"
                      value={settings.platformFee}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          platformFee: Number(e.target.value),
                        })
                      }
                      className="bg-input border-border"
                      min={0}
                      max={100}
                    />
                    <span className="text-lg font-medium">%</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 flex-1">
                  <p className="text-sm text-muted-foreground">
                    Example calculation:
                  </p>
                  <p className="text-sm">
                    On a ₦1,000 call, platform keeps{" "}
                    <span className="font-bold text-primary">
                      ₦{((1000 * settings.platformFee) / 100).toFixed(0)}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Duration Settings */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Call Duration Limits
              </CardTitle>
              <CardDescription>
                Set minimum and maximum call durations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minDuration">
                    Minimum Duration (minutes)
                  </Label>
                  <Input
                    id="minDuration"
                    type="number"
                    value={settings.minCallDuration}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        minCallDuration: Number(e.target.value),
                      })
                    }
                    className="bg-input border-border mt-2"
                    min={1}
                  />
                </div>
                <div>
                  <Label htmlFor="maxDuration">
                    Maximum Duration (minutes)
                  </Label>
                  <Input
                    id="maxDuration"
                    type="number"
                    value={settings.maxCallDuration}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxCallDuration: Number(e.target.value),
                      })
                    }
                    className="bg-input border-border mt-2"
                    min={1}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Standard call slots are set to 20 minutes by default.
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
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
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
