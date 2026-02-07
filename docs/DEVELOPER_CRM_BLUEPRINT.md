# Developer Operations CRM — Technical Blueprint

## Overview

**Project Name:** DevOps CRM (Developer Operations CRM)  
**Project Type:** Multi-entity relationship management system for residential real estate developers  
**Primary Goal:** Centralize all business relationships — investors, land leads, subcontractors, buyers, vendors — in one purpose-built system  

**Why Custom vs. HubSpot/Salesforce:**
- Generic CRMs don't understand construction/development workflows
- No concept of "land leads," "draw schedules," "COI expiration," or "investor distributions"
- Forces awkward workarounds (custom fields everywhere, no real relationships)
- A purpose-built system is 10x more useful for this specific business

**Target Users:** 
- Small residential developers (1-10 employees)
- General contractors transitioning to development
- Owner-operators managing their own deal flow

---

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | Vue 3 (Composition API) | Consistent with Investor Portal |
| **UI Framework** | Tailwind CSS + Headless UI | Accessible components |
| **State Management** | Pinia | Vue's official state management |
| **Backend** | Node.js + Express | Simple REST API |
| **Database** | SQLite (dev) → PostgreSQL (prod) | Start lite, scale later |
| **ORM** | Prisma | Type-safe database access |
| **Auth** | Better Auth or Lucia | Session-based, simple |
| **File Storage** | Local (dev) → S3/Cloudflare R2 (prod) | For documents, COIs, photos |
| **Hosting** | Railway / Render / Fly.io | Easy Node deployment |
| **Form Handling** | VeeValidate + Zod | Schema-based validation |

---

## Core Entities & Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER CRM - DATA MODEL                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐            │
│  │   INVESTORS  │       │   PROJECTS   │       │    BUYERS    │            │
│  │──────────────│       │──────────────│       │──────────────│            │
│  │ name         │       │ name         │       │ name         │            │
│  │ email        │◄─────►│ address      │◄─────►│ email        │            │
│  │ phone        │       │ status       │       │ phone        │            │
│  │ company      │       │ land_cost    │       │ preapproved  │            │
│  │ accredited   │       │ build_budget │       │ price_range  │            │
│  │ investment_  │       │ target_sale  │       │ status       │            │
│  │   capacity   │       │ start_date   │       │ source       │            │
│  │ status       │       │ end_date     │       │ assigned_    │            │
│  │ committed_   │       │              │       │   project    │            │
│  │   amount     │       │              │       │              │            │
│  └──────────────┘       └──────────────┘       └──────────────┘            │
│         │                      │                      │                     │
│         │                      │                      │                     │
│         ▼                      ▼                      ▼                     │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐            │
│  │ INVESTMENTS  │       │  LAND LEADS  │       │  SHOWINGS    │            │
│  │──────────────│       │──────────────│       │──────────────│            │
│  │ investor_id  │       │ address      │       │ buyer_id     │            │
│  │ project_id   │       │ parcel_id    │       │ project_id   │            │
│  │ amount       │       │ owner_name   │       │ date_time    │            │
│  │ date         │       │ asking_price │       │ notes        │            │
│  │ type         │       │ zoning       │       │ feedback     │            │
│  │ terms        │       │ acreage      │       │ interest_    │            │
│  │ distributions│       │ status       │       │   level      │            │
│  └──────────────┘       │ source       │       └──────────────┘            │
│                         │ notes        │                                    │
│                         └──────────────┘                                    │
│                                                                             │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐            │
│  │SUBCONTRACTORS│       │   VENDORS    │       │  ACTIVITIES  │            │
│  │──────────────│       │──────────────│       │──────────────│            │
│  │ company_name │       │ company_name │       │ entity_type  │            │
│  │ contact_name │       │ contact_name │       │ entity_id    │            │
│  │ trade        │       │ category     │       │ type (call,  │            │
│  │ email        │       │ email        │       │  email, meet,│            │
│  │ phone        │       │ phone        │       │  note, task) │            │
│  │ license_num  │       │ payment_terms│       │ subject      │            │
│  │ license_exp  │       │ notes        │       │ description  │            │
│  │ insurance_exp│       │              │       │ date         │            │
│  │ coi_document │       │              │       │ completed    │            │
│  │ hourly_rate  │       │              │       │ due_date     │            │
│  │ status       │       │              │       │ assigned_to  │            │
│  │ rating       │       │              │       │              │            │
│  │ notes        │       │              │       │              │            │
│  └──────────────┘       └──────────────┘       └──────────────┘            │
│         │                                              │                    │
│         │                                              │                    │
│         ▼                                              │                    │
│  ┌──────────────┐                                      │                    │
│  │     BIDS     │◄─────────────────────────────────────┘                    │
│  │──────────────│                                                           │
│  │ sub_id       │       ┌──────────────┐                                    │
│  │ project_id   │       │    USERS     │                                    │
│  │ scope        │       │──────────────│                                    │
│  │ amount       │       │ email        │                                    │
│  │ submitted_at │       │ name         │                                    │
│  │ status       │       │ role         │                                    │
│  │ notes        │       │ password_hash│                                    │
│  │ documents    │       │              │                                    │
│  └──────────────┘       └──────────────┘                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // Switch to "postgresql" for production
  url      = env("DATABASE_URL")
}

// ============================================================================
// USERS & AUTH
// ============================================================================

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  passwordHash  String
  role          Role     @default(USER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  activities    Activity[]
  assignedTasks Activity[] @relation("AssignedTasks")
}

enum Role {
  ADMIN
  USER
  VIEWER
}

// ============================================================================
// INVESTORS
// ============================================================================

