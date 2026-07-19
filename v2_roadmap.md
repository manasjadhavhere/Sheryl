# Sheryl Pharmaceuticals — Version 2 (v2) Roadmap & Architecture Reference

This document outlines the planned Phase 2 (v2) architecture and features for **Sheryl Pharmaceuticals**. While Phase 1 (v1) delivers an authoritative, beautifully designed, human-crafted static website with live EmailJS lead capture (`Careers` and `Contact Us`), v2 introduces a robust, secure, dynamic backend management system and advanced features.

---

## 1. Executive Summary & Goals for v2

The core objective of v2 is to transition Sheryl Pharmaceuticals from a static presentation layer into a dynamic content ecosystem where internal stakeholders (Product Managers, HR, Content Editors) can manage product catalogs, job postings, news articles, and inbound applications without touching source code.

---

## 2. Admin Backend & Product Management API

### Technology Stack (Proposed)
- **Runtime Environment:** Node.js + Express.js (or Next.js API Routes / Server Actions if transitioning frontend to Next.js).
- **Database:** PostgreSQL (via Prisma ORM or Drizzle) or MongoDB (via Mongoose) for flexible product schemas and application storage.
- **Authentication & Security:** JWT-based session management, Role-Based Access Control (RBAC), bcrypt password hashing, and rate limiting against brute-force attacks.
- **File & Media Storage:** AWS S3 or Cloudflare R2 for secure, scalable storage of product images, COA (Certificate of Analysis) PDF documents, and applicant resumes.

### Key Backend Modules
1. **Product Management (CRUD Catalog):**
   - **Create / Update / Delete Products:** Manage product names, therapeutic categories, dosage forms, compositions, indications, and packaging specifications.
   - **Regulatory Documentation Upload:** Attach batch-specific or general Certificates of Analysis (COAs), GMP certificates, and safety sheets directly to product entries.
   - **Status Toggling:** Mark products as *Featured*, *Export Ready*, *Institutional Only*, or *Pipeline*.

2. **Careers & Applicant Tracking System (ATS Lite):**
   - **Job Postings Management:** Publish, edit, and close job openings dynamically on the `careers.html` page.
   - **Application Dashboard:** Review submitted applications (`Full Name`, `Email`, `Contact No`, `Position`, `Start Date`, `Employment Status`), download stored resumes securely, and assign candidacy statuses (*Received*, *Under Review*, *Interviewing*, *Offered*, *Archived*).

3. **News & Insights Editorial System:**
   - **CMS Dashboard:** Write, preview, and publish corporate press releases, product launch announcements, and medical insights using a rich-text or Markdown editor.

---

## 3. Dynamic Frontend Enhancements

### 3.1 Live Portfolio & Product Filtering
- Replace static HTML grids with dynamic REST API fetches (`GET /api/v1/products`).
- Implement instant client-side or server-side filtering by **Therapeutic Segment** (e.g., *Women's Health*, *Anti-Infectives*, *Gastroenterology*, *Bone & Joint*), **Dosage Form** (*Tablets*, *Injectables*, *Syrups*), and **Market Availability**.
- Add real-time search functionality with predictive autocomplete.

### 3.2 Secure Resume Upload & Cloud Storage
- Transition the v1 resume upload simulation (`careers-apply.html`) to direct, signed multipart uploads to AWS S3 / Cloudflare R2 via backend pre-signed URLs.
- Automated virus/malware scanning on uploaded documents (`.pdf`, `.doc`, `.docx`).

### 3.3 Interactive Distribution & Global Presence Map
- An interactive, vector-based world map illustrating Sheryl Pharmaceuticals' active export markets, distributor nodes, and manufacturing partners across South East Asia, Middle East, and Africa.

---

## 4. Security & Compliance Roadmap

- **Data Privacy Compliance:** GDPR / DPDPA (Digital Personal Data Protection Act, India) compliance for handling applicant resumes and healthcare inquiries.
- **Audit Logging:** Comprehensive admin activity logs tracking who created, updated, or deleted product listings and regulatory files.
- **Automated Backup & Disaster Recovery:** Daily automated database snapshots and multi-region backup for cloud storage buckets.

---

## 5. Migration & Deployment Strategy

1. **Step 1 — Backend Foundation:** Deploy Node.js API and database schema to staging (e.g., AWS ECS, Render, or Railway).
2. **Step 2 — Admin Portal Development:** Build clean, responsive admin interface (`/admin`) using React / Tailwind CSS.
3. **Step 3 — Frontend API Integration:** Connect the static HTML/CSS frontend to live endpoints with fallback static caching for optimal SEO and performance.
4. **Step 4 — Production Cutover:** Point production domain to CDN/edge cache with dynamic proxy routing to backend APIs.
