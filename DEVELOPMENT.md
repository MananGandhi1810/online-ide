# Development Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Docker (optional, for containerized development)

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd leetcode-clone
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory by copying `.env.example`:
```bash
cp .env.example .env
```

Then update the `.env` file with your actual configuration values.

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the frontend directory by copying `.env.example`:
```bash
cp .env.example .env
```

Then update the `.env` file with your actual configuration values.

## Database Setup

### 1. Create PostgreSQL Database

If using PostgreSQL locally:
```bash
createdb leetcode_db
```

Or use Docker:
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_DB=leetcode_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

### 2. Run Prisma Migrations

From the backend directory, run migrations using Prisma v6.5:
```bash
npx prisma@6.5 migrate deploy
```

Or to create a new migration (if schema changes were made):
```bash
npx prisma@6.5 migrate dev --name <migration_name>
```

### 3. Seed the Database

Add initial problem statements to the database:
```bash
npx prisma@6.5 db seed
```

To add new problem statements, update the problem list in `backend/prisma/seed.js` with the new title, difficulty, test cases, and starter code.

Problem descriptions should be written in markdown format so headings, lists, examples, and constraints render correctly in the UI.

### 4. View Database (Optional)

To visually inspect the database:
```bash
npx prisma@6.5 studio
```

This will open Prisma Studio in your browser at `http://localhost:5555`

## Running the Application

### Backend Development Server

From the backend directory:
```bash
npm run dev
```

The backend server will start on `http://localhost:3001`

### Frontend Development Server

From the frontend directory:
```bash
npm run dev
```

The frontend development server will typically start on `http://localhost:5173`

### Both Servers Simultaneously

From the project root, if using a tool like `concurrently`, or open two terminal windows:
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

## Code Formatting

Format code using Prettier:

### Backend
```bash
cd backend
npm run format
```

### Frontend
```bash
cd frontend
npm run format
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

## Docker Setup

### Build Docker Images

Backend:
```bash
cd backend
npm run docker:build
```

### Run with Docker Compose

From the project root:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Backend server
- Frontend server

Stop containers:
```bash
docker-compose down
```

## Useful Prisma Commands

### Update Prisma Schema and Create Migration
```bash
npx prisma@6.5 migrate dev --name <migration_name>
```

### Review Migration History
```bash
npx prisma@6.5 migrate status
```

### Reset Database (WARNING: Destructive)
```bash
npx prisma@6.5 migrate reset
```

### Generate Prisma Client
```bash
npx prisma@6.5 generate
```

## Project Structure

```
leetcode-clone/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   ├── handlers/
│   ├── middlewares/
│   ├── router/
│   ├── utils/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── code-runner/
├── docker-compose.yml
└── README.md
```

## Troubleshooting

### Port Already in Use
If port 3001 or 5173 is already in use:
```bash
# Kill process on macOS/Linux
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists: `psql -c "SELECT 1 FROM pg_database WHERE datname = 'leetcode_db'"`

### Prisma Schema Issues
If you encounter migration conflicts:
```bash
npx prisma@6.5 migrate reset
```

Then re-seed the database:
```bash
npx prisma@6.5 db seed
```

### Node Modules Issues
Clear and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

1. Make changes to backend code or frontend code
2. Backend changes: restart `npm run dev` (nodemon will auto-restart)
3. Frontend changes: hot-reload will automatically update
4. For database schema changes:
   - Update `schema.prisma`
   - Run: `npx prisma@6.5 migrate dev --name <change_description>`
5. Commit changes with meaningful messages

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
