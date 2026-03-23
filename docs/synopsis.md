# Project Synopsis
## Event Management System

**Submitted To:** Department of Computer Science & Engineering  
**Institution:** IILM University, Greater Noida  
**Programme:** B.Tech Computer Science & Engineering  
**Semester:** VI (6th Semester)  
**Milestone:** 1 — Project Synopsis  
**Date:** March 2026

---

## 1. Project Title

**EventHub — A Centralized Web-Based Event Management System**

---

## 2. Team Details

| Member | Role | Responsibilities |
|--------|------|-----------------|
| Member 1 | Project Manager & Backend Developer | API development, Database, Authentication, Deployment |
| Member 2 | Frontend Developer | React UI, Components, API Integration, Responsive Design |
| Member 3 | UI/UX Designer & DB Admin | Figma wireframes, DB schema, QA, Documentation |

**Mentor/Guide:** *(Faculty Name)*  
**Department:** Computer Science & Engineering  

---

## 3. Abstract

Event planning in academic and corporate environments typically relies on a fragmented combination of spreadsheets, email chains, and paper-based forms. This fragmentation results in miscommunication, missed deadlines, and poor attendee experience. This project proposes **EventHub**, a full-stack web application that centralizes the entire event lifecycle — from creation and registration to real-time analytics and QR-code-based check-in.

The system will be built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js), implementing JWT-based role authentication for three user types: Admin, Organizer, and Attendee. The platform aims to reduce manual coordination overhead by at least 50% and provide a seamless, mobile-responsive experience.

---

## 4. Problem Statement

Current event management processes suffer from:

- **Fragmentation:** Organizers use 5+ disconnected tools (Google Sheets, WhatsApp, Email, physical forms)
- **Manual overhead:** Registration confirmation, attendee tracking, and reminders are done manually
- **No real-time visibility:** Organizers have no live dashboard for registrations or capacity management  
- **Poor attendee UX:** Complex registration processes, lost confirmation emails, unclear schedules
- **No centralized data:** Post-event analytics require manual compilation

**Target Users:**
1. **Event Organizers** (university clubs, corporate event managers) — need to plan, publish, and monitor events
2. **Attendees** (students, professionals) — need hassle-free registration and event information
3. **Admins** — need system-level visibility and control across all events and users

---

## 5. Objectives

1. Build a centralized web platform for end-to-end event management
2. Implement role-based access control for Admin, Organizer, and Attendee
3. Develop a real-time registration system with capacity management
4. Generate QR code tickets for event check-in
5. Send automated email notifications for registrations and reminders
6. Provide an admin dashboard with live analytics and CSV/PDF export
7. Ensure mobile-responsive design accessible across devices
8. Deploy a production-ready system within an 8-week timeline

---

## 6. Scope of the Project

### In Scope ✓
- User registration, login, and JWT-based authentication
- Role-based access: Admin, Organizer, Attendee
- Event creation, editing, publishing, and deletion (CRUD)
- Event categorization: Conference, Workshop, Seminar, Festival
- Event status lifecycle: Draft → Published → Ongoing → Completed
- Online registration with ticket types: Free, Paid, VIP
- QR code ticket generation per registration
- Confirmation emails via NodeMailer
- Event schedule/agenda management with speaker profiles
- Admin dashboard with registration analytics
- Export functionality (CSV/PDF)
- Mobile-responsive web interface

### Out of Scope ✗
- Payment gateway integration (planned for future version)
- Native mobile apps (iOS/Android)
- Live video streaming
- Social media integration
- AI-based recommendations
- SMS notifications
- Multi-language support

---

## 7. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js 18 | Single-page application UI |
| **Routing** | React Router v6 | Client-side navigation |
| **HTTP Client** | Axios | API communication |
| **Styling** | Tailwind CSS | Responsive utility-first styling |
| **Backend** | Node.js + Express.js | REST API server |
| **Authentication** | JWT + Bcrypt | Secure token-based auth |
| **Database** | MongoDB + Mongoose | NoSQL data store and ODM |
| **Email** | NodeMailer | Transactional email notifications |
| **QR Code** | qrcode.js | Ticket QR generation |
| **File Storage** | Cloudinary | Event banner/image uploads |
| **PDF** | PDFKit | Attendee list export |
| **Hosting** | Vercel + Render | Frontend + backend deployment |
| **Version Control** | GitHub | Source code management |

