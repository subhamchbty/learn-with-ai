<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12um8YKD8hQ8xMgStMnnsfL5AmYplxpD7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure environment variables in [.env.local](.env.local):
   - `GROQ_API_KEY`: Your Groq API key
   - `BACKEND_API_URL`: Backend API URL (default: http://localhost:3001)
3. Run the app:
   `npm run dev`

## API Architecture

This app uses **Next.js API routes as a proxy** to the backend NestJS API:

- **Client** → Makes requests to Next.js API routes (e.g., `/api/ai/generate-topics`)
- **Next.js API Routes** → Proxies requests to backend NestJS API
- **Backend API** → Processes requests and returns responses

**Benefits:**
- Backend API URL is hidden from the client
- No CORS configuration needed
- Server-side request handling
- Easy to add authentication/authorization layers
