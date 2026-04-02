# Product Requirements Document (PRD): Dee's Pen House Storytelling and creative agency Website

## 1. Project Overview
- **Brand Name**: Dee's Pen House Storytelling and creative agency
- **Client Profile**: Author & Professional Writer (Books, Articles, Ghostwriting, Brand Storytelling)
- **Project Value**: Premium Tier ($5,000) - Requires exceptional, high-end aesthetics and flawless user experience.
- **Tech Stack**: 
  - Frontend: React-based Framework (e.g., Next.js or Vite) with Tailwind CSS v4 and shadcn/ui
  - Backend/Database: Supabase 
  - Hosting/Infrastructure: Cloudflare

## 2. Core Objectives
- **Premium Aesthetics**: Deliver a visually stunning, dynamic website with modern design practices (e.g., smooth gradients, micro-animations, premium typography) reflecting the $5,000 budget.
- **Complete Content Control (CMS)**: A robust, bespoke Admin Dashboard allowing the client to modify *all* website content, ensuring independence from the developer post-launch.
- **Seamless User Journey**: Intuitive navigation for visitors to buy books, read blogs, explore services, and contact the author.

---

## 3. Scope & Features

### 3.1. Public-Facing Website (Frontend)
The user-facing website must feel responsive, "alive", and elegant.

- **Dynamic Homepage**
  - High-impact hero section with stunning typography and possibly a subtle background animation.
  - Quick summary of the author and navigation to other core sections.
- **"Dee's Pen Shelf" (Books & Projects)**
  - A beautiful, interactive gallery or "shelf" UI showcasing books and past projects.
  - Each item will have high-quality cover images, synopses, and Call-to-Action (CTA) links (e.g., "Buy on Amazon", "Read More").
- **Blog & Articles Hub**
  - A dedicated reading zone for the client's articles.
  - Clean, distraction-free reading layout with proper typography scaling and SEO-friendly routing.
- **Services Section**
  - Elegant presentation of the client's core offerings: Ghostwriting, Content Writing, and Brand Storytelling.
- **Contact & Inquiry Section**
  - A premium, interactive contact form handling project inquiries and general messages.

### 3.2. Custom Admin Dashboard (Backend CMS)
Secured via Supabase Authentication (Admin-only access).

- **Global Site Configuration**
  - Upload/Update Brand Logo.
  - Modify global contact information (email, social media links).
- **Dee's Pen Shelf Manager**
  - CRUD (Create, Read, Update, Delete) operations for Books and Projects.
  - Image upload capabilities for book covers via Supabase Storage.
- **Blog Engine / CMS**
  - Full WYSIWYG / Rich-Text Editor to write, format, and publish articles.
  - Draft vs. Published status toggling.
- **Services Manager**
  - Ability to edit service titles, descriptions, and pricing/details.
- **Inquiry Inbox**
  - A secure view of all submissions sent through the frontend Contact Form.

---

## 4. Technical & Non-Functional Requirements
- **Design Specifications**:
  - Utilize Tailwind CSS v4 and shadcn/ui, heavily customizing the default themes to avoid generic styling and ensure a bespoke, premium feel.
  - Use curated color palettes, glassmorphism (if applicable), and modern web fonts (e.g., Inter, Outfit).
  - Micro-animations (hover states, scroll reveals) must be implemented to ensure the site feels premium.
- **SEO & Performance**:
  - Semantic HTML and structured meta-tags via Next.js/Vite Helmet.
  - Content optimized and cached globally via Cloudflare for instant loading.
- **Security**:
  - Supabase database isolated with appropriate Row Level Security (RLS) policies.
  - Admin panel hidden behind strict authentication.
