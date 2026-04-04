# Railway Deployment

## Prerequisites
- Railway CLI installed: `npm install -g @railway/cli`
- Railway account

## Deploy Steps

```bash
# 1. Login
railway login

# 2. Initialize project
railway init

# 3. Add PostgreSQL plugin
railway add --plugin postgresql

# 4. Set environment variables
railway variables set MOCK_MODE=false
railway variables set OPENAI_API_KEY=sk-your-key-here
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)

# 5. Deploy
railway up

# 6. Run migrations
railway run npx prisma migrate deploy

# 7. Seed data (optional)
railway run npm run db:seed
```

## Build/Start Commands
- **Build**: `prisma generate && next build`
- **Start**: `next start`

## Environment Variables
| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Auto (Railway) | Set automatically by PostgreSQL plugin |
| `MOCK_MODE` | Yes | Set to `false` for production |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `NEXTAUTH_SECRET` | Recommended | Auth secret |

## GitHub Actions Auto-Deploy
The CI/CD pipeline in `.github/workflows/ci-deploy.yml` auto-deploys to Railway on push to `main`.

Required GitHub Secrets:
- `RAILWAY_TOKEN` - Railway API token
- `RAILWAY_SERVICE_ID` - Railway service ID

## Redeployment
After changing environment variables:
```bash
railway up
```
