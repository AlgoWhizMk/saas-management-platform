# Multi-Tenant SaaS Platform - Project & Task Management System

## 📋 Overview

A production-ready, multi-tenant SaaS application that enables multiple organizations to independently register, manage their teams, create projects, and track tasks with complete data isolation, role-based access control, and subscription management.

## ✨ Features

- **Multi-Tenancy Architecture**: Complete data isolation between tenants
- **JWT-Based Authentication**: Secure 24-hour token expiry
- **Three User Roles**: Super Admin, Tenant Admin, Regular User
- **Role-Based Access Control (RBAC)**: Fine-grained permission management
- **Subscription Plans**: Free, Pro, Enterprise with configurable limits
- **Project & Task Management**: Full lifecycle management for projects and tasks
- **Audit Logging**: Complete action tracking for security and compliance
- **Docker Containerization**: Ready for production deployment
- **Responsive Frontend**: Works on desktop and mobile devices
- **RESTful API**: 19 well-documented API endpoints

## 🏗️ Architecture

### System Architecture
- **Frontend**: React.js with responsive design
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL 15
- **Authentication**: JWT with bcrypt hashing
- **Containerization**: Docker & Docker Compose

### Database Schema
Five core tables with proper relationships:
- `tenants`: Organization data
- `users`: User accounts with tenant association
- `projects`: Project management
- `tasks`: Task management with project association
- `audit_logs`: Security audit trail

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- PostgreSQL 13+
- Docker & Docker Compose (optional)
- Git

### Local Setup

```bash
# Clone the repository
git clone https://github.com/PavaniVattikolla/multi-tenant-saas-project-manager.git
cd multi-tenant-saas-project-manager

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### Environment Setup

```bash
# Backend environment variables
cp backend/.env.example backend/.env

# Configure with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_secure_jwt_secret_min_32_chars
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Database Setup

```bash
cd backend

# Create database
createdb saas_db

# Run migrations
npm run migrate

# Seed database
npm run seed

cd ..
```

### Run Locally

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm start
```

Application will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health
- Database: localhost:5432

## 📚 API Documentation

### Authentication APIs
- `POST /api/auth/register-tenant` - Register new tenant
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Tenant Management APIs
- `GET /api/tenants/:tenantId` - Get tenant details
- `PUT /api/tenants/:tenantId` - Update tenant
- `GET /api/tenants` - List all tenants (super admin only)

### User Management APIs
- `POST /api/tenants/:tenantId/users` - Add user to tenant
- `GET /api/tenants/:tenantId/users` - List tenant users
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

### Project Management APIs
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project

### Task Management APIs
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/projects/:projectId/tasks` - List project tasks
- `PATCH /api/tasks/:taskId/status` - Update task status
- `PUT /api/tasks/:taskId` - Update task

## 👥 User Roles & Permissions

### Super Admin
- Full system access
- Manage all tenants
- Update subscription plans and limits
- View all audit logs

### Tenant Admin
- Full control over their tenant
- Manage users within tenant
- Create and manage projects
- Cannot delete themselves

### Regular User
- Limited access to tenant resources
- Create and manage own tasks
- Cannot manage other users

## 📋 Subscription Plans

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Max Users | 5 | 25 | 100 |
| Max Projects | 3 | 15 | 50 |
| Audit Logs | 30 days | 90 days | Unlimited |
| Support | Community | Email | Priority |

## 📁 Project Structure

```
multi-tenant-saas-project-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   ├── migrations/
│   ├── seeds/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
├── docs/
│   ├── research.md
│   ├── PRD.md
│   ├── architecture.md
│   ├── technical-spec.md
│   └── API.md
├── docker-compose.yml
└── submission.json
```

## 🔐 Security Features

- Password hashing with bcrypt (10+ salt rounds)
- JWT tokens with 24-hour expiry
- Data isolation by tenant_id
- CORS configuration
- Input validation and sanitization
- Audit logging for all operations
- CASCADE delete for data integrity

## 🧪 Testing

### Test Credentials (Seed Data)

**Super Admin:**
- Email: `superadmin@system.com`
- Password: `Admin@123`

**Demo Tenant:**
- Subdomain: `demo`
- Tenant Admin: `admin@demo.com` / `Demo@123`
- User 1: `user1@demo.com` / `User@123`
- User 2: `user2@demo.com` / `User@123`

## 📊 Database Migrations

Migrations run automatically on startup. Manual migration commands:

```bash
cd backend

# Run pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# Reset database
npm run migrate:reset

# Seed database with test data
npm run seed
```

## 📝 Environment Variables

### Backend (.env)
```
DB_HOST=database
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=dev_secret_key_min_32_characters_long
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://frontend:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://backend:5000/api
REACT_APP_ENV=development
```

## 🚢 Production Deployment

### Prerequisites
- Production database (RDS, Cloud SQL, etc.)
- HTTPS certificate
- Secure environment variables
- CI/CD pipeline

### Deployment Steps

1. Build Docker images
2. Push to container registry
3. Deploy to production (Kubernetes, ECS, etc.)
4. Configure health checks
5. Set up monitoring and logging
6. Enable SSL/TLS
7. Configure backup strategy

## 📖 Documentation

Comprehensive documentation available in `/docs` folder:
- `research.md` - Multi-tenancy analysis and technology justification
- `PRD.md` - Product requirements and user personas
- `architecture.md` - System architecture and database schema
- `technical-spec.md` - Technical specifications and setup guide
- `API.md` - Complete API endpoint documentation

## 🎯 Development Roadmap

- [x] Multi-tenancy architecture
- [x] JWT authentication
- [x] 19 API endpoints
- [x] Frontend UI (6 pages)
- [x] Docker containerization
- [x] Database schema
- [x] Audit logging
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Real-time updates
- [ ] Mobile app

## 🐛 Known Issues & Limitations

None currently known. Please report issues on GitHub Issues tab.

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

- Pavani Vattikolla - Project Lead

## 📞 Support

For support, please:
1. Check existing issues
2. Review documentation in `/docs`
3. Create a new issue with detailed information

## 🎓 Learning Resources

- Multi-tenancy patterns
- JWT authentication
- React.js best practices
- Node.js API development
- PostgreSQL optimization
- Docker containerization

---

**Project Status**: In Development  
**Last Updated**: March 2026  
**Version**: 1.0.0-beta
