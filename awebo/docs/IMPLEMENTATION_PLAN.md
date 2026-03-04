# Merch & NFT Process - Implementation Plan

## Executive Summary

This document outlines the technical architecture, data models, development scope, and design guidelines for the Merch & NFT creation process on Awebo.wtf. The system enables users to create merchandise items, mint NFTs, launch tokens, explore collections, and build community around projects on the L1X blockchain.

**Design Compliance**: All implementations must follow the [Web Interface Guidelines](#web-interface-guidelines) and [Color Design System](./COLOR_SYSTEM.md).

---

## System Overview

The merch process consists of four main pages:
1. **Merch Creation** (`/merch/create`) - Create physical/digital merchandise and NFTs
2. **Launchpad Token Creation** (`/launchpad/create`) - Create and launch tokens for projects
3. **Explore** (`/explore`) - Browse and discover merch, NFTs, and tokens
4. **Community** (`/community`) - Community features, discussions, and project pages

---

## 1. Merch Creation Page (`/merch/create`)

### Purpose
Allow users to create merchandise items (physical and digital) and mint associated NFTs on the L1X blockchain.

### Features

#### 1.1 Merch Item Creation Form
- **Product Information**
  - Product name (required, max 100 chars)
  - Description (required, max 2000 chars, markdown support)
  - Category selection (Apparel, Accessories, Collectibles, Digital, Physical)
  - Tags (multi-select, max 10 tags)
  - SKU/Product code (optional, auto-generated if not provided)

- **Pricing & Inventory**
  - Base price in WL1X (required, min 0.01)
  - Currency selector (WL1X, L1X, USD equivalent)
  - Stock quantity (for physical items, -1 for unlimited)
  - Pre-order availability toggle
  - Limited edition toggle with edition count

- **Media Upload**
  - Primary image (required, max 10MB, formats: JPG, PNG, WebP)
  - Additional images (up to 5, gallery view)
  - Video upload (optional, max 50MB, formats: MP4, WebM)
  - 3D model preview (optional, GLB/GLTF format)

- **NFT Configuration**
  - Mint NFT toggle (enable/disable NFT minting)
  - NFT collection selection (create new or select existing)
  - NFT metadata template selection
  - Royalty percentage (0-10%, default 5%)
  - NFT supply (1 for unique, or edition count)

- **Blockchain Settings**
  - Network: L1X (locked)
  - Gas estimation display
  - Transaction fee preview
  - Wallet connection requirement

#### 1.2 NFT Minting Workflow
1. User fills merch creation form
2. Upload and validate media files
3. Generate NFT metadata JSON (IPFS-ready)
4. Upload media to IPFS (via Pinata or similar)
5. Create NFT smart contract interaction
6. Mint NFT on L1X chain
7. Store merch item in database with NFT contract address
8. Display success confirmation with transaction hash

#### 1.3 Preview & Validation
- Real-time form validation
- Image preview with drag-and-drop
- Price calculator (shows fees, royalties)
- NFT metadata preview
- Gas estimation display
- Form state persistence (localStorage)

### Technical Implementation

#### Data Model
```typescript
interface MerchItem {
  id: string; // UUID
  creatorId: string; // User wallet address
  name: string;
  description: string;
  category: 'apparel' | 'accessories' | 'collectibles' | 'digital' | 'physical';
  tags: string[];
  sku: string;
  
  // Pricing
  basePrice: string; // BigNumber string
  currency: 'WL1X' | 'L1X' | 'USD';
  priceInUSD?: number;
  
  // Inventory
  stockQuantity: number; // -1 for unlimited
  isPreOrder: boolean;
  isLimitedEdition: boolean;
  editionCount?: number;
  
  // Media
  primaryImageUrl: string; // IPFS hash
  imageUrls: string[];
  videoUrl?: string;
  model3dUrl?: string;
  
  // NFT
  hasNFT: boolean;
  nftContractAddress?: string;
  nftTokenId?: string;
  nftCollectionId?: string;
  royaltyPercentage: number;
  nftSupply: number;
  
  // Blockchain
  network: 'L1X';
  transactionHash?: string;
  blockNumber?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'sold_out' | 'archived';
  views: number;
  sales: number;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URL
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties?: {
    files: Array<{
      uri: string;
      type: string;
    }>;
  };
}
```

#### API Endpoints
```
POST /api/merch/create
  - Create new merch item
  - Upload media files
  - Generate NFT metadata
  - Returns: { merchItemId, nftContractAddress, transactionHash }

GET /api/merch/:id
  - Get merch item details

PUT /api/merch/:id
  - Update merch item (only if not published)

POST /api/merch/:id/mint-nft
  - Mint NFT for existing merch item

POST /api/ipfs/upload
  - Upload file to IPFS
  - Returns: IPFS hash
```

#### Smart Contract Integration
- ERC-721 NFT contract (L1X compatible)
- Royalty standard implementation
- Batch minting support for editions
- Metadata URI storage

---

## 2. Launchpad Token Creation Page (`/launchpad/create`)

### Purpose
Enable project creators to launch tokens on L1X chain, similar to existing `/launch` but enhanced for merch/project integration.

### Features

#### 2.1 Token Creation Form
- **Token Details** (existing functionality)
  - Token name (required, immutable after creation)
  - Ticker/Symbol (required, 3-10 chars, immutable)
  - Description (optional, max 1000 chars)
  - Logo upload (required, 512x512px recommended)
  - Website URL (optional)
  - Social links (Twitter, Discord, Telegram)

- **Launch Settings** (existing functionality)
  - Initial buy amount (WL1X)
  - Weeks lock (0-18)
  - Max transaction % (0.1-100)
  - Max wallet % (0.1-100)

- **Merch Integration** (NEW)
  - Link to merch collection toggle
  - Select associated merch items
  - NFT collection association
  - Community page auto-creation

- **Tokenomics**
  - Total supply (auto-calculated or manual)
  - Initial liquidity pool settings
  - Vesting schedule (optional)
  - Allocation breakdown (team, community, reserves)

#### 2.2 Launch Process
1. Connect wallet
2. Fill token creation form
3. Preview token details
4. Approve gas fees
5. Create token contract
6. Approve token for trading
7. Approve WL1X for liquidity
8. Open trading
9. Create associated community page
10. Link merch collection (if selected)

### Technical Implementation

#### Data Model
```typescript
interface LaunchpadToken {
  id: string;
  creatorId: string;
  tokenAddress: string; // Contract address
  
  // Token Info
  name: string;
  ticker: string;
  description?: string;
  logoUrl: string;
  websiteUrl?: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  
  // Launch Settings
  initialBuy: string; // WL1X amount
  weeksLock: number;
  maxTxPercent: number;
  maxWalletPercent: number;
  
  // Tokenomics
  totalSupply: string;
  initialLiquidity: string;
  vestingSchedule?: VestingSchedule;
  
  // Integration
  merchCollectionId?: string;
  nftCollectionId?: string;
  communityPageId?: string;
  
  // Blockchain
  network: 'L1X';
  transactionHash: string;
  blockNumber: number;
  createdAt: Date;
  status: 'pending' | 'active' | 'locked' | 'completed';
}

interface VestingSchedule {
  totalAmount: string;
  releaseSchedule: Array<{
    releaseDate: Date;
    amount: string;
    percentage: number;
  }>;
}
```

#### API Endpoints
```
POST /api/launchpad/create
  - Create token and launch
  - Returns: { tokenAddress, transactionHash, communityPageId }

GET /api/launchpad/tokens
  - List all launched tokens
  - Query params: creator, status, sort

GET /api/launchpad/:address
  - Get token details by contract address

POST /api/launchpad/:address/link-merch
  - Link merch collection to token
```

---

## 3. Explore Page (`/explore`)

### Purpose
Browse and discover merch items, NFTs, tokens, and projects with advanced filtering and search.

### Features

#### 3.1 Navigation & Filters
- **Search Bar**
  - Full-text search (name, description, tags)
  - Autocomplete suggestions
  - Search history

- **Category Filters**
  - All items
  - Merch only
  - NFTs only
  - Tokens only
  - Projects (token + merch)

- **Advanced Filters**
  - Price range (WL1X)
  - Creator/Artist
  - Collection
  - Date range (newest, oldest)
  - Availability (in stock, sold out, pre-order)
  - Sort options (price, popularity, newest, trending)

#### 3.2 Display Views
- **Grid View** (default)
  - Card layout with image, name, price, creator
  - Hover effects with quick preview
  - Favorite/bookmark button
  - Share button

- **List View**
  - Compact horizontal cards
  - More information visible
  - Better for comparison

- **Collection View**
  - Grouped by collection
  - Show collection stats

#### 3.3 Item Cards
Each card displays:
- Thumbnail image/video
- Item name
- Creator name/address
- Price (with currency conversion)
- Availability status
- Favorite count
- Quick action buttons (View, Buy, Add to Cart)

#### 3.4 Trending & Featured
- Trending section (based on views, sales, time)
- Featured collections
- New releases
- Top creators

### Technical Implementation

#### Data Model
```typescript
interface ExploreFilters {
  query?: string;
  category?: 'all' | 'merch' | 'nft' | 'token' | 'project';
  priceMin?: string;
  priceMax?: string;
  creatorId?: string;
  collectionId?: string;
  sortBy?: 'price' | 'popularity' | 'newest' | 'trending';
  availability?: 'all' | 'in_stock' | 'sold_out' | 'pre_order';
  page: number;
  limit: number;
}

interface ExploreResult {
  items: Array<MerchItem | LaunchpadToken>;
  total: number;
  page: number;
  totalPages: number;
}
```

#### API Endpoints
```
GET /api/explore
  - Search and filter items
  - Query params: All filter options
  - Returns: Paginated results

GET /api/explore/trending
  - Get trending items
  - Returns: Array of items

GET /api/explore/featured
  - Get featured collections
  - Returns: Array of collections

GET /api/explore/search-suggestions
  - Autocomplete search
  - Query param: q
  - Returns: Array of suggestions
```

#### Search Implementation
- Full-text search using PostgreSQL or Elasticsearch
- Index fields: name, description, tags, creator
- Ranking algorithm: relevance + popularity + recency

---

## 4. Community Page (`/community`)

### Purpose
Build and engage with communities around projects, tokens, and collections.

### Features

#### 4.1 Project/Collection Overview
- **Header Section**
  - Project banner image
  - Logo/avatar
  - Project name and description
  - Creator information
  - Social links
  - Follow/Unfollow button
  - Share button

- **Stats Dashboard**
  - Total members
  - Token holders
  - Merch items sold
  - Total volume
  - Floor price (for NFTs)
  - Market cap (for tokens)

#### 4.2 Navigation Tabs
- **Overview** (default)
  - Project summary
  - Recent activity feed
  - Featured content

- **Merch & NFTs**
  - Grid of all merch items
  - NFT collection display
  - Filter by category, price, availability

- **Token Info**
  - Token details
  - Price chart
  - Trading volume
  - Holder distribution
  - Tokenomics breakdown

- **Discussion**
  - Forum/chat interface
  - Threads and replies
  - Upvote/downvote
  - Pinned posts
  - Categories (General, Trading, Support, etc.)

- **Members**
  - List of community members
  - Top contributors
  - Creator spotlight
  - Member roles (creator, moderator, member)

#### 4.3 Discussion Features
- Create new thread
- Reply to threads
- Edit/delete own posts
- Report inappropriate content
- Rich text editor (markdown support)
- Image upload in posts
- Emoji reactions
- @mentions and notifications

#### 4.4 Activity Feed
- Real-time updates
- Token transactions
- New merch releases
- New members
- Discussion activity
- Filter by activity type

### Technical Implementation

#### Data Model
```typescript
interface Community {
  id: string;
  name: string;
  description: string;
  bannerImageUrl?: string;
  logoUrl?: string;
  creatorId: string;
  
  // Associations
  tokenAddress?: string;
  merchCollectionId?: string;
  nftCollectionId?: string;
  
  // Stats
  memberCount: number;
  tokenHolderCount: number;
  totalVolume: string;
  floorPrice?: string;
  
  // Settings
  isPublic: boolean;
  allowMemberPosts: boolean;
  moderationEnabled: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

interface DiscussionThread {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  content: string; // Markdown
  category: string;
  
  // Engagement
  upvotes: number;
  downvotes: number;
  replyCount: number;
  views: number;
  
  // Moderation
  isPinned: boolean;
  isLocked: boolean;
  isDeleted: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

interface DiscussionReply {
  id: string;
  threadId: string;
  authorId: string;
  content: string; // Markdown
  parentReplyId?: string; // For nested replies
  
  upvotes: number;
  downvotes: number;
  isDeleted: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

interface Activity {
  id: string;
  communityId: string;
  type: 'token_transaction' | 'merch_release' | 'new_member' | 'discussion_post' | 'nft_mint';
  actorId: string;
  targetId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}
```

#### API Endpoints
```
GET /api/community/:id
  - Get community details

GET /api/community/:id/overview
  - Get overview with stats and recent activity

GET /api/community/:id/merch
  - Get merch items for community

GET /api/community/:id/token
  - Get token info for community

GET /api/community/:id/discussions
  - Get discussion threads
  - Query params: category, sort, page

POST /api/community/:id/discussions
  - Create new thread

GET /api/community/:id/discussions/:threadId
  - Get thread with replies

POST /api/community/:id/discussions/:threadId/replies
  - Reply to thread

GET /api/community/:id/activity
  - Get activity feed
  - Query params: type, limit, offset

POST /api/community/:id/follow
  - Follow/unfollow community

GET /api/community/:id/members
  - Get community members
```

---

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Zustand (for complex state)
- **Form Handling**: React Hook Form + Zod validation
- **File Upload**: React Dropzone
- **Image Processing**: Sharp (server-side) or browser-image-compression
- **Web3 Integration**: ethers.js or viem for L1X chain
- **IPFS**: ipfs-http-client or Pinata SDK

### Backend Stack
- **API**: Next.js API Routes or separate Express/Fastify server
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: IPFS (Pinata, Infura, or self-hosted)
- **Search**: PostgreSQL full-text search or Elasticsearch
- **Caching**: Redis (for trending, featured items)
- **Real-time**: WebSockets (Socket.io) for activity feeds

### Blockchain Integration
- **Network**: L1X Chain
- **Smart Contracts**:
  - ERC-721 NFT contract
  - Token launchpad contract
  - Royalty distribution contract
- **Wallet Integration**: MetaMask, WalletConnect, or L1X native wallet
- **Transaction Management**: Transaction queue with retry logic

### Infrastructure
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **CDN**: Cloudflare or Vercel Edge Network
- **Monitoring**: Sentry for error tracking
- **Analytics**: Custom analytics or PostHog

---

## Web Interface Guidelines

**All implementations MUST comply with these guidelines.** Review code against these rules during development and before deployment.

### Accessibility

- ✅ Icon-only buttons need `aria-label`
- ✅ Form controls need `<label>` or `aria-label`
- ✅ Interactive elements need keyboard handlers (`onKeyDown`/`onKeyUp`)
- ✅ `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div>`)
- ✅ Images need `alt` (or `alt=""` if decorative)
- ✅ Decorative icons need `aria-hidden="true"`
- ✅ Async updates (toasts, validation) need `aria-live="polite"`
- ✅ Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`) before ARIA
- ✅ Headings hierarchical `<h1>`–`<h6>`; include skip link for main content
- ✅ `scroll-margin-top` on heading anchors

### Focus States

- ✅ Interactive elements need visible focus: `focus-visible:ring-*` or equivalent
- ❌ Never `outline-none` / `outline: none` without focus replacement
- ✅ Use `:focus-visible` over `:focus` (avoid focus ring on click)
- ✅ Group focus with `:focus-within` for compound controls

### Forms

- ✅ Inputs need `autocomplete` and meaningful `name`
- ✅ Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`
- ❌ Never block paste (`onPaste` + `preventDefault`)
- ✅ Labels clickable (`htmlFor` or wrapping control)
- ✅ Disable spellcheck on emails, codes, usernames (`spellCheck={false}`)
- ✅ Checkboxes/radios: label + control share single hit target (no dead zones)
- ✅ Submit button stays enabled until request starts; spinner during request
- ✅ Errors inline next to fields; focus first error on submit
- ✅ Placeholders end with `…` and show example pattern
- ✅ `autocomplete="off"` on non-auth fields to avoid password manager triggers
- ✅ Warn before navigation with unsaved changes (`beforeunload` or router guard)

