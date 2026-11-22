# PizzaHub — Pizza Ordering & Delivery Platform

PizzaHub is a role-based pizza ordering platform where customers discover local pizza shops and place delivery orders, vendors publish and manage their menus, and admins moderate the marketplace. This repository contains the Next.js App Router client.

## Live Links

- **Live client:** https://pizzahub-client-sigma.vercel.app
- **Live API:** https://pizzahub-server-ehzh.onrender.com
- **Client repository:** https://github.com/protap-paul/pizzahub-client
- **Server repository:** https://github.com/protap-paul/pizzahub-server

## Features

- Public home page with a pizza-themed hero, dynamic featured items, categories, and Framer Motion / Motion animations.
- Public browse menu with search, category filter, location filter, price sorting, pagination, loading, and empty states.
- Item details with image gallery, vendor information, ratings/reviews, favorites, and role-aware ordering.
- Better Auth email/password and Google sign-in, password rules, role-based redirects, and blocked-user handling.
- Separate customer, vendor, and admin dashboards with role-protected navigation and direct-URL protection.
- Vendor tools: restaurant profile fields, menu item CRUD with ImgBB uploads, availability control, order accept/reject, and subscription management.
- Customer tools: order placement with delivery date/address/message, order tracking, pending-order cancellation, and favorites.
- Admin tools: user search/filter/block, menu moderation, platform statistics, and read-only transactions.
- Stripe Checkout for the vendor Premium plan; activation only after the verified server webhook.
- Toast notifications, responsive layouts, dark/light theme toggle, custom loader, error, and 404 pages.

## Technology Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **UI:** ShadCN UI, Tailwind CSS 4, lucide-react, sonner, next-themes, recharts
- **Forms and validation:** react-hook-form, @hookform/resolvers, zod
- **Animation:** motion
- **Auth/API:** better-auth, JWT bearer tokens
- **Utilities:** date-fns, clsx, tailwind-merge, class-variance-authority, @tanstack/react-table
- **Backend:** Express.js, MongoDB, Stripe, ImgBB (see the server repository)

## Environment Variables

Create `.env.local` in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the deployed or local PizzaHub API. It is used for REST calls and as the Better Auth base URL. |

The server-side credentials (`MONGODB_URI`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_PREMIUM_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `IMGBB_API_KEY`, and `RESEND_API_KEY`) live only in the server environment. See `pizzahub-server/.env.example`.

> Never commit `.env`, `.env.local`, or any real credential. Only `.env.example` files are committed.

## Local Installation

```bash
git clone https://github.com/protap-paul/pizzahub-client.git
cd pizzahub-client
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your server URL
npm run dev
```

Open http://localhost:3000.

### Production build

```bash
npm run build
npm start
```

## How the Client Connects to the Backend

- `src/lib/api/api-endpoints.ts` defines the API prefixes (`/api/menu-items`, `/api/users`, `/api/orders`, `/api/dashboard`, `/api/subscriptions`, `/api/transactions`).
- `src/lib/api/api-client.ts` sends `Authorization: Bearer <JWT>` for protected requests using the Better Auth JWT plugin and handles blocked-user responses consistently.
- `src/lib/auth/auth-client.ts` configures the Better Auth client against `NEXT_PUBLIC_API_URL`.
- Feature services under `src/features/*/services` keep page components independent from fetch details.
- Role guards in the dashboard shell and auth components prevent customers, vendors, and admins from opening each other's dashboards.

## Challenge Implementations

### 1. Advanced search and sorting

The menu listing sends query parameters to `GET /api/menu-items`:

```text
search=<text>&category=<category>&location=<text>&sort=newest|price_asc|price_desc&page=<n>&limit=<n>
```

The server validates parameter types, escapes regular expressions for text filters, uses a whitelist for sort keys, and applies MongoDB `aggregate()` with `$match`, `$sort`, `$skip`, and `$limit`. Only `approved` and available items are returned publicly. The client exposes these through the filter bar and shows loading, empty, and error states.

### 2. JWT verification and role-based authorization

On login, the browser receives a Better Auth JWT. `getJWTToken()` obtains it through `authClient.token()`, and `apiRequest()` attaches it as a bearer token. Protected Express routes run `verifyToken`, which fetches the JWKS from `${BETTER_AUTH_URL}/api/auth/jwks`, verifies signature, issuer, audience, user ID, email, and role, then attaches `req.user`. `checkBlockedUser` rejects blocked accounts, and `authorizeRoles(...)` returns 403 for the wrong role. Controllers additionally verify ownership before update/delete operations.

### 3. Professional appearance

The interface uses a warm red/orange/cream palette with consistent headings, equal-height cards, responsive grids, uniform image treatment, ShadCN components, subtle Motion animations on the homepage, dashboard charts, and role-specific sidebars. A theme toggle supports dark and light modes.

## Stripe Testing

The vendor Premium checkout uses Stripe's test mode. The standard Stripe test card is:

```text
4242 4242 4242 4242
```

Use any future expiry and any CVC. Premium access is displayed only after the server verifies the Stripe webhook; the success redirect alone never upgrades the account.

## Notes

- Public registration allows only `customer` and `vendor` roles. Admin accounts are provisioned securely outside public registration.
- Stripe is used only for vendor Premium subscriptions. Customer food orders show an order confirmation instead of taking payment.
- The admin email/password required for submission are supplied by the project owner and are intentionally not stored in this repository.
