# Premium Biological Butcher - Customer Profile Application

Complete production-ready deployment package for the Premium Biological Butcher customer profile system with B2C and B2B support.

## 🎯 Overview

This repository contains everything needed to deploy a secure, scalable customer profile application for a premium biological butcher shop in The Netherlands. The system supports both individual consumers (B2C) and business clients (B2B) with comprehensive features for profile management, ordering, and sustainability tracking.

**Live URL**: [https://biologischvleeschatelier.profile.elysia.marketing](https://biologischvleeschatelier.profile.elysia.marketing)

## ✨ Features

### B2C Features
- **Personal Profile Management** - Name, contact info, delivery address
- **Family Members** - Track dietary requirements for household members
- **Meat Preferences** - Favorite meats, cuts, cooking preferences
- **Order History** - View past orders and reorder favorites
- **Subscription Management** - Weekly/monthly meat box deliveries
- **Loyalty Program** - Earn and redeem points
- **Sustainability Tracking** - Carbon footprint, local sourcing metrics
- **Recipe Collection** - Save and manage favorite recipes

### B2B Features
- **Company Profile** - Legal entity, VAT number, Chamber of Commerce
- **Multi-Location Management** - Multiple departments with unique center codes
- **Contact Person Management** - Role-based permissions and spending limits
- **Department Tracking** - Delivery instructions, time windows, weekly volumes
- **Invoice Management** - Credit limits, payment terms, invoice history
- **Compliance Certifications** - HACCP, ISO 22000, BRC, IFS tracking
- **Business Metrics** - Total spend, on-time payment rate, sustainability impact

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: PostgreSQL 15 with comprehensive schema
- **Reverse Proxy**: Nginx with SSL/TLS
- **Containerization**: Docker + Docker Compose
- **SSL**: Let's Encrypt (automatic renewal)

### Infrastructure

- **Platform**: Hetzner Cloud
- **OS**: Ubuntu 22.04 LTS
- **Deployment**: Docker Compose orchestration
- **Security**: HTTPS, HSTS, CSP headers, rate limiting

## 📁 Repository Structure

```
premium-butcher-deployment/
├── frontend/                 # React application
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Premium styling
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── Dockerfile           # Frontend container
│   ├── nginx.conf           # Frontend nginx config
│   ├── package.json         # Dependencies
│   └── vite.config.js       # Vite configuration
│
├── backend/                  # Node.js API
│   ├── server.js            # Express server with all endpoints
│   ├── Dockerfile           # Backend container
│   ├── package.json         # Dependencies
│   └── .env.example         # Environment variables template
│
├── database/                 # PostgreSQL
│   ├── database-schema.sql  # Complete schema (20+ tables)
│   └── database-seed.sql    # Sample data
│
├── nginx/                    # Reverse proxy
│   ├── nginx.conf           # Main nginx configuration
│   └── conf.d/
│       └── biologischvleeschatelier.conf  # Site configuration
│
├── scripts/                  # Deployment scripts
│   ├── deploy.sh            # Main deployment script
│   └── setup-ssl.sh         # SSL certificate setup
│
├── docs/                     # Documentation
│   └── DEPLOYMENT_GUIDE.md  # Complete deployment guide
│
├── docker-compose.yml        # Service orchestration
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Ubuntu 22.04 LTS server
- Domain configured: `biologischvleeschatelier.profile.elysia.marketing`
- SSH access to server
- Git installed

### 1. Clone Repository

```bash
git clone https://github.com/your-org/premium-butcher-deployment.git
cd premium-butcher-deployment
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env
```

Fill in required values:
- `DB_PASSWORD` - Secure database password
- `JWT_SECRET` - Generate with `openssl rand -hex 32`
- `ENCRYPTION_KEY` - Generate with `openssl rand -hex 32`
- `CSRF_SECRET` - Generate with `openssl rand -hex 32`

### 3. Deploy

```bash
./scripts/deploy.sh
```

### 4. Setup SSL

```bash
./scripts/setup-ssl.sh
```

### 5. Access Application

Open: [https://biologischvleeschatelier.profile.elysia.marketing](https://biologischvleeschatelier.profile.elysia.marketing)

## 📖 Documentation

- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Complete step-by-step deployment instructions
- **[Security Guide](../SECURITY_GUIDE.md)** - Comprehensive security implementation guide
- **[Database Schema](database/database-schema.sql)** - Full database structure with comments

## 🗄️ Database Schema

The PostgreSQL database includes 20+ tables supporting:

- **Brands** - Multi-brand support with brand_id linking
- **Customers** - B2C and B2B profiles
- **Addresses** - Billing and delivery addresses
- **Family Members** - B2C household tracking
- **Departments** - B2B multi-location management
- **Contact Persons** - B2B role-based access
- **Preferences** - Product and communication preferences
- **Orders** - Order history with line items
- **Invoices** - B2B invoicing and payment tracking
- **Subscriptions** - Recurring deliveries
- **Loyalty Points** - B2C rewards program
- **Certifications** - B2B compliance tracking
- **Security Events** - Audit logging
- **Sustainability Metrics** - Environmental impact tracking

## 🔒 Security Features

- **HTTPS/TLS** - Let's Encrypt SSL certificates with auto-renewal
- **Security Headers** - HSTS, CSP, X-Frame-Options, etc.
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - SQL injection prevention
- **Data Encryption** - Sensitive data encrypted at rest
- **GDPR Compliance** - Data export and deletion capabilities
- **Audit Logging** - Complete activity tracking
- **Role-Based Access** - B2B permission management

## 🛠️ Maintenance

### View Logs

```bash
docker-compose logs -f
```

### Restart Services

```bash
docker-compose restart
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U premium_butcher_user premium_butcher > backup.sql
```

### Update Application

```bash
git pull
docker-compose down
docker-compose up -d --build
```

## 📊 API Endpoints

### Health Check
- `GET /health` - Service health status

### Customer Endpoints
- `GET /api/customers/:customerId` - Get customer profile
- `GET /api/customers/:customerId/addresses` - Get addresses
- `GET /api/customers/:customerId/preferences` - Get preferences
- `GET /api/customers/:customerId/orders` - Get order history
- `GET /api/customers/:customerId/family-members` - Get family members (B2C)
- `GET /api/customers/:customerId/departments` - Get departments (B2B)
- `GET /api/customers/:customerId/contacts` - Get contact persons (B2B)
- `GET /api/customers/:customerId/invoices` - Get invoices (B2B)
- `GET /api/customers/:customerId/loyalty-points` - Get loyalty points (B2C)
- `GET /api/customers/:customerId/sustainability` - Get sustainability metrics
- `GET /api/customers/:customerId/b2b-dashboard` - Get B2B dashboard

## 🔧 Configuration

### Environment Variables

Required variables in `.env`:

```bash
# Database
DB_NAME=premium_butcher
DB_USER=premium_butcher_user
DB_PASSWORD=your_secure_password

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
CSRF_SECRET=your_csrf_secret

# Domain
DOMAIN=biologischvleeschatelier.profile.elysia.marketing
ADMIN_EMAIL=admin@biologischvleeschatelier.nl
```

### Docker Compose Services

- **postgres** - PostgreSQL 15 database
- **backend** - Node.js API (port 3000)
- **frontend** - React app (port 8080)
- **nginx** - Reverse proxy (ports 80, 443)
- **certbot** - SSL certificate management

## 🧪 Sample Data

The database includes sample data for testing:

**B2C Customer:**
- Name: John Smith
- Email: john.smith@example.com
- Membership: Gold
- Family: 4 members with dietary requirements
- Orders: 2 completed orders
- Loyalty Points: 264 points

**B2B Customer:**
- Company: De Gouden Lepel Restaurant Group
- Locations: 3 departments (AMS-001, AMS-002, UTR-001)
- Contacts: 3 personnel with different permission levels
- Orders: €87,450 YTD spend
- Payment: 98% on-time rate

## 🌍 DNS Configuration

Configure DNS A record for your domain:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `biologischvleeschatelier.profile` | `your-server-ip` | 3600 |

## 📝 License

Proprietary - Premium Biological Butcher

## 👥 Support

For deployment issues or questions:
- Email: admin@biologischvleeschatelier.nl
- Documentation: [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

## 🎉 Credits

Built with:
- React + Vite
- Tailwind CSS
- shadcn/ui components
- Express.js
- PostgreSQL
- Docker
- Nginx
- Let's Encrypt

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Production Ready ✅
