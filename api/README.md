# Learn with AI - NestJS API

Backend API for the Learn with AI platform, built with NestJS.

## Features

- RESTful API endpoints for AI-powered learning content generation
- Groq AI integration with Llama models
- PostgreSQL database with TypeORM
- Automatic study plan persistence
- Database migrations for safe schema management
- CORS support for frontend integration
- Environment-based configuration
- TypeScript support

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 12+
- Groq API key

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (or copy from `.env.example`):
   ```env
   GROQ_API_KEY=your_api_key_here
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=learn_with_ai
   ```

3. Set up the database:
   ```bash
   # Create the database (if not exists)
   createdb learn_with_ai
   
   # Run migrations to create tables
   npm run migration:run
   ```

## Running the API

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

### POST /api/ai/generate-topics
Generate a list of topics for a learning goal.

**Request Body:**
```json
{
  "prompt": "Learn Python for Data Science",
  "level": "Beginner"
}
```

**Response:**
```json
{
  "topics": ["Topic 1", "Topic 2", ...]
}
```

### POST /api/ai/generate-plan
Generate a comprehensive study plan.

**Request Body:**
```json
{
  "prompt": "Learn Python for Data Science",
  "level": "Beginner",
  "selectedTopics": ["NumPy", "Pandas", "Machine Learning Basics"]
}
```

**Response:**
```json
{
  "title": "Study Plan Title",
  "description": "Plan description",
  "schedule": [...]
}
```

## Project Structure

```
api/
├── src/
│   ├── ai/
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── interfaces/       # TypeScript interfaces
│   │   ├── ai.controller.ts  # API endpoints
│   │   ├── ai.service.ts     # Business logic
│   │   └── ai.module.ts    

### Database Migration Scripts

- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run migration:show` - Show migration status
- `npm run migration:generate -- src/migrations/<Name>` - Generate migration from entity changes
- `npm run migration:create -- src/migrations/<Name>` - Create empty migration

See [MIGRATIONS.md](./MIGRATIONS.md) for detailed migration documentation.  # Module definition
│   ├── app.module.ts         # Root module
│   └── main.ts               # Application entry point
├── .env                      # Environment variables
├── nest-cli.json             # NestJS CLI configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

## Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in watch mode
- `npm run start:prod` - Start production build
- `npm run build` - Build the application
- `npm run lint` - Lint the code
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `DB_NAME` | Database name | learn_with_ai |

## Database

The application uses PostgreSQL with TypeORM for data persistence. When a study plan is generated, it's automatically saved to the database.

### Database Schema

**study_plans** table:
- `id` (UUID) - Primary key
- `title` - Study plan title
- `description` - Plan description
- `prompt` - Original user prompt
- `level` - Difficulty level
- `selectedTopics` - User-selected topics array
- `schedule` - Full plan schedule (JSONB)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Production Deployment

For production deployments, use the deployment scripts:

**Linux/Mac:**
```bash
bash scripts/deploy-production.sh
```

**Windows:**
```powershell
.\scripts\deploy-production.ps1
```

These scripts will:
1. Install production dependencies
2. Build the application
3. Run database migrations
4. Verify migration status

See [MIGRATIONS.md](./MIGRATIONS.md) for more details.
- `npm run test` - Run tests

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Groq API key | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |

## License

MIT
