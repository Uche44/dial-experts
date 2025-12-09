import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight } from "lucide-react"
import { mockExperts } from "@/lib/mock-data"

export function ExpertsPreview() {
  const featuredExperts = mockExperts.slice(0, 4)

  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Featured <span className="gradient-text">Experts</span>
            </h2>
            <p className="text-muted-foreground">Top-rated consultants ready to help you succeed.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/experts">
              View All Experts
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredExperts.map((expert) => (
            <Link key={expert.id} href={`/experts/${expert.id}`} className="group block">
              <div className="p-6 rounded-xl glass border border-border/50 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-14 h-14 border-2 border-primary/30">
                    <AvatarImage src={expert.user.avatar || "/placeholder.svg"} alt={expert.user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {expert.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {expert.user.name}
                    </h3>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {expert.field}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{expert.bio}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{expert.rating}</span>
                    <span className="text-xs text-muted-foreground">({expert.totalReviews})</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">₦{expert.ratePerMin}/min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
