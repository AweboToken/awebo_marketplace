# AWEBO Launchpad – UI Development Plan (UI‑Only Scope)

## 1. Project Overview

**AWEBO** is a multichain Web3 token launchpad with a differentiated **phygital layer**: every token launch can optionally include **merch-backed, globally shippable collectibles** that act as physical extensions of on-chain participation.

This proposal focuses **exclusively on UI/UX design and frontend implementation**. No smart contracts, backend logic, indexing, or infra work is included.

The goal is to deliver a **polished, trust‑building, conversion‑oriented interface** that makes token launches, participation, and merch redemption feel simple, premium, and global.

---

## 2. UI Design Principles

- **Clarity over complexity**: Web2-level usability for Web3 flows
- **Launch-first mindset**: Projects and drops are the hero
- **Phygital-native UX**: Merch feels first-class, not an afterthought
- **Multichain aware**: Network context always visible, never confusing
- **Mobile-first**: Merch + minting must work seamlessly on mobile

---

## 3. Core UI Modules (Deliverables)

### 3.1 Landing & Discovery

- AWEBO landing page (value prop, how it works, featured launches)
- Active / Upcoming / Past launches grid
- Launch filters (chain, status, category)
- Launch detail preview cards

### 3.2 Launch Detail Page (Token Drop)

- Project hero section (branding, chain, socials)
- Token info panels (allocation, pricing, timeline)
- Participation CTA states (connected / not connected)
- Progress indicators (phases, sold %, countdowns)

### 3.3 Merch / Phygital Module (Key Differentiator)

- Merch selection step (sizes, variants, quantities)
- Clear relationship between **token participation ↔ merch eligibility**
- Visual distinction between digital-only vs phygital tiers
- Shipping coverage indicator (global reach)
- Merch preview gallery (mockups / lifestyle shots)

### 3.4 Wallet & Network UX (UI Only)

- Wallet connect modal (UI only)
- Network indicator & switcher (visual states only)
- Balance & eligibility display components
- Error / warning UI states (wrong network, not eligible, sold out)

### 3.5 User Profile (Frontend)

- Connected wallet profile screen
- Participated launches list
- Claimed / redeemable merch section
- Shipping status placeholders (UI only, no logic)

### 3.6 Launch Creator UI (Admin / Creator Side – UI Only)

- Launch creation stepper (token → merch → preview)
- Merch configuration UI (SKUs, images, limits)
- Preview mode (what users will see)
- Launch status dashboards (static / mock data)

### 3.7 Global UI System

- Design system (colors, typography, spacing)
- Button, card, modal, badge components
- Chain & status badges
- Empty states, loading skeletons, success states

---

## 4. Tech Assumptions (UI Layer Only)

- **Framework**: React / Next.js
- **Styling**: Tailwind or equivalent utility system
- **State**: Mocked / static data only
- **Web3 hooks**: UI stubs only (no real tx signing)
- **Responsive**: Desktop + Mobile

---

## 5. Out of Scope (Explicit)

- Smart contracts
- Token economics logic
- Wallet security / signing
- Backend, APIs, databases
- Fulfillment, shipping, or logistics systems

---

## 6. Deliverable Format

- Pixel‑perfect UI implementation
- Fully responsive pages
- Reusable component library
- Clean, documented frontend structure

---

## 7. todo.md

### Done so far (brief)

- **Foundation:** Next.js + Tailwind set up; base layout (Navigation, Footer); design tokens in Tailwind (e.g. `air-force-blue`); UI primitives (button, card, badge, backgrounds).
- **Landing & discovery:** Landing hero (LandingHero, LandingAboveFold); value/trust (LandingTrustedBy, LandingTopCreators, LandingPhygital, LandingHowItWorks, LandingEcosystem, LandingCtaBanner); launch feed (LaunchFeed); explore/drops pages.
- **Launch detail:** Creator page route `creator/[slug]`; launch layout and launch page with feed.
- **Merch / phygital:** Phygital section on landing; merch step in Launch Wizard; shirt-parallax-card and merch-related UI.
- **Wallet & network (UI only):** ConnectWalletModal, UserMenu, PrivyProviderWrapper (Privy).
- **User profile (frontend):** App profile page with tabs (Balances, Gains, Coins, Referrals, Settings) and DashboardCard.
- **Launch creator (UI only):** Launch creation stepper (LaunchWizard + launch-steps: Profile → Brand → Token → Merch → Review); LaunchWizardModal.
- **Content:** Landing and app home use built-in defaults (no external CMS).
- **System polish:** Reusable UI (animated-pattern-cloud, procedural-ground-background, hero-preview-walls); responsive structure in place.

---

```md
# AWEBO Launchpad – UI TODO

## Foundation

- [ ] Define design system (colors, typography, spacing)
- [ ] Set up Next.js + Tailwind project
- [ ] Create base layout (navbar, footer)

## Landing & Discovery

- [ ] Landing page hero section
- [ ] Featured launches section
- [ ] Launch grid & cards
- [ ] Filters UI (chain, status)

## Launch Detail Page

- [ ] Project hero & branding section
- [ ] Token info panels
- [ ] Timeline & countdown UI
- [ ] Participation CTA states

## Merch / Phygital Flow

- [ ] Merch selection step UI
- [ ] Variant & size selector components
- [ ] Digital vs Phygital tier UI
- [ ] Merch gallery & previews
- [ ] Global shipping indicator

## Wallet & Network UI

- [ ] Wallet connect modal (UI only)
- [ ] Network badge & switcher UI
- [ ] Balance & eligibility display
- [ ] Error & warning UI states

## User Profile

- [ ] Profile overview screen
- [ ] Participated launches list
- [ ] Redeemable merch section
- [ ] Shipping status placeholders

## Launch Creator (UI Only)

- [ ] Launch creation stepper UI
- [ ] Token setup screen (mock data)
- [ ] Merch configuration UI
- [ ] Preview & confirmation screen

## System Polish

- [ ] Empty states
- [ ] Loading skeletons
- [ ] Success / confirmation states
- [ ] Mobile responsiveness pass

## Final QA

- [ ] Cross-browser check
- [ ] Responsive QA (mobile / desktop)
- [ ] UI consistency pass
```
