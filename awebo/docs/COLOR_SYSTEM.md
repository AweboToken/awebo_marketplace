# Color Design System

This document defines the color palette for the Awebo.wtf application.

## Color Palette

### Seashell
- **Hex**: `#FFF4EB`
- **RGB**: `255, 244, 235`
- **Usage**: Primary background color
- **Tailwind**: `bg-seashell` or `text-seashell`

### Powder Petal
- **Hex**: `#F9E6DD`
- **RGB**: `249, 230, 221`
- **Usage**: Light accent backgrounds, cards, modals
- **Tailwind**: `bg-powder-petal` or `text-powder-petal`

### Silver
- **Hex**: `#BEB6B6`
- **RGB**: `190, 182, 182`
- **Usage**: Borders, neutral elements, secondary text
- **Tailwind**: `bg-silver` or `text-silver` or `border-silver`

### Air Force Blue
- **Hex**: `#6C8FAE`
- **RGB**: `108, 143, 174`
- **Usage**: Primary actions, links, headings
- **Tailwind**: `bg-air-force-blue` or `text-air-force-blue`

### Steel Blue
- **Hex**: `#7DA1B5`
- **RGB**: `125, 161, 181`
- **Usage**: Secondary actions, hover states, body text
- **Tailwind**: `bg-steel-blue` or `text-steel-blue`

## Usage Guidelines

### Backgrounds
- Use **Seashell** (`#FFF4EB`) for main page backgrounds
- Use **Powder Petal** (`#F9E6DD`) for cards, modals, and elevated surfaces

### Text
- Use **Air Force Blue** (`#6C8FAE`) for primary headings and important text
- Use **Steel Blue** (`#7DA1B5`) for body text and secondary information
- Use **Silver** (`#BEB6B6`) for muted text and placeholders

### Interactive Elements
- Use **Air Force Blue** (`#6C8FAE`) for primary buttons and links
- Use **Steel Blue** (`#7DA1B5`) for hover states on primary elements
- Use **Silver** (`#BEB6B6`) for borders and dividers

## Tailwind Classes

All colors are available as Tailwind utility classes:

```tsx
// Backgrounds
<div className="bg-seashell">...</div>
<div className="bg-powder-petal">...</div>

// Text
<p className="text-air-force-blue">...</p>
<p className="text-steel-blue">...</p>
<p className="text-silver">...</p>

// Borders
<div className="border-silver">...</div>
```

## Semantic Aliases

For convenience, semantic color aliases are also available:

- `bg-background` → `bg-seashell`
- `accent-light` → `powder-petal`
- `accent` → `silver`
- `accent-primary` → `air-force-blue`
- `accent-secondary` → `steel-blue`
