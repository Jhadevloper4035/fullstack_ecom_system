# Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- Domain name configured (for production)
- SMTP service account (SendGrid, AWS SES, etc.)
- Server with at least 2GB RAM

## Environment Setup

### 1. Development Environment

```bash
# Use development settings
cp .env.development .env

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

Access:
- Frontend: http://localhost
- Backend: http://localhost:4000
- RabbitMQ: http://localhost:15672

### 2. Test Environment

```bash
# Use test settings
cp .env.test .env

# Start services
docker-compose up -d
```

Access:
- Frontend: http://localhost:81
- Backend: http://localhost:4001

### 3. Production Environment

#### Step 1: Configure Environment Variables

```bash
# Copy production template
cp .env.production .env

# Generate secure JWT secrets
make generate-secrets

# Edit .env.production and update:
# - All passwords (DB, Redis, RabbitMQ)
# - JWT secrets (from make generate-secrets)
# - SMTP credentials
# - Domain name
```

#### Step 2: SSL Certificate Setup

**Option A: Let's Encrypt (Recommended)**

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Stop nginx if running
docker-compose stop nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/chain.pem ./nginx/ssl/

# Set permissions
sudo chmod 644 ./nginx/ssl/*.pem

# Update nginx config
# Edit nginx/nginx.production.conf and replace "yourdomain.com"
```

**Option B: Self-Signed Certificate (Testing)**

```bash
make ssl-cert
```

#### Step 3: Update Nginx Configuration

```bash
# Edit nginx/nginx.production.conf
# Replace all instances of "yourdomain.com" with your actual domain
sed -i 's/yourdomain.com/your-actual-domain.com/g' nginx/nginx.production.conf
```

#### Step 4: Start Services

```bash
# Build and start
docker-compose --env-file .env up -d --build

# Check status
docker-compose ps

# Check logs
docker-compose logs -f
```

#### Step 5: Verify Deployment

```bash
# Check backend health
curl https://your-domain.com/api/health

# Check frontend
curl https://your-domain.com

# Test registration
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#","confirmPassword":"Test123!@#"}'
```

## DNS Configuration

Point your domain to your server IP:

```
A    yourdomain.com         -> YOUR_SERVER_IP
A    www.yourdomain.com     -> YOUR_SERVER_IP
```

## Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:4000/health

# Check all services
make health-check
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f email-worker
```

### Service Status

```bash
docker-compose ps
```

## Scaling

### Scale Backend

```bash
# Scale to 3 instances
make scale-backend
# Enter: 3

# Or manually
docker-compose up -d --scale backend=3 --no-recreate
```

### Scale Email Workers

```bash
# Scale to 2 workers
make scale-worker
# Enter: 2

# Or manually
docker-compose up -d --scale email-worker=2 --no-recreate
```

## Backup & Restore

### Database Backup

```bash
# Create backup
make db-backup

# Backups are stored in backups/ directory
```

### Database Restore

```bash
# Restore from backup
make db-restore
# Enter: backups/backup_20250110_120000.sql
```

### Manual Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U produser proddb > backup.sql

# Restore database
docker-compose exec -T postgres psql -U produser proddb < backup.sql
```

## SSL Certificate Renewal

### Let's Encrypt

```bash
# Renew certificate
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/chain.pem ./nginx/ssl/

# Reload nginx
docker-compose exec nginx nginx -s reload
```

### Auto-renewal (Cron)

```bash
# Add to crontab
sudo crontab -e

# Add this line (runs daily at 2am)
0 2 * * * certbot renew --quiet && cp /etc/letsencrypt/live/yourdomain.com/*.pem /path/to/project/nginx/ssl/ && docker-compose -f /path/to/project/docker-compose.yml exec nginx nginx -s reload
```

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs service-name

# Check configuration
docker-compose config

# Restart service
docker-compose restart service-name
```

### Database Connection Error

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Verify connection
docker-compose exec postgres psql -U username -d dbname

# Check network
docker-compose exec backend ping postgres
```

### Email Not Sending

```bash
# Check email worker logs
docker-compose logs email-worker

# Check RabbitMQ
docker-compose logs rabbitmq

# Access RabbitMQ management UI
http://your-domain.com:15672
```

### High Memory Usage

```bash
# Check resource usage
docker stats

# Limit container memory (in docker-compose.yml)
services:
  backend:
    mem_limit: 512m
    memswap_limit: 512m
```

## Security Checklist

- [ ] All default passwords changed
- [ ] JWT secrets are random and secure (64+ characters)
- [ ] SSL certificate installed and valid
- [ ] Firewall configured correctly
- [ ] Database accessible only from Docker network
- [ ] Redis accessible only from Docker network
- [ ] RabbitMQ management UI protected or disabled
- [ ] Environment files not committed to git
- [ ] Regular security updates scheduled
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured

## Performance Optimization

### PostgreSQL

```bash
# Edit postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
```

### Redis

```bash
# Edit redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### Nginx

```bash
# Already optimized in nginx.production.conf
# - Gzip compression enabled
# - Keep-alive connections
# - Static file caching
# - Worker processes auto-detected
```

## Maintenance

### Regular Tasks

**Daily:**
- Check logs for errors
- Monitor disk space
- Check service health

**Weekly:**
- Review security logs
- Test backup restoration
- Update dependencies (security patches)

**Monthly:**
- Full system backup
- Performance review
- Security audit
- SSL certificate check

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

## Rollback Strategy

```bash
# Tag current version before deployment
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0

# If deployment fails, rollback
git checkout v1.0.0
docker-compose down
docker-compose up -d --build
```

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review troubleshooting section
3. Check GitHub issues
4. Contact system administrator
