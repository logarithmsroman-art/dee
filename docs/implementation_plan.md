# Implementation Plan
**Project:** Dee's Pen House Storytelling and creative agency

## Overview
This plan covers the full development lifecycle from infrastructure to deployment. The frontend framework of choice is **Next.js (App Router)** for its built-in SEO capabilities, which are critical for a content-driven storytelling agency. The project is built on **Tailwind CSS v4** and **shadcn/ui**, backed by **Supabase**, and deployed on **Cloudflare Pages**.

---

## Phase 1: Infrastructure & Backend Setup
**Objective:** Get the foundational tools running before any UI is built.

1. **Initialize Frontend:** Create the Next.js project. Install **Tailwind CSS v4** and initialize **shadcn/ui**.
2. **Supabase Setup:** Create the Supabase project. Run SQL migration scripts to create the 6 key tables:
   - `profiles`
   - `global_settings`
   - `shelf_items`
   - `articles`
   - `services`
   - `inquiries`
3. **Storage Setup:** Create a Supabase Storage bucket for uploading book covers, blog feature images, and the brand logo.
4. **Security Policies (RLS):** Set up Row Level Security in Supabase:
   - Public users can **read** `shelf_items`, `articles`, `services`, `global_settings`.
   - Public users can **insert** into `inquiries`.
   - Only the authenticated Admin can **insert/update/delete** all other tables.

---

## Phase 2: Themes & Reusable Components
**Objective:** Translate `design_system.md` into real code before building full pages.

1. **Theme Configuration:** Override the default Tailwind v4 CSS variables with our custom palette:
   - Backgrounds: Elegant cream/off-white (`#FCFBF9`)
   - Text: Deep charcoal (`#1A1A1D`)
   - Accents: Champagne gold (`#D4AF37`)
   - Admin: Dark slate (dark mode)
2. **Typography Setup:** Import and configure Google Fonts:
   - Headings: *Playfair Display* (or *Cormorant Garamond*)
   - Body/UI: *Inter* (or *Outfit*)
3. **Install Core shadcn/ui Atoms:** Generate and customize:
   - `Button` (Primary, Secondary, Ghost, Danger variants)
   - `Input`, `Textarea`, `Label`
   - `Badge` (Draft/Published status indicators)
   - `DataTable` (for Admin list views)
4. **Build Global Layouts:**
   - `GlobalNavbar` — fixed with glassmorphism blur effect, responsive with hamburger menu on mobile.
   - `Footer` — links to service pages, social media, contact.

---

## Phase 3: The Admin CMS Construction
**Objective:** Build the brain of the website so the client has full content control from day one.

1. **Auth Module:**
   - Build the `/admin/login` screen.
   - Implement private route middleware so unauthenticated users are redirected.
2. **Admin Layout:**
   - Build the `AdminSidebar` and dashboard wrapper used across all admin routes.
3. **Dashboard Overview (`/admin`):**
   - Summary stats: Total inquiries, shelf items, and published articles.
   - Quick-action buttons: "Write New Article" and "Add New Book."
4. **Global Settings Manager (`/admin/settings`):**
   - Logo upload directly to Supabase Storage.
   - Editable fields for contact email and social media links.
5. **Dee's Pen Shelf Manager (`/admin/shelf`):**
   - Table list of all books and projects with Edit and Delete actions.
   - Shelf Item Editor form: cover image upload, title, synopsis, CTA link, visibility toggle.
6. **Blog Engine (`/admin/blogs`):**
   - Blog Manager: list view with Draft/Published status badges.
   - Blog Editor: Integrate **TipTap** (or similar) as a WYSIWYG rich-text editor for formatting articles without code.
7. **Services Manager (`/admin/services`):**
   - Inline editing for service title and description fields.
8. **Inquiry Inbox (`/admin/inquiries`):**
   - Secure list view of all contact form submissions.
   - Ability to mark inquiries as read/archived.

---

## Phase 4: Public Frontend Assembly
**Objective:** Build the beautiful public-facing pages that pull data securely from Supabase.

1. **Homepage (`/`):**
   - Dramatic, animated Hero section with the brand name and tagline.
   - Dynamic teaser section pulling the latest shelf item and latest published article from Supabase.
   - Brief introduction to her services with a CTA pointing to `/services`.
2. **Dee's Pen Shelf (`/shelf`):**
   - CSS Grid gallery of `BookCard` / `ProjectCard` components.
   - Single-item detail view (`/shelf/[slug]`) with cover, synopsis, and purchase CTA.
3. **Blog & Articles (`/blog`):**
   - Index page with `ArticleTeaser` list (thumbnail, title, date, excerpt).
   - Single article reading view (`/blog/[slug]`) — distraction-free, typography-first layout.
4. **Services Showcase (`/services`):**
   - Dynamic rendering of all services from Supabase (Ghostwriting, Content Writing, Brand Storytelling).
   - CTA at the bottom pointing to `/contact`.
5. **Contact Form (`/contact`):**
   - Beautifully styled form wired to safely push new rows into the `inquiries` Supabase table.

---

## Phase 5: Polish & Deployment
**Objective:** Make the project feel like $5,000.

1. **Micro-Animations:**
   - Shelf card hover elevations (`transform: translateY(-4px)`).
   - Smooth page transitions and scroll-reveal animations using **Framer Motion** or CSS.
2. **SEO Optimization:**
   - Dynamic Next.js Metadata API configuration for each public page.
   - Open Graph tags so links look beautiful when shared on social media.
3. **Performance Audit:**
   - Ensure all images are optimized via Next.js `<Image>` component.
   - Leverage Supabase caching and lazy loading for data-heavy pages.
4. **Deployment:**
   - Connect the GitHub repository to **Cloudflare Pages**.
   - Set environment variables (Supabase URL, Anon Key) in the Cloudflare dashboard.
   - Configure custom domain for the final launch.