### Animation

- ✅ Honor `prefers-reduced-motion` (provide reduced variant or disable)
- ✅ Animate `transform`/`opacity` only (compositor-friendly)
- ❌ Never `transition: all`—list properties explicitly
- ✅ Set correct `transform-origin`
- ✅ SVG: transforms on `<g>` wrapper with `transform-box: fill-box; transform-origin: center`
- ✅ Animations interruptible—respond to user input mid-animation

### Typography

- ✅ `…` not `...`
- ✅ Curly quotes `"` `"` not straight `"`
- ✅ Non-breaking spaces: `10&nbsp;MB`, `⌘&nbsp;K`, brand names
- ✅ Loading states end with `…`: `"Loading…"`, `"Saving…"`
- ✅ `font-variant-numeric: tabular-nums` for number columns/comparisons
- ✅ Use `text-wrap: balance` or `text-pretty` on headings (prevents widows)

### Content Handling

- ✅ Text containers handle long content: `truncate`, `line-clamp-*`, or `break-words`
- ✅ Flex children need `min-w-0` to allow text truncation
- ✅ Handle empty states—don't render broken UI for empty strings/arrays
- ✅ User-generated content: anticipate short, average, and very long inputs

### Images

- ✅ `<Image>` needs explicit `width` and `height` (prevents CLS)
- ✅ Below-fold images: `loading="lazy"`
- ✅ Above-fold critical images: `priority` or `fetchpriority="high"`

