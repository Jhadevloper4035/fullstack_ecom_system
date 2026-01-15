# Production-Ready Authentication System

A complete, scalable authentication system built with **Next.js 15**, Express, PostgreSQL, Redis, RabbitMQ, and Nginx, featuring **Bootstrap 5** for UI and following functional programming principles.

## 🚀 Features

### Frontend Updates
- ✅ **Next.js 15.1.3** - Latest version with App Router
- ✅ **React 19** - Latest React version
- ✅ **Bootstrap 5.3.3** - Modern responsive UI framework
- ✅ **React Bootstrap** - Bootstrap components for React
- ✅ **Bootstrap Icons** - 2000+ icons included
- ✅ **TypeScript** - Full type safety

### Security Features
- ✅ **JWT Authentication** with access & refresh tokens
- ✅ **Token Rotation** for enhanced security
- ✅ **Token Blacklisting** using Redis
- ✅ **Password Hashing** with bcrypt (12 rounds)
- ✅ **Rate Limiting** on all endpoints
- ✅ **CORS** protection
- ✅ **Helmet.js** security headers
- ✅ **Email Verification** workflow
- ✅ **Password Reset** workflow
- ✅ **Logout from all devices** functionality

### Architecture Features
- ✅ **Functional Programming** approach (no classes/OOP)
- ✅ **Microservices** architecture
- ✅ **Asynchronous Email** processing with RabbitMQ
- ✅ **Docker Compose** for orchestration
- ✅ **Multi-environment** setup (dev, test, prod)
- ✅ **Nginx** reverse proxy with SSL
- ✅ **Health checks** for all services
- ✅ **Graceful shutdown** handling
- ✅ **Connection pooling** for databases
- ✅ **Automatic token refresh** on frontend

## 📁 Project Structure

```
fullstack-auth-system/
├── backend/
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database connections & migrations
│   ├── middleware/         # Express middleware
│   ├── repositories/       # Database operations
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Helper functions
│   ├── workers/           # Background workers
│   ├── Dockerfile         # Multi-stage Docker build
│   ├── package.json
│   └── server.js          # Entry point
├── frontend/
│   ├── app/               # Next.js 15 app directory
│   │   ├── components/   # React components
│   │   ├── login/        # Login page
│   │   ├── register/     # Register page
│   │   ├── dashboard/    # Dashboard page
│   │   ├── verify-email/ # Email verification
│   │   ├── forgot-password/ # Password reset
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Bootstrap styles
│   ├── lib/              # API client & utilities
│   ├── public/           # Static assets
│   ├── Dockerfile        # Multi-stage Docker build
│   ├── next.config.js    # Next.js 15 config
│   ├── tsconfig.json     # TypeScript config
│   └── package.json
├── nginx/
│   ├── nginx.development.conf
│   ├── nginx.test.conf
│   ├── nginx.production.conf
│   └── ssl/               # SSL certificates (production)
├── docker-compose.yml     # Service orchestration
├── .env.*                # Environment configs
└── README.md             # Full documentation
```

## 🛠️ Tech Stack

### Frontend (Updated!)
- **Next.js 15.1.3** - Latest React framework with App Router
- **React 19** - Latest UI library
- **Bootstrap 5.3.3** - Responsive CSS framework
- **React Bootstrap 2.10.6** - Bootstrap components for React
- **Bootstrap Icons** - Comprehensive icon library
- **TypeScript 5.7** - Type safety
- **Axios** - HTTP client
- **js-cookie** - Cookie management

### Backend
- **Node.js** 20 LTS
- **Express** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Token blacklist & caching
- **RabbitMQ** - Message queue for emails
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending

### DevOps
- **Docker** & **Docker Compose** - Containerization
- **Nginx** - Reverse proxy & load balancer
- **PostgreSQL** - Production database
- **Redis** - Caching layer
- **RabbitMQ** - Message broker

## 🚦 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Node.js 20+ (for local development)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fullstack-auth-system
```

### 2. Choose Environment

#### Development Environment
```bash
# Copy development environment file
cp .env.development .env

# Start all services
docker-compose --env-file .env up -d

# View logs
docker-compose logs -f
```

#### Test Environment
```bash
# Copy test environment file
cp .env.test .env

# Start all services
docker-compose --env-file .env up -d
```

#### Production Environment
```bash
# Copy production environment file
cp .env.production .env

# ⚠️ IMPORTANT: Update all passwords and secrets in .env.production

# Generate strong secrets for JWT
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Start all services
docker-compose --env-file .env up -d
```

### 3. Access the Application

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:4000
- **RabbitMQ Management**: http://localhost:15672 (user: admin, password: from .env)

## 🎨 Bootstrap UI Features

### Beautiful Components
- **Gradient Buttons** - Custom gradient backgrounds
- **Modern Cards** - Glassmorphism effects
- **Responsive Grid** - Mobile-first design
- **Bootstrap Icons** - 2000+ icons available
- **Form Validation** - Built-in validation styles
- **Alerts & Toasts** - User feedback components
- **Navbar & Dropdowns** - Navigation components

### Custom Bootstrap Styles
```css
/* Gradient buttons */
.btn-gradient-primary - Purple gradient
.btn-gradient-secondary - Pink gradient

/* Custom cards */
.card-auth - Authentication card styling

/* Custom animations */
.fade-in - Smooth fade-in effect
```

### Available Pages
1. **Home (/)** - Landing page with features
2. **Login (/login)** - Sign in page
3. **Register (/register)** - Sign up page
4. **Dashboard (/dashboard)** - User dashboard
5. **Forgot Password (/forgot-password)** - Password reset request
6. **Verify Email (/verify-email)** - Email verification

## 📧 Email Configuration

### Development (Mailtrap)
1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Get SMTP credentials
3. Update `.env.development`:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASSWORD=your-mailtrap-password
```

