# AWEBO System Flow — DB, Backend, Frontend, Manufacturer & Shipping

End-to-end flow from creator launchpad (design puffytoys/merch) through database, backend, manufacturer in China, and shipping to the customer.

---

## Pricing & economics: merch ↔ token

The token launch and marketplace are tied to merch pricing as follows:

1. **Merch sum = token launch price**  
   For each drop of a token launch, the sum of all merch element prices in that drop equals the **total price of the token** — i.e. the required amount to launch the drop.
   - Example: drop has 3 items at $20, $30, $50 → token launch price = $100.
   - The creator configures the drop so that **Σ(merch prices in drop) = token launch price**.

2. **Merch profit = token marketplace price**  
   The **profit** from each merch sale (e.g. 50% margin) is what backs the **price of the token** in the marketplace.
   - Example: 50% profit on a $30 item → $15 goes toward the token value.
   - So: **token price in marketplace** is derived from (and capped by) the aggregate merch profit from the drop.

```
+------------------------------------------+
|  DROP (one token launch)                 |
|  ┌─────────────────────────────────────┐ |
|  |  Merch item A  $20                   | |
|  |  Merch item B  $30                   | |
|  |  Merch item C  $50                   | |
|  |  ─────────────────────────────      | |
|  |  SUM = $100 = TOKEN LAUNCH PRICE     | |
|  └─────────────────────────────────────┘ |
|                                          |
|  Profit (e.g. 50%) on each sale         |
|  → backs TOKEN PRICE in marketplace      |
+------------------------------------------+
```

This framework is used in Phase 1 (creator sets merch + drop so the sum equals the desired launch price) and Phase 2 (buyer checkout and token/NFT purchase reflect this economics).

---

## 1. High-level flow (three phases)

```
+------------------+     +------------------+     +------------------+
|  PHASE 1: LAUNCH |     |  PHASE 2: SELL   |     | PHASE 3: FULFILL |
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  Creator designs |     |  Buyer discovers |     |  Export to        |
|        |          |     |        |          |     |  manufacturer    |
|        v          |     |        v          |     |        |          |
|  Token + NFT      |---->|  Checkout +      |---->|        v          |
|  + Merch          |     |  optional ?ref=  |     |  Produce + ship   |
|                  |     |        |          |     |        |          |
|                  |     |        v          |     |        v          |
|                  |     |  Order in DB     |     |  Tracking -> DB   |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

---

## 2. System layers and components

```
+--------------------------------------------------------------------------------+
| FRONTEND (Next.js)                                                             |
+--------------------------------------------------------------------------------+
|  Landing/Explore  |  Launchpad Wizard (Profile->Brand->Token->Merch->Review)   |
|  Creator Studio/Profile  |  Checkout (token buy, NFT mint, merch+shipping)    |
|  Referral link (?ref=)                                                         |
+--------------------------------------------------------------------------------+
                                        |
                                        v
+--------------------------------------------------------------------------------+
| BACKEND (API)                                                                  |
+--------------------------------------------------------------------------------+
|  Next.js API Routes  |  Merch/Launch API  |  Orders API  |  Referral API      |
|  Fulfillment pipeline (export to warehouse)                                    |
+--------------------------------------------------------------------------------+
                                        |
                    +-------------------+-------------------+
                    v                   v                   v
+--------------------------+  +------------------+  +--------------------------+
| DATABASE (PostgreSQL)     |  | STORAGE           |  | L1X CHAIN                |
+--------------------------+  +------------------+  +--------------------------+
| merch_items              |  | IPFS             |  | Token launchpad contract |
| launchpad_tokens         |  | (images, metadata)|  | ERC-721 NFT contract     |
| communities              |  +------------------+  +--------------------------+
| orders                   |
| referral_codes           |
+--------------------------+

+--------------------------+  +--------------------------+
| MANUFACTURER (China)      |  | SHIPPING                 |
+--------------------------+  +--------------------------+
| Production order         |  | Fulfillment partner      |
| (SKUs, quantities, specs)|  | Tracking number -> DB    |
| Warehouse / fulfillment  |  | Delivery to customer     |
+--------------------------+  +--------------------------+
```

---

## 3. Phase 1 — Creator launch (design & launch)

```
CREATOR                    BACKEND + DB                     EXTERNAL
   |                            |                                |
   |  Landing                    |                                |
   v                            |                                |
