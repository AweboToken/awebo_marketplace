# User flow diagrams (from PDF specs)

This document visualizes the **Creator User Flow — Brand Studio** and **User Flow — Marketplace** PDFs using Mermaid. Render the diagrams in GitHub, VS Code (Markdown preview), or any Mermaid-compatible viewer.

---

## 1. High-level: who goes where

```mermaid
flowchart LR
  subgraph entry["Entry"]
    A[Marketing / AWEBO home]
  end

  subgraph gate["Access gate"]
    G1[Web3: connect wallet]
    G2[Web2: Google / Apple / Email]
  end

  subgraph shop["Marketplace"]
    M[Marketplace home]
  end

  subgraph studio["Brand Studio"]
    L[Launch / Creator Studio]
  end

  A --> gate
  gate --> M
  gate --> L
  M <-->|Browse brands & products| L
```

---

## 2. Marketplace shopper flow (PDF: User Flow — marketplace)

Top-of-funnel through purchase; matches header, discovery, PDP, cart, and account surfaces.

```mermaid
flowchart TD
  MH[Marketplace home / landing]

  MH --> H[Header: logo · search · favorites · notifications · profile · cart]
  MH --> CM[Category menu dropdown]
  MH --> DISC[Discovery: category tiles · curated rails · infinite feed]

  CM --> CP[Category page]
  DISC --> CP
  DISC --> PDP[Product page PDP]

  CP --> PDP

  PDP --> VPB[View brand]
  PDP --> ATC[Add to cart / Buy now]
  PDP --> REV[Reviews read / write login + verified purchase rules]

  ATC --> CART[Cart: line items · summary · limited-time memory TBD]
  CART --> CHK[Checkout]

  subgraph CHK["Checkout 3 steps"]
    D1[1 Delivery: name · address · shipping]
    D2[2 Payment: Web2 tab OR Web3 tab wallet + stablecoin]
    D3[3 Confirmation: order ID · tracking placeholder · receipt]
  end

  CHK --> D1 --> D2 --> D3

  VPB --> BP[Brand page public storefront]

  subgraph BP["Brand page"]
    BH[Hero: banner · logo · name · narrative · links]
    T1[Products tab]
    T2[Collections tab]
    T3[Activity tab]
    T4[About tab]
    T5[Fundraising tab if active]
  end

  T5 --> FP[Fundraising page: progress · supporters · products · support module]

  MH --> FAV[Favorites login required]
  MH --> NOTIF[Notifications feed AWEBO]
  MH --> PROF[Profile: account · addresses · orders · wallet optional]

  MH --> UX[Global: floating chat bottom-right when logged in]
```

---

## 3. Brand Studio creator flow (PDF: Creator User Flow — Brand Studio)

Four-step stepper from access through publish; includes contract fork self-funded vs crowdfunding.

```mermaid
flowchart TD
  START[Set brand name / create brand intent]

  START --> GATE[Login gate: Web3 wallet OR Web2 Google Apple Email]

  GATE --> S1[Step 1 of 4 — Brand setup / visual identity]

  subgraph S1["Step 1 — Brand setup"]
    B1[Upload banner · logo · brand symbol]
    B2[Narrative / story · social links]
    B3[Live preview of profile]
  end

  S1 --> S2[Step 2 of 4 — Catalog and products]

  subgraph S2["Step 2 — Catalog and products"]
    C0[Catalog home: search · main categories Men Women Kids Home Misc · rotating topics]
    C1[Mega category overlay]
    C2[Product category listing · filter sort]
    C3[Product details + base cost]
    C4[Start designing]
    C5[Product editor overlay: artwork · front back label · variants · mockups · save or discard]
    C6[My products / collections · status Draft Pricing Ready]
  end

  S2 --> S3[Step 3 of 4 — Brand contract]

  subgraph S3["Step 3 — Brand contract"]
    N[Chain selection · fixed supply e.g. 100 · owner % vs community %]
    N --> FORK{Launch mode}

    FORK -->|Path A| SF[Self-funded: sell to marketplace no shares whitelist crowdfunding]
    FORK -->|Path B| CF[Community funding: crowdfunding mechanics whitelist optional max per wallet]

    SF --> CC[Create contract · wallet sign · show address]
    CF --> CC
  end

  S3 --> S4[Step 4 of 4 — Review and publish]

  subgraph S4["Step 4 — Review and publish"]
    R1[Checklist: brand complete · products ready · pricing ALL products]
    R2[Final sale price mandatory per product · public vs private whitelist if applicable]
    R3[Optional order sample does not block publish]
    R4[Publish confirm modal: publishing locks editing if fundraising]
  end

  R4 --> OUT{After publish}

  OUT -->|Fundraising| REDIR_F[Redirect to fundraising page]
  OUT -->|Self-funded| REDIR_M[Brand and products live on marketplace]
```

---

## 4. Overlay: Brand Studio output → Marketplace

How the creator journey connects to surfaces shoppers see.

```mermaid
flowchart LR
  subgraph studio["Brand Studio publish"]
    P[Published brand + products]
  end

  subgraph mp["Marketplace"]
    FE[Discovery feed and search]
    BP[Brand storefront]
    PDP[Product PDP]
    FP[Fundraising page if active]
  end

  P --> FE
  P --> BP
  P --> PDP
  P --> FP
```

---

## 5. Legend (PDF terminology)

| PDF concept | Meaning in diagrams |
|-------------|---------------------|
| Access gate | Wallet or email/social login before gated actions |
| Mega category | Full category tree overlay from menu |
| PDP | Product detail page: gallery, variants, shipping snippet, CTAs |
| Path A / Self-funded | Direct marketplace listing; simpler contract path in PDF |
| Path B / Crowdfunding | Raise with community; whitelist and per-wallet caps; post-publish fundraising UX |
| Cart memory TBD | Time-limited cart persistence; noted in PDF as to be defined |

---

*Source: Creator User Flow — Brand Studio PDF; User Flow — marketplace PDF. Diagrams are descriptive; implementation may simplify or stub individual nodes.*
