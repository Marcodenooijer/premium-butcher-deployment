# Premium Biological Butcher - Deployment Guide

Complete guide for deploying the customer profile application to Hetzner server at `biologischvleeschatelier.profile.elysia.marketing`.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [DNS Configuration](#dns-configuration)
3. [Server Setup](#server-setup)
4. [Application Deployment](#application-deployment)
5. [SSL Certificate Setup](#ssl-certificate-setup)
6. [Verification](#verification)
7. [Maintenance](#maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Git** - For cloning the repository
- **SSH access** to your Hetzner server
- **Domain access** - Ability to configure DNS records for `biologischvleeschatelier.profile.elysia.marketing`

### Server Requirements

- **OS**: Ubuntu 22.04 LTS or newer
- **RAM**: Minimum 4GB (8GB recommended)
- **CPU**: 2 cores minimum (4 cores recommended)
- **Storage**: 20GB minimum (50GB recommended)
- **Network**: Public IP address

---

## DNS Configuration

### Step 1: Get Your Server IP

SSH into your Hetzner server and get the public IP:

```bash
curl ifconfig.me
```

Note this IP address (e.g., `123.456.789.012`).

### Step 2: Configure DNS A Record

In your DNS provider (where `elysia.marketing` is hosted), add an A record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `biologischvleeschatelier.profile` | `123.456.789.012` | 3600 |

**Full domain**: `biologischvleeschatelier.profile.elysia.marketing`

### Step 3: Verify DNS Propagation

Wait 5-10 minutes for DNS propagation, then verify:

```bash
dig biologischvleeschatelier.profile.elysia.marketing
```

The answer section should show your server's IP address.

---

## Server Setup

### Step 1: Connect to Your Hetzner Server

```bash
ssh root@your-server-ip
```

### Step 2: Create Deployment User

```bash
# Create user
adduser deploy

# Add to sudo group
usermod -aG sudo deploy

# Add to docker group (will be created during Docker installation)
usermod -aG docker deploy

# Switch to deploy user
su - deploy
```

### Step 3: Install Required Software

The deployment script will automatically install Docker and Docker Compose if not present. However, you can install them manually:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y git curl wget nano

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
rm get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and log back in for group changes to take effect
exit
```

Log back in:

```bash
ssh deploy@your-server-ip
```

Verify installations:

```bash
docker --version
docker-compose --version
```

---

## Application Deployment

### Step 1: Clone the Repository

```bash
cd ~
git clone https://github.com/your-organization/premium-butcher-deployment.git
cd premium-butcher-deployment
```

**Alternative: If using GitHub with token**

```bash
git clone https://github_pat_YOUR_TOKEN@github.com/your-organization/premium-butcher-deployment.git
```

### Step 2: Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Configuration:**

```bash
# Database Configuration
DB_NAME=premium_butcher
DB_USER=premium_butcher_user
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE  # CHANGE THIS!

# Security Keys (generate with: openssl rand -hex 32)
JWT_SECRET=YOUR_JWT_SECRET_HERE        # CHANGE THIS!
ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY_HERE  # CHANGE THIS!
CSRF_SECRET=YOUR_CSRF_SECRET_HERE      # CHANGE THIS!

# Domain Configuration
DOMAIN=biologischvleeschatelier.profile.elysia.marketing
ADMIN_EMAIL=admin@biologischvleeschatelier.nl
```

**Generate Secure Keys:**

```bash
# Generate JWT secret
openssl rand -hex 32

# Generate encryption key
openssl rand -hex 32

# Generate CSRF secret
openssl rand -hex 32
```

Copy each generated key to the corresponding variable in `.env`.

**Save and exit**: Press `Ctrl+X`, then `Y`, then `Enter`.

### Step 3: Run Deployment Script

```bash
cd ~/premium-butcher-deployment
./scripts/deploy.sh
```

The script will:
1. Check environment variables
2. Install Docker and Docker Compose (if needed)
3. Build Docker containers
4. Start all services
5. Verify health of all components

**Expected output:**

```
✓ Environment variables loaded
✓ Docker and Docker Compose are installed
✓ Database is healthy
✓ Backend is healthy
✓ Frontend is healthy

╔════════════════════════════════════════════════════════╗
║           Deployment Successful! 🎉                    ║
╚════════════════════════════════════════════════════════╝
```

### Step 4: Verify Services

Check that all containers are running:

```bash
docker-compose ps
```

You should see:
- `premium-butcher-db` (postgres)
- `premium-butcher-backend` (backend API)
- `premium-butcher-frontend` (React app)
- `premium-butcher-nginx` (reverse proxy)
- `premium-butcher-certbot` (SSL certificates)

All should show status as `Up` or `Up (healthy)`.

---

## SSL Certificate Setup

### Step 1: Verify DNS Configuration

Before requesting SSL certificates, ensure DNS is configured correctly:

```bash
# Check if domain resolves to your server
dig +short biologischvleeschatelier.profile.elysia.marketing

# Should return your server's IP address
```

### Step 2: Run SSL Setup Script

```bash
cd ~/premium-butcher-deployment
./scripts/setup-ssl.sh
```

The script will:
1. Verify DNS configuration
2. Create temporary HTTP-only nginx config
3. Request SSL certificate from Let's Encrypt
4. Configure nginx for HTTPS
5. Test HTTPS connection

**Expected output:**

```
✓ DNS configured correctly
✓ SSL certificate obtained successfully
✓ HTTPS is working

╔════════════════════════════════════════════════════════╗
║         SSL Setup Complete! 🔒                         ║
╚════════════════════════════════════════════════════════╝

Your application is now accessible at:
https://biologischvleeschatelier.profile.elysia.marketing
```

### Certificate Auto-Renewal

SSL certificates are automatically renewed by the certbot container:
- Renewal check runs every 12 hours
- Certificates are renewed 30 days before expiry
- No manual intervention required

---

## Verification

### Step 1: Test Application Access

Open your browser and navigate to:

```
https://biologischvleeschatelier.profile.elysia.marketing
```

You should see the Premium Biological Butcher customer profile interface.

### Step 2: Test API Endpoints

```bash
# Health check
curl https://biologischvleeschatelier.profile.elysia.marketing/health

# API health check
curl https://biologischvleeschatelier.profile.elysia.marketing/api/health
```

Both should return successful responses.

### Step 3: Test SSL Certificate

```bash
# Check SSL certificate
openssl s_client -connect biologischvleeschatelier.profile.elysia.marketing:443 -servername biologischvleeschatelier.profile.elysia.marketing < /dev/null

# Or use online tool
# https://www.ssllabs.com/ssltest/analyze.html?d=biologischvleeschatelier.profile.elysia.marketing
```

Expected SSL Labs grade: A or A+

### Step 4: Test Database Connection

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U premium_butcher_user -d premium_butcher

# List tables
\dt

# Check sample data
SELECT customer_type, COUNT(*) FROM customers GROUP BY customer_type;

# Exit
\q
```

You should see:
- B2C: 1 customer
- B2B: 1 customer

---

## Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f nginx
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart nginx
```

### Stop Services

```bash
docker-compose down
```

### Start Services

```bash
docker-compose up -d
```

### Update Application

```bash
cd ~/premium-butcher-deployment

# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U premium_butcher_user premium_butcher > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose exec -T postgres psql -U premium_butcher_user premium_butcher < backup_20250101_120000.sql
```

### Monitor Resource Usage

```bash
# Docker stats
docker stats

# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top
```

---

## Troubleshooting

### Issue: DNS Not Resolving

**Symptoms**: Domain doesn't resolve to server IP

**Solution**:
```bash
# Check DNS
dig biologischvleeschatelier.profile.elysia.marketing

# If not resolving, wait for DNS propagation (up to 24 hours)
# Or check DNS configuration in your DNS provider
```

### Issue: SSL Certificate Request Failed

**Symptoms**: Let's Encrypt certificate request fails

**Solution**:
```bash
# Ensure DNS is configured correctly
dig +short biologischvleeschatelier.profile.elysia.marketing

# Ensure port 80 is accessible
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check nginx logs
docker-compose logs nginx

# Retry SSL setup
./scripts/setup-ssl.sh
```

### Issue: Database Connection Failed

**Symptoms**: Backend can't connect to database

**Solution**:
```bash
# Check database status
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Verify credentials in .env file
cat .env | grep DB_

# Restart database
docker-compose restart postgres

# Wait for database to be ready
sleep 10

# Restart backend
docker-compose restart backend
```

### Issue: Backend API Not Responding

**Symptoms**: API endpoints return errors

**Solution**:
```bash
# Check backend logs
docker-compose logs backend

# Check backend health
curl http://localhost:3000/health

# Restart backend
docker-compose restart backend

# Check database connection
docker-compose exec backend node -e "console.log(process.env.DB_HOST)"
```

### Issue: Frontend Not Loading

**Symptoms**: Blank page or 404 errors

**Solution**:
```bash
# Check frontend logs
docker-compose logs frontend

# Check nginx logs
docker-compose logs nginx

# Rebuild frontend
docker-compose up -d --build frontend

# Check nginx configuration
docker-compose exec nginx nginx -t
```

### Issue: Port Already in Use

**Symptoms**: Docker fails to start with "port already allocated"

**Solution**:
```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :3000
sudo lsof -i :5432

# Stop conflicting service
sudo systemctl stop apache2  # if Apache is running
sudo systemctl stop nginx    # if system nginx is running

# Or change ports in docker-compose.yml
```

### Issue: Out of Disk Space

**Symptoms**: Services fail to start, errors about disk space

**Solution**:
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes

# Remove old logs
sudo journalctl --vacuum-time=7d

# Check large files
du -sh /var/lib/docker
```

### Issue: High Memory Usage

**Symptoms**: Server becomes slow or unresponsive

**Solution**:
```bash
# Check memory usage
free -h
docker stats

# Restart services to free memory
docker-compose restart

# Add swap if needed
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Security Best Practices

### Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### Monitor Logs

```bash
# Set up log rotation
sudo nano /etc/logrotate.d/docker-compose

# Add:
/var/lib/docker/containers/*/*.log {
  rotate 7
  daily
  compress
  size=10M
  missingok
  delaycompress
  copytruncate
}
```

### Backup Strategy

```bash
# Create backup script
nano ~/backup.sh

# Add:
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
docker-compose exec -T postgres pg_dump -U premium_butcher_user premium_butcher > $BACKUP_DIR/db_$DATE.sql

# Backup environment
cp .env $BACKUP_DIR/env_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

# Make executable
chmod +x ~/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/deploy/backup.sh
```

---

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs: `docker-compose logs -f`
3. Check [Security Guide](../SECURITY_GUIDE.md)
4. Contact: admin@biologischvleeschatelier.nl

---

## Quick Reference

### Common Commands

```bash
# View all services
docker-compose ps

# View logs
docker-compose logs -f

# Restart all
docker-compose restart

# Stop all
docker-compose down

# Start all
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# Database backup
docker-compose exec postgres pg_dump -U premium_butcher_user premium_butcher > backup.sql

# Check health
curl https://biologischvleeschatelier.profile.elysia.marketing/health
```

### Important Files

- `.env` - Environment variables (NEVER commit to Git)
- `docker-compose.yml` - Service definitions
- `nginx/conf.d/biologischvleeschatelier.conf` - Nginx configuration
- `database/database-schema.sql` - Database schema
- `backend/server.js` - Backend API
- `frontend/src/App.jsx` - Frontend application

### Important Directories

- `~/premium-butcher-deployment` - Application root
- `/var/lib/docker/volumes` - Docker volumes (database data)
- `/etc/letsencrypt` - SSL certificates
- `~/backups` - Database backups

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Deployment URL**: https://biologischvleeschatelier.profile.elysia.marketing
