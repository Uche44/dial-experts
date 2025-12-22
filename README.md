# Dial-Experts

**Dial-Experts** is a micro-consultation platform that connects users with verified experts across any field for short, pay-per-minute calls (up to 20 minutes).
It eliminates the friction, delays, and overhead of traditional consulting by enabling **fast, secure, on-demand conversations**—and ensures experts are paid fairly and automatically for every minute they spend.

> **Dial-Experts brings experts closer to you.**

##Live link## : dial-experts-seven.vercel.app

---

##  Problem Statement

Getting access to experts today is unnecessarily difficult.

* Long onboarding and scheduling processes
* Minimum consultation fees even for simple questions
* Delayed or manual payments to experts
* High friction for people who only need quick advice

At the same time, experts struggle to efficiently monetize short, high-value interactions.

---

##  Solution

Dial-Experts introduces **micro-consultations**:

* Short calls (max 20 minutes)
* Pay only for the exact time used
* Instant expert payouts
* Secure, non-custodial payments powered by Solana

Users get quick answers.
Experts get paid immediately.
No wallets held by the platform. No escrow. No delays.

---

##  Core Features

###  User Features
 
* Connect a Solana wallet from the dashboard and sign up
* Browse and search verified experts by field
* View expert profiles, rates, and availability
* Book short consultations (≤ 20 minutes)
* Join secure video calls
* Pay per minute automatically
* View call and payment history
* Rate experts after calls (in view)

---

###  Expert Features

* Sign up and submit verification documents
* Create a professional profile:

  * Field / specialization
  * Bio
  * Rate per minute
  * Availability schedule
* Get notified of booked calls
* Join calls via secure links
* Get paid instantly per minute
* View earnings and call history

---

###  Admin Features

* Approve or reject expert applications
* Manage users and experts
* Suspend or edit expert profiles
* Configure platform fee percentage
* View call and transaction logs
* Manual dispute resolution (post-MVP)
* Analytics dashboard (post-MVP)

---

##  Payment & Trust Model

Dial-Experts uses **Solana delegate approvals** to enable secure pre-authorization without custody.

### How Payments Work

1. User selects an expert and starts a call
2. The system checks and **pre-authorizes funds** for the maximum call duration
3. Funds remain in the user’s wallet (not held by Dial-Experts)
4. The call starts and a timer tracks duration
5. When the call ends:

   * The exact amount is charged per minute
   * Expert is paid instantly
   * Any unused funds remain untouched

### Why This Matters

* Users cannot escape without paying
* Experts are guaranteed payment
* Platform never holds user funds
* No escrow contracts needed
* Lower legal and custodial risk

This is the same pattern used by major Solana DeFi protocols.

---

##  Technical Architecture

### Frontend

* **Next.js (App Router)**
* **React + TypeScript**
* Tailwind CSS + shadcn/ui
* Solana wallet adapter for wallet connection

### Backend

* **Next.js API Routes**
* Prisma ORM
* PostgreSQL database
* JWT authentication.

### Blockchain

* **Solana**
* SPL Token standard
* Delegate approvals for pre-authorization
* External wallets (Phantom, Solflare, etc.)

### Calls & Communication

* Third-party video/audio SDK (livekit)
* Secure, ephemeral call links
* Server-side call tracking

---

##  Authentication Model

* Wallet connect and email for account creation
* One wallet can be linked to one account
* Role-based access (user / expert / admin)

This hybrid model keeps onboarding simple for non-crypto users while retaining Web3 payment benefits.

---

##  Database Models (High Level)

* `User`
* `ExpertProfile`
* `Booking`
* `CallSession`
* `Transaction`
* `Admin`

Prisma migrations are used to track schema changes.

---

##  MVP Scope (Lean)

 User & expert signup
 Expert verification flow
 Browse experts
 Book and start calls
 Pre-authorization checks
 Per-minute payment capture
 Instant expert payout
 Admin expert approval

 Disputes, refunds, advanced analytics (post-MVP)

---

##  Roadmap

### Phase 1 – MVP

* Core booking & call flow
* Solana payment integration
* Admin approval panel

### Phase 2 – Growth

* Ratings & reviews
* Dispute resolution
* Expert analytics
* Push notifications

### Phase 3 – Scale

* Mobile app
* DAO-based expert governance
* Subscription models
* Multi-chain support

---

##  Use Cases

* Startup founders needing quick advice
* Students seeking mentorship
* Developers troubleshooting bugs
* Creators consulting industry professionals
* Lifestyle, legal, business, and technical guidance

If you only need **a quick chat**, Dial-Experts is built for you.

---

##  Getting Started (Development)

```bash
git clone https://github.com/your-username/dial-experts.git
cd dial-experts
npm install
```

Set up environment variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXT_PUBLIC_SOLANA_RPC=...
```

Run migrations and start dev server:

```bash
npx prisma migrate dev
npm run dev
```

---

##  Contributing

Contributions, ideas, and feedback are welcome.
Please create a feature branch and open a pull request.

---

##  License

MIT License

---

##  Final Note

Dial-Experts is not just a platform—it’s a new way to **access knowledge instantly** and **monetize expertise efficiently**.

**Fast advice. Fair pay. Zero friction.**

> **Dial-Experts — bringing experts closer to you.**


