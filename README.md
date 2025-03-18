
# GeoQA UI

BSc Thesis: GeoQA UI, Department of Informatics & Telecommunications, National and Kapodistrian University of Athens (UoA), 2025

## Getting Started

Make sure you have the latest node.js, npm, docker, docker-compose and docker is up and running.
Create a `.env` file at the root of your project:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NLQ_API_URL=http://195.134.71.116:12347/nlq
SPARQL_API_URL=http://195.134.71.116:12347/sparql

# Add anything to these fields, needed in docker-compose.yml
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# Replace ${param} with their actual values from above
# npx drizzle-kit push will render it as a string
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public

JWT_SECRET=
```

### Installation

```bash
npm install
docker-compose up -d

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
