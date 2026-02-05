
# Deployment Guide

## Prerequisites

- Python 3.11+
- PostgreSQL 14+ (or compatible database)
- Docker & Docker Compose (for containerized deployment)
- 2GB RAM minimum (4GB recommended)
- 10GB disk space

## Environment Setup

### 1. Clone and Navigate

```bash
cd core
```

### 2. Configure Environment

Create `.env` file:

```env
# Required
DATABASE_URL=postgresql+asyncpg://postgres:password@db:5432/postgres
API_KEY_SALT=your-super-secret-random-string-min-32-chars

# Optional - customize for your deployment
REDIS_URL=redis://redis:6379
RATE_LIMIT=1000
LOG_LEVEL=INFO
DEBUG=false

# For production, also set:
# JWT_SECRET=your-jwt-secret
# CORS_ORIGINS=https://your-domain.com
```

### 3. Generate Secure Secrets

```bash
# Generate API key salt (use a random 32+ character string)
openssl rand -hex 32

# Generate JWT secret
openssl rand -hex 64
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Option 2: Kubernetes

Apply the manifests from `/kubernetes` directory:

```bash
kubectl apply -f kubernetes/
```

### Option 3: Manual Deployment

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install
pip install -e .

# Run migrations (if using Alembic)
alembic upgrade head

# Start with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Database Setup

### PostgreSQL

```sql
CREATE DATABASE greenprompt;

-- For production, create a dedicated user
CREATE USER greenprompt WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE greenprompt TO greenprompt;
```

### Initialize Tables

The application auto-creates tables on startup. For production, use migrations:

```python
# migrations/env.py (Alembic configuration)
```

## Production Checklist

- [ ] Set `DEBUG=false`
- [ ] Use strong `API_KEY_SALT` (32+ random characters)
- [ ] Configure `CORS_ORIGINS` for your domains
- [ ] Set up HTTPS/TLS termination
- [ ] Configure monitoring and alerting
- [ ] Set up log aggregation
- [ ] Configure rate limiting appropriate to your plan
- [ ] Set up database backups
- [ ] Configure Redis for caching (optional but recommended)
- [ ] Set up horizontal scaling (multiple workers/instances)

## Scaling

### Horizontal Scaling

```bash
# Run multiple workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Load Balancing

Use a reverse proxy (nginx, Traefik, or cloud load balancer):

```nginx
upstream greenprompt_api {
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
    server 127.0.0.1:8003;
    keepalive 32;
}

server {
    location / {
        proxy_pass http://greenprompt_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Monitoring

### Health Endpoints

- `/health` - Basic health check
- `/ready` - Readiness probe (includes database connectivity)

### Metrics

Export metrics for Prometheus:

```python
# Add to your monitoring setup
from prometheus_client import Counter, Histogram, generate_latest

REQUEST_COUNT = Counter('greenprompt_requests_total', 'Total requests')
REQUEST_LATENCY = Histogram('greenprompt_request_latency_seconds', 'Request latency')
```

### Logging

Logs are output in JSON format for easy parsing:

```json
{
  "timestamp": "2025-02-05T12:00:00.000Z",
  "level": "INFO",
  "message": "POST /v1/analyze - 200 - 0.123s",
  "service": "greenprompt-core"
}
```

## Security Considerations

1. **API Keys**: Rotate regularly, use environment variables
2. **Database**: Use connection pooling, enable SSL
3. **Network**: Use VPC, restrict database access
4. **Dependencies**: Regularly audit with `pip-audit`
5. **Headers**: Security headers are automatically added
6. **Rate Limiting**: Prevents abuse and DoS attacks

## Troubleshooting

### Database Connection Issues

```bash
# Check database connectivity
docker-compose exec api python -c "from app.database import engine; engine.connect()"
```

### High Latency

- Check database query performance
- Consider adding Redis cache
- Scale horizontally if needed

### Memory Issues

```bash
# Check memory usage
docker-compose stats

# Reduce worker count
uvicorn app.main:app --workers 2
```

## Rollback Procedure

```bash
# If using Docker
docker-compose pull
docker-compose up -d

# If using Kubernetes
kubectl rollout undo deployment/greenprompt-api
```

## Backup and Recovery

### Database Backup

```bash
# PostgreSQL backup
pg_dump -h localhost -U greenprompt greenprompt > backup.sql

# Schedule daily backups
# 0 2 * * * pg_dump -h localhost -U greenprompt greenprompt | gzip > /backups/greenprompt-$(date +\%Y\%m\%d).sql.gz
```

### Restore from Backup

```bash
psql -h localhost -U greenprompt -d greenprompt < backup.sql
```

## Support

- Documentation: `/docs` (when running)
- Issues: GitHub Issues
- Email: reach.saad@outlook.com
.


## Production Deployment

How it Works

### 1. Automatic: Code Commit → Image → GitHub Container Registry

GitHub Actions watches main, scoped to a specific directory

On change:
- Builds a new Docker image
- Push it to a registry (GitHub Container Registry here)

Now, you have to do the next steps.

### 2. Deploy/Run: Registry Pull & Auto Update Setup

Production machine auto-updates the container 
Best Option: Watchtower (dead simple)

Run this once on the production machine:
```bash
docker run -d \
  --name watchtower \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 60
```

Then run your app container like:
```bash
docker run -d \
  --name greenprompt \
  --restart unless-stopped \
  ghcr.io/saad2134/greenprompt:latest
```

Watchtower will:
- Poll the registry
- Pull new images
- Restart the container automatically

Zero scripts. Zero SSH. It just works.

### 3. Finally, set the backend core service URL in the environment of the frontend.

Set the below in your frontend (/web) deploy
```
BACKEND_CORE_SERVICE_BASE_URL = ""
```


