#!/bin/bash
set -e

echo "🔐 Fetching frontend secrets from Infisical..."
infisical secrets --env=prod --path=/frontend --output=dotenv > frontend/.env.tmp

echo "📦 Loading secrets..."
set -a
source frontend/.env.tmp
set +a

echo "🏗️  Building frontend..."
docker compose build --no-cache \
  --build-arg VITE_PUBLIC_POSTHOG_KEY="$VITE_PUBLIC_POSTHOG_KEY" \
  --build-arg VITE_PUBLIC_POSTHOG_HOST="$VITE_PUBLIC_POSTHOG_HOST" \
  --build-arg VITE_FIREBASE_API_KEY="$VITE_FIREBASE_API_KEY" \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN="$VITE_FIREBASE_AUTH_DOMAIN" \
  --build-arg VITE_FIREBASE_PROJECT_ID="$VITE_FIREBASE_PROJECT_ID" \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET="$VITE_FIREBASE_STORAGE_BUCKET" \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="$VITE_FIREBASE_MESSAGING_SENDER_ID" \
  --build-arg VITE_FIREBASE_APP_ID="$VITE_FIREBASE_APP_ID" \
  --build-arg VITE_API_BASE_URL="$VITE_API_BASE_URL" \
  frontend

rm -f frontend/.env.tmp
echo "✅ Build complete!"
