#!/bin/bash
set -e

echo "🔐 Fetching secrets..."
infisical secrets --env=prod --path=/ --output=dotenv > .env
infisical secrets --env=prod --path=/backend --output=dotenv > backend/.env
infisical secrets --env=prod --path=/frontend --output=dotenv > frontend/.env

echo "📦 Merging backend secrets to root .env for Docker Compose..."
# Append backend secrets to root .env so Docker Compose can access them
cat backend/.env >> .env

echo "🚀 Starting containers..."
docker compose up -d

echo "✅ Containers started!"
sleep 5
docker compose ps
