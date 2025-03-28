
# GeoQA UI

BSc Thesis: GeoQA UI, Department of Informatics & Telecommunications, National and Kapodistrian University of Athens (UoA), 2025

## Getting Started

Make sure you have the latest *node.js*, *npm*, *docker*, *docker-compose* and docker is up and running.

### GitHub Provider

1. Go to **Profile** → **Settings** → **Developer Settings** and create a new OAuth app
2. Add to **Homepage URL** http://localhost:3000
3. Add to **Authorization callback URL** http://localhost:3000/auth/github/callback

### Google Provider

1. Go to [Google Cloud Platform](https://console.cloud.google.com/)
2. Create a new project
3. Go to **APIs & Services**
4. Go to **OAuth consent screen** and get started
5. Once done, **Create OAuth client** in **Metrics**
6. Choose **Web Application** in **Application type**
7. Add to **Authorized JavaScript origins** http://localhost:3000
8. Add to **Authorized redirect URIs** http://localhost:3000/auth/google/callback

### Configuration

Create a `.env` file at the root of your project:
```bash
# Development URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# GeoQA engine URLs
NLQ_API_URL=http://195.134.71.116:12347/nlq
SPARQL_API_URL=http://195.134.71.116:12347/sparql

# Add anything to these fields, needed in docker-compose.yml
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# Replace ${param} with their actual values from above
# e.g postgresql://test_user...
# npx drizzle-kit push will render it as a string
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public

# Add anything to these fields
NEXT_PUBLIC_JWT_SECRET=
NEXT_PUBLIC_CSRF_SECRET=

# GitHub OAuth configuration
NEXT_PUBLIC_GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Google OAuth configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Installation

```bash
npm install
docker-compose up -d

# (Wait 30s or the required time so it won't fail)
# Expect success if docker is up and running
npx drizzle-kit push

# Development mode
npm run dev
# Production mode
npm run build && npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

If viewing app in production mode, if strict csp is enabled in code, there will be some errors in the console from `ThemeProvider` and when interacting with it and from every `next/image` as it has inline width and height styles.
