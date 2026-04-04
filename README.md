# Creator Intelligence Studio

A premium content brain, trend engine, and idea remix studio for creators. Process YouTube videos, screenshots, and text into an intelligent content library, then generate original content in your voice.

## Features

- **Inbox**: Paste YouTube links, upload screenshots, or enter text for AI-powered analysis
- **Content Processing**: Auto-generates summaries, hook analysis, persuasion angles, categorization
- **Library**: Searchable, filterable content database with status workflow
- **Creators**: Track up to 20 favorite content creators with style fingerprinting
- **Projects**: Organize content into customizable project buckets
- **Generate**: Create 12+ output types (posts, scripts, emails, workshops, etc.)
- **Green Screen Scripts**: Structured scripts with asset suggestions, beat timing, gestures
- **Teleprompter Mode**: Adjustable font/speed, mirror text, distraction-free reading
- **Trends**: AI-powered trend dashboard across 7 topic areas
- **Similarity Check**: Prevents derivative/repetitive outputs
- **Content Calendar**: Lightweight scheduling and planning board
- **Daily Ideas**: Auto-generated content ideas refreshed daily
- **Settings**: Configurable voice, methodology, audiences, prohibited phrases
- **Export**: Copy, markdown, and text export on all generated content
- **Feedback Loop**: Rate outputs to improve future generation quality
- **Review Workflow**: Draft, reviewed, favorite, ready-to-record, archived statuses

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Route Handlers
- **Database**: PostgreSQL + Prisma ORM
- **AI**: OpenAI API (with full mock mode for local development)
- **Testing**: Vitest (unit), Playwright (e2e)
- **Deployment**: Railway-ready

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Ensure MOCK_MODE="true" in .env for local dev without APIs

# Generate Prisma client
npx prisma generate

# If you have PostgreSQL running:
npx prisma migrate dev --name init
npm run db:seed

# Start dev server
npm run dev
```

The app runs at http://localhost:3000

### Mock Mode

Set `MOCK_MODE="true"` in `.env` to use the app without any external APIs. All AI analysis, generation, trend fetching, and OCR will return realistic mock data.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes (if using DB) | PostgreSQL connection string |
| `MOCK_MODE` | No | Set "true" for mock data (default) |
| `OPENAI_API_KEY` | No (mock mode) | OpenAI API key for real AI processing |
| `NEWS_API_KEY` | No | News API key for real trend data |

## Scripts

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm test                 # Unit tests (Vitest)
npm run test:e2e         # Playwright e2e tests
npm run test:e2e:headed  # E2e tests with browser visible
npm run db:migrate       # Prisma migrations
npm run db:seed          # Seed sample data
npm run db:studio        # Prisma Studio
```

## Database Schema

Core models: ContentItem, GeneratedOutput, Creator, Project, Category, TrendTopic, AppSetting, Note, ProcessingJob, Tag.

Seed data includes 8 projects, 13 categories, 4 creators, 3 content items, 3 generated outputs, 10 trend topics, and default settings.

## Railway Deployment

```bash
npm install -g @railway/cli
railway login
railway init
railway add --plugin postgresql
railway variables set MOCK_MODE=false
railway variables set OPENAI_API_KEY=sk-your-key
railway up
railway run npx prisma migrate deploy
railway run npm run db:seed
```

Build command: `prisma generate && next build`
Start command: `next start`

## Architecture

```
src/app/           - Next.js pages and API routes
src/components/    - UI components (shadcn/ui, layout, shared)
src/services/      - AI analysis, generation, ingestion, trends, similarity
src/prompts/       - AI prompt templates
src/lib/           - Database client, utilities, constants
prisma/            - Schema, migrations, seed
tests/             - Unit (Vitest) and e2e (Playwright)
```

## Known Limitations

- Single-user mode (no auth for MVP)
- Similarity uses word-frequency cosine (not neural embeddings)
- Trend data uses mock/RSS (no dedicated trend API)
- Content calendar is view-only
- YouTube transcript extraction may fail for some videos (manual fallback available)
