# Smart Leads Dashboard

A production-quality CRM dashboard for lead management. Built with the MERN stack and TypeScript throughout.

## Tech Stack

**Frontend:** React 18, Vite, TypeScript, TailwindCSS, TanStack Query v5, React Hook Form, Zod, Axios  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt  
**DevOps:** Docker, Docker Compose, Nginx

## Features

- JWT authentication with role-based access (Admin / Sales)
- Full leads CRUD — create, read, update, delete
- Advanced filtering: status, source, search (debounced), sort
- Server-side pagination (10 per page) with metadata
- CSV export
- Dark mode support
- Responsive design

## Project Structure

```
smart-leads/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, env
│   │   ├── controllers/     # Request handlers
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helpers, AppError, JWT
│   │   ├── validators/      # Zod schemas
│   │   ├── app.ts
│   │   └── server.ts
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance + API functions
│   │   ├── components/      # UI, layout, leads, dashboard
│   │   ├── context/         # Auth + Theme context
│   │   ├── hooks/           # TanStack Query hooks
│   │   ├── layouts/         # Dashboard + Auth layouts
│   │   ├── pages/           # Route-level pages
│   │   ├── routes/          # React Router + guards
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helpers
│   └── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Local Development

**1. Clone and install**
```bash
git clone <repo>

cd backend && npm install
cd ../frontend && npm install
```

**2. Configure environment**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

**3. Start services**
```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

App runs at `http://localhost:5173`

### Docker

```bash
# Build and start all services
docker compose up --build

# Stop
docker compose down
```

App runs at `http://localhost`

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `BCRYPT_ROUNDS` | Password hash rounds | `12` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/profile` | Bearer | Get own profile |
| GET | `/api/auth/users` | Admin | List all users |

### Leads

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/leads` | Bearer | List leads (paginated) |
| POST | `/api/leads` | Bearer | Create lead |
| GET | `/api/leads/stats` | Bearer | Get lead statistics |
| GET | `/api/leads/export` | Bearer | Download CSV |
| GET | `/api/leads/:id` | Bearer | Get single lead |
| PUT | `/api/leads/:id` | Bearer | Update lead |
| DELETE | `/api/leads/:id` | Bearer | Delete lead |

### Query Parameters (GET /api/leads)

| Param | Values | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Per page (default: 10) |
| `status` | New, Contacted, Qualified, Lost | Filter by status |
| `source` | Website, Instagram, Referral | Filter by source |
| `search` | string | Search name or email |
| `sort` | latest, oldest | Sort order |

### API Response Format

```json
{
  "success": true,
  "message": "Leads fetched",
  "data": {
    "items": [...],
    "pagination": {
      "total": 42,
      "totalPages": 5,
      "currentPage": 1,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 10
    }
  }
}
```

## Roles

| Action | Admin | Sales |
|---|---|---|
| View all leads | ✅ | ❌ (own only) |
| Create lead | ✅ | ✅ |
| Update any lead | ✅ | ❌ (own only) |
| Delete any lead | ✅ | ❌ (own only) |
| View all users | ✅ | ❌ |

## Suggested Git Commits

```
feat: initialise monorepo with backend and frontend scaffolding
feat(backend): add mongoose User and Lead models with indexes
feat(backend): implement JWT auth service with bcrypt hashing
feat(backend): add lead service with pagination and multi-filter support
feat(backend): add CSV export endpoint
feat(backend): configure helmet, cors, rate limiting, morgan middleware
feat(frontend): set up Vite + React + TailwindCSS with path aliases
feat(frontend): implement auth context and TanStack Query hooks
feat(frontend): build lead table with skeleton loading and row actions
feat(frontend): add debounced search and combined filter controls
feat(frontend): implement dark mode with ThemeContext
feat(frontend): add pagination component with ellipsis logic
feat(frontend): add CSV export with client-side download
feat(docker): add Dockerfiles and docker-compose for all services
docs: add README with API reference and setup guide
```

## Deployment

### Railway / Render
1. Push to GitHub
2. Create backend service → set env vars → deploy
3. Create frontend service → set `VITE_API_URL` → deploy
4. Add MongoDB Atlas connection string to backend

### Manual VPS
```bash
docker compose -f docker-compose.yml up -d --build
```