+--------+                      |                                |
|Landing |                      |                                |
+--------+                      |                                |
   |                            |                                |
   v                            |                                |
+----------------+              |                                |
| Launchpad      |--------------+---------> +------+              |
| Wizard         |              |          | API  |               |
+----------------+              |          +------+               |
   |                            |             |                   |
   v                            |             v                   |
+----------------+              |          +-----------+         |
| Creator        |              |          | Merch API  |---------+-----> +------+
| Profile        |              |          +-----------+         |       | IPFS |
+----------------+              |                |                |       +------+
                                |                |                |
                                |                v                |
                                |          +--------------------------------+
                                |          | merch_items                     |
                                +<---------| launchpad_tokens                |
                                           | communities                     |
                                           +--------------------------------+
                                                         |
                                                         +-----------------> L1X
                                                                         (Token + NFT)
```

**Logic:** Creator completes wizard (merch prices in the drop must sum to the token launch price; see _Pricing & economics_ above) -> Backend saves merch/token/community to DB, uploads assets to IPFS, deploys token and NFT on L1X.

---

## 4. Phase 2 — Buyer purchase (checkout & referral)

```
BUYER                       BACKEND + DB                     L1X CHAIN
  |                              |                                |
  |  Optional: ?ref= link -------+                                |
  |                              |                                |
  v                              |                                |
+------------------+             |                                |
| Creator profile  |             |                                |
| / Explore        |             |                                |
+------------------+             |                                |
  |                              |                                |
  v                              |                                |
+------------------+             |                                |
| Checkout         |------------>+------+                          |
| (token, NFT,     |             |Order |                          |
|  merch, shipping)|             | API  |                          |
+------------------+             +------+                          |
                                    |                              |
                    +---------------+---------------+              |
                    v               v               v              |
              +----------+   +-------------+   +----------+        |
              | orders   |   | Referral    |   | Token buy|--------+
              | (DB)     |   | API         |   | NFT mint |
              +----------+   +-------------+   +----------+
                                     |
                                     v
                             +---------------+
                             | referral_codes|
                             +---------------+
```

**Logic:** Buyer checks out (with or without `?ref=`). Backend creates order in DB, attributes referral if present, executes token buy and NFT mint on L1X.

---

## 5. Phase 3 — Fulfillment (manufacturer -> shipping)

```
BACKEND                 DATABASE              MANUFACTURER (China)      SHIPPING
   |                        |                        |                        |
   v                        |                        |                        |
+----------------+          |                        |                        |
| Fulfillment    |--"export order"----------------->|                        |
| pipeline       |          |                        v                        |
+----------------+          |                 +-----------+                  |
   |                        |                 | Production |                  |
   +------------------------+---------------->| SKUs, qty  |                  |
   (read orders)            |                 +-----------+                  |
                            |                        |                        |
                            |                        v                        |
                            |                 +-----------+                  |
                            |                 | Warehouse |----------------->|
                            |                 +-----------+                  |
                            |                                                v
                            |                                         +-------------+
                            |                                         | Fulfillment |
                            |                                         | partner     |
                            |                                         +-------------+
                            |                                                |
                            |                                                v
                            |                                         +-------------+
                            |<-------- "tracking number" --------------| Tracking   |
                            |                                         +-------------+
                            v                                                |
                     +-------------+                                         v
                     | orders      |                                 +-------------+
                     | (updated)  |                                 | Delivery to |
                     +-------------+                                 | customer   |
                                                                    +-------------+
