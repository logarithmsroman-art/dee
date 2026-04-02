# Database Architecture (High-Level)
**Project:** Dee's Pen House Storytelling and creative agency

This document outlines the high-level Supabase database architecture, identifying key tables and their relationships based strictly on the Product Requirements Document (PRD).

## General Architecture Note
To adhere to Supabase best practices, everything hinges on the fact that only the Admin (the client) has an account to log in and manage content. There are no public user accounts. 

---

### 1. `profiles` Table
*   **Purpose:** This table acts as the bridge between the public schema data and Supabase's secure authentication system.
*   **Relationships:** 
    *   **1-to-1 relation** to Supabase’s internal `auth.users` table. When the Admin logs in via Supabase Auth, their ID securely maps to this table.

### 2. `global_settings` Table
*   **Purpose:** Powers the "Global Site Configuration" feature from the PRD. It stores the brand logo path, contact email, and social media links.
*   **Relationships:** 
    *   **Singleton pattern:** This table will essentially only ever hold one row of data. 
    *   Could have a **Many-to-1 relation** with `profiles` tracking who last updated the settings, though this is optional.

### 3. `shelf_items` Table
*   **Purpose:** Powers "Dee's Pen Shelf". This table handles both books and creative projects.
*   **Relationships:** 
    *   **Many-to-1 relation** with `profiles`. (One Admin profile can create many shelf items).

### 4. `articles` Table
*   **Purpose:** Powers the "Blog Engine / CMS". This handles all the rich-text blog posts and distinguishes between "Drafts" and "Published" articles.
*   **Relationships:**
    *   **Many-to-1 relation** with `profiles`. (One Admin profile authors many articles).

### 5. `services` Table
*   **Purpose:** Powers the "Services Showcase". This stores the specific offerings (Ghostwriting, Content Writing, Brand Storytelling) so they can be securely edited.
*   **Relationships:**
    *   **Many-to-1 relation** with `profiles`. (One Admin profile manages many services).

### 6. `inquiries` Table
*   **Purpose:** Powers the "Inquiry Inbox". This acts as a database for all messages submitted by visitors through the public Contact Form.
*   **Relationships:** 
    *   **No required relationships.** Since this data is created by anonymous public visitors on the frontend, it doesn't need to link to the `profiles` table.
