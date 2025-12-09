import type {
  User,
  Expert,
  Booking,
  Call,
  Transaction,
  Category,
  PlatformSettings,
} from "./types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    walletAddress: "7xKX...9kPz",
    role: "user",
    createdAt: new Date("2024-01-15"),
    avatar: "/professional-man-avatar.png",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    walletAddress: "8yLY...4mQa",
    role: "user",
    createdAt: new Date("2024-02-20"),
    avatar: "/professional-woman-avatar.png",
  },
  {
    id: "expert-user-1",
    name: "Dr. Sarah Chen",
    email: "sarah@dialexperts.com",
    walletAddress: "3zMZ...5nRb",
    role: "expert",
    createdAt: new Date("2024-01-10"),
    avatar: "/asian-woman-doctor-professional.jpg",
  },
  {
    id: "expert-user-2",
    name: "Alex Thompson",
    email: "alex@dialexperts.com",
    walletAddress: "5aNa...7oSc",
    role: "expert",
    createdAt: new Date("2024-01-12"),
    avatar: "/professional-man-consultant.png",
  },
  {
    id: "expert-user-3",
    name: "Maria Garcia",
    email: "maria@dialexperts.com",
    walletAddress: "6bOb...8pTd",
    role: "expert",
    createdAt: new Date("2024-01-18"),
    avatar: "/latina-business-professional.png",
  },
  {
    id: "expert-user-4",
    name: "James Wilson",
    email: "james@dialexperts.com",
    walletAddress: "2cPc...9qUe",
    role: "expert",
    createdAt: new Date("2024-02-01"),
    avatar: "/black-man-financial-advisor.jpg",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@dialexperts.com",
    walletAddress: "9dQd...1rVf",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    avatar: "/admin-professional-avatar.jpg",
  },
];

// Mock Experts
export const mockExperts: Expert[] = [
  {
    id: "expert-1",
    userId: "expert-user-1",
    user: mockUsers.find((u) => u.id === "expert-user-1")!,
    field: "Web3 Development",
    ratePerMin: 50,
    bio: "Senior blockchain developer with 8+ years of experience in Solana, Ethereum, and DeFi protocols. I help teams build secure and scalable smart contracts.",
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "15:00" },
    ],
    rating: 4.9,
    totalReviews: 156,
    status: "approved",
    completedCalls: 234,
    totalEarnings: 125000,
  },
  {
    id: "expert-2",
    userId: "expert-user-2",
    user: mockUsers.find((u) => u.id === "expert-user-2")!,
    field: "Tokenomics",
    ratePerMin: 75,
    bio: "Crypto economist specializing in token design, incentive mechanisms, and market dynamics. Advised 50+ successful token launches.",
    availability: [
      { day: "Monday", startTime: "10:00", endTime: "18:00" },
      { day: "Wednesday", startTime: "10:00", endTime: "18:00" },
      { day: "Friday", startTime: "10:00", endTime: "16:00" },
    ],
    rating: 4.8,
    totalReviews: 89,
    status: "approved",
    completedCalls: 145,
    totalEarnings: 98000,
  },
  {
    id: "expert-3",
    userId: "expert-user-3",
    user: mockUsers.find((u) => u.id === "expert-user-3")!,
    field: "Legal & Compliance",
    ratePerMin: 100,
    bio: "Crypto attorney with expertise in regulatory compliance, SEC matters, and international crypto law. Helping projects navigate the legal landscape.",
    availability: [
      { day: "Tuesday", startTime: "08:00", endTime: "16:00" },
      { day: "Thursday", startTime: "08:00", endTime: "16:00" },
    ],
    rating: 4.95,
    totalReviews: 67,
    status: "approved",
    completedCalls: 112,
    totalEarnings: 180000,
  },
  {
    id: "expert-4",
    userId: "expert-user-4",
    user: mockUsers.find((u) => u.id === "expert-user-4")!,
    field: "DeFi Strategy",
    ratePerMin: 60,
    bio: "DeFi strategist and yield optimizer. I help investors maximize returns while managing risk across multiple protocols.",
    availability: [
      { day: "Monday", startTime: "12:00", endTime: "20:00" },
      { day: "Tuesday", startTime: "12:00", endTime: "20:00" },
      { day: "Wednesday", startTime: "12:00", endTime: "20:00" },
      { day: "Thursday", startTime: "12:00", endTime: "20:00" },
    ],
    rating: 4.7,
    totalReviews: 203,
    status: "approved",
    completedCalls: 298,
    totalEarnings: 156000,
  },
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    expertId: "expert-1",
    expert: mockExperts[0],
    user: mockUsers[0],
    slotStart: new Date(Date.now() + 3600000),
    slotEnd: new Date(Date.now() + 4800000),
    callLink: "https://meet.dialexperts.com/room-abc123",
    status: "confirmed",
    cost: 1000,
  },
  {
    id: "booking-2",
    userId: "user-2",
    expertId: "expert-2",
    expert: mockExperts[1],
    user: mockUsers[1],
    slotStart: new Date(Date.now() - 86400000),
    slotEnd: new Date(Date.now() - 85200000),
    callLink: "https://meet.dialexperts.com/room-def456",
    status: "completed",
    cost: 1500,
  },
];