```

**Logic:** Fulfillment pipeline exports order to manufacturer. Production -> warehouse -> fulfillment partner. Partner ships, sends tracking back; backend updates `orders`; frontend shows status.

---

## 6. Full sequence: design to delivery

```
  Creator    Frontend    Backend     DB       L1X      IPFS    Manufacturer   Shipping   Buyer
     |           |           |         |         |         |          |            |          |
     |  Phase 1 -- Launch (design puffytoys/merch)         |          |            |          |
     |           |           |         |         |         |          |            |          |
     | Launch wizard         |         |         |         |          |            |          |
     |---------->|           |         |         |         |          |            |          |
     |           | Save draft/launch   |         |         |          |            |          |
     |           |---------->|         |         |         |          |            |          |
     |           |           |-------->| merch_items, launchpad_tokens, communities           |
     |           |           |-------->|         |         |  Upload  |            |          |
     |           |           |         |         |         |<---------|            |          |
     |           |           |-------->|         | Deploy token + mint NFT         |          |
     |           |           |         |         |<--------|         |             |          |
     |           |           |<--------|         | tx hash |         |             |          |
     |           |           |         |         |         |          |            |          |
     |  Phase 2 -- Buyer purchases (optional ?ref=)        |            |          |          |
     |           |           |         |         |         |          |            |          |
     |           |           |         |         |         |          |   Checkout |          |
     |           |           |         |         |         |          |<-----------|          |
     |           | Create order + referral               |          |            |          |
     |           |<---------------------------------------|          |            |          |
     |           |---------->|         |         |         |          |            |          |
     |           |           |-------->| orders (line_items, shipping, referral_ref)         |
     |           |           |-------->| Referral attribution        |            |          |
     |           |           |-------->|         | Token buy / NFT mint           |          |
     |           |           |         |         |<--------|         |            |          |
     |           |           |         |         |         |          |            |          |
     |  Phase 3 -- Fulfillment                           |            |          |          |
     |           |           |         |         |         |          |            |          |
     |           |           | Export order (SKUs, qty, address)     |            |          |
     |           |           |-------------------------------------->|            |          |
     |           |           |         |         |         |  Produce |            |          |
     |           |           |         |         |         |  (China) |            |          |
     |           |           |         |         |         |---->     |            |          |
     |           |           |         |         |         | Hand off |            |          |
     |           |           |         |         |         |          |----------->|          |
     |           |           |         |         |         |          | Tracking   |          |
     |           |           |<----------------------------------------|------------|          |
     |           |           |-------->| Update order                   |            |          |
     |           |           |         |         |         |          |  Deliver   |          |
     |           |           |         |         |         |          |----------->|----------|
     |           | View order status   |         |         |          |            |          |
     |           |<-----------|         |         |         |          |            |          |
     |           | Order status + tracking       |         |          |            |          |
     |           |<-----------|         |         |         |          |            |          |
```

---

## 7. Data flow summary

| Phase      | Trigger                  | Frontend                                           | Backend / API           | Database / external                                                  |
| ---------- | ------------------------ | -------------------------------------------------- | ----------------------- | -------------------------------------------------------------------- |
| 1. Launch  | Creator completes wizard | Launchpad UI (drop merch sum = token launch price) | Merch/Launch API        | merch_items, launchpad_tokens, communities; IPFS; L1X (token + NFT)  |
| 2. Sell    | Buyer checkout           | Checkout + optional ?ref=                          | Order API, Referral API | orders, referral_codes; L1X (buy + mint); merch profit → token price |
| 3. Fulfill | Order created            | —                                                  | Fulfillment pipeline    | Export to manufacturer -> warehouse -> partner; tracking -> orders   |

---

## 8. Component summary

| Layer        | Components                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Frontend     | Landing, Launchpad wizard (design merch; drop sum = token launch price), Creator profile, Checkout, Referral link (?ref=) |
| Backend      | Next.js API routes — merch/launch, orders, referral, fulfillment pipeline                                                 |
| Database     | PostgreSQL (Prisma): merch_items, launchpad_tokens, communities, orders, referral_codes                                   |
| Blockchain   | L1X: token launchpad contract, ERC-721 NFT, royalties                                                                     |
| Storage      | IPFS for images and metadata                                                                                              |
| Manufacturer | China production (SKUs, specs) -> warehouse / fulfillment partner                                                         |
| Shipping     | Fulfillment partner receives order + address, ships; tracking stored in DB and shown in profile                           |

**Pricing model:** Drop merch prices sum to token launch price; merch profit (e.g. 50%) backs token price in marketplace. See _Pricing & economics: merch ↔ token_ above.

This matches the flows described in `referral-and-shipping.md` and `IMPLEMENTATION_PLAN.md`.
