# Dee's Pen House Storytelling and creative agency: Screens Blueprint

This document outlines the required screens for the Dee's Pen House Storytelling and creative agency website, split between the public-facing client experience and the private Admin CMS.

## 🌐 Public-Facing Screens (The Client Experience)

### 1. The Homepage (`/`)
- **Description:** The "Grand Entrance." A visually striking Hero section introducing the author and "Dee's Pen House Storytelling and creative agency." It acts as a funnel, with elegant teasers pointing visitors toward her latest book on the shelf, her newest article, and a brief overview of her services.

### 2. The Dee's Pen Shelf (`/shelf`)
- **Description:** A gorgeous, interactive visual grid displaying her books and creative projects. Designed to feel like a high-end digital library or boutique display. Includes smooth hover animations on book covers.

### 3. Shelf Item Detail (`/shelf/[slug]`)
- **Description:** The detail view when a user clicks a specific book or project. Features a large, high-resolution cover image, an engaging synopsis, and clear Call-To-Action (CTA) buttons (e.g., "Buy on Amazon," "Read Excerpt").

### 4. Blog & Articles Hub (`/blog`)
- **Description:** A clean, masonry or list-style layout showcasing published articles. Features thumbnail images, catchy titles, reading time estimates, and short excerpts.

### 5. Article Reading View (`/blog/[slug]`)
- **Description:** The reading page. Heavily focused on typography (font size, line height, contrast) to ensure a premium, distraction-free reading experience akin to high-end editorial magazines.

### 6. Services Showcase (`/services`)
- **Description:** A dedicated page breaking down her expertise: *Ghostwriting, Content Writing, and Brand Storytelling*. Explains her process, target audience, and features strong CTAs leading to the Contact form.

### 7. Contact & Inquiries (`/contact`)
- **Description:** A standalone, beautifully styled contact page. Includes her professional email, social links, and an inquiry form that feels secure and prestigious.

---

## 🔒 Admin Dashboard Screens (The CMS Experience)
*Note: All routes in this section are protected by Supabase Authentication.*

### 8. Admin Login (`/admin/login`)
- **Description:** An extremely minimal, secure login page. Acts as a simple email/password or magic link gateway.

### 9. Dashboard Overview (`/admin`)
- **Description:** The "Control Center." Provides a quick summary upon login (e.g., "You have 2 new inquiries", "You have 5 books on the shelf") and offers quick-action buttons to write a new blog or add a new book.

### 10. Global Settings (`/admin/settings`)
- **Description:** The configuration page to upload/change the **Brand Logo**, update global social media links, and edit the main contact email.

### 11. Dee's Pen Shelf Manager (`/admin/shelf`)
- **Description:** A list/grid view of all existing books and projects with options to edit, hide, or delete them.

### 12. Shelf Item Editor (`/admin/shelf/new` & `/admin/shelf/edit/[id]`)
- **Description:** A form page allowing the upload of a book cover directly to Supabase storage, alongside inputs for title, synopsis, and external purchase links.

### 13. Blog Manager (`/admin/blogs`)
- **Description:** A dashboard tailored for managing articles, clearly differentiating between "Draft" and "Published" statuses.

### 14. Rich-Text Blog Editor (`/admin/blogs/new` & `/admin/blogs/edit/[id]`)
- **Description:** A critical screen featuring a WYSIWYG (What You See Is What You Get) rich-text editor, enabling text formatting, header creation, and image embedding without writing code.

### 15. Services Manager (`/admin/services`)
- **Description:** A straightforward interface to tweak the titles and descriptions of the Ghostwriting, Content Writing, and Storytelling services.

### 16. Inquiry Inbox (`/admin/inquiries`)
- **Description:** A secure list view displaying all messages submitted through the public `/contact` form, allowing easy reading and management without relying on external email clients.
