# Multi-Tenant SaaS Platform - Complete Implementation Guide

## Table of Contents
1. [Project Setup](#project-setup)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [Docker Setup](#docker-setup)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Testing & Deployment](#testing--deployment)

---

## Project Setup

### Directory Structure
```
multi-tenant-saas-project-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   ├── migrations/
│   ├── seeds/
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── docs/
│   ├── research.md
│   ├── PRD.md
│   ├── architecture.md
│   ├── technical-spec.md
│   └── API.md
├── docker-compose.yml
├── submission.json
└── README.md
```

---

## Backend Implementation

### Backend Technologies
- Node.js 16+
- Express.js 4.x
- PostgreSQL 13+
- JWT for authentication
- Bcrypt for password hashing

### Backend Setup Steps

#### 1. Initialize Backend Project
```bash
cd backend
npm init -y
```

#### 2. Install Dependencies
```bash
npm install express pg bcryptjs jsonwebtoken cors dotenv helmet express-validator
npm install --save-dev nodemon
```

#### 3. Create .env file
See .env.example for reference

#### 4. Database Configuration
- PostgreSQL connection using pg library
- Connection pooling for performance
- Error handling for failed connections

---

## Frontend Implementation

### Frontend Technologies
- React 18+
- React Router v6
- Axios for API calls
- Tailwind CSS for styling

### Frontend Setup Steps

#### 1. Create React App
```bash
npx create-react-app frontend
cd frontend
```

#### 2. Install Dependencies
```bash
npm install react-router-dom axios tailwindcss
npm install --save-dev tailwindcss postcss autoprefixer
```

#### 3. Pages to Create
1. **Registration Page** (`/register`)
   - Tenant registration form
   - Admin account creation
   - Form validation

2. **Login Page** (`/login`)
   - Email, password, subdomain fields
   - Remember me option
   - Error handling

3. **Dashboard** (`/dashboard`)
   - User stats
   - Recent projects
   - My tasks section

4. **Projects List** (`/projects`)
   - Create project button
   - Filter by status
   - Edit/Delete actions

5. **Project Details** (`/projects/:id`)
   - Project info
   - Tasks list
   - Task creation
   - Task status updates

6. **Users Management** (`/users`)
   - Users list (admin only)
   - Add user button
   - Edit/Delete user actions

---

## Docker Setup

### Docker Compose Configuration
See docker-compose.yml for complete setup

**Key Points:**
- Database service: postgres:15
- Backend service: Node.js app on port 5000
- Frontend service: React app on port 3000
- Network: All services connected
- Volumes: Database persistence
- Health checks: Ensure service readiness

---

## Database Schema

### Table: tenants
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(255) UNIQUE NOT NULL,
  status ENUM('active', 'suspended', 'trial') DEFAULT 'active',
  subscription_plan ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
  max_users INTEGER,
  max_projects INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'tenant_admin', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, email)
);
```

### Table: projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('active', 'archived', 'completed') DEFAULT 'active',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_projects_tenant ON projects(tenant_id);
```

### Table: tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'completed') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tasks_tenant_project ON tasks(tenant_id, project_id);
```

### Table: audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(255),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Authentication APIs (4)
1. `POST /api/auth/register-tenant` - Register tenant
2. `POST /api/auth/login` - User login
3. `GET /api/auth/me` - Get current user
4. `POST /api/auth/logout` - User logout

### Tenant Management (3)
5. `GET /api/tenants/:tenantId` - Get tenant details
6. `PUT /api/tenants/:tenantId` - Update tenant
7. `GET /api/tenants` - List all tenants (super admin)

### User Management (4)
8. `POST /api/tenants/:tenantId/users` - Add user
9. `GET /api/tenants/:tenantId/users` - List users
10. `PUT /api/users/:userId` - Update user
11. `DELETE /api/users/:userId` - Delete user

### Project Management (4)
12. `POST /api/projects` - Create project
13. `GET /api/projects` - List projects
14. `PUT /api/projects/:projectId` - Update project
15. `DELETE /api/projects/:projectId` - Delete project

### Task Management (4)
16. `POST /api/projects/:projectId/tasks` - Create task
17. `GET /api/projects/:projectId/tasks` - List tasks
18. `PATCH /api/tasks/:taskId/status` - Update task status
19. `PUT /api/tasks/:taskId` - Update task

---

## Testing & Deployment

### Local Testing
```bash
# Start Docker containers
docker-compose up -d

# Check service status
docker-compose ps

# Test endpoints
curl http://localhost:5000/api/health
```

### Test Credentials (from submission.json)
- Super Admin: superadmin@system.com / Admin@123
- Tenant Admin: admin@demo.com / Demo@123
- User: user1@demo.com / User@123

### Key Implementation Points

1. **Multi-Tenancy**
   - Always filter queries by tenant_id
   - Prevent cross-tenant data access
   - Super admin exception for system-level access

2. **Authentication**
   - JWT with 24-hour expiry
   - Bcrypt hashing (10+ rounds)
   - Token validation on protected routes

3. **Authorization**
   - Role-based access control (RBAC)
   - Check permissions in middleware
   - Enforce at API level

4. **Error Handling**
   - Consistent response format
   - Proper HTTP status codes
   - Clear error messages

5. **Database**
   - Cascade deletes for data integrity
   - Foreign key constraints
   - Proper indexing on tenant_id

---

## Next Steps

1. Clone this repository locally
2. Follow setup instructions in README.md
3. Create all files according to structure
4. Implement backend APIs
5. Build frontend pages
6. Create Docker configuration
7. Run with docker-compose
8. Test all functionality
9. Deploy to production

---

**Version**: 1.0.0-beta  
**Last Updated**: March 2026  
**For complete requirements, refer to the Partnr Network task specification.**
