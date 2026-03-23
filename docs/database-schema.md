# Event Management System — MongoDB Schema Design
## Milestone 2 | Database Design Document

---

## Overview

The system uses **MongoDB** (NoSQL) with **Mongoose ODM**. Four core collections form the backbone of the application. Relationships are handled through ObjectId references (manual joins via `.populate()`).

---

## Collection 1: `users`

Stores all system users regardless of role.

```js
{
  _id:       ObjectId,          // auto-generated primary key
  name:      String,            // required | "Sadique Khan"
  email:     String,            // required | unique | lowercase
  password:  String,            // required | bcrypt hashed | hidden from queries
  role:      String,            // enum: ["admin","organizer","attendee"] | default: "attendee"
  phone:     String,            // optional
  avatar:    String,            // URL to profile image
  isActive:  Boolean,           // soft-delete flag | default: true
  createdAt: Date,              // auto (timestamps: true)
  updatedAt: Date               // auto (timestamps: true)
}
```

**Indexes:**
- `email` → unique index (fast login lookups)
- `role` → index (admin dashboard filtering)

---

## Collection 2: `events`

Stores all events including their embedded schedule sessions.

```js
{
  _id:         ObjectId,
  title:       String,          // required | "TechConf 2026"
  description: String,          // optional | rich text allowed
  date:        Date,            // required | event start datetime
  endDate:     Date,            // optional | event end datetime
  venue:       String,          // required | "Auditorium A, IILM University"
  capacity:    Number,          // required | min: 1
  category:    String,          // enum: ["conference","workshop","seminar","festival"]
  status:      String,          // enum: ["draft","published","ongoing","completed","cancelled"]
                                //   default: "draft"
  organizer:   ObjectId,        // ref: "User" | required
  banner:      String,          // URL to banner image (Cloudinary)
  tags:        [String],        // optional | ["AI","Tech","2026"]

  // Embedded sub-documents for session schedule
  sessions: [
    {
      _id:         ObjectId,
      title:       String,      // required | "Keynote: Future of AI"
      speaker:     String,      // "Dr. Priya Singh"
      startTime:   Date,        // required
      endTime:     Date,        // required
      location:    String,      // "Hall A" (room within venue)
      description: String
    }
  ],

  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `organizer` → index (fetch my events)
- `date + status` → compound index (browse upcoming events)
- `category` → index (filter by type)
- `title` → text index (full-text search)

---

## Collection 3: `registrations`

Tracks every attendee's registration for every event.

```js
{
  _id:         ObjectId,
  user:        ObjectId,        // ref: "User" | required
  event:       ObjectId,        // ref: "Event" | required
  ticketType:  String,          // enum: ["free","paid","vip"] | default: "free"
  qrCode:      String,          // base64 data URI of QR image
  status:      String,          // enum: ["pending","confirmed","cancelled"]
                                //   default: "pending"
  checkInTime: Date,            // null until attendee checks in at venue
  createdAt:   Date,
  updatedAt:   Date
}
```

**Indexes:**
- `{ user: 1, event: 1 }` → **unique compound index** (prevents duplicate registrations)
- `event` → index (count registrations per event fast)
- `status` → index (filter confirmed/cancelled)

---

## Collection 4: `sessions` *(optional separate collection for scale)*

> **Note:** Sessions are embedded inside `events.sessions[]` for MVP (simpler queries).
> For large-scale events with 100+ sessions, extract them into a separate collection:

```js
{
  _id:         ObjectId,
  event:       ObjectId,        // ref: "Event"
  title:       String,
  speaker:     String,
  startTime:   Date,
  endTime:     Date,
  location:    String,
  description: String,
  createdAt:   Date
}
```

**Decision for Milestone 3:** Keep sessions embedded unless a single event exceeds 15–20 sessions.

---

## Entity Relationship Diagram (ERD)

```
┌──────────────────┐         ┌──────────────────────┐
│      users       │         │        events         │
│──────────────────│         │──────────────────────│
│ _id (PK)         │         │ _id (PK)              │
│ name             │ 1     * │ title                 │
│ email (unique)   │─────────│ organizer → users._id │
│ password (hash)  │         │ date / endDate        │
│ role             │         │ venue / capacity      │
│ phone            │         │ category / status     │
│ isActive         │         │ sessions[] (embedded) │
└──────────────────┘         │ banner / tags         │
         │                   └──────────────────────┘
         │                              │
         │ 1                            │ 1
         │                              │
         │ *                            │ *
         ▼                              ▼
┌──────────────────────────────────────────────────┐
│                  registrations                    │
│──────────────────────────────────────────────────│
│ _id (PK)                                          │
│ user   → users._id                                │
│ event  → events._id                               │
│ ticketType (free/paid/vip)                        │
│ qrCode (base64)                                   │
│ status (pending/confirmed/cancelled)              │
│ checkInTime                                       │
│ UNIQUE INDEX on (user + event)                    │
└──────────────────────────────────────────────────┘
```

---

## Sample Documents

### Sample User
```json
{
  "_id": "65a1b2c3d4e5f6789abc0001",
  "name": "Sadique Khan",
  "email": "sadique@iilm.ac.in",
  "password": "$2b$12$hashed...",
  "role": "organizer",
  "phone": "+91-9876543210",
  "isActive": true,
  "createdAt": "2026-02-01T10:00:00Z"
}
```

### Sample Event
```json
{
  "_id": "65a1b2c3d4e5f6789abc0010",
  "title": "TechConf 2026",
  "description": "Annual technology conference at IILM University.",
  "date": "2026-04-10T09:00:00Z",
  "endDate": "2026-04-10T18:00:00Z",
  "venue": "Auditorium A, IILM Greater Noida",
  "capacity": 300,
  "category": "conference",
  "status": "published",
  "organizer": "65a1b2c3d4e5f6789abc0001",
  "tags": ["tech", "AI", "2026"],
  "sessions": [
    {
      "_id": "65a1b2c3d4e5f6789abc0020",
      "title": "Keynote: Future of AI",
      "speaker": "Dr. Priya Verma",
      "startTime": "2026-04-10T10:00:00Z",
      "endTime": "2026-04-10T11:00:00Z",
      "location": "Main Stage"
    }
  ],
  "createdAt": "2026-03-01T08:00:00Z"
}
```

### Sample Registration
```json
{
  "_id": "65a1b2c3d4e5f6789abc0030",
  "user": "65a1b2c3d4e5f6789abc0002",
  "event": "65a1b2c3d4e5f6789abc0010",
  "ticketType": "paid",
  "qrCode": "data:image/png;base64,iVBOR...",
  "status": "confirmed",
  "checkInTime": null,
  "createdAt": "2026-03-20T14:22:00Z"
}
```

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Database type | MongoDB (NoSQL) | Flexible schema, good for varied event structures |
| Relationships | ObjectId refs | Avoids deep nesting; allows independent querying |
| Sessions | Embedded in Event | MVP simplicity; avoids extra collection joins |
| Password storage | bcrypt (12 rounds) | Industry-standard hashing |
| QR Code storage | Base64 in DB | Simple for MVP; move to Cloudinary in M4 |
| Unique registration | Compound index | Database-level duplicate prevention |
| Soft delete | `isActive` flag | Preserves audit trail for users |

---

**Document Version:** 1.0  
**Milestone:** 2  
**Last Updated:** March 23, 2026