### Performance

- ✅ Large lists (>50 items): virtualize (`virtua`, `content-visibility: auto`)
- ❌ No layout reads in render (`getBoundingClientRect`, `offsetHeight`, `offsetWidth`, `scrollTop`)
- ✅ Batch DOM reads/writes; avoid interleaving
- ✅ Prefer uncontrolled inputs; controlled inputs must be cheap per keystroke
- ✅ Add `<link rel="dns-prefetch">` for CDN/asset domains
- ✅ Critical fonts: `<link rel="preload">` with `font-display: swap`

### Navigation & State

- ✅ URL reflects state—filters, tabs, pagination, expanded panels in query params
- ✅ Links use `<a>`/`<Link>` (Cmd/Ctrl+click, middle-click support)
- ✅ Deep-link all stateful UI (if uses `useState`, consider URL sync via nuqs or similar)
- ✅ Destructive actions need confirmation modal or undo window—never immediate

### Touch & Interaction

- ✅ `touch-action: manipulation` (prevents double-tap zoom delay)
- ✅ `-webkit-tap-highlight-color` set intentionally
- ✅ `overscroll-behavior: contain` in modals/drawers/sheets
- ✅ During drag: disable text selection, `inert` on dragged elements
- ✅ `autoFocus` sparingly—desktop only, single primary input; avoid on mobile

