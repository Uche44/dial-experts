"use client"

import type React from "react"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { SolanaLogo } from "@/components/solana-logo"
import { Loader2, Wallet, User, Briefcase, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { UserRole } from "@/lib/types"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = (searchParams.get("role") as UserRole) || "user"
  const { login, isLoading } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<UserRole>(defaultRole)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await login(formData.email, formData.password, activeTab)

    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })

      switch (activeTab) {
        case "admin":
          router.push("/admin")
          break
        case "expert":
          router.push("/expert")
          break
        default:
          router.push("/dashboard")
      }
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    }
  }

  const roleIcons = {
    user: User,
    expert: Briefcase,
    admin: Shield,
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <SolanaLogo className="w-10 h-10" />
            <span className="text-2xl font-bold gradient-text">DialExperts</span>
          </Link>
        </div>

        <Card className="glass border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole)}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="user" className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">User</span>
                </TabsTrigger>
                <TabsTrigger value="expert" className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Expert</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </TabsTrigger>
              </TabsList>

              {(["user", "expert", "admin"] as UserRole[]).map((role) => {
                const Icon = roleIcons[role]
                return (
                  <TabsContent key={role} value={role}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${role}-email`}>Email</Label>
                        <Input
                          id={`${role}-email`}
                          type="email"
                          placeholder={`${role}@dialexperts.com`}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-input border-border"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${role}-password`}>Password</Label>
                        <Input
                          id={`${role}-password`}
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="bg-input border-border"
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
                            Signing in...
                          </>
                        ) : (
                          <>
                            <Icon className="mr-2 h-4 w-4" />
                            Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                )
              })}
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent" disabled>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Solana Wallet
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Demo hint */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Demo: Use any email/password to login. Select a role to access that dashboard.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto px-4 py-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
