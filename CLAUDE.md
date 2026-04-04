# Creator Intelligence Studio - Claude Code Guide

## Project Purpose
Content brain + trend engine + idea remix studio. Users process YouTube videos, screenshots, and text into an analyzed content library, then generate original content blended with their methodology.

## Architecture
- **Next.js 16 App Router** with TypeScript
- **Prisma ORM** with PostgreSQL
- **shadcn/ui** component library
- **Mock mode** for development without external APIs (MOCK_MODE=true)

## Key Directories
- `src/app/` - Pages and API routes
- `src/components/` - UI components (ui/, layout/, shared/)
- `src/services/ai/` - OpenAI client, content analysis, generation
- `src/services/ingest/` - YouTube and screenshot ingestion
- `src/services/trends/` - Trend data fetching
- `src/services/similarity/` - Cosine similarity checking
- `src/prompts/` - AI prompt templates (analysis, generation, greenscreen, categorization, trends)
- `src/lib/db/` - Prisma client singleton
- `src/lib/utils/` - Constants, mock-mode helper
- `prisma/` - Schema, seed script
- `tests/` - Unit (Vitest), e2e (Playwright)

## Commands
```bash
npm run dev          # Dev server
npm run build        # Production build
npm test             # Unit tests
npm run test:e2e     # Playwright tests
npm run db:seed      # Seed data
npm run db:migrate   # Run migrations
```

## Coding Conventions
- TypeScript everywhere
- API routes return NextResponse.json()
- Services have mock fallbacks when MOCK_MODE=true
- Prisma client from `@/lib/db`
- Constants in `@/lib/utils/constants.ts`
- Shared components in `@/components/shared/`
- Pages use `PageHeader`, `StatCard`, `EmptyState` components

## Database
Prisma schema at `prisma/schema.prisma`. Key models: ContentItem, GeneratedOutput, Creator, Project, Category, TrendTopic, AppSetting.

## Prompts
All AI prompts in `src/prompts/`. Keep prompts as exported constants or template functions. Generator service selects prompt by output type.

## Adding Features
1. Add Prisma model if needed, run `npx prisma migrate dev`
2. Create API route in `src/app/api/`
3. Create page in `src/app/`
4. Add mock fallback in service layer
5. Add tests

## Environment
MOCK_MODE=true enables full local development without PostgreSQL or OpenAI.