### Safe Areas & Layout

- ✅ Full-bleed layouts need `env(safe-area-inset-*)` for notches
- ✅ Avoid unwanted scrollbars: `overflow-x-hidden` on containers, fix content overflow
- ✅ Flex/grid over JS measurement for layout

### Dark Mode & Theming

- ✅ `color-scheme: dark` on `<html>` for dark themes (fixes scrollbar, inputs)
- ✅ `<meta name="theme-color">` matches page background
- ✅ Native `<select>`: explicit `background-color` and `color` (Windows dark mode)

### Locale & i18n

- ✅ Dates/times: use `Intl.DateTimeFormat` not hardcoded formats
- ✅ Numbers/currency: use `Intl.NumberFormat` not hardcoded formats
- ✅ Detect language via `Accept-Language` / `navigator.languages`, not IP

### Hydration Safety

- ✅ Inputs with `value` need `onChange` (or use `defaultValue` for uncontrolled)
- ✅ Date/time rendering: guard against hydration mismatch (server vs client)
- ✅ `suppressHydrationWarning` only where truly needed

### Hover & Interactive States

- ✅ Buttons/links need `hover:` state (visual feedback)
- ✅ Interactive states increase contrast: hover/active/focus more prominent than rest

### Content & Copy

- ✅ Active voice: "Install the CLI" not "The CLI will be installed"
- ✅ Title Case for headings/buttons (Chicago style)
- ✅ Numerals for counts: "8 deployments" not "eight"
- ✅ Specific button labels: "Save API Key" not "Continue"
- ✅ Error messages include fix/next step, not just problem
- ✅ Second person; avoid first person
- ✅ `&` over "and" where space-constrained

