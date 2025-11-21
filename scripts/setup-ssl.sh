#!/bin/bash

# Premium Biological Butcher - SSL Setup Script
# This script obtains SSL certificates from Let's Encrypt

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       SSL Certificate Setup (Let's Encrypt)            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Load environment variables
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    exit 1
fi

source .env

DOMAIN=${DOMAIN:-biologischvleeschatelier.profile.elysia.marketing}
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@biologischvleeschatelier.nl}

echo -e "${YELLOW}Domain: ${DOMAIN}${NC}"
echo -e "${YELLOW}Admin Email: ${ADMIN_EMAIL}${NC}"
echo ""

# Check if domain resolves to this server
echo -e "${YELLOW}Checking DNS resolution...${NC}"
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short ${DOMAIN} | tail -n1)

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo -e "${RED}❌ DNS not configured correctly${NC}"
    echo -e "${YELLOW}Server IP: ${SERVER_IP}${NC}"
    echo -e "${YELLOW}Domain IP: ${DOMAIN_IP}${NC}"
    echo ""
    echo -e "${YELLOW}Please configure your DNS A record:${NC}"
    echo "  Type: A"
    echo "  Name: biologischvleeschatelier.profile"
    echo "  Value: ${SERVER_IP}"
    echo "  TTL: 3600"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ DNS configured correctly${NC}"
fi

# Create nginx config for HTTP only (for initial certificate request)
echo -e "${YELLOW}Creating temporary HTTP-only nginx config...${NC}"
cat > nginx/conf.d/biologischvleeschatelier-http.conf << EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 "Server is ready for SSL setup";
        add_header Content-Type text/plain;
    }
}
EOF

# Restart nginx to apply HTTP-only config
echo -e "${YELLOW}Restarting nginx...${NC}"
docker-compose restart nginx
sleep 5

# Request SSL certificate
echo -e "${YELLOW}Requesting SSL certificate from Let's Encrypt...${NC}"
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email ${ADMIN_EMAIL} \
    --agree-tos \
    --no-eff-email \
    -d ${DOMAIN}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate obtained successfully${NC}"
else
    echo -e "${RED}❌ Failed to obtain SSL certificate${NC}"
    exit 1
fi

# Remove temporary HTTP-only config
rm nginx/conf.d/biologischvleeschatelier-http.conf

# Restart nginx with HTTPS config
echo -e "${YELLOW}Restarting nginx with HTTPS configuration...${NC}"
docker-compose restart nginx
sleep 5

# Test HTTPS
echo -e "${YELLOW}Testing HTTPS connection...${NC}"
if curl -f -k https://${DOMAIN}/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ HTTPS is working${NC}"
else
    echo -e "${RED}❌ HTTPS test failed${NC}"
    docker-compose logs nginx
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         SSL Setup Complete! 🔒                         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Your application is now accessible at:${NC}"
echo -e "${GREEN}https://${DOMAIN}${NC}"
echo ""
echo -e "${YELLOW}Certificate auto-renewal:${NC}"
echo "Certificates will be automatically renewed by the certbot container."
echo "Renewal happens every 12 hours, and certificates are renewed 30 days before expiry."
echo ""
