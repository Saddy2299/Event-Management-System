# ⬡ EventHub — Event Management System

A full-stack web application for managing events, registrations, and attendees.  
Built with the **MERN Stack**: MongoDB · Express · React · Node.js

---

## 📁 Project Structure

```
event-management-system/
├── client/                   ← React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js            ← Main UI (Dashboard, Events, Registrations)
│   │   └── index.js          ← React entry point
│   └── package.json
│
├── server/                   ← Express Backend
│   ├── server.js             ← Full REST API
│   ├── .env.example          ← Copy to .env and fill values
│   └── package.json
│
├── docs/
│   ├── database-schema.md    ← MongoDB schema design
│   ├── openapi.yaml          ← API documentation (Swagger)
│   └── synopsis.md           ← Project synopsis
│
├── .gitignore
└── README.md
```

---Updated2.0

## ⚡ Quick Start (Run Locally)

### 1. Install Node.js
Download from **https://nodejs.org** (choose LTS version)

### 2. Install MongoDB
Download from **https://www.mongodb.com/try/download/community**  
After install, it starts automatically on Windows. On Mac: `brew services start mongodb-community`

### 3. Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set your values (at minimum, `MONGO_URI` and `JWT_SECRET`).

Then start the backend:
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
```

### 4. Setup Frontend

Open a **new terminal**:

```bash
cd client
npm install
npm start
```

Browser will open at **http://localhost:3000** ✅

---

## 🔑 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login, get JWT |
| GET | /api/auth/me | Auth | Get own profile |
| GET | /api/events | Public | List events |
| POST | /api/events | Organizer | Create event |
| PATCH | /api/events/:id | Organizer | Update event |
| DELETE | /api/events/:id | Organizer | Delete event |
| POST | /api/registrations | Attendee | Register for event |
| GET | /api/registrations/my | Auth | My registrations |
| PATCH | /api/registrations/:id/cancel | Auth | Cancel registration |
| GET | /api/admin/stats | Admin | Dashboard stats |

Full API docs: import `docs/openapi.yaml` into **https://editor.swagger.io**

---

## 🚀 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel (free) | vercel.com |
| Backend | Render (free) | render.com |
| Database | MongoDB Atlas (free) | mongodb.com/cloud/atlas |

---

## 👥 Team

| Member | Role |
|--------|------|
| Member 1 | Project Manager & Backend Developer |
| Member 2 | Frontend Developer |
| Member 3 | UI/UX Designer & DB Admin |

**Institution:** IILM University, Greater Noida  
**Programme:** B.Tech CSE, VI Semester  
**Milestone:** 2 — Design & Prototype