### Anti-patterns (DO NOT USE)

- ❌ `user-scalable=no` or `maximum-scale=1` disabling zoom
- ❌ `onPaste` with `preventDefault`
- ❌ `transition: all`
- ❌ `outline-none` without focus-visible replacement
- ❌ Inline `onClick` navigation without `<Link>`
- ❌ `<div>` or `<span>` with click handlers (should be `<button>`)
- ❌ Images without dimensions
- ❌ Large arrays `.map()` without virtualization
- ❌ Form inputs without labels
- ❌ Icon buttons without `aria-label`
- ❌ Hardcoded date/number formats (use `Intl.*`)
- ❌ `autoFocus` without clear justification

---

## Design System Integration

### Color Palette
See [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) for complete color definitions.

**Primary Colors:**
- **Seashell** (`#FFF4EB`) - Main backgrounds
- **Powder Petal** (`#F9E6DD`) - Cards, modals
- **Air Force Blue** (`#6C8FAE`) - Primary actions, headings
- **Steel Blue** (`#7DA1B5`) - Secondary actions, body text
- **Silver** (`#BEB6B6`) - Borders, muted text

### Typography
- Use RapidResponse font family for headings
- System fonts for body text
- Ensure proper heading hierarchy
- Use `text-wrap: balance` on headings

