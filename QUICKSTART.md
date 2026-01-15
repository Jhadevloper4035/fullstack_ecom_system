# 🚀 Quick Start Guide

Get your production-ready authentication system running in 5 minutes!

## Prerequisites

- Docker Desktop installed
- 2GB+ free RAM
- Port 80 and 4000 available

## Step 1: Extract Files

```bash
tar -xzf fullstack-auth-system.tar.gz
cd fullstack-auth-system
```

## Step 2: Start Development Environment

```bash
# Copy environment file
cp .env.development .env

# Start all services
docker-compose up -d

# Wait 30 seconds for services to initialize
```

## Step 3: Verify Services

```bash
# Check service status
docker-compose ps

# All services should show "Up"
```

## Step 4: Access Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:4000
- **RabbitMQ Dashboard**: http://localhost:15672
  - Username: `admin`
  - Password: `adminpassword`

## Step 5: Test Registration Flow

### Using cURL:

```bash
# Register a new user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "confirmPassword": "Test123!@#"
  }'

# Check email worker logs for verification email
docker-compose logs email-worker
```

### Using Browser:

1. Open http://localhost
2. Click "Register"
3. Fill in the form
4. Check backend logs for verification link
5. Use the link to verify email

## Common Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Clean everything
docker-compose down -v
```

## Environment Configuration

### Development (Default)
- Uses Mailtrap for emails (configure SMTP in .env)
- Debug logging enabled
- Hot reload enabled

### Test
```bash
cp .env.test .env
docker-compose up -d
```

### Production
```bash
cp .env.production .env

# ⚠️ IMPORTANT: Update these in .env:
# - All passwords
# - JWT secrets (use: make generate-secrets)
# - SMTP credentials
# - Domain name

docker-compose up -d
```

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Check ports
lsof -i :80
lsof -i :4000
```

### Database Connection Error
```bash
# Wait longer (PostgreSQL takes ~20 seconds)
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Email Not Sending
```bash
# Check email worker
docker-compose logs email-worker

# Check RabbitMQ
docker-compose logs rabbitmq
```

## Next Steps

1. **Configure Email**: Update SMTP settings in .env for real email delivery
2. **Read Docs**: Check README.md for detailed documentation
3. **API Testing**: See API.md for all endpoints
4. **Production**: Follow DEPLOYMENT.md for production setup
5. **Customize**: Modify frontend in `frontend/` directory

## Architecture Overview

```
┌─────────────┐
│   Nginx     │ ← Reverse Proxy & Load Balancer
│   (Port 80) │
└──────┬──────┘
       │
       ├─────────────┬──────────────┐
       │             │              │
┌──────▼──────┐ ┌───▼────────┐ ┌──▼──────────┐
│  Frontend   │ │  Backend   │ │  Backend    │
│  (Next.js)  │ │  (Express) │ │  (Express)  │
└─────────────┘ └────┬───────┘ └──────┬──────┘
                     │                │
       ┌─────────────┼────────────────┼─────────┐
       │             │                │         │
┌──────▼──────┐ ┌───▼──────┐  ┌──────▼──────┐ │
│ PostgreSQL  │ │  Redis   │  │  RabbitMQ   │ │
│  (Database) │ │ (Cache)  │  │   (Queue)   │ │
└─────────────┘ └──────────┘  └──────┬──────┘ │
                                      │        │
                               ┌──────▼──────┐ │
                               │Email Worker │◄┘
                               │  (Node.js)  │
                               └─────────────┘
```

## Features Included

✅ User registration with email verification
✅ Login with JWT tokens (access + refresh)
✅ Token rotation for security
✅ Password reset workflow
✅ Email sending via RabbitMQ
✅ Rate limiting on all endpoints
✅ Redis token blacklisting
✅ PostgreSQL with connection pooling
✅ Docker Compose orchestration
✅ Multi-environment support
✅ Nginx reverse proxy
✅ Functional programming (no classes)
✅ Production-ready security

## File Structure

```
fullstack-auth-system/
├── backend/               # Express API
│   ├── controllers/      # Route handlers
│   ├── db/              # Database connections
│   ├── middleware/      # Express middleware
│   ├── repositories/    # Database operations
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── workers/        # Background jobs
├── frontend/            # Next.js app
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   └── lib/           # API client
├── nginx/              # Reverse proxy configs
├── docker-compose.yml  # Service orchestration
├── .env.*             # Environment configs
└── README.md          # Full documentation
```

## Security Notes

⚠️ **Before Production:**
1. Change all default passwords
2. Generate new JWT secrets
3. Configure SSL certificates
4. Update domain names
5. Set up real SMTP service
6. Enable firewall rules
7. Review security checklist in README.md

## Support

- Full docs: `README.md`
- API reference: `API.md`
- Deployment guide: `DEPLOYMENT.md`
- Architecture details in code comments

## License

MIT License - Use freely for any project!

---

**Happy coding! 🎉**

If you encounter issues, check the logs first:
```bash
docker-compose logs -f
```
