# Testing Guide

## Test Stack
- **Unit Tests**: Vitest + jsdom
- **E2E Tests**: Playwright (Desktop Chrome + Mobile Safari)

## Running Tests

```bash
# Unit tests
npm test                    # Run once
npm run test:watch          # Watch mode

# E2E tests
npm run test:e2e            # Headless
npm run test:e2e:headed     # With browser visible
npm run test:e2e:debug      # Debug mode with inspector

# Install Playwright browsers (first time)
npx playwright install --with-deps chromium
```

## Unit Tests (`tests/unit/`)
- `similarity.test.ts` - Cosine similarity tokenization and scoring
- `youtube.test.ts` - YouTube URL parsing and video ID extraction
- `constants.test.ts` - Constants integrity checks

## E2E Tests (`tests/e2e/`)
- `smoke.spec.ts` - 5 scenarios, 20+ test cases:
  1. Navigation & Dashboard
  2. Inbox Content Processing
  3. Library Search & Filter
  4. Generate Content
  5. Trends & Settings

## Mock Mode
Set `MOCK_MODE="true"` in `.env` to run all tests without external APIs. All AI, YouTube, OCR, and trend services return deterministic mock data.

## Screenshots & Traces
Playwright saves artifacts on failure:
- Screenshots: `test-results/`
- Traces: `test-results/` (viewable with `npx playwright show-trace`)
- Reports: `playwright-report/`

## CI
GitHub Actions runs tests automatically on push. See `.github/workflows/ci-deploy.yml`.
