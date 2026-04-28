# Bits and Volts Blog Management System

A full-stack Blog Post Management System built with React, Express, and MongoDB.

## Features

- Blog post CRUD with listing, add, edit, view, and delete flows
- Server-side pagination, search, filtering, and sorting
- Search by title, author, or category
- CSV export for all posts or filtered results
- Responsive desktop table and mobile card list
- Frontend validation with React Hook Form and Zod
- Backend validation and centralized error handling
- MongoDB persistence through Mongoose

## Tech Stack

- Frontend: React, Vite, TypeScript, Material UI, React Router, Axios
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB

## Project Structure

```text
bitsvolts/
  client/     React frontend
  server/     Express REST API
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bitsvolts_blog
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173
NODE_ENV=development
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start MongoDB locally or use a MongoDB Atlas connection string in `server/.env`.

3. Optional: add sample posts:

```bash
npm run seed
```

4. Start both apps:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## API Endpoints

- `GET /api/health`
- `GET /api/posts?page=1&limit=10&search=term&category=Tech&author=Name&status=Published`
- `GET /api/posts/search?query=term&page=1&limit=10`
- `GET /api/posts/export/csv?search=term&category=Tech&status=Published`
- `POST /api/posts`
- `GET /api/posts/:id`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

## Deployment Notes

- Deploy `client` to Vercel or Netlify.
- Deploy `server` to Render, Railway, Heroku, or another Node.js host.
- Set `VITE_API_URL` on the frontend host to the deployed backend URL plus `/api`.
- Set `MONGO_URI`, `CLIENT_ORIGIN`, `PORT`, and `NODE_ENV=production` on the backend host.
