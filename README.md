# Fullstack Challenge

## Setup Instructions

### Database (PostgreSQL)
- Ensure PostgreSQL is running
- Run migrations (if needed)
1. Navigate to `apps/backend`
2. npx prisma db push
3. npx prisma generate

### Backend (NestJS API)
1. Navigate to `apps/backend`
2. Install dependencies: `yarn install`
3. Set up the database in `.env`
4. Start the server: `yarn start:dev`

### Frontend (Next.js)
1. Navigate to `apps/frontend`
2. Install dependencies: `yarn install`
3. Start the development server: `yarn dev`


### Assumptions
- Using PostgreSQL for storage
- Frontend consumes API via `NEXT_PUBLIC_API_URL`
