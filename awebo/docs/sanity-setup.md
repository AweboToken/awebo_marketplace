# Sanity Studio integration

AWEBO uses [Sanity](https://sanity.io) as the CMS for the landing page and app home content.

## Env vars

Add to `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

Optional:

- `NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01` (defaults to this)
- Server-side only: `SANITY_API_KEY` or `SANITY_PROJECT_ID` / `SANITY_DATASET` if you need them for server actions

Get the project ID from [sanity.io/manage](https://sanity.io/manage).

## Opening the Studio

- **URL:** `/studio` (e.g. `http://localhost:3000/studio`)
- **Footer:** Landing page footer includes a “Content (Studio)” link to `/studio`

If env vars are missing, `/studio` shows a short setup message instead of the Studio UI.

## Content structure

- **Home Page** (singleton) – hero badge/headline/subtext/slides, How it works, Ecosystem, CTA banner
- **App Page** (singleton) – app home hero, projects, banner, featured, CTA
- **Top Creators** – list of creator cards (name, slug, tagline, image, stats)
- **Trusted by partners** – list of partner logos/names
- **Phygital items** – list for the phygital section
- **How it works cards** – cards for the How it works section
- **Projects** – used by the app home grid

## Where content is used

| Source        | Used on |
|---------------|--------|
| Home Page     | `/` (landing): hero, top creators, trusted by, how it works, ecosystem, CTA banner |
| App Page      | `/app`: hero image, projects grid, banner, featured, CTA |
| Top Creators  | Landing “Top creators” section |
| Trusted by    | Landing “Trusted by” section |
| Phygital items| Landing phygital section |
| How it works  | Landing “How it works” section |

## Creating the Home Page document

In Studio, open **Content → Home Page**. If the document does not exist yet, create it and set its document ID to `homePage` (singleton). The structure in the config uses `_id == "homePage"`. Same idea for **App Page** with ID `appPage`.

## Landing design parity (deployed vs main)

The landing page is built so it **looks the same** whether content comes from Sanity or not:

- **Fallbacks:** Every section (hero, top creators, trusted by, phygital, how it works, ecosystem, CTA banner) has default copy and images. If Sanity is unconfigured or returns empty/null, the main-branch design is used.
- **Images:** If the CMS returns items with missing image URLs, placeholders are used so layout and design stay consistent (no broken images or missing blocks).
- **Hero carousel:** If Sanity hero slides have no valid URLs, the default video + image slides are shown.
- **Revalidate:** The landing page uses `revalidate = 60` so the deployed site refreshes from Sanity periodically and stays in sync with Studio content.

This keeps the deployed Sanity-backed landing visually aligned with the main-branch design.

## Build and run

With `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` set, the site fetches content from Sanity. Without them, the app still builds and runs using default/fallback content.
