# Frontend Development Plan for Patient Management System

## 1. Project Overview

A simple, modern Single Page Application (SPA) to interact with the backend microservices through the API Gateway. The frontend will handle user authentication, patient management, and visualize basic analytics.

## 2. Tech Stack Recommendation

- **Framework:** React + Vite (Fast, standard for simple SPAs)
- **Language:** TypeScript (Type safety matching backend DTOs)
- **Styling:** Tailwind CSS + ShadcnUI (Rapid UI development with accessible components)
- **State Management:** TanStack Query (React Query) (Excellent for server state/caching)
- **Routing:** React Router v6
- **HTTP Client:** Axios (Interceptors for JWT handling)
- **Build/Deploy:** Docker + Nginx (Served as a static site)

## 3. Architecture & Integration

The frontend will communicate **only** with the `api-gateway` (Port 4004), which routes traffic to the underlying services.

- **Base URL:** `http://<EC2-HOST>:4004` (in production) or `http://localhost:4004` (local)

### Service Mapping

| Feature            | Backend Route               | Service           |
| :----------------- | :-------------------------- | :---------------- |
| **Login**          | `POST /auth/login`          | Auth Service      |
| **Validate Token** | `POST /auth/validate`       | Auth Service      |
| **Get Patients**   | `GET /api/patients`         | Patient Service   |
| **Create Patient** | `POST /api/patients`        | Patient Service   |
| **Update Patient** | `PUT /api/patients/{id}`    | Patient Service   |
| **Delete Patient** | `DELETE /api/patients/{id}` | Patient Service   |
| **View Analytics** | _(Needs a new endpoint)_    | Analytics Service |

## 4. Feature Requirements

### A. Authentication Module

- **Login Screen:** Email & Password form.
- **Auth Context:** Store JWT in `localStorage` or `httpOnly` cookie.
- **Protection:** specific routes (Dashboard, Patients) require a valid token. Redirect to login if token expires (401 error interceptor).

### B. Patient Management Module

- **Patient List:** Data table displaying Name, Email, Phone, Insurance ID.
- **Add Patient Modal:** Form to create a new patient.
- **Edit/Delete Actions:** Buttons on each row.
- **Search/Filter:** Basic client-side filtering.

### C. Analytics Dashboard (Optional/Future)

- **Stats Cards:** Total patients, Total billing accounts.
- **Charts:** Simple visualization if the analytics service exposes data.

## 5. Development Steps

### Step 1: Project Setup (Day 1)

- [ ] Initialize Vite project (`npm create vite@latest frontend -- --template react-ts`)
- [ ] Install dependencies (`axios`, `react-router-dom`, `tanstack/react-query`, `tailwindcss`)
- [ ] Configure Tailwind CSS & basic layout structure (AppShell).

### Step 2: Authentication (Day 1-2)

- [ ] Create `AuthContext` provider.
- [ ] Implement `Login` page.
- [ ] Setup Axios interceptor to attach `Authorization: Bearer <token>` to requests.

### Step 3: Patient CRUD (Day 2-3)

- [ ] Create `usePatients` hook with React Query.
- [ ] Build `PatientTable` component.
- [ ] Build `PatientForm` component (for Create/Edit).
- [ ] Wire up API calls to Gateway endpoints.

### Step 4: Dockerization & CI/CD (Day 4)

- [ ] Create `Dockerfile` (Multi-stage: Node build -> Nginx serve).
- [ ] Add `frontend` service to `docker-compose.yml`.
- [ ] Update GitHub Actions `cd.yml` to build and deploy the frontend.

## 6. Directory Structure

```
frontend/
├── public/
├── src/
│   ├── api/           # Axios instance & API calls
│   ├── components/    # Reusable UI components (Button, Input, Table)
│   ├── context/       # AuthContext
│   ├── hooks/         # Custom hooks (useAuth, usePatients)
│   ├── pages/         # Login, Dashboard, PatientList
│   ├── types/         # TypeScript interfaces (Patient, User)
│   ├── App.tsx
│   └── main.tsx
├── Dockerfile
├── nginx.conf
└── package.json
```

## 7. Next Steps

1. Initialize the React workspace.
2. Setup the Docker configuration.
3. Update specific backend CORS configurations (Gateway needs to allow the frontend origin).
