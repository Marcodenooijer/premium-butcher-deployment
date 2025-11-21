# Premium Biological Butcher - Quick Start Guide

## Deploy to biologischvleeschatelier.profile.elysia.marketing in 15 Minutes

This guide will get your application running on Hetzner with SSL in approximately 15 minutes.

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Hetzner server (Ubuntu 22.04 LTS, 4GB RAM minimum)
- [ ] Server IP address
- [ ] SSH access to server
- [ ] DNS access for `elysia.marketing` domain

---

## Step 1: Configure DNS (5 minutes)

### Get Your Server IP

```bash
ssh root@your-server-ip
curl ifconfig.me
# Note the IP address (e.g., 123.456.789.012)
```

### Add DNS A Record

Log in to your DNS provider and add:

| Field | Value |
|-------|-------|
| Type | A |
| Name | `biologischvleeschatelier.profile` |
| Value | `123.456.789.012` (your server IP) |
| TTL | 3600 |

### Verify DNS

Wait 2-3 minutes, then:

```bash
dig +short biologischvleeschatelier.profile.elysia.marketing
# Should return your server IP
```

---

## Step 2: Clone Repository (2 minutes)

```bash
# SSH into your server
ssh root@your-server-ip

# Create deployment user
adduser deploy
usermod -aG sudo deploy
su - deploy

# Clone repository
cd ~
git clone https://github.com/your-org/premium-butcher-deployment.git
cd premium-butcher-deployment
```

**Alternative: Upload tarball**

If you have the tarball locally:

```bash
# On your local machine
scp premium-butcher-deployment-complete.tar.gz deploy@your-server-ip:~

# On the server
ssh deploy@your-server-ip
tar -xzf premium-butcher-deployment-complete.tar.gz
cd premium-butcher-deployment
```

---

## Step 3: Configure Environment (3 minutes)

```bash
# Copy environment template
cp .env.example .env

# Generate secure keys
echo "DB_PASSWORD=$(openssl rand -hex 16)"
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)"
echo "CSRF_SECRET=$(openssl rand -hex 32)"

# Edit .env file
nano .env
```

**Paste the generated values into .env:**

```bash
DB_NAME=premium_butcher
DB_USER=premium_butcher_user
DB_PASSWORD=<paste DB_PASSWORD here>

JWT_SECRET=<paste JWT_SECRET here>
ENCRYPTION_KEY=<paste ENCRYPTION_KEY here>
CSRF_SECRET=<paste CSRF_SECRET here>

DOMAIN=biologischvleeschatelier.profile.elysia.marketing
ADMIN_EMAIL=admin@biologischvleeschatelier.nl
```

**Save**: `Ctrl+X`, `Y`, `Enter`

---

## Step 4: Deploy Application (3 minutes)

```bash
./scripts/deploy.sh
```

**What it does:**
- Installs Docker and Docker Compose (if needed)
- Builds all containers
- Starts database, backend, frontend, nginx
- Verifies all services are healthy

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

---

## Step 5: Setup SSL (2 minutes)

```bash
./scripts/setup-ssl.sh
```

**What it does:**
- Verifies DNS configuration
- Requests SSL certificate from Let's Encrypt
- Configures nginx for HTTPS
- Tests HTTPS connection

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

---

## Step 6: Verify Deployment (2 minutes)

### Test Application

Open in browser:
```
https://biologischvleeschatelier.profile.elysia.marketing
```

You should see the Premium Biological Butcher customer profile interface.

### Test API

```bash
curl https://biologischvleeschatelier.profile.elysia.marketing/health
# Should return: {"status":"ok",...}

curl https://biologischvleeschatelier.profile.elysia.marketing/api/health
# Should return: {"status":"ok",...}
```

### Check Services

```bash
docker-compose ps
```

All services should show status `Up` or `Up (healthy)`.

---

## Troubleshooting

### DNS Not Resolving

```bash
# Check DNS
dig biologischvleeschatelier.profile.elysia.marketing

# If not resolving, wait longer or check DNS configuration
```

### SSL Certificate Failed

```bash
# Ensure DNS resolves first
dig +short biologischvleeschatelier.profile.elysia.marketing

# Ensure ports are open
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Retry SSL setup
./scripts/setup-ssl.sh
```

### Service Not Starting

```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose restart

# Check environment variables
cat .env
```

---

## Next Steps

### Access Sample Data

The database includes sample B2C and B2B customers:

**B2C Customer:**
- Email: `john.smith@example.com`
- Customer ID: `660e8400-e29b-41d4-a716-446655440001`

**B2B Customer:**
- Company: De Gouden Lepel Restaurant Group
- Customer ID: `770e8400-e29b-41d4-a716-446655440002`

### Connect to Database

```bash
docker-compose exec postgres psql -U premium_butcher_user -d premium_butcher

# List tables
\dt

# View customers
SELECT customer_type, COUNT(*) FROM customers GROUP BY customer_type;

# Exit
\q
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U premium_butcher_user premium_butcher > backup_$(date +%Y%m%d).sql
```

---

## Useful Commands

```bash
# View service status
docker-compose ps

# Restart all services
docker-compose restart

# Stop all services
docker-compose down

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Update application
git pull
docker-compose up -d --build
```

---

## Security Checklist

After deployment, ensure:

- [ ] Changed all default passwords in `.env`
- [ ] SSL certificate is working (green padlock in browser)
- [ ] Firewall is configured (ports 80, 443, 22 only)
- [ ] Regular backups are scheduled
- [ ] Monitoring is set up

### Configure Firewall

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
sudo ufw status
```

---

## Support

For detailed documentation:
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [DNS Setup Guide](docs/DNS_SETUP.md)
- [Security Guide](../SECURITY_GUIDE.md)

For issues:
- Email: admin@biologischvleeschatelier.nl
- Check logs: `docker-compose logs -f`

---

## Summary

You've successfully deployed:

✅ **Frontend**: React application with premium UI  
✅ **Backend**: Express API with PostgreSQL  
✅ **Database**: 20+ tables with sample data  
✅ **Security**: HTTPS with Let's Encrypt SSL  
✅ **Infrastructure**: Docker containers with nginx reverse proxy  

**URL**: https://biologischvleeschatelier.profile.elysia.marketing

**Total Time**: ~15 minutes

---

**Version**: 1.0  
**Last Updated**: November 2025