### Production (SendGrid/AWS SES)
1. Get API key from provider
2. Update `.env.production`:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

## 🔒 SSL Setup (Production)

### Option 1: Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --webroot -w /var/www/certbot -d yourdomain.com -d www.yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/chain.pem ./nginx/ssl/

# Update nginx config with your domain
# Edit nginx/nginx.production.conf and replace yourdomain.com
```

### Option 2: Self-Signed (Development/Testing)
```bash
# Generate self-signed certificate
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem
```

## 🧪 API Endpoints

### Public Endpoints
```
POST /api/auth/register              - Register new user
POST /api/auth/login                 - Login user
POST /api/auth/verify-email          - Verify email
POST /api/auth/request-password-reset - Request password reset
POST /api/auth/reset-password        - Reset password
POST /api/auth/refresh-token         - Refresh access token
```

### Protected Endpoints
```
GET  /api/auth/me                    - Get current user
POST /api/auth/logout                - Logout current device
POST /api/auth/logout-all            - Logout all devices
```

## 📝 Environment Variables

### Essential Variables
```env
# Backend
BACKEND_PORT=4000
JWT_ACCESS_SECRET=<64-char-random-string>
JWT_REFRESH_SECRET=<64-char-random-string>

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=<username>
DB_PASSWORD=<strong-password>
DB_NAME=<database-name>

# Redis
REDIS_PASSWORD=<strong-password>

# RabbitMQ
RABBITMQ_USER=<username>
RABBITMQ_PASSWORD=<strong-password>

# Email
SMTP_HOST=<smtp-host>
SMTP_PORT=<smtp-port>
SMTP_USER=<smtp-user>
SMTP_PASSWORD=<smtp-password>
SMTP_FROM=<from-email>

# Frontend
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🔧 Development

### Local Development (without Docker)

#### Backend
```bash
cd backend
npm install
cp ../.env.development .env
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📊 Monitoring & Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
docker-compose logs -f email-worker
```

### Check Service Health
```bash
# Backend health
curl http://localhost:4000/health

# RabbitMQ management UI
http://localhost:15672
```

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` instead
2. **Rotate JWT secrets regularly** in production
3. **Use strong passwords** for all services (min 16 characters)
4. **Enable SSL/TLS** in production
5. **Keep dependencies updated** - Run `npm audit` regularly
6. **Monitor failed login attempts**
7. **Set up firewall rules** for production servers
8. **Use environment-specific configs**
9. **Enable 2FA** for admin accounts (future enhancement)
10. **Regular backups** of PostgreSQL database

## 🚀 Deployment

### Docker Compose (Recommended)
```bash
# Pull latest images
docker-compose pull

# Build and start services
docker-compose --env-file .env.production up -d --build

# Scale services
docker-compose up -d --scale backend=3 --scale email-worker=2
```

### Manual Deployment
See individual Dockerfiles in `backend/` and `frontend/` directories.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Verify connection
docker-compose exec postgres psql -U <DB_USER> -d <DB_NAME>
```

### Redis Connection Issues
```bash
# Check Redis logs
docker-compose logs redis

# Test connection
docker-compose exec redis redis-cli ping
```

### RabbitMQ Issues
```bash
# Check RabbitMQ logs
docker-compose logs rabbitmq

# Access management UI
http://localhost:15672
```

### Email Not Sending
```bash
# Check email worker logs
docker-compose logs email-worker

# Verify RabbitMQ queue
# Access RabbitMQ management UI and check 'email_queue'
```

## 📈 Performance Optimization

1. **Connection Pooling** - PostgreSQL pool size: 20
2. **Redis Caching** - Token blacklist with expiry
3. **Nginx Caching** - Static assets cached for 30 days
4. **Gzip Compression** - Enabled for all text responses
5. **Rate Limiting** - Prevent abuse
6. **Worker Processes** - Nginx auto-detects CPU cores
7. **Keep-Alive** - Persistent connections enabled

## 🔄 Token Rotation Flow

1. User logs in → Receives access token (15m) & refresh token (7d)
2. Access token stored in cookie, refresh token in httpOnly cookie
3. On access token expiry → Frontend auto-refreshes using refresh token
4. On refresh → Old refresh token invalidated, new pair issued
5. On detected reuse → Entire token family revoked (security breach)

## 🎯 What's New in This Version

### Next.js 15 Features
- ✅ **App Router** - Latest routing system
- ✅ **Server Components** - Better performance
- ✅ **Streaming** - Progressive page loading
- ✅ **Improved Caching** - Faster builds
- ✅ **TypeScript** - Full type safety

### Bootstrap 5 Features
- ✅ **Responsive Grid** - Mobile-first design
- ✅ **Utility Classes** - Rapid development
- ✅ **Custom Properties** - CSS variables
- ✅ **No jQuery** - Vanilla JavaScript
- ✅ **Bootstrap Icons** - 2000+ icons

## 📚 Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ using functional programming principles and modern web technologies.

## 🎯 Future Enhancements

- [ ] Two-Factor Authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] Account lockout after failed attempts
- [ ] Password history tracking
- [ ] Session management UI
- [ ] Audit log viewer
- [ ] Prometheus metrics
- [ ] Kubernetes deployment configs
- [ ] CI/CD pipeline
- [ ] API documentation (Swagger)
- [ ] Dark mode support
- [ ] Progressive Web App (PWA)
