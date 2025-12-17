"use client";

import type React from "react";
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import {
  Loader2,
  User,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SignupRole = "user" | "expert";

interface SignupFormProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  onComplete: (role: string) => void;
}

interface UserFormData {
  name: string;
  email: string;
}

interface ExpertFormData extends UserFormData {
  cv: File | null;
  certificate: File | null;
  field: string;
  bio: string;
  ratePerMin: string;
}

export default function SignupForm({
  isOpen,
  // onClose,
  walletAddress,
  onComplete,
}: SignupFormProps) {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as SignupRole) || "user";
  const { isLoading, user, setUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SignupRole>(defaultRole);
  const [expertStep, setExpertStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const [userForm, setUserForm] = useState<UserFormData>({
    name: "",
    email: "",
  });

  const [expertForm, setExpertForm] = useState<ExpertFormData>({
    name: "",
    email: "",
    cv: null,
    certificate: null,
    field: "",
    bio: "",
    ratePerMin: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value, files } = e.target as HTMLInputElement;
    if (activeTab === "user") {
      setUserForm((prev) => ({
        ...prev,
        [name]: type === "file" ? (files ? files[0] : null) : value,
      }));
    } else {
      setExpertForm((prev) => ({
        ...prev,
        [name]: type === "file" ? (files ? files[0] : null) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("walletAddress", walletAddress);

    if (activeTab === "user") {
      formData.append("name", userForm.name);
      formData.append("email", userForm.email);
      formData.append("role", "user");
    } else {
      if (expertStep < 3) {
        setExpertStep(expertStep + 1);
        return;
      }

      formData.append("name", expertForm.name);
      formData.append("email", expertForm.email);
      formData.append("role", "expert");
      formData.append("field", expertForm.field);
      formData.append("bio", expertForm.bio);
      formData.append("ratePerMin", expertForm.ratePerMin);

      if (expertForm.cv) formData.append("cv", expertForm.cv);
      if (expertForm.certificate)
        formData.append("certificate", expertForm.certificate);
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUser(data.user);

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      onComplete(activeTab);
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Signup failed",
        variant: "destructive",
      });
    } finally {
      //   loading(false);
    }
  };

  const expertSteps = [
    { number: 1, title: "Account", description: "Basic information" },
    {
      number: 2,
      title: "Certifications",
      description: "Certification details",
    },
    { number: 3, title: "Profile", description: "Expert profile setup" },
  ];

  return (
    <Suspense
      fallback={
        <div className="w-full max-w-lg mx-auto px-4 py-4 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <div className="w-full  max-w-lg mx-auto px-4 py-12">
        <div className="scrollable-div relative bg-black">
          <Card className="glass border-border/50">
            <CardHeader className="text-center">
              <CardDescription>
                Join DialExperts and start connecting with experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(v) => {
                  setActiveTab(v as SignupRole);
                  setExpertStep(1);
                }}
              >
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="user" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    User
                  </TabsTrigger>
                  <TabsTrigger
                    value="expert"
                    className="flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Expert
                  </TabsTrigger>
                </TabsList>

                {/* User Signup Form */}
                <TabsContent value="user">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Full Name</Label>
                      <Input
                        id="user-name"
                        name="name"
                        placeholder="John Doe"
                        value={userForm.name}
                        onChange={handleChange}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={userForm.email}
                        onChange={handleChange}
                        className="bg-transparent border-border"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 glow-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Expert Signup Form */}
                <TabsContent value="expert">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {expertSteps.map((step, index) => (
                      <div key={step.number} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                              expertStep > step.number
                                ? "bg-primary border-primary text-primary-foreground"
                                : expertStep === step.number
                                ? "border-primary text-primary"
                                : "border-muted-foreground/30 text-muted-foreground"
                            }`}
                          >
                            {expertStep > step.number ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              step.number
                            )}
                          </div>
                          <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                            {step.title}
                          </span>
                        </div>
                        {index < expertSteps.length - 1 && (
                          <div
                            className={`w-12 sm:w-20 h-0.5 mx-2 transition-colors ${
                              expertStep > step.number
                                ? "bg-primary"
                                : "bg-muted-foreground/30"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Step 1: Basic Account Info */}
                    {expertStep === 1 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="expert-name">Full Name</Label>
                          <Input
                            id="expert-name"
                            name="name"
                            placeholder="Dr. Jane Smith"
                            value={expertForm.name}
                            onChange={handleChange}
                            className="bg-input border-border"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expert-email">Email</Label>
                          <Input
                            id="expert-email"
                            name="email"
                            type="email"
                            placeholder="jane@example.com"
                            value={expertForm.email}
                            onChange={handleChange}
                            className="bg-input border-border"
                            required
                          />
                        </div>
                      </>
                    )}

                    {/* Step 2: CV / Certificate Upload */}
                    {expertStep === 2 && (
                      <>
                        <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 mb-4">
                          <p className="text-sm text-muted-foreground">
                            Upload your professional documents for verification.
                            These are reviewed manually and never shared.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expert-cv">
                            Upload CV (PDF or DOCX)
                          </Label>
                          <Input
                            id="expert-cv"
                            name="cv"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                            className="bg-input border-border"
                            required
                          />
                          {expertForm.cv && (
                            <div className="mt-2 p-3 border border-border rounded-lg bg-background flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">
                                  {expertForm.cv.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(expertForm.cv.size / 1024).toFixed(1)} KB ·{" "}
                                  {expertForm.cv.type || "Unknown"}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  setExpertForm({ ...expertForm, cv: null })
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expert-certificate">
                            Certification Document
                          </Label>
                          <Input
                            id="expert-certificate"
                            name="certificate"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleChange}
                            className="bg-input border-border"
                            required
                          />
                          {expertForm.certificate && (
                            <div className="mt-2 p-3 border border-border rounded-lg bg-background">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">
                                    {expertForm.certificate.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(
                                      expertForm.certificate.size / 1024
                                    ).toFixed(1)}{" "}
                                    KB · {expertForm.certificate.type}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    setExpertForm({
                                      ...expertForm,
                                      certificate: null,
                                    })
                                  }
                                >
                                  Remove
                                </Button>
                              </div>
                              {expertForm.certificate.type.startsWith(
                                "image/"
                              ) && (
                                <img
                                  src={URL.createObjectURL(
                                    expertForm.certificate
                                  )}
                                  alt="Certificate Preview"
                                  className="mt-3 max-h-48 rounded-md border"
                                />
                              )}
                              {expertForm.certificate.type ===
                                "application/pdf" && (
                                <a
                                  href={URL.createObjectURL(
                                    expertForm.certificate
                                  )}
                                  target="_blank"
                                  className="text-xs mt-3 inline-block text-primary underline"
                                >
                                  View PDF
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Step 3: Profile */}
                    {expertStep === 3 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="expert-field">Specialization</Label>
                          <Select
                            value={expertForm.field}
                            onValueChange={(value) =>
                              setExpertForm({ ...expertForm, field: value })
                            }
                          >
                            <SelectTrigger className="bg-input border-border">
                              <SelectValue placeholder="Select your field" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expert-bio">Bio</Label>
                          <Textarea
                            id="expert-bio"
                            name="bio"
                            placeholder="Tell clients about your expertise and experience..."
                            value={expertForm.bio}
                            onChange={handleChange}
                            className="bg-input border-border min-h-24"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expert-rate">
                            Rate per Minute (₦)
                          </Label>
                          <Input
                            id="expert-rate"
                            name="ratePerMin"
                            type="number"
                            placeholder="50"
                            value={expertForm.ratePerMin}
                            onChange={handleChange}
                            className="bg-input border-border"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            For a 20-min call, client will pay: ₦
                            {(Number(expertForm.ratePerMin) || 0) * 20}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex gap-3">
                      {expertStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setExpertStep(expertStep - 1)}
                          className="flex-1"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="flex-1 bg-primary hover:bg-primary/90 glow-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {expertStep === 3
                              ? "Submitting..."
                              : "Processing..."}
                          </>
                        ) : expertStep === 3 ? (
                          <>
                            Submit Application
                            <CheckCircle className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
