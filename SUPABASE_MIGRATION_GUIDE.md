# Supabase Migration Guide

This guide will help you migrate from a local PostgreSQL database to Supabase.

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new Supabase project

## Migration Steps

### 1. Get Supabase Connection Details

1. Go to your Supabase project dashboard
2. Navigate to Settings → Database
3. Copy the connection strings:
   - **Connection Pooling (Transaction)**: Use this for `DATABASE_URL`
   - **Direct Connection**: Use this for `DIRECT_URL` (for migrations)

### 2. Update Environment Variables

Copy the example Supabase configuration:

```bash
cp packages/backend/.env.supabase.example .env
```

Update the `.env` file with your Supabase credentials:

```env
# For application connections (with connection pooling)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true

# For migrations (direct connection)
DIRECT_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 3. Export Data from Local Database (Optional)

If you have existing data in your local database:

```bash
# Export your local database
pg_dump postgresql://user:password@localhost:5432/paper > paper_backup.sql

# Import to Supabase (using the direct connection URL)
psql "postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < paper_backup.sql
```

### 4. Run Prisma Migrations

Generate Prisma client and run migrations:

```bash
# Navigate to backend directory
cd packages/backend

# Generate Prisma client
pnpm prisma:generate

# Push the schema to Supabase
pnpm prisma db push

# Or run migrations if you have existing migration files
pnpm prisma migrate deploy
```

### 5. Update Prisma Configuration

The Prisma schema has been updated to support both pooled connections (for the app) and direct connections (for migrations).

### 6. Test the Connection

Run the application to verify the connection:

```bash
# From the root directory
pnpm dev
```

## Important Notes

### Connection Pooling

Supabase uses PgBouncer for connection pooling. The pooled connection string includes `?pgbouncer=true` and uses port `6543`. This is recommended for your application.

### Direct Connection

The direct connection (port `5432`) should only be used for:
- Running migrations
- Database administration tasks
- Development with Prisma Studio

### Row Level Security (RLS)

Supabase enables Row Level Security by default. You may need to:
1. Disable RLS for tables (not recommended for production)
2. Or create appropriate RLS policies

To disable RLS (development only):
```sql
-- Run this in Supabase SQL editor for each table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE papers DISABLE ROW LEVEL SECURITY;
-- etc...
```

### Environment-Specific Configuration

Consider using different Supabase projects for:
- Development
- Staging  
- Production

## Troubleshooting

### SSL Connection Issues

If you encounter SSL connection errors, add `?sslmode=require` to your connection string:

```env
DATABASE_URL=postgresql://...supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

### Timeout Issues

For long-running queries or migrations, you may need to increase the statement timeout:

```env
DATABASE_URL=postgresql://...supabase.com:6543/postgres?pgbouncer=true&statement_timeout=60s
```

### Permission Issues

Ensure your database user has the necessary permissions. The default `postgres` user should have all required permissions.

## Additional Supabase Features

Once migrated, you can take advantage of:
- Built-in authentication
- Real-time subscriptions
- Storage API
- Edge Functions
- Database backups

However, the current application uses Prisma ORM, so these features would require additional integration work.