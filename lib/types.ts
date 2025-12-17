export type UserRole = "user" | "expert" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  role: UserRole;
  createdAt: Date;
  avatar?: string;
}

export interface Expert {
  id: string;
  userId: string;
  user: User;
  field: string;
  ratePerMin: number;
  bio: string;
  availability?: AvailabilitySlot[];
  rating?: number;
  totalReviews?: number;
  status: "pending" | "approved" | "rejected" | "suspended";
  completedCalls?: number;
  totalEarnings?: number;
  cvUrl?: string;
  certificateUrl?: string;
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: string;
  userId: string;
  expertId: string;
  expert?: Expert;
  user?: User;
  slotStart: Date;
  slotEnd: Date;
  callLink: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  cost: number;
}

export interface Call {
  id: string;
  bookingId: string;
  booking?: Booking;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  amountCharged: number;
  rating?: number;
  review?: string;
}

export interface Transaction {
  id: string;
  type: "payment" | "payout" | "refund";
  amount: number;
  platformFee: number;
  expertAmount: number;
  userId: string;
  user?: User;
  expertId?: string;
  expert?: Expert;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  bookingId?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  expertCount: number;
}

export interface PlatformSettings {
  platformFee: number;
  minCallDuration: number;
  maxCallDuration: number;
}
