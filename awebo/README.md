# Awebo.wtf

A modern web application for launching and trading tokens on the L1X chain.

## Features

This application implements 8 key designs from Figma:

1. **Home Page** - Welcome page with hot tokens display and welcome modal
2. **Launch Page** - Token creation and launch interface
3. **Activity Page** - Latest alerts and activity tracking
4. **Profile - Balances** - User token holdings view
5. **Profile - Gains** - Performance metrics and gains tracking
6. **Profile - Coins** - Created coins management
7. **Profile - Referrals** - Referral system interface
8. **Profile - Settings** - User profile settings

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React** - UI library

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
awebo/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── launch/            # Launch page
│   ├── activity/          # Activity page
│   ├── profile/           # Profile page with tabs
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Navigation.tsx     # Top navigation bar
│   ├── Footer.tsx         # Footer component
│   ├── DashboardCard.tsx  # User dashboard card
│   └── WelcomeModal.tsx   # Welcome modal
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Design Implementation

All designs have been implemented to match the Figma specifications:

- Dark theme with black background (#000000)
- Teal accent color for active states (#00D9FF)
- Orange accent color for primary actions (#FF6B35)
- Brown color for claim buttons (#D2691E)
- Responsive layout with proper spacing and typography
- Interactive elements with hover states

## Pages

### Home (`/`)

- Hero section with logo and welcome message
- Hot tokens grid display
- Welcome modal (shown on first visit)

### Launch (`/launch`)

- Token creation form
- Launch settings configuration
- Real-time preview
- Publish process indicator

### Activity (`/activity`)

- Latest alerts display
- Activity tracking information
- Alert count badge

### Profile (`/profile`)

- Dashboard card with user metrics
- Tabbed interface for:
  - **Balances**: Token holdings with filter
  - **Gains**: Performance metrics and claim functionality
  - **Coins**: Created coins search and management
  - **Referrals**: Referrer setup and referral tracking
  - **Settings**: Profile settings and public link

## Customization

### Colors

Colors can be customized in `tailwind.config.ts`:

```typescript
colors: {
  teal: {
    DEFAULT: "#00D9FF",
    dark: "#00B8D4",
  },
  orange: {
    DEFAULT: "#FF6B35",
    dark: "#E55A2B",
  },
  brown: {
    DEFAULT: "#D2691E",
  },
}
```

## License

© 2026 Awebo.wtf. All rights reserved.
