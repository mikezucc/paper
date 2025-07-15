# Paper - Minimalist White Paper Hosting Platform

A clean, academic-focused platform for hosting and reading white papers with Cloudflare Pages integration.

## Features

- Minimalist, typography-focused design using Golos Text
- Passwordless authentication with MFA codes
- Markdown-based editor with HTML embed support
- Cloudflare Pages deployment integration
- Tag-based paper discovery

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
- **Storage**: Cloudflare R2
- **Hosting**: Cloudflare Pages