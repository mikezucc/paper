> Loud Thoughts, Quietly

# Paper - Minimalist White Paper Hosting Platform

A clean writing platform for hosting and reading white papers.

## Features

- Minimalist, typography-focused design
- Passwordless authentication with MFA codes
- Markdown-based editor with HTML embed support

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL
- pnpm

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create the PostgreSQL database:
   ```bash
   ./scripts/setup-db.sh
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database schema:
   ```bash
   cd packages/backend
   pnpm prisma:generate
   pnpm prisma:migrate dev
   ```

5. Start development servers:
   ```bash
   pnpm dev
   ```

The frontend will be available at http://localhost:3000 and the API at http://localhost:4000.

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + TypeScript + Prisma
- **Database**: PostgreSQL