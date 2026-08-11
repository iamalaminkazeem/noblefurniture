# Noble Furniture Gallery — Full Stack

Complete Next.js 15 project. Every page, the cart/checkout flow, the admin
dashboard, and every form are wired to real API routes and a real database —
nothing is mocked. `.env` is genuinely the last configuration step.

## Pages
Home, About, Products (+ detail page), Custom Furniture, Services, Projects,
Gallery, Blog (+ post pages), FAQ, Testimonials, Contact, Book Consultation,
Cart, Checkout, Checkout Success, Privacy Policy, Terms & Conditions.

## Admin dashboard (`/admin`, Clerk-protected)
Overview stats, Products (list/create/edit/delete with ImageKit image
upload), Quote Requests (status pipeline), Consultations (status pipeline),
Blog (list/create/edit/delete).

## What's wired together
- Quote form, contact form, consultation form → real DB + Resend email + reCAPTCHA v3 + honeypot + rate limiting
- Products page/detail → real DB via `/api/products`
- Add to Cart → localStorage cart → Checkout → real Paystack transaction → webhook confirms payment → success page shows real order status
- Admin dashboard → Clerk auth → real CRUD against Postgres, image uploads to ImageKit

## Setup

1. `npm install`
2. Create accounts: Neon, Clerk, Paystack, Resend, ImageKit, Google reCAPTCHA v3 (recaptcha.com/admin)
3. `cp .env.example .env` and fill in every key
4. `npx prisma migrate dev --name init`
5. `npm run seed` (loads 6 starter products)
6. `npm run dev` → visit `localhost:3000`
7. Visit `/admin` to sign in via Clerk and manage products/quotes/blog
8. After deploying, set the Paystack webhook to `https://yourdomain.com/api/checkout/verify`

## Still worth doing (not env-related)
- Replace placeholder testimonials, founder bios, and product photos with real ones
- Legal review of Privacy Policy / Terms (marked with a warning in the pages themselves)
- Swap `<img>` tags for `next/image` for better performance scores
- Add automated tests
- For real production traffic, replace the in-memory rate limiter (`lib/rate-limit.ts`) with Upstash Redis — the in-memory version resets on every deploy/restart and doesn't share state across serverless instances