### Spacing & Layout
- Consistent spacing scale (4px base unit)
- Max-width containers: `max-w-7xl` for main content
- Responsive breakpoints: sm, md, lg, xl
- Grid layouts for item displays

### Component Patterns
- Cards: `bg-powder-petal` with `border-silver`
- Buttons: Primary `bg-air-force-blue`, Secondary `bg-steel-blue`
- Forms: Labels above inputs, error messages below
- Modals: Backdrop blur, centered, `overscroll-behavior: contain`

---

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up database schema (Prisma)
- [ ] Create API route structure
- [ ] Implement wallet connection
- [ ] Basic merch creation form (no NFT)
- [ ] File upload to IPFS
- [ ] Database models for MerchItem
- [ ] Apply design guidelines checklist
- [ ] Color system integration

### Phase 2: NFT Integration (Weeks 3-4)
- [ ] NFT smart contract integration
- [ ] NFT metadata generation
- [ ] Minting workflow
- [ ] Transaction status tracking
- [ ] NFT display components
- [ ] Accessibility audit
- [ ] Focus states implementation

### Phase 3: Launchpad Enhancement (Weeks 5-6)
- [ ] Enhance existing launch page
- [ ] Merch collection linking
- [ ] Community page auto-creation
- [ ] Token-merch association
- [ ] Form validation improvements
- [ ] Error handling patterns

### Phase 4: Explore Page (Weeks 7-8)
- [ ] Search implementation
- [ ] Filter system
- [ ] Grid/List views
- [ ] Item cards
- [ ] Trending algorithm
- [ ] Featured collections
- [ ] Virtualization for large lists
- [ ] Image optimization

### Phase 5: Community Features (Weeks 9-10)
- [ ] Community page structure
- [ ] Discussion forum
- [ ] Activity feed
- [ ] Member management
- [ ] Real-time updates (WebSockets)
- [ ] Rich text editor
- [ ] Markdown rendering

