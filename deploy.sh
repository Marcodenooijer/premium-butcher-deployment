#!/bin/bash

echo "🚀 Starting deployment from Git..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Pull latest code
echo -e "${BLUE}📥 Pulling latest code from Git...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed!${NC}"
    exit 1
fi

# Stop containers
echo -e "${BLUE}🛑 Stopping containers...${NC}"
docker compose down

# Rebuild containers
echo -e "${BLUE}🔨 Building containers...${NC}"
docker compose build --no-cache

# Start containers
echo -e "${BLUE}🚀 Starting containers...${NC}"
docker compose up -d

# Wait for database to be ready
echo -e "${BLUE}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Run migrations
echo -e "${BLUE}📊 Running database migrations...${NC}"
for migration in backend/migrations/*.sql; do
    if [ -f "$migration" ]; then
        echo "Running $(basename $migration)..."
        docker compose exec -T postgres psql -U premium_butcher_user -d premium_butcher < "$migration" 2>&1 | grep -v "already exists" | grep -v "duplicate"
    fi
done

# Show status
echo -e "${BLUE}📋 Container status:${NC}"
docker compose ps

# Show logs
echo -e "${BLUE}📝 Recent logs:${NC}"
docker compose logs --tail=20

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Application available at: https://biologischvleeschatelier.nl${NC}"
echo ""
echo "To view logs: docker compose logs -f"
echo "To check status: docker compose ps"