// Mock Calls
export const mockCalls: Call[] = [
  {
    id: "call-1",
    bookingId: "booking-2",
    booking: mockBookings[1],
    startTime: new Date(Date.now() - 86400000),
    endTime: new Date(Date.now() - 85200000),
    durationMinutes: 20,
    amountCharged: 1500,
    rating: 5,
    review: "Excellent session! Very knowledgeable about tokenomics.",
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    type: "payment",
    amount: 1500,
    from: "8yLY...4mQa",
    to: "platform",
    status: "completed",
    createdAt: new Date(Date.now() - 86400000),
    callId: "call-1",
  },
  {
    id: "tx-2",
    type: "payout",
    amount: 1425,
    from: "platform",
    to: "5aNa...7oSc",
    status: "completed",
    createdAt: new Date(Date.now() - 86300000),
    callId: "call-1",
  },
];

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Web3 Development",
    description: "Smart contracts, dApps, and blockchain development",
    expertCount: 45,
  },
  {
    id: "cat-2",
    name: "Legal",
    description: "Attorneys and Legal Experts",
    expertCount: 41,
  },
  // {
  //   id: "cat-2",
  //   name: "Tokenomics",
  //   description: "Token design, economics, and market dynamics",
  //   expertCount: 23,
  // },
  // {
  //   id: "cat-3",
  //   name: "Legal & Compliance",
  //   description: "Regulatory guidance and legal consulting",
  //   expertCount: 18,
  // },
  // {
  //   id: "cat-4",
  //   name: "DeFi Strategy",
  //   description: "Yield optimization and DeFi protocols",
  //   expertCount: 34,
  // },
  // {
  //   id: "cat-5",
  //   name: "NFT & Gaming",
  //   description: "NFT creation, gaming, and metaverse",
  //   expertCount: 29,
  // },
  {
    id: "cat-6",
    name: "Marketing & Growth",
    description: "Web3 marketing and community building",
    expertCount: 41,
  },
  {
    id: "cat-7",
    name: "Health Experts",
    description: "Health and wellness",
    expertCount: 41,
  },
  {
    id: "cat-8",
    name: "Entertainment",
    description: "Music, Acting and Shows",
    expertCount: 41,
  },
  {
    id: "cat-9",
    name: "Real Estate",
    description: "REal Estate and Property Experts",
    expertCount: 41,
  },
  {
    id: "cat-10",
    name: "Software Engineering",
    description: "TEch Professionals",
    expertCount: 41,
  },
];

// Platform Settings
export const mockPlatformSettings: PlatformSettings = {
  platformFee: 5,
  minCallDuration: 5,
  maxCallDuration: 60,
};
