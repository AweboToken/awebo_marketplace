# Referral & Shipping / Merch Handling

## Referral feature

### Flow

1. **Connect wallet** – User clicks “Launch Brand” or “Refer” and is prompted to connect wallet (ConnectWalletModal).
2. **Profile link** – Once connected, the wallet is linked to their profile so they can generate a **sharable referral link**.
3. **Sharable link** – Link format: `https://app.awebo.wtf?ref=<referrer_hash>` (or path + `?ref=`). The `ref` hash is derived from the referrer’s wallet (e.g. backend signs or hashes wallet address).
4. **Attribution** – When a new user lands with `?ref=...`:
   - Frontend persists the ref in **localStorage** (`awebo-referral-ref`) and **cookie** (`awebo_ref`) for the session/attribution window (e.g. 30 days).
   - Backend reads ref from cookie or from order/referral API and attributes the conversion to the referrer.
5. **Payments** – When the referred user completes a product order:
   - **Referrer** receives a referral payment (e.g. % of order or fixed fee).
   - **Product order** is created and fulfilled as normal.

### Frontend implementation (current)

- **`lib/referral.ts`** – `getRefFromUrl()`, `persistReferralRef()`, `getStoredReferralRef()`, `buildReferralLink(walletAddress, path)`, `initReferralFromUrl()`.
- Call `initReferralFromUrl()` once on app load (e.g. in layout or main client wrapper) so that `?ref=...` is stored.
- “Refer” action on a launch card: requires wallet connected → open ConnectWalletModal if not → then show “Copy referral link” using `buildReferralLink(walletAddress, currentPath)`.

### Backend (to implement)

- Resolve `ref` hash to referrer wallet (e.g. table `referral_codes` → wallet).
- On order creation, read `awebo_ref` cookie or referral param and create referral attribution + schedule referrer payout.
- Payout logic (e.g. percentage to referrer, rest to product/seller).

---

## Shipping & merch handling

### Concepts

- **Merch** is tied to launches (phygital): each launch can have SKUs (e.g. hoodie, tee, cap) with sizes and variants.
- **Order** = on-chain participation (token buy, NFT mint) + optional physical fulfillment (shipping).

### Shipping flow (target)

1. User buys token / mints NFT and optionally adds merch (size, quantity).
2. Order is created: order id, user wallet, shipping address (collected at checkout), line items (token/NFT + merch SKUs).
3. **Fulfillment** – Backend marks order as “to fulfill”, sends to fulfillment partner or internal warehouse; shipping address and SKUs are passed.
4. **Tracking** – When shipped, tracking number is stored and shown in user profile (“Shipping status”).
5. **Merch handling logic** – Inventory per SKU, caps per launch, allocation (e.g. NFT-gated early access). Backend validates availability and applies referral attribution before confirming order.

### Frontend (current)

- UI-only: shipping address form at checkout, “Shipping status” placeholders in profile, global shipping indicator on merch modules.
- No real inventory or fulfillment APIs yet.

### Backend (to implement)

- Orders table: order_id, user_wallet, referral_ref (nullable), status, shipping_address, line_items, tracking_code, etc.
- Fulfillment pipeline: export to warehouse/partner, update tracking.
- Referral: on order confirmation, credit referrer and create payout (e.g. escrow or internal ledger).
