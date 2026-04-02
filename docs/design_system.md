# Design System & Component Architecture
**Project:** Dee's Pen House Storytelling and creative agency

## 🎨 1. The Design System (Visual Identity & CSS Tokens)

To match the premium, $5,000-tier expectations, the aesthetic will be editorial, highly elegant, and immersive. We will use **Tailwind CSS v4** coupled with **shadcn/ui** for highly customizable, accessible, and premium UI components.

### Typography
*   **Headings (The "Story" Font):** A refined, modern serif font (e.g., *Playfair Display*, *Lora*, or *Cormorant Garamond*). Used sparingly for large, dramatic homepage headers and blog titles to give a literary, published feel.
*   **Body & UI (The "Clean" Font):** A highly legible, premium sans-serif (e.g., *Inter*, *Outfit*, or *DM Sans*). Ensures the Admin Dashboard and long-form articles remain easy to read.

### Color Palette
*   **Backgrounds:** Instead of stark white, we will use an elegant cream/off-white (`#FCFBF9`) for the main public site, giving it a high-grade paper look.
*   **Text & Contrast:** Deep charcoal or ink blue (`#1A1A1D`) instead of harsh black.
*   **Accents & CTAs:** A sophisticated champagne gold (`#D4AF37`) or a muted terracotta. 
*   **Admin Dashboard:** An ultra-sleek, distraction-free "Dark Mode" (dark slate backgrounds with glassmorphic panels) to differentiate the creator space from the public space.

### Micro-Animations & Effects
*   **Hover states:** "Dee's Pen Shelf" items will elevate smoothly (`transform: translateY(-4px)`) with a soft, diffused drop-shadow. 
*   **Page Transitions:** Soft fade-ins when navigating between pages.
*   **Glassmorphism:** Frosted glass effects on the fixed navigation bar and the Admin dashboard sidebar.

---

## 🧱 2. The Component System Architecture

By breaking the ASCII screens down, we can build reusable building blocks (components) that keep our code perfectly DRY (Don't Repeat Yourself).

### 🟢 Atoms (The smallest building blocks)
*   **`Typography`**: Reusable text components applying our Tailwind utility classes.
*   **`Button`**: 
    *   *Primary* (Solid accent, for "Hire Me" or "Send Inquiry")
    *   *Secondary* (Outline, for "Read More")
    *   *Ghost* (No background, for text links)
    *   *Danger* (Red, for deleting items in the Admin panel)
*   **`Input` / `TextArea`**: Styled form fields with floating labels for the Contact and Admin screens.
*   **`Badge`**: Small tags to indicate if an Admin blog is a "Draft" or "Published".

### 🔵 Molecules (Combining Atoms)
*   **`ProjectCard` / `BookCard`**: Used on the **Dee's Pen Shelf**. Combines a Cover Image, a Title `Typography`, and a Secondary `Button`.
*   **`ArticleTeaser`**: Used on the **Blog Index**. Combines a thumbnail image, date, title, and a short excerpt.
*   **`FormField`**: Combines a Label, an `Input`, and an error validation message.
*   **`SectionHeader`**: A standardized title and underline/accent used at the top of the Services, Contact, and Shelf pages.

### 🟣 Organisms (Complex, layout-defining components)
*   **Public Organisms:**
    *   **`GlobalNavbar`**: Fixed top navigation with a glassmorphism blur, switching to a mobile hamburger menu on small screens.
    *   **`HeroSection`**: The dramatic entrance on the Homepage.
    *   **`ShelfGrid`**: The CSS Grid container that fluidly renders all the project/book cards.
    *   **`ContactForm`**: The full interactive form mapped to the Supabase backend.
*   **Admin Organisms:**
    *   **`AdminSidebar`**: The left-side navigation for the CMS (Dashboard, Settings, Shelf, Blogs, Inquiries).
    *   **`DataTable`**: A standardized, highly styled table to list Inquiries, Books, and Blogs. Includes pagination and inline action buttons.
    *   **`RichTextEditor`**: The complex writing tool for the Blog Manager allowing visual text formatting.