model Investor {
  id                String   @id @default(cuid())
  
  // Contact Info
  firstName         String
  lastName          String
  email             String   @unique
  phone             String?
  company           String?
  
  // Investor Profile
  accreditedStatus  AccreditedStatus @default(UNKNOWN)
  investmentCapacity String?          // e.g., "$100K-$250K"
  preferredStructure String?          // e.g., "Equity", "Debt", "Either"
  
  // Pipeline Status
  status            InvestorStatus @default(LEAD)
  source            String?        // How they found us
  
  // Commitment (when they invest)
  committedAmount   Float?
  committedDate     DateTime?
  
  // Relationships
  investments       Investment[]
  activities        Activity[]
  
  // Meta
  notes             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum AccreditedStatus {
  VERIFIED
  SELF_REPORTED
  UNKNOWN
  NOT_ACCREDITED
}

enum InvestorStatus {
  LEAD              // Just inquired
  CONTACTED         // We've reached out
  MEETING_SCHEDULED // Call/meeting on calendar
  REVIEWING_DOCS    // Sent investor packet
  NEGOTIATING       // Discussing terms
  COMMITTED         // Verbal/written commitment
  FUNDED            // Money received
  DECLINED          // Not interested
  INACTIVE          // Gone cold
}

// ============================================================================
// PROJECTS
// ============================================================================

model Project {
  id              String   @id @default(cuid())
  
  // Basic Info
  name            String           // e.g., "Springfield Pilot - 5 Homes"
  address         String?
  city            String?
  state           String   @default("OR")
  zip             String?
  
  // Financials
  landCost        Float?
  buildBudget     Float?
  targetSalePrice Float?
  actualSalePrice Float?
  
  // Timeline
  status          ProjectStatus @default(PLANNING)
  startDate       DateTime?
  targetEndDate   DateTime?
  actualEndDate   DateTime?
  
  // Relationships
  investments     Investment[]
  landLeads       LandLead[]
  bids            Bid[]
  buyers          Buyer[]
  showings        Showing[]
  activities      Activity[]
  
  // Meta
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum ProjectStatus {
  PLANNING        // Pre-funding
  FUNDED          // Capital secured
  LAND_SEARCH     // Looking for lots
  LAND_ACQUIRED   // Lot purchased
  PERMITTING      // Design & permits
  CONSTRUCTION    // Building
  COMPLETED       // Build done
  LISTED          // On market
  UNDER_CONTRACT  // Buyer under contract
  SOLD            // Closed
  CANCELLED       // Project cancelled
}

// ============================================================================
// INVESTMENTS (Junction: Investor <-> Project)
// ============================================================================

model Investment {
  id              String   @id @default(cuid())
  
  investorId      String
  investor        Investor @relation(fields: [investorId], references: [id])
  
  projectId       String
  project         Project  @relation(fields: [projectId], references: [id])
  
  // Terms
  amount          Float
  type            InvestmentType
  interestRate    Float?           // For debt investments
  equityPercent   Float?           // For equity investments
  terms           String?          // Free text for special terms
  
  // Timeline
  fundedDate      DateTime?
  maturityDate    DateTime?
  
  // Tracking
  status          InvestmentStatus @default(PENDING)
  
  // Distributions
  distributions   Distribution[]
  
  // Meta
  documents       String?          // JSON array of document URLs
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([investorId, projectId])
}

enum InvestmentType {
  EQUITY
  PREFERRED_EQUITY
  DEBT
  CONVERTIBLE
}

enum InvestmentStatus {
  PENDING         // Commitment made, not yet funded
  FUNDED          // Money received
  ACTIVE          // Project in progress
  DISTRIBUTING    // Returning capital
  CLOSED          // Fully returned
  DEFAULTED       // Problem
}

model Distribution {
  id              String   @id @default(cuid())
  
  investmentId    String
  investment      Investment @relation(fields: [investmentId], references: [id])
  
  amount          Float
  type            DistributionType
  date            DateTime
  notes           String?
  
  createdAt       DateTime @default(now())
}

enum DistributionType {
  RETURN_OF_CAPITAL
  PROFIT_DISTRIBUTION
  INTEREST_PAYMENT
  FINAL_DISTRIBUTION
}

// ============================================================================
// LAND LEADS
// ============================================================================

model LandLead {
  id              String   @id @default(cuid())
  
  // Location
  address         String
  city            String?
  state           String   @default("OR")
  zip             String?
  parcelId        String?          // County parcel ID
  
  // Property Details
  acreage         Float?
  zoning          String?          // e.g., "R-1", "R-2", "PUD"
  utilities       String?          // e.g., "All available", "Need septic"
  topography      String?          // e.g., "Flat", "Sloped", "Buildable"
  
  // Owner Info
  ownerName       String?
  ownerPhone      String?
  ownerEmail      String?
  ownerAddress    String?
  
  // Deal Info
  askingPrice     Float?
  estimatedValue  Float?
  pricePerAcre    Float?
  
  // Status
  status          LandLeadStatus @default(NEW)
  source          String?        // e.g., "MLS", "Direct Mail", "Driving for Dollars"
  
  // Assignment
  projectId       String?
  project         Project? @relation(fields: [projectId], references: [id])
  
  // Relationships
  activities      Activity[]
  
  // Meta
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum LandLeadStatus {
  NEW             // Just identified
  RESEARCHING     // Pulling data
  CONTACTED       // Reached out to owner
  NEGOTIATING     // In discussions
  UNDER_CONTRACT  // Signed PSA
  DUE_DILIGENCE   // Inspections, title, etc.
  CLOSED          // We own it
  PASSED          // Not pursuing
  LOST            // Someone else got it
}

// ============================================================================
// SUBCONTRACTORS
// ============================================================================

model Subcontractor {
  id              String   @id @default(cuid())
  
  // Company Info
  companyName     String
  contactName     String
  trade           Trade
  
  // Contact
  email           String?
  phone           String
  address         String?
  city            String?
  state           String   @default("OR")
  
  // Licensing & Insurance
  licenseNumber   String?
  licenseExpiry   DateTime?
  insuranceExpiry DateTime?
  coiDocumentUrl  String?          // Certificate of Insurance PDF
  bondAmount      Float?
  
  // Rates
  hourlyRate      Float?
  dayRate         Float?
  preferredPayment String?         // e.g., "Net 30", "COD", "Progress"
  
  // Performance
  status          SubcontractorStatus @default(ACTIVE)
  rating          Int?             // 1-5 stars
  reliabilityScore Int?            // Internal score
  
  // Relationships
  bids            Bid[]
  activities      Activity[]
  
  // Meta
  notes           String?
  tags            String?          // JSON array for filtering
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum Trade {
  GENERAL
  CONCRETE
  FRAMING
  ELECTRICAL
  PLUMBING
  HVAC
  INSULATION
  ROOFING
  SIDING
  DRYWALL
  PAINTING
  FLOORING
  TILE
  CABINETS
  COUNTERTOPS
  LANDSCAPING
  EXCAVATION
  GRADING
  SURVEYING
  ENGINEERING
  ARCHITECTURE
  OTHER
}

enum SubcontractorStatus {
  ACTIVE          // Good to work with
  PREFERRED       // Top tier, priority
  PROBATION       // Had issues, monitoring
  INACTIVE        // Not currently using
  BLACKLISTED     // Do not use
}

// ============================================================================
// BIDS
// ============================================================================

model Bid {
  id              String   @id @default(cuid())
  
  // Relationships
  subcontractorId String
  subcontractor   Subcontractor @relation(fields: [subcontractorId], references: [id])
  
  projectId       String
  project         Project @relation(fields: [projectId], references: [id])
  
  // Bid Details
  scope           String           // Description of work
  amount          Float
  breakdown       String?          // JSON for line items
  
  // Timeline
  submittedAt     DateTime @default(now())
  validUntil      DateTime?
  
  // Status
  status          BidStatus @default(RECEIVED)
  
  // Documents
  documents       String?          // JSON array of URLs
  
  // Meta
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum BidStatus {
  REQUESTED       // Sent scope, waiting for bid
  RECEIVED        // Bid submitted
  UNDER_REVIEW    // Evaluating
  SHORTLISTED     // Top contender
  AWARDED         // They got the job
  REJECTED        // Not selected
  WITHDRAWN       // Sub withdrew
}

// ============================================================================
// BUYERS
// ============================================================================

model Buyer {
  id              String   @id @default(cuid())
  
  // Contact Info
  firstName       String
  lastName        String
  email           String
  phone           String?
  
  // Qualification
  preApproved     Boolean  @default(false)
  preApprovalAmount Float?
  lenderName      String?
  priceRangeMin   Float?
  priceRangeMax   Float?
  
  // Preferences
  bedroomsMin     Int?
  bathroomsMin    Float?
  sqftMin         Int?
  mustHaves       String?          // JSON array
  
  // Status
  status          BuyerStatus @default(LEAD)
  source          String?          // e.g., "Zillow", "Referral", "Sign"
  
  // Assignment
  interestedProjectId String?
  interestedProject   Project? @relation(fields: [interestedProjectId], references: [id])
  
  // Relationships
  showings        Showing[]
  activities      Activity[]
  
  // Meta
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum BuyerStatus {
  LEAD            // Just inquired
  CONTACTED       // We've reached out
  QUALIFIED       // Confirmed financing
  SHOWING         // Actively viewing
  OFFER_MADE      // Submitted offer
  UNDER_CONTRACT  // Accepted, in escrow
  CLOSED          // Sale complete
  LOST            // Bought elsewhere
  INACTIVE        // Gone cold
}

// ============================================================================
// SHOWINGS
// ============================================================================

model Showing {
  id              String   @id @default(cuid())
  
  buyerId         String
  buyer           Buyer    @relation(fields: [buyerId], references: [id])
  
  projectId       String
  project         Project  @relation(fields: [projectId], references: [id])
  
  // Scheduling
  dateTime        DateTime
  duration        Int      @default(30) // minutes
  
  // Outcome
  status          ShowingStatus @default(SCHEDULED)
  interestLevel   Int?     // 1-5
  feedback        String?
  
  // Meta
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum ShowingStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
}

// ============================================================================
// VENDORS (Suppliers, Services)
// ============================================================================

model Vendor {
  id              String   @id @default(cuid())
  
  // Company Info
  companyName     String
  contactName     String?
  category        VendorCategory
  
  // Contact
  email           String?
  phone           String?
  website         String?
  address         String?
  
  // Terms
  paymentTerms    String?          // e.g., "Net 30", "2% 10 Net 30"
  accountNumber   String?
  
  // Status
  status          VendorStatus @default(ACTIVE)
  
  // Relationships
  activities      Activity[]
  
  // Meta
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum VendorCategory {
  LUMBER
  CONCRETE_SUPPLY
  ELECTRICAL_SUPPLY
  PLUMBING_SUPPLY
  HVAC_SUPPLY
  ROOFING_SUPPLY
  WINDOWS_DOORS
  APPLIANCES
  FIXTURES
  HARDWARE
  EQUIPMENT_RENTAL
  WASTE_DISPOSAL
  INSURANCE
  LEGAL
  ACCOUNTING
  MARKETING
  TITLE_ESCROW
  REAL_ESTATE_AGENT
  OTHER
}

enum VendorStatus {
  ACTIVE
  PREFERRED
  INACTIVE
}

// ============================================================================
// ACTIVITIES (Universal Activity Log)
// ============================================================================

model Activity {
  id              String   @id @default(cuid())
  
  // What entity is this activity for?
  entityType      EntityType
  entityId        String
  
  // Activity Details
  type            ActivityType
  subject         String
  description     String?
  
  // Scheduling (for tasks)
  dueDate         DateTime?
  completed       Boolean  @default(false)
  completedAt     DateTime?
  
  // Assignment
  createdById     String
  createdBy       User     @relation(fields: [createdById], references: [id])
  
  assignedToId    String?
  assignedTo      User?    @relation("AssignedTasks", fields: [assignedToId], references: [id])
  
  // Optional relationships (for querying)
  investorId      String?
  investor        Investor? @relation(fields: [investorId], references: [id])
  
  projectId       String?
  project         Project? @relation(fields: [projectId], references: [id])
  
  landLeadId      String?
  landLead        LandLead? @relation(fields: [landLeadId], references: [id])
  
  subcontractorId String?
  subcontractor   Subcontractor? @relation(fields: [subcontractorId], references: [id])
  
  buyerId         String?
  buyer           Buyer? @relation(fields: [buyerId], references: [id])
  
  vendorId        String?
  vendor          Vendor? @relation(fields: [vendorId], references: [id])
  
  // Meta
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum EntityType {
  INVESTOR
  PROJECT
  LAND_LEAD
  SUBCONTRACTOR
  BUYER
  VENDOR
}

enum ActivityType {
  NOTE            // General note
  CALL            // Phone call
  EMAIL           // Email sent/received
  MEETING         // In-person meeting
  TASK            // To-do item
  STATUS_CHANGE   // Pipeline movement
  DOCUMENT        // Document uploaded
  SITE_VISIT      // Site visit
}
```

---

## Project Structure

```
devops-crm/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── prisma/
│   ├── schema.prisma              # Database schema (above)
│   ├── seed.js                    # Seed data for dev
│   └── migrations/                # Auto-generated migrations
├── server/
│   ├── index.js                   # Express entry point
│   ├── config/
│   │   └── database.js            # Prisma client setup
│   ├── middleware/
│   │   ├── auth.js                # Session authentication
│   │   ├── errorHandler.js        # Global error handling
│   │   └── validate.js            # Request validation
│   ├── routes/
│   │   ├── index.js               # Route aggregator
│   │   ├── auth.routes.js
│   │   ├── investors.routes.js
│   │   ├── projects.routes.js
│   │   ├── landLeads.routes.js
│   │   ├── subcontractors.routes.js
│   │   ├── bids.routes.js
│   │   ├── buyers.routes.js
│   │   ├── vendors.routes.js
│   │   ├── activities.routes.js
│   │   └── dashboard.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── investors.controller.js
│   │   ├── projects.controller.js
│   │   ├── landLeads.controller.js
│   │   ├── subcontractors.controller.js
│   │   ├── bids.controller.js
│   │   ├── buyers.controller.js
│   │   ├── vendors.controller.js
│   │   ├── activities.controller.js
│   │   └── dashboard.controller.js
│   └── services/
│       ├── email.service.js       # Email notifications
│       └── upload.service.js      # File uploads
├── client/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── styles/
│   │   │       └── main.css
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppShell.vue
│   │   │   │   ├── Sidebar.vue
│   │   │   │   ├── TopNav.vue
│   │   │   │   └── MobileNav.vue
│   │   │   ├── ui/
│   │   │   │   ├── BaseButton.vue
│   │   │   │   ├── BaseInput.vue
│   │   │   │   ├── BaseSelect.vue
│   │   │   │   ├── BaseTextarea.vue
│   │   │   │   ├── BaseModal.vue
│   │   │   │   ├── BaseTable.vue
│   │   │   │   ├── BasePagination.vue
│   │   │   │   ├── BaseCard.vue
│   │   │   │   ├── BaseBadge.vue
│   │   │   │   ├── BaseDropdown.vue
│   │   │   │   ├── BaseToast.vue
│   │   │   │   ├── ConfirmDialog.vue
│   │   │   │   └── EmptyState.vue
│   │   │   ├── shared/
│   │   │   │   ├── ActivityFeed.vue
│   │   │   │   ├── ActivityForm.vue
│   │   │   │   ├── QuickAddActivity.vue
│   │   │   │   ├── StatusBadge.vue
│   │   │   │   ├── EntityLink.vue
│   │   │   │   ├── DateDisplay.vue
│   │   │   │   ├── CurrencyDisplay.vue
│   │   │   │   ├── PhoneLink.vue
│   │   │   │   ├── EmailLink.vue
│   │   │   │   ├── DocumentList.vue
│   │   │   │   └── SearchInput.vue
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCard.vue
│   │   │   │   ├── PipelineChart.vue
│   │   │   │   ├── RecentActivity.vue
│   │   │   │   ├── UpcomingTasks.vue
│   │   │   │   └── AlertsPanel.vue
│   │   │   ├── investors/
│   │   │   │   ├── InvestorList.vue
│   │   │   │   ├── InvestorCard.vue
│   │   │   │   ├── InvestorForm.vue
│   │   │   │   ├── InvestorDetail.vue
│   │   │   │   ├── InvestorPipeline.vue
│   │   │   │   └── InvestmentHistory.vue
│   │   │   ├── projects/
│   │   │   │   ├── ProjectList.vue
│   │   │   │   ├── ProjectCard.vue
│   │   │   │   ├── ProjectForm.vue
│   │   │   │   ├── ProjectDetail.vue
│   │   │   │   ├── ProjectFinancials.vue
│   │   │   │   └── ProjectTimeline.vue
│   │   │   ├── land-leads/
│   │   │   │   ├── LandLeadList.vue
│   │   │   │   ├── LandLeadCard.vue
│   │   │   │   ├── LandLeadForm.vue
│   │   │   │   ├── LandLeadDetail.vue
│   │   │   │   └── LandLeadMap.vue
│   │   │   ├── subcontractors/
│   │   │   │   ├── SubcontractorList.vue
│   │   │   │   ├── SubcontractorCard.vue
│   │   │   │   ├── SubcontractorForm.vue
│   │   │   │   ├── SubcontractorDetail.vue
│   │   │   │   ├── ExpirationAlerts.vue
│   │   │   │   └── TradeDirectory.vue
│   │   │   ├── bids/
│   │   │   │   ├── BidList.vue
│   │   │   │   ├── BidComparison.vue
│   │   │   │   ├── BidForm.vue
│   │   │   │   └── BidRequestForm.vue
│   │   │   ├── buyers/
│   │   │   │   ├── BuyerList.vue
│   │   │   │   ├── BuyerCard.vue
│   │   │   │   ├── BuyerForm.vue
│   │   │   │   ├── BuyerDetail.vue
│   │   │   │   └── ShowingScheduler.vue
│   │   │   └── vendors/
│   │   │       ├── VendorList.vue
│   │   │       ├── VendorCard.vue
│   │   │       ├── VendorForm.vue
│   │   │       └── VendorDetail.vue
│   │   ├── composables/
│   │   │   ├── useApi.js          # API fetch wrapper
│   │   │   ├── useAuth.js         # Auth state
│   │   │   ├── useToast.js        # Toast notifications
│   │   │   ├── useModal.js        # Modal state
│   │   │   ├── usePagination.js   # Pagination logic
│   │   │   ├── useFilters.js      # List filtering
│   │   │   └── useDebounce.js     # Debounced search
│   │   ├── stores/
│   │   │   ├── auth.store.js
│   │   │   ├── investors.store.js
│   │   │   ├── projects.store.js
│   │   │   ├── landLeads.store.js
│   │   │   ├── subcontractors.store.js
│   │   │   ├── bids.store.js
│   │   │   ├── buyers.store.js
│   │   │   ├── vendors.store.js
│   │   │   ├── activities.store.js
│   │   │   └── ui.store.js
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── InvestorsView.vue
│   │   │   ├── InvestorDetailView.vue
│   │   │   ├── ProjectsView.vue
│   │   │   ├── ProjectDetailView.vue
│   │   │   ├── LandLeadsView.vue
│   │   │   ├── LandLeadDetailView.vue
│   │   │   ├── SubcontractorsView.vue
│   │   │   ├── SubcontractorDetailView.vue
│   │   │   ├── BuyersView.vue
│   │   │   ├── BuyerDetailView.vue
│   │   │   ├── VendorsView.vue
│   │   │   ├── VendorDetailView.vue
│   │   │   ├── SettingsView.vue
│   │   │   └── NotFoundView.vue
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   ├── formatters.js      # Currency, date, phone
│   │   │   ├── validators.js      # Zod schemas
│   │   │   └── constants.js       # Status labels, colors
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── docker-compose.yml             # Optional: Local Postgres
```

---

## UI Design System

### Color Palette (Extends Investor Portal)

```javascript
// tailwind.config.js
colors: {
  // Same forest/sand/terracotta from Investor Portal
  forest: { /* ... */ },
  sand: { /* ... */ },
  terracotta: { /* ... */ },
  charcoal: { /* ... */ },
  
  // Additional status colors for CRM
  status: {
    lead: '#3B82F6',        // Blue
    active: '#10B981',      // Green
    warning: '#F59E0B',     // Amber
    danger: '#EF4444',      // Red
    neutral: '#6B7280',     // Gray
    info: '#6366F1',        // Indigo
  }
}
```

### Status Color Mapping

```javascript
// src/utils/constants.js

export const INVESTOR_STATUS_COLORS = {
  LEAD: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-blue-100 text-blue-800',
  MEETING_SCHEDULED: 'bg-indigo-100 text-indigo-800',
  REVIEWING_DOCS: 'bg-indigo-100 text-indigo-800',
  NEGOTIATING: 'bg-amber-100 text-amber-800',
  COMMITTED: 'bg-green-100 text-green-800',
  FUNDED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-gray-100 text-gray-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
}

export const PROJECT_STATUS_COLORS = {
  PLANNING: 'bg-gray-100 text-gray-800',
  FUNDED: 'bg-blue-100 text-blue-800',
  LAND_SEARCH: 'bg-blue-100 text-blue-800',
  LAND_ACQUIRED: 'bg-indigo-100 text-indigo-800',
  PERMITTING: 'bg-indigo-100 text-indigo-800',
  CONSTRUCTION: 'bg-amber-100 text-amber-800',
  COMPLETED: 'bg-green-100 text-green-800',
  LISTED: 'bg-green-100 text-green-800',
  UNDER_CONTRACT: 'bg-green-100 text-green-800',
  SOLD: 'bg-forest-100 text-forest-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export const SUBCONTRACTOR_STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  PREFERRED: 'bg-forest-100 text-forest-800',
  PROBATION: 'bg-amber-100 text-amber-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  BLACKLISTED: 'bg-red-100 text-red-800',
}

export const TRADE_LABELS = {
  GENERAL: 'General Contractor',
  CONCRETE: 'Concrete & Foundation',
  FRAMING: 'Framing',
  ELECTRICAL: 'Electrical',
  PLUMBING: 'Plumbing',
  HVAC: 'HVAC',
  INSULATION: 'Insulation',
  ROOFING: 'Roofing',
  SIDING: 'Siding & Exterior',
  DRYWALL: 'Drywall',
  PAINTING: 'Painting',
  FLOORING: 'Flooring',
  TILE: 'Tile',
  CABINETS: 'Cabinets',
  COUNTERTOPS: 'Countertops',
  LANDSCAPING: 'Landscaping',
  EXCAVATION: 'Excavation',
  GRADING: 'Grading',
  SURVEYING: 'Surveying',
  ENGINEERING: 'Engineering',
  ARCHITECTURE: 'Architecture',
  OTHER: 'Other',
}
```

---

## Key Views & Functionality

### Dashboard (`DashboardView.vue`)

**Purpose:** At-a-glance operational overview

**Sections:**
1. **KPI Cards Row:**
   - Total Investor Pipeline Value
   - Active Projects
   - Pending Bids
   - Expiring Licenses (next 30 days)

2. **Pipeline Charts:**
   - Investor Pipeline (horizontal bar by status)
   - Project Status Distribution (pie/donut)

3. **Alerts Panel:**
   - COI/License expirations within 30 days
   - Tasks due today
   - Investors awaiting follow-up (>7 days since last contact)

4. **Recent Activity Feed:**
   - Last 10 activities across all entities
   - Filterable by entity type

5. **Upcoming Tasks:**
   - Tasks due in next 7 days
   - Quick complete action

```vue
<template>
  <div class="p-6 space-y-6">
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Investor Pipeline"
        :value="formatCurrency(stats.investorPipelineValue)"
        :change="+12"
        changeLabel="vs last month"
        icon="CurrencyDollarIcon"
      />
      <StatCard
        title="Active Projects"
        :value="stats.activeProjects"
        subtitle="2 in construction"
        icon="HomeIcon"
      />
      <StatCard
        title="Pending Bids"
        :value="stats.pendingBids"
        :alert="stats.pendingBids > 5"
        alertLabel="Review needed"
        icon="DocumentTextIcon"
      />
      <StatCard
        title="Expiring Soon"
        :value="stats.expiringLicenses"
        :alert="stats.expiringLicenses > 0"
        alertLabel="Licenses/COIs"
        icon="ExclamationTriangleIcon"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content (2/3) -->
      <div class="lg:col-span-2 space-y-6">
        <PipelineChart :data="investorPipeline" title="Investor Pipeline" />
        <RecentActivity :activities="recentActivities" />
      </div>

      <!-- Sidebar (1/3) -->
      <div class="space-y-6">
        <AlertsPanel :alerts="alerts" />
        <UpcomingTasks :tasks="upcomingTasks" @complete="markComplete" />
      </div>
    </div>
  </div>
</template>
```

---

### Investor Pipeline (`InvestorsView.vue`)

**Purpose:** Manage investor relationships and track commitments

**Features:**
- Kanban view (drag-drop between statuses) OR Table view (toggle)
- Quick filters: Status, Accredited, Investment Range
- Search by name/email/company
- Bulk actions: Send email, Change status
- Quick add investor button

**Table Columns:**
| Column | Type | Sortable |
|--------|------|----------|
| Name | Text + link to detail | Yes |
| Company | Text | Yes |
| Status | Badge | Yes |
| Accredited | Badge (Yes/No/Unknown) | Yes |
| Capacity | Currency range | Yes |
| Committed | Currency | Yes |
| Last Contact | Relative date | Yes |
| Actions | Dropdown | No |

---

### Subcontractor Directory (`SubcontractorsView.vue`)

**Purpose:** Maintain sub database with license/insurance tracking

**Key Features:**
1. **Filter by Trade** — Show only electricians, plumbers, etc.
2. **Expiration Alerts** — Highlight subs with expiring licenses/COIs
3. **Star Rating** — Visual quality indicator
4. **Quick COI Upload** — Drag-drop to update insurance docs

**Alert Logic:**
```javascript
// Expiration warning thresholds
const EXPIRING_SOON = 30  // days - yellow warning
const EXPIRED = 0         // days - red alert

function getExpirationStatus(date) {
  if (!date) return 'MISSING'
  const daysUntil = differenceInDays(new Date(date), new Date())
  if (daysUntil < EXPIRED) return 'EXPIRED'
  if (daysUntil < EXPIRING_SOON) return 'EXPIRING_SOON'
  return 'VALID'
}
```

---

### Bid Comparison (`BidComparison.vue`)

**Purpose:** Side-by-side comparison of bids for a scope of work

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  BID COMPARISON — Framing (Project: Springfield Home #1)        │
├─────────────────────────────────────────────────────────────────┤
│                  │ ABC Framing    │ XYZ Builders  │ Quick Frame │
├──────────────────┼────────────────┼───────────────┼─────────────┤
│ Total Amount     │ $22,000        │ $24,500       │ $21,200 ✓   │
│ Timeline         │ 3 weeks        │ 2.5 weeks ✓   │ 4 weeks     │
│ Hourly Rate      │ $18/hr         │ $22/hr        │ $16/hr      │
│ Rating           │ ★★★★☆ (4.2)   │ ★★★★★ (4.8)  │ ★★★☆☆ (3.1) │
│ License Status   │ ✓ Valid        │ ✓ Valid       │ ⚠ Exp 30d   │
│ Insurance Status │ ✓ Valid        │ ✓ Valid       │ ✓ Valid     │
│ Previous Jobs    │ 3 with us      │ 0 (new)       │ 5 with us   │
├──────────────────┼────────────────┼───────────────┼─────────────┤
│ Actions          │ [Award] [Pass] │ [Award] [Pass]│ [Award][Pass│
└─────────────────────────────────────────────────────────────────┘
```

---

### Land Lead Detail (`LandLeadDetailView.vue`)

**Purpose:** Research and track potential land acquisitions

**Sections:**
1. **Property Info** — Address, parcel ID, acreage, zoning
2. **Owner Info** — Contact details, mailing address
3. **Deal Analysis** — Asking vs. estimated value, price/acre
4. **Status Pipeline** — Visual progress indicator
5. **Activity Log** — All communications and notes
6. **Documents** — Title reports, survey, photos
7. **Map Embed** — Google Maps or Mapbox showing location

**Integrations (Future):**
- Pull county assessor data via API
- Zillow/Redfin comps
- Google Street View embed

---

## API Routes

### RESTful Endpoints

```
Authentication:
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Investors:
GET    /api/investors                 # List (with filters, pagination)
POST   /api/investors                 # Create
GET    /api/investors/:id             # Get one
PUT    /api/investors/:id             # Update
DELETE /api/investors/:id             # Delete
GET    /api/investors/:id/activities  # Activity log
POST   /api/investors/:id/activities  # Add activity
GET    /api/investors/:id/investments # Investment history

Projects:
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/:id/bids
GET    /api/projects/:id/investors
GET    /api/projects/:id/activities

Land Leads:
GET    /api/land-leads
POST   /api/land-leads
GET    /api/land-leads/:id
PUT    /api/land-leads/:id
DELETE /api/land-leads/:id
GET    /api/land-leads/:id/activities

Subcontractors:
GET    /api/subcontractors
POST   /api/subcontractors
GET    /api/subcontractors/:id
PUT    /api/subcontractors/:id
DELETE /api/subcontractors/:id
GET    /api/subcontractors/:id/bids
GET    /api/subcontractors/expiring   # License/COI expiring soon

Bids:
GET    /api/bids
POST   /api/bids
GET    /api/bids/:id
PUT    /api/bids/:id
PUT    /api/bids/:id/status           # Award, reject, etc.
GET    /api/bids/compare?ids=1,2,3    # Comparison data

Buyers:
GET    /api/buyers
POST   /api/buyers
GET    /api/buyers/:id
PUT    /api/buyers/:id
DELETE /api/buyers/:id
GET    /api/buyers/:id/showings

Showings:
GET    /api/showings
POST   /api/showings
PUT    /api/showings/:id
DELETE /api/showings/:id

Vendors:
GET    /api/vendors
POST   /api/vendors
GET    /api/vendors/:id
PUT    /api/vendors/:id
DELETE /api/vendors/:id

Activities:
GET    /api/activities                # Global feed
POST   /api/activities
PUT    /api/activities/:id
DELETE /api/activities/:id
PUT    /api/activities/:id/complete   # Mark task complete

Dashboard:
GET    /api/dashboard/stats           # KPI numbers
GET    /api/dashboard/pipeline        # Pipeline chart data
GET    /api/dashboard/alerts          # Expiration alerts
GET    /api/dashboard/recent          # Recent activity

Uploads:
POST   /api/uploads                   # File upload
DELETE /api/uploads/:id
```

---

## Netlify Form Integration (Investor Portal → CRM)

The Investor Portal contact form submissions should flow into this CRM automatically.

**Option 1: Netlify Functions Webhook**

```javascript
// netlify/functions/investor-submission.js
// Triggered by Netlify Form submission

const { PrismaClient } = require('@prisma/client')

exports.handler = async (event) => {
  const prisma = new PrismaClient()
  
  const { payload } = JSON.parse(event.body)
  const { firstName, lastName, email, phone, investmentRange, message, accredited } = payload.data
  
  try {
    // Create investor in CRM
    const investor = await prisma.investor.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        investmentCapacity: investmentRange,
        accreditedStatus: accredited ? 'SELF_REPORTED' : 'UNKNOWN',
        status: 'LEAD',
        source: 'Website Form',
        notes: message,
      }
    })
    
    // Create initial activity
    await prisma.activity.create({
      data: {
        entityType: 'INVESTOR',
        entityId: investor.id,
        investorId: investor.id,
        type: 'NOTE',
        subject: 'New inquiry from website',
        description: message,
        createdById: 'system', // Or a default user ID
      }
    })
    
    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (error) {
    console.error(error)
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create investor' }) }
  }
}
```

**Option 2: Zapier/Make Integration**

If you want a no-code connection:
1. Netlify Form → Zapier trigger
2. Zapier → HTTP POST to CRM API
3. CRM creates investor record

---

## Mobile Responsiveness

The CRM should be fully functional on tablets (field use) and usable on phones (quick lookups).

**Responsive Patterns:**

| Breakpoint | Layout |
|------------|--------|
| Desktop (lg+) | Sidebar visible, full tables, multi-column forms |
| Tablet (md) | Collapsible sidebar, responsive tables, 2-column forms |
| Mobile (sm) | Bottom nav, card lists instead of tables, stacked forms |

**Key Mobile Components:**
- `MobileNav.vue` — Bottom navigation bar
- `MobileListItem.vue` — Card-based list items
- `MobileDetailHeader.vue` — Sticky header with back button
- `SwipeActions.vue` — Swipe to call, email, or quick-add note

---

## Deployment Configuration

### Environment Variables

```env
# .env.example

# Database
DATABASE_URL="file:./dev.db"  # SQLite for dev
# DATABASE_URL="postgresql://user:pass@host:5432/dbname"  # Postgres for prod

# Auth
SESSION_SECRET="your-secret-key-here"
COOKIE_DOMAIN="localhost"

# File Storage (optional)
S3_BUCKET=""
S3_REGION=""
S3_ACCESS_KEY=""
S3_SECRET_KEY=""

# Email (optional)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM=""

# App
NODE_ENV="development"
PORT=3000
CLIENT_URL="http://localhost:5173"
```

### Docker Compose (Local Dev with Postgres)

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: devops
      POSTGRES_PASSWORD: devops
      POSTGRES_DB: devops_crm
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Build Phases

### Phase 1: Core MVP (20-30 hours)
**Goal:** Functional investor and subcontractor tracking

- [ ] Project setup (Vue + Vite + Tailwind + Express + Prisma)
- [ ] Database schema + migrations
- [ ] Basic auth (login/logout, session)
- [ ] Investor CRUD + list view + detail view
- [ ] Subcontractor CRUD + list view + detail view
- [ ] Activity log (add notes to any entity)
- [ ] Dashboard with basic stats
- [ ] Netlify Form webhook integration

**Deliverable:** Working CRM that can track investors and subs

---

### Phase 2: Full Entity Support (15-20 hours)
**Goal:** All entity types functional

- [ ] Projects CRUD + detail view
- [ ] Land Leads CRUD + detail view
- [ ] Buyers CRUD + detail view
- [ ] Vendors CRUD + detail view
- [ ] Showings CRUD
- [ ] Bids CRUD + comparison view
- [ ] Investments tracking
- [ ] Distributions tracking

**Deliverable:** Complete relational CRM

---

### Phase 3: Polish & Productivity (10-15 hours)
**Goal:** Make it delightful to use

- [ ] Kanban view for investor pipeline
- [ ] Expiration alerts dashboard
- [ ] Email integration (send/log emails)
- [ ] File uploads (COIs, documents)
- [ ] Mobile-responsive refinements
- [ ] Search across all entities
- [ ] Export to CSV
- [ ] Print-friendly views

**Deliverable:** Production-ready CRM

---

### Phase 4: Advanced Features (Future)
**Goal:** Power user features

- [ ] Automated reminders (email before COI expires)
- [ ] Investor portal (self-service view)
- [ ] Project cost tracking integration
- [ ] QuickBooks sync
- [ ] SMS integration
- [ ] API for external integrations
- [ ] Multi-user with permissions
- [ ] Audit log

---

## Competitive Advantage vs. HubSpot/Generic CRMs

| Feature | HubSpot Free | This CRM |
|---------|--------------|----------|
| Investor Pipeline | Generic "Deals" | Purpose-built stages |
| Accreditation Tracking | Custom field hack | Native field |
| Investment Tracking | Not supported | Full distribution history |
| Subcontractor Database | Not designed for this | Trade-specific with COI/license |
| License Expiration Alerts | Not supported | Built-in dashboard |
| Bid Comparison | Not supported | Side-by-side comparison |
| Land Lead Tracking | Custom object hack | Native with zoning, acreage |
| Buyer + Showing Management | Generic contacts | Purpose-built pipeline |
| Construction-specific Fields | All custom | Native throughout |
| Cost | Free (limited) → $45+/mo | Self-hosted or ~$10/mo |

---

## SaaS Potential (Future Revenue Stream)

This CRM could be productized for other small developers:

**Target Market:**
- Small residential developers (1-10 employees)
- Custom home builders transitioning to spec builds
- Investor groups doing fix-and-flip at scale

**Pricing Model:**
- Free: 1 user, 2 projects, basic features
- Starter ($29/mo): 3 users, 10 projects, full features
- Pro ($79/mo): Unlimited users, unlimited projects, API access
- Enterprise: Custom pricing, white-label, dedicated support

**Differentiation:**
- Built BY developers FOR developers (not generic CRM adapted)
- Sub/license tracking that actually works
- Bid management built-in
- Investor relations purpose-built

---

## Agent Instructions Summary

**When building this CRM, follow this order:**

### Backend First
1. Initialize Node + Express project
2. Set up Prisma with schema above
3. Run migrations: `npx prisma migrate dev`
4. Seed sample data: `npx prisma db seed`
5. Build auth routes (login, logout, me)
6. Build CRUD routes for each entity
7. Build dashboard stats endpoint
8. Test all endpoints with Postman/Insomnia

### Frontend Second
1. Initialize Vue project: `npm create vite@latest client -- --template vue`
2. Install dependencies: Tailwind, Pinia, Vue Router, Headless UI
3. Build layout components: AppShell, Sidebar, TopNav
4. Build UI components: BaseButton, BaseInput, BaseTable, etc.
5. Build views in this order:
   - LoginView
   - DashboardView
   - InvestorsView + InvestorDetailView
   - SubcontractorsView + SubcontractorDetailView
   - (remaining entities)
6. Connect to API with composables
7. Add toast notifications, loading states, error handling

### Integration
1. Set up Netlify Form webhook
2. Test end-to-end: Form → CRM
3. Deploy backend to Railway/Render
4. Deploy frontend to Netlify (separate site) or same as backend

**Critical Requirements:**
- Use Prisma for all database operations (no raw SQL)
- Use Pinia for state management
- Every list view must have: search, filter, sort, pagination
- Every detail view must have: activity feed, quick-add activity
- All forms must have validation (VeeValidate + Zod)
- Mobile-responsive from day one

---

*Blueprint Version: 1.0 | Created: February 2026 | For: Brandtworks-Enterprises LLC*