### Phase 6: Polish & Testing (Weeks 11-12)
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Bug fixes
- [ ] Documentation
- [ ] Full accessibility audit
- [ ] Design guidelines compliance check
- [ ] Cross-browser testing
- [ ] Mobile responsiveness

---

## Database Schema

### Core Tables
```sql
-- Merch Items
CREATE TABLE merch_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id VARCHAR(42) NOT NULL, -- Wallet address
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(20) NOT NULL,
  tags TEXT[],
  sku VARCHAR(50),
  base_price NUMERIC(36, 18) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  stock_quantity INTEGER DEFAULT -1,
  is_pre_order BOOLEAN DEFAULT FALSE,
  is_limited_edition BOOLEAN DEFAULT FALSE,
  edition_count INTEGER,
  primary_image_url TEXT NOT NULL,
  image_urls TEXT[],
  video_url TEXT,
  model_3d_url TEXT,
  has_nft BOOLEAN DEFAULT FALSE,
  nft_contract_address VARCHAR(42),
  nft_token_id VARCHAR(100),
  nft_collection_id UUID,
  royalty_percentage NUMERIC(5, 2) DEFAULT 5.00,
  nft_supply INTEGER DEFAULT 1,
  network VARCHAR(10) DEFAULT 'L1X',
  transaction_hash VARCHAR(66),
  block_number BIGINT,
  status VARCHAR(20) DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Launchpad Tokens
CREATE TABLE launchpad_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id VARCHAR(42) NOT NULL,
  token_address VARCHAR(42) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  ticker VARCHAR(10) NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  social_links JSONB,
  initial_buy NUMERIC(36, 18) NOT NULL,
  weeks_lock INTEGER DEFAULT 0,
  max_tx_percent NUMERIC(5, 2) NOT NULL,
  max_wallet_percent NUMERIC(5, 2) NOT NULL,
  total_supply NUMERIC(36, 18) NOT NULL,
  initial_liquidity NUMERIC(36, 18),
  vesting_schedule JSONB,
  merch_collection_id UUID,
  nft_collection_id UUID,
  community_page_id UUID,
  network VARCHAR(10) DEFAULT 'L1X',
  transaction_hash VARCHAR(66) NOT NULL,
  block_number BIGINT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Communities
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  banner_image_url TEXT,
  logo_url TEXT,
  creator_id VARCHAR(42) NOT NULL,
  token_address VARCHAR(42),
  merch_collection_id UUID,
  nft_collection_id UUID,
  member_count INTEGER DEFAULT 0,
  token_holder_count INTEGER DEFAULT 0,
  total_volume NUMERIC(36, 18) DEFAULT 0,
  floor_price NUMERIC(36, 18),
  is_public BOOLEAN DEFAULT TRUE,
  allow_member_posts BOOLEAN DEFAULT TRUE,
  moderation_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Discussion Threads
CREATE TABLE discussion_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id),
  author_id VARCHAR(42) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_activity_at TIMESTAMP DEFAULT NOW()
);

-- Discussion Replies
CREATE TABLE discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES discussion_threads(id),
  author_id VARCHAR(42) NOT NULL,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES discussion_replies(id),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity Feed
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id),
  type VARCHAR(50) NOT NULL,
  actor_id VARCHAR(42) NOT NULL,
  target_id VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_merch_creator ON merch_items(creator_id);
CREATE INDEX idx_merch_status ON merch_items(status);
CREATE INDEX idx_merch_category ON merch_items(category);
CREATE INDEX idx_merch_created ON merch_items(created_at DESC);
CREATE INDEX idx_tokens_creator ON launchpad_tokens(creator_id);
CREATE INDEX idx_tokens_address ON launchpad_tokens(token_address);
CREATE INDEX idx_communities_creator ON communities(creator_id);
CREATE INDEX idx_threads_community ON discussion_threads(community_id);
CREATE INDEX idx_threads_created ON discussion_threads(created_at DESC);
CREATE INDEX idx_activities_community ON activities(community_id, created_at DESC);
```

---

## Security Considerations

