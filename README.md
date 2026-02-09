# Learn with AI

A modern learning platform powered by AI that helps you create personalized study plans and courses.

## Architecture

This project consists of two main parts:
- **Client** (Next.js): Frontend application
- **API** (NestJS): Backend API server

## Features

- **AI-Powered Study Plans**: Generate comprehensive, structured study plans tailored to your goals and experience level
- **Course Creation**: Build custom course structures with modules and lessons
- **Topic Selection**: Choose from AI-generated topics to customize your learning path
- **Beautiful UI**: Clean, responsive design with Tailwind CSS
- **RESTful API**: Dedicated NestJS backend for scalability

## Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with lucide-react icons

### Backend (API)
- **Framework**: NestJS 10
- **Language**: TypeScript
- **AI Integration**: Groq AI with Llama models (@langchain/groq)
- **Architecture**: Modular, controller-service pattern

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Groq API key ([Get one here](https://console.groq.com/keys))

### Installation

1. **Clone the repository**

2. **Set up the API (Backend)**
   ```bash
   cd api
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   
   # Start the API server
   npm run start:dev
   ```
   
   The API will be available at `http://localhost:3001/api`

3. **Set up the Client (Frontend)**
   ```bash
   cd client
   npm install
   
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
   
   # Start the development server
   npm run dev
   ```
   
   The client will be available at `http://localhost:3000`

## Project Structure

```
learn-with-ai/
├── api/                        # NestJS Backend API
│   ├── src/
│   │   ├── ai/
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── interfaces/    # TypeScript interfaces
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.service.ts
│   │   │   └── ai.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                   # API environment variables
│   └── package.json
│
├── client/                    # Next.js Frontend
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AICreationForm.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── CreateCourse.tsx
│   │   ├── CreateStudyPlan.tsx
│   │   ├── Pages.tsx
│   │   └── Sidebar.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── .env.local            # Client environment variables
│   └── package.json
```

## API Endpoints

### POST /api/ai/generate-topics
Generate a list of 20 topics for a learning goal.

**Request:**
```json
{
  "prompt": "Learn Python for Data Science",
  "level": "Beginner"
}
```

**Response:**
```json
{
  "topics": ["NumPy Basics", "Pandas DataFrames", ...]
}
```

### POST /api/ai/generate-plan
Generate a comprehensive study plan.

**Request:**
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
  "title": "Python for Data Science - Beginner Track",
  "description": "A comprehensive 8-week study plan...",
  "schedule": [
    {
      "period": "Week 1",
      "objective": "Master Python fundamentals",
      "topics": [...]
    }
  ]
}
```

## Development

### Running in Development Mode

1. Start the API server (Terminal 1):
   ```bash
   cd api
   npm run start:dev
   ```

2. Start the Next.js client (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```

### Building for Production

**API:**
```bash
cd api
npm run build
npm run start:prod
```

**Client:**
```bash
cd client
npm run build
npm start
```

## Environment Variables

### API (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |

### Client (.env.local)
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:3001 |

## Usage

### Creating a Study Plan

1. Navigate to **Create with AI** > **Study Plans**
2. Enter your learning goal
3. Select your experience level
4. Click "Next: Select Topics" to generate topic suggestions
5. Select topics you want to emphasize
6. Click "Generate Final Plan" to create your personalized study schedule

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
