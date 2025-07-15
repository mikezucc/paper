#!/bin/bash

echo "Setting up PostgreSQL database for Paper..."

# Database configuration
DB_NAME="paper"
DB_USER=${DB_USER:-"postgres"}

# Check if PostgreSQL is running
if ! pg_isready -q; then
  echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
  exit 1
fi

# Check if database exists
if psql -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  echo "Database '$DB_NAME' already exists."
  read -p "Do you want to drop and recreate it? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Dropping existing database..."
    psql -U "$DB_USER" -c "DROP DATABASE $DB_NAME;"
  else
    echo "Keeping existing database."
    exit 0
  fi
fi

# Create database
echo "Creating database '$DB_NAME'..."
psql -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"

if [ $? -eq 0 ]; then
  echo "Database '$DB_NAME' created successfully!"
  echo
  echo "Next steps:"
  echo "1. Update your .env file with the correct DATABASE_URL"
  echo "2. Run database migrations: cd packages/backend && pnpm prisma:migrate"
else
  echo "Error: Failed to create database."
  exit 1
fi