# Architecture

## Overview
Creator Intelligence Studio is a Next.js 16 App Router application with TypeScript, Prisma ORM, and PostgreSQL.

## Directory Structure
```
src/
  app/                    # Next.js pages and API routes
    api/                  # REST API endpoints
      content/            # CRUD + process pipeline
      generate/           # Content generation + feedback
      creators/           # Creator management
      projects/           # Project management
      categories/         # Category listing
      trends/             # Trend fetching/refresh
      settings/           # App settings CRUD
      ideas/daily/        # Daily idea generation
      health/             # Health check
    dashboard/            # Main dashboard
    inbox/                # Content ingestion
    library/[id]/         # Content detail view
    creators/[id]/        # Creator detail
    generate/
      record/[id]/        # Script reading mode
      teleprompter/[id]/  # Teleprompter mode
    guide/                # User guide
  components/
    ui/                   # shadcn/ui components
    layout/               # AppShell, Sidebar
    shared/               # PageHeader, StatCard, EmptyState
  services/
    ai/                   # OpenAI client, analysis, generation
    ingest/               # YouTube transcript, screenshot OCR
    trends/               # Trend data fetching
    similarity/           # Cosine similarity checking
  prompts/                # AI prompt templates
  lib/
    db/                   # Prisma client singleton
    utils/                # Constants, mock mode helper
```

## Data Flow
1. User submits content via Inbox (YouTube URL, text, screenshots)
2. `/api/content/process` orchestrates ingestion + AI analysis
3. Content stored in PostgreSQL with categories, tags, summaries
4. Library page fetches and displays processed content
5. Generate page takes source content + settings and produces outputs
6. Similarity service checks outputs against existing content

## Mock Mode
When `MOCK_MODE=true`, all services return deterministic mock data. This allows full local development without PostgreSQL or OpenAI API keys.

## API Pattern
All API routes follow the same pattern:
- `GET` for listing/fetching
- `POST` for creating
- `PATCH` for updating
- `DELETE` for removing
- Returns `NextResponse.json()` with appropriate status codes
- Error handling with try/catch and 500 responses
