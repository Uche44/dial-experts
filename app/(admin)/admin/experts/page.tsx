"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockExperts } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  Search,
  MoreHorizontal,
  Check,
  X,
  Eye,
  Trash,
  Ban,
  Star,
} from "lucide-react";
import type { Expert } from "@/lib/types";

export default function AdminExpertsPage() {
  const { toast } = useToast();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "suspend" | "delete" | null
  >(null);

  const fetchExperts = async () => {
    try {
      const response = await fetch("/api/admin/experts");
      if (response.ok) {
        const data = await response.json();
        setExperts(data.experts);
      }
    } catch (error) {
      console.error("Error fetching experts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch experts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const filteredExperts = experts.filter(
    (expert) =>
      expert.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (
    expert: Expert,
    action: "approve" | "reject" | "suspend" | "delete"
  ) => {
    setSelectedExpert(expert);
    setActionType(action);
    setActionModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedExpert || !actionType) return;

    try {
      let response;
      if (actionType === "delete") {
        response = await fetch(`/api/admin/experts/${selectedExpert.id}`, {
          method: "DELETE",
        });
      } else {
        const statusMap = {
          approve: "approved",
          reject: "rejected",
          suspend: "suspended",
        };
        response = await fetch(`/api/admin/experts/${selectedExpert.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: statusMap[actionType] }),
        });
      }

      if (response.ok) {
        toast({
          title: `Expert ${actionType}d`,
          description: `${selectedExpert.user.name} has been ${actionType}d successfully.`,
        });
        fetchExperts();
      } else {
        throw new Error("Action failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${actionType} expert`,
        variant: "destructive",
      });
    } finally {
      setActionModalOpen(false);
      setSelectedExpert(null);
      setActionType(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-chart-3 text-chart-3-foreground">Approved</Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
          >
            Pending
          </Badge>
        );
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Expert Management
              </h1>
              <p className="text-muted-foreground">
                Review and manage expert accounts
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Experts</p>
              <p className="text-2xl font-bold">{experts.length}</p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-500">
                {experts.filter((e) => e.status === "pending").length}
              </p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-chart-3">
                {experts.filter((e) => e.status === "approved").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Experts Table */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>All Experts</CardTitle>
            <CardDescription>
              Manage expert applications and accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expert</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperts.map((expert) => (
                  <TableRow key={expert.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={expert.user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {expert.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{expert.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {expert.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{expert.field}</TableCell>
                    <TableCell>₦{expert.ratePerMin}/min</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {expert.rating || 0}
                      </div>
                    </TableCell>
                    <TableCell>{expert.completedCalls || 0}</TableCell>
                    <TableCell>{getStatusBadge(expert.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedExpert(expert);
                              setViewModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {expert.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleAction(expert, "approve")}
                              >
                                <Check className="w-4 h-4 mr-2 text-chart-3" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(expert, "reject")}
                              >
                                <X className="w-4 h-4 mr-2 text-destructive" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {expert.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => handleAction(expert, "suspend")}
                            >
                              <Ban className="w-4 h-4 mr-2 text-yellow-500" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleAction(expert, "delete")}
                            className="text-destructive"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Expert Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="glass border-border/50 max-w-lg">
            <DialogHeader>
              <DialogTitle>Expert Details</DialogTitle>
            </DialogHeader>
            {selectedExpert && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={selectedExpert.user.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xl">
                      {selectedExpert.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedExpert.user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedExpert.user.email}
                    </p>
                    {getStatusBadge(selectedExpert.status)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm text-muted-foreground">Field</p>
                    <p className="font-medium">{selectedExpert.field}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rate</p>
                    <p className="font-medium">
                      ₦{selectedExpert.ratePerMin}/min
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-medium">
                      {selectedExpert.rating || 0} (
                      {selectedExpert.totalReviews || 0} reviews)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Completed Calls
                    </p>
                    <p className="font-medium">
                      {selectedExpert.completedCalls || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Earnings
                    </p>
                    <p className="font-medium">
                      ₦{(selectedExpert.totalEarnings || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wallet</p>
                    <p className="font-mono text-sm">
                      {selectedExpert.user.walletAddress || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bio</p>
                  <p className="text-sm">{selectedExpert.bio}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {selectedExpert.cvUrl && (
                    <div className="p-3 border border-border rounded-lg">
                      <p className="text-sm font-medium mb-2">CV / Resume</p>
                      <a
                        href={selectedExpert.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Document
                      </a>
                    </div>
                  )}
                  {selectedExpert.certificateUrl && (
                    <div className="p-3 border border-border rounded-lg">
                      <p className="text-sm font-medium mb-2">Certificate</p>
                      <a
                        href={selectedExpert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Confirmation Modal */}
        <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
          <DialogContent className="glass border-border/50">
            <DialogHeader>
              <DialogTitle className="capitalize">
                {actionType} Expert
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {actionType}{" "}
                {selectedExpert?.user.name}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                variant={actionType === "approve" ? "default" : "destructive"}
              >
                Confirm {actionType}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