1. **Input Validation**: All user inputs validated on client and server
2. **File Upload Security**: File type validation, size limits, virus scanning
3. **Smart Contract Security**: Audit all contracts, use established patterns
4. **Rate Limiting**: Prevent abuse of API endpoints
5. **Authentication**: Wallet signature verification for sensitive operations
6. **SQL Injection**: Use parameterized queries (Prisma handles this)
7. **XSS Prevention**: Sanitize user-generated content
8. **CSRF Protection**: Token-based CSRF protection for state-changing operations

---

## Performance Optimization

1. **Image Optimization**: Next.js Image component, WebP format, lazy loading
2. **Caching**: Redis for frequently accessed data
3. **Pagination**: Implement cursor-based pagination for large datasets
4. **Database Indexing**: Proper indexes on frequently queried columns
5. **CDN**: Serve static assets via CDN
6. **Code Splitting**: Dynamic imports for heavy components
7. **API Response Caching**: Cache static data (collections, featured items)
8. **Virtualization**: Use `react-window` or `virtua` for large lists

---

## Testing Strategy

1. **Unit Tests**: Jest for utility functions, form validation
2. **Integration Tests**: Test API endpoints, database operations
3. **E2E Tests**: Playwright for critical user flows
4. **Smart Contract Tests**: Hardhat/Truffle for contract testing
5. **Load Testing**: k6 or Artillery for API performance
6. **Accessibility Tests**: axe-core, Lighthouse
7. **Visual Regression**: Chromatic or Percy

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] IPFS gateway configured
- [ ] Smart contracts deployed to L1X
- [ ] Wallet connection tested
- [ ] File upload tested
- [ ] Search functionality verified
- [ ] Real-time features tested
- [ ] Error tracking configured
- [ ] Analytics integrated
- [ ] Performance monitoring active
- [ ] Security audit completed
- [ ] Accessibility audit passed
- [ ] Design guidelines compliance verified
- [ ] Cross-browser testing complete
- [ ] Mobile responsiveness verified

---

## Code Review Checklist

Before submitting code for review, ensure:

### Accessibility
- [ ] All interactive elements have keyboard handlers
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Icon buttons have aria-labels
- [ ] Focus states are visible
- [ ] Semantic HTML used

### Forms
- [ ] Inputs have autocomplete attributes
- [ ] Placeholders end with `…`
- [ ] Error messages are inline and helpful
- [ ] Submit buttons show loading states
- [ ] No paste blocking

### Performance
- [ ] Images have width/height
- [ ] Large lists are virtualized
- [ ] No layout reads in render
- [ ] Animations respect prefers-reduced-motion

### Design
- [ ] Colors match design system
- [ ] Typography follows hierarchy
- [ ] Spacing is consistent
- [ ] Responsive on all breakpoints

### Code Quality
- [ ] TypeScript types are correct
- [ ] No console.logs in production code
- [ ] Error handling is implemented
- [ ] Loading states are shown

---

## Future Enhancements

1. **Marketplace Features**
   - Secondary market for NFTs
   - Auction system
   - Bundle purchases

2. **Social Features**
   - User profiles
   - Follow creators
   - Activity feed personalization

3. **Analytics Dashboard**
   - Creator analytics
   - Sales reports
   - Community insights

4. **Mobile App**
   - React Native app
   - Push notifications
   - Mobile wallet integration

---

## Conclusion

This implementation plan provides a comprehensive blueprint for implementing the merch and NFT creation process on Awebo.wtf. The system is designed to be scalable, secure, user-friendly, and fully compliant with web interface guidelines while leveraging the L1X blockchain for NFT and token operations.

**Key Principles:**
- ✅ Follow Web Interface Guidelines strictly
- ✅ Use Design System colors and patterns
- ✅ Prioritize accessibility and performance
- ✅ Implement proper error handling
- ✅ Test thoroughly before deployment

The development should follow an iterative approach, starting with core functionality and gradually adding advanced features. Regular testing, security audits, and design compliance checks are essential throughout the development process.

---

## References

- [Color Design System](./COLOR_SYSTEM.md)
- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: January 26, 2026  
**Version**: 1.0.0  
**Status**: Implementation Ready
