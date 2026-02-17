# Incident Tracker Mini App

A full-stack web application to create, view, search, filter, sort, and update production incidents. Built as a demonstration of modern web development skills for internship selection.

---

## 🚀 Tech Stack

### Frontend
- **React** (Vite) - Modern React build tool
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma ORM** - Database toolkit
- **UUID** - Unique ID generation

### Database
- **SQLite** - Lightweight SQL database

---

## 📋 Features

### Backend API
- ✅ **POST /api/incidents** - Create new incident
- ✅ **GET /api/incidents** - List all incidents with:
  - Server-side pagination (page, limit)
  - Search by title and service
  - Filter by severity and status
  - Sort by createdAt, severity, or title
- ✅ **GET /api/incidents/:id** - Fetch single incident
- ✅ **PATCH /api/incidents/:id** - Update incident (status, owner, summary)
- ✅ Input validation and error handling
- ✅ CORS and JSON middleware enabled

### Frontend
- ✅ **Incident List** - Paginated table view with:
  - Search functionality
  - Severity filter dropdown
  - Status filter dropdown
  - Next/Previous pagination
  - "Create Incident" button
- ✅ **Create Incident** - Form with:
  - Required: title, service, severity, status
  - Optional: owner, summary
  - Redirect to list after success
- ✅ **Incident Detail** - View and update:
  - All incident fields displayed
  - Update status, owner, summary
  - Success/error notifications
- ✅ **Routing** - React Router with routes:
  - `/` → Incident List
  - `/create` → Create Incident
  - `/incident/:id` → Incident Detail

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database with 200 dummy incidents
node seed.js

# Start the server
node server.js
```

The backend will run on: **http://localhost:5000**

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on: **http://localhost:5173**

---

## 📁 Project Structure

```
incident-tracker-mini-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── dev.db           # SQLite database
│   ├── server.js            # Express server
│   ├── seed.js              # Database seeder
│   ├── package.json
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api.js           # API functions
│   │   ├── App.jsx          # Main app with routing
│   │   ├── App.css         # Global styles
│   │   ├── main.jsx        # React entry point
│   │   ├── components/
│   │   │   └── IncidentTable.jsx
│   │   └── pages/
│   │       ├── IncidentList.jsx
│   │       ├── CreateIncident.jsx
│   │       └── IncidentDetail.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🔗 API Documentation

### Base URL
```
http://localhost:5000/api/incidents
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a new incident |
| GET | `/` | Get all incidents (with pagination/filters) |
| GET | `/:id` | Get single incident by ID |
| PATCH | `/:id` | Update incident |

### Query Parameters (GET /)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| search | string | "" | Search in title and service |
| severity | string | "" | Filter by severity |
| status | string | "" | Filter by status |
| sortBy | string | "createdAt" | Sort field |
| order | string | "desc" | Sort order (asc/desc) |

### Response Format

```json
{
  "data": [...incidents],
  "total": 200,
  "page": 1,
  "pages": 20
}
```

### Incident Object

```json
{
  "id": "uuid",
  "title": "string",
  "service": "string",
  "severity": "SEV1 | SEV2 | SEV3 | SEV4",
  "status": "OPEN | MITIGATED | RESOLVED",
  "owner": "string | null",
  "summary": "string | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 🎯 How to Use

1. **Start the backend** - Run `node server.js` in the backend folder
2. **Start the frontend** - Run `npm run dev` in the frontend folder
3. **Open browser** - Go to http://localhost:5173
4. **Use the app:**
   - View the list of incidents
   - Search and filter incidents
   - Create new incidents
   - View incident details
   - Update incident status/owner/summary

---

## 👤 Author

Ayush Kumar