---

## 8. System Architecture

The system follows a classic **3-tier architecture**:

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                       │
│   React.js SPA  ·  React Router  ·  Axios           │
└────────────────────────┬────────────────────────────┘
                         │ HTTP/JSON (REST)
┌────────────────────────▼────────────────────────────┐
│                   API LAYER                          │
│   Express.js  ·  JWT Auth  ·  Middleware             │
│   Routes: /auth  /events  /registrations  /admin    │
└────────────────────────┬────────────────────────────┘
                         │ Mongoose ODM
┌────────────────────────▼────────────────────────────┐
│                  DATABASE LAYER                      │
│   MongoDB  ·  Collections: users, events,            │
│   registrations                                      │
└─────────────────────────────────────────────────────┘
          │              │              │
    NodeMailer        QRCode.js     Cloudinary
   (Email Service)   (QR Tickets)  (File Storage)
```

**API Endpoints Summary:**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login, get JWT |
| GET | /api/auth/me | Auth | Get own profile |
| GET | /api/events | Public | List published events |
| POST | /api/events | Organizer | Create event |
| PATCH | /api/events/:id | Organizer | Update event |
| DELETE | /api/events/:id | Organizer | Delete event |
| POST | /api/registrations | Attendee | Register for event |
| GET | /api/registrations/my | Auth | My registrations |
| PATCH | /api/registrations/:id/cancel | Auth | Cancel registration |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | All users |

---

## 9. Database Design

Three primary MongoDB collections:

**users** — name, email, hashed password, role, phone, isActive  
**events** — title, description, date, venue, capacity, category, status, organizer (ref: User), sessions (embedded), tags  
**registrations** — user (ref: User), event (ref: Event), ticketType, qrCode, status, checkInTime  

Key constraint: Compound unique index on `{ user, event }` in registrations to prevent duplicate sign-ups.

---

## 10. Methodology

The project follows an **Agile-inspired iterative development** approach with 4 milestones over 8 weeks:

| Milestone | Weeks | Focus | Key Deliverables |
|-----------|-------|-------|-----------------|
| M1 | 1–2 | Planning | Problem scope, architecture, Gantt chart, this synopsis |
| M2 | 3–4 | Design | Figma wireframes, DB schema, API design, frontend prototype |
| M3 | 5–6 | Build | Auth system, Event CRUD, Registration system, Admin dashboard |
| M4 | 7–8 | Deploy | Integration testing, bug fixes, deployment, final documentation |

**Development practices:**
- Git-based version control with feature branches
- Weekly team standups and code reviews
- Modular component-based frontend architecture
- RESTful API design with consistent JSON responses

---

## 11. Expected Outcomes

1. A fully functional web application accessible via browser on desktop and mobile
2. Three-role system (Admin, Organizer, Attendee) with distinct dashboards
3. Complete event lifecycle management from creation to post-event analytics
4. QR-code-based ticket generation and check-in system
5. Automated email notifications for registrations and reminders
6. PDF/CSV export of attendee data for organizers
7. Deployed system on free cloud hosting (Vercel + Render)
8. Final project report and demo video

---

## 12. Risk Analysis

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Tight 8-week timeline | High | High | MVP-first approach, no scope creep |
| Small team (3 members) | Medium | High | Clear role separation, parallel development |
| Technical complexity (QR, email) | Medium | Medium | Use established libraries, early prototyping |
| Scope creep | Medium | Medium | Strict scope document, change approval process |
| Team availability | High | Low | Knowledge sharing, comprehensive documentation |

---

## 13. References

1. MongoDB Official Documentation — https://www.mongodb.com/docs
2. React.js Official Documentation — https://react.dev
3. Express.js Official Documentation — https://expressjs.com
4. JWT Introduction — https://jwt.io/introduction
5. NodeMailer Documentation — https://nodemailer.com
6. QRCode.js Library — https://github.com/soldair/node-qrcode
7. MERN Stack Best Practices — MongoDB University
8. REST API Design Guidelines — RESTful Web Services (O'Reilly)
9. Tailwind CSS Documentation — https://tailwindcss.com/docs

---

**Synopsis Submitted By:** Team — Event Management System  
**Institution:** IILM University, Greater Noida  
**Department:** Computer Science & Engineering  
**Date:** March 2026  

---
*This synopsis is prepared as part of the B.Tech VI Semester Project requirements.*
