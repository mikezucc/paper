#!/bin/bash

echo "Starting Paper development environment..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
  echo "PostgreSQL is not running. Please start PostgreSQL first."
  exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
cd packages/backend && pnpm prisma:generate

# Run database migrations
echo "Running database migrations..."
pnpm prisma:migrate

# Build shared package
echo "Building shared package..."
cd ../shared && pnpm build

# Start development servers
# echo "Starting development servers..."
# cd ../.. && pnpm dev