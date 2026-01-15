.PHONY: help dev test prod build clean logs status restart

help:
	@echo "Available commands:"
	@echo "  make dev       - Start development environment"
	@echo "  make test      - Start test environment"
	@echo "  make prod      - Start production environment"
	@echo "  make build     - Build all containers"
	@echo "  make clean     - Stop and remove all containers"
	@echo "  make logs      - View logs from all services"
	@echo "  make status    - Check status of all services"
	@echo "  make restart   - Restart all services"
	@echo "  make db-backup - Backup PostgreSQL database"
	@echo "  make db-restore - Restore PostgreSQL database"

dev:
	@echo "Starting development environment..."
	docker-compose --env-file .env.development up -d --build
	@echo "Services started! Access frontend at http://localhost"

test:
	@echo "Starting test environment..."
	docker-compose --env-file .env.test up -d
	@echo "Services started! Access frontend at http://localhost:81"

prod:
	@echo "Starting production environment..."
	@read -p "Have you updated .env.production with secure passwords? (y/n) " confirm; \
	if [ "$$confirm" = "y" ]; then \
		docker-compose --env-file .env.production up -d; \
		echo "Production services started!"; \
	else \
		echo "Please update .env.production first!"; \
		exit 1; \
	fi

build:
	@echo "Building all containers..."
	docker-compose build --no-cache

clean:
	@echo "Stopping and removing all containers..."
	docker-compose down -v
	@echo "Cleanup complete!"

stop:
	@echo "Stopping and removing all containers..."
	docker-compose down 
	@echo "Cleanup complete!"

logs:
	@echo "Viewing logs (Ctrl+C to exit)..."
	docker-compose logs -f

logs-backend:
	@echo "Viewing backend logs..."
	docker-compose logs -f backend

logs-frontend:
	@echo "Viewing frontend logs..."
	docker-compose logs -f frontend

logs-worker:
	@echo "Viewing email worker logs..."
	docker-compose logs -f email-worker

status:
	@echo "Service status:"
	docker-compose ps

restart:
	@echo "Restarting all services..."
	docker-compose restart

restart-backend:
	@echo "Restarting backend..."
	docker-compose restart backend

restart-frontend:
	@echo "Restarting frontend..."
	docker-compose restart frontend

db-backup:
	@echo "Creating database backup..."
	@mkdir -p backups
	docker-compose exec -T postgres pg_dump -U $(DB_USER) $(DB_NAME) > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in backups/ directory"

db-restore:
	@echo "Restoring database from backup..."
	@read -p "Enter backup file path: " backup_file; \
	docker-compose exec -T postgres psql -U $(DB_USER) $(DB_NAME) < $$backup_file
	@echo "Database restored!"

generate-secrets:
	@echo "Generating JWT secrets (copy these to your .env file):"
	@echo "JWT_ACCESS_SECRET=$$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
	@echo "JWT_REFRESH_SECRET=$$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"

ssl-cert:
	@echo "Generating self-signed SSL certificate..."
	@mkdir -p nginx/ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout nginx/ssl/privkey.pem \
		-out nginx/ssl/fullchain.pem
	@echo "SSL certificate generated in nginx/ssl/"

health-check:
	@echo "Checking service health..."
	@curl -f http://localhost:4000/health && echo "✓ Backend healthy" || echo "✗ Backend unhealthy"
	@docker-compose exec -T postgres pg_isready && echo "✓ PostgreSQL healthy" || echo "✗ PostgreSQL unhealthy"
	@docker-compose exec -T redis redis-cli ping > /dev/null && echo "✓ Redis healthy" || echo "✗ Redis unhealthy"

scale-backend:
	@read -p "Enter number of backend instances: " count; \
	docker-compose up -d --scale backend=$$count --no-recreate

scale-worker:
	@read -p "Enter number of email workers: " count; \
	docker-compose up -d --scale email-worker=$$count --no-recreate
